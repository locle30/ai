import { ExamDocument, LessonPlan, SlidePresentation } from '../types';

export const sampleLessonPlan: LessonPlan = {
  id: 'lesson-khtn10-sample',
  title: 'KẾ HOẠCH BÀI DẠY: CÁC CẤP ĐỘ TỔ CHỨC CỦA THẾ GIỚI SỐNG',
  createdAt: new Date().toISOString(),
  meta: {
    schoolLevel: 'THPT',
    subject: 'Khoa học tự nhiên (Sinh học)',
    grade: 'Lớp 10',
    textbook: 'Kết nối tri thức',
    duration: '2 tiết (90 phút)',
    topic: 'Chủ đề: Giới thiệu khái quát thế giới sống',
    teacherName: 'Nguyễn Thị Minh Hạnh',
    schoolName: 'Trường THPT Chuyên Kết Nối',
  },
  objectives: {
    knowledge: [
      'Nêu được khái niệm cấp độ tổ chức sống và liệt kê được các cấp độ tổ chức sống cơ bản (nguyên tử/phân tử, bào quan, tế bào, mô, cơ quan, hệ cơ quan, cơ thể, quần thể, quần xã - hệ sinh thái, sinh quyển).',
      'Giải thích được mối quan hệ giữa các cấp độ tổ chức sống và giải thích vì sao tế bào là đơn vị cấu trúc và chức năng cơ bản của thế giới sống.',
      'Phân tích được 3 đặc điểm nổi bật của các cấp độ tổ chức sống: tổ chức theo nguyên tắc thứ bậc, hệ thống mở và tự điều chỉnh, liên tục tiến hóa.',
    ],
    generalCompetencies: [
      'Tự chủ và tự học: Tự giác tìm hiểu thông tin trong SGK Kết nối tri thức, chủ động hoàn thành phiếu học tập cá nhân.',
      'Giao tiếp và hợp tác: Tích cực thảo luận nhóm, phân công nhiệm vụ và lắng nghe, phản biện ý kiến của các thành viên.',
      'Giải quyết vấn đề và sáng tạo: Xây dựng sơ đồ tư duy minh họa mối quan hệ thứ bậc giữa các cấp độ tổ chức sống.',
    ],
    specificCompetencies: [
      'Nhận thức sinh học: Hệ thống hóa được các cấp độ tổ chức sống từ thấp đến cao.',
      'Tìm hiểu thế giới sống: Đặt được câu hỏi nghiên cứu về khả năng tự điều chỉnh cân bằng nội môi của cơ thể sinh vật.',
      'Vận dụng kiến thức, kĩ năng: Giải thích được hiện tượng thích nghi của sinh vật trong tự nhiên dựa trên nguyên tắc tiến hóa.',
    ],
    qualities: [
      'Yêu nước và tự hào về sự đa dạng sinh học phong phú của Việt Nam.',
      'Chăm chỉ: Có tinh thần vượt khó, say mê tìm tòi khám phá thế giới tự nhiên.',
      'Trách nhiệm: Có ý thức bảo vệ môi trường, bảo tồn đa dạng sinh học và giữ gìn sức khỏe bản thân.',
    ],
  },
  equipment: {
    teacher: [
      'Kế hoạch bài dạy chuẩn Công văn 5512/BGDĐT-GDTrH.',
      'Bài giảng trình chiếu PowerPoint (tỷ lệ 16:9), máy chiếu, màn chiếu.',
      'Phiếu học tập số 1 (Phân loại cấp độ sống), Phiếu học tập số 2 (Đặc điểm các cấp độ sống).',
      'Video ngắn về cấu trúc cơ thể sống và hệ sinh thái nhiệt đới.',
    ],
    student: [
      'Sách giáo khoa Khoa học tự nhiên / Sinh học 10 (Bộ sách Kết nối tri thức với cuộc sống).',
      'Vở ghi bài, bút màu, giấy A3 phục vụ thảo luận nhóm.',
    ],
  },
  activities: [
    {
      "id": "act-1",
      "type": "KHỞI ĐỘNG",
      "name": "Hoạt động 1: Mở đầu / Khởi động (Xác định vấn đề học tập)",
      "duration": "10 phút",
      "objective": "Tạo tâm thế hứng thú học tập cho học sinh; kích thích sự tò mò về cấu trúc trật tự phức tạp nhưng hài hòa của thế giới tự nhiên xung quanh.",
      "content": "Học sinh quan sát hình ảnh từ một tế bào cơ tim đến quả tim, hệ tuần hoàn và một con người hoàn chỉnh; trả lời câu hỏi: Giữa các thành phần này có mối liên hệ như thế nào?",
      "product": "Câu trả lời của học sinh: Cơ thể người được cấu tạo từ nhiều cơ quan, tế bào; các bộ phận phối hợp nhịp nhàng với nhau.",
      "implementation": {
        "step1": "Bước 1: Chuyển giao nhiệm vụ: Giáo viên trình chiếu slide hình ảnh chuỗi từ tế bào cơ tim -> quả tim -> hệ tuần hoàn -> con người và nêu câu hỏi: 'Điều gì giúp các cấu trúc nhỏ bé liên kết tạo nên sự sống hoàn chỉnh?'",
        "step2": "Bước 2: Thực hiện nhiệm vụ: Học sinh làm việc cá nhân trong 2 phút, suy ngẫm và trao đổi nhanh với bạn cùng bàn.",
        "step3": "Bước 3: Báo cáo, thảo luận: Giáo viên gọi ngẫu nhiên 2 - 3 học sinh phát biểu, khuyến khích các học sinh khác nhận xét, bổ sung ý kiến.",
        "step4": "Bước 4: Kết luận, nhận định: Giáo viên ghi nhận ý kiến, nhận xét và dẫn dắt: 'Thế giới sống vô cùng kỳ diệu với nhiều cấp bậc tổ chức từ vi mô đến vĩ mô. Bài học hôm nay sẽ giúp các em khám phá quy luật ấy.'"
      }
    },
    {
      "id": "act-2",
      "type": "HÌNH THÀNH KIẾN THỨC",
      "name": "Hoạt động 2: Hình thành kiến thức mới (Khái niệm và đặc điểm các cấp độ tổ chức sống)",
      "duration": "50 phút",
      "objective": "Học sinh nêu được khái niệm và các cấp độ tổ chức sống cơ bản; phân tích được 3 đặc tính nổi trội: nguyên tắc thứ bậc, hệ thống mở và tự điều chỉnh, liên tục tiến hóa.",
      "content": "Nội dung 1: Tìm hiểu các cấp độ tổ chức sống (Tế bào, cơ thể, quần thể, quần xã, hệ sinh thái). Nội dung 2: Khám phá đặc tính nổi trội của thế giới sống qua phân tích ví dụ thực tế.",
      "product": "Phiếu học tập số 1 và số 2 hoàn chỉnh; sơ đồ tư duy phân cấp cấu trúc sinh học của các nhóm học sinh.",
      "implementation": {
        "step1": "Bước 1: Chuyển giao nhiệm vụ: Giáo viên chia lớp thành 4 nhóm chuyên sâu, giao nhiệm vụ hoàn thành Phiếu học tập số 1 (sắp xếp các cấp độ sống) và Phiếu học tập số 2 (phân tích đặc tính nổi trội).",
        "step2": "Bước 2: Thực hiện nhiệm vụ: Các nhóm đọc SGK Kết nối tri thức mục I và II, thảo luận sôi nổi, ghi lại kết quả vào bảng nhóm A3.",
        "step3": "Bước 3: Báo cáo, thảo luận: Đại diện Nhóm 1 và Nhóm 3 lên bảng treo sơ đồ và thuyết trình; Nhóm 2 và Nhóm 4 đặt câu hỏi chất vấn và phản biện.",
        "step4": "Bước 4: Kết luận, nhận định: Giáo viên tổng kết, chuẩn hóa kiến thức trên slide; nhấn mạnh: Tế bào là cấp độ sống cơ bản nhất; tính chất nổi trội là đặc tính chỉ xuất hiện khi các phân tử/cấu trúc hợp thành hệ thống lớn hơn."
      }
    },
    {
      "id": "act-3",
      "type": "LUYỆN TẬP",
      "name": "Hoạt động 3: Luyện tập (Củng cố và rèn luyện kĩ năng)",
      "duration": "15 phút",
      "objective": "Củng cố kiến thức về thứ bậc và đặc tính của cấp độ tổ chức sống; rèn kĩ năng nhận biết và phân biệt các cấp độ thông qua bài tập tình huống.",
      "content": "Học sinh tham gia trò chơi trắc nghiệm tương tác gồm 6 câu hỏi nhiều lựa chọn và 1 câu hỏi đúng/sai về các cấp độ tổ chức sống.",
      "product": "Bảng đáp án chọn lựa đúng của học sinh, bảng điểm thi đua giữa các tổ/bàn học.",
      "implementation": {
        "step1": "Bước 1: Chuyển giao nhiệm vụ: Giáo viên trình chiếu lần lượt các câu hỏi luyện tập trên màn hình slide, yêu cầu học sinh chọn đáp án bằng thẻ A, B, C, D.",
        "step2": "Bước 2: Thực hiện nhiệm vụ: Học sinh độc lập tư duy trong 30 giây cho mỗi câu hỏi và giơ thẻ đáp án theo hiệu lệnh của giáo viên.",
        "step3": "Bước 3: Báo cáo, thảo luận: Giáo viên mời học sinh giải thích vì sao chọn phương án đó và phân tích lý do các phương án còn lại chưa chính xác.",
        "step4": "Bước 4: Kết luận, nhận định: Giáo viên biểu dương các học sinh có câu trả lời chính xác, giải thích cặn kẽ những lỗi học sinh hay nhầm lẫn."
      }
    },
    {
      "id": "act-4",
      "type": "VẬN DỤNG",
      "name": "Hoạt động 4: Vận dụng (Giải quyết vấn đề thực tiễn)",
      "duration": "15 phút",
      "objective": "Vận dụng kiến thức về hệ thống mở và tự điều chỉnh để giải thích phản ứng toát mồ hôi khi trời nóng của cơ thể người và đề xuất biện pháp bảo vệ sức khỏe.",
      "content": "Tình huống thực tế: Khi chạy bộ vào ngày hè oi bức, cơ thể người có phản ứng gì để điều hòa thân nhiệt? Nếu cơ chế này bị rối loạn (say nắng) thì cần xử trí cấp cứu ra sao?",
      "product": "Bản báo cáo ngắn gọn hoặc sơ đồ xử trí cấp cứu say nắng theo nguyên lý cân bằng nội môi.",
      "implementation": {
        "step1": "Bước 1: Chuyển giao nhiệm vụ: Giáo viên giao câu hỏi tình huống thực tế, yêu cầu học sinh viết bài thu hoạch ngắn 5 dòng vào vở hoặc hoàn thành ở nhà.",
        "step2": "Bước 2: Thực hiện nhiệm vụ: Học sinh vận dụng kiến thức bài học liên hệ với thực tế đời sống bản thân.",
        "step3": "Bước 3: Báo cáo, thảo luận: Giáo viên gọi 2 học sinh trình bày phương án xử trí say nắng trước lớp; cả lớp góp ý bổ sung.",
        "step4": "Bước 4: Kết luận, nhận định: Giáo viên khen ngợi tinh thần ứng dụng kiến thức vào cuộc sống, chốt lại bài học và dặn dò chuẩn bị bài tiếp theo."
      }
    }
  ]
};

