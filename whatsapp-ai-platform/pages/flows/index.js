import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '@/styles/flows.module.css';

export default function FlowsPage() {
    const router = useRouter();
    const [flows, setFlows] = useState([]);

    useEffect(() => {
        loadFlows();
    }, []);

    const loadFlows = async () => {
        try {
            const res = await fetch('/api/flows');
            const data = await res.json();
            setFlows(data.flows || []);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Eliminar flujo?')) return;

        try {
            await fetch(`/api/flows/${id}`, { method: 'DELETE' });
            loadFlows();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <>
            <Head>
                <title>Flujos - WhatsApp AI Platform</title>
            </Head>

            <div className={styles.flowsPage}>
                <div className={styles.header}>
                    <h1>Flujos de Trabajo</h1>
                    <button
                        onClick={() => router.push('/flows/new')}
                        className={styles.createBtn}
                    >
                        + Crear Flujo
                    </button>
                </div>

                <div className={styles.flowsGrid}>
                    {flows.map(flow => (
                        <div key={flow._id} className={styles.flowCard}>
                            <div className={styles.flowCardHeader}>
                                <h3>{flow.name}</h3>
                                <span className={`${styles.badge} ${styles[flow.status]}`}>
                                    {flow.status}
                                </span>
                            </div>

                            <p className={styles.flowDescription}>{flow.description || 'Sin descripción'}</p>

                            <div className={styles.flowStats}>
                                <span>📊 {flow.stats?.totalExecutions || 0} ejecuciones</span>
                                <span>✅ {flow.stats?.completedExecutions || 0} completadas</span>
                            </div>

                            <div className={styles.flowActions}>
                                <button onClick={() => router.push(`/flows/${flow._id}`)}>
                                    Editar
                                </button>
                                <button onClick={() => handleDelete(flow._id)} className={styles.deleteBtn}>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}

                    {flows.length === 0 && (
                        <div className={styles.emptyState}>
                            <p>No hay flujos creados</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
