import { Handle, Position } from 'reactflow';
import styles from './NodeTypes.module.css';

export default function ConditionNode({ data }) {
    return (
        <div className={`${styles.node} ${styles.condition}`}>
            <Handle type="target" position={Position.Top} />
            <div className={styles.header}>
                <span>🔀 Condición</span>
            </div>
            <div className={styles.content}>
                <small>{data.conditionType}: "{data.conditionValue}"</small>
            </div>
            <Handle type="source" position={Position.Bottom} id="true" style={{ left: '30%' }} />
            <Handle type="source" position={Position.Bottom} id="false" style={{ left: '70%' }} />
        </div>
    );
}
