import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Download,
  Copy,
  Check,
  Edit3,
  Presentation,
  FileSpreadsheet,
  AlertCircle,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  Save,
  RotateCcw,
  Zap,
  FolderPlus,
} from 'lucide-react';
import { AppSettings, LessonPlan, SchoolLevel } from '../types';
import { sampleLessonPlan } from '../data/sampleData';
import { exportLessonPlanToDocx } from '../utils/docxExport';

interface LessonPlanViewProps {
  currentLesson: LessonPlan;
  setCurrentLesson: (lesson: LessonPlan) => void;
  settings: AppSettings;
  onNavigateToSlide: (lesson: LessonPlan) => void;
  onNavigateToExam: (lesson: LessonPlan) => void;
  onSaveToRepo?: (lesson: LessonPlan) => void;
}

export const LessonPlanView: React.FC<LessonPlanViewProps> = ({
  currentLesson,
  setCurrentLesson,
  settings,
  onNavigateToSlide,
  onNavigateToExam,
  onSaveToRepo,
}) => {
  // Form State
  const [schoolLevel, setSchoolLevel] = useState<SchoolLevel>(currentLesson.meta.schoolLevel || 'THPT');
  const [subject, setSubject] = useState(currentLesson.meta.subject || 'Khoa học tự nhiên');
  const [grade, setGrade] = useState(currentLesson.meta.grade || 'Lớp 10');
  const [lessonName, setLessonName] = useState(currentLesson.title.replace(/^KẾ HOẠCH BÀI DẠY:\s*/i, ''));
  const [topic, setTopic] = useState(currentLesson.meta.topic || '');
  const [duration, setDuration] = useState(currentLesson.meta.duration || '2 tiết (90 phút)');
  const [objectives, setObjectives] = useState(currentLesson.objectives.knowledge.join('\n'));
  const [contentOutline, setContentOutline] = useState('');
  const [referenceText, setReferenceText] = useState('');

  // UI States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableLesson, setEditableLesson] = useState<LessonPlan>(currentLesson);
  const [expandedActivity, setExpandedActivity] = useState<string>('act-1');

  // List of subjects based on School Level
  const thcsSubjects = [
    'Khoa học tự nhiên',
    'Toán học',
    'Ngữ văn',
    'Lịch sử và Địa lí',
    'Tin học',
    'Công nghệ',
    'Tiếng Anh',
    'Giáo dục công dân',
    'Âm nhạc',
    'Mĩ thuật',
    'Giáo dục thể chất',
  ];

  const thptSubjects = [
    'Khoa học tự nhiên (Sinh học)',
    'Khoa học tự nhiên (Vật lí)',
    'Khoa học tự nhiên (Hóa học)',
    'Toán học',
    'Ngữ văn',
    'Lịch sử',
    'Địa lí',
    'Giáo dục kinh tế và pháp luật',
    'Tin học',
    'Công nghệ',
    'Tiếng Anh',
  ];

  const currentSubjects = schoolLevel === 'THCS' ? thcsSubjects : thptSubjects;
  const gradeOptions =
    schoolLevel === 'THCS' ? ['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9'] : ['Lớp 10', 'Lớp 11', 'Lớp 12'];

  // Handle Generate with AI
  const handleGenerate = async () => {
    setErrorMsg(null);
    if (!lessonName.trim()) {
      setErrorMsg('Vui lòng nhập tên bài dạy (trường bắt buộc)!');
      return;
    }
    if (!subject.trim()) {
      setErrorMsg('Vui lòng chọn môn học!');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/generate-lesson-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolLevel,
          subject,
          grade,
          textbook: 'Kết nối tri thức',
          lessonName,
          topic,
          duration,
          objectives,
          contentOutline,
          referenceText,
          teacherName: settings.teacherName,
          schoolName: settings.schoolName,
        }),
      });

      const rawText = await response.text();
      let generatedData: any;
      try {
        generatedData = JSON.parse(rawText);
      } catch {
        throw new Error('Máy chủ phản hồi không đúng định dạng JSON (có thể do quá tải đường truyền). Vui lòng thử lại hoặc bấm "Nạp bài mẫu Lịch sử 10"!');
      }

      if (!response.ok || generatedData?.error) {
        throw new Error(generatedData?.error || 'Lỗi từ máy chủ tạo giáo án.');
      }
      const newPlan: LessonPlan = {
        id: 'lesson-' + Date.now(),
        title: generatedData.title || `KẾ HOẠCH BÀI DẠY: ${lessonName}`,
        createdAt: new Date().toISOString(),
        meta: {
          schoolLevel,
          subject,
          grade,
          textbook: 'Kết nối tri thức',
          duration,
          topic: topic || 'Chủ đề môn học',
          teacherName: settings.teacherName,
          schoolName: settings.schoolName,
        },
        objectives: generatedData.objectives || {
          knowledge: [],
          generalCompetencies: [],
          specificCompetencies: [],
          qualities: [],
        },
        equipment: generatedData.equipment || { teacher: [], student: [] },
        activities: generatedData.activities || [],
      };

      setCurrentLesson(newPlan);
      setEditableLesson(newPlan);
      setIsEditing(false);

      // Automatically persist into Repository for teacher convenience
      if (onSaveToRepo) {
        onSaveToRepo(newPlan);
      }
    } catch (err: any) {
      console.error('Lỗi tạo giáo án AI:', err);
      setErrorMsg(err.message || 'Không thể tạo giáo án. Vui lòng kiểm tra lại kết nối.');
    } finally {
      setLoading(false);
    }
  };

  // Load benchmark sample
  const handleLoadSample = () => {
    setCurrentLesson(sampleLessonPlan);
    setEditableLesson(sampleLessonPlan);
    setSchoolLevel(sampleLessonPlan.meta.schoolLevel);
    setSubject(sampleLessonPlan.meta.subject);
    setGrade(sampleLessonPlan.meta.grade);
    setLessonName(sampleLessonPlan.title.replace(/^KẾ HOẠCH BÀI DẠY:\s*/i, ''));
    setTopic(sampleLessonPlan.meta.topic);
    setDuration(sampleLessonPlan.meta.duration);
    setObjectives(sampleLessonPlan.objectives.knowledge.join('\n'));
    setIsEditing(false);
    setErrorMsg(null);
  };

  // Copy to clipboard
  const handleCopy = () => {
    const text = `
${currentLesson.title}
Môn: ${currentLesson.meta.subject} - ${currentLesson.meta.grade}
Bộ sách: Kết nối tri thức với cuộc sống | Thời lượng: ${currentLesson.meta.duration}

I. MỤC TIÊU
1. Kiến thức:
${currentLesson.objectives.knowledge.map((k) => '- ' + k).join('\n')}
2. Năng lực:
- Năng lực chung: ${currentLesson.objectives.generalCompetencies.join('; ')}
- Năng lực đặc thù: ${currentLesson.objectives.specificCompetencies.join('; ')}
3. Phẩm chất:
${currentLesson.objectives.qualities.map((q) => '- ' + q).join('\n')}

II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU
- Giáo viên: ${currentLesson.equipment.teacher.join('; ')}
- Học sinh: ${currentLesson.equipment.student.join('; ')}

III. TIẾN TRÌNH DẠY HỌC (CHUẨN CÔNG VĂN 5512)
${currentLesson.activities
  .map(
    (act) => `
${act.name} (${act.duration})
a) Mục tiêu: ${act.objective}
b) Nội dung: ${act.content}
c) Sản phẩm: ${act.product}
d) Tổ chức thực hiện:
- ${act.implementation.step1}
- ${act.implementation.step2}
- ${act.implementation.step3}
- ${act.implementation.step4}
`
  )
  .join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Export DOCX
  const handleExportDocx = async () => {
    try {
      await exportLessonPlanToDocx(currentLesson, settings);
    } catch (e: any) {
      alert('Không thể xuất file Word: ' + e.message);
    }
  };

  // Save changes in edit mode
  const handleSaveEdit = () => {
    setCurrentLesson(editableLesson);
    setIsEditing(false);
    if (onSaveToRepo) {
      onSaveToRepo(editableLesson);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Soạn Kế Hoạch Bài Dạy (Giáo Án)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200">
              Công văn 5512/BGDĐT-GDTrH
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Thiết kế bài dạy chuẩn GDPT 2018 theo bộ sách duy nhất: <strong>Kết nối tri thức với cuộc sống</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleLoadSample}
            className="btn-3d-teal px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5"
            title="Nạp bài mẫu chuẩn môn Lịch sử Lớp 10 (Trường THPT Dương Quang Đông)"
          >
            <Zap className="w-4 h-4" />
            Nạp bài mẫu Lịch sử 10
          </button>
          <button
            onClick={handleExportDocx}
            className="btn-3d-blue px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            Xuất file DOCX
          </button>
        </div>
      </div>

      {/* Main Layout: Left Input Form, Right Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Thông Tin Bài Học Đầu Vào
            </h2>
            <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              Bộ sách: Kết nối tri thức
            </span>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>{errorMsg}</div>
            </div>
          )}

          {/* Cấp học & Khối lớp */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Cấp học <span className="text-red-500">*</span>
              </label>
              <select
                value={schoolLevel}
                onChange={(e) => {
                  const val = e.target.value as SchoolLevel;
                  setSchoolLevel(val);
                  setGrade(val === 'THCS' ? 'Lớp 6' : 'Lớp 10');
                }}
                className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-blue-500 font-medium"
              >
                <option value="THCS">THCS (Cấp 2)</option>
                <option value="THPT">THPT (Cấp 3)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Khối lớp <span className="text-red-500">*</span>
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-blue-500 font-medium"
              >
                {gradeOptions.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Môn học & Thời lượng */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Môn học <span className="text-red-500">*</span>
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-blue-500 font-medium"
              >
                {currentSubjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Thời lượng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="2 tiết (90 phút)"
                className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
          </div>

          {/* Bộ sách giáo khoa duy nhất */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Bộ sách giáo khoa (Duy nhất theo yêu cầu)
            </label>
            <input
              type="text"
              readOnly
              value="Kết nối tri thức với cuộc sống (Nhà xuất bản Giáo dục Việt Nam)"
              className="w-full text-xs rounded-xl border border-teal-200 bg-teal-50/60 p-2.5 text-teal-800 font-semibold cursor-not-allowed"
            />
          </div>

          {/* Tên bài học */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tên bài học <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={lessonName}
              onChange={(e) => setLessonName(e.target.value)}
              placeholder="VD: Bài 4: Các cấp độ tổ chức của thế giới sống"
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          {/* Chủ đề / Chương */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Chủ đề / Chương bài học
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="VD: Giới thiệu khái quát thế giới sống"
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          {/* Yêu cầu cần đạt */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Yêu cầu cần đạt (YCCĐ chuẩn GDPT 2018)
            </label>
            <textarea
              rows={3}
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
              placeholder="Nhập các yêu cầu cần đạt hoặc để AI tự đối chiếu chuẩn chương trình SGK Kết nối tri thức..."
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-blue-500 font-medium leading-relaxed"
            />
            <span className="text-[11px] text-slate-400">
              * Hệ thống tuân thủ nguyên tắc không bịa đặt nội dung SGK khi thiếu dữ liệu.
            </span>
          </div>

          {/* Nội dung trọng tâm bài học */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nội dung cốt lõi / Ghi chú sư phạm riêng
            </label>
            <textarea
              rows={2}
              value={contentOutline}
              onChange={(e) => setContentOutline(e.target.value)}
              placeholder="Ghi chú thêm về dụng cụ thí nghiệm, tình huống mở đầu, hoặc liên hệ thực tế..."
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full btn-3d-blue py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang tổng hợp giáo án theo CV 5512...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-teal-300" />
                  <span>Tạo Kế Hoạch Bài Dạy Bằng AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Lesson Plan Document Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Action Bar for Plan */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 text-sm">Trạng thái:</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Đã duyệt khung 5512
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {isEditing ? (
                <button
                  onClick={handleSaveEdit}
                  className="btn-3d-teal px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  Lưu thay đổi
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-300 hover:bg-slate-50 flex items-center gap-1 text-slate-700"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Chỉnh sửa
                </button>
              )}

              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-300 hover:bg-slate-50 flex items-center gap-1 text-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Đã chép' : 'Sao chép'}
              </button>

              {onSaveToRepo && (
                <button
                  onClick={() => onSaveToRepo(currentLesson)}
                  className="btn-3d-teal px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
                  title="Lưu giáo án này vào kho tài liệu cá nhân"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  Lưu vào kho
                </button>
              )}

              <button
                onClick={() => onNavigateToSlide(currentLesson)}
                className="btn-3d-teal px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
                title="Tạo slide từ nội dung giáo án này"
              >
                <Presentation className="w-3.5 h-3.5" />
                Tạo Slide
              </button>

              <button
                onClick={() => onNavigateToExam(currentLesson)}
                className="btn-3d-blue px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
                title="Tạo đề kiểm tra bám sát bài học này"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Tạo Đề thi
              </button>
            </div>
          </div>

          {/* Lesson Plan Content Sheet (A4 Styled Document) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 font-sans text-slate-800">
            {/* Header: School and Ministry info */}
            <div className="grid grid-cols-2 text-center border-b border-slate-200 pb-4 text-xs font-semibold">
              <div>
                <p className="uppercase font-bold text-slate-900">
                  {settings.schoolName || currentLesson.meta.schoolName || 'TRƯỜNG THCS/THPT'}
                </p>
                <p className="text-slate-500 italic">
                  Tổ: {settings.department || 'Khoa học tự nhiên'}
                </p>
              </div>
              <div>
                <p className="font-bold text-slate-900">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                <p className="font-bold text-slate-900 underline decoration-slate-400">
                  Độc lập - Tự do - Hạnh phúc
                </p>
              </div>
            </div>

            {/* Document Title */}
            <div className="text-center space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-blue-700 tracking-tight">
                {currentLesson.title}
              </h2>
              <div className="text-xs sm:text-sm text-slate-600 font-medium">
                Môn: <strong>{currentLesson.meta.subject}</strong> | Khối:{' '}
                <strong>{currentLesson.meta.grade}</strong> | Bộ sách:{' '}
                <strong className="text-teal-700">Kết nối tri thức với cuộc sống</strong>
              </div>
              <div className="text-xs text-slate-500 italic">
                Thời lượng: {currentLesson.meta.duration} • Giáo viên:{' '}
                {settings.teacherName || currentLesson.meta.teacherName}
              </div>
            </div>

            {/* Section I: Objectives */}
            <div className="space-y-3 pt-2">
              <h3 className="text-base font-extrabold text-blue-800 uppercase flex items-center gap-2 border-b-2 border-blue-100 pb-1">
                <span>I. MỤC TIÊU</span>
              </h3>

              <div className="space-y-2 text-xs sm:text-sm">
                <div>
                  <h4 className="font-bold text-slate-900">1. Về kiến thức:</h4>
                  <ul className="list-disc list-inside space-y-1 pl-2 text-slate-700">
                    {currentLesson.objectives.knowledge.map((k, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {k}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">2. Về năng lực:</h4>
                  <div className="pl-2 space-y-1 text-slate-700">
                    <p>
                      <strong>a) Năng lực chung:</strong>
                    </p>
                    <ul className="list-disc list-inside pl-3 space-y-0.5">
                      {currentLesson.objectives.generalCompetencies.map((gc, idx) => (
                        <li key={idx}>{gc}</li>
                      ))}
                    </ul>

                    <p className="pt-1">
                      <strong>b) Năng lực đặc thù:</strong>
                    </p>
                    <ul className="list-disc list-inside pl-3 space-y-0.5">
                      {currentLesson.objectives.specificCompetencies.map((sc, idx) => (
                        <li key={idx}>{sc}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">3. Về phẩm chất:</h4>
                  <ul className="list-disc list-inside space-y-1 pl-2 text-slate-700">
                    {currentLesson.objectives.qualities.map((q, idx) => (
                      <li key={idx}>{q}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Section II: Equipment & Learning Materials */}
            <div className="space-y-3 pt-2">
              <h3 className="text-base font-extrabold text-blue-800 uppercase flex items-center gap-2 border-b-2 border-blue-100 pb-1">
                <span>II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-1 text-blue-700">
                    1. Đối với giáo viên:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {currentLesson.equipment.teacher.map((t, idx) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-1 text-teal-700">
                    2. Đối với học sinh:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {currentLesson.equipment.student.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Section III: Teaching Process (4 Activities) */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between border-b-2 border-blue-100 pb-1">
                <h3 className="text-base font-extrabold text-blue-800 uppercase">
                  III. TIẾN TRÌNH DẠY HỌC (CHUẨN CÔNG VĂN 5512)
                </h3>
                <span className="text-[11px] font-semibold text-slate-500">
                  4 hoạt động chuẩn 4 bước sư phạm
                </span>
              </div>

              <div className="space-y-3">
                {currentLesson.activities.map((activity, index) => {
                  const isExpanded = expandedActivity === activity.id;
                  return (
                    <div
                      key={activity.id}
                      className="rounded-xl border border-slate-200 overflow-hidden shadow-sm"
                    >
                      <button
                        onClick={() =>
                          setExpandedActivity(isExpanded ? '' : activity.id)
                        }
                        className={`w-full flex items-center justify-between p-3.5 text-left transition-colors ${
                          isExpanded
                            ? 'bg-blue-50/80 text-blue-900 font-bold border-b border-blue-200'
                            : 'bg-white hover:bg-slate-50 text-slate-800 font-bold'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
                            {index + 1}
                          </span>
                          <span className="text-sm">{activity.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-500 font-medium flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {activity.duration}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="p-4 sm:p-5 bg-white space-y-3 text-xs sm:text-sm animate-fadeIn">
                          <div>
                            <span className="font-bold text-slate-900">a) Mục tiêu: </span>
                            <span className="text-slate-700">{activity.objective}</span>
                          </div>

                          <div>
                            <span className="font-bold text-slate-900">b) Nội dung: </span>
                            <span className="text-slate-700">{activity.content}</span>
                          </div>

                          <div>
                            <span className="font-bold text-slate-900">c) Sản phẩm: </span>
                            <span className="text-slate-700">{activity.product}</span>
                          </div>

                          <div>
                            <span className="font-bold text-slate-900">
                              d) Tổ chức thực hiện (4 bước chuẩn 5512):
                            </span>
                            <div className="mt-2 space-y-2 pl-3 border-l-2 border-teal-500">
                              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                                <span className="font-bold text-teal-800">
                                  Bước 1: Chuyển giao nhiệm vụ:{' '}
                                </span>
                                <span className="text-slate-700">
                                  {activity.implementation.step1.replace(
                                    /^Bước 1:\s*Chuyển giao nhiệm vụ:\s*/i,
                                    ''
                                  )}
                                </span>
                              </div>

                              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                                <span className="font-bold text-teal-800">
                                  Bước 2: Thực hiện nhiệm vụ:{' '}
                                </span>
                                <span className="text-slate-700">
                                  {activity.implementation.step2.replace(
                                    /^Bước 2:\s*Thực hiện nhiệm vụ:\s*/i,
                                    ''
                                  )}
                                </span>
                              </div>

                              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                                <span className="font-bold text-teal-800">
                                  Bước 3: Báo cáo, thảo luận:{' '}
                                </span>
                                <span className="text-slate-700">
                                  {activity.implementation.step3.replace(
                                    /^Bước 3:\s*Báo cáo, thảo luận:\s*/i,
                                    ''
                                  )}
                                </span>
                              </div>

                              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                                <span className="font-bold text-teal-800">
                                  Bước 4: Kết luận, nhận định:{' '}
                                </span>
                                <span className="text-slate-700">
                                  {activity.implementation.step4.replace(
                                    /^Bước 4:\s*Kết luận, nhận định:\s*/i,
                                    ''
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
