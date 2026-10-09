import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeDashboard } from './components/HomeDashboard';
import { LessonPlanView } from './components/LessonPlanView';
import { SlideGeneratorView } from './components/SlideGeneratorView';
import { ExamGeneratorView } from './components/ExamGeneratorView';
import { DocumentRepositoryView } from './components/DocumentRepositoryView';
import { SettingsView } from './components/SettingsView';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ShareWorkspaceModal } from './components/ShareWorkspaceModal';
import {
  AppSettings,
  ExamDocument,
  LessonPlan,
  RepositoryItem,
  SlidePresentation,
} from './types';
import {
  fetchPublicWorkspace,
  publishPublicWorkspace,
  loadAutoPublishPreference,
  saveAutoPublishPreference,
  loadLastPublishedTime,
  isLocalStorageClean,
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
import { testFirestoreConnection } from './utils/firebase';
import { decodeWorkspaceFromHash } from './utils/snapshot';
import { Check, Info, Sparkles, BookOpen, GraduationCap, Globe, RefreshCw, Share2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [repository, setRepository] = useState<RepositoryItem[]>(loadRepository);
  const [currentLesson, setCurrentLesson] = useState<LessonPlan>(loadActiveLesson);
  const [currentSlides, setCurrentSlides] = useState<SlidePresentation>(loadActiveSlides);
  const [currentExam, setCurrentExam] = useState<ExamDocument>(loadActiveExam);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Public Sharing & Cloud Workspace States
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [lastPublishedTime, setLastPublishedTime] = useState<string | null>(loadLastPublishedTime);
  const [autoPublish, setAutoPublish] = useState<boolean>(loadAutoPublishPreference);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [isPublicVisitor, setIsPublicVisitor] = useState<boolean>(false);
  const [publicAuthorInfo, setPublicAuthorInfo] = useState<{ author: string; school: string }>({
    author: '',
    school: '',
  });

  // On Mount: Test Firestore, check hash snapshot or load public workspace
  useEffect(() => {
    // 1. Validate Firestore connection
    testFirestoreConnection();

    // 2. Check if URL hash has full snapshot data (#data=...)
    if (window.location.hash.startsWith('#data=')) {
      const decoded = decodeWorkspaceFromHash(window.location.hash);
      if (decoded) {
        if (decoded.settings) setSettings(decoded.settings as AppSettings);
        if (decoded.repository && Array.isArray(decoded.repository)) setRepository(decoded.repository);
        if (decoded.activeLesson) setCurrentLesson(decoded.activeLesson);
        if (decoded.activeSlides) setCurrentSlides(decoded.activeSlides);
        if (decoded.activeExam) setCurrentExam(decoded.activeExam);
        setIsPublicVisitor(true);
        setPublicAuthorInfo({
          author: decoded.authorName || decoded.settings?.teacherName || 'Giáo viên',
          school: decoded.schoolName || decoded.settings?.schoolName || '',
        });
        showToast('Đã nạp toàn bộ dữ liệu từ liên kết chia sẻ!');
        return;
      }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const directExamId = urlParams.get('exam');
    const directLessonId = urlParams.get('lesson');
    const directSlideId = urlParams.get('slide');
    const directTab = urlParams.get('tab');

    fetchPublicWorkspace().then(({ hasWorkspace, workspace }) => {
      if (hasWorkspace && workspace) {
        const clean = isLocalStorageClean();
        // If clean local storage (e.g. colleague opening public link for first time)
        // or user opened via direct item link, adopt the server workspace!
        if (
          clean ||
          directExamId ||
          directLessonId ||
          urlParams.get('shared') === 'true' ||
          !localStorage.getItem('troly_gv_active_exam')
        ) {
          if (workspace.settings) setSettings(workspace.settings);
          if (workspace.repository && Array.isArray(workspace.repository) && workspace.repository.length > 0) {
            setRepository(workspace.repository);
          }
          if (workspace.activeLesson) setCurrentLesson(workspace.activeLesson);
          if (workspace.activeSlides) setCurrentSlides(workspace.activeSlides);
          if (workspace.activeExam) setCurrentExam(workspace.activeExam);
          setIsPublicVisitor(true);
          setPublicAuthorInfo({
            author: workspace.authorName || workspace.settings?.teacherName || 'Giáo viên',
            school: workspace.schoolName || workspace.settings?.schoolName || '',
          });
        }

        if (workspace.publishedAt) {
          setLastPublishedTime(workspace.publishedAt);
        }

        // Direct Item deep links
        if (directExamId) {
          const found = (workspace.repository || []).find((r: any) => r.id === directExamId);
          if (found && found.type === 'exam') {
            setCurrentExam(found.data as ExamDocument);
          } else if (workspace.activeExam && workspace.activeExam.id === directExamId) {
            setCurrentExam(workspace.activeExam);
          }
          setActiveTab('exam');
        } else if (directLessonId) {
          const found = (workspace.repository || []).find((r: any) => r.id === directLessonId);
          if (found && found.type === 'lesson') {
            setCurrentLesson(found.data as LessonPlan);
          } else if (workspace.activeLesson && workspace.activeLesson.id === directLessonId) {
            setCurrentLesson(workspace.activeLesson);
          }
          setActiveTab('lesson');
        } else if (directSlideId) {
          const found = (workspace.repository || []).find((r: any) => r.id === directSlideId);
          if (found && found.type === 'slide') {
            setCurrentSlides(found.data as SlidePresentation);
          }
          setActiveTab('slide');
        } else if (directTab) {
          setActiveTab(directTab);
        }
      } else {
        // Initial auto-sync to server if empty
        if (autoPublish) {
          publishPublicWorkspace({
            settings,
            repository,
            activeLesson: currentLesson,
            activeSlides: currentSlides,
            activeExam: currentExam,
            authorName: settings.teacherName,
            title: currentExam.title,
          }).then((res) => {
            if (res.publishedAt) setLastPublishedTime(res.publishedAt);
          });
        }
      }
    });
  }, []);

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

  useEffect(() => {
    saveAutoPublishPreference(autoPublish);
  }, [autoPublish]);

  // Debounced Auto-Publish to Server: Automatically keeps public link in sync with author's changes!
  useEffect(() => {
    if (!autoPublish) return;
    const timer = setTimeout(() => {
      publishPublicWorkspace({
        settings,
        repository,
        activeLesson: currentLesson,
        activeSlides: currentSlides,
        activeExam: currentExam,
        authorName: settings.teacherName,
        title: currentExam.title,
      }).then((res) => {
        if (res.publishedAt) {
          setLastPublishedTime(res.publishedAt);
        }
      });
    }, 2000);
    return () => clearTimeout(timer);
  }, [settings, repository, currentLesson, currentSlides, currentExam, autoPublish]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Explicit Manual Publish Handler
  const handlePublishNow = async () => {
    setIsPublishing(true);
    try {
      const res = await publishPublicWorkspace({
        settings,
        repository,
        activeLesson: currentLesson,
        activeSlides: currentSlides,
        activeExam: currentExam,
        authorName: settings.teacherName,
        title: currentExam.title,
      });
      if (res.success && res.publishedAt) {
        setLastPublishedTime(res.publishedAt);
        showToast('Đã xuất bản thành công toàn bộ nội dung lên liên kết công khai!');
      } else {
        showToast(res.message || 'Lỗi khi xuất bản lên máy chủ');
      }
    } finally {
      setIsPublishing(false);
    }
  };

  // Restore workspace from uploaded backup JSON file
  const handleImportBackup = (backup: any) => {
    if (!backup) return;
    if (backup.settings) setSettings(backup.settings);
    if (backup.repository && Array.isArray(backup.repository)) setRepository(backup.repository);
    if (backup.activeLesson) setCurrentLesson(backup.activeLesson);
    if (backup.activeSlides) setCurrentSlides(backup.activeSlides);
    if (backup.activeExam) setCurrentExam(backup.activeExam);
    showToast('Đã khôi phục toàn bộ dữ liệu từ tệp tin sao lưu!');

    // Automatically sync restored state to Cloud Firestore
    publishPublicWorkspace({
      settings: backup.settings || settings,
      repository: backup.repository || repository,
      activeLesson: backup.activeLesson || currentLesson,
      activeSlides: backup.activeSlides || currentSlides,
      activeExam: backup.activeExam || currentExam,
      authorName: backup.settings?.teacherName || settings.teacherName,
    });
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

  // Benchmark Loader: Load full KHTN 10 sample suite
  const handleLoadSampleKHTN10 = () => {
    setCurrentLesson(sampleLessonPlan);
    setCurrentSlides(sampleSlidePresentation);
    setCurrentExam(sampleExamDocument);
    showToast(
      'Đã nạp toàn bộ dữ liệu kiểm thử: Bài Khoa học tự nhiên Lớp 10 (Giáo án + Slide + Đề thi CV 7991)!'
    );
    setActiveTab('lesson');
  };

  const handleNavigateToSlide = (lesson: LessonPlan) => {
    // Generate/sync slides from lesson
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
              `Giáo viên: ${settings.teacherName || 'Nguyễn Văn An'}`,
              `Trường: ${settings.schoolName || 'THCS/THPT'}`,
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

      {/* Public Visitor Informative Banner */}
      {isPublicVisitor && publicAuthorInfo.author && (
        <div className="bg-gradient-to-r from-teal-700 via-blue-700 to-indigo-800 text-white px-4 py-2 text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 max-w-4xl truncate">
            <Globe className="w-4 h-4 text-teal-300 flex-shrink-0" />
            <span className="truncate">
              Đang mở <strong>Không gian Trợ lý công khai</strong> của{' '}
              <strong>{publicAuthorInfo.author}</strong>
              {publicAuthorInfo.school ? ` (${publicAuthorInfo.school})` : ''} • Đầy đủ{' '}
              {repository.length} tài liệu trong kho & các bộ đề thi đã tạo.
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-[11px] font-bold text-white transition-colors"
            >
              Liên kết & Chi tiết
            </button>
          </div>
        </div>
      )}

      {/* Navigation bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        onOpenShareModal={() => setIsShareModalOpen(true)}
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
              onLoadSampleKHTN10={handleLoadSampleKHTN10}
              onOpenShareModal={() => setIsShareModalOpen(true)}
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
              onOpenShareModal={() => setIsShareModalOpen(true)}
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
              onOpenShareModal={() => setIsShareModalOpen(true)}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              settings={settings}
              setSettings={setSettings}
              onOpenShareModal={() => setIsShareModalOpen(true)}
            />
          )}
        </ErrorBoundary>
      </main>

      {/* Share & Public Workspace Modal */}
      <ShareWorkspaceModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        settings={settings}
        repository={repository}
        currentExam={currentExam}
        currentLesson={currentLesson}
        currentSlides={currentSlides}
        lastPublishedTime={lastPublishedTime}
        autoPublish={autoPublish}
        setAutoPublish={setAutoPublish}
        onPublishNow={handlePublishNow}
        isPublishing={isPublishing}
        onImportBackup={handleImportBackup}
      />

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
              Chuẩn <strong>Công văn 5512/BGDĐT-GDTrH</strong> (Kế hoạch bài dạy) & <strong>Công văn 7991/BGDĐT-GDTrH</strong> (Kiểm tra đánh giá định kì).
            </p>
            <p className="text-slate-400">
              Bộ sách giáo khoa duy nhất: <strong>Kết nối tri thức với cuộc sống</strong> (NXB Giáo Dục Việt Nam).
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
