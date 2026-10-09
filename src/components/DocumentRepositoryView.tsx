import React, { useState } from 'react';
import {
  FolderOpen,
  BookOpen,
  Presentation,
  FileSpreadsheet,
  Search,
  Download,
  Trash2,
  ExternalLink,
  Plus,
  Clock,
  Sparkles,
  Zap,
  Filter,
  CheckSquare,
  Square,
  AlertTriangle,
  X,
  Check,
  Layers,
  Copy,
  Share2,
  Globe,
} from 'lucide-react';
import {
  AppSettings,
  ExamDocument,
  LessonPlan,
  RepositoryItem,
  RepositoryItemType,
  SlidePresentation,
} from '../types';
import { exportLessonPlanToDocx, exportExamToDocx } from '../utils/docxExport';
import { exportSlideToPptx } from '../utils/pptxExport';
import { sampleExamDocument, sampleLessonPlan, sampleSlidePresentation } from '../data/sampleData';
import { deleteRepositoryItem, saveWholeRepository } from '../utils/storage';

interface DocumentRepositoryViewProps {
  repository: RepositoryItem[];
  setRepository: (items: RepositoryItem[]) => void;
  settings: AppSettings;
  onOpenLesson: (lesson: LessonPlan) => void;
  onOpenSlide: (slides: SlidePresentation) => void;
  onOpenExam: (exam: ExamDocument) => void;
  onOpenShareModal?: () => void;
}

