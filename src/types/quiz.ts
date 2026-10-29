export type QuizQuestionType = 'MCQ' | 'SHORT_ANSWER';

export interface QuizMCQOption {
  id: string; // 'opt_a', 'opt_b', etc.
  text: string;
  textBn?: string;
}

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  prompt: string;
  promptBn?: string;
  points: number;
  options?: QuizMCQOption[]; // Only for MCQ
  correctOptionId?: string; // Only for MCQ, hidden from student until quiz closed
  rubricHint?: string; // Guidelines for short answer grading
  explanation?: string; // Educational explanation revealed after quiz closes
}

export interface Quiz {
  id: string;
  courseCode: string;
  courseTitle: string;
  departmentId: string;
  title: string;
  titleBn?: string;
  description: string;
  descriptionBn?: string;
  teacherId: string;
  teacherName: string;
  timeLimitMinutes: number; // e.g. 15, 20
  totalMarks: number;
  openTime: string; // ISO date string
  closeTime: string; // ISO date string
  shuffleQuestions: boolean;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface StudentQuizAnswer {
  questionId: string;
  selectedOptionId?: string; // For MCQ
  shortAnswerText?: string; // For SHORT_ANSWER
  isAutoGraded?: boolean;
  autoScore?: number;
  teacherScore?: number;
  teacherFeedback?: string;
  updatedAt?: string;
}

export interface StudentQuizAttempt {
  id: string;
  quizId: string;
  courseCode: string;
  studentId: string;
  studentName: string;
  startedAt: string;
  submittedAt?: string;
  isSubmitted: boolean;
  answers: Record<string, StudentQuizAnswer>;
  autoScore: number;
  manualScore?: number;
  totalScore?: number;
  isFullyGraded: boolean;
  syncedToContinuousAssessment?: boolean;
}

export interface QuestionDifficultyStat {
  questionId: string;
  prompt: string;
  type: QuizQuestionType;
  points: number;
  totalAttempts: number;
  correctOrHighScoreCount: number;
  successRate: number; // 0 - 100%
  difficultyLabel: 'Easy' | 'Moderate' | 'Challenging';
}

export interface QuizResultAnalytics {
  quizId: string;
  totalAttempts: number;
  highestScore: number;
  lowestScore: number;
  averageScore: number;
  questionStats: QuestionDifficultyStat[];
}
