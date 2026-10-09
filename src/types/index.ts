export type SchoolLevel = 'THCS' | 'THPT';

export type Textbook = 'Kết nối tri thức';

export interface ActivityImplementation {
  step1: string; // Chuyển giao nhiệm vụ
  step2: string; // Thực hiện nhiệm vụ
  step3: string; // Báo cáo, thảo luận
  step4: string; // Kết luận, nhận định
}

export interface LessonActivity {
  id: string;
  type: 'KHỞI ĐỘNG' | 'HÌNH THÀNH KIẾN THỨC' | 'LUYỆN TẬP' | 'VẬN DỤNG';
  name: string;
  duration: string;
  objective: string;
  content: string;
  product: string;
  implementation: ActivityImplementation;
}

export interface LessonPlan {
  id: string;
  title: string;
  createdAt: string;
  meta: {
    schoolLevel: SchoolLevel;
    subject: string;
    grade: string;
    textbook: Textbook;
    duration: string;
    topic: string;
    teacherName?: string;
    schoolName?: string;
  };
  objectives: {
    knowledge: string[];
    generalCompetencies: string[];
    specificCompetencies: string[];
    qualities: string[];
  };
  equipment: {
    teacher: string[];
    student: string[];
  };
  activities: LessonActivity[];
}

export interface SlideItem {
  slideNumber: number;
  type: 'cover' | 'objective' | 'warmup' | 'content' | 'practice' | 'application' | 'summary';
  title: string;
  subtitle?: string;
  bullets: string[];
  imageSuggestion: string;
  notes: string;
}

export interface SlidePresentation {
  id: string;
  presentationTitle: string;
  createdAt: string;
  aspectRatio: string;
  totalSlides: number;
  meta: {
    subject: string;
    grade: string;
    schoolLevel: SchoolLevel;
    lessonName: string;
  };
  slides: SlideItem[];
}

export interface MatrixRow {
  index: number;
  topic: string;
  contentUnit: string;
  multipleChoice: { know: number; understand: number; apply: number };
  trueFalse: { know: number; understand: number; apply: number };
  shortAnswer: { know: number; understand: number; apply: number };
  essay: { know: number; understand: number; apply: number };
  total: { know: number; understand: number; apply: number };
  totalScore: number;
  percent: number;
}

export interface MatrixSummary {
  multipleChoiceScore: number;
  trueFalseScore: number;
  shortAnswerScore: number;
  essayScore: number;
  knowScore: number;
  understandScore: number;
  applyScore: number;
  totalScore: number;
}

export interface ExamMatrix {
  rows: MatrixRow[];
  summary: MatrixSummary;
}

export interface SpecificationRow {
  index: number;
  topic: string;
  contentUnit: string;
  learningOutcomes: {
    know: string;
    understand: string;
    apply: string;
  };
  questionDistribution: {
    multipleChoice: string;
    trueFalse: string;
    shortAnswer: string;
    essay: string;
  };
}

export interface ExamSpecification {
  rows: SpecificationRow[];
}

export interface MCQQuestion {
  number: number;
  question: string;
  options: string[];
  level: string;
}

export interface TrueFalseSubQuestion {
  key: 'a' | 'b' | 'c' | 'd';
  text: string;
  level: string;
}

export interface TrueFalseQuestion {
  number: number;
  context: string;
  subQuestions: TrueFalseSubQuestion[];
}

export interface ShortAnswerQuestion {
  number: number;
  question: string;
  level: string;
}

export interface EssayQuestion {
  number: number;
  question: string;
  score: number;
  level: string;
}

export interface ExamPaper {
  part1: {
    title: string;
    instruction: string;
    questions: MCQQuestion[];
  };
  part2: {
    title: string;
    instruction: string;
    questions: TrueFalseQuestion[];
  };
  part3: {
    title: string;
    instruction: string;
    questions: ShortAnswerQuestion[];
  };
  part4: {
    title: string;
    instruction: string;
    questions: EssayQuestion[];
  };
}

export interface MCQAnswer {
  number: number;
  answer: string;
  explain?: string;
}

export interface TrueFalseAnswerDetail {
  key: 'a' | 'b' | 'c' | 'd';
  isCorrect: boolean;
  explain?: string;
}

export interface TrueFalseAnswer {
  number: number;
  details: TrueFalseAnswerDetail[];
}

export interface ShortAnswerKey {
  number: number;
  answer: string;
  explain?: string;
}

export interface EssayRubricStep {
  content: string;
  score: number;
}

export interface EssayRubric {
  number: number;
  steps: EssayRubricStep[];
  total: number;
}

export interface ExamAnswerKey {
  part1Answers: MCQAnswer[];
  part2Answers: TrueFalseAnswer[];
  part3Answers: ShortAnswerKey[];
  part4Rubric: EssayRubric[];
}

export interface ExamDocument {
  id: string;
  title: string;
  createdAt: string;
  meta: {
    subject: string;
    grade: string;
    schoolLevel: SchoolLevel;
    duration: string;
    scope: string;
    totalScore: number;
    ratio: string;
    schoolName?: string;
    teacherName?: string;
  };
  matrix: ExamMatrix;
  specification: ExamSpecification;
  examPaper: ExamPaper;
  answerKey: ExamAnswerKey;
}

export interface AppSettings {
  teacherName: string;
  schoolName: string;
  department: string;
  city: string;
  avatarUrl: string;
  logoUrl: string;
  defaultLevel: SchoolLevel;
  defaultGrade: string;
  defaultSubject: string;
  textbook: Textbook;
  cognitiveRatio: {
    know: number;
    understand: number;
    apply: number;
  };
  aiTemperature: number;
  autoSave: boolean;
}

export type RepositoryItemType = 'lesson' | 'slide' | 'exam';

export interface RepositoryItem {
  id: string;
  type: RepositoryItemType;
  title: string;
  subject: string;
  grade: string;
  schoolLevel: SchoolLevel;
  createdAt: string;
  summary: string;
  data: LessonPlan | SlidePresentation | ExamDocument;
}

export interface SharedWorkspace {
  publishedAt: string;
  updatedAt?: string;
  authorName?: string;
  schoolName?: string;
  title?: string;
  version: number;
  settings?: AppSettings;
  repository: RepositoryItem[];
  activeLesson?: LessonPlan;
  activeSlides?: SlidePresentation;
  activeExam?: ExamDocument;
}

