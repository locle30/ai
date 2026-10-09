import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  Sparkles,
  Zap,
  Layers,
  AlertTriangle,
  Table as TableIcon,
  CheckCircle2,
  HelpCircle,
  FileText,
  Sliders,
  FolderPlus,
  ArrowRight,
  Eye,
  EyeOff,
  Share2,
  Globe,
} from 'lucide-react';
import { AppSettings, ExamDocument, SchoolLevel } from '../types';
import { sampleExamDocument } from '../data/sampleData';
import { exportExamToDocx } from '../utils/docxExport';

interface ExamGeneratorViewProps {
  currentExam: ExamDocument;
  setCurrentExam: (exam: ExamDocument) => void;
  settings: AppSettings;
  onSaveToRepo?: (exam: ExamDocument) => void;
  onOpenShareModal?: () => void;
}

/**
 * Ensures an exam document is 100% structurally complete with valid arrays, numbers, and sub-elements
 * to guarantee React never throws runtime TypeError during render or action handlers.
 */
function sanitizeExamDocument(exam: any, fallback: ExamDocument): ExamDocument {
  if (!exam || typeof exam !== 'object') return fallback || sampleExamDocument;

  const validFallback = fallback || sampleExamDocument;

  return {
    id: exam.id || 'exam-' + Date.now(),
    title: typeof exam.title === 'string' && exam.title.trim() ? exam.title : validFallback.title,
    createdAt: exam.createdAt || new Date().toISOString(),
    meta: {
      ...validFallback.meta,
      ...(exam.meta || {}),
    },
    matrix: {
      rows: (Array.isArray(exam.matrix?.rows) && exam.matrix.rows.length > 0 ? exam.matrix.rows : validFallback.matrix.rows).map((r: any, idx: number) => ({
        index: r?.index ?? idx + 1,
        topic: r?.topic ?? `Chủ đề ${idx + 1}`,
        contentUnit: r?.contentUnit ?? 'Kiến thức cốt lõi',
        multipleChoice: {
          know: Number(r?.multipleChoice?.know ?? 1),
          understand: Number(r?.multipleChoice?.understand ?? 1),
          apply: Number(r?.multipleChoice?.apply ?? 0),
        },
        trueFalse: {
          know: Number(r?.trueFalse?.know ?? 1),
          understand: Number(r?.trueFalse?.understand ?? 1),
          apply: Number(r?.trueFalse?.apply ?? 0),
        },
        shortAnswer: {
          know: Number(r?.shortAnswer?.know ?? 1),
          understand: Number(r?.shortAnswer?.understand ?? 1),
          apply: Number(r?.shortAnswer?.apply ?? 0),
        },
        essay: {
          know: Number(r?.essay?.know ?? 0),
          understand: Number(r?.essay?.understand ?? 0),
          apply: Number(r?.essay?.apply ?? 1),
        },
        totalScore: Number(r?.totalScore ?? 10.0),
        percent: Number(r?.percent ?? 100),
      })),
      summary: {
        multipleChoiceScore: Number(exam.matrix?.summary?.multipleChoiceScore ?? validFallback.matrix.summary.multipleChoiceScore),
        trueFalseScore: Number(exam.matrix?.summary?.trueFalseScore ?? validFallback.matrix.summary.trueFalseScore),
        shortAnswerScore: Number(exam.matrix?.summary?.shortAnswerScore ?? validFallback.matrix.summary.shortAnswerScore),
        essayScore: Number(exam.matrix?.summary?.essayScore ?? validFallback.matrix.summary.essayScore),
        knowScore: Number(exam.matrix?.summary?.knowScore ?? validFallback.matrix.summary.knowScore),
        understandScore: Number(exam.matrix?.summary?.understandScore ?? validFallback.matrix.summary.understandScore),
        applyScore: Number(exam.matrix?.summary?.applyScore ?? validFallback.matrix.summary.applyScore),
        totalScore: Number(exam.matrix?.summary?.totalScore ?? 10.0),
      },
    },
    specification: {
      rows: (Array.isArray(exam.specification?.rows) && exam.specification.rows.length > 0 ? exam.specification.rows : validFallback.specification.rows).map((s: any, idx: number) => ({
        index: s?.index ?? idx + 1,
        topic: s?.topic ?? `Chủ đề ${idx + 1}`,
        contentUnit: s?.contentUnit ?? 'Kiến thức trọng tâm',
        learningOutcomes: {
          know: s?.learningOutcomes?.know ?? '- Nhận biết kiến thức cốt lõi.',
          understand: s?.learningOutcomes?.understand ?? '- Hiểu và giải thích được bản chất hiện tượng.',
          apply: s?.learningOutcomes?.apply ?? '- Vận dụng kiến thức vào thực tiễn.',
        },
        questionDistribution: {
          multipleChoice: s?.questionDistribution?.multipleChoice ?? 'Biết: 1-6; Hiểu: 7-12',
          trueFalse: s?.questionDistribution?.trueFalse ?? 'Hiểu: Câu 1; Vận dụng: Câu 2',
          shortAnswer: s?.questionDistribution?.shortAnswer ?? 'Biết: Câu 1, 2; Hiểu: Câu 3, 4',
          essay: s?.questionDistribution?.essay ?? 'Vận dụng: Câu 1, 2',
        },
      })),
    },
    examPaper: {
      part1: {
        title: exam.examPaper?.part1?.title || validFallback.examPaper.part1.title,
        instruction: exam.examPaper?.part1?.instruction || validFallback.examPaper.part1.instruction,
        questions: (Array.isArray(exam.examPaper?.part1?.questions) && exam.examPaper.part1.questions.length > 0 ? exam.examPaper.part1.questions : validFallback.examPaper.part1.questions).map((q: any, i: number) => {
          let options: string[] = [];
          if (Array.isArray(q?.options) && q.options.length > 0) {
            options = q.options.map(String);
          } else if (q?.options && typeof q.options === 'object') {
            options = Object.entries(q.options).map(([k, v]) => `${k}. ${v}`);
          }
          if (options.length < 4) {
            options = ['A. Phương án A', 'B. Phương án B', 'C. Phương án C', 'D. Phương án D'];
          }
          return {
            number: q?.number ?? i + 1,
            question: q?.question ?? `Câu hỏi trắc nghiệm ${i + 1}?`,
            options,
            level: q?.level ?? (i < 6 ? 'Nhận biết' : 'Thông hiểu'),
          };
        }),
      },
      part2: {
        title: exam.examPaper?.part2?.title || validFallback.examPaper.part2.title,
        instruction: exam.examPaper?.part2?.instruction || validFallback.examPaper.part2.instruction,
        questions: (Array.isArray(exam.examPaper?.part2?.questions) && exam.examPaper.part2.questions.length > 0 ? exam.examPaper.part2.questions : validFallback.examPaper.part2.questions).map((q: any, i: number) => ({
          number: q?.number ?? i + 1,
          context: q?.context ?? `Xét các nhận định sau:`,
          subQuestions: (Array.isArray(q?.subQuestions) && q.subQuestions.length > 0 ? q.subQuestions : [
            { key: 'a', text: 'Nhận định 1.', level: 'Nhận biết' },
            { key: 'b', text: 'Nhận định 2.', level: 'Thông hiểu' },
            { key: 'c', text: 'Nhận định 3.', level: 'Thông hiểu' },
            { key: 'd', text: 'Nhận định 4.', level: 'Vận dụng' },
          ]).map((sub: any, sIdx: number) => ({
            key: sub?.key ?? ['a', 'b', 'c', 'd'][sIdx % 4],
            text: sub?.text ?? `Mệnh đề ${sIdx + 1}.`,
            level: sub?.level ?? 'Thông hiểu',
          })),
        })),
      },
      part3: {
        title: exam.examPaper?.part3?.title || validFallback.examPaper.part3.title,
        instruction: exam.examPaper?.part3?.instruction || validFallback.examPaper.part3.instruction,
        questions: (Array.isArray(exam.examPaper?.part3?.questions) && exam.examPaper.part3.questions.length > 0 ? exam.examPaper.part3.questions : validFallback.examPaper.part3.questions).map((q: any, i: number) => ({
          number: q?.number ?? i + 1,
          question: q?.question ?? `Câu hỏi trả lời ngắn ${i + 1}?`,
          level: q?.level ?? 'Thông hiểu',
        })),
      },
      part4: {
        title: exam.examPaper?.part4?.title || validFallback.examPaper.part4.title,
        instruction: exam.examPaper?.part4?.instruction || validFallback.examPaper.part4.instruction,
        questions: (Array.isArray(exam.examPaper?.part4?.questions) && exam.examPaper.part4.questions.length > 0 ? exam.examPaper.part4.questions : validFallback.examPaper.part4.questions).map((q: any, i: number) => ({
          number: q?.number ?? i + 1,
          question: q?.question ?? `Câu hỏi tự luận ${i + 1}?`,
          score: Number(q?.score ?? 1.5),
          level: q?.level ?? 'Vận dụng',
        })),
      },
    },
    answerKey: {
      part1Answers: (Array.isArray(exam.answerKey?.part1Answers) && exam.answerKey.part1Answers.length > 0 ? exam.answerKey.part1Answers : validFallback.answerKey.part1Answers).map((a: any, i: number) => ({
        number: a?.number ?? i + 1,
        answer: String(a?.answer ?? ['A', 'B', 'C', 'D'][i % 4]),
        explain: a?.explain ?? 'Căn cứ SGK Kết nối tri thức.',
      })),
      part2Answers: (Array.isArray(exam.answerKey?.part2Answers) && exam.answerKey.part2Answers.length > 0 ? exam.answerKey.part2Answers : validFallback.answerKey.part2Answers).map((ans: any, i: number) => ({
        number: ans?.number ?? i + 1,
        details: (Array.isArray(ans?.details) && ans.details.length > 0 ? ans.details : [
          { key: 'a', isCorrect: true, explain: 'Đúng theo SGK.' },
          { key: 'b', isCorrect: false, explain: 'Sai lệch so với thực tế.' },
          { key: 'c', isCorrect: true, explain: 'Đúng theo nguyên lý.' },
          { key: 'd', isCorrect: false, explain: 'Chưa đủ điều kiện.' },
        ]).map((d: any, dIdx: number) => ({
          key: d?.key ?? ['a', 'b', 'c', 'd'][dIdx % 4],
          isCorrect: typeof d?.isCorrect === 'boolean' ? d.isCorrect : dIdx % 2 === 0,
          explain: d?.explain ?? 'Giải thích chi tiết theo SGK.',
        })),
      })),
      part3Answers: (Array.isArray(exam.answerKey?.part3Answers) && exam.answerKey.part3Answers.length > 0 ? exam.answerKey.part3Answers : validFallback.answerKey.part3Answers).map((ans: any, i: number) => ({
        number: ans?.number ?? i + 1,
        answer: String(ans?.answer ?? `Đáp số ${i + 1}`),
        explain: ans?.explain ?? 'Tính toán hoặc từ khóa chuẩn theo SGK.',
      })),
      part4Rubric: (Array.isArray(exam.answerKey?.part4Rubric) && exam.answerKey.part4Rubric.length > 0 ? exam.answerKey.part4Rubric : validFallback.answerKey.part4Rubric).map((r: any, i: number) => ({
        number: r?.number ?? i + 1,
        steps: (Array.isArray(r?.steps) && r.steps.length > 0 ? r.steps : [
          { content: 'Nêu đúng lý thuyết định luật', score: 0.5 },
          { content: 'Giải thích hoặc thực hiện phép tính', score: 0.5 },
          { content: 'Kết luận chuẩn xác', score: 0.5 },
        ]).map((st: any) => ({
          content: st?.content ?? 'Nội dung bước làm bài',
          score: Number(st?.score ?? 0.5),
        })),
        total: Number(r?.total ?? 1.5),
      })),
    },
  };
}