export const sampleSlidePresentation: SlidePresentation = {
  id: 'slide-khtn10-sample',
  presentationTitle: 'Bài giảng: Các Cấp Độ Tổ Chức Của Thế Giới Sống',
  createdAt: new Date().toISOString(),
  aspectRatio: '16:9',
  totalSlides: 8,
  meta: {
    subject: 'Khoa học tự nhiên (Sinh học)',
    grade: 'Lớp 10',
    schoolLevel: 'THPT',
    lessonName: 'Bài 4: Các cấp độ tổ chức của thế giới sống',
  },
  slides: [
    {
      slideNumber: 1,
      type: 'cover',
      title: 'CÁC CẤP ĐỘ TỔ CHỨC CỦA THẾ GIỚI SỐNG',
      subtitle: 'Môn Khoa học tự nhiên / Sinh học 10 – Bộ sách Kết nối tri thức với cuộc sống',
      bullets: [
        'Giáo viên giảng dạy: Nguyễn Thị Minh Hạnh',
        'Tổ chuyên môn: Khoa học tự nhiên',
        'Trường THPT Chuyên Kết Nối',
      ],
      imageSuggestion: 'Ảnh chụp minh họa từ kính hiển vi tế bào đến hệ sinh thái Trái Đất rực rỡ sắc màu',
      notes: 'Lời giáo viên: Chào mừng các em học sinh lớp 10 đến với bài học hôm nay. Hãy cùng khám phá trật tự kỳ diệu của tự nhiên!',
    },
    {
      slideNumber: 2,
      type: 'objective',
      title: 'MỤC TIÊU BÀI HỌC',
      subtitle: 'Chuẩn năng lực và yêu cầu cần đạt theo Chương trình GDPT 2018',
      bullets: [
        'Nêu được khái niệm cấp độ tổ chức sống cơ bản.',
        'Phân tích được mối quan hệ thứ bậc giữa các cấp độ.',
        'Hiểu rõ vì sao tế bào là đơn vị cơ sở của sự sống.',
        'Nhận biết 3 đặc tính nổi trội: Thứ bậc – Hệ thống mở & Tự điều chỉnh – Tiến hóa.',
      ],
      imageSuggestion: 'Infographic biểu tượng các mục tiêu học tập dạng checklist trực quan',
      notes: 'Lời giáo viên: Sau tiết học này, các em cần làm chủ được 4 mục tiêu cốt lõi hiển thị trên màn hình.',
    },
    {
      slideNumber: 3,
      type: 'warmup',
      title: 'KHỞI ĐỘNG: ĐIỀU GÌ TẠO NÊN SỰ SỐNG?',
      subtitle: 'Quan sát tình huống thực tế và kết nối tư duy',
      bullets: [
        'Tế bào cơ tim -> Quả tim -> Hệ tuần hoàn -> Cơ thể người.',
        'Một quả tim đơn lẻ có thể tự sống độc lập lâu dài không?',
        'Điều gì kết nối các thành phần nhỏ bé thành một cơ thể hoàn chỉnh?',
      ],
      imageSuggestion: 'Sơ đồ liên kết chuỗi từ tế bào cơ tim đến trái tim và cơ thể người chạy bộ',
      notes: 'Lời giáo viên: Quan sát chuỗi hình ảnh, các em hãy cùng trao đổi cặp đôi nhanh trong 1 phút!',
    },
    {
      slideNumber: 4,
      type: 'content',
      title: 'CÁC CẤP ĐỘ TỔ CHỨC SỐNG CƠ BẢN',
      subtitle: 'Hệ thống phân cấp từ vi mô đến vĩ mô',
      bullets: [
        '1. Tế bào: Đơn vị cấu trúc và chức năng cơ bản nhất.',
        '2. Cơ thể: Tập hợp cơ quan, hệ cơ quan hoạt động thống nhất.',
        '3. Quần thể: Tập hợp cá thể cùng loài trong cùng sinh cảnh.',
        '4. Quần xã - Hệ sinh thái: Tương tác giữa sinh vật và môi trường sống.',
      ],
      imageSuggestion: 'Sơ đồ hình tháp thứ bậc sinh học từ Tế bào đến Sinh quyển Trái Đất',
      notes: 'Lời giáo viên: Lưu ý rằng các nhà khoa học quy ước 4 cấp độ cơ bản nhất gồm Tế bào, Cơ thể, Quần thể và Hệ sinh thái.',
    },
    {
      slideNumber: 5,
      type: 'content',
      title: 'ĐẶC TÍNH NỔI TRỘI CỦA THẾ GIỚI SỐNG',
      subtitle: 'Bản chất khoa học phân biệt vật thể sống và vật vô sinh',
      bullets: [
        'Nguyên tắc thứ bậc: Cấp tổ chức cao có đặc tính mà cấp dưới không có.',
        'Hệ thống mở: Thường xuyên trao đổi chất và năng lượng với môi trường.',
        'Cơ chế tự điều chỉnh: Duy trì trạng thái cân bằng nội môi ổn định.',
        'Liên tục tiến hóa: Đột biến và chọn lọc tự nhiên tạo ra đa dạng loài.',
      ],
      imageSuggestion: 'Sơ đồ cơ chế phản hồi điều hòa thân nhiệt của cơ thể người khi trời nóng/lạnh',
      notes: 'Lời giáo viên: Tính chất nổi trội nghĩa là tổng thể lớn hơn rất nhiều so với từng phần tử cộng lại!',
    },
    {
      slideNumber: 6,
      type: 'practice',
      title: 'LUYỆN TẬP: THỬ TÀI SINH HỌC',
      subtitle: 'Câu hỏi kiểm tra nhanh độ hiểu bài',
      bullets: [
        'Câu hỏi: Tại sao tế bào được coi là đơn vị cơ bản của sự sống?',
        'A. Vì tế bào có kích thước nhỏ nhất.',
        'B. Vì mọi hoạt động sống đều diễn ra ở cấp độ tế bào (ĐÚNG).',
        'C. Vì tế bào không bao giờ bị tổn thương.',
        'D. Vì chỉ có sinh vật bậc cao mới có tế bào.',
      ],
      imageSuggestion: 'Hình minh họa tế bào động vật và thực vật với cấu trúc bào quan sắc nét',
      notes: 'Lời giáo viên: Đếm từ 1 đến 3, cả lớp cùng giơ thẻ đáp án nhé!',
    },
    {
      slideNumber: 7,
      type: 'application',
      title: 'VẬN DỤNG: BẢO VỆ CÂN BẰNG SỰ SỐNG',
      subtitle: 'Liên hệ thực tiễn và bài học cuộc sống',
      bullets: [
        'Khi bạn sốt 39°C, cơ thể đang thực hiện phản ứng tự vệ gì?',
        'Uống đủ nước và giữ vệ sinh giúp duy trì cân bằng nội môi ra sao?',
        'Bảo vệ một loài sinh vật chính là bảo vệ cả mắt xích của hệ sinh thái.',
      ],
      imageSuggestion: 'Hình ảnh bác sĩ tư vấn sức khỏe và bức tranh thiên nhiên bảo tồn rừng nhiệt đới',
      notes: 'Lời giáo viên: Hãy luôn nhớ rằng sự sống là một hệ thống mở cần được chăm sóc mỗi ngày.',
    },
    {
      slideNumber: 8,
      type: 'summary',
      title: 'TỔNG KẾT & DẶN DÒ',
      subtitle: 'Ghi nhớ trọng tâm & Chuẩn bị tiết sau',
      bullets: [
        'Ôn lại 4 cấp độ sống cơ bản và 3 đặc tính nổi trội.',
        'Hoàn thành bài tập 1, 2, 3 trang 18 SGK Kết nối tri thức.',
        'Đọc trước Bài 5: Các nguyên tố hóa học và nước trong tế bào.',
      ],
      imageSuggestion: 'Biểu tượng sách giáo khoa Kết nối tri thức mở ra cùng lời chúc học tốt',
      notes: 'Lời giáo viên: Cảm ơn sự tích cực của cả lớp. Chúc các em một buổi học tràn đầy năng lượng!',
    },
  ],
};

