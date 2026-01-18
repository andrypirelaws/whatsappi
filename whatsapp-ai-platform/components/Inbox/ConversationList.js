import styles from './ConversationList.module.css';

export default function ConversationList({ conversations = [], selectedId, onSelect }) {
    const formatTime = (date) => {
        const now = new Date();
        const diff = now - new Date(date);
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);

        if (minutes < 60) return `${minutes}m`;
        if (hours < 24) return `${hours}h`;
        return `${Math.floor(hours / 24)}d`;
    };

    return (
        <div className={styles.list}>
            {conversations.map(conv => (
                <div
                    key={conv._id}
                    className={`${styles.item} ${selectedId === conv._id ? styles.selected : ''}`}
                    onClick={() => onSelect(conv)}
                >
                    <div className={styles.avatar}>
                        {conv.customerName?.charAt(0) || 'C'}
                    </div>

                    <div className={styles.info}>
                        <div className={styles.header}>
                            <span className={styles.name}>{conv.customerName || 'Cliente'}</span>
                            <span className={styles.time}>{formatTime(conv.lastMessageAt)}</span>
                        </div>

                        <div className={styles.preview}>
                            <span className={styles.phone}>{conv.customerPhone}</span>
                            {conv.aiEnabled && <span className={styles.badge}>🤖</span>}
                            {!conv.isWindowOpen && <span className={styles.badgeClosed}>🔴</span>}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
