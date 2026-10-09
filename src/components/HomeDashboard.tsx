import React from 'react';
import {
  BookOpen,
  Presentation,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Award,
} from 'lucide-react';
import { AppSettings } from '../types';

interface HomeDashboardProps {
  setActiveTab: (tab: string) => void;
  settings: AppSettings;
  onLoadSampleHistory10: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  setActiveTab,
  settings,
  onLoadSampleHistory10,
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
            <span>Chương trình Giáo dục phổ thông 2018 • Bộ sách Kết nối tri thức với cuộc sống</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight sm:leading-snug">
            Trợ Lý AI Dành Cho Giáo Viên THCS & THPT
          </h1>
          <p className="mt-3 text-sm sm:text-base text-blue-50 leading-relaxed max-w-2xl">
            Không gian sư phạm cá nhân của <strong>Cô {settings.teacherName || 'Trần Thị Tuyết Nga'}</strong> ({settings.schoolName || 'Trường THPT Dương Quang Đông'} - {settings.department || 'Tổ Khoa học Xã hội'}).
            Hỗ trợ soạn kế hoạch bài dạy chuẩn khung <strong>Công văn 5512/BGDĐT-GDTrH</strong>, thiết kế slide trình chiếu 16:9 và lập ma trận - đặc tả - đề kiểm tra chuẩn <strong>Công văn 7991/BGDĐT-GDTrH</strong>.
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
              onClick={onLoadSampleHistory10}
              className="btn-3d-teal flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm"
            >
              <Zap className="w-4 h-4" />
              Mở bài mẫu: Lịch sử Lớp 10
            </button>
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
                Giáo án & Tài liệu mẫu: Môn Lịch sử Lớp 10 (Chuẩn GDPT 2018)
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-teal-200 text-teal-800 font-bold text-[11px]">
                Sẵn sàng 100%
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              Trọn bộ tài liệu sư phạm cho bài <em>"Hiện thực lịch sử và nhận thức lịch sử"</em> (SGK Lịch sử 10 Kết nối tri thức) biên soạn cho <strong>Trường THPT Dương Quang Đông, tỉnh Vĩnh Long</strong>:
              Giáo án CV 5512 đầy đủ 4 hoạt động sư phạm, bộ 8 slide trình chiếu 16:9, ma trận - đặc tả - đề thi định kì theo Công văn 7991 có đáp án và barem chấm điểm chi tiết.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={onLoadSampleHistory10}
            className="w-full md:w-auto btn-3d-teal px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Nạp bài mẫu Lịch sử 10
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
                Tỷ lệ 16:9
              </span>
              <span className="text-xs text-slate-400">• PowerPoint</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Thiết Kế Slide Trình Chiếu
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              Biến kế hoạch bài dạy thành bài trình chiếu 16:9 chuyên nghiệp. Ít chữ (4-6 ý/slide), có gợi ý hình ảnh trực quan và ghi chú hướng dẫn giảng dạy.
            </p>
            <ul className="space-y-2 text-xs text-slate-600 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>Cấu trúc bài dạy 7-8 slide chuẩn</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>Gợi ý hình ảnh minh họa chi tiết</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>Xuất file PPTX tương thích Microsoft Office</span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => setActiveTab('slide')}
            className="w-full btn-3d-teal py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
          >
            <span>Thiết kế slide</span>
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
              <span className="text-xs text-slate-400">• 17/12/2024</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Tạo Đề Kiểm Tra Định Kì
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              Tạo đồng bộ Ma trận (Phụ lục 1), Bản đặc tả (Phụ lục 2), Đề kiểm tra 4 phần định dạng mới và Hướng dẫn chấm điểm chi tiết chuẩn Công văn 7991.
            </p>
            <ul className="space-y-2 text-xs text-slate-600 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>Ma trận chuẩn tỉ lệ Biết - Hiểu - Vận dụng</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>Đề thi 4 phần: MCQ, Đúng/Sai, Điền ngắn, Tự luận</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span>Barem chấm điểm 10.0 điểm chuẩn mực</span>
              </li>
            </ul>
          </div>
          <button
            onClick={() => setActiveTab('exam')}
            className="w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 active:scale-98 transition-all"
          >
            <span>Tạo đề kiểm tra</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Compliance Notice Footer Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 flex items-center gap-4 text-xs text-slate-600 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
          <ShieldCheck className="w-5 h-5 text-teal-600" />
        </div>
        <div>
          <h4 className="font-bold text-slate-800 text-sm">
            Bảo đảm pháp lý sư phạm & Bảo mật dữ liệu cá nhân
          </h4>
          <p className="mt-0.5 text-slate-500 leading-relaxed">
            Hệ thống tuân thủ nghiêm ngặt khung phân phối chương trình GDPT 2018 và quy chuẩn văn bản của Bộ GD&ĐT Việt Nam. Toàn bộ tài liệu được lưu trữ trực tiếp và an toàn trên thiết bị của thầy cô.
          </p>
        </div>
      </div>
    </div>
  );
};
