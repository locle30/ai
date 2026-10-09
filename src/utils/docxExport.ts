import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  HeadingLevel,
  UnderlineType,
} from 'docx';
import { AppSettings, ExamDocument, LessonPlan } from '../types';

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 200);
}

const tableBorderLight = {
  top: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
  bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
  left: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
  right: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
};

export async function exportLessonPlanToDocx(lesson: LessonPlan, settings?: AppSettings) {
  const schoolName = settings?.schoolName || lesson.meta.schoolName || 'TRƯỜNG THCS/THPT';
  const teacherName = settings?.teacherName || lesson.meta.teacherName || 'Giáo viên bộ môn';

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Times New Roman',
            size: 26, // 13pt
            color: '111827',
          },
          paragraph: {
            spacing: {
              line: 276, // 1.15 line spacing
              after: 120,
            },
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1134, // ~2cm
              bottom: 1134,
              left: 1417, // ~2.5cm
              right: 1134,
            },
          },
        },
        children: [
          // Header table: School & Department
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({ text: schoolName.toUpperCase(), bold: true, size: 24 }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: `Tổ: ${settings?.department || 'Khoa học tự nhiên'}`,
                            italics: true,
                            size: 22,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM',
                            bold: true,
                            size: 22,
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: 'Độc lập - Tự do - Hạnh phúc',
                            bold: true,
                            underline: { type: UnderlineType.SINGLE },
                            size: 22,
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 200, after: 100 } }),

          // Document Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.TITLE,
            children: [
              new TextRun({
                text: 'KẾ HOẠCH BÀI DẠY (GIÁO ÁN)',
                bold: true,
                size: 32, // 16pt
                color: '1E3A8A',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: lesson.title.replace(/^KẾ HOẠCH BÀI DẠY:\s*/i, '').toUpperCase(),
                bold: true,
                size: 28, // 14pt
                color: '2563EB',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `Môn: ${lesson.meta.subject} | Lớp: ${lesson.meta.grade} | Bộ sách: Kết nối tri thức với cuộc sống`,
                italics: true,
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `Thời lượng: ${lesson.meta.duration} | GV: ${teacherName}`,
                italics: true,
                size: 22,
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 240, after: 100 } }),

          // I. MỤC TIÊU
          new Paragraph({
            children: [
              new TextRun({
                text: 'I. MỤC TIÊU',
                bold: true,
                size: 28,
                color: '1E40AF',
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({ text: '1. Về kiến thức:', bold: true }),
            ],
          }),
          ...lesson.objectives.knowledge.map(
            (k) =>
              new Paragraph({
                bullet: { level: 0 },
                children: [new TextRun({ text: k })],
              })
          ),

          new Paragraph({
            children: [
              new TextRun({ text: '2. Về năng lực:', bold: true }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'a) Năng lực chung:', italics: true, bold: true }),
            ],
          }),
          ...lesson.objectives.generalCompetencies.map(
            (gc) =>
              new Paragraph({
                bullet: { level: 0 },
                children: [new TextRun({ text: gc })],
              })
          ),
          new Paragraph({
            children: [
              new TextRun({ text: 'b) Năng lực đặc thù:', italics: true, bold: true }),
            ],
          }),
          ...lesson.objectives.specificCompetencies.map(
            (sc) =>
              new Paragraph({
                bullet: { level: 0 },
                children: [new TextRun({ text: sc })],
              })
          ),

          new Paragraph({
            children: [
              new TextRun({ text: '3. Về phẩm chất:', bold: true }),
            ],
          }),
          ...lesson.objectives.qualities.map(
            (q) =>
              new Paragraph({
                bullet: { level: 0 },
                children: [new TextRun({ text: q })],
              })
          ),

          new Paragraph({ spacing: { before: 200, after: 100 } }),

          // II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU
          new Paragraph({
            children: [
              new TextRun({
                text: 'II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU',
                bold: true,
                size: 28,
                color: '1E40AF',
              }),
            ],
          }),
          new Paragraph({
            children: [new TextRun({ text: '1. Đối với giáo viên:', bold: true })],
          }),
          ...lesson.equipment.teacher.map(
            (t) =>
              new Paragraph({
                bullet: { level: 0 },
                children: [new TextRun({ text: t })],
              })
          ),
          new Paragraph({
            children: [new TextRun({ text: '2. Đối với học sinh:', bold: true })],
          }),
          ...lesson.equipment.student.map(
            (s) =>
              new Paragraph({
                bullet: { level: 0 },
                children: [new TextRun({ text: s })],
              })
          ),

          new Paragraph({ spacing: { before: 200, after: 100 } }),

          // III. TIẾN TRÌNH DẠY HỌC
          new Paragraph({
            children: [
              new TextRun({
                text: 'III. TIẾN TRÌNH DẠY HỌC (CHUẨN CÔNG VĂN 5512)',
                bold: true,
                size: 28,
                color: '1E40AF',
              }),
            ],
          }),

          ...lesson.activities.flatMap((act, idx) => [
            new Paragraph({
              spacing: { before: 180, after: 80 },
              children: [
                new TextRun({
                  text: `${act.name} (Thời lượng: ${act.duration})`,
                  bold: true,
                  size: 26,
                  color: '0F766E',
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'a) Mục tiêu: ', bold: true }),
                new TextRun({ text: act.objective }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'b) Nội dung: ', bold: true }),
                new TextRun({ text: act.content }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'c) Sản phẩm: ', bold: true }),
                new TextRun({ text: act.product }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'd) Tổ chức thực hiện: ', bold: true }),
              ],
            }),
            new Paragraph({
              bullet: { level: 0 },
              children: [
                new TextRun({ text: 'Bước 1: Chuyển giao nhiệm vụ: ', bold: true, italics: true }),
                new TextRun({ text: act.implementation.step1.replace(/^Bước 1:\s*Chuyển giao nhiệm vụ:\s*/i, '') }),
              ],
            }),
            new Paragraph({
              bullet: { level: 0 },
              children: [
                new TextRun({ text: 'Bước 2: Thực hiện nhiệm vụ: ', bold: true, italics: true }),
                new TextRun({ text: act.implementation.step2.replace(/^Bước 2:\s*Thực hiện nhiệm vụ:\s*/i, '') }),
              ],
            }),
            new Paragraph({
              bullet: { level: 0 },
              children: [
                new TextRun({ text: 'Bước 3: Báo cáo, thảo luận: ', bold: true, italics: true }),
                new TextRun({ text: act.implementation.step3.replace(/^Bước 3:\s*Báo cáo, thảo luận:\s*/i, '') }),
              ],
            }),
            new Paragraph({
              bullet: { level: 0 },
              children: [
                new TextRun({ text: 'Bước 4: Kết luận, nhận định: ', bold: true, italics: true }),
                new TextRun({ text: act.implementation.step4.replace(/^Bước 4:\s*Kết luận, nhận định:\s*/i, '') }),
              ],
            }),
          ]),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const cleanTitle = lesson.title.replace(/[^a-zA-Z0-9\u00C0-\u1EF9]/g, '_').substring(0, 40);
  saveBlob(blob, `GiaoAn_${cleanTitle}.docx`);
}

