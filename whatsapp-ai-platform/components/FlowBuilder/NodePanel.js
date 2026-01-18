import styles from './NodePanel.module.css';

const nodes = [
    { type: 'message', icon: '💬', label: 'Mensaje' },
    { type: 'ai_response', icon: '🤖', label: 'AI' },
    { type: 'condition', icon: '🔀', label: 'Condición' },
    { type: 'delay', icon: '⏱️', label: 'Espera' }
];

export default function NodePanel({ onAddNode }) {
    return (
        <div className={styles.panel}>
            <h3>Nodos</h3>
            {nodes.map(node => (
                <div
                    key={node.type}
                    className={styles.nodeItem}
                    onClick={() => onAddNode(node.type)}
                >
                    <span className={styles.icon}>{node.icon}</span>
                    <span>{node.label}</span>
                </div>
            ))}
        </div>
    );
}
