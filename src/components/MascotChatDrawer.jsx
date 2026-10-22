import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Send, 
  User,
  Minus,
  Maximize2,
  Network
} from 'lucide-react';
import api from '../services/api';
import { generateClientAgentReply } from '../services/aiAgentEngine';

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

// Xóa bỏ hoàn toàn các dấu sao (**) và hiển thị chữ in đậm sạch đẹp
function renderFormattedMessage(text, isUser = false) {
  if (!text) return null;
  const lines = text.split('\n');

  return lines.map((line, lineIdx) => {
    const trimmed = line.trim();

    // Dòng kẻ ngang ---
    if (trimmed === '---') {
      return (
        <hr key={lineIdx} className="my-2 border-slate-200 dark:border-slate-700/60" />
      );
    }

    // Dòng trích dẫn blockquote (> ...)
    let isQuote = false;
    let content = line;
    if (trimmed.startsWith('>')) {
      isQuote = true;
      content = trimmed.replace(/^>\s*/, '');
    }

    // Tách và chuyển đổi **chữ** thành thẻ <strong> sạch đẹp, không còn dấu sao
    const parts = content.split(/(\*\*.*?\*\*)/g);
    const parsedElements = parts.map((part, partIdx) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        const cleanBold = part.slice(2, -2).replace(/\*/g, '');
        return (
          <strong
            key={partIdx}
            className={isUser ? "font-bold text-white" : "font-bold text-slate-900 dark:text-amber-400"}
          >
            {cleanBold}
          </strong>
        );
      }
      return part.replace(/\*\*/g, '');
    });

    if (isQuote) {
      return (
        <div
          key={lineIdx}
          className="my-1.5 pl-2.5 py-1 border-l-2 border-amber-500 bg-amber-500/10 dark:bg-amber-500/15 rounded-r text-[11px] italic"
        >
          {parsedElements}
        </div>
      );
    }

    return (
      <span key={lineIdx} className="block min-h-[1.1rem]">
        {parsedElements}
      </span>
    );
  });
}

