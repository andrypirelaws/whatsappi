import { useState, useEffect, useRef } from 'react';
import styles from './ChatWindow.module.css';
import toast from 'react-hot-toast';

export default function ChatWindow({ conversation }) {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const [windowInfo, setWindowInfo] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (conversation) {
            loadMessages();
            loadWindowInfo();
            const interval = setInterval(loadMessages, 10000);
            return () => clearInterval(interval);
        }
    }, [conversation]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const loadMessages = async () => {
        try {
            const res = await fetch(`/api/conversations/${conversation._id}/messages`);
            const data = await res.json();
            setMessages(data.messages || []);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const loadWindowInfo = async () => {
        try {
            const res = await fetch(`/api/conversations/${conversation._id}/window-info`);
            const data = await res.json();
            setWindowInfo(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSend = async () => {
        if (!inputText.trim()) return;

        if (!windowInfo?.isOpen) {
            toast.error('Ventana de 24h cerrada');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`/api/conversations/${conversation._id}/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: inputText })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Error enviando');
            }

            setInputText('');
            await loadMessages();
            toast.success('Mensaje enviado');
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.chatWindow}>
            <div className={styles.header}>
                <div className={styles.headerInfo}>
                    <h3>{conversation.customerName || 'Cliente'}</h3>
                    <p>{conversation.customerPhone}</p>
                </div>

                {windowInfo && (
                    <div className={`${styles.windowBadge} ${windowInfo.isOpen ? styles.open : styles.closed}`}>
                        {windowInfo.isOpen ? `🟢 ${windowInfo.timeRemaining}` : '🔴 Cerrada'}
                    </div>
                )}
            </div>

            <div className={styles.messagesContainer}>
                {messages.map((msg, idx) => (
                    <div
                        key={msg._id || idx}
                        className={`${styles.message} ${msg.direction === 'outgoing' ? styles.outgoing : styles.incoming}`}
                    >
                        <div className={styles.bubble}>
                            {msg.isAiGenerated && <span className={styles.aiTag}>🤖</span>}
                            <p>{msg.content?.text}</p>
                            <span className={styles.timestamp}>
                                {new Date(msg.timestamp).toLocaleTimeString('es', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className={styles.inputContainer}>
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={windowInfo?.isOpen ? 'Escribe un mensaje...' : 'Ventana cerrada'}
                    disabled={loading || !windowInfo?.isOpen}
                    className={styles.input}
                />
                <button
                    onClick={handleSend}
                    disabled={loading || !inputText.trim() || !windowInfo?.isOpen}
                    className={styles.sendBtn}
                >
                    {loading ? '⏳' : '📤'}
                </button>
            </div>
        </div>
    );
}
