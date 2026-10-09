import PptxGenJS from 'pptxgenjs';
import { SlidePresentation } from '../types';

export async function exportSlideToPptx(presentation: SlidePresentation): Promise<void> {
  const pres = new PptxGenJS();
  pres.layout = 'LAYOUT_16x9';
  pres.author = 'Trợ Lý AI Giáo Viên THCS/THPT';
  pres.company = 'Bộ sách Kết nối tri thức với cuộc sống';
  pres.title = presentation.presentationTitle;

  // Primary colors
  const primaryColor = '2563EB'; // #2563EB Blue
  const secondaryColor = '0F9D8A'; // #0F9D8A Teal
  const darkTextColor = '1E293B'; // Slate-800
  const lightBgColor = 'F8FAFC'; // Slate-50

  presentation.slides.forEach((slideItem, index) => {
    const slide = pres.addSlide();
    slide.background = { color: lightBgColor };

    // Slide Notes
    if (slideItem.notes) {
      slide.addNotes(slideItem.notes);
    }

    if (slideItem.type === 'cover' || index === 0) {
      // Decorative top bar
      slide.addShape(pres.ShapeType.rect, {
        x: 0,
        y: 0,
        w: '100%',
        h: 0.25,
        fill: { color: primaryColor },
      });

      // Big header card
      slide.addShape(pres.ShapeType.roundRect, {
        x: 0.8,
        y: 0.8,
        w: 11.73,
        h: 5.6,
        fill: { color: 'FFFFFF' },
        line: { color: 'E2E8F0', width: 1.5 },
      });

      // Category badge
      slide.addText('BÀI GIẢNG ĐIỆN TỬ THEO CHƯƠNG TRÌNH GDPT 2018', {
        x: 1.2,
        y: 1.2,
        w: 9,
        h: 0.4,
        fontSize: 12,
        bold: true,
        color: secondaryColor,
        charSpacing: 2,
      });

      // Presentation Title
      slide.addText(slideItem.title, {
        x: 1.2,
        y: 1.7,
        w: 10.8,
        h: 1.5,
        fontSize: 32,
        bold: true,
        color: primaryColor,
        valign: 'middle',
      });

      // Subtitle
      if (slideItem.subtitle) {
        slide.addText(slideItem.subtitle, {
          x: 1.2,
          y: 3.3,
          w: 10.8,
          h: 0.7,
          fontSize: 18,
          color: '4B5563',
          italic: true,
        });
      }

      // Metadata bullets / Teacher info
      if (slideItem.bullets && slideItem.bullets.length > 0) {
        const bulletText = slideItem.bullets.map((b) => ({
          text: b,
          options: { fontSize: 14, color: darkTextColor, breakLine: true },
        }));
        slide.addText(bulletText, {
          x: 1.2,
          y: 4.2,
          w: 10.8,
          h: 1.5,
          bullet: true,
        });
      }
    } else {
      // Content Slide Layout
      // Top header bar
      slide.addShape(pres.ShapeType.rect, {
        x: 0,
        y: 0,
        w: '100%',
        h: 1.1,
        fill: { color: 'FFFFFF' },
        line: { color: 'E2E8F0', width: 1 },
      });

      // Accent pill
      slide.addShape(pres.ShapeType.rect, {
        x: 0.6,
        y: 0.25,
        w: 0.12,
        h: 0.6,
        fill: { color: secondaryColor },
      });

      // Slide Title
      slide.addText(slideItem.title, {
        x: 0.9,
        y: 0.15,
        w: 10.5,
        h: 0.5,
        fontSize: 22,
        bold: true,
        color: primaryColor,
      });

      // Slide Subtitle
      if (slideItem.subtitle) {
        slide.addText(slideItem.subtitle, {
          x: 0.9,
          y: 0.65,
          w: 10.5,
          h: 0.35,
          fontSize: 13,
          color: '64748B',
          italic: true,
        });
      }

      // Slide number badge
      slide.addText(`${slideItem.slideNumber} / ${presentation.totalSlides}`, {
        x: 11.5,
        y: 0.3,
        w: 1.2,
        h: 0.4,
        fontSize: 12,
        color: '94A3B8',
        align: 'right',
      });

      // Main Content Box (Left Column)
      slide.addShape(pres.ShapeType.roundRect, {
        x: 0.6,
        y: 1.4,
        w: 7.8,
        h: 5.3,
        fill: { color: 'FFFFFF' },
        line: { color: 'CBD5E1', width: 1 },
      });

      if (slideItem.bullets && slideItem.bullets.length > 0) {
        const bulletItems = slideItem.bullets.map((b) => ({
          text: `${b}\n`,
          options: {
            fontSize: 16,
            color: darkTextColor,
            breakLine: true,
          },
        }));

        slide.addText(bulletItems, {
          x: 0.9,
          y: 1.7,
          w: 7.2,
          h: 4.7,
          bullet: true,
          valign: 'top',
        });
      }

      // Right Column: Image Suggestion / Note Card
      slide.addShape(pres.ShapeType.roundRect, {
        x: 8.7,
        y: 1.4,
        w: 4.0,
        h: 5.3,
        fill: { color: 'EFF6FF' }, // blue-50
        line: { color: 'BFDBFE', width: 1 },
      });

      slide.addText('GỢI Ý HÌNH ẢNH / TRỰC QUAN', {
        x: 9.0,
        y: 1.7,
        w: 3.4,
        h: 0.4,
        fontSize: 11,
        bold: true,
        color: primaryColor,
      });

      slide.addText(slideItem.imageSuggestion || 'Chèn hình ảnh hoặc sơ đồ minh họa phù hợp với bài học.', {
        x: 9.0,
        y: 2.2,
        w: 3.4,
        h: 2.2,
        fontSize: 13,
        color: '334155',
        italic: true,
      });

      // Mini Teacher Guide Box
      slide.addShape(pres.ShapeType.roundRect, {
        x: 9.0,
        y: 4.6,
        w: 3.4,
        h: 1.8,
        fill: { color: 'F0FDF4' }, // emerald-50
        line: { color: 'BBF7D0', width: 1 },
      });

      slide.addText('HƯỚNG DẪN GIẢNG DẠY', {
        x: 9.2,
        y: 4.8,
        w: 3.0,
        h: 0.3,
        fontSize: 10,
        bold: true,
        color: '15803D',
      });

      slide.addText(
        slideItem.notes
          ? slideItem.notes.length > 120
            ? slideItem.notes.substring(0, 120) + '...'
            : slideItem.notes
          : 'Giáo viên tổ chức hoạt động theo 4 bước sư phạm.',
        {
          x: 9.2,
          y: 5.15,
          w: 3.0,
          h: 1.1,
          fontSize: 11,
          color: '166534',
        }
      );
    }
  });

  const cleanFileName = presentation.presentationTitle
    .replace(/[^a-zA-Z0-9\u00C0-\u1EF9]/g, '_')
    .substring(0, 40);

  await pres.writeFile({ fileName: `BaiGiang_${cleanFileName}.pptx` });
}