export const ExamGeneratorView: React.FC<ExamGeneratorViewProps> = ({
  currentExam,
  setCurrentExam,
  settings,
  onSaveToRepo,
}) => {
  // Ensure currentExam is 100% valid and never causes rendering errors
  const safeExam = sanitizeExamDocument(currentExam, sampleExamDocument);

  // Tabs: 1. Ma trận, 2. Bản đặc tả, 3. Đề kiểm tra, 4. Đáp án & Hướng dẫn chấm
  const [activeTab, setActiveTab] = useState<'matrix' | 'spec' | 'paper' | 'answers'>('matrix');

  // Form State
  const [schoolLevel, setSchoolLevel] = useState<SchoolLevel>(safeExam.meta.schoolLevel || 'THPT');
  const [subject, setSubject] = useState(safeExam.meta.subject || 'Khoa học tự nhiên');
  const [grade, setGrade] = useState(safeExam.meta.grade || 'Lớp 10');
  const [duration, setDuration] = useState(safeExam.meta.duration || '45 phút');
  const [scope, setScope] = useState(
    safeExam.meta.scope || 'Chủ đề: Khái quát thế giới sống & Sinh học tế bào'
  );
  const [objectives, setObjectives] = useState('');

  // Cognitive Levels (% Know, Understand, Apply)
  const [knowRatio, setKnowRatio] = useState<number>(40);
  const [understandRatio, setUnderstandRatio] = useState<number>(30);
  const [applyRatio, setApplyRatio] = useState<number>(30);

  const ratioTotal = knowRatio + understandRatio + applyRatio;
  const isRatioValid = ratioTotal === 100;

  // Question Types Configuration (CV 7991 Standard)
  const [mcqScore, setMcqScore] = useState<number>(3.0);
  const [trueFalseScore, setTrueFalseScore] = useState<number>(2.0);
  const [shortAnswerScore, setShortAnswerScore] = useState<number>(2.0);
  const [essayScore, setEssayScore] = useState<number>(3.0);

  const totalExamScore = mcqScore + trueFalseScore + shortAnswerScore + essayScore;
  const isScoreValid = Math.abs(totalExamScore - 10.0) < 0.05;

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedAnswers, setCopiedAnswers] = useState(false);
  const [copiedExamLink, setCopiedExamLink] = useState(false);
  const [showInlineAnswers, setShowInlineAnswers] = useState<boolean>(true);

  // Direct Exam Sharing Handler
  const handleShareExamDirect = () => {
    const url = `${window.location.origin}/?exam=${encodeURIComponent(safeExam.id)}`;
    navigator.clipboard.writeText(url);
    setCopiedExamLink(true);
    setTimeout(() => setCopiedExamLink(false), 2500);
    if (onSaveToRepo) {
      onSaveToRepo(safeExam);
    }
  };

  // Lists
  const thcsSubjects = ['Khoa học tự nhiên', 'Toán học', 'Ngữ văn', 'Lịch sử và Địa lí', 'Tin học', 'Tiếng Anh'];
  const thptSubjects = ['Khoa học tự nhiên (Sinh học)', 'Khoa học tự nhiên (Vật lí)', 'Khoa học tự nhiên (Hóa học)', 'Toán học', 'Ngữ văn', 'Lịch sử', 'Địa lí', 'Tin học'];
  const currentSubjects = schoolLevel === 'THCS' ? thcsSubjects : thptSubjects;
  const gradeOptions = schoolLevel === 'THCS' ? ['Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9'] : ['Lớp 10', 'Lớp 11', 'Lớp 12'];

  // Handle Generate with AI
  const handleGenerateExam = async () => {
    setErrorMsg(null);
    if (!isRatioValid) {
      setErrorMsg('Tổng tỉ lệ mức độ nhận thức phải bằng 100%!');
      return;
    }
    if (!isScoreValid) {
      setErrorMsg('Tổng điểm của bài kiểm tra phải bằng 10,0 điểm!');
      return;
    }
    if (!scope.trim()) {
      setErrorMsg('Vui lòng nhập phạm vi kiến thức kiểm tra!');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/generate-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolLevel,
          subject,
          grade,
          duration,
          scope,
          objectives,
          cognitiveRatio: {
            know: knowRatio,
            understand: understandRatio,
            apply: applyRatio,
          },
          structure: {
            multipleChoice: { score: mcqScore },
            trueFalse: { score: trueFalseScore },
            shortAnswer: { score: shortAnswerScore },
            essay: { score: essayScore },
          },
        }),
      });

      const rawText = await response.text();
      let generatedData: any;
      try {
        generatedData = JSON.parse(rawText);
      } catch {
        throw new Error('Máy chủ phản hồi không đúng định dạng JSON. Vui lòng thử lại hoặc dùng đề mẫu KHTN 10!');
      }

      if (!response.ok || generatedData?.error) {
        throw new Error(generatedData?.error || 'Lỗi tạo đề thi từ máy chủ.');
      }
      const rawNewExam = {
        id: 'exam-' + Date.now(),
        title: generatedData.title || `ĐỀ KIỂM TRA ĐỊNH KÌ MÔN ${subject.toUpperCase()} - ${grade.toUpperCase()}`,
        createdAt: new Date().toISOString(),
        meta: {
          subject,
          grade,
          schoolLevel,
          duration,
          scope,
          totalScore: 10.0,
          ratio: `Biết ${knowRatio}% - Hiểu ${understandRatio}% - Vận dụng ${applyRatio}%`,
          schoolName: settings.schoolName,
          teacherName: settings.teacherName,
        },
        matrix: generatedData.matrix || safeExam.matrix,
        specification: generatedData.specification || safeExam.specification,
        examPaper: generatedData.examPaper || safeExam.examPaper,
        answerKey: generatedData.answerKey || safeExam.answerKey,
      };

      const newExam = sanitizeExamDocument(rawNewExam, safeExam);

      setCurrentExam(newExam);
      setActiveTab('paper');
      setShowInlineAnswers(true);

      if (onSaveToRepo) {
        onSaveToRepo(newExam);
      }
    } catch (err: any) {
      console.error('Lỗi tạo đề kiểm tra AI:', err);
      setErrorMsg(err.message || 'Không thể tạo đề kiểm tra. Vui lòng kiểm tra lại kết nối.');
    } finally {
      setLoading(false);
    }
  };

  // Load benchmark sample
  const handleLoadSample = () => {
    const sample = sanitizeExamDocument(sampleExamDocument, sampleExamDocument);
    setCurrentExam(sample);
    setSchoolLevel(sample.meta.schoolLevel);
    setSubject(sample.meta.subject);
    setGrade(sample.meta.grade);
    setDuration(sample.meta.duration);
    setScope(sample.meta.scope);
    setActiveTab('paper');
    setShowInlineAnswers(true);
    setErrorMsg(null);
  };

  // Export DOCX
  const handleExportDocx = async () => {
    try {
      await exportExamToDocx(safeExam, settings);
    } catch (err: any) {
      alert('Không thể xuất file Word: ' + err.message);
    }
  };

  // Copy Answers & Rubric
  const handleCopyAnswers = () => {
    const text = `
ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM: ${safeExam.title}

A. ĐÁP ÁN PHẦN I (Trắc nghiệm nhiều lựa chọn - 0,25đ/câu)
${(safeExam.answerKey?.part1Answers ?? []).map((a) => `Câu ${a.number}: ${a.answer}${a.explain ? ' (' + a.explain + ')' : ''}`).join('\n')}

B. ĐÁP ÁN PHẦN II (Trắc nghiệm Đúng - Sai)
${(safeExam.answerKey?.part2Answers ?? [])
  .map(
    (ans) =>
      `Câu ${ans.number}:\n` +
      (ans.details ?? []).map((d) => `  ${d.key}) ${d.isCorrect ? 'ĐÚNG' : 'SAI'}${d.explain ? ' - ' + d.explain : ''}`).join('\n')
  )
  .join('\n')}

C. ĐÁP ÁN PHẦN III (Trả lời ngắn - 0,5đ/câu)
${(safeExam.answerKey?.part3Answers ?? []).map((ans) => `Câu ${ans.number}: ${ans.answer}${ans.explain ? ' (' + ans.explain + ')' : ''}`).join('\n')}

D. BAREM CHẤM ĐIỂM PHẦN IV (Tự luận)
${(safeExam.answerKey?.part4Rubric ?? [])
  .map(
    (r) =>
      `Câu ${r.number} (${r.total} điểm):\n` +
      (r.steps ?? []).map((st) => `  - ${st.content}: [${st.score}đ]`).join('\n')
  )
  .join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopiedAnswers(true);
    setTimeout(() => setCopiedAnswers(false), 2000);
  };

  // Copy Exam Paper
  const handleCopyPaper = () => {
    const text = `
