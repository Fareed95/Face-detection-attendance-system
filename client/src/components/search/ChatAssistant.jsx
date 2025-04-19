'use client'
import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', content: 'Hi! How can I help you with your learning journey?' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { type: 'user', content: input }]);
    // Add dummy bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: 'Thanks for your message! This is a demo response.' 
      }]);
    }, 1000);
    setInput('');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 p-3 sm:p-4 rounded-full shadow-lg transition-all duration-200 backdrop-blur-sm border border-neutral-700/50"
        >
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}

      {isOpen && (
        <div className="bg-neutral-900 rounded-lg shadow-xl w-[90vw] sm:w-[380px] max-h-[80vh] flex flex-col border border-neutral-800">
          <div className="p-3 sm:p-4 bg-neutral-800 text-neutral-200 rounded-t-lg flex justify-between items-center border-b border-neutral-700/50">
            <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              AI Learning Assistant
            </h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-neutral-700 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 max-h-[50vh] sm:max-h-[400px] scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-800">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-2.5 sm:p-3 rounded-lg text-sm sm:text-base ${
                    msg.type === 'user'
                      ? 'bg-neutral-700 text-neutral-200'
                      : 'bg-neutral-800 text-neutral-300'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage} className="p-3 sm:p-4 border-t border-neutral-800 bg-neutral-900/50">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 p-2 sm:p-2.5 bg-neutral-800 text-neutral-200 border border-neutral-700 rounded-lg focus:outline-none focus:border-neutral-600 text-sm sm:text-base placeholder-neutral-500"
              />
              <button
                type="submit"
                className="bg-neutral-700 hover:bg-neutral-600 text-neutral-200 p-2 sm:p-2.5 rounded-lg transition-colors"
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 