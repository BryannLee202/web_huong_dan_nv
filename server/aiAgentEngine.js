/**
 * RMSA Intelligent Sales & Psychology Agent Engine
 * Mô hình Cố vấn Bán Hàng & Tâm Lý Thực Chiến Running Rin
 * Thiết kế phản hồi tự nhiên, sâu sắc, thông minh như một Senior Mentor thực thụ.
 */

export function generateSmartSalesConsultation(message = '') {
  const raw = (message || '').trim();
  const q = raw.toLowerCase();

  // 1. TÌNH HUỐNG: Khách có thái độ khó chịu / cau có / hống hách / coi thường / làm khó môi giới
  if (
    q.includes('thái độ') || 
    q.includes('khó chịu') || 
    q.includes('cau có') || 
    q.includes('hách dịch') || 
    q.includes('coi thường') || 
    q.includes('khinh') || 
    q.includes('bực') || 
    q.includes('khó tính') || 
    q.includes('chửi') || 
    q.includes('gắt') ||
    q.includes('soi mói') ||
    q.includes('làm khó')
  ) {
    return `🐆 **Rin rất hiểu và đồng cảm với bạn!**
Đi dẫn khách giữa thời tiết nắng nôi kẹt xe mà gặp khách có thái độ khó chịu, gắt gỏng hay soi mói thì thực sự rất dễ làm mình bực bội, ức chế và tụt năng lượng.

Nhưng trong nghề môi giới bất động sản thực chiến, **thái độ của khách thường đến từ 3 nguyên nhân tâm lý ẩn sau:**
1. **Khách đang bị quá tải:** Họ vừa trải qua một ngày làm việc áp lực, tắc đường, hoặc đã đi xem 4-5 phòng trước đó bị lừa hình ảnh ảo nên tâm lý đang cực kỳ phòng thủ và mệt mỏi.
2. **Chiêu "dìm phong thái để ép giá":** Nhiều khách có thói quen cố tình cau có, chê bai để người môi giới mất tự tin, tự giác hạ giá hoặc nhượng bộ các điều khoản cọc.
3. **Thói quen giao tiếp:** Một số người có khuôn mặt và giọng nói tự nhiên khá lạnh lùng, nhưng thực chất bên trong họ lại là người rất dễ chốt nếu đúng nhu cầu.

---
🎯 **KẾ HOẠCH HÀNH ĐỘNG 4 BƯỚC HÓA GIẢI CỦA RIN:**

* **Bước 1 — Tách cảm xúc cá nhân (Quy tắc 5 giây):**
  Hít một hơi thật sâu. Tự nhủ trong đầu: *"Khách đang bực bội với hoàn cảnh của họ, không phải với cá nhân mình"*. Đừng để cảm xúc tiêu cực của khách cuốn bạn vào cuộc đối đầu.

* **Bước 2 — Đòn tâm lý "Mời nước mát & Hạ nhiệt":**
  Nếu bạn có sẵn chai nước suối ướp lạnh, hãy chủ động mời khách ngay khi bước vào phòng:
  > *"Dạ em mời anh/chị uống miếng nước mát cho hạ nhiệt ạ. Đi đường giờ này nắng nôi kẹt xe mệt lắm đúng không anh/chị? Mình cứ ngồi nghỉ một chút cho thoải mái rồi thong thả xem phòng nhé."*
  👉 *80% khách hàng sẽ lập tức dịu giọng lại vì bất ngờ trước sự ân cần và chu đáo của bạn!*

* **Bước 3 — Chuyển sang chế độ "Để khách tự trải nghiệm":**
  Khi khách đang khó ở, bạn càng nói nhiều giới thiệu thì họ càng thấy phiền. Hãy lùi lại một bước, giữ nụ cười nhẹ và nói:
  > *"Dạ phòng này các tiện ích cơ bản em đã bật sẵn. Anh/chị cứ thong thả đi xem kỹ từng góc từ ban công đến gác lửng xem có hợp với nhu cầu của mình không nhé. Cần thông số hay thắc mắc chỗ nào anh/chị cứ hỏi em ạ."*

* **Bước 4 — Thiết lập ranh giới nghề nghiệp đĩnh đạc (Nếu khách quá đáng/vô lễ):**
  Bạn là người mang lại giải pháp nhà ở, không phải người để khách trút giận. Nếu khách có lời lẽ xúc phạm, hãy giữ ánh mắt thẳng thắn, giọng điềm đạm:
  > *"Dạ em ở đây hỗ trợ anh/chị tìm chỗ ở ưng ý với tinh thần tôn trọng lẫn nhau ạ. Nếu căn phòng này chưa đúng tiêu chuẩn của anh/chị, em xin phép lưu lại tiêu chí để tìm căn khác phù hợp hơn gửi anh/chị sau nhé."*

💡 **Lời khuyên từ Rin:** Biến một khách hàng khó tính thành người thuê phòng chính là đỉnh cao của một Best Seller. Cố lên bạn nhé, Rin luôn đồng hành cùng bạn!`;
  }

  // 2. TÌNH HUỐNG: Khách cho leo cây / bùng hẹn / trễ hẹn / gọi không nghe
  if (
    q.includes('leo cây') || 
    q.includes('bùng hẹn') || 
    q.includes('trễ hẹn') || 
    q.includes('không đến') || 
    q.includes('không nghe máy') || 
    q.includes('chờ lâu') || 
    q.includes('hủy hẹn')
  ) {
    return `🐆 **ĐỪNG VỘI BỰC MÌNH KHI BỊ KHÁCH "LEO CÂY"!**

Rin biết cảm giác đứng chờ 30 phút - 1 tiếng dưới chân tòa nhà, gọi cháy máy không ai nghe rất ức chế. Nhưng hãy xử lý thật chuyên nghiệp để biến nguy thành cơ:

🗣️ **Tin nhắn mẫu gửi qua Zalo/SMS (Khách đọc xong chắc chắn sẽ nể phục bạn):**
> *"Dạ anh/chị ơi, em đang có mặt tại tòa nhà [Tên tòa/Số nhà] đợi mình như lịch hẹn lúc [Giờ hẹn].*
> *Em hiểu công việc của anh/chị hôm nay có thể có việc đột xuất phát sinh nên chưa kịp nghe máy.*
> *Em xin phép đợi ở sảnh thêm 15 phút. Nếu hôm nay chưa tiện, anh/chị nhắn lại em để em sắp xếp dời lịch sang khung giờ khác cho mình đỡ vội nhé ạ!"*

🎯 **Tại sao tin nhắn này hiệu quả 100%?**
1. Không trách móc, thể hiện sự thấu hiểu và tác phong đúng giờ chuẩn mực.
2. Đánh vào tâm lý áy náy của khách hàng. Khi họ có thời gian, họ sẽ ưu tiên phản hồi và tôn trọng bạn hơn bất kỳ môi giới nào khác!`;
  }

  // 3. TÌNH HUỐNG: Môi giới bị tụt mood / chán nản / stress / áp lực / muốn bỏ nghề
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
    return `🐆 **GỬI ĐỒNG ĐỘI RUNNING MAN: NGHỈ MỘT CHÚT RỒI LẠI CHIẾN TIẾP!**

Rin muốn bạn nhớ một quy luật bất biến của nghề Sales Bất Động Sản:
> **"Nghề Sales là trò chơi của xác suất thống kê (Conversion Rate)."**
> Cứ trung bình 10 khách liên hệ ➔ 3 khách đi xem phòng thực tế ➔ 1 khách chốt cọc!

Mỗi lời từ chối hay một buổi dẫn phòng thất bại **không phải là bạn kém cỏi**, mà nó chỉ là một bước đệm giúp bạn tiến gần hơn tới khách hàng sẽ chuyển tiền cọc cho bạn vào ngày mai!

☕ **Việc bạn nên làm ngay lúc này:**
1. Rời khỏi màn hình điện thoại 15 phút, uống một ly nước thật mát hoặc ly cà phê yêu thích.
2. Tự khen bản thân vì hôm nay bạn đã rất nỗ lực ra đường gặp khách thay vì ngồi yên một chỗ.
3. Mở lại danh sách khách cũ trong sổ tay, nhắn một tin hỏi thăm nhẹ nhàng. Năng lượng tích cực sẽ kéo khách hàng về lại với bạn!`;
  }

  // 4. TÌNH HUỐNG: Khách chê phòng xấu / nhỏ / cũ / ẩm mốc / bí bách
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
    return `🐆 **KỊCH BẢN XỬ LÝ KHI KHÁCH CHÊ PHÒNG XẤU / NHỎ / BÍ:**

Tuyệt đối **KHÔNG** cãi lại kiểu: *"Phòng thế này mà anh còn chê nhỏ"*. Hãy dùng kỹ thuật **"Thừa nhận khuyết điểm nhỏ để tôn vinh ưu điểm lớn"**:

🗣️ **Nói nguyên văn với khách:**
> *"Dạ em hoàn toàn đồng ý với anh/chị là diện tích căn này thiết kế theo chuẩn studio/duplex gọn gàng, không quá rộng như căn hộ 2 phòng ngủ.*
> 
> *Tuy nhiên, điểm đắt giá nhất của căn này là trần cao 3m8 rất thoáng, ban công đón gió tự nhiên và toàn bộ nội thất được tối ưu thông minh. Với người đi làm bận rộn như anh/chị, một không gian ấm cúng, dễ dọn dẹp và tiết kiệm điện máy lạnh mỗi tháng là cực kỳ hợp lý.*
> 
> *Chưa kể khu này vị trí ngay trung tâm, đi làm chỉ mất 5-10 phút không lo kẹt xe ngập nước. Tiết kiệm được 1 tiếng đồng hồ kẹt xe mỗi ngày quý giá hơn diện tích vài mét vuông nhiều anh/chị ạ!"*`;
  }

  // 5. TÌNH HUỐNG: Khách hỏi phòng rẻ mà bên mình hết hàng rẻ, muốn chốt phòng hiện tại
  if (
    (q.includes('rẻ') || q.includes('đẹp') || q.includes('giá thấp') || q.includes('phòng rẻ')) &&
    (q.includes('hết') || q.includes('chốt') || q.includes('nói gì') || q.includes('bảo sao') || q.includes('thuyết phục') || q.includes('chuyển') || q.includes('cao hơn'))
  ) {
    return `🐆 **KỊCH BẢN CHỐT PHÒNG KHI HẾT HÀNG RẺ (ĐÒN CHIA NHỎ CHI PHÍ):**

Áp dụng ngay công thức **"Đồng cảm ➔ Bài toán chia nhỏ 15k-25k/ngày ➔ Đòn khan hiếm giữ cọc"**:

🗣️ **Nói nguyên văn với khách:**
> *"Dạ em chia sẻ thật lòng với anh/chị luôn, phân khúc phòng giá mềm hơn ở khu này vừa kín khách đặt cọc trưa nay rồi ạ. Các căn đó giá rẻ hơn vì diện tích hẹp và không có cửa sổ thoáng.*
> 
> *Nhưng em giữ lại đúng căn này cho anh/chị xem. Căn này chênh lệch chỉ khoảng 500k/tháng, **tính ra mỗi ngày anh/chị chỉ thêm có 15.000đ – 20.000đ (chưa bằng 1 ly cà phê sáng)**. Đổi lại phòng có ban công ngập nắng, máy giặt riêng, khóa vân tay và giờ giấc tự do không chung chủ.*
> *Đi làm cả ngày mệt mỏi về bước vào phòng này thấy tinh thần sảng khoái, ngủ ngon giấc thì làm ra gấp 10 lần số tiền chênh đó anh/chị ạ!*
> 
> *Căn này chiều nay có 2 bạn hẹn qua xem tiếp. Để không bị hụt phòng như căn trước, anh/chị đặt cọc thiện chí 500.000đ em khóa căn ngay trên hệ thống. Trong vòng 24h nếu anh/chị ghé xem thực tế không ưng, em hoàn lại 100% tiền cọc ngay lập tức không mất một đồng nào ạ!"*`;
  }

  // 6. TÌNH HUỐNG: Khách chê giá đắt / so sánh giá đối thủ
  if (q.includes('đắt') || q.includes('cao quá') || q.includes('giảm giá') || q.includes('bớt không') || q.includes('chê đắt') || q.includes('đối thủ')) {
    return `🐆 **KỊCH BẢN BẺ GÃY LỜI TỪ CHỐI "GIÁ ĐẮT":**

Nói theo **Kỹ thuật 3 Không (Không giảm giá trần — Không tranh cãi — Tặng giá trị)**:

🗣️ **Nói nguyên văn với khách:**
> *"Dạ em cảm ơn anh/chị đã thẳng thắn chia sẻ. Thoạt nhìn mức giá ban đầu thì có vẻ nhỉnh hơn một số phòng trọ truyền thống bên ngoài đôi chút.*
> 
> *Nhưng ở hệ thống Running Man bên em, giá thuê đi kèm **Cam kết 3 Không**: Không phí ẩn vô lý, Không chung chủ tự do 24/7, và Đội kỹ thuật xử lý sự cố trong ngày.*
> 
> *Nhiều khách trước đây thuê chỗ rẻ hơn vài trăm ngàn nhưng tháng nào cũng bực mình vì mất trộm vặt, để xe chật chội và chủ nhà bắt bẻ tiền điện nước. Tính tổng chi phí và sự an tâm lâu dài thì ở đây tiết kiệm hơn rất nhiều.*
> 
> *Dạ vậy em hỗ trợ xin ban quản lý [hỗ trợ miễn phí tiền gửi 1 xe tháng đầu / cho dọn đồ vào sớm 2 ngày], anh/chị lấy căn tầng 2 hay tầng 3 để em lên phiếu giữ phòng ạ?"*`;
  }

  // 7. TÌNH HUỐNG: Khách bảo "Để anh suy nghĩ thêm" hoặc "Hỏi ý kiến bạn/vợ"
  if (q.includes('suy nghĩ') || q.includes('hỏi bạn') || q.includes('hỏi vợ') || q.includes('hỏi chồng') || q.includes('xem lại')) {
    return `🐆 **KỊCH BẢN XỬ LÝ "ĐỂ ANH SUY NGHĨ THÊM":**

Đừng nói *"Dạ vâng anh cứ suy nghĩ đi"*, vì khách đi khỏi là mất luôn! Hãy **Cô lập băn khoăn thật sự**:

🗣️ **Nói nguyên văn với khách:**
> *"Dạ vâng anh/chị, việc chọn chỗ ở gắn bó cả năm trời thì chắc chắn mình cần cân nhắc kỹ càng ạ.*
> 
> *Nhưng em xin phép hỏi thật lòng một câu, ngoài băn khoăn về [giá thuê / thời gian dọn vào] ra thì anh/chị còn điểm nào cảm thấy chưa ưng ý về căn phòng này nữa không ạ? Để em làm rõ luôn cho mình đỡ mất công đi tìm lại từ đầu.*
> 
> *Vì giỏ hàng khu này biến động theo giờ, căn đẹp giá tốt rất nhanh kín. Em tạm giữ ưu tiên căn này cho anh/chị đến 17h chiều nay nhé, có ai hỏi em sẽ báo anh/chị trước tiên ạ!"*`;
  }

  // 8. TÌNH HUỐNG: Khách sợ bị lừa cọc / thắc mắc quy trình cọc
  if (q.includes('cọc') || q.includes('đặt cọc') || q.includes('lừa') || q.includes('mất tiền') || q.includes('hoàn cọc')) {
    return `🐆 **CÁCH TẠO NIỀM TIN TUYỆT ĐỐI VỀ TIỀN CỌC:**

🗣️ **Nói với khách để họ yên tâm chuyển tiền ngay tại chỗ:**
> *"Dạ anh/chị hoàn toàn yên tâm 100%. Khi anh/chị cọc, hệ thống Running Man bên em xuất ngay **Phiếu thu điện tử có dấu mộc và mã căn hộ chính thức** gửi trực tiếp về Zalo/SMS của anh/chị.*
> 
> *Trên phiếu ghi rõ: Cam kết giữ đúng căn phòng, đúng giá thuê, đúng hiện trạng nội thất và ngày bàn giao. Nếu bên em không bàn giao đúng cam kết, hệ thống bồi hoàn 100% tiền cọc ngay lập tức theo đúng quy định pháp lý ạ!"*`;
  }

  // 9. TÌNH HUỐNG: Chào hỏi, khen ngợi hoặc trò chuyện thông thường
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
    return `🐆 **Xin chào đồng đội! Rin luôn ở đây cùng bạn!**

Mình là **Running Rin** — Trợ lý AI & Cố vấn Bán Hàng Thực Chiến của Running Man Sales Academy (RMSA). 

Bạn đang gặp ca dẫn khách nào khó nhằn, khách chê đắt, khách khó tính hay cần kịch bản chốt cọc gấp? Cứ gửi câu hỏi hoặc tình huống cụ thể vào đây, Rin sẽ cùng bạn gỡ rối và đưa ra lời thoại chốt deal ngay lập tức nhé! 🔥`;
  }

  // 10. PHẢN HỒI THÔNG MINH CHO CÁC CÂU HỎI THỰC CHIẾN KHÁC (AGENT MINDSET)
  return `🐆 **CỐ VẤN THỰC CHIẾN TỪ RUNNING RIN:**

Về tình huống bạn vừa chia sẻ: *" ${raw} "*

Dưới góc nhìn tâm lý bán hàng thực chiến của Running Man, đây là cách bạn giải quyết triệt để vấn đề:

1. **Phân tích cốt lõi:**
   Khách hàng thuê căn hộ/phòng trọ thường không mua "4 bức tường", mà họ mua **cảm giác an toàn, sự tiện lợi và sự tôn trọng**. Mọi sự do dự hay phản ứng của khách đều bắt nguồn từ một nỗi sợ chưa được giải tỏa (sợ hớ giá, sợ phiền toái, sợ môi giới vô trách nhiệm sau khi ký).

2. **Cách ứng biến ngay trước mặt khách:**
   * Luôn giữ nụ cười và tông giọng điềm tĩnh, ấm áp.
   * Dùng câu hỏi để dẫn dắt thay vì cố gắng giải thích: *"Dạ nếu chọn căn này thì điều gì làm anh/chị ưng ý nhất và điều gì làm mình còn băn khoăn nhất ạ?"*
   * Đưa ra giải pháp cụ thể giúp khách vượt qua rào cản tâm lý.

3. **Hành động tiếp theo:**
   Nếu bạn đang ở cạnh khách, hãy cho khách 2 phút tự do trải nghiệm không gian. Sau đó tiến lại gần và dùng câu hỏi chốt lựa chọn thay thế: *"Anh/chị thấy căn này tiện chuyển đồ vào cuối tuần này hay đầu tháng sau hơn ạ?"*

Bạn cần kịch bản chi tiết cho tình huống nào cụ thể hơn nữa không, nhắn Rin ngay nhé!`;
}
