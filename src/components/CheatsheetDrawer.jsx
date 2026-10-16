import React from 'react';
import { X, BookOpen, Sparkles, MessageSquareQuote } from 'lucide-react';

export default function CheatsheetDrawer({ isOpen, onClose }) {
  if (!isOpen) return null;

  const scripts = [
    {
      category: '1. Khởi đầu cuộc gọi / Tin nhắn Fanpage (30 giây đầu)',
      title: 'Khi khách hỏi: "Phòng này còn không em? Giá bao nhiêu?"',
      script: '“Dạ em chào anh/chị! Căn duplex ban công thoáng này bên em hiện đang còn phòng trống vừa được tổng vệ sinh sạch sẽ thơm tho. Anh/chị dự kiến ở mấy người và tầm ngày nào mình cần dọn vào ở để em hỗ trợ giữ suất ưu đãi tốt nhất cho mình ạ?”',
      tip: 'Không bao giờ chỉ trả lời "Dạ còn" cộc lốc; luôn gửi lời chào kèm câu hỏi mở về số người ở và thời gian dọn vào.'
    },
    {
      category: '2. Xử lý từ chối giá thuê',
      title: 'Khi khách chê: "Giá bên em đắt hơn dãy trọ gần đây 500.000đ!"',
      script: '“Dạ em hiểu ngân sách là điều rất quan trọng. Tuy nhiên mức chênh lệch 500k/tháng thực chất chỉ khoảng 16.000đ/ngày (chưa bằng nửa ly cà phê). Nhưng đổi lại, anh/chị được an tâm tuyệt đối với khóa vân tay an ninh 2 lớp, camera 24/7, giờ giấc tự do không chung chủ, thang máy êm ái và đội kỹ thuật bảo trì miễn phí trong 24h. Anh/chị ưu tiên ở một nơi an tâm thoải mái hay một nơi giá rẻ nhưng lo lắng về an ninh xe cộ ạ?”',
      tip: 'Quy đổi 500k thành 16k/ngày và so sánh trực quan giữa Giá trị nhận được vs Rủi ro phòng trọ giá rẻ.'
    },
    {
      category: '3. Xử lý từ chối thời gian',
      title: 'Khi khách xem phòng xong bảo: "Để anh về suy nghĩ thêm đã!"',
      script: '“Dạ vâng anh, căn phòng là nơi mình gắn bó hàng ngày sau giờ làm việc nên cân nhắc kỹ là rất đúng ạ. Nhưng thông thường khách hàng của em nói cần suy nghĩ thêm, là do mình còn băn khoăn về giá cả hay về cách bố trí nội thất vậy anh? Anh có thể chia sẻ thật để em hỗ trợ tốt nhất cho mình không ạ?”',
      tip: 'Kỹ thuật cô lập vấn đề: tìm ra rào cản thực sự (ngân sách, hướng phòng, hay người ở cùng chưa duyệt) để giải tỏa ngay.'
    },
    {
      category: '4. Tuyệt chiêu chốt đơn / chốt cọc giữ phòng',
      title: 'Chốt cọc giả định (Assumptive Close) khi khách vừa khen phòng',
      script: '“Căn ban công thoáng này là căn đẹp nhất tòa nhà tuần này và đang có khách hẹn xem tối nay. Em thấy hướng gió và ánh sáng cực kỳ hợp với anh. Em viết phiếu giữ chỗ cho anh luôn để em báo ban quản lý khóa phòng này lại trên hệ thống nhé, anh đặt cọc bằng tiền mặt hay chuyển khoản qua mã QR ngân hàng ạ?”',
      tip: 'Không hỏi "Anh có thuê không?", mà hướng sự chú ý vào phương thức thanh toán tiền cọc (tiền mặt hay quét QR).'
    },
    {
      category: '5. Tiếp cận Khách hàng B2B Chủ nhà',
      title: 'Tư vấn hợp tác "Dịch vụ số chủ nhà" & Vận hành tòa nhà Running Man',
      script: '“Dạ em chào anh/chị! Running Man bên em hiện đang có tệp hơn 5.000 khách thuê văn minh tìm phòng mỗi tháng. Bên em áp dụng hệ thống dịch vụ số chủ nhà: quản lý số hóa điện nước, khách thuê minh bạch và cam kết tỷ lệ lấp đầy trên 95%, giải phóng 100% thời gian đau đầu thu tiền phòng cho anh/chị. Em xin phép gửi anh bảng phân tích hiệu quả dòng tiền tòa nhà bên mình nhé ạ!”',
      tip: 'Đánh trúng 2 nỗi đau lớn nhất của chủ đầu tư: Tỷ lệ phòng trống cao và sự phiền toái khi tự quản lý vận hành.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border-l border-slate-200 w-full max-w-lg h-full shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#007c5d] flex items-center justify-center border border-emerald-100 font-bold text-xs">
              RM
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Sổ Tay Kịch Bản Thực Chiến Running Man</h3>
              <p className="text-[11px] text-slate-500">Tra cứu nhanh kịch bản telesale, bẻ gãy từ chối & chốt cọc phòng</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
          {scripts.map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-[#007c5d] uppercase tracking-wider block mb-1">{item.category}</span>
              <h4 className="text-xs font-bold text-slate-900 mb-2">{item.title}</h4>
              
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-800 leading-relaxed italic mb-2 relative">
                <MessageSquareQuote className="w-4 h-4 text-slate-300 absolute top-2 right-2" />
                {item.script}
              </div>

              <p className="text-[11px] text-slate-600 font-medium flex items-center">
                <Sparkles className="w-3 h-3 mr-1 text-amber-500 shrink-0" />
                Mẹo thực chiến: {item.tip}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
          >
            Đóng sổ tay
          </button>
        </div>

      </div>
    </div>
  );
}