export default function MascotChatDrawer({ isOpen, onClose }) {
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Xin chào! Mình là Running Rin 🐆 — Trợ lý AI Bán Hàng & Chốt Phòng của Running Man Sales Academy. Bạn cần kịch bản xử lý khi khách chê giá đắt hay mẹo vượt qua sát hạch không?',
      time: 'Vừa xong'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isMinimized]);

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
      const reply = res?.reply || generateClientAgentReply(query);
      const graphNodes = res?.graphNodes || [];

      setMessages(prev => [
        ...prev,
        {
          id: getNextId('bot'),
          sender: 'bot',
          text: reply,
          time: 'Vừa xong',
          graphNodes
        }
      ]);
    } catch {
      // Khi mất mạng hoặc không kết nối được backend, tự động kích hoạt Client AI Agent
      const agentReply = generateClientAgentReply(query);
      setMessages(prev => [
        ...prev,
        {
          id: getNextId('bot'),
          sender: 'bot',
          text: agentReply,
          time: 'Vừa xong'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  // Trạng thái thu nhỏ: thanh pill tiện lợi ở góc phải dưới
  if (isMinimized) {
    const minimizedContent = (
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[99999] flex items-center space-x-3 bg-white dark:bg-slate-900 border border-amber-500/40 dark:border-amber-500/30 rounded-full px-3.5 py-2 shadow-2xl hover:shadow-amber-500/10 cursor-pointer transition-all hover:scale-105 select-none animate-in fade-in slide-in-from-bottom-2">
        <div 
          onClick={() => setIsMinimized(false)}
          className="flex items-center space-x-2.5"
        >
          <div className="relative">
            <img 
              src="/mascot-running-rin.jpg" 
              alt="Running Rin" 
              className="w-8 h-8 rounded-full object-cover border-2 border-amber-400"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white dark:border-slate-900"></span>
          </div>
          <div className="text-left pr-2">
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Running Rin</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold">AI</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Bấm để mở lại chat</p>
          </div>
        </div>

        <div className="flex items-center space-x-1 border-l border-slate-200 dark:border-slate-800 pl-2">
          <button
            onClick={() => setIsMinimized(false)}
            title="Mở rộng khung chat"
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            title="Đóng chat"
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
    return typeof document !== 'undefined' ? createPortal(minimizedContent, document.body) : minimizedContent;
  }

  const chatContent = (
    <div 
      data-modal-portal="true"
      className="fixed inset-x-2 bottom-3 sm:inset-x-auto sm:bottom-5 sm:right-5 z-[99999] w-auto sm:w-[380px] h-[540px] max-h-[86vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl shadow-slate-900/20 dark:shadow-black/60 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 select-text pb-[env(safe-area-inset-bottom,0px)]"
      style={{ backdropFilter: 'none' }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white/95 dark:bg-slate-900/95 select-none">
        <div className="flex items-center space-x-2.5">
          <div className="relative">
            <img 
              src="/mascot-running-rin.jpg" 
              alt="Running Rin" 
              className="w-9 h-9 rounded-full object-cover border-2 border-amber-400 shadow-sm"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 animate-pulse"></span>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h3 className="text-xs font-black text-slate-900 dark:text-white">Running Rin Assistant</h3>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">AI Mentor</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Cố vấn chốt deal Running Man</p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button 
            onClick={() => setIsMinimized(true)}
            title="Thu nhỏ khung chat"
            className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={onClose}
            title="Đóng khung chat"
            className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Prompts Bar (Cuộn ngang nhỏ gọn, không choáng chỗ) */}
      <div className="px-3 py-2 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-100 dark:border-slate-800 select-none">
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar scroll-smooth">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(prompt)}
              className="text-[10px] px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer whitespace-nowrap shrink-0 font-medium shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Message History */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-50/40 dark:bg-slate-950/50">
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex items-start space-x-2 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold overflow-hidden ${
              msg.sender === 'user' 
                ? 'bg-slate-800 dark:bg-slate-700 text-white' 
                : 'bg-amber-500/20 text-amber-700'
            }`}>
              {msg.sender === 'user' ? (
                <User className="w-3 h-3" />
              ) : (
                <img 
                  src="/mascot-running-rin.jpg" 
                  alt="Running Rin" 
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className={`max-w-[85%] rounded-2xl p-2.5 text-xs leading-relaxed shadow-2xs ${
              msg.sender === 'user'
                ? 'bg-blue-600 text-white rounded-tr-none'
                : 'bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none'
            }`}>
              {renderFormattedMessage(msg.text, msg.sender === 'user')}

              {msg.graphNodes && msg.graphNodes.length > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-1">
                  <span className="text-[9.5px] font-bold text-slate-400 dark:text-slate-400 flex items-center gap-1">
                    <Network className="w-2.5 h-2.5 text-cyan-500" />
                    <span>Sơ đồ tri thức liên quan:</span>
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {msg.graphNodes.map(gn => (
                      <a
                        key={gn.id}
                        href={`/?lesson=${gn.courseId || 'bai-1'}`}
                        className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300 text-[10px] font-bold border border-cyan-200/60 dark:border-cyan-800/40 transition-colors"
                        title={`Xem bài học: ${gn.label}`}
                      >
                        <span>🎯 {gn.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <span className={`block text-[9px] mt-1 text-right ${
                msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'
              }`}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-2 text-xs text-slate-400 dark:text-slate-500 pl-8">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-100"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-200"></span>
            <span className="text-[10px] italic">Running Rin đang soạn kịch bản...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Field */}
      <div className="p-2.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder="Hỏi kịch bản xử lý từ chối, chốt cọc..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white disabled:opacity-40 shadow-[0_2px_8px_rgba(37,99,235,0.3)] border border-blue-400/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center justify-center shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );

  return typeof document !== 'undefined' ? createPortal(chatContent, document.body) : chatContent;
}
