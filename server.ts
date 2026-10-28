import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { AIGroundingTools } from './src/services/ai/aiGroundingTools';
import { AIGuardrails } from './src/services/ai/aiGuardrails';
import { RuleBasedFallbackAIService } from './src/services/ai/ruleBasedFallbackService';
import { AuthSessionContext } from './src/services/ai/aiTypes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '2mb' }));

// Initialize shared Rule-Based Fallback
const fallbackService = new RuleBasedFallbackAIService();

// Initialize GoogleGenAI client (if GEMINI_API_KEY is available)
let genAIClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  genAIClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

/**
 * Health check endpoint
 */
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    mode: genAIClient ? 'gemini_flash' : 'rule_fallback'
  });
});

/**
 * Tool definitions exposed to Gemini models
 */
const geminiTools = [
  {
    functionDeclarations: [
      {
        name: 'getMyAttendance',
        description: 'Retrieve course attendance rates and collegiate compliance for the authenticated session user.',
        parameters: { type: 'OBJECT', properties: {} }
      },
      {
        name: 'getMyRoutine',
        description: 'Retrieve weekly course schedule, rooms, and class times for the authenticated session user.',
        parameters: { type: 'OBJECT', properties: {} }
      },
      {
        name: 'getMyPublishedResults',
        description: 'Retrieve officially published semester examination grades, SGPA, and cumulative CGPA. Unpublished grades are never returned.',
        parameters: { type: 'OBJECT', properties: {} }
      },
      {
        name: 'getMyApplications',
        description: 'Retrieve tracking status and review progress for submitted paperless applications.',
        parameters: { type: 'OBJECT', properties: {} }
      },
      {
        name: 'getMyFeeStatus',
        description: 'Retrieve student tuition, examination, and semester dues clearance status.',
        parameters: { type: 'OBJECT', properties: {} }
      },
      {
        name: 'getLatestNotices',
        description: 'Retrieve recent official university notices, examination circulars, and announcements.',
        parameters: { type: 'OBJECT', properties: {} }
      },
      {
        name: 'getApplicationRequirements',
        description: 'Retrieve official policy, required documents, fee, and processing time for application types.',
        parameters: {
          type: 'OBJECT',
          properties: {
            applicationType: {
              type: 'STRING',
              description: 'Type: transcript, certificate, testimonial, leave, course_withdrawal, scholarship, clearance, exam_permission'
            }
          }
        }
      },
      {
        name: 'getUniversityInfo',
        description: 'Retrieve official JSTU campus facts, faculties, academic departments, and key administrative offices.',
        parameters: { type: 'OBJECT', properties: {} }
      }
    ]
  }
];

/**
 * Dispatch tool calls strictly using the session context
 */
function executeToolCall(
  toolName: string,
  args: Record<string, unknown>,
  session: AuthSessionContext
): { result: unknown; sourceKey: string } {
  switch (toolName) {
    case 'getMyAttendance':
      return { result: AIGroundingTools.getMyAttendance(session), sourceKey: 'attendance' };
    case 'getMyRoutine':
      return { result: AIGroundingTools.getMyRoutine(session), sourceKey: 'routine' };
    case 'getMyPublishedResults':
      return { result: AIGroundingTools.getMyPublishedResults(session), sourceKey: 'published_results' };
    case 'getMyApplications':
      return { result: AIGroundingTools.getMyApplications(session), sourceKey: 'applications' };
    case 'getMyFeeStatus':
      return { result: AIGroundingTools.getMyFeeStatus(session), sourceKey: 'fee_status' };
    case 'getLatestNotices':
      return { result: AIGroundingTools.getLatestNotices(session), sourceKey: 'notices' };
    case 'getApplicationRequirements':
      return {
        result: AIGroundingTools.getApplicationRequirements(session, String(args?.applicationType || '')),
        sourceKey: 'application_policies'
      };
    case 'getUniversityInfo':
      return { result: AIGroundingTools.getUniversityInfo(session), sourceKey: 'university_info' };
    default:
      throw new Error(`Unrecognized tool call: ${toolName}`);
  }
}

/**
 * AI Assistant Chat Proxy Route
 * Real enforcement must move to Firestore rules / Cloud Functions.
 */
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { message, history, session, lang } = req.body;

  if (!session || !session.uid || !session.role) {
    res.status(401).json({ error: 'Unauthorized: Session is required.' });
    return;
  }

  // 1. Sanitize input
  const sanitized = AIGuardrails.sanitizeInput(message);
  if (sanitized.error && sanitized.text.length === 0) {
    res.status(400).json({ error: sanitized.error });
    return;
  }

  // 2. Check user quota (30 messages per hour)
  const quota = AIGuardrails.checkAndIncrementQuota(session.uid);
  if (!quota.allowed) {
    res.status(429).json({
      reply: quota.errorMessage,
      isFallback: true,
      sources: [],
      toolsUsed: []
    });
    return;
  }

  // 3. Attempt Gemini API call if client is available
  if (genAIClient) {
    try {
      const systemInstruction = AIGuardrails.getSystemInstruction(
        session.role,
        session.fullName,
        lang || 'en'
      );

      // Build conversation contents
      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text?: string }> }> = [];

      if (Array.isArray(history)) {
        for (const item of history.slice(-4)) {
          contents.push({
            role: item.sender === 'user' ? 'user' : 'model',
            parts: [{ text: item.text }]
          });
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: sanitized.text }]
      });

      // Call Gemini 3.8 Flash with tools
      const response = await genAIClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          tools: geminiTools as any,
          temperature: 0.2
        }
      });

      const toolsUsed: string[] = [];
      const sources: string[] = [];

      // Check if function calls were requested
      if (response.functionCalls && response.functionCalls.length > 0) {
        const functionResponses = [];

        for (const call of response.functionCalls) {
          toolsUsed.push(call.name);
          const { result, sourceKey } = executeToolCall(call.name, call.args || {}, session);
          sources.push(sourceKey);

          functionResponses.push({
            name: call.name,
            response: { output: result }
          });
        }

        // Log audit trail: timestamp, role, tools called. Never message contents!
        AIGuardrails.logAIAssistantUsage(session.uid, session.role, toolsUsed);

        // Send function responses back to model for final grounded synthesis
        const followUpContents = [
          ...contents,
          {
            role: 'model' as const,
            parts: response.functionCalls.map(f => ({
              functionCall: { name: f.name, args: f.args }
            }))
          },
          {
            role: 'user' as const,
            parts: functionResponses.map(fr => ({
              functionResponse: {
                name: fr.name,
                response: fr.response
              }
            }))
          }
        ];

        const followUpResponse = await genAIClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: followUpContents as any,
          config: {
            systemInstruction,
            temperature: 0.2
          }
        });

        const reply = followUpResponse.text || 'Information retrieved successfully.';
        res.json({
          reply,
          sources: Array.from(new Set(sources)),
          isFallback: false,
          toolsUsed
        });
        return;
      }

      // If no function call, return direct reply
      if (response.text) {
        res.json({
          reply: response.text,
          sources: [],
          isFallback: false,
          toolsUsed: []
        });
        return;
      }
    } catch {
      // If model fails or rate limits, fall through to deterministic fallback
    }
  }

  // 4. Deterministic Fallback Mode
  const fallbackResult = await fallbackService.sendMessage(
    sanitized.text,
    history || [],
    session,
    lang || 'en'
  );

  res.json(fallbackResult);
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    // Dynamic import vite for dev mode
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[JSTU Smart Campus] Server running on http://0.0.0.0:${PORT}`);
  });
}

// Start server if executed directly
if (process.env.NODE_ENV !== 'test') {
  startServer().catch(err => {
    console.error('Failed to start server:', err);
  });
}

export default app;