export async function exportExamToDocx(exam: ExamDocument, settings?: AppSettings) {
  const schoolName = settings?.schoolName || exam.meta.schoolName || 'TRƯỜNG THCS/THPT';
  const teacherName = settings?.teacherName || exam.meta.teacherName || 'Giáo viên ra đề';

  // Build matrix rows for table
  const matrixHeaderRow = new TableRow({
    children: [
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'TT', bold: true })] })] }),
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Chủ đề / Chương', bold: true })] })] }),
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Nội dung / Đơn vị kiến thức', bold: true })] })] }),
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'TNKQ Nhiều lựa chọn (Biết/Hiểu/VD)', bold: true })] })] }),
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'TNKQ Đúng-Sai (Biết/Hiểu/VD)', bold: true })] })] }),
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'TNKQ Trả lời ngắn', bold: true })] })] }),
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Tự luận', bold: true })] })] }),
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Tổng điểm', bold: true })] })] }),
      new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Tỉ lệ %', bold: true })] })] }),
    ],
  });

  const matrixBodyRows = exam.matrix.rows.map(
    (r) =>
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: String(r.index) })] }),
          new TableCell({ children: [new Paragraph({ text: r.topic })] }),
          new TableCell({ children: [new Paragraph({ text: r.contentUnit })] }),
          new TableCell({
            children: [
              new Paragraph({
                text: `${r.multipleChoice.know} / ${r.multipleChoice.understand} / ${r.multipleChoice.apply}`,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: `${r.trueFalse.know} / ${r.trueFalse.understand} / ${r.trueFalse.apply}`,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: `${r.shortAnswer.know} / ${r.shortAnswer.understand} / ${r.shortAnswer.apply}`,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                text: `${r.essay.know} / ${r.essay.understand} / ${r.essay.apply}`,
              }),
            ],
          }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: `${r.totalScore.toFixed(1)}đ`, bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ text: `${r.percent}%` })] }),
        ],
      })
  );

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: 'Times New Roman', size: 26, color: '111827' },
          paragraph: { spacing: { line: 276, after: 100 } },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1134, bottom: 1134, left: 1417, right: 1134 },
          },
        },
        children: [
          // Section 1: Matrix
          new Paragraph({
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: '1. MA TRẬN ĐỀ KIỂM TRA ĐỊNH KÌ',
                bold: true,
                size: 28,
                color: '1E3A8A',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `(Kèm theo Công văn số 7991/BGDĐT-GDTrH ngày 17/12/2024 của Bộ GDĐT)`,
                italics: true,
                size: 22,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `Môn: ${exam.meta.subject} - ${exam.meta.grade} | Thời gian: ${exam.meta.duration} | Tỉ lệ: ${exam.meta.ratio}`,
                bold: true,
                size: 24,
              }),
            ],
          }),
          new Paragraph({ spacing: { after: 120 } }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: tableBorderLight,
            rows: [matrixHeaderRow, ...matrixBodyRows],
          }),

          new Paragraph({ spacing: { before: 200 } }),
          new Paragraph({
            children: [
              new TextRun({
                text: `* Tổng điểm đề kiểm tra: ${exam.matrix.summary.totalScore.toFixed(1)} điểm. Trong đó: TN nhiều lựa chọn: ${exam.matrix.summary.multipleChoiceScore.toFixed(1)}đ (30%); Đúng-Sai: ${exam.matrix.summary.trueFalseScore.toFixed(1)}đ (20%); Trả lời ngắn: ${exam.matrix.summary.shortAnswerScore.toFixed(1)}đ (20%); Tự luận: ${exam.matrix.summary.essayScore.toFixed(1)}đ (30%). Mức độ nhận thức: Biết ${exam.matrix.summary.knowScore.toFixed(1)}đ (40%) - Hiểu ${exam.matrix.summary.understandScore.toFixed(1)}đ (30%) - Vận dụng ${exam.matrix.summary.applyScore.toFixed(1)}đ (30%).`,
                italics: true,
                size: 22,
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 300, after: 150 } }),

          // Section 2: Specification
          new Paragraph({
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: '2. BẢN ĐẶC TẢ ĐỀ KIỂM TRA ĐỊNH KÌ',
                bold: true,
                size: 28,
                color: '1E3A8A',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `(Phụ lục 2 - Công văn 7991/BGDĐT-GDTrH)`,
                italics: true,
                size: 22,
              }),
            ],
          }),
          new Paragraph({ spacing: { after: 120 } }),

          ...exam.specification.rows.flatMap((spec) => [
            new Paragraph({
              spacing: { before: 140, after: 60 },
              children: [
                new TextRun({
                  text: `${spec.index}. Chủ đề: ${spec.topic} - ${spec.contentUnit}`,
                  bold: true,
                  size: 26,
                  color: '0F766E',
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'a) Mức độ Biết (Nhận biết): ', bold: true }),
                new TextRun({ text: spec.learningOutcomes.know }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'b) Mức độ Hiểu (Thông hiểu): ', bold: true }),
                new TextRun({ text: spec.learningOutcomes.understand }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'c) Mức độ Vận dụng: ', bold: true }),
                new TextRun({ text: spec.learningOutcomes.apply }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Phân bố câu hỏi: ', bold: true, italics: true }),
                new TextRun({
                  text: `TNKQ: ${spec.questionDistribution.multipleChoice} | Đúng-Sai: ${spec.questionDistribution.trueFalse} | Ngắn: ${spec.questionDistribution.shortAnswer} | Tự luận: ${spec.questionDistribution.essay}`,
                  italics: true,
                }),
              ],
            }),
          ]),

          new Paragraph({ spacing: { before: 350, after: 150 } }),

          // Section 3: Official Exam Paper
          new Paragraph({
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: '3. ĐỀ KIỂM TRA CHÍNH THỨC',
                bold: true,
                size: 30,
                color: 'B91C1C',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: exam.title.toUpperCase(),
                bold: true,
                size: 26,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `Thời gian làm bài: ${exam.meta.duration} (Không kể thời gian phát đề)`,
                italics: true,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `Họ và tên thí sinh: ................................................................ Lớp: .............. SBD: ...............`,
                italics: true,
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 200 } }),

          // Part I
          new Paragraph({
            children: [
              new TextRun({
                text: exam.examPaper.part1.title,
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
          }),
          new Paragraph({
            children: [new TextRun({ text: exam.examPaper.part1.instruction, italics: true })],
          }),
          ...exam.examPaper.part1.questions.flatMap((q) => [
            new Paragraph({
              spacing: { before: 100 },
              children: [
                new TextRun({ text: `Câu ${q.number}: `, bold: true }),
                new TextRun({ text: q.question }),
              ],
            }),
            ...q.options.map(
              (opt) =>
                new Paragraph({
                  indent: { left: 360 },
                  children: [new TextRun({ text: opt })],
                })
            ),
          ]),

          new Paragraph({ spacing: { before: 200 } }),

          // Part II
          new Paragraph({
            children: [
              new TextRun({
                text: exam.examPaper.part2.title,
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
          }),
          new Paragraph({
            children: [new TextRun({ text: exam.examPaper.part2.instruction, italics: true })],
          }),
          ...exam.examPaper.part2.questions.flatMap((q) => [
            new Paragraph({
              spacing: { before: 120 },
              children: [
                new TextRun({ text: `Câu ${q.number}: `, bold: true }),
                new TextRun({ text: q.context }),
              ],
            }),
            ...q.subQuestions.map(
              (sub) =>
                new Paragraph({
                  indent: { left: 360 },
                  children: [
                    new TextRun({ text: `${sub.key}) `, bold: true }),
                    new TextRun({ text: sub.text }),
                  ],
                })
            ),
          ]),

          new Paragraph({ spacing: { before: 200 } }),

          // Part III
          new Paragraph({
            children: [
              new TextRun({
                text: exam.examPaper.part3.title,
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
          }),
          new Paragraph({
            children: [new TextRun({ text: exam.examPaper.part3.instruction, italics: true })],
          }),
          ...exam.examPaper.part3.questions.map(
            (q) =>
              new Paragraph({
                spacing: { before: 100 },
                children: [
                  new TextRun({ text: `Câu ${q.number}: `, bold: true }),
                  new TextRun({ text: q.question }),
                ],
              })
          ),

          new Paragraph({ spacing: { before: 200 } }),

          // Part IV
          new Paragraph({
            children: [
              new TextRun({
                text: exam.examPaper.part4.title,
                bold: true,
                size: 26,
                color: '1E3A8A',
              }),
            ],
          }),
          new Paragraph({
            children: [new TextRun({ text: exam.examPaper.part4.instruction, italics: true })],
          }),
          ...exam.examPaper.part4.questions.map(
            (q) =>
              new Paragraph({
                spacing: { before: 120 },
                children: [
                  new TextRun({ text: `Câu ${q.number} (${q.score} điểm): `, bold: true }),
                  new TextRun({ text: q.question }),
                ],
              })
          ),

          new Paragraph({ spacing: { before: 350, after: 150 } }),

          // Section 4: Answer key & Rubric
          new Paragraph({
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: '4. ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM CHI TIẾT',
                bold: true,
                size: 28,
                color: '047857',
              }),
            ],
          }),

          // Part 1 answers
          new Paragraph({
            children: [
              new TextRun({ text: 'A. ĐÁP ÁN PHẦN I (Mỗi câu đúng 0,25 điểm)', bold: true }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: (exam.answerKey?.part1Answers ?? [])
                  .map((a) => `${a.number}.${a.answer}`)
                  .join('   |   ') || 'Đang cập nhật đáp án...',
                bold: true,
                color: '2563EB',
              }),
            ],
          }),

          new Paragraph({ spacing: { before: 150 } }),

          // Part 2 answers
          new Paragraph({
            children: [
              new TextRun({
                text: 'B. ĐÁP ÁN PHẦN II (Trắc nghiệm Đúng - Sai)',
                bold: true,
              }),
            ],
          }),
          ...(exam.answerKey?.part2Answers ?? []).map(
            (ans) =>
              new Paragraph({
                children: [
                  new TextRun({ text: `Câu ${ans.number}: `, bold: true }),
                  new TextRun({
                    text: (ans.details ?? [])
                      .map((d) => `${d.key}) ${d.isCorrect ? 'ĐÚNG' : 'SAI'}`)
                      .join('  ;  '),
                    bold: true,
                  }),
                ],
              })
          ),

          new Paragraph({ spacing: { before: 150 } }),

          // Part 3 answers
          new Paragraph({
            children: [
              new TextRun({
                text: 'C. ĐÁP ÁN PHẦN III (Trả lời ngắn - Mỗi câu đúng 0,5 điểm)',
                bold: true,
              }),
            ],
          }),
          ...(exam.answerKey?.part3Answers ?? []).map(
            (ans) =>
              new Paragraph({
                children: [
                  new TextRun({ text: `Câu ${ans.number}: `, bold: true }),
                  new TextRun({ text: ans.answer, bold: true, color: '0F766E' }),
                  ans.explain ? new TextRun({ text: ` (${ans.explain})`, italics: true }) : new TextRun({ text: '' }),
                ],
              })
          ),

          new Paragraph({ spacing: { before: 150 } }),

          // Part 4 rubric
          new Paragraph({
            children: [
              new TextRun({
                text: 'D. HƯỚNG DẪN CHẤM BAREM PHẦN IV (TỰ LUẬN)',
                bold: true,
              }),
            ],
          }),
          ...(exam.answerKey?.part4Rubric ?? []).flatMap((rubric) => [
            new Paragraph({
              spacing: { before: 100 },
              children: [
                new TextRun({
                  text: `Câu ${rubric.number} (Tổng điểm: ${rubric.total} điểm):`,
                  bold: true,
                  italics: true,
                }),
              ],
            }),
            ...(rubric.steps ?? []).map(
              (step) =>
                new Paragraph({
                  indent: { left: 360 },
                  children: [
                    new TextRun({ text: `- ${step.content}: ` }),
                    new TextRun({ text: `[${step.score} điểm]`, bold: true }),
                  ],
                })
            ),
          ]),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const cleanTitle = exam.title.replace(/[^a-zA-Z0-9\u00C0-\u1EF9]/g, '_').substring(0, 40);
  saveBlob(blob, `DeKiemTra_CV7991_${cleanTitle}.docx`);
}
