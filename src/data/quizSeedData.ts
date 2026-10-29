import { Quiz, StudentQuizAttempt } from '../types/quiz';

export const INITIAL_DEMO_QUIZZES: Quiz[] = [
  {
    id: 'quiz-cse-3201-active',
    courseCode: 'CSE-3201',
    courseTitle: 'Compiler Design & Construction',
    departmentId: 'CSE',
    title: 'Lexical Analysis & DFA Construction Quiz',
    titleBn: 'লেক্সিক্যাল অ্যানালাইসিস ও ডিএফএ কুইজ',
    description: 'Timed assessment covering Regular Expressions, NFA to DFA conversion, and Lexer Tokenization.',
    descriptionBn: 'রেগুলার এক্সপ্রেশন, ডিএফএ রূপান্তর এবং লেক্সিক্যাল টোকেনাইজেশনের উপর নির্ধারিত সময়ের কুইজ।',
    teacherId: 'teacher_shahadat',
    teacherName: 'Dr. Shahadat Hossain',
    timeLimitMinutes: 15,
    totalMarks: 20,
    // Open from 2 hours ago until tomorrow evening
    openTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    closeTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    shuffleQuestions: true,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    questions: [
      {
        id: 'q1',
        type: 'MCQ',
        prompt: 'Which phase of the compiler translates source character streams into a sequence of meaningful tokens?',
        promptBn: 'কম্পাইলারের কোন ধাপে সোর্স কোডের ক্যারেক্টার স্ট্রিমকে অর্থপূর্ণ টোকেনে রূপান্তরিত করা হয়?',
        points: 4,
        options: [
          { id: 'opt_a', text: 'Syntax Analysis (Parser)' },
          { id: 'opt_b', text: 'Lexical Analysis (Scanner)' },
          { id: 'opt_c', text: 'Semantic Analysis' },
          { id: 'opt_d', text: 'Code Optimizer' }
        ],
        correctOptionId: 'opt_b',
        explanation: 'Lexical Analysis (Scanner) scans the source text and converts character streams into tokens according to lexical rules.'
      },
      {
        id: 'q2',
        type: 'MCQ',
        prompt: 'What theoretical automaton model is directly implemented by lex/flex for token recognition?',
        promptBn: 'টোকেন শনাক্তকরণের জন্য lex/flex সরাসরি কোন তাত্ত্বিক অটোমেটা মডেল বাস্তবায়ন করে?',
        points: 4,
        options: [
          { id: 'opt_a', text: 'Deterministic Finite Automaton (DFA)' },
          { id: 'opt_b', text: 'Pushdown Automaton (PDA)' },
          { id: 'opt_c', text: 'Turing Machine' },
          { id: 'opt_d', text: 'Linear Bounded Automaton' }
        ],
        correctOptionId: 'opt_a',
        explanation: 'Lex converts regular expressions to NFAs and subsequently to DFAs for high-speed linear O(n) token matching.'
      },
      {
        id: 'q3',
        type: 'MCQ',
        prompt: 'Which regular expression correctly defines C-style identifiers that start with an underscore or letter, followed by alphanumeric characters or underscores?',
        promptBn: 'কোন রেগুলার এক্সপ্রেশনটি সি ভাষার আইডেন্টিফায়ারের সঠিক নিয়ম নির্দেশ করে?',
        points: 4,
        options: [
          { id: 'opt_a', text: '[0-9][a-zA-Z0-9]*' },
          { id: 'opt_b', text: '[a-zA-Z_][a-zA-Z0-9_]*' },
          { id: 'opt_c', text: '[_][a-zA-Z0-9]+' },
          { id: 'opt_d', text: '[a-zA-Z]+[0-9]*' }
        ],
        correctOptionId: 'opt_b',
        explanation: 'Identifiers must begin with a letter or underscore, followed by zero or more letters, digits, or underscores.'
      },
      {
        id: 'q4',
        type: 'SHORT_ANSWER',
        prompt: 'Briefly explain the principle difference between a Token, a Pattern, and a Lexeme with a short example.',
        promptBn: 'সংক্ষেপে টোকেন, প্যাটার্ন এবং লেক্সিমের মধ্যকার পার্থক্য একটি উদাহরণের মাধ্যমে ব্যাখ্যা করুন।',
        points: 8,
        rubricHint: 'Token is the abstract unit (e.g. <id, 1>), Lexeme is the actual matched string (e.g. "counter"), and Pattern is the formal rule/regex defining it.',
        explanation: 'A lexeme is the instance of source code characters matching a pattern (e.g., "count"). A token is the pair <token-name, optional-attribute> returned to the parser. A pattern is the regex describing lexemes.'
      }
    ]
  },
  {
    id: 'quiz-cse-3205-closed',
    courseCode: 'CSE-3205',
    courseTitle: 'Software Engineering & Design Patterns',
    departmentId: 'CSE',
    title: 'SOLID Principles & Creational Design Patterns',
    titleBn: 'সলিড প্রিন্সিপলস ও ক্রিয়েশনাল ডিজাইন প্যাটার্নস',
    description: 'Comprehensive quiz on Single Responsibility, Dependency Inversion, Factory and Singleton patterns.',
    descriptionBn: 'সিঙ্গেল রেসপন্সিবিলিটি, ডিপেন্ডেন্সি ইনভার্সন এবং ফ্যাক্টরি প্যাটার্নের উপর সম্পূর্ণ কুইজ।',
    teacherId: 'teacher_shahadat',
    teacherName: 'Dr. Shahadat Hossain',
    timeLimitMinutes: 20,
    totalMarks: 20,
    // Closed 3 days ago
    openTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    closeTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    shuffleQuestions: false,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    questions: [
      {
        id: 'q_solid_1',
        type: 'MCQ',
        prompt: 'Which SOLID principle states that high-level modules should not depend on low-level modules, but both should depend on abstractions?',
        promptBn: 'কোন সলিড নীতি অনুযায়ী হাই-লেভেল মডিউল লো-লেভেল মডিউলের উপর নির্ভর না করে উভয়েই অ্যাবস্ট্রাকশনের উপর নির্ভর করবে?',
        points: 4,
        options: [
          { id: 'opt_s', text: 'Single Responsibility Principle (SRP)' },
          { id: 'opt_o', text: 'Open/Closed Principle (OCP)' },
          { id: 'opt_l', text: 'Liskov Substitution Principle (LSP)' },
          { id: 'opt_d', text: 'Dependency Inversion Principle (DIP)' }
        ],
        correctOptionId: 'opt_d',
        explanation: 'Dependency Inversion Principle (DIP) decouples software modules using abstract interfaces rather than concrete class couplings.'
      },
      {
        id: 'q_solid_2',
        type: 'MCQ',
        prompt: 'Which design pattern guarantees that a class has only one instance while providing a global access point to this instance?',
        promptBn: 'কোন ডিজাইন প্যাটার্ন একটি ক্লাসের কেবল একটি ইনস্ট্যান্স থাকা নিশ্চিত করে এবং সার্বজনীন অ্যাক্সেস প্রদান করে?',
        points: 4,
        options: [
          { id: 'opt_a', text: 'Singleton Pattern' },
          { id: 'opt_b', text: 'Abstract Factory' },
          { id: 'opt_c', text: 'Prototype Pattern' },
          { id: 'opt_d', text: 'Builder Pattern' }
        ],
        correctOptionId: 'opt_a',
        explanation: 'Singleton restricts instantiation to a single object, commonly used for database connection pools and logging systems.'
      },
      {
        id: 'q_solid_3',
        type: 'MCQ',
        prompt: 'In the Factory Method pattern, where is the actual instantiation of concrete product classes deferred to?',
        promptBn: 'ফ্যাক্টরি মেথড প্যাটার্নে অবজেক্ট তৈরির দায়িত্ব কোথায় স্থগিত রাখা হয়?',
        points: 4,
        options: [
          { id: 'opt_a', text: 'The Client caller' },
          { id: 'opt_b', text: 'Subclasses' },
          { id: 'opt_c', text: 'Static utility methods' },
          { id: 'opt_d', text: 'Global configuration variables' }
        ],
        correctOptionId: 'opt_b',
        explanation: 'Factory Method defines an interface for creating an object, but lets subclasses decide which class to instantiate.'
      },
      {
        id: 'q_solid_4',
        type: 'SHORT_ANSWER',
        prompt: 'Illustrate how violating the Open/Closed Principle (OCP) leads to software fragility during maintenance.',
        promptBn: 'ওপেন/ক্লোজড নীতি ভঙ্গ করলে সফটওয়্যার রক্ষণাবেক্ষণে কীভাবে সমস্যা তৈরি হয় তা সংক্ষেপে বুঝিয়ে লিখুন।',
        points: 8,
        rubricHint: 'Look for: modification of existing tested code vs extension via polymorphism/interfaces, risking regression bugs.',
        explanation: 'Modifying existing classes to add new behaviors introduces regression bugs into stable production components. OCP encourages extension via interfaces or polymorphism without editing core files.'
      }
    ]
  }
];

