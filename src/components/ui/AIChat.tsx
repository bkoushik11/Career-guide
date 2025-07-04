import React, { useState, useEffect, useRef } from 'react';
import { FaCommentDots, FaTimes } from 'react-icons/fa'; // For chat icon

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Load OpenAI API key from .env
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Declare global window.chatbase for Chatbase integration
declare global {
  interface Window {
    chatbase?: any;
    q?: any[];
  }
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Control chat window visibility
  const messagesEndRef = useRef<HTMLDivElement>(null); // For auto-scrolling

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize Chatbase script
  useEffect(() => {
    if (!window.chatbase || window.chatbase('getState') !== 'initialized') {
      window.chatbase = (...args: any[]) => {
        if (!window.chatbase.q) window.chatbase.q = [];
        window.chatbase.q.push(args);
      };
      window.chatbase = new Proxy(window.chatbase, {
        get(target, prop) {
          if (prop === 'q') return target.q;
          return (...args: any[]) => target(prop, ...args);
        },
      });
    }

    const onLoad = () => {
      const script = document.createElement('script');
      script.src = 'https://www.chatbase.co/embed.min.js';
      script.id = 'KIXVGMBQlmkw021AfZNWe';
      script.domain = 'www.chatbase.co';
      document.body.appendChild(script);
    };

    if (document.readyState === 'complete') {
      onLoad();
    } else {
      window.addEventListener('load', onLoad);
    }

    return () => {
      const script = document.getElementById('KIXVGMBQlmkw021AfZNWe');
      if (script) document.body.removeChild(script);
      window.removeEventListener('load', onLoad);
    };
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages: Message[] = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          max_tokens: 150, // Optimize token usage
        }),
      });

      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      const aiMessage = data.choices?.[0]?.message?.content || 'Sorry, I could not understand.';
      setMessages([...newMessages, { role: 'assistant', content: aiMessage }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: 'Error contacting AI. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(prev => !prev); // Toggle open/close state
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Toggle Button */}
      <button
        onClick={toggleChat}
        className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? <FaTimes size={24} /> : <FaCommentDots size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col max-h-[80vh] mt-2">
          {/* Header */}
          <div className="p-4 bg-blue-600 text-white rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">CareerForge AI Assistant</h3>
            <button
              onClick={toggleChat}
              className="text-white hover:text-gray-200 focus:outline-none"
              aria-label="Close chat"
            >
              <FaTimes size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.length === 0 && (
              <div className="text-gray-500 text-center">
                Ask me anything about your job search!
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <span
                  className={`inline-block max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'user' ? 'bg-blue-100 text-gray-800' : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {msg.content}
                </span>
              </div>
            ))}
            {loading && <div className="text-gray-500 text-center">AI is typing...</div>}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
                aria-label="Chat input"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChat;