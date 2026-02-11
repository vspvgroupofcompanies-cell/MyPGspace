import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([
        { role: 'ai', text: 'Hi! I am your MyPGspace AI. How can I assist you today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setLoading(true);

        try {
            const res = await fetch('http://localhost:5000/api/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ message: userMsg })
            });

            const data = await res.json();
            setMessages(prev => [...prev, { role: 'ai', text: data.response }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I'm having trouble connecting right now." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999 }}>
            {/* Chat Window */}
            {isOpen && (
                <div style={{
                    position: 'absolute', bottom: '80px', right: '0',
                    width: '350px', maxWidth: 'calc(100vw - 40px)', height: '500px',
                    background: 'white', borderRadius: '20px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    display: 'flex', flexDirection: 'column', overflow: 'hidden',
                    border: '1px solid #e2e8f0'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '20px', background: 'var(--primary)', color: 'white',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Bot size={24} />
                            <div>
                                <h3 style={{ fontSize: '16px', margin: 0 }}>MyPGspace Assistant</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <div style={{ width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%' }}></div>
                                    <span style={{ fontSize: '11px', opacity: 0.8 }}>Online</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '20px', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                justifyContent: msg.role === 'ai' ? 'flex-start' : 'flex-end',
                                gap: '10px'
                            }}>
                                {msg.role === 'ai' && <div style={{ width: '28px', height: '28px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bot size={16} color="#64748b" /></div>}
                                <div style={{
                                    maxWidth: '80%', padding: '12px 16px', borderRadius: '15px',
                                    background: msg.role === 'ai' ? 'white' : 'var(--primary)',
                                    color: msg.role === 'ai' ? '#1e293b' : 'white',
                                    fontSize: '14px', lineHeight: '1.5',
                                    boxShadow: msg.role === 'ai' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                                    border: msg.role === 'ai' ? '1px solid #e2e8f0' : 'none',
                                    borderTopLeftRadius: msg.role === 'ai' ? '0' : '15px',
                                    borderTopRightRadius: msg.role === 'user' ? '0' : '15px',
                                }}>
                                    {msg.text}
                                </div>
                                {msg.role === 'user' && <div style={{ width: '28px', height: '28px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.2 }}><User size={16} color="white" /></div>}
                            </div>
                        ))}
                        {loading && (
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div style={{ width: '28px', height: '28px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bot size={16} color="#64748b" /></div>
                                <div style={{ padding: '12px 16px', background: 'white', borderRadius: '15px', border: '1px solid #e2e8f0', borderTopLeftRadius: 0 }}>
                                    <div className="dot-flashing"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} style={{ padding: '20px', background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            placeholder="Ask me anything..."
                            style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || loading}
                            style={{
                                padding: '10px', background: 'var(--primary)', color: 'white',
                                border: 'none', borderRadius: '10px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                opacity: !input.trim() || loading ? 0.5 : 1
                            }}
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '60px', height: '60px', borderRadius: '50%',
                    background: 'var(--primary)', color: 'white',
                    border: 'none', cursor: 'pointer',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'transform 0.2s', transform: isOpen ? 'rotate(90deg)' : 'none'
                }}
            >
                {isOpen ? <X size={30} /> : <MessageSquare size={30} />}
            </button>

            <style>{`
                .dot-flashing {
                    position: relative;
                    width: 6px;
                    height: 6px;
                    border-radius: 5px;
                    background-color: #94a3b8;
                    color: #94a3b8;
                    animation: dot-flashing 1s infinite linear alternate;
                    animation-delay: 0.5s;
                }
                .dot-flashing::before, .dot-flashing::after {
                    content: "";
                    display: inline-block;
                    position: absolute;
                    top: 0;
                }
                .dot-flashing::before {
                    left: -12px;
                    width: 6px;
                    height: 6px;
                    border-radius: 5px;
                    background-color: #94a3b8;
                    color: #94a3b8;
                    animation: dot-flashing 1s infinite alternate;
                    animation-delay: 0s;
                }
                .dot-flashing::after {
                    left: 12px;
                    width: 6px;
                    height: 6px;
                    border-radius: 5px;
                    background-color: #94a3b8;
                    color: #94a3b8;
                    animation: dot-flashing 1s infinite alternate;
                    animation-delay: 1s;
                }
                @keyframes dot-flashing {
                    0% { background-color: #94a3b8; }
                    50%, 100% { background-color: #e2e8f0; }
                }
            `}</style>
        </div>
    );
};

export default AIChatbot;
