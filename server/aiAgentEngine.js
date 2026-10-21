/**
 * RMSA Intelligent Sales & Psychology Agent Engine
 * Mô hình Cố vấn Bán Hàng & Tâm Lý Thực Chiến Running Rin
 * Phản hồi SIÊU TỐC (< 5ms), ĐÚNG TRỌNG TÂM 100%, NGẮN GỌN & THỰC CHIẾN
 */

export function generateSmartSalesConsultation(message = '') {
  const raw = (message || '').trim();
  const q = raw.toLowerCase();

  // 1A. TÌNH HUỐNG: Khoe chốt deal / Có cọc / Ký hợp đồng thành công
  const isClosedDeal = (
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
      q.includes('chốt rồi') ||
      q.includes('khách cọc rồi') ||
      q.includes('khách đồng ý cọc') ||
      q.includes('ký hợp đồng rồi') ||
      q.includes('lụm lúa') ||
      (q.includes('deal') && (q.includes('vui') || q.includes('rồi') || q.includes('thành công') || q.includes('được')))
    )
  ) && !q.includes('không chốt') && !q.includes('hụt cọc');

  if (isClosedDeal) {
    return `🎉 **CHÚC MỪNG BẠN! TUYỆT VỜI QUÁ ĐỒNG ĐỘI ƠI! 🔥**

Cảm giác chốt được deal thực chiến sau bao công sức dẫn khách thực sự rất tự hào! Rin chúc mừng bạn nhé!

⚡ **3 VIỆC PHẢI LÀM NGAY ĐỂ BẢO TOÀN DEAL 100%:**
1. **Xuất phiếu thu / xác nhận cọc ngay:** Nhắn Zalo xác nhận rõ: Mã phòng, số tiền cọc, ngày ký HĐ và ngày dọn vào.
2. **Báo chủ nhà khóa phòng:** Nhắn ngay chủ nhà/quản lý để gỡ tin và không nhận thêm khách khác.
3. **Chăm sóc trong 72h vàng:** Nhắc khách lịch hẹn dọn đồ, gửi checklist đồ cần chuẩn bị để khách an tâm tuyệt đối không đổi ý.

Nghỉ ngơi nạp lại năng lượng rồi chuẩn bị chốt tiếp deal thứ 2 trong tuần nhé! 🐆💪`;
  }

  // 1B. TÌNH HUỐNG: Bày tỏ cảm xúc vui mừng / Tâm trạng tốt / Hào hứng / Đang rất vui
  const isHappyMood = (
    q.includes('rất vui') ||
    q.includes('vui quá') ||
    q.includes('vui ghê') ||
    q.includes('tôi vui') ||
    q.includes('đang vui') ||
    q.includes('vui vẻ') ||
    q.includes('phấn khởi') ||
    q.includes('hào hứng') ||
    q.includes('sướng quá') ||
    q.includes('tuyệt vời quá') ||
    q.includes('tâm trạng tốt') ||
    q.includes('hôm nay vui') ||
    q.includes('năng lượng cao') ||
    q === 'vui' ||
    q === 'tôi vui' ||
    q === 'rất vui' ||
    q === 'vui quá'
  );

  if (isHappyMood) {
    return `🎉 **TUYỆT VỜI QUÁ ĐỒNG ĐỘI ƠI! NGHE BẠN NÓI TRÀN ĐẦY NĂNG LƯỢNG LÀM RIN CŨNG VUI LÂY LUÔN! 🔥**

Hôm nay có điều gì làm bạn vui và phấn khởi thế? 
* Bạn vừa chốt được cọc khách sộp hay tìm được căn phòng giỏ hàng ưng ý?
* Hay vừa đạt điểm cao sát hạch, được sếp hoặc khách hàng khen ngợi?
* Hay có một chuyện vui gì trong ngày hôm nay? Kể Rin nghe chi tiết với nào!

---
⚡ **3 PHƯƠNG ÁN HÀNH ĐỘNG ĐỂ NHÂN ĐÔI KẾT QUẢ NGAY HÔM NAY:**

1. **Tận dụng 'vía may mắn' & năng lượng đỉnh cao:**
   Khi bạn đang tự tin và phấn chấn, giọng nói và thần thái có sức hút cực lớn. Mở ngay danh sách khách hàng cũ hoặc khách đang do dự, bốc máy gọi chăm sóc hoặc chốt lịch xem phòng tiếp theo ngay!

2. **Lên ngay 1 bài đăng / video mới:**
   Cảm xúc tích cực sẽ toát ra từng câu chữ. Viết 1 bài đăng tìm khách hoặc quay 1 video ngắn review phòng thực tế đăng lên Chợ Tốt / Facebook / TikTok lúc này sẽ hút tương tác rất mạnh.

3. **Tự thưởng & giữ vững đà hưng phấn:**
   Thưởng cho mình một ly nước mát hoặc món ăn yêu thích, ghi nhớ cảm giác chiến thắng này để tiếp tục bứt phá trong tuần này nhé!

Bạn đang chuẩn bị đi gặp khách tiếp hay cần Rin hỗ trợ thêm kịch bản gì để nhân đôi niềm vui hôm nay, nhắn Rin liền nhé! 🐆💪`;
  }

  // 1C. TÌNH HUỐNG: Bày tỏ nỗi buồn / Mệt mỏi / Tụt mood / Áp lực / Stress / Bị khách bùng
  const isSadMood = (
    q.includes('buồn') ||
    q.includes('chán') ||
    q.includes('mệt') ||
    q.includes('áp lực') ||
    q.includes('stress') ||
    q.includes('tụt mood') ||
    q.includes('nản') ||
    q.includes('bỏ nghề') ||
    q.includes('không chốt được') ||
    q.includes('hụt cọc') ||
    q.includes('bị bùng') ||
    q.includes('leo cây')
  );

  if (isSadMood) {
    return `🐆 **RIN Ở ĐÂY LẮNG NGHE VÀ SÁT CÁNH CÙNG BẠN NÈ! 🤝**

Nghề môi giới BĐS thực chiến ai cũng từng trải qua những ngày hụt cọc hay bị khách bùng hẹn như vậy. 

Hôm nay có chuyện gì làm bạn mệt mỏi hay buồn thế?
* Có phải vừa bị khách hẹn mà không đến?
* Bị chủ nhà ép giá hay dẫn khách xem phòng cả buổi mà chưa chốt được căn nào?
* Kể Rin nghe cụ thể ca này để cùng bạn tháo gỡ nhé!

---
⚡ **3 BƯỚC ĐỂ VỰC DẬY VÀ LẤY LẠI PHONG ĐỘ NGAY:**

1. **Quy tắc xác suất 10 - 3 - 1:**
   Sales là bài toán xác suất: Cứ 10 khách liên hệ ➔ 3 khách xem phòng ➔ 1 khách chốt cọc. Mỗi lời từ chối hay ca bùng hẹn chỉ đang đưa bạn đến gần hơn khách hàng sẽ cọc tiếp theo!

2. **Tạm nghỉ 15 phút để ngắt mạch cảm xúc:**
   Rời mắt khỏi màn hình, rửa mặt nước mát hoặc uống một ly trà/cà phê. Tuyệt đối không mang tâm trạng buồn bã sang cuộc gọi của khách mới.

3. **Hành động nhỏ để lấy lại nhịp:**
   Xem lại giỏ hàng vừa cập nhật hôm nay, đăng 2 tin mới hoặc gửi tin hỏi thăm một khách hàng tiềm năng khác.

Rin tin bạn sẽ sớm lấy lại phong độ và nổ deal mới! Có tình huống khách nào đang cần gỡ, nhắn Rin ngay nhé! 🐆💪`;
  }

  // 2. TÌNH HUỐNG: Khách bảo "Anh đang bận, gửi email đi" / "Gửi thông tin qua mail" / "Đang bận"
  if (
    (q.includes('bận') || q.includes('đang bận')) &&
    (q.includes('mail') || q.includes('email') || q.includes('gửi mail') || q.includes('gửi thông tin') || q.includes('gọi lại sau'))
  ) {
    return `🐆 **KỊCH BẢN XỬ LÝ KHI KHÁCH BẢO "ANH ĐANG BẬN, GỬI EMAIL ĐI":**

Khách hàng thuê phòng gần như không bao giờ đọc email! "Gửi email" thường chỉ là phản xạ từ chối lịch sự. Đừng chỉ bảo "Dạ em gửi mail". Hãy chuyển kênh ngay sang **Zalo + Clip 30 giây**:

🗣️ **Nói nguyên văn với khách:**
> *"Dạ em hiểu anh/chị đang bận họp/làm việc ạ.*
> 
> *Để đỡ mất thời gian mở email đọc chữ dài dòng, em xin phép gửi nhanh qua Zalo cho anh/chị **3 tấm ảnh thực tế và 1 clip ngắn 30 giây** quay rõ không gian phòng để anh/chị lướt xem trong 10 giây lúc giải lao nhé.*
> 
> *Chiều nay 17h30 anh/chị tan sở hay trưa mai 11h30 em xin phép gọi lại 1 phút để cập nhật tình trạng phòng cho mình ạ?"*

🎯 **Điểm đắt giá:** Không cãi khách, đưa giải pháp nhanh hơn (Zalo 10 giây) và chốt luôn lịch gọi lại bằng câu hỏi lựa chọn thay thế (A hoặc B).`;
  }

  // 3. TÌNH HUỐNG: Khách hỏi phòng rẻ mà bên mình hết hàng rẻ, muốn hướng khách chốt phòng hiện tại
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

  // 4. TÌNH HUỐNG: Mẹo thi sát hạch / Ôn thi qua môn / Bí kíp đạt điểm cao
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

  // 5. TÌNH HUỐNG: Khách chê giá đắt / So sánh giá với chỗ khác
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

  // 6. TÌNH HUỐNG: Khách bảo "Để anh suy nghĩ thêm" / Hỏi người thân / Trì hoãn
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

  // 7. TÌNH HUỐNG: Khách chê phòng nhỏ / bí / cũ / xấu
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

  // 8. TÌNH HUỐNG: Khách sợ lừa cọc / thắc mắc quy trình đặt cọc
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

  // 9. TÌNH HUỐNG: Đăng tin tìm khách / Chợ Tốt / Facebook / TikTok / Khai thác nguồn
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

  // 10. TÌNH HUỐNG: Bị khách leo cây / bùng hẹn / trễ hẹn
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

  // 11. TÌNH HUỐNG: Gặp khách đẹp / xinh / crush
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

  // 12. TÌNH HUỐNG: Chào hỏi / Hỏi thăm thông thường
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

  // 13. PHẢN HỒI THỰC CHIẾN MỞ RỘNG (AGENT CONTEXTUAL ADVISOR)
  return `🐆 **CỐ VẤN THỰC CHIẾN TỪ RUNNING RIN:**

Về câu chuyện bạn vừa chia sẻ: *" ${raw} "*

Rin luôn đồng hành để cùng bạn gỡ mọi vướng mắc trong nghề môi giới phòng thuê thực chiến!

💡 **Để Rin đưa ra lời thoại hoặc giải pháp chính xác nhất cho bạn:**
* Bạn có thể chia sẻ cụ thể hơn: Bạn đang gặp tình huống này ở bước nào (tìm khách, gọi telesale, dẫn xem phòng hay chốt cọc)?
* Khách hàng hoặc tình huống đang có phản hồi cụ thể ra sao?

⚡ **Hành động gợi ý ngay lúc này:**
1. **Kiểm tra giỏ hàng:** Nắm chắc ít nhất 2 căn phòng dự phòng cùng tầm giá để sẵn sàng đề xuất khi cần.
2. **Nguyên tắc vàng:** Luôn dùng câu hỏi gợi mở để tìm hiểu nhu cầu thật sự của khách thay vì phỏng đoán.

Nhắn thêm chi tiết cho Rin để nhận kịch bản bẻ khóa thực chiến liền nhé! 🐆💪`;
}

export const generateClientAgentReply = generateSmartSalesConsultation;
