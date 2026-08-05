import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Bot, Send, X, Sparkles, Key, CheckCircle2 } from 'lucide-react';
import { useSalon } from '../context/SalonContext';

export const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Welcome to StyleSync AI Support! ✂️ How can I assist you today? Ask me about our salon services, prices, home visit care for senior citizens, or payment methods!',
      time: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const { services } = useSalon();
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Intelligent Rules Engine for Salon Queries
  const generateBotResponse = async (query) => {
    const q = query.toLowerCase();

    // Check if API key is present for live API call
    if (apiKey.trim()) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `You are StyleSync AI Salon Assistant. Answer concisely: ${query}` }] }]
          })
        });
        const data = await response.json();
        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
          return data.candidates[0].content.parts[0].text;
        }
      } catch (err) {
        console.warn('API Call failed, falling back to smart rules:', err);
      }
    }

    // Smart Knowledge Base Fallback
    if (q.includes('elderly') || q.includes('home service') || q.includes('home')) {
      return '🏡 **StyleSync Home Service Special**: We offer dedicated salon visits for elderly citizens and clients unable to visit directly! You can request a specialist to visit your home with full sanitation & care. Go to "Home Booking" in the menu to submit your home address.';
    }

    if (q.includes('price') || q.includes('cost') || q.includes('service') || q.includes('haircut') || q.includes('facial')) {
      const list = services.map(s => `• ${s.title}: ₹${s.price} (${s.duration})`).join('\n');
      return `✂️ **StyleSync Service Menu & Pricing**:\n${list}\n\nYou can select and book any of these directly from our Services tab!`;
    }

    if (q.includes('pay') || q.includes('razorpay') || q.includes('upi') || q.includes('card') || q.includes('cash')) {
      return '💳 **Payment Methods**: We support secure online digital payments powered by Razorpay (UPI, Credit/Debit Cards, NetBanking) as well as Cash on Service completion!';
    }

    if (q.includes('hour') || q.includes('time') || q.includes('open') || q.includes('address') || q.includes('location')) {
      return '⏰ **Salon Operating Hours**: Open Daily 09:00 AM – 09:00 PM.\n📍 **Location**: High-Fashion Promenade, Indiranagar, Bengaluru.';
    }

    if (q.includes('hi') || q.includes('hello') || q.includes('hey')) {
      return 'Hello there! How can StyleSync assist your salon grooming or home visit needs today?';
    }

    return 'Thank you for reaching out! You can easily book an In-Shop appointment or Home Service visit directly through our portal. For any custom requests, feel free to submit a booking form!';
  };

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = {
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    const botText = await generateBotResponse(query);
    setIsTyping(false);

    setMessages(prev => [...prev, {
      sender: 'bot',
      text: botText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  return (
    <>
      {/* Floating Chatbot Trigger Icon (Matching Bottom-Right Icon in Screenshots 2 & 3) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 999,
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--accent-red)',
          color: '#ffffff',
          border: '2px solid rgba(255, 255, 255, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 0 25px rgba(255, 0, 60, 0.7)',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
        title="StyleSync AI Customer Support Chatbot"
      >
        <MessageSquare size={24} fill="#ffffff" color="#ffffff" />
      </button>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="neon-panel" style={{
          position: 'fixed',
          bottom: '90px',
          right: '24px',
          width: '380px',
          height: '520px',
          zIndex: 999,
          background: '#0d0d14',
          borderColor: 'var(--accent-red)',
          boxShadow: '0 0 35px rgba(255, 0, 60, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          
          {/* Header */}
          <div style={{ background: 'rgba(255, 0, 60, 0.15)', padding: '1rem', borderBottom: '1px solid rgba(255, 0, 60, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ background: 'var(--accent-red)', color: '#fff', padding: '0.4rem', borderRadius: '50%' }}>
                <Bot size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>StyleSync AI Chatbot</div>
                <div style={{ fontSize: '0.72rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Sparkles size={12} /> Instant Salon Assistance
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button 
                onClick={() => setShowKeyInput(!showKeyInput)}
                title="Configure Gemini Backend API Key"
                style={{ background: 'transparent', border: 'none', color: apiKey ? '#34d399' : 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}
              >
                <Key size={16} />
              </button>
              <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Optional API Key Input */}
          {showKeyInput && (
            <div style={{ padding: '0.75rem', background: 'rgba(255, 0, 60, 0.08)', borderBottom: '1px solid var(--border-glass)', fontSize: '0.78rem' }}>
              <div style={{ fontWeight: 600, color: 'var(--accent-red)', marginBottom: '0.3rem' }}>Backend API Connection</div>
              <input 
                type="password"
                className="form-input"
                placeholder="Enter Gemini API Key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                style={{ padding: '0.4rem 0.6rem', fontSize: '0.78rem', marginBottom: '0.3rem' }}
              />
              <span style={{ color: 'var(--text-muted)' }}>Backend AI model endpoint handler ready.</span>
            </div>
          )}

          {/* Quick Query Suggestion Chips */}
          <div style={{ padding: '0.6rem 0.8rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '0.4rem', overflowX: 'auto' }}>
            <button onClick={() => handleSend('Tell me about Home Service for elderly')} className="btn-secondary" style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem', whiteSpace: 'nowrap' }}>
              🏡 Elderly Care
            </button>
            <button onClick={() => handleSend('What services and prices do you offer?')} className="btn-secondary" style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem', whiteSpace: 'nowrap' }}>
              ✂️ Pricing List
            </button>
            <button onClick={() => handleSend('What payment options are supported?')} className="btn-secondary" style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem', whiteSpace: 'nowrap' }}>
              💳 Payments
            </button>
          </div>

          {/* Chat Conversation Scroll Area */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {messages.map((m, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '82%',
                  padding: '0.75rem 0.95rem',
                  borderRadius: m.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                  background: m.sender === 'user' ? 'var(--accent-red)' : 'rgba(255,255,255,0.08)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  lineHeight: '1.4',
                  whiteSpace: 'pre-line'
                }}>
                  {m.text}
                  <div style={{ fontSize: '0.65rem', marginTop: '0.3rem', opacity: 0.7, textAlign: 'right' }}>
                    {m.time}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                <Bot size={14} /> StyleSync AI is typing...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Footer */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            style={{ padding: '0.75rem', background: 'rgba(10,10,15,0.9)', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '0.5rem' }}
          >
            <input 
              type="text"
              className="form-input"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ padding: '0.6rem 0.8rem', fontSize: '0.85rem' }}
            />
            <button type="submit" className="btn-red-neon" style={{ padding: '0.6rem 0.9rem' }}>
              <Send size={16} />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
