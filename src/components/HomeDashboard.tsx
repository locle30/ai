import React from 'react';
import {
  BookOpen,
  Presentation,
  FileSpreadsheet,
  CheckCircle2,
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Bookmark,
  Award,
  Globe,
  Share2,
} from 'lucide-react';
import { AppSettings } from '../types';

interface HomeDashboardProps {
  setActiveTab: (tab: string) => void;
  settings: AppSettings;
  onLoadSampleKHTN10: () => void;
  onOpenShareModal?: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  setActiveTab,
  settings,
  onLoadSampleKHTN10,
  onOpenShareModal,
}) => {
  return (
    <div className="space-y-8 pb-12 animate-fadeIn">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-teal-600 text-white shadow-xl shadow-blue-500/15 p-6 sm:p-10">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-teal-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold mb-4 border border-white/20">
            <Sparkles className="w-4 h-4 text-teal-300" />
            <span>Chương trình Giáo dục phổ thông 2018 • Bộ sách Kết nối tri thức</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight sm:leading-snug">
            Trợ Lý AI Dành Cho Giáo Viên THCS & THPT
          </h1>
          <p className="mt-3 text-sm sm:text-base text-blue-50 leading-relaxed max-w-2xl">
            Tự động hóa toàn diện quy trình sư phạm: Soạn kế hoạch bài dạy chuẩn khung Công văn 5512,
            thiết kế slide PowerPoint 16:9 tinh gọn, lập ma trận, bản đặc tả và đề kiểm tra định kì
            chuẩn xác theo <strong>Công văn 7991/BGDĐT-GDTrH ngày 17/12/2024</strong>.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('lesson')}
              className="btn-3d-blue flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm"
            >
              <BookOpen className="w-4 h-4" />
              Soạn giáo án ngay
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
            <button
              onClick={onLoadSampleKHTN10}
              className="btn-3d-teal flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm"
            >
              <Zap className="w-4 h-4" />
              Kiểm thử bài mẫu: KHTN Lớp 10
            </button>
            {onOpenShareModal && (
              <button
                onClick={onOpenShareModal}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-white/15 hover:bg-white/25 border border-white/30 text-white backdrop-blur-md transition-all active:scale-95 shadow-sm"
              >
                <Globe className="w-4 h-4 text-teal-300" />
                Chia sẻ trợ lý công khai
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Benchmark Testing Alert / Callout */}
      <div className="rounded-2xl border-2 border-teal-500/30 bg-teal-50/70 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-teal-600/30">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-base">
                Dữ liệu kiểm thử thực nghiệm: Môn Khoa học tự nhiên Lớp 10
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-teal-200 text-teal-800 font-bold text-[11px]">
                Sẵn sàng 100%
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              Trọn bộ dữ liệu chuẩn mực cho bài <em>"Các cấp độ tổ chức của thế giới sống"</em> (SGK Kết nối tri thức):
              Giáo án 5512 đầy đủ 4 hoạt động, bộ 8 slide trình chiếu 16:9, ma trận - đặc tả - đề thi định kì theo Công văn 7991 với đáp án và barem chấm điểm chi tiết.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={onLoadSampleKHTN10}
            className="w-full md:w-auto btn-3d-teal px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Nạp dữ liệu kiểm thử
          </button>
        </div>
      </div>

      {/* 3 Core Pillars Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Soạn giáo án */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                Công văn 5512
              </span>
              <span className="text-xs text-slate-400">• GDPT 2018</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Soạn Kế Hoạch Bài Dạy
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              Thiết kế mục tiêu 3 phần (Kiến thức, Năng lực chung & đặc thù, Phẩm chất), thiết bị dạy học và 4 hoạt động sư phạm chuẩn 4 bước (Chuyển giao, Thực hiện, Báo cáo, Kết luận).
            </p>
            <ul className="space-y-2 text-xs text-slate-600 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>Không bịa đặt SGK hoặc YCCĐ</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>Chỉnh sửa trực quan, tạo lại từng phần</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>Xuất file DOCX chuẩn văn bản hành chính</span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => setActiveTab('lesson')}
            className="w-full btn-3d-blue py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
          >
            <span>Soạn giáo án</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 2: Tạo slide */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center mb-4">
              <Presentation className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                PowerPoint 16:9
              </span>
              <span className="text-xs text-slate-400">• Ít chữ, trực quan</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Thiết Kế Slide Trình Chiếu
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              Tạo bài giảng điện tử trực tiếp từ giáo án; bố cục chuẩn sư phạm gồm tiêu đề, mục tiêu, khởi động, hình thành kiến thức, luyện tập và dặn dò.
            </p>
            <ul className="space-y-2 text-xs text-slate-600 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>Tùy chọn số lượng slide & tỷ lệ 16:9</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>Gợi ý hình ảnh minh họa cho từng trang</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>Xem trước tương tác & xuất file PPTX</span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => setActiveTab('slide')}
            className="w-full btn-3d-teal py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
          >
            <span>Thiết kế Slide</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Card 3: Tạo đề kiểm tra */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                Công văn 7991
              </span>
              <span className="text-xs text-slate-400">• Áp dụng HK2 24-25</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Ma Trận, Đặc Tả & Đề Thi
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              Lập ma trận và bản đặc tả theo mẫu Phụ lục 1 & 2; tạo đề 4 dạng thức (Nhiều lựa chọn, Đúng-Sai 4 ý, Trả lời ngắn, Tự luận) cùng đáp án và barem chấm điểm chi tiết.
            </p>
            <ul className="space-y-2 text-xs text-slate-600 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>Tỉ lệ Biết - Hiểu - Vận dụng chuẩn xác</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>Kiểm tra tính nhất quán & tổng 10 điểm</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>Xuất trọn bộ tài liệu ra file DOCX</span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => setActiveTab('exam')}
            className="w-full btn-3d-blue py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
          >
            <span>Tạo đề kiểm tra</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Compliance Information Section */}
      <div className="rounded-2xl bg-slate-900 text-white p-6 sm:p-8">
        <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-4 h-4" />
          Quy chuẩn chuyên môn Bộ Giáo Dục và Đào Tạo
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-4">
          Bám sát tuyệt đối các văn bản chỉ đạo hiện hành
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm mb-2">
              <Bookmark className="w-4 h-4" />
              Công văn số 5512/BGDĐT-GDTrH (18/12/2020)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Quy định khung kế hoạch bài dạy của giáo viên tại Phụ lục IV: Cấu trúc 3 phần bắt buộc (Mục tiêu, Thiết bị - học liệu, Tiến trình dạy học với 4 hoạt động sư phạm, mỗi hoạt động theo quy trình 4 bước chặt chẽ).
            </p>
          </div>

          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-teal-400 font-bold text-sm mb-2">
              <Bookmark className="w-4 h-4" />
              Công văn số 7991/BGDĐT-GDTrH (17/12/2024)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Hướng dẫn thực hiện kiểm tra đánh giá định kì từ học kì 2 năm học 2024-2025: Ma trận (Phụ lục 1), Bản đặc tả (Phụ lục 2), cấu trúc đề thi mới gồm TN nhiều lựa chọn (khoảng 3đ), TN Đúng-Sai (khoảng 2-3đ), Trả lời ngắn (khoảng 2đ) và Tự luận (khoảng 3đ).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
