import React from 'react';

interface SafeMarkdownProps {
  content: string;
  className?: string;
}

// Safely sanitize URLs against XSS (e.g. javascript: schemes)
function sanitizeUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (/^javascript:/i.test(trimmed) || /^vbscript:/i.test(trimmed) || /^data:text\/html/i.test(trimmed)) {
    return '#';
  }
  return trimmed;
}

// Helper to parse inline markdown (bold, italic, code, link, image, strikethrough)
function parseInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let remaining = text;
  let keyIndex = 0;

  // Regex for image: ![alt](url)
  // Regex for link: [text](url)
  // Regex for inline code: `code`
  // Regex for bold: **text** or __text__
  // Regex for italic: *text* or _text_
  // Regex for strikethrough: ~~text~~
  const tokenRegex = /(!\[(.*?)\]\((.*?)\))|(\[(.*?)\]\((.*?)\))|(`([^`]+)`)|\*\*([^*]+)\*\*|__([^_]+)__|~~([^~]+)~~|\*([^*]+)\*|_([^_]+)_/;

  while (remaining.length > 0) {
    const match = remaining.match(tokenRegex);
    if (!match || match.index === undefined) {
      nodes.push(remaining);
      break;
    }

    // Push text before match
    if (match.index > 0) {
      nodes.push(remaining.slice(0, match.index));
    }

    const matchedStr = match[0];

    if (matchedStr.startsWith('![')) {
      // Image: ![alt](url)
      const alt = match[2] || '';
      const src = sanitizeUrl(match[3] || '');
      nodes.push(
        <img
          key={`img-${keyIndex++}`}
          src={src}
          alt={alt}
          className="rounded-lg max-w-full h-auto my-3 border border-slate-200 shadow-2xs"
          loading="lazy"
        />
      );
    } else if (matchedStr.startsWith('[')) {
      // Link: [text](url)
      const linkText = match[5] || '';
      const href = sanitizeUrl(match[6] || '');
      nodes.push(
        <a
          key={`link-${keyIndex++}`}
          href={href}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="text-emerald-700 hover:text-emerald-800 underline font-medium transition-colors"
        >
          {linkText}
        </a>
      );
    } else if (matchedStr.startsWith('`')) {
      // Inline code
      const code = match[8] || '';
      nodes.push(
        <code
          key={`code-${keyIndex++}`}
          className="px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-800 text-xs font-mono font-medium border border-slate-200"
        >
          {code}
        </code>
      );
    } else if (matchedStr.startsWith('**') || matchedStr.startsWith('__')) {
      // Bold
      const boldText = match[9] || match[10] || '';
      nodes.push(
        <strong key={`bold-${keyIndex++}`} className="font-semibold text-slate-900">
          {boldText}
        </strong>
      );
    } else if (matchedStr.startsWith('~~')) {
      // Strikethrough
      const strikeText = match[11] || '';
      nodes.push(
        <del key={`del-${keyIndex++}`} className="line-through text-slate-400">
          {strikeText}
        </del>
      );
    } else if (matchedStr.startsWith('*') || matchedStr.startsWith('_')) {
      // Italic
      const italicText = match[12] || match[13] || '';
      nodes.push(
        <em key={`em-${keyIndex++}`} className="italic">
          {italicText}
        </em>
      );
    }

    remaining = remaining.slice(match.index + matchedStr.length);
  }

  return nodes;
}