export const sampleExamDocument: ExamDocument = {
  id: 'exam-khtn10-sample',
  title: 'ĐỀ KIỂM TRA ĐỊNH KÌ MÔN KHOA HỌC TỰ NHIÊN (SINH HỌC) LỚP 10',
  createdAt: new Date().toISOString(),
  meta: {
    subject: 'Khoa học tự nhiên (Sinh học)',
    grade: 'Lớp 10',
    schoolLevel: 'THPT',
    duration: '45 phút',
    scope: 'Chủ đề: Khái quát thế giới sống & Sinh học tế bào (Bộ sách Kết nối tri thức)',
    totalScore: 10.0,
    ratio: 'Biết 40% (4,0đ) - Hiểu 30% (3,0đ) - Vận dụng 30% (3,0đ)',
    schoolName: 'Trường THPT Chuyên Kết Nối',
    teacherName: 'Nguyễn Thị Minh Hạnh',
  },
  matrix: {
    rows: [
      {
        index: 1,
        topic: 'Giới thiệu thế giới sống',
        contentUnit: 'Các cấp độ tổ chức sống và đặc tính nổi trội',
        multipleChoice: { know: 4, understand: 2, apply: 0 },
        trueFalse: { know: 0, understand: 1, apply: 0 },
        shortAnswer: { know: 1, understand: 1, apply: 0 },
        essay: { know: 0, understand: 0, apply: 1 },
        total: { know: 5, understand: 4, apply: 1 },
        totalScore: 5.0,
        percent: 50,
      },
      {
        index: 2,
        topic: 'Sinh học tế bào',
        contentUnit: 'Cấu tạo tế bào & Các chất hóa học trong tế bào',
        multipleChoice: { know: 3, understand: 3, apply: 0 },
        trueFalse: { know: 0, understand: 0, apply: 1 },
        shortAnswer: { know: 1, understand: 1, apply: 0 },
        essay: { know: 0, understand: 0, apply: 1 },
        total: { know: 4, understand: 4, apply: 2 },
        totalScore: 5.0,
        percent: 50,
      },
    ],
    summary: {
      multipleChoiceScore: 3.0,
      trueFalseScore: 2.0,
      shortAnswerScore: 2.0,
      essayScore: 3.0,
      knowScore: 4.0,
      understandScore: 3.0,
      applyScore: 3.0,
      totalScore: 10.0,
    },
  },
  specification: {
    rows: [
      {
        index: 1,
        topic: 'Giới thiệu thế giới sống',
        contentUnit: 'Cấp độ tổ chức sống',
        learningOutcomes: {
          know: '- Nhận biết được khái niệm cấp độ tổ chức sống cơ bản (Tế bào, cơ thể, quần thể, hệ sinh thái).\n- Liệt kê được thứ tự các cấp độ sống từ thấp đến cao.',
          understand: '- Phân biệt được đặc tính nổi trội của các cấp độ sống.\n- Giải thích được vì sao cơ thể sinh vật là một hệ thống mở và tự điều chỉnh.',
          apply: '- Vận dụng kiến thức tự điều chỉnh để giải thích hiện tượng cân bằng nội môi ở người khi thay đổi môi trường.',
        },
        questionDistribution: {
          multipleChoice: 'Biết: Câu 1, 2, 3, 4; Hiểu: Câu 5, 6',
          trueFalse: 'Hiểu: Câu 1 (ý a, b, c, d)',
          shortAnswer: 'Biết: Câu 1; Hiểu: Câu 2',
          essay: 'Vận dụng: Câu 1',
        },
      },
      {
        index: 2,
        topic: 'Sinh học tế bào',
        contentUnit: 'Cấu tạo & Hóa học tế bào',
        learningOutcomes: {
          know: '- Nêu được thành phần nguyên tố chính cấu tạo nên tế bào (C, H, O, N).\n- Nhận biết vai trò sinh học của nước trong tế bào.',
          understand: '- Phân biệt được tế bào nhân sơ và tế bào nhân thực.\n- Trình bày được cấu trúc và chức năng của màng sinh chất.',
          apply: '- Giải thích được tại sao muối dưa cà giúp bảo quản được rau củ lâu bị hỏng dựa trên hiện tượng co nguyên sinh.',
        },
        questionDistribution: {
          multipleChoice: 'Biết: Câu 7, 8, 9; Hiểu: Câu 10, 11, 12',
          trueFalse: 'Vận dụng: Câu 2 (ý a, b, c, d)',
          shortAnswer: 'Biết: Câu 3; Hiểu: Câu 4',
          essay: 'Vận dụng: Câu 2',
        },
      },
    ],
  },
  examPaper: {
    part1: {
      title: 'PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn (3,0 điểm)',
      instruction: 'Thí sinh trả lời từ câu 1 đến câu 12. Mỗi câu hỏi chỉ chọn một phương án đúng nhất (Mỗi câu đúng được 0,25 điểm).',
      questions: [
        {
          number: 1,
          question: 'Cấp độ tổ chức sống nào sau đây được coi là đơn vị cấu trúc và chức năng cơ bản của thế giới sống?',
          options: ['A. Tế bào.', 'B. Bào quan.', 'C. Mô.', 'D. Phân tử.'],
          level: 'Nhận biết',
        },
        {
          number: 2,
          question: 'Tập hợp các cá thể cùng loài, cùng sinh sống trong một khoảng không gian và thời gian xác định được gọi là',
          options: ['A. Quần thể.', 'B. Quần xã.', 'C. Hệ sinh thái.', 'D. Sinh quyển.'],
          level: 'Nhận biết',
        },
        {
          number: 3,
          question: 'Đặc điểm nào sau đây KHÔNG PHẢI là đặc tính nổi trội của các cấp độ tổ chức sống?',
          options: [
            'A. Tổ chức theo nguyên tắc thứ bậc.',
            'B. Hệ thống kín, cách ly hoàn toàn với môi trường ngoài.',
            'C. Có khả năng tự điều chỉnh.',
            'D. Không ngừng tiến hóa.',
          ],
          level: 'Nhận biết',
        },
        {
          number: 4,
          question: 'Bốn nguyên tố hóa học chiếm khối lượng lớn nhất (khoảng 96%) trong cơ thể sinh vật là',
          options: ['A. C, H, O, N.', 'B. C, H, O, P.', 'C. C, H, O, Ca.', 'D. C, H, O, Fe.'],
          level: 'Nhận biết',
        },
        {
          number: 5,
          question: 'Hiện tượng cơ thể người toát mồ hôi khi nhiệt độ môi trường tăng cao thể hiện đặc tính nào của tổ chức sống?',
          options: [
            'A. Khả năng tự điều chỉnh cân bằng nội môi.',
            'B. Nguyên tắc thứ bậc cấu trúc.',
            'C. Sự cách ly với môi trường.',
            'D. Sự tiến hóa liên tục thích nghi.',
          ],
          level: 'Thông hiểu',
        },
        {
          number: 6,
          question: 'Đặc tính nổi trội là đặc tính',
          options: [
            'A. Chỉ có ở cấp độ tổ chức sống cao hơn mà cấp độ thấp hơn không có.',
            'B. Chỉ có ở các nguyên tử và phân tử.',
            'C. Luôn giống hệt giữa các loài sinh vật khác nhau.',
            'D. Biến mất hoàn toàn khi có sự tiến hóa.',
          ],
          level: 'Thông hiểu',
        },
        {
          number: 7,
          question: 'Thành phần nào sau đây có ở tế bào nhân thực mà KHÔNG CÓ ở tế bào nhân sơ?',
          options: [
            'A. Màng nhân bao bọc vật chất di truyền.',
            'B. Màng sinh chất.',
            'C. Ribosome.',
            'D. Tế bào chất.',
          ],
          level: 'Nhận biết',
        },
        {
          number: 8,
          question: 'Nước có tính phân cực là do',
          options: [
            'A. Nguyên tử Oxi có độ âm điện lớn hơn nguyên tử Hiđro.',
            'B. Nguyên tử Hiđro có khối lượng lớn hơn nguyên tử Oxi.',
            'C. Nước không hòa tan được các chất điện ly.',
            'D. Phân tử nước có dạng hình đường thẳng.',
          ],
          level: 'Nhận biết',
        },
        {
          number: 9,
          question: 'Bào quan nào sau đây được ví như "nhà máy năng lượng" của tế bào nhân thực?',
          options: ['A. Ti thể.', 'B. Lưới nội chất.', 'C. Bộ máy Golgi.', 'D. Lysosome.'],
          level: 'Nhận biết',
        },
        {
          number: 10,
          question: 'Nếu màng sinh chất của tế bào mất tính thấm chọn lọc thì điều gì sẽ xảy ra?',
          options: [
            'A. Tế bào không thể kiểm soát sự vận chuyển các chất, dẫn đến rối loạn và chết.',
            'B. Tế bào sẽ phân chia nhanh hơn bình thường.',
            'C. Tế bào sẽ biến đổi thành tế bào nhân sơ.',
            'D. Tế bào sẽ tổng hợp protein nhanh hơn.',
          ],
          level: 'Thông hiểu',
        },
        {
          number: 11,
          question: 'Vì sao khi ngâm rau sống bị héo vào trong nước sạch một thời gian thì rau lại tươi trở lại?',
          options: [
            'A. Phân tử nước thẩm thấu vào trong tế bào làm tế bào trương nước.',
            'B. Rau quang hợp hấp thụ chất dinh dưỡng trong nước.',
            'C. Tế bào rau bị co nguyên sinh nhanh chóng.',
            'D. Các chất khoáng từ rau thoát bớt ra ngoài nước.',
          ],
          level: 'Thông hiểu',
        },
        {
          number: 12,
          question: 'Điểm khác biệt căn bản giữa vận chuyển thụ động và vận chuyển chủ động qua màng sinh chất là',
          options: [
            'A. Vận chuyển chủ động tiêu tốn năng lượng ATP và đi ngược chiều gradient nồng độ.',
            'B. Vận chuyển thụ động luôn cần protein mang.',
            'C. Vận chuyển chủ động không cần năng lượng.',
            'D. Vận chuyển thụ động chỉ xảy ra ở tế bào thực vật.',
          ],
          level: 'Thông hiểu',
        },
      ],
    },
    part2: {
      title: 'PHẦN II. Câu trắc nghiệm đúng sai (2,0 điểm)',
      instruction: 'Thí sinh trả lời các câu hỏi. Trong mỗi ý a), b), c), d) ở mỗi câu, thí sinh chọn đúng hoặc sai. Điểm được tính theo quy chuẩn: Đúng 1 ý: 0,1đ; Đúng 2 ý: 0,25đ; Đúng 3 ý: 0,5đ; Đúng 4 ý: 1,0đ.',
      questions: [
        {
          number: 1,
          context: 'Khi nghiên cứu về các cấp độ tổ chức sống theo Chương trình GDPT 2018 (SGK Kết nối tri thức), các bạn học sinh thảo luận về tính thứ bậc và đặc tính nổi trội.',
          subQuestions: [
            { key: 'a', text: 'Tế bào là cấp độ tổ chức sống nhỏ nhất có đầy đủ các biểu hiện sống cơ bản như chuyển hóa vật chất, sinh sản, cảm ứng.', level: 'Nhận biết' },
            { key: 'b', text: 'Quần thể sinh vật chỉ đơn thuần là phép cộng số học của các cá thể riêng lẻ, không xuất hiện bất kỳ đặc tính nổi trội nào mới.', level: 'Thông hiểu' },
            { key: 'c', text: 'Thế giới sống là hệ thống mở vì sinh vật liên tục thu nhận năng lượng, vật chất từ môi trường và thải chất bài tiết ra môi trường.', level: 'Thông hiểu' },
            { key: 'd', text: 'Nếu một loài mất hoàn toàn khả năng tự điều chỉnh thì loài đó vẫn tồn tại vĩnh viễn trong tự nhiên nhờ chọn lọc tự nhiên.', level: 'Thông hiểu' },
          ],
        },
        {
          number: 2,
          context: 'Một nhóm học sinh tiến hành thí nghiệm ngâm tế bào biểu bì củ hành tím vào dung dịch muối NaCl nồng độ cao (dung dịch ưu trương).',
          subQuestions: [
            { key: 'a', text: 'Nước trong tế bào hành tím sẽ khuếch tán ra ngoài môi trường theo cơ chế thẩm thấu.', level: 'Thông hiểu' },
            { key: 'b', text: 'Khối nguyên sinh chất co lại và tách dần khỏi thành tế bào (hiện tượng co nguyên sinh).', level: 'Thông hiểu' },
            { key: 'c', text: 'Thành tế bào thực vật cũng co rúm lại với mức độ tương đương như màng sinh chất.', level: 'Thông hiểu' },
            { key: 'd', text: 'Khi cho nước cất thay thế dung dịch muối thì tế bào có thể hút nước và phản co nguyên sinh trở lại trạng thái ban đầu.', level: 'Vận dụng' },
          ],
        },
      ],
    },
    part3: {
      title: 'PHẦN III. Câu trắc nghiệm trả lời ngắn (2,0 điểm)',
      instruction: 'Thí sinh ghi đáp số hoặc từ khóa trả lời ngắn vào phiếu làm bài (Mỗi câu đúng được 0,5 điểm).',
      questions: [
        {
          number: 1,
          question: 'Hãy nêu tên cấp độ tổ chức sống cơ bản là tập hợp các quần thể khác loài cùng sinh sống trong một sinh cảnh?',
          level: 'Nhận biết',
        },
        {
          number: 2,
          question: 'Nguyên tố hóa học nào được coi là "bộ khung" của tất cả các đại phân tử hữu cơ trong sự sống nhờ khả năng tạo 4 liên kết cộng hóa trị bền vững?',
          level: 'Nhận biết',
        },
        {
          number: 3,
          question: 'Một phân tử ADN mạch kép có số nuclêôtit loại Adenin (A) là 600, chiếm 20% tổng số nuclêôtit của ADN. Tính tổng số nuclêôtit (N) của phân tử ADN này?',
          level: 'Thông hiểu',
        },
        {
          number: 4,
          question: 'Bào quan nào trong tế bào thực vật chứa sắc tố diệp lục và thực hiện quá trình quang hợp hấp thụ năng lượng ánh sáng mặt trời?',
          level: 'Nhận biết',
        },
      ],
    },
    part4: {
      title: 'PHẦN IV. Tự luận (3,0 điểm)',
      instruction: 'Thí sinh trình bày chi tiết lời giải và lập luận khoa học vào giấy thi.',
      questions: [
        {
          number: 1,
          question: 'Dựa vào kiến thức về hệ thống mở và tự điều chỉnh của tổ chức sống, hãy giải thích: Tại sao khi một người vận động mạnh (như đá bóng, chạy cự ly dài), nhịp thở và nhịp tim lại tăng lên nhanh chóng? Sau khi nghỉ ngơi, các chỉ số này thay đổi như thế nào?',
          score: 1.5,
          level: 'Vận dụng',
        },
        {
          number: 2,
          question: 'Trong đời sống hàng ngày, người dân thường ướp muối vào cá tươi hoặc làm dưa cà muối chua để giữ được lâu mà không bị ôi thiu hỏng. Dựa trên hiện tượng thẩm thấu và co nguyên sinh ở tế bào vi sinh vật, hãy giải thích cơ sở khoa học của phương pháp bảo quản này?',
          score: 1.5,
          level: 'Vận dụng',
        },
      ],
    },
  },
  answerKey: {
    part1Answers: [
      { number: 1, answer: 'A', explain: 'Tế bào là đơn vị cấu trúc và chức năng cơ bản của thế giới sống.' },
      { number: 2, answer: 'A', explain: 'Định nghĩa chuẩn của quần thể sinh vật.' },
      { number: 3, answer: 'B', explain: 'Thế giới sống là hệ thống mở, không phải hệ thống kín.' },
      { number: 4, answer: 'A', explain: 'C, H, O, N chiếm khoảng 96% khối lượng vật chất khô.' },
      { number: 5, answer: 'A', explain: 'Toát mồ hôi giúp bay hơi tỏa nhiệt, duy trì ổn định thân nhiệt (cân bằng nội môi).' },
      { number: 6, answer: 'A', explain: 'Khái niệm tính chất nổi trội xuất hiện do sự tương tác giữa các bộ phận.' },
      { number: 7, answer: 'A', explain: 'Tế bào nhân thực có màng nhân bao bọc bảo vệ ADN.' },
      { number: 8, answer: 'A', explain: 'Do độ âm điện của O lớn hơn H nên cặp electron dùng chung bị lệch về phía O.' },
      { number: 9, answer: 'A', explain: 'Ti thể là nơi hô hấp tế bào tạo ATP cung cấp cho mọi hoạt động sống.' },
      { number: 10, answer: 'A', explain: 'Màng sinh chất kiểm soát chất vào/ra, mất tính thấm chọn lọc tế bào sẽ chết.' },
      { number: 11, answer: 'A', explain: 'Nước thẩm thấu từ ngoài vào tế bào làm tế bào no nước, căng trương trở lại.' },
      { number: 12, answer: 'A', explain: 'Vận chuyển chủ động tiêu tốn ATP và đi ngược chiều nồng độ gradient.' },
    ],
    part2Answers: [
      {
        number: 1,
        details: [
          { key: 'a', isCorrect: true, explain: 'Đúng, tế bào là đơn vị cơ bản nhỏ nhất mang trọn vẹn đặc trưng sống.' },
          { key: 'b', isCorrect: false, explain: 'Sai, quần thể có các đặc tính nổi trội mới như cấu trúc tuổi, tỉ lệ giới tính, mật độ.' },
          { key: 'c', isCorrect: true, explain: 'Đúng, sinh vật liên tục trao đổi chất và năng lượng với môi trường.' },
          { key: 'd', isCorrect: false, explain: 'Sai, mất khả năng tự điều chỉnh sinh vật sẽ bị rối loạn và đào thải.' },
        ],
      },
      {
        number: 2,
        details: [
          { key: 'a', isCorrect: true, explain: 'Đúng, môi trường ưu trương khiến nước thẩm thấu ra ngoài.' },
          { key: 'b', isCorrect: true, explain: 'Đúng, khối nguyên sinh co lại tạo hiện tượng co nguyên sinh.' },
          { key: 'c', isCorrect: false, explain: 'Sai, thành tế bào thực vật bằng cellulose cứng vững không bị co rúm như màng sinh chất.' },
          { key: 'd', isCorrect: true, explain: 'Đúng, đưa vào môi trường nhược trương nước lại thẩm thấu vào (phản co nguyên sinh).' },
        ],
      },
    ],
    part3Answers: [
      { number: 1, answer: 'Quần xã sinh vật', explain: 'Quần xã là tập hợp các quần thể khác loài cùng sinh sống.' },
      { number: 2, answer: 'Cacbon (C)', explain: 'Nguyên tố cacbon có 4 electron hóa trị, tạo bộ khung hữu cơ đa dạng.' },
      { number: 3, answer: '3000 nuclêôtit', explain: 'Tổng số N = 600 / 20% = 3000 nuclêôtit.' },
      { number: 4, answer: 'Lục lạp', explain: 'Lục lạp chứa diệp lục thực hiện chức năng quang hợp ở thực vật.' },
    ],
    part4Rubric: [
      {
        number: 1,
        steps: [
          { content: 'Giải thích nguyên nhân khi vận động mạnh: Cơ bắp tiêu hao nhiều năng lượng ATP -> Tế bào cần tăng cường hô hấp hiếu khí -> Nhu cầu O2 tăng cao và lượng CO2 sản sinh nhiều.', score: 0.5 },
          { content: 'Cơ chế tự điều chỉnh: Tín hiệu kích thích trung khu điều hòa tuần hoàn và hô hấp làm nhịp tim đập nhanh để bơm máu giàu O2, nhịp thở tăng để đào thải nhanh CO2 ra ngoài.', score: 0.5 },
          { content: 'Sau khi nghỉ ngơi: Nhu cầu năng lượng giảm về mức bình thường, cơ chế feedback âm giúp nhịp tim và nhịp thở dần dần giảm trở lại trạng thái cân bằng nội môi ban đầu.', score: 0.5 },
        ],
        total: 1.5,
      },
      {
        number: 2,
        steps: [
          { content: 'Xác định môi trường: Nồng độ muối trong cá ướp muối hoặc nước dưa cà muối chua rất cao, tạo môi trường ưu trương đối với tế bào vi sinh vật gây thối rữa.', score: 0.5 },
          { content: 'Cơ chế thẩm thấu & co nguyên sinh: Nước trong tế bào vi sinh vật bị rút mạnh ra ngoài theo cơ chế thẩm thấu -> Tế bào vi khuẩn bị co nguyên sinh mạnh.', score: 0.5 },
          { content: 'Kết luận thực tiễn: Vi sinh vật bị mất nước, ngừng chuyển hóa hoặc bị tiêu diệt, không thể sinh sôi làm hỏng thực phẩm; nhờ đó giữ được cá tươi và dưa cà lâu.', score: 0.5 },
        ],
        total: 1.5,
      },
    ],
  },
};
