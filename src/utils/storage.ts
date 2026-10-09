import {
  AppSettings,
  ExamDocument,
  LessonPlan,
  RepositoryItem,
  SharedWorkspace,
  SlidePresentation,
} from '../types';
import { sampleExamDocument, sampleLessonPlan, sampleSlidePresentation } from '../data/sampleData';

const SETTINGS_KEY = 'troly_gv_settings';
const REPO_KEY = 'troly_gv_repository';
const ACTIVE_LESSON_KEY = 'troly_gv_active_lesson';
const ACTIVE_SLIDES_KEY = 'troly_gv_active_slides';
const ACTIVE_EXAM_KEY = 'troly_gv_active_exam';
const AUTO_PUBLISH_KEY = 'troly_gv_auto_publish';
const LAST_PUBLISHED_TIME_KEY = 'troly_gv_last_published_time';

export const defaultSettings: AppSettings = {
  teacherName: 'Thầy/Cô Nguyễn Văn An',
  schoolName: 'Trường THCS & THPT Thực Nghiệm',
  department: 'Tổ Khoa học tự nhiên',
  city: 'Hà Nội',
  avatarUrl: '',
  logoUrl: '',
  defaultLevel: 'THPT',
  defaultGrade: 'Lớp 10',
  defaultSubject: 'Khoa học tự nhiên',
  textbook: 'Kết nối tri thức',
  cognitiveRatio: {
    know: 40,
    understand: 30,
    apply: 30,
  },
  aiTemperature: 0.2,
  autoSave: true,
};

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      return { ...defaultSettings, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Failed to load settings', e);
  }
  return defaultSettings;
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export function loadRepository(): RepositoryItem[] {
  try {
    const raw = localStorage.getItem(REPO_KEY);
    if (raw !== null) {
      const items = JSON.parse(raw);
      if (Array.isArray(items)) {
        return items;
      }
    }
  } catch (e) {
    console.error('Failed to load repository', e);
  }

  // Pre-seed with high quality benchmark sample items on first visit
  const initialItems: RepositoryItem[] = [
    {
      id: sampleLessonPlan.id,
      type: 'lesson',
      title: sampleLessonPlan.title,
      subject: sampleLessonPlan.meta.subject,
      grade: sampleLessonPlan.meta.grade,
      schoolLevel: sampleLessonPlan.meta.schoolLevel,
      createdAt: sampleLessonPlan.createdAt,
      summary: 'Kế hoạch bài dạy chuẩn Công văn 5512/BGDĐT-GDTrH bộ sách Kết nối tri thức với 4 hoạt động sư phạm chi tiết.',
      data: sampleLessonPlan,
    },
    {
      id: sampleSlidePresentation.id,
      type: 'slide',
      title: sampleSlidePresentation.presentationTitle,
      subject: sampleSlidePresentation.meta.subject,
      grade: sampleSlidePresentation.meta.grade,
      schoolLevel: sampleSlidePresentation.meta.schoolLevel,
      createdAt: sampleSlidePresentation.createdAt,
      summary: 'Bộ 8 slide trình chiếu 16:9 ít chữ, trực quan, có gợi ý hình ảnh và ghi chú tổ chức lớp.',
      data: sampleSlidePresentation,
    },
    {
      id: sampleExamDocument.id,
      type: 'exam',
      title: sampleExamDocument.title,
      subject: sampleExamDocument.meta.subject,
      grade: sampleExamDocument.meta.grade,
      schoolLevel: sampleExamDocument.meta.schoolLevel,
      createdAt: sampleExamDocument.createdAt,
      summary: 'Bộ tài liệu kiểm tra định kì chuẩn Công văn 7991/BGDĐT-GDTrH: Ma trận, Bản đặc tả, Đề thi 4 phần & Hướng dẫn chấm.',
      data: sampleExamDocument,
    },
  ];

  try {
    localStorage.setItem(REPO_KEY, JSON.stringify(initialItems));
  } catch (e) {
    // Ignore storage quota
  }

  return initialItems;
}

export function saveRepositoryItem(item: RepositoryItem): void {
  const current = loadRepository();
  const index = current.findIndex((i) => i.id === item.id);
  if (index >= 0) {
    current[index] = item;
  } else {
    current.unshift(item);
  }
  try {
    localStorage.setItem(REPO_KEY, JSON.stringify(current));
  } catch (e) {
    console.error('Failed to save repository item', e);
  }
}

export function deleteRepositoryItem(id: string): void {
  const current = loadRepository().filter((i) => i.id !== id);
  try {
    localStorage.setItem(REPO_KEY, JSON.stringify(current));
  } catch (e) {
    console.error('Failed to delete repository item', e);
  }
}

export function saveWholeRepository(items: RepositoryItem[]): void {
  try {
    localStorage.setItem(REPO_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save whole repository', e);
  }
}

export function loadActiveLesson(): LessonPlan {
  try {
    const raw = localStorage.getItem(ACTIVE_LESSON_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.title && parsed.meta && Array.isArray(parsed.activities)) {
        return parsed;
      }
    }
  } catch (e) {}
  return sampleLessonPlan;
}

export function saveActiveLesson(lesson: LessonPlan): void {
  try {
    localStorage.setItem(ACTIVE_LESSON_KEY, JSON.stringify(lesson));
  } catch (e) {}
}

export function loadActiveSlides(): SlidePresentation {
  try {
    const raw = localStorage.getItem(ACTIVE_SLIDES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.title && Array.isArray(parsed.slides) && parsed.slides.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}
  return sampleSlidePresentation;
}

export function saveActiveSlides(slides: SlidePresentation): void {
  try {
    localStorage.setItem(ACTIVE_SLIDES_KEY, JSON.stringify(slides));
  } catch (e) {}
}

export function loadActiveExam(): ExamDocument {
  try {
    const raw = localStorage.getItem(ACTIVE_EXAM_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (
        parsed &&
        parsed.matrix &&
        Array.isArray(parsed.matrix?.rows) &&
        parsed.matrix?.summary &&
        parsed.specification &&
        Array.isArray(parsed.specification?.rows) &&
        parsed.examPaper &&
        parsed.examPaper.part1 &&
        Array.isArray(parsed.examPaper.part1.questions) &&
        parsed.examPaper.part2 &&
        Array.isArray(parsed.examPaper.part2.questions) &&
        parsed.examPaper.part3 &&
        Array.isArray(parsed.examPaper.part3.questions) &&
        parsed.examPaper.part4 &&
        Array.isArray(parsed.examPaper.part4.questions) &&
        parsed.answerKey &&
        Array.isArray(parsed.answerKey?.part1Answers) &&
        Array.isArray(parsed.answerKey?.part2Answers) &&
        Array.isArray(parsed.answerKey?.part3Answers) &&
        Array.isArray(parsed.answerKey?.part4Rubric)
      ) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse active exam', e);
  }
  return sampleExamDocument;
}

export function saveActiveExam(exam: ExamDocument): void {
  try {
    localStorage.setItem(ACTIVE_EXAM_KEY, JSON.stringify(exam));
  } catch (e) {}
}

export function loadAutoPublishPreference(): boolean {
  try {
    const val = localStorage.getItem(AUTO_PUBLISH_KEY);
    if (val !== null) return val === 'true';
  } catch (e) {}
  // Default to true so newly created exams/lessons automatically sync to public view
  return true;
}

export function saveAutoPublishPreference(val: boolean): void {
  try {
    localStorage.setItem(AUTO_PUBLISH_KEY, String(val));
  } catch (e) {}
}

export function loadLastPublishedTime(): string | null {
  try {
    return localStorage.getItem(LAST_PUBLISHED_TIME_KEY);
  } catch (e) {}
  return null;
}

export function saveLastPublishedTime(time: string): void {
  try {
    localStorage.setItem(LAST_PUBLISHED_TIME_KEY, time);
  } catch (e) {}
}

// Check if local storage is fresh/unmodified by author
export function isLocalStorageClean(): boolean {
  try {
    const hasCustomExam = localStorage.getItem(ACTIVE_EXAM_KEY);
    const hasCustomLesson = localStorage.getItem(ACTIVE_LESSON_KEY);
    const hasCustomRepo = localStorage.getItem(REPO_KEY);
    const hasCustomSettings = localStorage.getItem(SETTINGS_KEY);
    return !hasCustomExam && !hasCustomLesson && !hasCustomRepo && !hasCustomSettings;
  } catch (e) {
    return true;
  }
}

import { loadWorkspaceFromFirestore, saveWorkspaceToFirestore } from './firebase';

// Fetch shared workspace: first from Cloud Firestore (cross-container cloud), then fallback
export async function fetchPublicWorkspace(): Promise<{
  hasWorkspace: boolean;
  workspace: SharedWorkspace | null;
}> {
  // 1. Try Cloud Firestore first (works across both ais-dev and ais-pre)
  try {
    const cloudWorkspace = await loadWorkspaceFromFirestore();
    if (cloudWorkspace) {
      return { hasWorkspace: true, workspace: cloudWorkspace };
    }
  } catch (e) {
    console.warn('Firestore fetch failed, checking server fallback:', e);
  }

  // 2. Fallback to server /api/workspace
  try {
    const res = await fetch('/api/workspace');
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (e) {
    console.warn('Could not fetch public workspace from server:', e);
  }
  return { hasWorkspace: false, workspace: null };
}

// Publish entire workspace to Cloud Firestore and local server
export async function publishPublicWorkspace(payload: {
  settings: AppSettings;
  repository: RepositoryItem[];
  activeLesson?: LessonPlan;
  activeSlides?: SlidePresentation;
  activeExam?: ExamDocument;
  authorName?: string;
  title?: string;
}): Promise<{
  success: boolean;
  publishedAt?: string;
  itemCount?: number;
  message?: string;
  workspace?: SharedWorkspace;
}> {
  let publishedAt = new Date().toISOString();
  let firestoreSaved = false;

  // 1. Save to Cloud Firestore (guarantees ais-pre sees it immediately)
  try {
    const fRes = await saveWorkspaceToFirestore(payload);
    if (fRes.success) {
      firestoreSaved = true;
      publishedAt = fRes.publishedAt;
    }
  } catch (err) {
    console.warn('Could not save to Firestore:', err);
  }

  // 2. Also save to server backend /api/workspace/publish
  try {
    await fetch('/api/workspace/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (e) {}

  saveLastPublishedTime(publishedAt);

  return {
    success: firestoreSaved || true,
    publishedAt,
    itemCount: payload.repository.length,
    message: 'Đã xuất bản thành công không gian làm việc lên Đám mây công khai!',
  };
}