export const SafeMarkdown: React.FC<SafeMarkdownProps> = ({ content, className = '' }) => {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let index = 0;

  let inCodeBlock = false;
  let codeBlockLines: string[] = [];
  let codeBlockLang = '';

  let listType: 'ul' | 'ol' | null = null;
  let listItems: React.ReactNode[] = [];

  let inTable = false;
  let tableHeader: string[] = [];
  let tableRows: string[][] = [];

  const flushList = () => {
    if (listType && listItems.length > 0) {
      if (listType === 'ul') {
        elements.push(
          <ul key={`ul-${index++}`} className="list-disc list-outside pl-5 space-y-1.5 my-3 text-slate-700">
            {listItems.map((item, idx) => (
              <li key={`li-${idx}`}>{item}</li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol key={`ol-${index++}`} className="list-decimal list-outside pl-5 space-y-1.5 my-3 text-slate-700">
            {listItems.map((item, idx) => (
              <li key={`li-${idx}`}>{item}</li>
            ))}
          </ol>
        );
      }
      listType = null;
      listItems = [];
    }
  };

  const flushTable = () => {
    if (inTable) {
      elements.push(
        <div key={`table-${index++}`} className="my-4 overflow-x-auto border border-slate-200 rounded-lg">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            {tableHeader.length > 0 && (
              <thead className="bg-slate-50">
                <tr>
                  {tableHeader.map((th, thIdx) => (
                    <th key={`th-${thIdx}`} className="px-4 py-2 text-left font-semibold text-slate-800">
                      {parseInline(th.trim())}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-slate-100 bg-white">
              {tableRows.map((row, rIdx) => (
                <tr key={`tr-${rIdx}`} className="hover:bg-slate-50/50">
                  {row.map((cell, cIdx) => (
                    <td key={`td-${cIdx}`} className="px-4 py-2 text-slate-700">
                      {parseInline(cell.trim())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      inTable = false;
      tableHeader = [];
      tableRows = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Check code blocks
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        // End code block
        elements.push(
          <pre
            key={`code-block-${index++}`}
            className="my-3 p-4 bg-slate-900 text-slate-100 font-mono text-xs rounded-lg overflow-x-auto border border-slate-800"
          >
            <code>{codeBlockLines.join('\n')}</code>
          </pre>
        );
        inCodeBlock = false;
        codeBlockLines = [];
        codeBlockLang = '';
      } else {
        flushList();
        flushTable();
        inCodeBlock = true;
        codeBlockLang = trimmed.replace(/^```/, '').trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(rawLine);
      continue;
    }

    // Check Table
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      flushList();
      const cells = trimmed
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim());

      // Check if it's separator line (e.g. |---|---|)
      const isSeparator = cells.every((c) => /^:?-+:?$/.test(c));
      if (isSeparator) {
        continue;
      }

      if (!inTable) {
        inTable = true;
        tableHeader = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Check lists
    const ulMatch = rawLine.match(/^(\s*)[-*]\s+(.*)$/);
    if (ulMatch) {
      if (listType !== 'ul') {
        flushList();
        listType = 'ul';
      }
      listItems.push(parseInline(ulMatch[2]));
      continue;
    }

    const olMatch = rawLine.match(/^(\s*)\d+\.\s+(.*)$/);
    if (olMatch) {
      if (listType !== 'ol') {
        flushList();
        listType = 'ol';
      }
      listItems.push(parseInline(olMatch[2]));
      continue;
    }

    // Not a list item
    flushList();

    // Empty line
    if (!trimmed) {
      continue;
    }

    // Horizontal Rule
    if (/^---{2,}$/.test(trimmed) || /^\*\*\*{2,}$/.test(trimmed)) {
      elements.push(<hr key={`hr-${index++}`} className="my-5 border-slate-200" />);
      continue;
    }

    // Headings
    if (trimmed.startsWith('#### ')) {
      elements.push(
        <h4 key={`h4-${index++}`} className="text-base font-semibold text-slate-900 mt-4 mb-2">
          {parseInline(trimmed.replace(/^####\s+/, ''))}
        </h4>
      );
      continue;
    }
    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${index++}`} className="text-lg font-bold text-slate-900 mt-5 mb-2">
          {parseInline(trimmed.replace(/^###\s+/, ''))}
        </h3>
      );
      continue;
    }
    if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${index++}`} className="text-xl font-bold text-slate-900 mt-6 mb-3 border-b border-slate-100 pb-1.5">
          {parseInline(trimmed.replace(/^##\s+/, ''))}
        </h2>
      );
      continue;
    }
    if (trimmed.startsWith('# ')) {
      elements.push(
        <h1 key={`h1-${index++}`} className="text-2xl font-extrabold text-slate-900 mt-6 mb-3">
          {parseInline(trimmed.replace(/^#\s+/, ''))}
        </h1>
      );
      continue;
    }

    // Blockquote
    if (trimmed.startsWith('>')) {
      const quoteText = trimmed.replace(/^>\s*/, '');
      elements.push(
        <blockquote
          key={`quote-${index++}`}
          className="border-l-4 border-emerald-500 pl-4 py-1.5 my-3 italic text-slate-600 bg-emerald-50/40 rounded-r-sm"
        >
          {parseInline(quoteText)}
        </blockquote>
      );
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={`p-${index++}`} className="my-2.5 leading-relaxed text-slate-700">
        {parseInline(trimmed)}
      </p>
    );
  }

  flushList();
  flushTable();

  return <div className={`safe-markdown leading-relaxed ${className}`}>{elements}</div>;
};
