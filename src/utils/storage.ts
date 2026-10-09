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

export const defaultSettings: AppSettings = {
  teacherName: 'Trần Thị Tuyết Nga',
  schoolName: 'Trường THPT Dương Quang Đông',
  department: 'Tổ Khoa học Xã hội',
  city: 'Tỉnh Vĩnh Long',
  avatarUrl: '',
  logoUrl: '',
  defaultLevel: 'THPT',
  defaultGrade: 'Lớp 10',
  defaultSubject: 'Lịch sử',
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
      const parsed = JSON.parse(raw);
      // Migrate if old placeholder names are found
      if (
        !parsed.teacherName ||
        parsed.teacherName === 'Thầy/Cô Nguyễn Văn An' ||
        parsed.teacherName === 'Nguyễn Thị Minh Hạnh'
      ) {
        parsed.teacherName = 'Trần Thị Tuyết Nga';
        parsed.schoolName = 'Trường THPT Dương Quang Đông';
        parsed.department = 'Tổ Khoa học Xã hội';
        parsed.city = 'Tỉnh Vĩnh Long';
        parsed.defaultSubject = 'Lịch sử';
      }
      return { ...defaultSettings, ...parsed };
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
        // If old sample items exist, replace them with the History benchmark
        const filtered = items.filter(
          (i) => i.id !== 'lesson-khtn10-sample' && i.id !== 'slide-khtn10-sample' && i.id !== 'exam-khtn10-sample'
        );
        const hasHistorySample = filtered.some((i) => i.id === sampleLessonPlan.id);
        if (!hasHistorySample) {
          filtered.unshift(
            {
              id: sampleLessonPlan.id,
              type: 'lesson',
              title: sampleLessonPlan.title,
              subject: sampleLessonPlan.meta.subject,
              grade: sampleLessonPlan.meta.grade,
              schoolLevel: sampleLessonPlan.meta.schoolLevel,
              createdAt: sampleLessonPlan.createdAt,
              summary: 'Kế hoạch bài dạy chuẩn Công văn 5512/BGDĐT-GDTrH môn Lịch sử 10 với 4 hoạt động sư phạm chi tiết.',
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
              summary: 'Bộ 8 slide trình chiếu 16:9 ít chữ, trực quan môn Lịch sử 10 có gợi ý hình ảnh và lời giảng.',
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
              summary: 'Bộ tài liệu kiểm tra định kì chuẩn Công văn 7991/BGDĐT-GDTrH môn Lịch sử 10: Ma trận, Đặc tả, Đề thi 4 phần & Đáp án.',
              data: sampleExamDocument,
            }
          );
          localStorage.setItem(REPO_KEY, JSON.stringify(filtered));
        }
        return filtered;
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
      summary: 'Kế hoạch bài dạy chuẩn Công văn 5512/BGDĐT-GDTrH môn Lịch sử 10 bộ sách Kết nối tri thức với 4 hoạt động sư phạm chi tiết.',
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
      summary: 'Bộ 8 slide trình chiếu 16:9 ít chữ, trực quan môn Lịch sử 10 có gợi ý hình ảnh và lời giảng giáo viên.',
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
      summary: 'Bộ tài liệu kiểm tra định kì chuẩn Công văn 7991/BGDĐT-GDTrH môn Lịch sử 10: Ma trận, Bản đặc tả, Đề thi 4 phần & Hướng dẫn chấm.',
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
      if (
        parsed &&
        parsed.id !== 'lesson-khtn10-sample' &&
        parsed.title &&
        parsed.meta &&
        Array.isArray(parsed.activities)
      ) {
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
      if (
        parsed &&
        parsed.id !== 'slide-khtn10-sample' &&
        parsed.title &&
        Array.isArray(parsed.slides) &&
        parsed.slides.length > 0
      ) {
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
        parsed.id !== 'exam-khtn10-sample' &&
        parsed.matrix &&
        Array.isArray(parsed.matrix?.rows) &&
        parsed.specification &&
        parsed.examPaper &&
        parsed.answerKey
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
