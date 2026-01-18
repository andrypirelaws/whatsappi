import { Handle, Position } from 'reactflow';
import styles from './NodeTypes.module.css';

export default function TriggerNode({ data }) {
    return (
        <div className={`${styles.node} ${styles.trigger}`}>
            <div className={styles.header}>
                <span>▶️ Inicio</span>
            </div>
            <div className={styles.content}>
                <small>Palabra: {data.keyword || '(sin definir)'}</small>
            </div>
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}
