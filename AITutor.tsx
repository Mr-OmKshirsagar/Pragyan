import React, { useState, useRef, useEffect } from 'react';
import { getAICounseling } from '../services/gemini';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const AITutor: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('pragyan_chat_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('pragyan_theme');
    return saved === 'dark';
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('pragyan_theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('pragyan_theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('pragyan_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    const currentHistory = messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
    
    setInput('');
    setIsLoading(true);

    const aiResponse = await getAICounseling(userMessage, currentHistory);
    setMessages((prev) => [...prev, { role: 'model', text: aiResponse }]);
    setIsLoading(false);
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('pragyan_chat_history');
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '40px auto', 
      backgroundColor: 'var(--surface-color)',
      borderRadius: '16px', 
      display: 'flex', 
      flexDirection: 'column', 
      height: '700px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
      border: '1px solid var(--border-color)',
      transition: 'all 0.3s ease'
    }}>
      {/* Header */}
      <div style={{ 
        padding: '20px 24px', 
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#00b894' }}></div>
          <strong style={{ fontSize: '18px', color: 'var(--text-primary)' }}>Pragyan AI Tutor</strong>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {messages.length > 0 && (
            <button 
              onClick={clearChat}
              style={{
                background: 'none',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              Clear Chat
            </button>
          )}
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '4px'
          }}
          aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
        </div>
      </div>
      
      {/* Chat Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: 'var(--surface-color)' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '100px', color: 'var(--text-secondary)' }}>
            <p style={{ fontSize: '24px', marginBottom: '8px' }}>🎓</p>
            <p>Hello! I'm Pragyan. What would you like to learn today?</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} style={{ 
            marginBottom: '20px', 
            textAlign: msg.role === 'user' ? 'right' : 'left',
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start'
          }}>
            <span style={{ 
              display: 'inline-block', 
              padding: '12px 18px', 
              borderRadius: msg.role === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px', 
              background: msg.role === 'user' ? 'var(--accent-color)' : 'var(--ai-bubble-bg)',
              color: msg.role === 'user' ? 'white' : 'var(--ai-bubble-text)',
              maxWidth: '80%',
              lineHeight: '1.5',
              fontSize: '15px',
              boxShadow: msg.role === 'user' ? '0 4px 12px rgba(74, 144, 226, 0.2)' : 'none',
              transition: 'all 0.3s ease'
            }}>
              {msg.text}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
        {isLoading && (
          <div style={{ display: 'flex', gap: '8px', padding: '8px' }}>
             <div style={{ color: 'var(--text-secondary)', fontSize: '14px', fontStyle: 'italic' }}>Pragyan is crafting an explanation...</div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div style={{ padding: '24px', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ 
          display: 'flex', 
          background: 'var(--input-bg)', 
          borderRadius: '12px', 
          padding: '8px 12px',
          alignItems: 'center',
          transition: 'all 0.3s ease'
        }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question about your studies..."
            style={{ 
              flex: 1, 
              padding: '12px', 
              border: 'none', 
              background: 'transparent',
              outline: 'none',
              fontSize: '15px',
              color: 'var(--text-primary)'
            }}
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            style={{ 
              padding: '10px 24px', 
              background: 'var(--accent-color)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              opacity: (isLoading || !input.trim()) ? 0.6 : 1
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AITutor;