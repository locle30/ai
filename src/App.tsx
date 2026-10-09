import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeDashboard } from './components/HomeDashboard';
import { LessonPlanView } from './components/LessonPlanView';
import { SlideGeneratorView } from './components/SlideGeneratorView';
import { ExamGeneratorView } from './components/ExamGeneratorView';
import { DocumentRepositoryView } from './components/DocumentRepositoryView';
import { SettingsView } from './components/SettingsView';
import { ErrorBoundary } from './components/ErrorBoundary';
import {
  AppSettings,
  ExamDocument,
  LessonPlan,
  RepositoryItem,
  SlidePresentation,
} from './types';
import {
  loadActiveExam,
  loadActiveLesson,
  loadActiveSlides,
  loadRepository,
  loadSettings,
  saveActiveExam,
  saveActiveLesson,
  saveActiveSlides,
  saveRepositoryItem,
  saveSettings,
} from './utils/storage';
import {
  sampleExamDocument,
  sampleLessonPlan,
  sampleSlidePresentation,
} from './data/sampleData';
import { Sparkles } from 'lucide-react';

export default function App() {
  // Default to 'lesson' (Soạn giáo án) as requested by the user
  const [activeTab, setActiveTab] = useState<string>('lesson');
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [repository, setRepository] = useState<RepositoryItem[]>(loadRepository);
  const [currentLesson, setCurrentLesson] = useState<LessonPlan>(loadActiveLesson);
  const [currentSlides, setCurrentSlides] = useState<SlidePresentation>(loadActiveSlides);
  const [currentExam, setCurrentExam] = useState<ExamDocument>(loadActiveExam);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persist current active drafts in localStorage for session recovery
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveActiveLesson(currentLesson);
  }, [currentLesson]);

  useEffect(() => {
    saveActiveSlides(currentSlides);
  }, [currentSlides]);

  useEffect(() => {
    saveActiveExam(currentExam);
  }, [currentExam]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleManualSaveLesson = (lesson: LessonPlan) => {
    saveRepositoryItem({
      id: lesson.id,
      type: 'lesson',
      title: lesson.title,
      subject: lesson.meta.subject,
      grade: lesson.meta.grade,
      schoolLevel: lesson.meta.schoolLevel,
      createdAt: lesson.createdAt,
      summary: `Giáo án chuẩn CV 5512: ${lesson.title} (${lesson.meta.duration})`,
      data: lesson,
    });
    setRepository(loadRepository());
    showToast(`Đã lưu "${lesson.title}" vào Kho tài liệu thành công!`);
  };

  const handleManualSaveSlide = (slides: SlidePresentation) => {
    saveRepositoryItem({
      id: slides.id,
      type: 'slide',
      title: slides.presentationTitle,
      subject: slides.meta.subject,
      grade: slides.meta.grade,
      schoolLevel: slides.meta.schoolLevel,
      createdAt: slides.createdAt,
      summary: `Bộ ${slides.slides.length} slide trình chiếu 16:9 cho bài học ${slides.meta.lessonName}`,
      data: slides,
    });
    setRepository(loadRepository());
    showToast(`Đã lưu "${slides.presentationTitle}" vào Kho tài liệu thành công!`);
  };

  const handleManualSaveExam = (exam: ExamDocument) => {
    saveRepositoryItem({
      id: exam.id,
      type: 'exam',
      title: exam.title,
      subject: exam.meta.subject,
      grade: exam.meta.grade,
      schoolLevel: exam.meta.schoolLevel,
      createdAt: exam.createdAt,
      summary: `Bộ tài liệu kiểm tra định kì CV 7991: Ma trận, Đặc tả, Đề thi & Đáp án (${exam.meta.duration})`,
      data: exam,
    });
    setRepository(loadRepository());
    showToast(`Đã lưu "${exam.title}" vào Kho tài liệu thành công!`);
  };

  // Benchmark Loader: Load full History 10 sample suite
  const handleLoadSampleHistory10 = () => {
    setCurrentLesson(sampleLessonPlan);
    setCurrentSlides(sampleSlidePresentation);
    setCurrentExam(sampleExamDocument);
    showToast(
      'Đã nạp toàn bộ bài mẫu Lịch sử Lớp 10 (Giáo án CV 5512 + Slide 16:9 + Đề thi CV 7991)!'
    );
    setActiveTab('lesson');
  };

  const handleNavigateToSlide = (lesson: LessonPlan) => {
    const syncedSlides: SlidePresentation = {
      id: 'slides-' + Date.now(),
      presentationTitle: `Bài giảng: ${lesson.title.replace(/^KẾ HOẠCH BÀI DẠY:\s*/i, '')}`,
      createdAt: new Date().toISOString(),
      aspectRatio: '16:9',
      totalSlides: 8,
      meta: {
        subject: lesson.meta.subject,
        grade: lesson.meta.grade,
        schoolLevel: lesson.meta.schoolLevel,
        lessonName: lesson.title,
      },
      slides: sampleSlidePresentation.slides.map((s, idx) => {
        if (idx === 0) {
          return {
            ...s,
            title: lesson.title.replace(/^KẾ HOẠCH BÀI DẠY:\s*/i, '').toUpperCase(),
            subtitle: `Môn ${lesson.meta.subject} - ${lesson.meta.grade} - Bộ sách Kết nối tri thức`,
            bullets: [
              `Giáo viên: ${settings.teacherName || 'Trần Thị Tuyết Nga'}`,
              `Tổ: ${settings.department || 'Tổ Khoa học Xã hội'}`,
              `Trường: ${settings.schoolName || 'THPT Dương Quang Đông'}`,
            ],
          };
        }
        if (idx === 1) {
          return {
            ...s,
            bullets: lesson.objectives.knowledge.slice(0, 4),
          };
        }
        return s;
      }),
    };
    setCurrentSlides(syncedSlides);
    setActiveTab('slide');
    showToast('Đã khởi tạo bộ Slide từ nội dung giáo án!');
  };

  const handleNavigateToExam = (lesson: LessonPlan) => {
    setCurrentExam({
      ...sampleExamDocument,
      id: 'exam-' + Date.now(),
      title: `ĐỀ KIỂM TRA ĐỊNH KÌ MÔN ${lesson.meta.subject.toUpperCase()} - ${lesson.meta.grade.toUpperCase()}`,
      meta: {
        ...sampleExamDocument.meta,
        subject: lesson.meta.subject,
        grade: lesson.meta.grade,
        schoolLevel: lesson.meta.schoolLevel,
        scope: `Chủ đề: ${lesson.title.replace(/^KẾ HOẠCH BÀI DẠY:\s*/i, '')}`,
        schoolName: settings.schoolName,
        teacherName: settings.teacherName,
      },
    });
    setActiveTab('exam');
    showToast('Đã thiết lập thông số bài thi từ kế hoạch bài dạy!');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-fadeIn">
          <Sparkles className="w-5 h-5 text-teal-400 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Navigation bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        repoCount={repository.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <ErrorBoundary
          fallbackTitle="Đã phát hiện sự cố hiển thị trong giao diện"
          onReset={() => {
            setCurrentExam(sampleExamDocument);
            setCurrentLesson(sampleLessonPlan);
            setCurrentSlides(sampleSlidePresentation);
          }}
        >
          {activeTab === 'home' && (
            <HomeDashboard
              setActiveTab={setActiveTab}
              settings={settings}
              onLoadSampleHistory10={handleLoadSampleHistory10}
            />
          )}

          {activeTab === 'lesson' && (
            <LessonPlanView
              currentLesson={currentLesson}
              setCurrentLesson={setCurrentLesson}
              settings={settings}
              onNavigateToSlide={handleNavigateToSlide}
              onNavigateToExam={handleNavigateToExam}
              onSaveToRepo={handleManualSaveLesson}
            />
          )}

          {activeTab === 'slide' && (
            <SlideGeneratorView
              currentSlides={currentSlides}
              setCurrentSlides={setCurrentSlides}
              currentLesson={currentLesson}
              settings={settings}
              onSaveToRepo={handleManualSaveSlide}
            />
          )}

          {activeTab === 'exam' && (
            <ExamGeneratorView
              currentExam={currentExam}
              setCurrentExam={setCurrentExam}
              settings={settings}
              onSaveToRepo={handleManualSaveExam}
            />
          )}

          {activeTab === 'repository' && (
            <DocumentRepositoryView
              repository={repository}
              setRepository={setRepository}
              settings={settings}
              onOpenLesson={(lesson) => {
                setCurrentLesson(lesson);
                setActiveTab('lesson');
              }}
              onOpenSlide={(slides) => {
                setCurrentSlides(slides);
                setActiveTab('slide');
              }}
              onOpenExam={(exam) => {
                setCurrentExam(exam);
                setActiveTab('exam');
              }}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              settings={settings}
              setSettings={setSettings}
            />
          )}
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              AI
            </div>
            <span className="font-bold text-slate-700">
              TRỢ LÝ AI GIÁO VIÊN THCS & THPT
            </span>
            <span>• GDPT 2018</span>
          </div>

          <div className="text-center md:text-right space-y-0.5">
            <p>
              Giáo viên: <strong>{settings.teacherName || 'Trần Thị Tuyết Nga'}</strong> • {settings.schoolName || 'Trường THPT Dương Quang Đông'} ({settings.city || 'Tỉnh Vĩnh Long'}).
            </p>
            <p className="text-slate-400">
              Chuẩn <strong>Công văn 5512/BGDĐT-GDTrH</strong> & <strong>Công văn 7991/BGDĐT-GDTrH</strong> • Bộ sách <strong>Kết nối tri thức với cuộc sống</strong>.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
