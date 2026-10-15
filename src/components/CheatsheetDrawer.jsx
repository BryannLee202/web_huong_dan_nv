import React from 'react';
import { X, BookOpen, Sparkles, MessageSquareQuote } from 'lucide-react';

export default function CheatsheetDrawer({ isOpen, onClose }) {
  if (!isOpen) return null;

  const scripts = [
    {
      category: '1. Khởi đầu cuộc gọi / gặp mặt (30 giây đầu)',
      title: 'Mẫu câu phá vỡ rào cản đề phòng',
      script: '“Dạ em chào anh/chị [Tên]. Em là [Tên bạn] bên [Tên cty]. Em biết anh/chị đang rất bận nên em chỉ xin đúng 30 giây để chia sẻ giải pháp giúp bên mình tối ưu [Nỗi đau khách hàng]. Nếu anh/chị thấy không phù hợp, em xin phép không làm phiền thêm ạ.”',
      tip: 'Tôn trọng thời gian khách hàng và đưa ra giới hạn thời gian rõ ràng.'
    },
    {
      category: '2. Xử lý từ chối giá',
      title: 'Khi khách hàng chê "Giá đắt quá!"',
      script: '“Dạ em cảm ơn anh/chị đã thẳng thắn chia sẻ. Quả thật thoạt nhìn thì mức đầu tư ban đầu có vẻ cao hơn một chút. Nhưng nếu tính về chi phí phát sinh lâu dài và hiệu quả mang lại giúp anh/chị tiết kiệm [Số tiền/Thời gian] mỗi tháng thì đây lại là mức đầu tư tiết kiệm nhất. Anh/chị cho em hỏi điều gì khiến mình băn khoăn nhất về mức giá này ạ?”',
      tip: 'Đồng cảm trước, chuyển từ "Chi phí mua" sang "Giá trị và sự tiết kiệm lâu dài".'
    },
    {
      category: '3. Xử lý từ chối thời gian',
      title: 'Khi khách hàng bảo: "Để anh suy nghĩ thêm đã!"',
      script: '“Dạ vâng anh, quyết định đầu tư thì chắc chắn mình cần cân nhắc kỹ ạ. Nhưng thông thường khi các khách hàng của em nói cần suy nghĩ thêm, là do mình vẫn còn đôi chút băn khoăn về hiệu quả thực tế hay chính sách thanh toán ạ? Em có thể làm rõ thêm điểm nào giúp anh không?”',
      tip: 'Kỹ thuật khai thác lý do ẩn giấu phía sau lời từ chối khéo.'
    },
    {
      category: '4. Xử lý so sánh đối thủ',
      title: 'Khi khách nói: "Bên B bán rẻ hơn bên em 30%"',
      script: '“Dạ bên B cũng là một đơn vị khá tốt trên thị trường ạ. Tuy nhiên, sở dĩ bên em giữ mức giá này là vì bên em có cam kết [Bảo hành / Chăm sóc 1-1 / Độ bền vượt trội] mà bên rẻ hơn thường sẽ cắt giảm. Anh/chị ưu tiên chọn giải pháp tiết kiệm ngay trước mắt hay giải pháp an tâm lâu dài không lo phát sinh lỗi ạ?”',
      tip: 'Tuyệt đối không nói xấu đối thủ; đưa khách về tiêu chuẩn chất lượng và sự an tâm.'
    },
    {
      category: '5. Kỹ thuật chốt đơn',
      title: 'Chốt đơn lựa chọn thay thế (Alternative Choice)',
      script: '“Dạ vậy để tiện nhất cho quy trình vận hành của bên mình, anh/chị muốn bên em bàn giao và kích hoạt vào sáng thứ 5 hay chiều thứ 6 này ạ?”',
      tip: 'Không hỏi "Có mua không?", mà đưa ra 2 lựa chọn đều dẫn đến việc hoàn tất hợp đồng.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border-l border-slate-200 w-full max-w-lg h-full shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#007c5d] flex items-center justify-center border border-emerald-100">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Sổ Tay Kịch Bản Bán Hàng</h3>
              <p className="text-[11px] text-slate-500">Tra cứu nhanh mẫu câu xử lý từ chối và chốt sale</p>
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
                Mẹo: {item.tip}
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
