import React, { useState } from 'react';
import {
  BookOpen,
  Presentation,
  FileSpreadsheet,
  FolderOpen,
  Settings,
  Home,
  Menu,
  X,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { AppSettings } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  settings: AppSettings;
  repoCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  settings,
  repoCount = 0,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Trang chủ', icon: Home },
    { id: 'lesson', label: 'Soạn giáo án', icon: BookOpen, badge: 'CV 5512' },
    { id: 'slide', label: 'Tạo slide', icon: Presentation, badge: '16:9' },
    { id: 'exam', label: 'Tạo đề kiểm tra', icon: FileSpreadsheet, badge: 'CV 7991' },
    { id: 'repository', label: 'Kho tài liệu', icon: FolderOpen, count: repoCount },
    { id: 'settings', label: 'Cài đặt', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & App Brand */}
          <div
            onClick={() => setActiveTab('lesson')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt="Logo trường"
                className="w-10 h-10 object-contain rounded-lg border border-slate-200"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg group-hover:text-blue-600 transition-colors">
                  TRỢ LÝ AI GIÁO VIÊN
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                  <Sparkles className="w-3 h-3 text-teal-600" />
                  GDPT 2018
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden md:block">
                Soạn giáo án CV 5512 • Slide 16:9 • Đề kiểm tra CV 7991
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-inner border border-blue-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`}
                  />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200/80 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Teacher Profile Widget */}
          <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
            <button
              onClick={() => setActiveTab('settings')}
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors text-left group"
              title="Cài đặt thông tin giáo viên"
            >
              {settings.avatarUrl ? (
                <img
                  src={settings.avatarUrl}
                  alt={settings.teacherName}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/30 group-hover:ring-blue-600"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center ring-2 ring-blue-500/20 group-hover:ring-blue-600">
                  {settings.teacherName
                    ? settings.teacherName.split(' ').slice(-1)[0][0]
                    : 'N'}
                </div>
              )}
              <div className="hidden sm:block">
                <div className="text-xs font-bold text-slate-800 leading-tight group-hover:text-blue-600">
                  {settings.teacherName || 'Trần Thị Tuyết Nga'}
                </div>
                <div className="text-[11px] text-slate-500 truncate max-w-[170px]">
                  {settings.schoolName || 'THPT Dương Quang Đông'}
                </div>
              </div>
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
