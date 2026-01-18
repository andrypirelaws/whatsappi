import { Handle, Position } from 'reactflow';
import styles from './NodeTypes.module.css';

export default function MessageNode({ data }) {
    return (
        <div className={`${styles.node} ${styles.message}`}>
            <Handle type="target" position={Position.Top} />
            <div className={styles.header}>
                <span>💬 Mensaje</span>
            </div>
            <div className={styles.content}>
                <p>{data.messageText?.substring(0, 40) || 'Sin mensaje'}...</p>
            </div>
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}
