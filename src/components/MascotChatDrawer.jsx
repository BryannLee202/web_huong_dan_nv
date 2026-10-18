import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  User 
} from 'lucide-react';
import api from '../services/api';

const quickPrompts = [
  '💡 Khách chê giá đắt trả lời sao?',
  '⏳ Khách bảo "Để anh suy nghĩ thêm"?',
  '📞 Khách bảo "Anh đang bận, gửi email đi"?',
  '⚔️ Khách so sánh "Bên B bán rẻ hơn 30%"?',
  '🎯 Mẹo chốt đơn không tạo cảm giác ép khách?',
  '🔒 Quy chế mở khóa tuần tự 80% là gì?'
];

let msgCounter = 0;
const getNextId = (prefix) => `${prefix}_${++msgCounter}`;

export default function MascotChatDrawer({ isOpen, onClose }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Xin chào! Mình là **Running Rin** 🐆 — Trợ lý AI Bán Hàng & Chốt Phòng của Running Man Sales Academy. Bạn cần kịch bản xử lý khi khách chê giá đắt hay mẹo vượt qua sát hạch không?',
      time: 'Vừa xong'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg = {
      id: getNextId('user'),
      sender: 'user',
      text: query,
      time: 'Vừa xong'
    };

    const currentHistory = [...messages, userMsg];
    setMessages(currentHistory);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const res = await api.chat.sendMessage(query, messages);
      const reply = res?.reply || 'Running Rin đã ghi nhận câu hỏi của bạn. Hãy gửi lại tình huống cụ thể để Rin tư vấn chi tiết nhé!';

      setMessages(prev => [
        ...prev,
        {
          id: getNextId('bot'),
          sender: 'bot',
          text: reply,
          time: 'Vừa xong'
        }
      ]);
    } catch {
      // Fallback an toàn nếu mất mạng
      setMessages(prev => [
        ...prev,
        {
          id: getNextId('bot'),
          sender: 'bot',
          text: '⚡ Running Rin đang kết nối lại mạng máy chủ. Trong tình huống này, bạn hãy áp dụng nguyên tắc: **Đồng cảm ➔ Bẻ lái sang bài toán chia nhỏ chi phí mỗi ngày (chỉ thêm 15k-25k/ngày) ➔ Đòn tâm lý giữ cọc khóa căn** để chốt phòng ngay nhé!',
          time: 'Vừa xong'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 w-full max-w-md h-full shadow-2xl flex flex-col">
        
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src="/mascot-running-rin.jpg" 
                alt="Running Rin" 
                className="w-10 h-10 rounded-full object-cover border-2 border-amber-400 shadow-sm"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 ring-1 ring-emerald-300 animate-pulse"></span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="text-sm font-black text-slate-900 dark:text-white">Running Rin Assistant</h3>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">AI Mentor</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Linh vật & Cố vấn chốt deal Running Man</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Prompts Bar */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Gợi ý câu hỏi nhanh:</p>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(prompt)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer shrink-0 font-medium shadow-xs"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Message History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 dark:bg-slate-950">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex items-start space-x-2.5 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold overflow-hidden ${
                msg.sender === 'user' 
                  ? 'bg-slate-800 dark:bg-slate-700 text-white' 
                  : 'bg-amber-500/20 text-amber-700'
              }`}>
                {msg.sender === 'user' ? (
                  <User className="w-3.5 h-3.5" />
                ) : (
                  <img 
                    src="/mascot-running-rin.jpg" 
                    alt="Running Rin" 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none whitespace-pre-line'
              }`}>
                {msg.text}
                <span className={`block text-[9px] mt-1 text-right ${
                  msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'
                }`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center space-x-2 text-xs text-slate-400 dark:text-slate-500 pl-9">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-100"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-200"></span>
              <span className="text-[11px] italic">Running Rin đang phân tích kịch bản...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Field */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
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
              className="flex-1 px-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white disabled:opacity-40 shadow-[0_2px_10px_rgba(37,99,235,0.3)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center justify-center shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