export const INITIAL_DEMO_ATTEMPTS: StudentQuizAttempt[] = [
  // Finished attempt for CSE-3205 by Tanvir Ahmed
  {
    id: 'att-tanvir-cse3205',
    quizId: 'quiz-cse-3205-closed',
    courseCode: 'CSE-3205',
    studentId: 'JSTU2026001',
    studentName: 'Tanvir Ahmed',
    startedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 12 * 60 * 1000).toISOString(),
    isSubmitted: true,
    answers: {
      q_solid_1: {
        questionId: 'q_solid_1',
        selectedOptionId: 'opt_d',
        isAutoGraded: true,
        autoScore: 4
      },
      q_solid_2: {
        questionId: 'q_solid_2',
        selectedOptionId: 'opt_a',
        isAutoGraded: true,
        autoScore: 4
      },
      q_solid_3: {
        questionId: 'q_solid_3',
        selectedOptionId: 'opt_b',
        isAutoGraded: true,
        autoScore: 4
      },
      q_solid_4: {
        questionId: 'q_solid_4',
        shortAnswerText: 'When OCP is violated, developers modify already working and tested classes to add new features. This causes cascading bugs across the codebase and breaks backward compatibility.',
        teacherScore: 7,
        teacherFeedback: 'Excellent distinction between extension vs modification. Concrete reasoning on regression risks.'
      }
    },
    autoScore: 12,
    manualScore: 7,
    totalScore: 19,
    isFullyGraded: true,
    syncedToContinuousAssessment: true
  },
  // Other student attempts for CSE-3205 to populate difficulty stats
  {
    id: 'att-st2-cse3205',
    quizId: 'quiz-cse-3205-closed',
    courseCode: 'CSE-3205',
    studentId: 'JSTU2026002',
    studentName: 'Sadia Rahman',
    startedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 14 * 60 * 1000).toISOString(),
    isSubmitted: true,
    answers: {
      q_solid_1: { questionId: 'q_solid_1', selectedOptionId: 'opt_d', isAutoGraded: true, autoScore: 4 },
      q_solid_2: { questionId: 'q_solid_2', selectedOptionId: 'opt_a', isAutoGraded: true, autoScore: 4 },
      q_solid_3: { questionId: 'q_solid_3', selectedOptionId: 'opt_a', isAutoGraded: true, autoScore: 0 },
      q_solid_4: {
        questionId: 'q_solid_4',
        shortAnswerText: 'OCP means open for extension and closed for modification. Changing existing classes can cause unit tests to fail.',
        teacherScore: 6,
        teacherFeedback: 'Good summary, but needed more technical detail on polymorphism.'
      }
    },
    autoScore: 8,
    manualScore: 6,
    totalScore: 14,
    isFullyGraded: true,
    syncedToContinuousAssessment: true
  },
  {
    id: 'att-st3-cse3205',
    quizId: 'quiz-cse-3205-closed',
    courseCode: 'CSE-3205',
    studentId: 'JSTU2026003',
    studentName: 'Mehedi Hasan',
    startedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 16 * 60 * 1000).toISOString(),
    isSubmitted: true,
    answers: {
      q_solid_1: { questionId: 'q_solid_1', selectedOptionId: 'opt_d', isAutoGraded: true, autoScore: 4 },
      q_solid_2: { questionId: 'q_solid_2', selectedOptionId: 'opt_a', isAutoGraded: true, autoScore: 4 },
      q_solid_3: { questionId: 'q_solid_3', selectedOptionId: 'opt_b', isAutoGraded: true, autoScore: 4 },
      q_solid_4: {
        questionId: 'q_solid_4',
        shortAnswerText: 'Violating OCP forces re-testing of unchanged features and tight coupling with concrete implementations.',
        teacherScore: 8,
        teacherFeedback: 'Full marks. Very crisp illustration.'
      }
    },
    autoScore: 12,
    manualScore: 8,
    totalScore: 20,
    isFullyGraded: true,
    syncedToContinuousAssessment: true
  },
  {
    id: 'att-st4-cse3205',
    quizId: 'quiz-cse-3205-closed',
    courseCode: 'CSE-3205',
    studentId: 'JSTU2026004',
    studentName: 'Nusrat Jahan',
    startedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(),
    isSubmitted: true,
    answers: {
      q_solid_1: { questionId: 'q_solid_1', selectedOptionId: 'opt_s', isAutoGraded: true, autoScore: 0 },
      q_solid_2: { questionId: 'q_solid_2', selectedOptionId: 'opt_a', isAutoGraded: true, autoScore: 4 },
      q_solid_3: { questionId: 'q_solid_3', selectedOptionId: 'opt_b', isAutoGraded: true, autoScore: 4 },
      q_solid_4: {
        questionId: 'q_solid_4',
        shortAnswerText: 'It breaks existing functions when new conditions are added with multiple if-else statements.',
        teacherScore: 5,
        teacherFeedback: 'Identified the switch/if-else smell correctly.'
      }
    },
    autoScore: 8,
    manualScore: 5,
    totalScore: 13,
    isFullyGraded: true,
    syncedToContinuousAssessment: false
  },
  // Submissions for active quiz CSE-3201 by other students (Tanvir hasn't taken it yet, so student can take it live!)
  {
    id: 'att-st2-cse3201',
    quizId: 'quiz-cse-3201-active',
    courseCode: 'CSE-3201',
    studentId: 'JSTU2026002',
    studentName: 'Sadia Rahman',
    startedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    submittedAt: new Date(Date.now() - 48 * 60 * 1000).toISOString(),
    isSubmitted: true,
    answers: {
      q1: { questionId: 'q1', selectedOptionId: 'opt_b', isAutoGraded: true, autoScore: 4 },
      q2: { questionId: 'q2', selectedOptionId: 'opt_a', isAutoGraded: true, autoScore: 4 },
      q3: { questionId: 'q3', selectedOptionId: 'opt_b', isAutoGraded: true, autoScore: 4 },
      q4: {
        questionId: 'q4',
        shortAnswerText: 'Lexeme is the actual string like total_sum, token is the category ID, and pattern is the regular expression matching it.',
        teacherScore: 7,
        teacherFeedback: 'Accurate distinction.'
      }
    },
    autoScore: 12,
    manualScore: 7,
    totalScore: 19,
    isFullyGraded: true,
    syncedToContinuousAssessment: false
  },
  {
    id: 'att-st3-cse3201',
    quizId: 'quiz-cse-3201-active',
    courseCode: 'CSE-3201',
    studentId: 'JSTU2026003',
    studentName: 'Mehedi Hasan',
    startedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    submittedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    isSubmitted: true,
    answers: {
      q1: { questionId: 'q1', selectedOptionId: 'opt_b', isAutoGraded: true, autoScore: 4 },
      q2: { questionId: 'q2', selectedOptionId: 'opt_b', isAutoGraded: true, autoScore: 0 },
      q3: { questionId: 'q3', selectedOptionId: 'opt_b', isAutoGraded: true, autoScore: 4 },
      q4: {
        questionId: 'q4',
        shortAnswerText: 'Tokens are symbols sent to parser. Lexeme is the raw code word. Pattern is the rule.',
        teacherScore: 6,
        teacherFeedback: 'Concise and correct.'
      }
    },
    autoScore: 8,
    manualScore: 6,
    totalScore: 14,
    isFullyGraded: true,
    syncedToContinuousAssessment: false
  }
];
