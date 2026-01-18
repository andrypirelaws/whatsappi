import { Handle, Position } from 'reactflow';
import styles from './NodeTypes.module.css';

export default function AINode({ data }) {
    return (
        <div className={`${styles.node} ${styles.ai}`}>
            <Handle type="target" position={Position.Top} />
            <div className={styles.header}>
                <span>🤖 AI</span>
            </div>
            <div className={styles.content}>
                <small>{data.aiModel || 'gpt-4'}</small>
                <small>T: {data.temperature || 0.7}</small>
            </div>
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}
