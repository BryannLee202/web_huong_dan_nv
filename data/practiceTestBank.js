/**
 * RMSA - Ngân Hàng Đề Thi Sát Hạch Thực Địa Toàn Diện
 * Tự động xáo trộn câu hỏi và đáp án mỗi lần học viên mở phòng thi
 */

export const practiceTestBank = [
  {
    id: 'pt_1',
    category: 'Chào hỏi & Telesale 30s',
    question: 'Khi khách hàng tiềm năng vừa nhấc máy và nói: "Tôi đang rất bận, có gì gửi email đi!", phản xạ chuẩn của chuyên viên Running Man là gì?',
    options: [
      'Dạ em cúp máy ngay, cảm ơn anh đã nghe.',
      'Em chỉ nói 1 phút thôi mà anh, anh cố gắng nghe đi!',
      'Dạ em hiểu anh đang bận. Em chỉ xin đúng 30 giây để xác nhận xem tiêu chuẩn phòng này có đúng nhu cầu của anh không, nếu không phù hợp em xin phép không làm phiền thêm ạ.',
      'Anh không nghe là công ty anh sẽ thiệt hại nặng đấy ạ.'
    ],
    correctAnswer: 2,
    explanation: 'Đồng cảm với quỹ thời gian của khách và đưa ra giới hạn thời gian rõ ràng (30 giây) kèm cam kết tôn trọng sự riêng tư sẽ mở ra cơ hội tiếp cận cao nhất.'
  },
  {
    id: 'pt_2',
    category: 'Xử lý từ chối giá & Bẻ gãy phản đối',
    question: 'Khách hàng nói: "Phòng bên em 6 triệu là đắt quá, đối thủ bên tòa B cho thuê chỉ 5.5 triệu!". Lựa chọn chuyên nghiệp nhất là gì?',
    options: [
      'Bên B phòng cũ mốc và an ninh kém lắm anh đừng qua đó!',
      'Dạ 500k chênh lệch chia ra chỉ 16.000đ/ngày — chưa bằng nửa ly cà phê sáng, nhưng đổi lấy vân tay 2 lớp, camera 24/7, máy giặt riêng và bảo trì miễn phí. Anh ghé xem thực tế 10 phút để cảm nhận nhé!',
      'Vậy anh qua bên B thuê đi cho rẻ ạ.',
      'Bên em là chuẩn nhất thị trường rồi, đắt xắt ra miếng.'
    ],
    correctAnswer: 1,
    explanation: 'Kỹ thuật quy đổi 16k/ngày của HLV Đan Rin giúp khách thấy số tiền chênh lệch là quá nhỏ so với sự an toàn và tiện nghi mỗi ngày.'
  },
  {
    id: 'pt_3',
    category: 'Kỹ thuật chốt cọc giả định (Assumptive Close)',
    question: 'Khi nhận thấy khách hàng đi xem phòng đã ưng ý và hỏi về tiền điện nước, câu hỏi chốt cọc nào hiệu quả nhất?',
    options: [
      'Anh có quyết định thuê căn này hôm nay không ạ?',
      'Để em về xin ý kiến sếp xem có giảm giá thêm không nhé.',
      'Dạ điện nước đều có đồng hồ riêng minh bạch. Căn này anh dự định dọn vào cuối tuần này hay đầu tháng sau để em báo bên dọn vệ sinh chuẩn bị phòng tốt nhất ạ?',
      'Thôi anh đừng vội cọc, về suy nghĩ thêm vài ngày đi.'
    ],
    correctAnswer: 2,
    explanation: 'Kỹ thuật chốt đơn lựa chọn thay thế (Alternative Choice) đưa ra 2 mốc thời gian đều dẫn đến việc hoàn tất giữ chỗ, tránh tạo cảm giác ép buộc.'
  },
  {
    id: 'pt_4',
    category: 'Khảo sát & Phân biệt giỏ hàng',
    question: 'Điểm khác biệt cốt lõi nhất giữa căn hộ Studio và căn hộ Duplex gác lửng trong tư vấn cho khách thuê là gì?',
    options: [
      'Studio luôn đắt hơn Duplex trong mọi trường hợp.',
      'Studio tích hợp mọi tiện ích trên 1 mặt sàn thoáng đãng; còn Duplex nhân đôi không gian sống bằng cách tách biệt không gian ngủ trên gác và phòng khách/bếp bên dưới.',
      'Duplex chỉ dành cho người độc thân, Studio dành cho gia đình.',
      'Cả hai căn giống hệt nhau, chỉ khác tên gọi để môi giới đăng tin.'
    ],
    correctAnswer: 1,
    explanation: 'Hiểu sâu đặc tính kiến trúc giúp môi giới tư vấn đúng tệp khách: Khách thích riêng tư, có khách đến chơi chọn Duplex; khách thích không gian liền mạch hiện đại chọn Studio.'
  },
  {
    id: 'pt_5',
    category: 'Quy trình đón khách thực địa',
    question: 'Trước giờ hẹn dẫn khách xem phòng 15 phút, hành động nào là quy chuẩn bắt buộc của môi giới?',
    options: [
      'Đứng chờ sẵn dưới tầng hầm giữ xe bấm điện thoại.',
      'Đến trước mở cửa thông thoáng, bật điều hòa 24°C mát rượi, kéo rèm đón sáng tự nhiên và kiểm tra chìa khóa phòng.',
      'Chỉ cần gửi định vị qua Zalo bảo khách tự lên phòng xem.',
      'Gọi điện giục khách 5 phút một lần để khách chạy cho nhanh.'
    ],
    correctAnswer: 1,
    explanation: 'Hiệu ứng WOW nhiệt độ: Khách đi ngoài đường nóng bức bước vào căn phòng mát lạnh, thơm tho sẽ gia tăng tỷ lệ chốt cọc lên hơn 40%.'
  },
  {
    id: 'pt_6',
    category: 'Xử lý khi khách đòi về bàn lại với người thân',
    question: 'Khách xem phòng xong nói: "Căn này được nhưng để anh về bàn lại với người yêu rồi báo lại em". Hành động nào giúp giữ chân khách?',
    options: [
      'Dạ vậy thôi em đi về, chừng nào anh bàn xong thì nhắn em.',
      'Anh không cọc ngay là chiều có người khác cọc mất đó nha!',
      'Dạ em hiểu ạ! Bạn gái thường quan tâm nhất là góc bếp và an ninh toà nhà. Em quay clip chi tiết góc bếp gửi anh Zalo để hai bạn xem chung, nhân tiện tòa này có chính sách cọc giữ chỗ 24h có hoàn lại, anh có muốn khóa phòng trước không ạ?',
      'Giảm giá ngay 500k nếu khách ký cọc tại chỗ.'
    ],
    correctAnswer: 2,
    explanation: 'Chủ động tạo cầu nối gửi tư liệu cho người quyết định (bạn gái) và mở ra phương án cọc giữ chỗ 24h an toàn.'
  },
  {
    id: 'pt_7',
    category: 'Đạo đức nghề nghiệp & Pháp lý cọc',
    question: 'Sau khi nhận tiền cọc giữ phòng của khách, thời hạn tối đa để bạn lập phiếu cọc và nộp tiền về hệ thống là bao lâu?',
    options: [
      'Khi nào rảnh thì nộp, để trong tài khoản cá nhân vài tuần cũng được.',
      'Lập phiếu thu/phiếu cọc ngay tại chỗ có xác nhận chữ ký và nộp về kế toán/chủ nhà trong vòng tối đa 2 giờ làm việc.',
      'Không cần lập phiếu thu nếu khách chuyển khoản.',
      'Dùng tiền cọc của khách đi xoay vòng vốn cá nhân.'
    ],
    correctAnswer: 1,
    explanation: 'Kỷ luật và đạo đức làm nghề môi giới: Tiền cọc là tài sản pháp lý của khách và chủ nhà, bắt buộc phải có biên lai và nộp về hệ thống minh bạch.'
  },
  {
    id: 'pt_8',
    category: 'Dịch vụ chăm sóc sau chốt',
    question: 'Sau khi khách hàng đã dọn vào ở ngày đầu tiên, chuyên viên môi giới nên làm gì?',
    options: [
      'Xóa số điện thoại của khách vì hợp đồng đã xong, hoa hồng đã nhận.',
      'Nhắn tin hoặc gọi điện hỏi thăm: "Dạ anh/chị dọn vào phòng mới có cần em hỗ trợ thêm về wifi hay đăng ký vân tay không ạ?", và hỗ trợ kịp thời.',
      'Gọi điện ngay để gạ khách mua bất động sản triệu đô.',
      'Chỉ nhắn tin nếu chủ nhà khiếu nại khách vi phạm nội quy.'
    ],
    correctAnswer: 1,
    explanation: 'Chăm sóc 72h đầu tiên sau bàn giao là bí quyết vàng để khách tin tưởng, tái ký hợp đồng và giới thiệu thêm bạn bè (nguồn khách Referral miễn phí).'
  },
  {
    id: 'pt_9',
    category: 'Xử lý phản đối về không gian & diện tích',
    question: 'Khách hàng bước vào phòng và nói: "Phòng này hơi nhỏ, không đủ chỗ kê bàn làm việc của anh". Phản xạ bán hàng tốt nhất là gì?',
    options: [
      'Phòng trọ thì chỉ có bấy nhiêu thôi anh, muốn rộng thì thuê căn hộ 15 triệu đi.',
      'Dạ căn này thiết kế tối ưu theo phong cách Studio tối giản. Góc ban công kia đón ánh sáng tự nhiên cực tốt, rất hợp đặt bàn làm việc 1m2 xếp gọn. Để em kê thử góc đó anh xem không gian làm việc thực tế nhé!',
      'Dạ vậy thôi để em dẫn anh đi tìm tòa khác rộng hơn ạ.',
      'Anh bỏ bớt đồ đạc đi là ở vừa ngay mà.'
    ],
    correctAnswer: 1,
    explanation: 'Thay vì tranh cãi về số mét vuông, hãy gợi mở giải pháp sắp xếp nội thất thông minh và hướng khách hàng vào công năng sử dụng thực tế.'
  },
  {
    id: 'pt_10',
    category: 'Quy chuẩn ứng xử khi khách trễ hoặc bùng hẹn',
    question: 'Bạn đã đến điểm hẹn trước 15 phút, nhưng đến giờ hẹn khách nhắn: "Anh bận đột xuất không qua được, hủy nhé". Thái độ và phản xạ chuẩn là gì?',
    options: [
      'Nhắn tin trách móc khách thiếu lịch sự và làm mất công của môi giới.',
      'Chặn số khách ngay lập tức để đỡ bực mình.',
      'Dạ không sao anh ơi, công việc đột xuất là bình thường ạ! Em đang ở sẵn tại phòng, em xin phép quay 1 video ngắn toàn cảnh view ban công và góc bếp gửi qua Zalo để anh xem trước, khi nào tiện anh em mình ghé thực tế sau nhé!',
      'Gọi điện thoại liên tục ép khách phải đến bằng được.'
    ],
    correctAnswer: 2,
    explanation: 'Biến tình huống bị từ chối thành cơ hội ghi điểm tận tâm: Giữ thái độ bình thản, chuyển sang quay video thực tế gửi khách, bảo lưu thiện cảm 100%.'
  },
  {
    id: 'pt_11',
    category: 'Tư vấn an toàn cho khách hàng nữ',
    question: 'Khi tư vấn cho khách hàng là bạn nữ sinh viên hoặc nhân viên văn phòng đi thuê phòng một mình, yếu tố nào cần được ưu tiên nhấn mạnh hàng đầu?',
    options: [
      'Xung quanh có nhiều quán nhậu đêm vui vẻ.',
      'Hệ thống an ninh khép kín: Khóa vân tay 2 lớp, camera 24/7, ban quản lý trực kỹ thuật và môi trường cư dân văn minh, không gian yên tĩnh.',
      'Giá phòng rẻ nhất khu vực dù ngõ hẻm tối và vắng.',
      'Phòng cho phép nuôi nhiều chó mèo tự do.'
    ],
    correctAnswer: 1,
    explanation: 'Theo tháp nhu cầu Maslow, phụ nữ ở một mình đặt nhu cầu an toàn lên trên hết. Nhấn mạnh an ninh 2 lớp sẽ bẻ gãy mọi do dự của khách nữ.'
  },
  {
    id: 'pt_12',
    category: 'Kỹ thuật giữ ấm sau xem phòng (Follow-up 24h)',
    question: 'Khách đi xem phòng về nhưng chưa cọc, sau 24 giờ chuyên viên nên nhắn tin thế nào để kích hoạt lại quyết định thuê?',
    options: [
      'Anh có lấy phòng không để em còn cho người khác thuê?',
      'Em chào anh! Hôm qua em có lưu lại góc làm việc mà anh ưng ý. Sáng nay có 1 bạn hẹn chiều qua xem căn đó, nhưng em nhớ anh thích view này nên ưu tiên nhắn hỏi anh trước. Anh có muốn em giữ chỗ đến 12h trưa nay không ạ?',
      'Anh không thuê là sau này tìm không ra phòng rẻ thế này đâu.',
      'Nhắn tin spam liên tục 5 tin nhắn chào mời phòng khác.'
    ],
    correctAnswer: 1,
    explanation: 'Kỹ thuật Follow-up tinh tế: Tái hiện ký ức trải nghiệm tích cực của khách, tạo sự khan hiếm tự nhiên và tôn trọng ưu tiên cho khách trước.'
  },
  {
    id: 'pt_13',
    category: 'Kỹ thuật Upsell phòng cao cấp hơn',
    question: 'Khách có ngân sách 5 triệu đang xem căn 5 triệu nhưng thấy hơi chật chội. Tòa nhà có căn Duplex ban công 6.2 triệu cực đẹp. Bạn Upsell thế nào?',
    options: [
      'Căn 5 triệu này xấu lắm, anh ráng thêm tiền lấy căn 6.2 triệu đi.',
      'Dạ tiện đang ở đây, em xin phép dẫn anh lên tầng 3 ngó qua 2 phút căn Duplex có ban công thoáng mát. Căn đó chênh lệch chỉ bằng 1 bữa ăn ngoài mỗi tuần nhưng có gác lửng ngủ riêng biệt và ban công ngắm hoàng hôn cực chill ạ!',
      'Tự ý tăng giá căn 5 triệu lên 6 triệu để khách khỏi lăn tăn.',
      'Không dẫn xem vì khách bảo chỉ có ngân sách 5 triệu.'
    ],
    correctAnswer: 1,
    explanation: 'Upsell bằng trải nghiệm trực quan: Cho khách xem miễn phí không áp lực, quy đổi phần chênh lệch thành chi phí nhỏ nhặt để kích hoạt cảm xúc nâng cấp.'
  },
  {
    id: 'pt_14',
    category: 'An toàn PCCC & Trách nhiệm pháp lý',
    question: 'Khi dẫn khách tham quan tòa nhà chung cư mini hoặc căn hộ dịch vụ, điều bắt buộc chuyên viên phải nắm rõ là gì?',
    options: [
      'Vị trí bình chữa cháy, thang thoát hiểm, cảm biến khói và phổ biến sơ đồ thoát hiểm cho khách khi ký hợp đồng.',
      'Không cần quan tâm PCCC vì đó là việc của chủ nhà.',
      'Nếu khách hỏi về lối thoát hiểm thì lảng tránh sang chủ đề khác.',
      'Bảo khách tự mua bình cứu hỏa mang theo khi dọn vào ở.'
    ],
    correctAnswer: 0,
    explanation: 'Quy chuẩn an toàn nghề nghiệp: Môi giới chuyên nghiệp tại Running Man luôn am hiểu hệ thống PCCC của tòa nhà để tư vấn minh bạch, bảo vệ tính mạng cư dân.'
  },
  {
    id: 'pt_15',
    category: 'Kỹ năng đàm phán cọc với chủ nhà',
    question: 'Khách rất ưng phòng nhưng hiện tại chỉ xoay được 50% tiền cọc và xin đóng 50% còn lại vào ngày nhận phòng. Bạn xử lý ra sao?',
    options: [
      'Từ chối ngay lập tức vì không đủ 100% cọc.',
      'Tự bỏ tiền túi ra đóng bù cho khách.',
      'Báo cáo ngay với chủ nhà/quản lý: Xác nhận khách thiện chí, xin phép làm biên nhận cọc đợt 1 và ký cam kết thanh toán phần còn lại đúng ngày nhận chìa khóa.',
      'Bảo khách đi vay nóng bên ngoài để đóng đủ cọc.'
    ],
    correctAnswer: 2,
    explanation: 'Đàm phán linh hoạt trên cơ sở thiện chí: Làm cầu nối minh bạch giữa khách và chủ nhà bằng văn bản cam kết, vừa chốt được phòng vừa an toàn pháp lý.'
  },
  {
    id: 'pt_16',
    category: 'Tư vấn nhóm khách ở ghép',
    question: 'Nhóm 2 bạn sinh viên đi xem phòng cùng nhau, một bạn rất thích còn một bạn chê xa trường. Bạn xử lý thế nào để chốt?',
    options: [
      'Bảo bạn thích tự ở một mình, kệ bạn kia.',
      'Đồng cảm với bạn chê xa, phân tích tuyến xe buýt nhanh hoặc đường tránh kẹt xe tiện lợi đến trường, đồng thời nhấn mạnh lợi ích chia đôi tiền phòng siêu tiết kiệm.',
      'Trách bạn chê xa là khó tính.',
      'Dẫn hai bạn đi lòng vòng khắp thành phố đến khi mệt thì thôi.'
    ],
    correctAnswer: 1,
    explanation: 'Nguyên tắc chốt nhóm khách: Phải giải tỏa được rào cản của người phản đối (người kéo lùi) bằng giải pháp giao thông cụ thể và bài toán chia sẻ chi phí.'
  },
  {
    id: 'pt_17',
    category: 'Nhận diện khách hàng thật vs đối thủ dò giá',
    question: 'Dấu hiệu nào sau đây cho thấy một người liên hệ có khả năng là khách hàng có nhu cầu thuê thật cao nhất?',
    options: [
      'Nhắn tin hỏi cộc lốc một chữ "giá?" rồi biến mất.',
      'Hỏi dồn dập về thông tin chủ nhà và tỷ lệ hoa hồng chia cho môi giới.',
      'Nêu rõ ngày dự kiến dọn vào, thời hạn thuê tối thiểu, số lượng người ở và chủ động hỏi về tiền cọc cũng như thủ tục làm hợp đồng.',
      'Liên tục hẹn giờ xem nhưng đến sát giờ lại đổi sang địa điểm khác.'
    ],
    correctAnswer: 2,
    explanation: 'Khách hàng thật luôn có mốc thời gian dọn vào cụ thể và quan tâm sâu đến các điều kiện sinh hoạt cũng như thủ tục cọc.'
  },
  {
    id: 'pt_18',
    category: 'Đọc vị ngôn ngữ cơ thể khách hàng',
    question: 'Khi bước vào căn phòng, khách hàng tháo giày xếp gọn gàng, chạm tay vào mặt bàn bếp và mở thử tủ lạnh, cửa sổ. Hành vi này thể hiện điều gì?',
    options: [
      'Khách đang muốn bới lông tìm vết để chê bai ép giá.',
      'Khách đã có cảm giác thuộc về nơi này và đang mường tượng cảnh sinh hoạt thực tế (Tín hiệu mua hàng tích cực).',
      'Khách có thói quen soi mói đồ đạc của người khác.',
      'Khách không có ý định thuê mà chỉ đi xem cho vui.'
    ],
    correctAnswer: 1,
    explanation: 'Ngôn ngữ cơ thể sở hữu (Ownership Gestures): Khi khách tự nhiên chạm vào nội thất và mở thử các cánh tủ, tâm trí họ đã bắt đầu dọn vào sống tại căn phòng này.'
  }
];

/**
 * Lấy ngẫu nhiên N câu hỏi từ ngân hàng đề thi
 * Xáo trộn ngẫu nhiên cả thứ tự câu hỏi VÀ thứ tự 4 đáp án A/B/C/D
 */
export function getRandomPracticeQuestions(count = 5) {
  // 1. Xáo trộn thứ tự các câu hỏi trong ngân hàng
  const shuffledBank = [...practiceTestBank].sort(() => Math.random() - 0.5);
  const selectedQuestions = shuffledBank.slice(0, Math.min(count, shuffledBank.length));

  // 2. Xáo trộn 4 đáp án của từng câu hỏi và cập nhật lại correctAnswer index
  return selectedQuestions.map((q) => {
    const originalCorrectText = q.options[q.correctAnswer];
    const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
    const newCorrectAnswerIndex = shuffledOptions.indexOf(originalCorrectText);

    return {
      ...q,
      options: shuffledOptions,
      correctAnswer: newCorrectAnswerIndex
    };
  });
}
