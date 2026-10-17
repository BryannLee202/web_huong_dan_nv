import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Lightbulb, 
  User, 
  MessageSquareQuote,
  RotateCcw
} from 'lucide-react';

export default function MascotChatDrawer({ isOpen, onClose }) {
  if (!isOpen) return null;

  const quickPrompts = [
    '💡 Khách chê giá đắt trả lời sao?',
    '⏳ Khách bảo "Để anh suy nghĩ thêm"?',
    '📞 Khách bảo "Anh đang bận, gửi email đi"?',
    '⚔️ Khách so sánh "Bên B bán rẻ hơn 30%"?',
    '🎯 Mẹo chốt đơn không tạo cảm giác ép khách?',
    '🔒 Quy chế mở khóa tuần tự 80% là gì?'
  ];

  const knowledgeBase = {
    'giá đắt': '👉 **Kịch bản xử lý khi khách chê giá đắt:**\n1. **Đồng cảm trước:** "Dạ em cảm ơn anh đã thẳng thắn chia sẻ. Quả thật thoạt nhìn thì chi phí đầu tư ban đầu có vẻ cao hơn một chút."\n2. **Chuyển dịch giá trị:** "Tuy nhiên, giải pháp bên em giúp tiết kiệm chi phí vận hành và bảo hành 1-1 lâu dài, tính ra mỗi tháng bên mình tiết kiệm được [Số tiền/Thời gian]."\n3. **Đặt câu hỏi cô lập:** "Ngoài băn khoăn về giá ra, anh còn phân vân điểm nào về tính hiệu quả nữa không ạ?"',
    'suy nghĩ thêm': '👉 **Kịch bản khi khách bảo "Để suy nghĩ thêm":**\n"Dạ vâng anh, quyết định đầu tư thì chắc chắn mình cần cân nhắc kỹ ạ. Nhưng thông thường khi các khách hàng của em nói cần suy nghĩ thêm, là do mình vẫn còn đôi chút băn khoăn về tính hiệu quả thực tế hay chính sách thanh toán ạ? Em có thể làm rõ thêm điểm nào giúp anh không ạ?"',
    'gửi email': '👉 **Kịch bản 30 giây khi khách bảo gửi email:**\n"Dạ em hiểu anh đang rất bận. Em chỉ xin đúng 30 giây để xác nhận xem giải pháp này có đúng nhu cầu của anh không, nếu không phù hợp em xin phép không làm phiền thêm ạ."',
    'bên b': '👉 **Kịch bản khi khách so sánh đối thủ rẻ hơn 30%:**\n1. Tuyệt đối **không nói xấu đối thủ**.\n2. Công nhận: "Bên B cũng là đơn vị khá tốt trên thị trường ạ."\n3. Tạo sự khác biệt: "Tuy nhiên bên em có cam kết chất lượng và hỗ trợ 24/7 trực tiếp, điều mà các bên giá rẻ thường sẽ cắt giảm. Anh ưu tiên giải pháp tiết kiệm trước mắt hay an tâm lâu dài không lo phát sinh lỗi ạ?"',
    'chốt đơn': '👉 **Kỹ thuật Chốt Đơn Lựa Chọn Thay Thế (Alternative Choice):**\nThay vì hỏi "Anh có mua không?", hãy hỏi: "Dạ vậy bên em sắp xếp bàn giao vào sáng thứ 5 hay chiều thứ 6 này thì tiện nhất cho quy trình bên mình ạ?" ➔ Loại bỏ từ "Không" trong tiềm thức khách hàng!',
    'quy chế': '👉 **Quy chế mở khóa tuần tự (Sequencing Lock):**\nTheo chuẩn TalentLMS của công ty, học viên bắt buộc phải xem xong video bài giảng và hoàn thành bài kiểm tra trắc nghiệm với điểm số **từ 80% trở lên** thì hệ thống mới tự động mở khóa bài học tiếp theo!'
  };

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Xin chào! Mình là **RIN Sales Bot** 🤖 — Trợ lý ảo đồng hành cùng bạn trong khóa đào tạo bán hàng. Bạn có thắc mắc gì về kịch bản xử lý từ chối hay mẹo làm bài test trắc nghiệm không?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // Simulate smart AI response matching keywords
    setTimeout(() => {
      const lower = query.toLowerCase();
      let reply = 'Mình đã ghi nhận câu hỏi của bạn. Trong bán hàng thực chiến, nguyên tắc quan trọng nhất là: **Lắng nghe chân thành ➔ Đồng cảm ➔ Đặt câu hỏi làm rõ ➔ Đưa ra giải pháp gắn với giá trị**. Hãy tham khảo thêm Sổ tay kịch bản hoặc xem lại video bài 2 nhé!';

      for (const [key, answer] of Object.entries(knowledgeBase)) {
        if (lower.includes(key)) {
          reply = answer;
          break;
        }
      }

      const botMsg = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border-l border-slate-200 w-full max-w-md h-full shadow-2xl flex flex-col">
        
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold border border-blue-200">
              <Bot className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="text-sm font-bold text-slate-900">RIN Sales Assistant</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <p className="text-[11px] text-slate-500">Trợ lý kịch bản bán hàng thông minh</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Prompts Bar */}
        <div className="p-3 bg-slate-50 border-b border-slate-100 overflow-x-auto">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Gợi ý câu hỏi nhanh:</p>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(prompt)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 transition-all cursor-pointer shrink-0 font-medium shadow-xs"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Message History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex items-start space-x-2.5 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === 'user' 
                  ? 'bg-slate-800 text-white' 
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none whitespace-pre-line'
              }`}>
                {msg.text}
                <span className={`block text-[9px] mt-1 text-right ${
                  msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'
                }`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center space-x-2 text-xs text-slate-400 pl-9">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-100"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-200"></span>
              <span className="text-[11px] italic">RIN Bot đang suy nghĩ kịch bản...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Field */}
        <div className="p-3 border-t border-slate-200 bg-white">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder="Nhập câu hỏi xử lý từ chối..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white disabled:opacity-40 shadow-[0_2px_10px_rgba(37,99,235,0.3)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
