/**
 * RMSA Intelligent Sales & Psychology Agent Engine
 * Mô hình Cố vấn Bán Hàng & Tâm Lý Thực Chiến Running Rin
 * Phản hồi SIÊU TỐC (< 5ms), ĐÚNG TRỌNG TÂM 100%, NGẮN GỌN & THỰC CHIẾN
 */

export function generateSmartSalesConsultation(message = '') {
  const raw = (message || '').trim();
  const q = raw.toLowerCase();

  // 1. TÌNH HUỐNG: Khoe chốt deal / Vui mừng / Đạt thành tích / Có cọc / Ký hợp đồng
  if (
    !q.includes('nói gì') &&
    !q.includes('bảo sao') &&
    !q.includes('thuyết phục') &&
    !q.includes('làm sao') &&
    (
      q.includes('chốt được') ||
      q.includes('chốt deal') ||
      q.includes('đã chốt') ||
      q.includes('vừa chốt') ||
      q.includes('chốt xong') ||
      q.includes('khách cọc rồi') ||
      q.includes('khách đồng ý cọc') ||
      q.includes('ký hợp đồng rồi') ||
      q.includes('lụm lúa') ||
      (q.includes('deal') && (q.includes('vui') || q.includes('rồi') || q.includes('thành công') || q.includes('được'))) ||
      (q.includes('chốt') && (q.includes('vui') || q.includes('rồi')))
    )
  ) {
    return `🎉 **CHÚC MỪNG BẠN! TUYỆT VỜI QUÁ ĐỒNG ĐỘI ƠI! 🔥**

Cảm giác chốt được deal thực chiến sau bao công sức dẫn khách thực sự rất tự hào! Rin chúc mừng bạn nhé!

⚡ **3 VIỆC PHẢI LÀM NGAY ĐỂ BẢO TOÀN DEAL 100%:**
1. **Xuất phiếu thu/xác nhận cọc ngay:** Nhắn Zalo xác nhận rõ: Mã phòng, số tiền cọc, ngày ký HĐ và ngày dọn vào.
2. **Báo chủ nhà khóa phòng:** Nhắn ngay chủ nhà/quản lý để gỡ tin và không nhận thêm khách khác.
3. **Chăm sóc trong 72h vàng:** Nhắc khách lịch hẹn dọn đồ, gửi checklist đồ cần chuẩn bị để khách an tâm tuyệt đối không đổi ý.

Nghỉ ngơi nạp lại năng lượng rồi chuẩn bị chốt tiếp deal thứ 2 trong tuần nhé! 🐆💪`;
  }

  // 2. TÌNH HUỐNG: Khách hỏi phòng rẻ mà bên mình hết hàng rẻ, muốn hướng khách chốt phòng hiện tại
  if (
    (q.includes('rẻ') || q.includes('giá thấp') || q.includes('phòng rẻ')) &&
    (q.includes('hết') || q.includes('chốt') || q.includes('nói gì') || q.includes('bảo sao') || q.includes('thuyết phục') || q.includes('chuyển') || q.includes('cao hơn'))
  ) {
    return `🐆 **KỊCH BẢN CHỐT PHÒNG KHI HẾT HÀNG RẺ (ĐÒN CHIA NHỎ CHI PHÍ):**

🗣️ *Nói nguyên văn với khách:*
> *"Dạ em chia sẻ thật lòng với anh/chị luôn, phân khúc phòng giá mềm hơn ở khu này vừa kín khách đặt cọc trưa nay rồi ạ. Các căn đó rẻ hơn vì diện tích hẹp và không có cửa sổ thoáng.*
> 
> *Nhưng em giữ lại đúng căn này cho anh/chị xem. Căn này chênh lệch chỉ khoảng 500k/tháng, **tính ra mỗi ngày chia nhỏ chỉ thêm 16.000đ (chưa bằng 1 ly cà phê sáng)**. Đổi lại phòng có ban công ngập nắng, máy giặt riêng, khóa vân tay và giờ giấc tự do không chung chủ.*
> 
> *Căn này chiều nay có 2 bạn hẹn qua xem tiếp. Để không bị hụt phòng như căn trước, anh/chị đặt cọc thiện chí 500k em khóa căn ngay trên hệ thống. Trong 24h nếu ghé xem thực tế không ưng, em hoàn lại 100% tiền cọc ngay lập tức ạ!"*`;
  }

  // 3. TÌNH HUỐNG: Mẹo thi sát hạch / Ôn thi qua môn / Bí kíp đạt điểm cao
  if (
    q.includes('sát hạch') ||
    q.includes('thi sát hạch') ||
    q.includes('mẹo thi') ||
    q.includes('ôn thi') ||
    q.includes('qua môn') ||
    q.includes('đề thi') ||
    q.includes('câu hỏi sát hạch') ||
    q.includes('làm sao qua') ||
    q.includes('điểm cao')
  ) {
    return `🎯 **3 MẸO VƯỢT QUA SÁT HẠCH TRÊN 90 ĐIỂM TỪ HLV ĐAN RIN:**

1. **Nhớ công thức 4 bước tư vấn:** *Đặc điểm ➔ Lợi ích ➔ Nhu cầu ➔ Xác nhận* (bán giá trị trước khi nói giá tiền).
2. **Bẫy chi phí phát sinh:** Câu hỏi về giá thuê luôn phải tính **tổng chi phí hàng tháng** (tiền phòng + điện, nước, gửi xe, rác, quản lý).
3. **Quy tắc an toàn & Cọc:** Cọc phải có phiếu thu điện tử cam kết bồi hoàn 100% nếu sai hiện trạng; luôn kiểm tra 6 điểm an toàn PCCC.

👉 Đọc lướt 4 ý tóm tắt ở tab **Bài Giảng**, bạn sẽ tự tin hoàn thành 10 câu trong 3 phút! 🔥`;
  }

  // 3. TÌNH HUỐNG: Khách chê giá đắt / So sánh giá với chỗ khác
  if (
    q.includes('đắt') ||
    q.includes('cao quá') ||
    q.includes('giảm giá') ||
    q.includes('bớt không') ||
    q.includes('chê đắt') ||
    q.includes('đối thủ') ||
    q.includes('chỗ khác rẻ')
  ) {
    return `🐆 **KỊCH BẢN BẺ GÃY "CHÊ GIÁ ĐẮT" — NÓI THẲNG VỚI KHÁCH:**

🗣️ *"Dạ em cảm ơn anh/chị. Thoạt nhìn ban đầu thì giá nhỉnh hơn phòng trọ truyền thống đôi chút. Nhưng ở bên em, giá thuê đi kèm **Cam kết 3 Không**: Không chung chủ giờ giấc 24/7, Không phí ẩn vô lý, và Sự cố kỹ thuật xử lý ngay trong ngày.*

*Chênh lệch chỉ 500k/tháng — **tính ra mỗi ngày chỉ 16.000đ (chưa bằng ly cà phê sáng)**, đổi lại anh/chị có máy giặt riêng, an ninh vân tay, đi làm về ngủ ngon giấc không lo mất cắp.*

*Em xin quản lý hỗ trợ [miễn phí gửi 1 xe tháng đầu / cho dọn đồ vào sớm 2 ngày], anh/chị lấy căn tầng 2 hay tầng 3 để em lên phiếu giữ căn ạ?"*`;
  }

  // 4. TÌNH HUỐNG: Khách bảo "Để anh suy nghĩ thêm" / Hỏi người thân / Trì hoãn
  if (
    q.includes('suy nghĩ') ||
    q.includes('hỏi bạn') ||
    q.includes('hỏi vợ') ||
    q.includes('hỏi chồng') ||
    q.includes('xem lại') ||
    q.includes('từ từ')
  ) {
    return `🐆 **KỊCH BẢN CÔ LẬP BĂN KHOĂN KHI KHÁCH BẢO "SUY NGHĨ THÊM":**

🗣️ *"Dạ vâng anh/chị, tìm chỗ ở cả năm trời thì chắc chắn mình cần cân nhắc kỹ ạ.*

*Nhưng em xin phép hỏi thật, ngoài [giá thuê / ngày dọn vào] ra thì anh/chị còn điểm nào cảm thấy chưa ưng ý về căn phòng này nữa không để em giải đáp luôn cho mình đỡ mất công đi tìm lại từ đầu ạ?*

*Khu này phòng đẹp giá hợp lý rất nhanh kín. Em tạm giữ ưu tiên căn này cho anh/chị đến 17h chiều nay nhé, có ai hỏi em sẽ báo anh/chị trước tiên ạ!"*`;
  }

  // 5. TÌNH HUỐNG: Khách chê phòng nhỏ / bí / cũ / xấu
  if (
    q.includes('xấu') ||
    q.includes('nhỏ') ||
    q.includes('chật') ||
    q.includes('cũ') ||
    q.includes('ẩm') ||
    q.includes('mùi') ||
    q.includes('bí') ||
    q.includes('nóng')
  ) {
    return `🐆 **KỊCH BẢN XỬ LÝ KHÁCH CHÊ PHÒNG NHỎ / BÍ:**

🗣️ *"Dạ em đồng ý với anh/chị là căn này thiết kế theo chuẩn studio/duplex gọn gàng. Nhưng bù lại, trần cao 3m8 rất thoáng, ban công đón gió tự nhiên và nội thất thông minh.*

*Với người đi làm bận rộn, không gian này vừa ấm cúng, dễ lau dọn lại tiết kiệm điện máy lạnh. Chưa kể vị trí ngay trung tâm, mỗi ngày tiết kiệm được 1 tiếng kẹt xe quý hơn vài mét vuông nhiều anh/chị ạ!"*`;
  }

  // 6. TÌNH HUỐNG: Khách sợ lừa cọc / thắc mắc quy trình đặt cọc
  if (
    q.includes('cọc') ||
    q.includes('đặt cọc') ||
    q.includes('lừa') ||
    q.includes('mất tiền') ||
    q.includes('hoàn cọc') ||
    q.includes('giữ chỗ')
  ) {
    return `🐆 **LỜI THOẠI TẠO NIỀM TIN CỌC 100% TẠI CHỖ:**

🗣️ *"Dạ anh/chị yên tâm tuyệt đối. Khi cọc, bên em xuất ngay **Phiếu thu điện tử có dấu mộc và mã căn hộ chính thức** gửi trực tiếp về Zalo của anh/chị.*

*Trên phiếu ghi rõ: Cam kết giữ đúng căn phòng, đúng giá thuê, đúng hiện trạng nội thất và ngày nhận phòng. Nếu không bàn giao đúng cam kết, hệ thống hoàn trả 100% tiền cọc ngay lập tức theo đúng quy định pháp lý ạ!"*`;
  }

  // 7. TÌNH HUỐNG: Đăng tin tìm khách / Chợ Tốt / Facebook / TikTok / Khai thác nguồn
  if (
    q.includes('đăng tin') ||
    q.includes('chợ tốt') ||
    q.includes('tìm khách') ||
    q.includes('kiếm khách') ||
    q.includes('facebook') ||
    q.includes('tiktok') ||
    q.includes('nguồn khách')
  ) {
    return `📢 **3 TIÊU CHÍ ĐĂNG TIN NỔ INBOX TRONG 24H:**

1. **Ảnh thật góc rộng:** Chụp từ cửa nhìn vào, lấy trọn ban công/ánh sáng và gác lửng sạch sẽ. Không dùng ảnh 3D ảo.
2. **Tiêu đề giật tít đúng nhu cầu:** *Vị trí (gần trường ĐH/khu văn phòng) + Loại căn + Giá thuê trọn gói + Ưu đãi (Free xe/nước tháng đầu)*.
3. **Tốc độ phản hồi < 3 phút:** Khách nhắn là gửi ngay video thực tế quay phòng. Ai nhanh người đó chốt!`;
  }

  // 8. TÌNH HUỐNG: Bị khách leo cây / bùng hẹn / trễ hẹn
  if (
    q.includes('leo cây') ||
    q.includes('bùng hẹn') ||
    q.includes('trễ hẹn') ||
    q.includes('không đến') ||
    q.includes('không nghe máy') ||
    q.includes('chờ lâu') ||
    q.includes('hủy hẹn')
  ) {
    return `🐆 **TIN NHẮN ZALO MẪU KHI BỊ KHÁCH "LEO CÂY":**

📲 *Nhắn nguyên văn:*
> *"Dạ anh/chị ơi, em đang có mặt tại sảnh tòa nhà đợi mình như lịch hẹn lúc [Giờ hẹn].*
> *Em hiểu công việc của anh/chị hôm nay có thể có việc đột xuất nên chưa kịp nghe máy.*
> *Em xin phép đợi thêm 15 phút. Nếu hôm nay chưa tiện, anh/chị nhắn lại em để em sắp xếp dời sang khung giờ khác cho mình đỡ vội nhé ạ!"*

👉 Không trách móc, thể hiện sự lịch thiệp. 90% khách đọc xong sẽ áy náy và chủ động hẹn lại!`;
  }

  // 9. TÌNH HUỐNG: Tụt mood / mệt mỏi / áp lực / stress
  if (
    q.includes('tụt mood') ||
    q.includes('nản') ||
    q.includes('mệt mỏi') ||
    q.includes('áp lực') ||
    q.includes('bỏ nghề') ||
    q.includes('stress') ||
    q.includes('không chốt được') ||
    q.includes('buồn')
  ) {
    return `🐆 **GỬI ĐỒNG ĐỘI RUNNING MAN: NGHỈ 15 PHÚT RỒI LẠI CHIẾN TIẾP!**

Nghề Sales BĐS là trò chơi của xác suất: **10 khách liên hệ ➔ 3 khách xem phòng ➔ 1 khách chốt cọc!**

Mỗi lời từ chối không có nghĩa là bạn kém, mà là bạn vừa bước gần hơn 1 bước tới khách hàng sẽ cọc phòng cho bạn ngày mai.

Uống một ly nước mát, tự khen mình vì hôm nay đã nỗ lực ra đường dẫn khách, rồi mở danh sách nhắn lại 3 khách cũ hỏi thăm nhé! 🔥`;
  }

  // 10. TÌNH HUỐNG: Gặp khách đẹp / xinh / crush
  if (
    q.includes('đẹp gái') ||
    q.includes('xinh gái') ||
    q.includes('đẹp trai') ||
    q.includes('xinh đẹp') ||
    q.includes('gái xinh') ||
    q.includes('dễ thương') ||
    q.includes('crush')
  ) {
    return `🐆 **MẸO THỰC CHIẾN: CHỐT HỢP ĐỒNG TRƯỚC, XIN INFOR SAU!**

1. **Phong thái đĩnh đạc:** Tự tin, lịch sự, mở cửa cho khách, giọng nói rõ ràng. Đàn ông quyến rũ nhất khi làm việc chuyên nghiệp.
2. **Nhấn mạnh An Ninh & Bảo Vệ:** Nữ giới đi thuê phòng cần nhất sự an tâm: *"Khu này vân tay 2 lớp, camera 24/7 và giờ giấc tự do, bạn ở một mình cực kỳ an tâm."*
3. **Chốt deal để có cơ hội chăm sóc:** Khi khách cọc, bạn nghiễm nhiên có Zalo, SĐT chính chủ và trở thành người hỗ trợ tin cậy! 😉`;
  }

  // 11. TÌNH HUỐNG: Chào hỏi / Hỏi thăm thông thường
  if (
    q === 'rin' ||
    q === 'rin ơi' ||
    q.includes('xin chào') ||
    q.includes('chào rin') ||
    q.includes('hello') ||
    q.includes('bạn là ai') ||
    q.includes('cảm ơn') ||
    q.includes('hay quá')
  ) {
    return `🐆 **Chào bạn! Running Rin luôn sẵn sàng đồng hành cùng bạn!**

Bạn đang cần kịch bản xử lý ca khách nào: **Khách chê đắt**, **Khách đòi suy nghĩ thêm**, **Mẹo thi sát hạch** hay **Cách đăng tin nổ inbox**? Nhắn Rin tình huống cụ thể, Rin hỗ trợ bạn ngay nhé! 🔥`;
  }

  // 12. PHẢN HỒI THỰC CHIẾN ĐÚNG TRỌNG TÂM (FALLBACK DƯỚI 4 CÂU)
  return `🐆 **CỐ VẤN THỰC CHIẾN TỪ RUNNING RIN:**

Về tình huống của bạn: *" ${raw} "*

💡 **Bí kíp thực chiến xử lý ngay:**
* **Bản chất:** Bán giá trị và giải pháp cuộc sống thay vì tranh luận về giá tiền.
* **Lời thoại gợi ý:** *"Dạ em hiểu điều anh/chị đang băn khoăn. Em ở đây để đồng hành giúp anh/chị chọn được căn phòng ưng ý, an toàn và tối ưu chi phí nhất ạ."*
* **Hành động ngay:** Đặt câu hỏi lựa chọn thay thế (A hoặc B) để thúc đẩy khách đưa ra quyết định chốt giữ phòng.

Bạn cần kịch bản chi tiết cho tình huống nào cụ thể hơn, nhắn Rin ngay nhé!`;
}
