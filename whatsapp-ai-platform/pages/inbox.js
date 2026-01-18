import { useState, useEffect } from 'react';
import Head from 'next/head';
import ConversationList from '@/components/Inbox/ConversationList';
import ChatWindow from '@/components/Inbox/ChatWindow';
import styles from '@/styles/inbox.module.css';

export default function Inbox() {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [filter, setFilter] = useState('active');

    useEffect(() => {
        loadConversations();
        const interval = setInterval(loadConversations, 10000);
        return () => clearInterval(interval);
    }, [filter]);

    const loadConversations = async () => {
        try {
            const res = await fetch(`/api/conversations?status=${filter}`);
            const data = await res.json();
            setConversations(data.conversations || []);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <>
            <Head>
                <title>Inbox - WhatsApp AI Platform</title>
            </Head>

            <div className={styles.inbox}>
                <div className={styles.sidebar}>
                    <div className={styles.filterTabs}>
                        <button
                            className={filter === 'active' ? styles.active : ''}
                            onClick={() => setFilter('active')}
                        >
                            Activas
                        </button>
                        <button
                            className={filter === 'pending' ? styles.active : ''}
                            onClick={() => setFilter('pending')}
                        >
                            Pendientes
                        </button>
                    </div>

                    <ConversationList
                        conversations={conversations}
                        selectedId={selectedConversation?._id}
                        onSelect={setSelectedConversation}
                    />
                </div>

                <div className={styles.chatArea}>
                    {selectedConversation ? (
                        <ChatWindow conversation={selectedConversation} />
                    ) : (
                        <div className={styles.emptyState}>
                            <p>Selecciona una conversación</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
