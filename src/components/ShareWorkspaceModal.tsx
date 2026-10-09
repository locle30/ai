import React, { useState, useRef } from 'react';
import {
  Globe,
  Share2,
  Copy,
  Check,
  UploadCloud,
  CheckCircle2,
  FolderOpen,
  FileSpreadsheet,
  BookOpen,
  Presentation,
  X,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Download,
  Upload,
  Link2,
  Database,
} from 'lucide-react';
import {
  AppSettings,
  ExamDocument,
  LessonPlan,
  RepositoryItem,
  SlidePresentation,
} from '../types';
import { encodeWorkspaceToHash, exportWorkspaceToFile } from '../utils/snapshot';

interface ShareWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  repository: RepositoryItem[];
  currentExam: ExamDocument;
  currentLesson: LessonPlan;
  currentSlides: SlidePresentation;
  lastPublishedTime: string | null;
  autoPublish: boolean;
  setAutoPublish: (val: boolean) => void;
  onPublishNow: () => Promise<void>;
  isPublishing: boolean;
  onImportBackup?: (backup: any) => void;
}

export const ShareWorkspaceModal: React.FC<ShareWorkspaceModalProps> = ({
  isOpen,
  onClose,
  settings,
  repository,
  currentExam,
  currentLesson,
  currentSlides,
  lastPublishedTime,
  autoPublish,
  setAutoPublish,
  onPublishNow,
  isPublishing,
  onImportBackup,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSnapshotLink, setCopiedSnapshotLink] = useState(false);
  const [copiedExamLink, setCopiedExamLink] = useState(false);
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const publicUrl = window.location.origin;
  const examShareUrl = `${window.location.origin}/?exam=${encodeURIComponent(currentExam.id)}`;

  // Generate full snapshot URL
  const hashPayload = encodeWorkspaceToHash({
    settings,
    repository,
    activeExam: currentExam,
    activeLesson: currentLesson,
    activeSlides: currentSlides,
  });
  const snapshotShareUrl = `${window.location.origin}/#data=${hashPayload}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopySnapshotLink = () => {
    navigator.clipboard.writeText(snapshotShareUrl);
    setCopiedSnapshotLink(true);
    setTimeout(() => setCopiedSnapshotLink(false), 2500);
  };

  const handleCopyExamLink = () => {
    navigator.clipboard.writeText(examShareUrl);
    setCopiedExamLink(true);
    setTimeout(() => setCopiedExamLink(false), 2500);
  };

  const handleExportBackup = () => {
    exportWorkspaceToFile({
      settings,
      repository,
      activeExam: currentExam,
      activeLesson: currentLesson,
      activeSlides: currentSlides,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (onImportBackup) {
          onImportBackup(parsed);
          setImportMsg('Đã nhập dữ liệu thành công!');
          setTimeout(() => setImportMsg(null), 3000);
        }
      } catch (err) {
        setImportMsg('Tệp JSON không hợp lệ!');
        setTimeout(() => setImportMsg(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  const examCount = repository.filter((r) => r.type === 'exam').length;
  const lessonCount = repository.filter((r) => r.type === 'lesson').length;
  const slideCount = repository.filter((r) => r.type === 'slide').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[92vh] overflow-y-auto flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-gradient-to-r from-blue-50/50 via-teal-50/30 to-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Chia Sẻ & Đồng Bộ Trợ Lý Công Khai
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Đồng bộ hóa qua Cloud Firestore & Tạo đường link kèm trọn bộ dữ liệu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Option 1: Direct Cloud Synced Public URL */}
          <div className="space-y-2 p-4 rounded-2xl bg-gradient-to-r from-blue-50/70 to-teal-50/50 border border-blue-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-4 h-4 text-blue-600" />
                Cách 1: Liên kết Cloud Firestore (Khuyên dùng)
              </label>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Đã kết nối Cloud DB
              </span>
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white border border-blue-200">
              <input
                type="text"
                readOnly
                value={publicUrl}
                className="flex-1 bg-transparent px-3 py-1 text-sm font-mono text-slate-800 select-all outline-none"
              />
              <button
                onClick={handleCopyLink}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  copiedLink
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                }`}
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedLink ? 'Đã sao chép' : 'Sao chép'}
              </button>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Dữ liệu được lưu trực tiếp trên Cloud Firestore. Khi thầy/cô bấm <strong>"Xuất bản ngay"</strong> hoặc bật <strong>"Tự động đồng bộ"</strong>, người mở link Public sẽ xem được toàn bộ đề thi và giáo án mới nhất.
            </p>
          </div>

          {/* Option 2: Snapshot URL (100% Data embedded in link) */}
          <div className="space-y-2 p-4 rounded-2xl bg-teal-50/60 border border-teal-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
                <Link2 className="w-4 h-4 text-teal-600" />
                Cách 2: Đường link nạp dữ liệu tức thì (Snapshot Link)
              </label>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-200 text-teal-800">
                Kèm trọn vẹn dữ liệu
              </span>
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white border border-teal-200">
              <input
                type="text"
                readOnly
                value={snapshotShareUrl}
                className="flex-1 bg-transparent px-3 py-1 text-xs font-mono text-slate-600 truncate select-all outline-none"
              />
              <button
                onClick={handleCopySnapshotLink}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex-shrink-0 ${
                  copiedSnapshotLink
                    ? 'bg-emerald-600 text-white'
                    : 'bg-teal-600 text-white hover:bg-teal-700 active:scale-95'
                }`}
              >
                {copiedSnapshotLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                {copiedSnapshotLink ? 'Đã chép link đầy đủ' : 'Chép link đầy đủ'}
              </button>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              * Đường link này mã hóa trực tiếp thông tin giáo viên, tất cả {examCount} bộ đề và {lessonCount} giáo án vào liên kết. Người nhận mở ra là nạp dữ liệu ngay 100% không cần tải lại máy chủ.
            </p>
          </div>

          {/* Sync Status Card */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-900">
                  Thống kê nội dung sẽ hiển thị khi người khác mở link:
                </span>
              </div>
              {lastPublishedTime && (
                <span className="text-[11px] font-semibold text-slate-500">
                  Đồng bộ: {new Date(lastPublishedTime).toLocaleTimeString('vi-VN')} {new Date(lastPublishedTime).toLocaleDateString('vi-VN')}
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="text-lg font-black text-slate-900">{lessonCount}</div>
                <div className="text-[11px] font-semibold text-slate-500">Kế hoạch bài dạy</div>
              </div>

              <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                  <Presentation className="w-4 h-4" />
                </div>
                <div className="text-lg font-black text-slate-900">{slideCount}</div>
                <div className="text-[11px] font-semibold text-slate-500">Slide trình chiếu</div>
              </div>

              <div className="bg-white rounded-xl p-3 border border-teal-200/80 shadow-xs bg-teal-50/30">
                <div className="flex items-center justify-center gap-1 text-teal-600 mb-1">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div className="text-lg font-black text-teal-900">{examCount}</div>
                <div className="text-[11px] font-bold text-teal-700">Đề kiểm tra CV 7991</div>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-1 pt-1 border-t border-slate-200/60">
              <p>
                <strong>Hồ sơ giáo viên:</strong> {settings.teacherName || 'Giáo viên'} • {settings.schoolName || 'Chưa cập nhật'}
              </p>
              <p className="truncate">
                <strong>Bộ đề kiểm tra mới nhất:</strong> {currentExam.title}
              </p>
            </div>
          </div>

          {/* Action Row: Publish Now & Auto Sync */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Xuất bản ngay lên Đám mây công khai
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Lưu trữ vĩnh viễn dữ liệu hiện tại lên Cloud Firestore để link công khai có đủ nội dung mới nhất.
                </p>
              </div>

              <button
                onClick={onPublishNow}
                disabled={isPublishing}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-xs shadow-md shadow-teal-500/20 hover:from-teal-700 hover:to-emerald-700 active:scale-95 disabled:opacity-50 transition-all flex-shrink-0"
              >
                {isPublishing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Đang xuất bản...
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    Xuất bản lên Cloud
                  </>
                )}
              </button>
            </div>

            {/* Auto sync toggle */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoPublishToggle"
                  checked={autoPublish}
                  onChange={(e) => setAutoPublish(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <label
                  htmlFor="autoPublishToggle"
                  className="text-xs font-semibold text-slate-800 cursor-pointer select-none"
                >
                  Tự động đồng bộ lên Đám mây mỗi khi bạn tạo đề hoặc lưu bài mới
                </label>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {autoPublish ? 'Đang bật' : 'Đang tắt'}
              </span>
            </div>
          </div>

          {/* Option 3: Export & Import File */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FolderOpen className="w-4 h-4 text-slate-600" />
                Cách 3: Tải file sao lưu & Nạp dữ liệu từ máy (.json)
              </h4>
              {importMsg && (
                <span className="text-xs font-bold text-emerald-600 animate-fadeIn">
                  {importMsg}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleExportBackup}
                className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>Tải tệp dữ liệu Trợ lý (.json)</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-teal-600" />
                <span>Nạp tệp dữ liệu vào máy này</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Người mở link xem được đầy đủ ma trận, bản đặc tả và tải file Word/PowerPoint.</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
