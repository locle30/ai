import React, { useState, useEffect, useRef } from 'react';
import {
  Settings,
  Upload,
  User,
  Building,
  Check,
  Save,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Cpu,
  Sliders,
  Image as ImageIcon,
  Trash2,
  Globe,
  Share2,
} from 'lucide-react';
import { AppSettings, SchoolLevel } from '../types';
import { defaultSettings } from '../utils/storage';

interface SettingsViewProps {
  settings: AppSettings;
  setSettings: (settings: AppSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  setSettings,
}) => {
  const [form, setForm] = useState<AppSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [aiStatus, setAiStatus] = useState<{ checked: boolean; hasKey: boolean }>({
    checked: false,
    hasKey: false,
  });

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Check Gemini status on mount
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setAiStatus({ checked: true, hasKey: Boolean(data.hasGeminiKey) });
      })
      .catch(() => {
        setAiStatus({ checked: true, hasKey: false });
      });
  }, []);

  // Handle Avatar Upload
  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Kích thước ảnh đại diện không nên vượt quá 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setForm((prev) => ({ ...prev, avatarUrl: event.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Logo Upload
  const handleLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Kích thước ảnh logo không nên vượt quá 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setForm((prev) => ({ ...prev, logoUrl: event.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Handle Reset Defaults
  const handleReset = () => {
    if (confirm('Bạn có muốn đặt lại toàn bộ cài đặt về mặc định ban đầu?')) {
      setForm(defaultSettings);
      setSettings(defaultSettings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-12">
      {/* Header Bar */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Cài Đặt Hệ Thống & Thông Tin Giáo Viên
          </h1>
          <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold border border-teal-200">
            Tùy biến hoạt động thực tế
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Cập nhật thông tin nhà trường, tải ảnh đại diện, logo đơn vị và thiết lập các thông số mặc định cho giáo án và đề thi.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Avatar & Logo Upload */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <ImageIcon className="w-5 h-5 text-blue-600" />
            Ảnh Đại Diện & Logo Nhà Trường
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Avatar Upload */}
            <div className="flex items-center gap-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="relative">
                {form.avatarUrl ? (
                  <img
                    src={form.avatarUrl}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-500/20"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-700 font-bold text-2xl flex items-center justify-center ring-4 ring-blue-500/20">
                    {form.teacherName ? form.teacherName.split(' ').slice(-1)[0][0] : 'GV'}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-800">Ảnh đại diện giáo viên</div>
                <input
                  type="file"
                  ref={avatarInputRef}
                  onChange={handleAvatarFile}
                  accept="image/*"
                  className="hidden"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="btn-3d-blue px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Tải Avatar
                  </button>
                  {form.avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, avatarUrl: '' }))}
                      className="p-1.5 rounded-xl border border-slate-300 text-slate-400 hover:text-red-600 hover:bg-white"
                      title="Xóa avatar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="text-[10px] text-slate-400">PNG, JPG, WebP tối đa 2MB</div>
              </div>
            </div>

            {/* Logo Upload */}
            <div className="flex items-center gap-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="relative">
                {form.logoUrl ? (
                  <img
                    src={form.logoUrl}
                    alt="Logo trường"
                    className="w-20 h-20 rounded-xl object-contain bg-white p-1 ring-4 ring-teal-500/20 border border-slate-200"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-teal-100 text-teal-700 font-bold text-xs flex flex-col items-center justify-center p-2 text-center ring-4 ring-teal-500/20">
                    <Building className="w-6 h-6 mb-1 text-teal-600" />
                    <span>Logo trường</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-800">Logo trường / Đơn vị</div>
                <input
                  type="file"
                  ref={logoInputRef}
                  onChange={handleLogoFile}
                  accept="image/*"
                  className="hidden"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="btn-3d-teal px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Tải Logo
                  </button>
                  {form.logoUrl && (
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, logoUrl: '' }))}
                      className="p-1.5 rounded-xl border border-slate-300 text-slate-400 hover:text-red-600 hover:bg-white"
                      title="Xóa logo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="text-[10px] text-slate-400">Hiển thị ở tiêu đề đề thi & giáo án</div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Teacher & School Information */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-5 h-5 text-blue-600" />
            Thông Tin Sư Phạm Cá Nhân
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Họ và tên giáo viên:
              </label>
              <input
                type="text"
                value={form.teacherName}
                onChange={(e) => setForm({ ...form, teacherName: e.target.value })}
                className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tên trường THCS / THPT:
              </label>
              <input
                type="text"
                value={form.schoolName}
                onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
                className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tổ chuyên môn:
              </label>
              <input
                type="text"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tỉnh / Thành phố:
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Default Curriculum & Exam Parameters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sliders className="w-5 h-5 text-teal-600" />
            Cấu Hình Chương Trình & Tỉ Lệ Đề Thi Mặc Định
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Cấp học mặc định:</label>
              <select
                value={form.defaultLevel}
                onChange={(e) =>
                  setForm({
                    ...form,
                    defaultLevel: e.target.value as SchoolLevel,
                    defaultGrade: e.target.value === 'THCS' ? 'Lớp 6' : 'Lớp 10',
                  })
                }
                className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-2.5"
              >
                <option value="THCS">THCS</option>
                <option value="THPT">THPT</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Khối lớp mặc định:</label>
              <select
                value={form.defaultGrade}
                onChange={(e) => setForm({ ...form, defaultGrade: e.target.value })}
                className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-2.5"
              >
                {form.defaultLevel === 'THCS'
                  ? ['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9'].map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))
                  : ['Lớp 10', 'Lớp 11', 'Lớp 12'].map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bộ sách duy nhất:</label>
              <input
                type="text"
                readOnly
                value="Kết nối tri thức với cuộc sống"
                className="w-full text-xs sm:text-sm rounded-xl border border-teal-200 bg-teal-50 text-teal-800 font-bold p-2.5 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Tỉ lệ phân bố điểm kiểm tra mặc định (Công văn 7991):
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-xs font-medium text-slate-600 block">Biết (Nhận biết):</span>
                <span className="text-sm font-extrabold text-blue-700">{form.cognitiveRatio.know}% (4,0đ)</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-xs font-medium text-slate-600 block">Hiểu (Thông hiểu):</span>
                <span className="text-sm font-extrabold text-teal-700">{form.cognitiveRatio.understand}% (3,0đ)</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-xs font-medium text-slate-600 block">Vận dụng:</span>
                <span className="text-sm font-extrabold text-indigo-700">{form.cognitiveRatio.apply}% (3,0đ)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: AI Engine Connection Status */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Cpu className="w-5 h-5 text-indigo-600" />
            Động Cơ Trí Tuệ Nhân Tạo (Gemini AI Engine)
          </h2>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <div className="font-bold text-xs sm:text-sm text-slate-800">
                Mô hình xử lý sư phạm: <span className="text-blue-600">Gemini 3.8 Flash</span>
              </div>
              <div className="text-xs text-slate-500">
                Xử lý an toàn phía máy chủ (Server-side proxy), không để lộ API key ra trình duyệt.
              </div>
            </div>

            <div className="flex items-center gap-2">
              {aiStatus.checked ? (
                aiStatus.hasKey ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <Check className="w-3.5 h-3.5" />
                    Đã kết nối
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    Chế độ mẫu dự phòng
                  </span>
                )
              ) : (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              )}
            </div>
          </div>
        </div>


        {/* Action Save Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-100 flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            Đặt lại mặc định
          </button>

          <div className="flex items-center gap-3">
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Check className="w-4 h-4" />
                Đã lưu cấu hình thành công!
              </span>
            )}
            <button
              type="submit"
              className="btn-3d-blue px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Lưu Cài Đặt
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
