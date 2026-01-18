import { useState, useEffect } from 'react';
import styles from './PropertiesPanel.module.css';

export default function PropertiesPanel({ node, onUpdate, onClose }) {
    const [data, setData] = useState(node.data);

    useEffect(() => {
        setData(node.data);
    }, [node]);

    const handleChange = (field, value) => {
        const newData = { ...data, [field]: value };
        setData(newData);
        onUpdate(node.id, newData);
    };

    return (
        <div className={styles.panel}>
            <div className={styles.header}>
                <h3>Propiedades</h3>
                <button onClick={onClose} className={styles.closeBtn}>✕</button>
            </div>

            <div className={styles.content}>
                {node.type === 'trigger' && (
                    <label>
                        Palabra clave:
                        <input
                            type="text"
                            value={data.keyword || ''}
                            onChange={(e) => handleChange('keyword', e.target.value)}
                        />
                    </label>
                )}

                {node.type === 'message' && (
                    <label>
                        Mensaje:
                        <textarea
                            value={data.messageText || ''}
                            onChange={(e) => handleChange('messageText', e.target.value)}
                            rows={5}
                        />
                    </label>
                )}

                {node.type === 'ai_response' && (
                    <>
                        <label>
                            Prompt:
                            <textarea
                                value={data.aiPrompt || ''}
                                onChange={(e) => handleChange('aiPrompt', e.target.value)}
                                rows={4}
                            />
                        </label>

                        <label>
                            Modelo:
                            <select
                                value={data.aiModel || 'gpt-4'}
                                onChange={(e) => handleChange('aiModel', e.target.value)}
                            >
                                <option value="gpt-4">GPT-4</option>
                                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                            </select>
                        </label>

                        <label>
                            Temperatura: {data.temperature || 0.7}
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={data.temperature || 0.7}
                                onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
                            />
                        </label>
                    </>
                )}

                {node.type === 'condition' && (
                    <>
                        <label>
                            Tipo:
                            <select
                                value={data.conditionType || 'contains'}
                                onChange={(e) => handleChange('conditionType', e.target.value)}
                            >
                                <option value="contains">Contiene</option>
                                <option value="equals">Igual a</option>
                                <option value="regex">Regex</option>
                            </select>
                        </label>

                        <label>
                            Valor:
                            <input
                                type="text"
                                value={data.conditionValue || ''}
                                onChange={(e) => handleChange('conditionValue', e.target.value)}
                            />
                        </label>
                    </>
                )}
            </div>
        </div>
    );
}
