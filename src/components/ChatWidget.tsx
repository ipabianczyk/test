import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Bot, User, RefreshCw, AlertCircle, Phone, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CHAT_FLOW, CRISIS_KEYWORDS, checkCrisis } from '../data/chatFlow';

type Message = {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  isCrisis?: boolean;
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<Message[]>([]);
  const [currentNodeId, setCurrentNodeId] = useState('start');
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const currentNode = CHAT_FLOW[currentNodeId];

  useEffect(() => {
    if (isOpen && history.length === 0) {
      sendBotNode('start');
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [history, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendBotNode = async (nodeId: string) => {
    const node = CHAT_FLOW[nodeId];
    if (!node) return;

    setIsTyping(true);
    
    for (const msg of node.messages) {
      await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));
      setHistory(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        sender: 'bot',
        text: msg,
        isCrisis: node.isCrisis
      }]);
    }
    
    setIsTyping(false);
  };

  const handleChoice = (choice: any) => {
    setHistory(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'user',
      text: choice.label
    }]);

    if (choice.link) {
      setTimeout(() => {
        setIsOpen(false);
        navigate(choice.link!);
      }, 500);
      return;
    }

    setCurrentNodeId(choice.nextId);
    sendBotNode(choice.nextId);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    setHistory(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'user',
      text: userText
    }]);

    setInputValue('');

    if (checkCrisis(userText)) {
      setShowCrisisModal(true);
      setCurrentNodeId('crisis_action');
      sendBotNode('crisis_action');
    } else {
      setIsTyping(true);
      setTimeout(() => {
        setHistory(prev => [...prev, {
          id: Math.random().toString(36).substr(2, 9),
          sender: 'bot',
          text: "Rozumiem. Możesz wybrać jedną z opcji poniżej, abyśmy mogli dopasować pomoc:"
        }]);
        setIsTyping(false);
        setCurrentNodeId('start');
      }, 1000);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        id="chat-widget-trigger"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-24 md:bottom-8 right-6 z-50 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-colors ${
          isOpen ? 'bg-slate-900 text-white' : 'bg-amber-500 text-white'
        }`}
      >
        {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chat-widget-window"
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-34 md:bottom-28 right-6 z-50 w-[calc(100vw-3rem)] md:w-[400px] h-[550px] bg-[#FAF9F6] rounded-[32px] shadow-2xl shadow-slate-900/20 border-2 border-white flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 bg-white border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg">
                    M
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm tracking-tight leading-none">MOBILNY ASYSTENT</h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aktywny teraz</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  setHistory([]);
                  setCurrentNodeId('start');
                  sendBotNode('start');
                }}
                className="p-2 text-slate-300 hover:text-amber-600 transition-colors"
                title="Odśwież chat"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-4">
              {history.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 shadow-sm ${
                      msg.sender === 'user' ? 'bg-amber-100 text-amber-600' : 
                      msg.isCrisis ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </div>
                    <div className={`px-4 py-3 rounded-2xl text-sm font-medium leading-normal shadow-sm ${
                      msg.sender === 'user' 
                        ? 'bg-white border border-slate-100 text-slate-700' 
                        : msg.isCrisis
                          ? 'bg-rose-600 text-white font-bold'
                          : 'bg-white border border-slate-100 text-slate-600'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="ml-9 flex gap-1 p-3 bg-white border border-slate-100 rounded-xl">
                    <span className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce" />
                  </div>
                </div>
              )}

              {/* Choices */}
              {!isTyping && history.length > 0 && history[history.length - 1].sender === 'bot' && (
                <div className="mt-2 flex flex-wrap gap-2 ml-9">
                  {currentNode.choices.map((choice, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleChoice(choice)}
                      className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-700 hover:border-amber-400 hover:bg-amber-50 transition-all active:scale-95 shadow-sm"
                    >
                      {choice.label}
                    </button>
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
              <form 
                onSubmit={handleSendMessage}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Napisz coś..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-grow px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500/20"
                />
                <button 
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="w-11 h-11 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-amber-600 disabled:opacity-30 transition-all active:scale-90"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Crisis Warning Modal */}
      <AnimatePresence>
        {showCrisisModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              id="crisis-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[40px] p-8 max-w-md w-full shadow-2xl border-4 border-rose-500 text-center"
            >
              <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-4 leading-tight">NIE JESTEŚ SAM. JESTEŚMY TU DLA CIEBIE.</h2>
              <p className="text-slate-600 mb-8 font-medium leading-relaxed">
                Twoje słowa wskazują na bardzo trudny moment. Pamiętaj, że pomoc jest dostępna teraz, anonimowo i bezpłatnie. Proszę, zadzwoń pod jeden z tych numerów:
              </p>
              
              <div className="space-y-4 mb-8">
                <a 
                  href="tel:116123" 
                  className="flex items-center justify-between p-5 bg-rose-600 text-white rounded-[24px] hover:bg-rose-700 transition-colors shadow-lg shadow-rose-600/20"
                >
                  <div className="flex items-center gap-3">
                    <Phone className="w-6 h-6" />
                    <div className="text-left">
                      <div className="text-xs font-bold uppercase tracking-wider opacity-80">Kryzysowy Telefon</div>
                      <div className="text-xl font-black">116 123</div>
                    </div>
                  </div>
                </a>
                <a 
                  href="tel:116111" 
                  className="flex items-center justify-between p-5 bg-slate-900 text-white rounded-[24px] hover:bg-slate-800 transition-colors shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <Heart className="w-6 h-6" />
                    <div className="text-left">
                      <div className="text-xs font-bold uppercase tracking-wider opacity-80">Dla Dzieci i Młodzieży</div>
                      <div className="text-xl font-black">116 111</div>
                    </div>
                  </div>
                </a>
              </div>

              <button
                onClick={() => setShowCrisisModal(false)}
                className="w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors"
              >
                Rozumiem, wróć do chatu
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