${safeExam.title}
Thời gian: ${safeExam.meta.duration} | Tỉ lệ: ${safeExam.meta.ratio}

${safeExam.examPaper.part1.title}
${safeExam.examPaper.part1.instruction}
${(safeExam.examPaper.part1.questions ?? [])
  .map((q) => `Câu ${q.number}: ${q.question}\n${(q.options ?? []).join('\n')}`)
  .join('\n\n')}

${safeExam.examPaper.part2.title}
${safeExam.examPaper.part2.instruction}
${(safeExam.examPaper.part2.questions ?? [])
  .map(
    (q) =>
      `Câu ${q.number}: ${q.context}\n${(q.subQuestions ?? [])
        .map((s) => `${s.key}) ${s.text}`)
        .join('\n')}`
  )
  .join('\n\n')}

${safeExam.examPaper.part3.title}
${safeExam.examPaper.part3.instruction}
${(safeExam.examPaper.part3.questions ?? [])
  .map((q) => `Câu ${q.number}: ${q.question}`)
  .join('\n\n')}

${safeExam.examPaper.part4.title}
${safeExam.examPaper.part4.instruction}
${(safeExam.examPaper.part4.questions ?? [])
  .map((q) => `Câu ${q.number} (${q.score} điểm): ${q.question}`)
  .join('\n\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Tạo Ma Trận, Đặc Tả & Đề Kiểm Tra Định Kì
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold border border-blue-200">
              Công văn 7991/BGDĐT-GDTrH (17/12/2024)
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Quy chuẩn kiểm tra đánh giá định kì mới: Ma trận (Phụ lục 1), Bản đặc tả (Phụ lục 2),
            đề thi 4 dạng thức (Nhiều lựa chọn, Đúng-Sai 4 ý, Trả lời ngắn, Tự luận) và barem chấm điểm chi tiết.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleLoadSample}
            className="btn-3d-teal px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5"
            title="Nạp đề thi chuẩn CV 7991 môn KHTN Lớp 10"
          >
            <Zap className="w-4 h-4" />
            Nạp đề mẫu KHTN 10
          </button>
          <button
            onClick={handleExportDocx}
            className="btn-3d-blue px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            Xuất trọn bộ DOCX
          </button>
        </div>
      </div>

      {/* Main Grid: Form Left (5 cols) & Content Right (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Exam Spec Configuration */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Sliders className="w-5 h-5 text-blue-600" />
            Cấu Hình Tham Số Đề Thi
          </h2>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Cấp học & Khối lớp */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Cấp học:</label>
              <select
                value={schoolLevel}
                onChange={(e) => {
                  const val = e.target.value as SchoolLevel;
                  setSchoolLevel(val);
                  setGrade(val === 'THCS' ? 'Lớp 6' : 'Lớp 10');
                }}
                className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-blue-500 font-medium"
              >
                <option value="THCS">THCS</option>
                <option value="THPT">THPT</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Khối lớp:</label>
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

          {/* Môn học & Thời gian */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Môn học:</label>
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
                Thời gian làm bài:
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-blue-500 font-medium"
              >
                <option value="45 phút">45 phút (Định kì)</option>
                <option value="60 phút">60 phút</option>
                <option value="90 phút">90 phút (Học kì)</option>
              </select>
            </div>
          </div>

          {/* Phạm vi kiến thức */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Phạm vi kiến thức kiểm tra <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              placeholder="VD: Khái quát thế giới sống & Sinh học tế bào"
              className="w-full text-xs sm:text-sm rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          {/* Cognitive Ratio Sliders (Biết - Hiểu - Vận dụng) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Phân bố mức độ nhận thức:
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  isRatioValid
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                Tổng: {ratioTotal}% {isRatioValid ? '✓' : '(Phải = 100%)'}
              </span>
            </div>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                  <span>Biết (Nhận biết):</span>
                  <span className="font-bold text-blue-700">{knowRatio}% ({((knowRatio * 10) / 100).toFixed(1)}đ)</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="60"
                  step="5"
                  value={knowRatio}
                  onChange={(e) => setKnowRatio(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                  <span>Hiểu (Thông hiểu):</span>
                  <span className="font-bold text-teal-700">{understandRatio}% ({((understandRatio * 10) / 100).toFixed(1)}đ)</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="50"
                  step="5"
                  value={understandRatio}
                  onChange={(e) => setUnderstandRatio(Number(e.target.value))}
                  className="w-full accent-teal-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                  <span>Vận dụng:</span>
                  <span className="font-bold text-indigo-700">{applyRatio}% ({((applyRatio * 10) / 100).toFixed(1)}đ)</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="40"
                  step="5"
                  value={applyRatio}
                  onChange={(e) => setApplyRatio(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Question types breakdown (Phụ lục CV 7991) */}
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900">
                Cấu trúc dạng thức câu hỏi (CV 7991):
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  isScoreValid ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'
                }`}
              >
                Tổng: {totalExamScore.toFixed(1)}/10,0đ
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-slate-500 font-medium">I. Nhiều lựa chọn</div>
                <div className="font-bold text-slate-800">{mcqScore.toFixed(1)}đ (12 câu)</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-slate-500 font-medium">II. Đúng - Sai (4 ý)</div>
                <div className="font-bold text-slate-800">{trueFalseScore.toFixed(1)}đ (2 câu)</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-slate-500 font-medium">III. Trả lời ngắn</div>
                <div className="font-bold text-slate-800">{shortAnswerScore.toFixed(1)}đ (4 câu)</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-slate-500 font-medium">IV. Tự luận</div>
                <div className="font-bold text-slate-800">{essayScore.toFixed(1)}đ (2 câu)</div>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 italic">
              * Tự động điều chỉnh thang điểm và dạng bài tương thích quy định bộ môn.
            </p>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateExam}
            disabled={loading || !isRatioValid || !isScoreValid}
            className="w-full btn-3d-blue py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang xây dựng ma trận & bộ đề theo CV 7991...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-teal-300" />
                <span>Tạo Toàn Bộ Tài Liệu Bằng AI</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: 4-Tab Output Viewer (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Tabs navigation */}
          <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'matrix'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              1. Ma trận đề (Phụ lục 1)
            </button>

            <button
              onClick={() => setActiveTab('spec')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'spec'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              2. Bản đặc tả (Phụ lục 2)
            </button>

            <button
              onClick={() => setActiveTab('paper')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'paper'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              3. Đề kiểm tra chính thức
            </button>

            <button
              onClick={() => setActiveTab('answers')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'answers'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>4. Đáp án & Barem chấm</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${activeTab === 'answers' ? 'bg-white text-emerald-700' : 'bg-emerald-200 text-emerald-900'}`}>
                Đầy đủ
              </span>
            </button>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between px-1">
            <div className="text-xs font-medium text-slate-500">
              Môn: <strong className="text-slate-800">{safeExam.meta.subject}</strong> | Lớp:{' '}
              <strong className="text-slate-800">{safeExam.meta.grade}</strong> | Tỉ lệ:{' '}
              <strong className="text-blue-700">{safeExam.meta.ratio}</strong>
            </div>

            <div className="flex items-center gap-2">
              {/* Share Exam Direct Link */}
              <button
                onClick={handleShareExamDirect}
                className="px-3 py-1.5 rounded-lg text-xs font-bold border border-teal-200 bg-teal-50 text-teal-800 hover:bg-teal-100 flex items-center gap-1 shadow-sm transition-colors"
                title="Sao chép đường link mở trực tiếp bộ đề kiểm tra này"
              >
                {copiedExamLink ? (
                  <Check className="w-3.5 h-3.5 text-teal-700" />
                ) : (
                  <Share2 className="w-3.5 h-3.5 text-teal-600" />
                )}
                <span>{copiedExamLink ? 'Đã chép link đề!' : 'Chia sẻ bộ đề'}</span>
              </button>

              <button
                onClick={handleCopyPaper}
                className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 flex items-center gap-1 shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Đã sao chép' : 'Sao chép đề'}
              </button>

              {onSaveToRepo && (
                <button
                  onClick={() => onSaveToRepo(safeExam)}
                  className="btn-3d-teal px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
                  title="Lưu bộ đề thi này vào kho tài liệu cá nhân"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  Lưu vào kho
                </button>
              )}
            </div>
          </div>

          {/* Tab 1: Ma Trận Đề Kiểm Tra (Phụ Lục 1 CV 7991) */}
          {activeTab === 'matrix' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4 animate-fadeIn">
              <div className="text-center pb-2 border-b border-slate-200">
                <h3 className="text-base sm:text-lg font-black text-blue-800 uppercase">
                  1. MA TRẬN ĐỀ KIỂM TRA ĐỊNH KÌ
                </h3>
                <p className="text-xs text-slate-500 italic">
                  (Kèm theo Công văn số 7991/BGDĐT-GDTrH ngày 17/12/2024 của Bộ GDĐT)
                </p>
              </div>

              {/* Matrix Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                    <tr>
                      <th className="p-2 border-r border-slate-200 text-center w-10">TT</th>
                      <th className="p-2 border-r border-slate-200">Chủ đề/Chương</th>
                      <th className="p-2 border-r border-slate-200">Nội dung/đơn vị kiến thức</th>
                      <th className="p-2 border-r border-slate-200 text-center bg-blue-50/50">
                        TNKQ Nhiều lựa chọn
                        <div className="text-[10px] text-slate-500 font-normal">B - H - VD</div>
                      </th>
                      <th className="p-2 border-r border-slate-200 text-center bg-teal-50/50">
                        TNKQ "Đúng - Sai"
                        <div className="text-[10px] text-slate-500 font-normal">B - H - VD</div>
                      </th>
                      <th className="p-2 border-r border-slate-200 text-center">
                        TNKQ Trả lời ngắn
                      </th>
                      <th className="p-2 border-r border-slate-200 text-center">Tự luận</th>
                      <th className="p-2 border-r border-slate-200 text-center">Tổng điểm</th>
                      <th className="p-2 text-center">Tỉ lệ %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {(safeExam.matrix.rows ?? []).map((row) => (
                      <tr key={row.index} className="hover:bg-slate-50/80">
                        <td className="p-2.5 text-center font-bold text-slate-700 border-r border-slate-200">
                          {row.index}
                        </td>
                        <td className="p-2.5 font-bold text-slate-900 border-r border-slate-200">
                          {row.topic}
                        </td>
                        <td className="p-2.5 text-slate-700 border-r border-slate-200">
                          {row.contentUnit}
                        </td>
                        <td className="p-2.5 text-center border-r border-slate-200 font-semibold bg-blue-50/30">
                          {row.multipleChoice?.know ?? 0} - {row.multipleChoice?.understand ?? 0} -{' '}
                          {row.multipleChoice?.apply ?? 0}
                        </td>
                        <td className="p-2.5 text-center border-r border-slate-200 font-semibold bg-teal-50/30">
                          {row.trueFalse?.know ?? 0} - {row.trueFalse?.understand ?? 0} - {row.trueFalse?.apply ?? 0}
                        </td>
                        <td className="p-2.5 text-center border-r border-slate-200 font-semibold">
                          {(row.shortAnswer?.know ?? 0) + (row.shortAnswer?.understand ?? 0) + (row.shortAnswer?.apply ?? 0)}
                        </td>
                        <td className="p-2.5 text-center border-r border-slate-200 font-semibold">
                          {(row.essay?.know ?? 0) + (row.essay?.understand ?? 0) + (row.essay?.apply ?? 0)}
                        </td>
                        <td className="p-2.5 text-center border-r border-slate-200 font-bold text-blue-700">
                          {Number(row.totalScore ?? 0).toFixed(1)}đ
                        </td>
                        <td className="p-2.5 text-center font-bold text-slate-800">
                          {row.percent}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-100 font-extrabold text-slate-900 border-t-2 border-slate-300">
                    <tr>
                      <td colSpan={3} className="p-2.5 text-right border-r border-slate-200">
                        Tổng điểm & Tỉ lệ chung:
                      </td>
                      <td className="p-2.5 text-center border-r border-slate-200 text-blue-700">
                        {Number(safeExam.matrix.summary?.multipleChoiceScore ?? 3).toFixed(1)}đ (30%)
                      </td>
                      <td className="p-2.5 text-center border-r border-slate-200 text-teal-700">
                        {Number(safeExam.matrix.summary?.trueFalseScore ?? 2).toFixed(1)}đ (20%)
                      </td>
                      <td className="p-2.5 text-center border-r border-slate-200">
                        {Number(safeExam.matrix.summary?.shortAnswerScore ?? 2).toFixed(1)}đ (20%)
                      </td>
                      <td className="p-2.5 text-center border-r border-slate-200">
                        {Number(safeExam.matrix.summary?.essayScore ?? 3).toFixed(1)}đ (30%)
                      </td>
                      <td className="p-2.5 text-center border-r border-slate-200 text-emerald-700">
                        10,0đ
                      </td>
                      <td className="p-2.5 text-center text-emerald-700">100%</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Explanatory notes according to official foot-notes in CV 7991 */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <p>
                  <strong>* Ghi chú chuẩn Công văn 7991/BGDĐT-GDTrH:</strong>
                </p>
                <p>
                  - Mức độ nhận thức: Biết ({Number(safeExam.matrix.summary?.knowScore ?? 4).toFixed(1)}đ ~ 40%),
                  Hiểu ({Number(safeExam.matrix.summary?.understandScore ?? 3).toFixed(1)}đ ~ 30%), Vận dụng (
                  {Number(safeExam.matrix.summary?.applyScore ?? 3).toFixed(1)}đ ~ 30%).
                </p>
                <p>
                  - Mỗi câu hỏi Đúng - Sai bao gồm 4 ý nhỏ (a, b, c, d); thí sinh phải chọn đúng hoặc sai cho từng ý.
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Bản Đặc Tả (Phụ Lục 2 CV 7991) */}
          {activeTab === 'spec' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4 animate-fadeIn">
              <div className="text-center pb-2 border-b border-slate-200">
                <h3 className="text-base sm:text-lg font-black text-blue-800 uppercase">
                  2. BẢN ĐẶC TẢ ĐỀ KIỂM TRA ĐỊNH KÌ
                </h3>
                <p className="text-xs text-slate-500 italic">
                  (Theo Phụ lục 2 - Công văn 7991/BGDĐT-GDTrH)
                </p>
              </div>

              <div className="space-y-4">
                {(safeExam.specification.rows ?? []).map((row) => (
                  <div
                    key={row.index}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="font-extrabold text-blue-800 text-sm">
                        {row.index}. {row.topic}
                      </span>
                      <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                        {row.contentUnit}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs sm:text-sm text-slate-800">
                      <div>
                        <span className="font-bold text-blue-700">Mức độ Biết (Nhận biết): </span>
                        <div className="whitespace-pre-line pl-2 text-slate-600 mt-0.5">
                          {row.learningOutcomes?.know ?? 'Nhận biết kiến thức cốt lõi.'}
                        </div>
                      </div>

                      <div>
                        <span className="font-bold text-teal-700">Mức độ Hiểu (Thông hiểu): </span>
                        <div className="whitespace-pre-line pl-2 text-slate-600 mt-0.5">
                          {row.learningOutcomes?.understand ?? 'Hiểu và phân tích hiện tượng.'}
                        </div>
                      </div>

                      <div>
                        <span className="font-bold text-indigo-700">Mức độ Vận dụng: </span>
                        <div className="whitespace-pre-line pl-2 text-slate-600 mt-0.5">
                          {row.learningOutcomes?.apply ?? 'Vận dụng kiến thức vào thực tế.'}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 text-xs text-slate-500 font-medium">
                      <strong>Phân bố câu hỏi: </strong>
                      <span>TNKQ: {row.questionDistribution?.multipleChoice ?? 'Biết 1-6; Hiểu 7-12'} | </span>
                      <span>Đúng-Sai: {row.questionDistribution?.trueFalse ?? 'Hiểu C1; VD C2'} | </span>
                      <span>Ngắn: {row.questionDistribution?.shortAnswer ?? 'Biết C1-2; Hiểu C3-4'} | </span>
                      <span>Tự luận: {row.questionDistribution?.essay ?? 'Vận dụng C1-2'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Đề Kiểm Tra Chính Thức */}
          {activeTab === 'paper' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn font-sans">
              {/* Header paper box */}
              <div className="grid grid-cols-2 text-xs font-semibold border-b border-slate-200 pb-4">
                <div>
                  <p className="font-bold text-slate-900 uppercase">
                    {settings.schoolName || safeExam.meta.schoolName || 'TRƯỜNG THCS/THPT'}
                  </p>
                  <p className="text-slate-500">Năm học 2024 - 2025</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-700 uppercase">ĐỀ KIỂM TRA ĐỊNH KÌ</p>
                  <p className="text-slate-500">Môn: {safeExam.meta.subject} - {safeExam.meta.grade}</p>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-lg font-black text-slate-900 uppercase">
                  {safeExam.title}
                </h3>
                <p className="text-xs text-slate-500 italic mt-0.5">
                  Thời gian làm bài: {safeExam.meta.duration} (Không kể thời gian phát đề)
                </p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mt-3 text-xs text-slate-600 flex justify-between">
                  <span>Họ và tên thí sinh: ................................................................</span>
                  <span>Lớp: ................. SBD: ................</span>
                </div>
              </div>

              {/* Phần I: Nhiều lựa chọn */}
              <div className="space-y-3 pt-2">
                <div className="bg-blue-50/70 p-2.5 rounded-xl border border-blue-200">
                  <h4 className="font-bold text-blue-900 text-xs sm:text-sm">
                    {safeExam.examPaper.part1.title}
                  </h4>
                  <p className="text-xs text-blue-700 italic">
                    {safeExam.examPaper.part1.instruction}
                  </p>
                </div>

                <div className="space-y-4 pl-1 text-xs sm:text-sm text-slate-800">
                  {(safeExam.examPaper.part1.questions ?? []).map((q) => (
                    <div key={q.number} className="space-y-1.5">
                      <p className="font-semibold">
                        <span className="text-blue-700 font-bold">Câu {q.number}: </span>
                        {q.question}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-3 text-slate-700">
                        {(q.options ?? []).map((opt, i) => (
                          <div key={i}>{opt}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Phần II: Đúng - Sai */}
              <div className="space-y-3 pt-2">
                <div className="bg-teal-50/70 p-2.5 rounded-xl border border-teal-200">
                  <h4 className="font-bold text-teal-900 text-xs sm:text-sm">
                    {safeExam.examPaper.part2.title}
                  </h4>
                  <p className="text-xs text-teal-700 italic">
                    {safeExam.examPaper.part2.instruction}
                  </p>
                </div>

                <div className="space-y-4 pl-1 text-xs sm:text-sm text-slate-800">
                  {(safeExam.examPaper.part2.questions ?? []).map((q) => (
                    <div key={q.number} className="space-y-2">
                      <p className="font-semibold">
                        <span className="text-teal-700 font-bold">Câu {q.number}: </span>
                        {q.context}
                      </p>
                      <div className="space-y-1.5 pl-3">
                        {(q.subQuestions ?? []).map((sub) => (
                          <div key={sub.key} className="flex items-start gap-2">
                            <span className="font-bold text-slate-900">{sub.key})</span>
                            <span className="text-slate-700">{sub.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Phần III: Trả lời ngắn */}
              <div className="space-y-3 pt-2">
                <div className="bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-200">
                  <h4 className="font-bold text-indigo-900 text-xs sm:text-sm">
                    {safeExam.examPaper.part3.title}
                  </h4>
                  <p className="text-xs text-indigo-700 italic">
                    {safeExam.examPaper.part3.instruction}
                  </p>
                </div>

                <div className="space-y-3 pl-1 text-xs sm:text-sm text-slate-800">
                  {(safeExam.examPaper.part3.questions ?? []).map((q) => (
                    <div key={q.number} className="space-y-1">
                      <p className="font-semibold">
                        <span className="text-indigo-700 font-bold">Câu {q.number}: </span>
                        {q.question}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Phần IV: Tự luận */}
              <div className="space-y-3 pt-2">
                <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-300">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                    {safeExam.examPaper.part4.title}
                  </h4>
                  <p className="text-xs text-slate-600 italic">
                    {safeExam.examPaper.part4.instruction}
                  </p>
                </div>

                <div className="space-y-4 pl-1 text-xs sm:text-sm text-slate-800">
                  {(safeExam.examPaper.part4.questions ?? []).map((q) => (
                    <div key={q.number} className="space-y-1">
                      <p className="font-semibold">
                        <span className="text-slate-900 font-bold">
                          Câu {q.number} ({q.score} điểm):{' '}
                        </span>
                        {q.question}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center pt-4 border-t border-slate-200 text-xs font-bold text-slate-400">
                ---------------- HẾT ----------------
              </div>

              {/* Callout & Inline Answers Section */}
              <div className="mt-6 space-y-5 pt-4 border-t-2 border-dashed border-emerald-300">
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-extrabold text-sm text-emerald-950">
                        ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM CHI TIẾT (CHUẨN CÔNG VĂN 7991)
                      </h4>
                      <p className="text-xs text-emerald-700">
                        Hệ thống đã tạo sẵn toàn bộ đáp án 4 phần: Trắc nghiệm, Đúng-Sai 4 ý, Trả lời ngắn & Barem tự luận.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowInlineAnswers(!showInlineAnswers)}
                      className="px-3 py-1.5 rounded-xl border border-emerald-400 bg-white text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1"
                    >
                      {showInlineAnswers ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showInlineAnswers ? 'Thu gọn đáp án' : 'Mở rộng đáp án'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('answers')}
                      className="btn-3d-teal px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1"
                    >
                      <span>Xem tại Tab 4</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {showInlineAnswers && (
                  <div className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200 space-y-6 animate-fadeIn">
                    {/* Phần I Đáp án */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-blue-900 text-xs sm:text-sm">
                          A. ĐÁP ÁN PHẦN I (Trắc nghiệm nhiều lựa chọn - 0,25đ/câu)
                        </span>
                        <span className="text-[11px] text-blue-700 font-bold bg-blue-100 px-2 py-0.5 rounded-full">
                          12 câu • 3,0 điểm
                        </span>
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs">
                        {(safeExam.answerKey?.part1Answers ?? []).map((a) => (
                          <div
                            key={a.number}
                            className="p-2 rounded-xl bg-white border border-blue-200 text-center shadow-xs"
                          >
                            <div className="text-slate-500 font-medium">Câu {a.number}</div>
                            <div className="text-base font-black text-blue-700">{a.answer}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Phần II Đáp án */}
                    <div className="space-y-2 pt-2 border-t border-emerald-200">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-teal-900 text-xs sm:text-sm">
                          B. ĐÁP ÁN PHẦN II (Trắc nghiệm Đúng - Sai)
                        </span>
                        <span className="text-[11px] text-teal-800 font-bold bg-teal-100 px-2 py-0.5 rounded-full">
                          2 câu • 2,0 điểm
                        </span>
                      </div>
                      <div className="space-y-2.5">
                        {(safeExam.answerKey?.part2Answers ?? []).map((ans) => (
                          <div key={ans.number} className="p-3 rounded-xl border border-teal-200 bg-white text-xs space-y-1.5 shadow-xs">
                            <span className="font-bold text-slate-900">Câu {ans.number}:</span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {(ans.details ?? []).map((d) => (
                                <div
                                  key={d.key}
                                  className={`p-2 rounded-lg border font-bold text-center ${
                                    d.isCorrect
                                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                                      : 'bg-red-50 border-red-300 text-red-700'
                                  }`}
                                >
                                  <span>Ý {d.key}: </span>
                                  <span>{d.isCorrect ? 'ĐÚNG' : 'SAI'}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Phần III Đáp án */}
                    <div className="space-y-2 pt-2 border-t border-emerald-200">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-indigo-900 text-xs sm:text-sm">
                          C. ĐÁP ÁN PHẦN III (Trả lời ngắn - 0,5đ/câu)
                        </span>
                        <span className="text-[11px] text-indigo-800 font-bold bg-indigo-100 px-2 py-0.5 rounded-full">
                          4 câu • 2,0 điểm
                        </span>
                      </div>
                      <div className="space-y-2">
                        {(safeExam.answerKey?.part3Answers ?? []).map((ans) => (
                          <div
                            key={ans.number}
                            className="p-2.5 rounded-xl border border-indigo-200 bg-white text-xs flex items-center justify-between shadow-xs"
                          >
                            <div>
                              <span className="font-bold text-slate-800">Câu {ans.number}: </span>
                              <span className="font-black text-indigo-700 text-sm">{ans.answer}</span>
                            </div>
                            {ans.explain && (
                              <span className="text-slate-500 italic text-[11px]">{ans.explain}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Phần IV Barem tự luận */}
                    <div className="space-y-2 pt-2 border-t border-emerald-200">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900 text-xs sm:text-sm">
                          D. BAREM CHẤM ĐIỂM PHẦN IV (Tự luận)
                        </span>
                        <span className="text-[11px] text-slate-800 font-bold bg-slate-200 px-2 py-0.5 rounded-full">
                          2 câu • 3,0 điểm
                        </span>
                      </div>
                      <div className="space-y-2.5">
                        {(safeExam.answerKey?.part4Rubric ?? []).map((r) => (
                          <div
                            key={r.number}
                            className="p-3.5 rounded-xl border border-slate-200 bg-white text-xs space-y-2 shadow-xs"
                          >
                            <div className="flex justify-between font-bold text-slate-900">
                              <span>Câu {r.number}</span>
                              <span className="text-blue-700">Tổng: {r.total} điểm</span>
                            </div>
                            <div className="space-y-1.5 pl-2">
                              {(r.steps ?? []).map((st, i) => (
                                <div key={i} className="flex justify-between text-slate-700 border-b border-slate-100 pb-1">
                                  <span>- {st.content}</span>
                                  <span className="font-bold text-emerald-700 ml-2">
                                    {st.score}đ
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 4: Đáp Án & Hướng Dẫn Chấm */}
          {activeTab === 'answers' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-emerald-800 uppercase flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>4. ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM CHI TIẾT</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Đầy đủ 4 phần chuẩn Công văn 7991/BGDĐT-GDTrH: TN nhiều lựa chọn, Đúng-Sai 4 ý, Trả lời ngắn, Barem tự luận.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyAnswers}
                    className="px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100 flex items-center gap-1.5 transition-colors"
                  >
                    {copiedAnswers ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedAnswers ? 'Đã sao chép đáp án' : 'Sao chép đáp án'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleExportDocx}
                    className="btn-3d-blue px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Xuất file Word</span>
                  </button>
                </div>
              </div>

              {/* Part 1 answers */}
              <div className="space-y-2">
                <h4 className="font-bold text-blue-900 text-sm">
                  A. ĐÁP ÁN PHẦN I (Trắc nghiệm nhiều lựa chọn - 0,25đ/câu)
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs">
                  {(safeExam.answerKey?.part1Answers ?? []).map((a) => (
                    <div
                      key={a.number}
                      className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-center"
                    >
                      <div className="text-slate-500 font-medium">Câu {a.number}</div>
                      <div className="text-base font-extrabold text-blue-700">{a.answer}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Part 2 answers */}
              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-teal-900 text-sm">
                  B. ĐÁP ÁN PHẦN II (Trắc nghiệm Đúng - Sai)
                </h4>
                <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-200 text-xs text-teal-800 mb-2">
                  * Quy tắc tính điểm: Đúng 1 ý: 0,1đ | Đúng 2 ý: 0,25đ | Đúng 3 ý: 0,5đ | Đúng cả 4 ý: 1,0đ.
                </div>
                <div className="space-y-3">
                  {(safeExam.answerKey?.part2Answers ?? []).map((ans) => (
                    <div key={ans.number} className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1.5">
                      <span className="font-bold text-slate-900">Câu {ans.number}:</span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {(ans.details ?? []).map((d) => (
                          <div
                            key={d.key}
                            className={`p-2 rounded-lg border font-bold text-center ${
                              d.isCorrect
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                                : 'bg-red-50 border-red-300 text-red-700'
                            }`}
                          >
                            <span>Ý {d.key}: </span>
                            <span>{d.isCorrect ? 'ĐÚNG' : 'SAI'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Part 3 answers */}
              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-indigo-900 text-sm">
                  C. ĐÁP ÁN PHẦN III (Trả lời ngắn - 0,5đ/câu)
                </h4>
                <div className="space-y-2">
                  {(safeExam.answerKey?.part3Answers ?? []).map((ans) => (
                    <div
                      key={ans.number}
                      className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-slate-800">Câu {ans.number}: </span>
                        <span className="font-black text-indigo-700 text-sm">{ans.answer}</span>
                      </div>
                      {ans.explain && (
                        <span className="text-slate-500 italic text-[11px]">{ans.explain}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Part 4 rubric */}
              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-slate-900 text-sm">
                  D. BAREM CHẤM ĐIỂM PHẦN IV (TỰ LUẬN)
                </h4>
                <div className="space-y-3">
                  {(safeExam.answerKey?.part4Rubric ?? []).map((r) => (
                    <div
                      key={r.number}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-2"
                    >
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>Câu {r.number}</span>
                        <span className="text-blue-700">Tổng: {r.total} điểm</span>
                      </div>
                      <div className="space-y-1.5 pl-2">
                        {(r.steps ?? []).map((st, i) => (
                          <div key={i} className="flex justify-between text-slate-700 border-b border-slate-200/60 pb-1">
                            <span>- {st.content}</span>
                            <span className="font-bold text-emerald-700 ml-2">
                              {st.score}đ
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