export const DocumentRepositoryView: React.FC<DocumentRepositoryViewProps> = ({
  repository,
  setRepository,
  settings,
  onOpenLesson,
  onOpenSlide,
  onOpenExam,
  onOpenShareModal,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selection states for batch deletion
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modal confirmation states (avoid window.confirm inside iframes)
  const [itemToDelete, setItemToDelete] = useState<RepositoryItem | null>(null);
  const [showBatchDeleteModal, setShowBatchDeleteModal] = useState<boolean>(false);
  const [showClearAllModal, setShowClearAllModal] = useState<boolean>(false);

  // In-app toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredItems = repository.filter((item) => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSubject = item.subject.toLowerCase().includes(q);
      const matchGrade = item.grade.toLowerCase().includes(q);
      return matchTitle || matchSubject || matchGrade;
    }
    return true;
  });

  // Normalize title for smart duplicate detection
  const normalizeKey = (title: string, type: string, subject: string, grade: string) => {
    const cleanTitle = (title || '')
      .replace(/^kế hoạch bài dạy:\s*/i, '')
      .replace(/^bài giảng:\s*/i, '')
      .replace(/^đề kiểm tra định kì môn\s*/i, '')
      .replace(/^bài\s*\d+\s*:\s*/i, '')
      .toLowerCase()
      .replace(/[\s\-_]+/g, ' ')
      .trim();
    return `${type}__${cleanTitle}__${(subject || '').toLowerCase().trim()}__${(grade || '').toLowerCase().trim()}`;
  };

  const getDuplicateCount = () => {
    const seen = new Set<string>();
    let count = 0;
    for (const item of repository) {
      const key = normalizeKey(item.title, item.type, item.subject, item.grade);
      if (seen.has(key)) {
        count++;
      } else {
        seen.add(key);
      }
    }
    return count;
  };

  const duplicateCount = getDuplicateCount();

  // 1. Delete single item safely
  const handleConfirmSingleDelete = () => {
    if (!itemToDelete) return;
    deleteRepositoryItem(itemToDelete.id);
    const updated = repository.filter((item) => item.id !== itemToDelete.id);
    saveWholeRepository(updated);
    setRepository(updated);
    setSelectedIds((prev) => prev.filter((id) => id !== itemToDelete.id));
    showToast(`Đã xóa "${itemToDelete.title}" khỏi kho tài liệu!`);
    setItemToDelete(null);
  };

  // 2. Batch delete selected items
  const handleConfirmBatchDelete = () => {
    const updated = repository.filter((item) => !selectedIds.includes(item.id));
    for (const id of selectedIds) {
      deleteRepositoryItem(id);
    }
    saveWholeRepository(updated);
    setRepository(updated);
    const count = selectedIds.length;
    setSelectedIds([]);
    setShowBatchDeleteModal(false);
    showToast(`Đã xóa thành công ${count} tài liệu đã chọn!`);
  };

  // 3. Clean and delete all duplicate items
  const handleCleanDuplicates = () => {
    const seen = new Set<string>();
    const deduplicated: RepositoryItem[] = [];
    let removedCount = 0;

    for (const item of repository) {
      const key = normalizeKey(item.title, item.type, item.subject, item.grade);
      if (!seen.has(key)) {
        seen.add(key);
        deduplicated.push(item);
      } else {
        deleteRepositoryItem(item.id);
        removedCount++;
      }
    }

    if (removedCount === 0) {
      showToast('Kho tài liệu hiện không có bài nào bị trùng lặp!');
      return;
    }

    saveWholeRepository(deduplicated);
    setRepository(deduplicated);
    setSelectedIds([]);
    showToast(`Đã xóa sạch ${removedCount} bài trùng lặp! Kho hiện còn ${deduplicated.length} tài liệu.`);
  };

  // 4. Clear all items
  const handleConfirmClearAll = () => {
    saveWholeRepository([]);
    setRepository([]);
    setSelectedIds([]);
    setShowClearAllModal(false);
    showToast('Đã dọn sạch toàn bộ kho tài liệu!');
  };

  // Multi-select toggle
  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredItems.length && filteredItems.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map((i) => i.id));
    }
  };

  const handleDownload = async (item: RepositoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (item.type === 'lesson') {
        await exportLessonPlanToDocx(item.data as LessonPlan, settings);
      } else if (item.type === 'slide') {
        await exportSlideToPptx(item.data as SlidePresentation);
      } else if (item.type === 'exam') {
        await exportExamToDocx(item.data as ExamDocument, settings);
      }
    } catch (err: any) {
      showToast('Lỗi xuất tệp: ' + err.message);
    }
  };

  const handleOpenItem = (item: RepositoryItem) => {
    if (item.type === 'lesson') onOpenLesson(item.data as LessonPlan);
    else if (item.type === 'slide') onOpenSlide(item.data as SlidePresentation);
    else if (item.type === 'exam') onOpenExam(item.data as ExamDocument);
  };

  // Re-seed benchmark sample if repo is empty
  const handleResetSampleRepo = () => {
    const seed: RepositoryItem[] = [
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
    saveWholeRepository(seed);
    setRepository(seed);
    setSelectedIds([]);
    showToast('Đã nạp lại 3 tài liệu mẫu chuẩn KHTN Lớp 10!');
  };

  const handleShareItem = (item: RepositoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    let param = 'exam';
    if (item.type === 'lesson') param = 'lesson';
    else if (item.type === 'slide') param = 'slide';
    const url = `${window.location.origin}/?${param}=${encodeURIComponent(item.id)}`;
    navigator.clipboard.writeText(url);
    showToast(`Đã sao chép liên kết chia sẻ cho "${item.title}"!`);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-fadeIn">
          <Sparkles className="w-5 h-5 text-teal-400 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Kho Tài Liệu Sư Phạm Cá Nhân
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200">
              {repository.length} tài liệu
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý, xóa bài trùng lặp, tải tệp Word/PowerPoint và mở chỉnh sửa lại bất cứ lúc nào.
          </p>
        </div>

        {/* Action Buttons in Header */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Button: Dọn dẹp bài trùng lặp */}
          <button
            type="button"
            onClick={handleCleanDuplicates}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              duplicateCount > 0
                ? 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse'
                : 'btn-3d-teal'
            }`}
            title="Tự động quét và xóa sạch các bài trùng tên/trùng nội dung"
          >
            <Layers className="w-4 h-4" />
            <span>Xóa bài trùng lặp</span>
            {duplicateCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-white text-amber-900 text-xs font-black">
                {duplicateCount} bài trùng
              </span>
            )}
          </button>

          {/* Button: Nạp lại mẫu */}
          <button
            type="button"
            onClick={handleResetSampleRepo}
            className="btn-3d-blue px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5"
            title="Khôi phục lại bài mẫu KHTN 10 nếu cần"
          >
            <Zap className="w-4 h-4" />
            Nạp mẫu KHTN 10
          </button>

          {/* Button: Chia sẻ kho tài liệu */}
          {onOpenShareModal && (
            <button
              type="button"
              onClick={onOpenShareModal}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white shadow-sm transition-all"
              title="Xuất bản kho tài liệu này lên liên kết công khai"
            >
              <Globe className="w-4 h-4" />
              <span>Chia sẻ kho tài liệu</span>
            </button>
          )}
        </div>
      </div>

      {/* Info banner about storage */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-3.5 flex items-start gap-3 text-xs text-blue-900">
        <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong>Cơ chế tự động lưu & Quản lý:</strong> Mọi giáo án (CV 5512), bài giảng slide và đề kiểm tra (CV 7991) khi thầy/cô bấm tạo hoặc chỉnh sửa đều được tự động lưu trực tiếp vào Kho tài liệu cá nhân. Để xóa các bài nháp hoặc bài tạo trùng lặp, thầy/cô chỉ cần bấm nút <strong>"Xóa bài trùng lặp"</strong> ở trên hoặc nút <strong>"Xóa bài"</strong> trên từng tài liệu bên dưới.
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'lesson', label: 'Giáo án (5512)' },
            { id: 'slide', label: 'Slide (16:9)' },
            { id: 'exam', label: 'Đề thi (7991)' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                filterType === f.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên bài, môn, lớp..."
            className="w-full text-xs rounded-xl border border-slate-300 pl-9 pr-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Batch Selection Action Bar (Appears when items are selected) */}
      {selectedIds.length > 0 && (
        <div className="bg-blue-50 border-2 border-blue-400 rounded-2xl p-4 shadow-md flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-1.5 text-xs font-bold text-blue-900 hover:text-blue-700"
            >
              {selectedIds.length === filteredItems.length ? (
                <CheckSquare className="w-4 h-4 text-blue-600" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <span>
                {selectedIds.length === filteredItems.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
              </span>
            </button>
            <span className="text-xs font-extrabold text-blue-800 bg-blue-200/80 px-2.5 py-0.5 rounded-full">
              Đã chọn: {selectedIds.length} bài
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100"
            >
              Bỏ chọn
            </button>
            <button
              onClick={() => setShowBatchDeleteModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-500/20"
            >
              <Trash2 className="w-4 h-4" />
              Xóa {selectedIds.length} bài đã chọn
            </button>
          </div>
        </div>
      )}

      {/* Document Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
          <FolderOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700 text-base">Kho tài liệu đang trống</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Chưa có tài liệu nào phù hợp với bộ lọc. Hãy tạo bài mới hoặc nhấn "Nạp mẫu KHTN 10" để xem thử nghiệm.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isLesson = item.type === 'lesson';
            const isSlide = item.type === 'slide';
            const isExam = item.type === 'exam';
            const isSelected = selectedIds.includes(item.id);

            const badgeColor = isLesson
              ? 'bg-blue-100 text-blue-800 border-blue-200'
              : isSlide
              ? 'bg-teal-100 text-teal-800 border-teal-200'
              : 'bg-indigo-100 text-indigo-800 border-indigo-200';

            const badgeText = isLesson
              ? 'Kế hoạch bài dạy'
              : isSlide
              ? 'Slide trình chiếu'
              : 'Đề kiểm tra';

            const fileExt = isSlide ? '.pptx' : '.docx';

            return (
              <div
                key={item.id}
                onClick={() => handleOpenItem(item)}
                className={`relative bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500/30 bg-blue-50/20'
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <div>
                  {/* Card top row with Checkbox and Type Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {/* Selection Checkbox */}
                      <button
                        type="button"
                        onClick={(e) => toggleSelect(item.id, e)}
                        className="p-1 rounded hover:bg-slate-100 text-slate-500 transition-colors"
                        title={isSelected ? 'Bỏ chọn' : 'Chọn bài này để xóa'}
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                        )}
                      </button>

                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                        {badgeText}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                    {item.title}
                  </h3>

                  <div className="text-xs text-slate-500 font-medium mb-3">
                    {item.subject} • {item.grade} • Bộ sách Kết nối tri thức
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {item.summary}
                  </p>
                </div>

                {/* Bottom Action Row */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:underline">
                    Mở tài liệu
                    <ExternalLink className="w-3 h-3" />
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* Share Direct Link Button */}
                    <button
                      type="button"
                      onClick={(e) => handleShareItem(item, e)}
                      className="px-2.5 py-1.5 rounded-xl border border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white transition-colors text-xs font-bold flex items-center gap-1"
                      title="Sao chép liên kết mở trực tiếp tài liệu này"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Chia sẻ</span>
                    </button>

                    {/* Download Button */}
                    <button
                      type="button"
                      onClick={(e) => handleDownload(item, e)}
                      className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-xs font-bold flex items-center gap-1"
                      title={`Tải xuống tệp ${fileExt}`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Tải về</span>
                    </button>

                    {/* Delete Single Item Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setItemToDelete(item);
                      }}
                      className="px-2.5 py-1.5 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all text-xs font-bold flex items-center gap-1 shadow-xs"
                      title="Xóa tài liệu này khỏi kho"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa bài</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ---------------- MODAL 1: XÁC NHẬN XÓA 1 TÀI LIỆU ---------------- */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-red-600 font-extrabold text-base">
                <AlertTriangle className="w-5 h-5" />
                <span>Xác nhận xóa tài liệu</span>
              </div>
              <button
                onClick={() => setItemToDelete(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Thầy/Cô có chắc chắn muốn xóa tài liệu này khỏi kho lưu trữ?
            </p>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
              <div className="font-bold text-slate-900 line-clamp-2">
                {itemToDelete.title}
              </div>
              <div className="text-slate-500">
                {itemToDelete.subject} • {itemToDelete.grade} • {itemToDelete.type.toUpperCase()}
              </div>
            </div>

            <p className="text-[11px] text-red-500 italic">
              * Hành động này sẽ xóa vĩnh viễn tài liệu khỏi bộ nhớ trình duyệt.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmSingleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-500/20"
              >
                <Trash2 className="w-4 h-4" />
                Xóa tài liệu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- MODAL 2: XÁC NHẬN XÓA NHIỀU TÀI LIỆU (BATCH) ---------------- */}
      {showBatchDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-red-600 font-extrabold text-base">
                <AlertTriangle className="w-5 h-5" />
                <span>Xác nhận xóa hàng loạt</span>
              </div>
              <button
                onClick={() => setShowBatchDeleteModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-700">
              Thầy/Cô có chắc chắn muốn xóa <strong>{selectedIds.length} tài liệu đã chọn</strong> khỏi kho lưu trữ?
            </p>

            <div className="p-3 bg-red-50 rounded-2xl border border-red-200 text-xs text-red-700">
              Hành động này không thể hoàn tác sau khi thực hiện.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowBatchDeleteModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmBatchDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-500/20"
              >
                <Trash2 className="w-4 h-4" />
                Xóa {selectedIds.length} tài liệu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
