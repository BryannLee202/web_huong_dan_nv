/**
 * GOOGLE APPS SCRIPT: TỰ ĐỘNG TẠO GOOGLE FORM TRONG 5 GIÂY
 * 
 * HƯỚNG DẪN DÀNH CHO TÀI:
 * 1. Mở trình duyệt, truy cập: https://script.google.com
 * 2. Bấm vào nút "Dự án mới" (New Project).
 * 3. Xóa hết mã có sẵn trong ô, copy toàn bộ đoạn mã bên dưới dán vào.
 * 4. Bấm nút "Chạy" ( biểu tượng nút Play ▶ ở trên thanh công cụ).
 * 5. Bấm cho phép quyền truy cập Google Drive nếu có thông báo.
 * 6. Xong! Nhìn xuống mục Nhật ký thực thi (Execution log) sẽ có sẵn 2 link:
 *    - Link gửi khách hàng điền
 *    - Link để Tài vào xem kết quả trên Google Drive!
 */

function taoGoogleFormDaoTaoBanHang() {
  // Tạo form mới
  var form = FormApp.create('PHIẾU KHẢO SÁT YÊU CẦU XÂY DỰNG WEBSITE ĐÀO TẠO BÁN HÀNG');
  form.setDescription('Nhằm đóng gói đúng các bài học và kịch bản thực chiến giúp nhân viên bán hàng mở lên là học và áp dụng được ngay, kính mời Anh/Chị điền nhanh các thông tin dưới đây (mất khoảng 3 phút).');
  form.setIsQuiz(false);

  // ==========================================
  // PHẦN 1: SẢN PHẨM & KHÁCH HÀNG
  // ==========================================
  var sec1 = form.addSectionHeaderItem();
  sec1.setTitle('PHẦN 1: SẢN PHẨM / DỊCH VỤ MÀ NHÂN VIÊN SẼ BÁN');
  
  form.addTextItem()
    .setTitle('1.1. Sản phẩm hoặc dịch vụ cụ thể mà nhân viên cần bán là gì?')
    .setHelpText('Ví dụ: Thiết bị máy móc công nghiệp, Phần mềm quản lý, Bất động sản, Dịch vụ B2B, Mỹ phẩm...')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('1.2. Khách hàng mục tiêu của nhân viên là ai?')
    .setChoiceValues([
      'B2B: Khách hàng doanh nghiệp, chủ cửa hàng, đối tác, nhà máy',
      'B2C: Người tiêu dùng cá nhân',
      'Cả hai đối tượng trên'
    ])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('1.3. Lời từ chối hoặc khó khăn lớn nhất nhân viên hay gặp khi chốt đơn?')
    .setChoiceValues([
      'Chê giá đắt hơn đối thủ cạnh tranh',
      'Bảo "Để suy nghĩ thêm" rồi im lặng',
      'Nhân viên chưa nắm vững giá trị cốt lõi của sản phẩm',
      'Kỹ năng chốt đơn (Closing skills) còn yếu'
    ]);

  // ==========================================
  // PHẦN 2: BÀI HỌC CẦN ĐÓNG GÓI SẴN
  // ==========================================
  var page2 = form.addPageBreakItem();
  page2.setTitle('PHẦN 2: DANH SÁCH BÀI HỌC CẦN ĐÓNG GÓI SẴN');

  form.addMultipleChoiceItem()
    .setTitle('2.1. Số lượng bài học dự kiến đưa lên website?')
    .setChoiceValues([
      '3 - 5 bài học cốt lõi (Gọn nhẹ, học nhanh 1-2 ngày)',
      '6 - 10 bài (Lộ trình đầy đủ từ A-Z)'
    ])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('2.2. Chọn các chuyên đề mà Anh/Chị muốn có trên website:')
    .setChoiceValues([
      'Bài 1: Kiến thức sản phẩm & Điểm bán hàng độc nhất (USP)',
      'Bài 2: Kịch bản mở đầu cuộc gọi 30s phá băng tâm lý',
      'Bài 3: Bộ câu hỏi khám phá nhu cầu khách hàng',
      'Bài 4: Bẻ gãy lời từ chối giá & So sánh đối thủ',
      'Bài 5: Kỹ thuật chốt hợp đồng giả định & Up-sell hợp đồng lớn',
      'Bài 6: Mẫu hợp đồng phân phối & Quy trình pháp lý bàn giao'
    ]);

  form.addCheckboxItem()
    .setTitle('2.3. Công ty đã có sẵn định dạng tài liệu nào?')
    .setChoiceValues([
      'Đã có Video bài giảng quay sẵn (Link Youtube / MP4)',
      'Đã có Slide thuyết trình PowerPoint / PDF',
      'Đã có Kịch bản dạng văn bản Word',
      'Chưa có, cần bên kỹ thuật lên sẵn khung nội dung thực chiến mẫu'
    ]);

  // ==========================================
  // PHẦN 3: QUY CHẾ HỌC TẬP & KIỂM TRA NĂNG LỰC
  // ==========================================
  var page3 = form.addPageBreakItem();
  page3.setTitle('PHẦN 3: QUY CHẾ HỌC TẬP & KIỂM TRA NĂNG LỰC');

  form.addMultipleChoiceItem()
    .setTitle('3.1. Nhân viên truy cập học bằng cách nào thuận tiện nhất?')
    .setChoiceValues([
      '1-Click mở link học ngay (Không cần mật khẩu rườm rà, nhân viên mở là học được luôn)',
      'Cấp tài khoản đăng nhập riêng từng nhân sự'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('3.2. Có câu hỏi trắc nghiệm kiểm tra phản xạ sau mỗi video không?')
    .setChoiceValues([
      'Có trắc nghiệm tình huống, đạt chuẩn ≥ 80% mới mở bài tiếp (Đảm bảo nhân viên học thật, hiểu thật)',
      'Không bắt buộc kiểm tra, chỉ cần xem video là xong'
    ])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('3.3. Các tính năng nâng cao dành cho Sếp & Quản lý:')
    .setChoiceValues([
      'Nút 1-Click xuất báo cáo điểm thi và tiến độ nhân sự ra Excel',
      'Tự động cấp chứng chỉ tốt nghiệp điện tử có tên nhân viên',
      'Trang Admin tự thêm/sửa video bài giảng mới không cần biết lập trình',
      'Tải file PDF kịch bản đính kèm ngay cạnh bài giảng'
    ]);

  // ==========================================
  // PHẦN 4: THƯƠNG HIỆU & THÔNG TIN CÔNG TY
  // ==========================================
  var page4 = form.addPageBreakItem();
  page4.setTitle('PHẦN 4: THƯƠNG HIỆU & THÔNG TIN CÔNG TY');

  form.addTextItem()
    .setTitle('4.1. Tên công ty / Học viện đào tạo muốn hiển thị trên web:')
    .setHelpText('Ví dụ: RIN Sales Academy, Cổng Đào Tạo Công Ty ABC...')
    .setRequired(true);

  form.addTextItem()
    .setTitle('4.2. Tên người đại diện / Giảng viên đứng tên (nếu có):')
    .setHelpText('Ví dụ: Giám đốc kinh doanh Nguyễn Văn A...');

  form.addParagraphTextItem()
    .setTitle('4.3. Ghi chú thêm bất kỳ yêu cầu đặc biệt nào của Anh/Chị:')
    .setHelpText('Ví dụ: Cần hoàn thành trước ngày nào, màu sắc chủ đạo mong muốn...');

  // In ra màn hình link xem và link điền form
  var editUrl = form.getEditUrl();
  var pubUrl = form.getPublishedUrl();

  Logger.log('========================================================');
  Logger.log('🎉 TẠO GOOGLE FORM THÀNH CÔNG 100%!');
  Logger.log('👉 LINK GỬI KHÁCH HÀNG ĐIỀN: ' + pubUrl);
  Logger.log('👉 LINK CHỈNH SỬA TRÊN DRIVE CỦA BẠN: ' + editUrl);
  Logger.log('========================================================');
}
