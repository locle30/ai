import React, { useState } from 'react';
import {
  Presentation,
  Download,
  Copy,
  Check,
  Edit3,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Sparkles,
  Zap,
  Image as ImageIcon,
  MessageSquare,
  Plus,
  Trash2,
  Save,
  Layers,
  FolderPlus,
} from 'lucide-react';
import { AppSettings, LessonPlan, SlideItem, SlidePresentation } from '../types';
import { sampleSlidePresentation } from '../data/sampleData';
import { exportSlideToPptx } from '../utils/pptxExport';

interface SlideGeneratorViewProps {
  currentSlides: SlidePresentation;
  setCurrentSlides: (slides: SlidePresentation) => void;
  currentLesson: LessonPlan;
  settings: AppSettings;
  onSaveToRepo?: (slides: SlidePresentation) => void;
}

export const SlideGeneratorView: React.FC<SlideGeneratorViewProps> = ({
  currentSlides,
  setCurrentSlides,
  currentLesson,
  settings,
  onSaveToRepo,
}) => {
  // Config state
  const [slideCount, setSlideCount] = useState<number>(currentSlides.totalSlides || 8);
  const [useCurrentLesson, setUseCurrentLesson] = useState(true);
  const [customTopic, setCustomTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Slide navigation state
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Active slide being displayed
  const currentSlide: SlideItem | undefined = currentSlides.slides[activeSlideIndex] || currentSlides.slides[0];

  // Generate slides with AI
  const handleGenerateSlides = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/generate-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonPlanData: useCurrentLesson ? currentLesson : null,
          subject: useCurrentLesson ? currentLesson.meta.subject : 'Khoa học tự nhiên',
          grade: useCurrentLesson ? currentLesson.meta.grade : 'Lớp 10',
          lessonName: useCurrentLesson ? currentLesson.title : customTopic || 'Bài giảng điện tử',
          slideCount,
          aspectRatio: '16:9',
        }),
      });

      const rawText = await response.text();
      let generated: any;
      try {
        generated = JSON.parse(rawText);
      } catch {
        throw new Error('Máy chủ phản hồi không đúng định dạng JSON. Vui lòng thử lại hoặc dùng bài mẫu KHTN 10!');
      }

      if (!response.ok || generated?.error) {
        throw new Error(generated?.error || 'Lỗi khi tạo slide từ máy chủ.');
      }
      const newPresentation: SlidePresentation = {
        id: 'slides-' + Date.now(),
        presentationTitle: generated.presentationTitle || `Bài giảng: ${currentLesson.title}`,
        createdAt: new Date().toISOString(),
        aspectRatio: '16:9',
        totalSlides: generated.slides?.length || slideCount,
        meta: {
          subject: currentLesson.meta.subject,
          grade: currentLesson.meta.grade,
          schoolLevel: currentLesson.meta.schoolLevel,
          lessonName: currentLesson.title,
        },
        slides: generated.slides || [],
      };

      setCurrentSlides(newPresentation);
      setActiveSlideIndex(0);
      setIsEditing(false);

      if (onSaveToRepo) {
        onSaveToRepo(newPresentation);
      }
    } catch (err: any) {
      console.error('Lỗi tạo slide AI:', err);
      setErrorMsg(err.message || 'Không thể tạo slide. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Load benchmark sample slides
  const handleLoadSample = () => {
    setCurrentSlides(sampleSlidePresentation);
    setActiveSlideIndex(0);
    setIsEditing(false);
    setErrorMsg(null);
  };

  // Export PPTX
  const handleExportPptx = async () => {
    try {
      await exportSlideToPptx(currentSlides);
    } catch (err: any) {
      alert('Không thể xuất tệp PowerPoint: ' + err.message);
    }
  };

  // Copy slide outline text
  const handleCopy = () => {
    const text = currentSlides.slides
      .map(
        (s) => `
Slide ${s.slideNumber}: ${s.title}
${s.subtitle ? 'Phụ đề: ' + s.subtitle : ''}
Nội dung:
${s.bullets.map((b) => '• ' + b).join('\n')}
Gợi ý hình ảnh: ${s.imageSuggestion}
Ghi chú giáo viên: ${s.notes}
----------------------------------------`
      )
      .join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Update a field on active slide
  const handleUpdateActiveSlide = (field: keyof SlideItem, value: any) => {
    const updatedSlides = [...currentSlides.slides];
    updatedSlides[activeSlideIndex] = {
      ...updatedSlides[activeSlideIndex],
      [field]: value,
    };
    setCurrentSlides({
      ...currentSlides,
      slides: updatedSlides,
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Thiết Kế Slide Trình Chiếu PowerPoint
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-700 text-xs font-bold border border-teal-200">
              Tỷ lệ 16:9 • Sư phạm tinh gọn
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Chuyển hóa kế hoạch bài dạy thành slide ít chữ, chuẩn cấu trúc hoạt động, có gợi ý hình ảnh và ghi chú sư phạm.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleLoadSample}
            className="btn-3d-teal px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5"
            title="Nạp 8 slide mẫu KHTN Lớp 10 (SGK Kết nối tri thức)"
          >
            <Zap className="w-4 h-4" />
            Nạp slide mẫu KHTN 10
          </button>
          <button
            onClick={handleExportPptx}
            className="btn-3d-blue px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            Xuất file PPTX
          </button>
        </div>
      </div>

      {/* Main Grid: Controls & Slide Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Generation Settings (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Presentation className="w-5 h-5 text-teal-600" />
            Cấu Hình Thiết Kế Slide
          </h2>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Source toggle */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">Nguồn nội dung slide:</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 text-xs">
                <input
                  type="radio"
                  name="slideSource"
                  checked={useCurrentLesson}
                  onChange={() => setUseCurrentLesson(true)}
                  className="text-teal-600 focus:ring-teal-500"
                />
                <div>
                  <div className="font-bold text-slate-800">
                    Từ giáo án hiện tại
                  </div>
                  <div className="text-slate-500 truncate max-w-[220px]">
                    {currentLesson.title}
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 text-xs">
                <input
                  type="radio"
                  name="slideSource"
                  checked={!useCurrentLesson}
                  onChange={() => setUseCurrentLesson(false)}
                  className="text-teal-600 focus:ring-teal-500"
                />
                <div>
                  <div className="font-bold text-slate-800">Nhập chủ đề tùy chỉnh</div>
                  <div className="text-slate-500">Tự do chỉ định nội dung bài giảng</div>
                </div>
              </label>
            </div>
          </div>

          {!useCurrentLesson && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tên bài học hoặc chủ đề:
              </label>
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="VD: Bài 5: Các nguyên tố hóa học trong tế bào"
                className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-teal-500 font-medium"
              />
            </div>
          )}

          {/* Slide count */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Số lượng slide mong muốn:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[6, 8, 10, 12].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setSlideCount(num)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    slideCount === num
                      ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {num} slide
                </button>
              ))}
            </div>
          </div>

          {/* Aspect ratio */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tỷ lệ màn hình chuẩn:
            </label>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Màn hình rộng 16:9 Widescreen</span>
              <span className="text-[11px] text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">
                Khuyên dùng
              </span>
            </div>
          </div>

          {/* Pedagogical Principles Reminder */}
          <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-200 text-teal-900 text-xs space-y-1.5">
            <div className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-600" />
              Nguyên tắc thiết kế slide giáo dục:
            </div>
            <p className="text-[11px] text-teal-800 leading-relaxed">
              • Ít chữ, tối đa 4-6 gạch đầu dòng ngắn/trang.
              <br />
              • Có phần gợi ý trực quan/hình ảnh minh họa.
              <br />
              • Bám sát tiến trình khởi động - kiến thức mới - luyện tập - vận dụng.
            </p>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateSlides}
            disabled={loading}
            className="w-full btn-3d-teal py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang thiết kế slide bài giảng...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                <span>Tạo Bộ Slide Bằng AI</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Slide Viewer & Interactive Canvas (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Action toolbar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-sm flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">
                Slide {activeSlideIndex + 1} / {currentSlides.slides.length}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                {currentSlide?.type?.toUpperCase() || 'NỘI DUNG'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 border transition-colors ${
                  isEditing
                    ? 'bg-teal-50 border-teal-300 text-teal-700'
                    : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                {isEditing ? 'Đang chỉnh sửa' : 'Sửa slide này'}
              </button>

              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Đã sao chép' : 'Sao chép'}
              </button>

              {onSaveToRepo && (
                <button
                  onClick={() => onSaveToRepo(currentSlides)}
                  className="btn-3d-teal px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
                  title="Lưu bộ slide này vào kho tài liệu cá nhân"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  Lưu vào kho
                </button>
              )}
            </div>
          </div>

          {/* Interactive Slide Canvas (16:9 Aspect Ratio Container) */}
          {currentSlide && (
            <div className="relative w-full aspect-[16/9] rounded-2xl border-2 border-slate-300/80 bg-gradient-to-br from-slate-50 to-blue-50/30 p-6 sm:p-10 shadow-lg flex flex-col justify-between overflow-hidden">
              {/* Decorative Brand Accent */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-teal-500 to-blue-600" />

              {/* Slide Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
                    GDPT 2018 • BỘ SÁCH KẾT NỐI TRI THỨC
                  </span>
                  <span className="text-xs font-extrabold text-slate-400">
                    {activeSlideIndex + 1}/{currentSlides.slides.length}
                  </span>
                </div>

                {isEditing ? (
                  <input
                    type="text"
                    value={currentSlide.title}
                    onChange={(e) => handleUpdateActiveSlide('title', e.target.value)}
                    className="w-full text-lg sm:text-2xl font-black text-blue-700 bg-white border border-blue-300 rounded-lg p-2 mb-1"
                  />
                ) : (
                  <h3 className="text-lg sm:text-2xl md:text-3xl font-black text-blue-700 tracking-tight leading-tight">
                    {currentSlide.title}
                  </h3>
                )}

                {currentSlide.subtitle && (
                  <p className="text-xs sm:text-sm text-slate-500 italic mt-0.5">
                    {currentSlide.subtitle}
                  </p>
                )}
              </div>

              {/* Main Content Bullets */}
              <div className="my-auto py-2">
                <div className="space-y-2 sm:space-y-3">
                  {currentSlide.bullets?.map((bullet, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-base text-slate-800">
                      <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-teal-500 mt-1.5 flex-shrink-0" />
                      {isEditing ? (
                        <input
                          type="text"
                          value={bullet}
                          onChange={(e) => {
                            const newBullets = [...currentSlide.bullets];
                            newBullets[idx] = e.target.value;
                            handleUpdateActiveSlide('bullets', newBullets);
                          }}
                          className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded p-1"
                        />
                      ) : (
                        <span className="leading-snug font-medium">{bullet}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer row: Visual prompt & presentation notes preview */}
              <div className="pt-2 border-t border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5 truncate max-w-sm">
                  <ImageIcon className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                  <span className="font-semibold text-slate-700">Hình ảnh:</span>
                  <span className="truncate italic">{currentSlide.imageSuggestion}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-semibold">
                  {currentSlides.meta.subject} - {currentSlides.meta.grade}
                </div>
              </div>
            </div>
          )}

          {/* Slide Controls: Prev / Next buttons */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setActiveSlideIndex(Math.max(0, activeSlideIndex - 1))}
              disabled={activeSlideIndex === 0}
              className="btn-3d-blue px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
              Slide trước
            </button>

            {/* Thumbnail dots / quick selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto px-2 max-w-[280px] sm:max-w-md">
              {currentSlides.slides.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                    activeSlideIndex === idx
                      ? 'bg-blue-600 text-white shadow-md scale-110'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() =>
                setActiveSlideIndex(
                  Math.min(currentSlides.slides.length - 1, activeSlideIndex + 1)
                )
              }
              disabled={activeSlideIndex === currentSlides.slides.length - 1}
              className="btn-3d-blue px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1 disabled:opacity-40"
            >
              Slide tiếp
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Teacher Notes & Visual Suggestion Details Card */}
          {currentSlide && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5 mb-2">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  Gợi ý hình ảnh minh họa cho slide này
                </h4>
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={currentSlide.imageSuggestion}
                    onChange={(e) =>
                      handleUpdateActiveSlide('imageSuggestion', e.target.value)
                    }
                    className="w-full text-xs rounded-xl border border-slate-300 p-2"
                  />
                ) : (
                  <p className="text-xs text-slate-700 italic leading-relaxed">
                    {currentSlide.imageSuggestion}
                  </p>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-700 flex items-center gap-1.5 mb-2">
                  <MessageSquare className="w-4 h-4 text-teal-600" />
                  Ghi chú sư phạm của giáo viên (Speaker Notes)
                </h4>
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={currentSlide.notes}
                    onChange={(e) =>
                      handleUpdateActiveSlide('notes', e.target.value)
                    }
                    className="w-full text-xs rounded-xl border border-slate-300 p-2"
                  />
                ) : (
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {currentSlide.notes || 'Giáo viên tổ chức hoạt động theo 4 bước sư phạm.'}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
