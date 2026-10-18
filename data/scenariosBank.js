/**
 * RMSA - Ngân Hàng Tình Huống Thực Chiến 60s (Scenarios Bank)
 * Đóng gói từ kinh nghiệm thực địa của HLV Đan Rin & các Best Seller Running Man
 */

export const scenariosBank = [
  {
    id: 'sc-1',
    category: 'Xử lý do dự',
    question: 'Khách xem phòng xong im lặng nhìn quanh rồi nói: "Căn này cũng được nhưng để anh về bàn lại với bạn gái rồi báo em sau nhé". Bạn phản xạ thế nào trong 30 giây để không mất khách?',
    options: [
      { text: 'A. Dạ vâng, khi nào anh với bạn gái bàn xong thì cứ nhắn em nha.', isCorrect: false, feedback: '❌ Quá thụ động! 90% khách nói câu này là sẽ đi xem căn khác hoặc bị môi giới khác chốt mất.' },
      { text: 'B. Dạ anh ơi phòng này nhiều người hỏi lắm, anh không cọc ngay bây giờ là chiều có người khác cọc mất đó!', isCorrect: false, feedback: '❌ Gây áp lực thô thiển khiến khách đề phòng và nghi ngờ căn phòng có vấn đề.' },
      { text: 'C. Dạ em hiểu! Bạn gái thường quan tâm nhất là góc bếp và an ninh toà nhà. Em quay nhanh clip chi tiết góc bếp gửi anh Zalo để hai bạn cùng xem, nhân tiện tòa này cho giữ cọc 24h có hoàn lại, anh muốn khóa phòng trước không ạ?', isCorrect: true, feedback: '🎯 Chuẩn bài Đan Rin! Đánh trúng nỗi lo của người quyết định (bạn gái), chủ động tạo cầu nối Zalo và đưa ra giải pháp cọc an toàn 24h.' },
      { text: 'D. Thôi nếu anh ưng thì em xin chủ nhà bớt cho anh 200k/tháng nếu anh cọc luôn bây giờ.', isCorrect: false, feedback: '❌ Tự phá giá quá sớm làm mất vị thế, khách sẽ nghĩ phòng bị ế hoặc ép giá tiếp.' }
    ]
  },
  {
    id: 'sc-2',
    category: 'Bẻ gãy chê giá',
    question: 'Khách nhắn tin: "Phòng bên em 6 triệu/tháng là hơi đắt so với khu này, chỗ khác chỉ 5.5 triệu thôi". Bạn bẻ gãy từ chối thế nào?',
    options: [
      { text: 'A. Tiền nào của nấy anh ơi, 5.5 triệu thì phòng nhỏ và cũ hơn nhiều.', isCorrect: false, feedback: '❌ Giọng điệu đối đầu, công kích lựa chọn của khách khiến khách tự ái.' },
      { text: 'B. Dạ 500k chênh lệch chia ra chỉ 16.000đ/ngày — chưa bằng nửa ly cà phê sáng, nhưng mình có vân tay 2 lớp, camera 24/7, máy giặt riêng và kỹ thuật sửa đồ miễn phí trong 30p. Anh ghé xem thực tế 10 phút để cảm nhận nhé!', isCorrect: true, feedback: '🎯 Tuyệt chiêu Quy đổi 16k/ngày của Đan Rin! Khách thấy con số 16k quá nhỏ so với quyền lợi an ninh và tiện nghi vượt trội nhận được.' },
      { text: 'C. Dạ em chỉ đăng giùm chủ nhà thôi, giá niêm yết không bớt được đâu ạ.', isCorrect: false, feedback: '❌ Thể hiện sự thiếu chuyên nghiệp và bỏ rơi khách hàng.' },
      { text: 'D. Nếu anh chê đắt thì để em tìm căn khác rẻ hơn gửi anh sau nhé.', isCorrect: false, feedback: '❌ Chưa làm rõ giá trị đã vội rút lui, làm giảm uy tín giỏ hàng.' }
    ]
  },
  {
    id: 'sc-3',
    category: 'Nhận diện tín hiệu chốt cọc',
    question: 'Đang dẫn khách xem phòng, khách hỏi: "Khu này nước máy hay nước giếng? Điện tính giá nhà nước hay kinh doanh vậy em?". Đây là tín hiệu gì và bạn chốt thế nào?',
    options: [
      { text: 'A. Đây là tín hiệu soi mói, bạn cần trả lời ngắn gọn rồi chuyển sang chủ đề khác.', isCorrect: false, feedback: '❌ Sai lầm nghiêm trọng! Khi khách hỏi chi tiết phí sinh hoạt là họ ĐÃ NGHĨ ĐẾN CẢNH Ở ĐÂY RỒI (Tín hiệu mua hàng cực mạnh).' },
      { text: 'B. Trả lời chi tiết chỉ số điện/nước rõ ràng, rồi dùng câu hỏi giả định chốt: "Dạ điện nước đều có đồng hồ riêng minh bạch từng phòng. Căn này anh dự định chuyển vào cuối tuần này hay đầu tháng sau ạ?"', isCorrect: true, feedback: '🎯 Xuất sắc! Nhận diện đúng tín hiệu mua hàng và dùng kỹ thuật chốt cọc giả định (Assumptive Close) để đưa khách vào ngày dọn vào.' },
      { text: 'C. Dạ anh đọc hợp đồng mẫu em gửi trong Zalo là có ghi hết đó ạ.', isCorrect: false, feedback: '❌ Lười biếng, làm nguội đi cảm xúc hưng phấn muốn thuê của khách.' },
      { text: 'D. Báo giá điện nước thật rẻ để khách thích, sau này tính sau.', isCorrect: false, feedback: '❌ Vi phạm đạo đức nghề nghiệp, chắc chắn sẽ bị khách khiếu nại hoặc hủy cọc khi nhận phòng.' }
    ]
  },
  {
    id: 'sc-4',
    category: 'Telesale 30 giây',
    question: 'Khách nhắn Zalo hỏi cộc lốc: "Phòng này còn không? Giá bao nhiêu?". Phản xạ chuẩn xác nhất trong 30 giây là gì?',
    options: [
      { text: 'A. Chỉ nhắn lại: "Dạ còn ạ, giá 5tr5 anh nhé."', isCorrect: false, feedback: '❌ Trả lời cụt ngủn khiến cuộc trò chuyện kết thúc ngay lập tức, khách sẽ xem và im lặng.' },
      { text: 'B. Dạ phòng còn ạ! Căn này ban công thoáng mát vừa trống hôm qua. Anh dự định khi nào dọn vào và muốn ghé xem phòng vào trưa nay 11h30 hay chiều nay 17h30 tiện hơn ạ?', isCorrect: true, feedback: '🎯 Chuẩn công thức Telesale 30s: Xác nhận tình trạng + Nêu điểm WOW + Đặt câu hỏi lựa chọn kép chốt giờ hẹn.' },
      { text: 'C. Gửi ngay 20 tấm hình phòng và bảng nội quy toà nhà dài 2 trang.', isCorrect: false, feedback: '❌ Gây ngộp thông tin, khách lười đọc và tỉ lệ rớt tin nhắn lên tới 80%.' },
      { text: 'D. Gọi điện thoại ngay lập tức cho khách dù chưa xin phép.', isCorrect: false, feedback: '❌ Làm phiền khi khách đang bận làm việc, dễ bị khách chặn Zalo.' }
    ]
  },
  {
    id: 'sc-5',
    category: 'Khách hẹn nhưng bùng lịch',
    question: 'Đến giờ hẹn dẫn khách xem phòng nhưng gọi điện khách không bắt máy, nhắn tin Zalo không trả lời. Bạn xử lý thế nào để cứu giao dịch?',
    options: [
      { text: 'A. Bực bội nhắn tin trách móc khách thiếu lịch sự rồi bỏ về.', isCorrect: false, feedback: '❌ Thiếu chuyên nghiệp và đánh mất hoàn toàn cơ hội chốt khách này trong tương lai.' },
      { text: 'B. Đợi thêm 15 phút, sau đó quay 1 video ngắn 15s bật điều hòa mát lạnh và mở cửa phòng kèm lời nhắn: "Dạ em đã chuẩn bị phòng sẵn sàng, chắc anh đang kẹt xe hoặc bận họp đột xuất. Em gửi anh clip ngắn xem trước, khi nào xong việc anh nhắn em hỗ trợ nhé!".', isCorrect: true, feedback: '🎯 Kỹ thuật Video cứu khách bùng lịch của Running Man! Khách thấy sự chu đáo và áy náy, 70% sẽ phản hồi lại và hẹn dời sang giờ khác.' },
      { text: 'C. Ngồi đợi ở cửa toà nhà suốt 2 tiếng đồng hồ chờ khách đến.', isCorrect: false, feedback: '❌ Lãng phí thời gian quý báu của chuyên viên kinh doanh.' },
      { text: 'D. Xóa số khách và chặn luôn để lần sau đỡ mất công.', isCorrect: false, feedback: '❌ Khách bận đột xuất là chuyện bình thường, vứt bỏ data khách là tự cắt hoa hồng của mình.' }
    ]
  },
  {
    id: 'sc-6',
    category: 'Dẫn khách xem thực địa',
    question: 'Trước giờ hẹn dẫn khách xem căn hộ Duplex gác lửng 15 phút, việc quan trọng nhất bạn PHẢI làm là gì?',
    options: [
      { text: 'A. Ngồi quán nước gần đó chờ khách gọi thì mới chạy tới mở cửa.', isCorrect: false, feedback: '❌ Căn phòng đóng kín lâu ngày sẽ có mùi bí bách, ngột ngạt, làm tụt 50% cảm xúc của khách khi bước vào.' },
      { text: 'B. Đến trước 15p: Mở cửa thông thoáng, bật điều hòa 24°C mát rượi, kéo rèm đón ánh sáng tự nhiên và kiểm tra chìa khóa phòng.', isCorrect: true, feedback: '🎯 Hiệu ứng WOW nhiệt độ! Khách đi ngoài đường nóng bức bước vào căn phòng mát rượi, thơm tho sẽ muốn ở lại ngay lập tức.' },
      { text: 'C. Mang theo hợp đồng và bút sẵn sàng để ép khách ký ngay khi vừa bước vào.', isCorrect: false, feedback: '❌ Thô bạo, khiến khách có tâm lý phòng thủ và dè chừng.' },
      { text: 'D. Chỉ cần đứng ở sảnh tầng trệt bấm chuông đợi bảo vệ dắt khách lên.', isCorrect: false, feedback: '❌ Thiếu trách nhiệm, mất kết nối cảm xúc giữa môi giới và khách thuê.' }
    ]
  },
  {
    id: 'sc-7',
    category: 'Xử lý khách đòi giảm cọc',
    question: 'Khách ưng phòng rồi nhưng đòi: "Chủ nhà yêu cầu cọc 2 tháng nhiều quá, anh chỉ cọc 1 tháng được không em?". Bạn điều đình thế nào?',
    options: [
      { text: 'A. Dạ không được đâu anh, quy định tòa nhà xưa giờ như vậy rồi.', isCorrect: false, feedback: '❌ Trả lời cứng nhắc dễ làm đứt giao dịch ngay cửa miệng.' },
      { text: 'B. Dạ em hiểu tâm lý anh ngại đọng vốn. Nhưng căn này full nội thất cao cấp (máy giặt riêng, tủ lạnh hai cánh, nệm cao su). Tiền cọc bản chất vẫn là TIỀN CỦA ANH gửi chủ nhà giữ giùm và sẽ hoàn đủ 100% khi hết hợp đồng. Để em đề xuất chủ nhà cho anh chia cọc làm 2 đợt trong tháng đầu nhé!', isCorrect: true, feedback: '🎯 Định vị lại giá trị tài sản và giải pháp chia đợt đóng cọc thông minh giúp khách dễ dàng chấp nhận.' },
      { text: 'C. Thôi để em bỏ tiền túi ra cọc bù cho anh 1 tháng.', isCorrect: false, feedback: '❌ Rủi ro tài chính cực lớn cho môi giới, tuyệt đối không làm.' },
      { text: 'D. Bảo khách qua tòa khác thuê nếu không đủ tiền cọc.', isCorrect: false, feedback: '❌ Thiếu tôn trọng khách hàng và đánh mất hợp đồng.' }
    ]
  },
  {
    id: 'sc-8',
    category: 'Tư vấn bạn nữ đi thuê phòng',
    question: 'Bạn dẫn một khách hàng nữ trẻ tuổi đi xem phòng trọ một mình. Điều gì bạn cần nhấn mạnh hàng đầu để chốt được phòng?',
    options: [
      { text: 'A. Nhấn mạnh việc xung quanh có nhiều quán nhậu vui vẻ thâu đêm.', isCorrect: false, feedback: '❌ Phản tác dụng! Khách nữ một mình sợ nhất ồn ào và mất an ninh.' },
      { text: 'B. Nhấn mạnh hệ thống cửa khóa vân tay 2 lớp, camera 24/7, ban quản lý kỹ thuật trực tại toà nhà và cư dân văn minh, yên tĩnh.', isCorrect: true, feedback: '🎯 Nhu cầu an toàn (Maslow): Phụ nữ ở một mình đặt yếu tố an ninh và sự yên tâm lên trên giá tiền!' },
      { text: 'C. Khen khách xinh đẹp và hỏi chuyện đời tư cá nhân.', isCorrect: false, feedback: '❌ Thiếu đứng đắn, khiến khách sợ hãi và muốn rời đi ngay lập tức.' },
      { text: 'D. Chỉ nói về kích thước mét vuông của căn phòng.', isCorrect: false, feedback: '❌ Quá khô khan, không chạm vào cảm xúc an toàn của khách.' }
    ]
  }
];

/**
 * Lấy ngẫu nhiên 1 tình huống thực chiến không trùng với danh sách đã xem
 */
export function getRandomScenario(excludeIds = []) {
  const available = scenariosBank.filter(s => !excludeIds.includes(s.id));
  const pool = available.length > 0 ? available : scenariosBank;
  const picked = pool[Math.floor(Math.random() * pool.length)];

  // Xáo trộn ngẫu nhiên thứ tự 4 phương án A, B, C, D
  const shuffledOptions = [...picked.options].sort(() => Math.random() - 0.5);

  return {
    ...picked,
    options: shuffledOptions
  };
}
