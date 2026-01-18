import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '@/styles/Home.module.css';

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalConversations: 0,
        activeConversations: 0,
        messagesLast24h: 0,
        avgResponseTime: 0
    });

    useEffect(() => {
        loadStats();
        const interval = setInterval(loadStats, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadStats = async () => {
        try {
            const res = await fetch('/api/analytics/stats');
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    return (
        <>
            <Head>
                <title>Dashboard - WhatsApp AI Platform</title>
            </Head>

            <div className={styles.dashboard}>
                <h1>Dashboard</h1>

                <div className={styles.metricsGrid}>
                    <div className={styles.metricCard}>
                        <h3>Conversaciones Totales</h3>
                        <p className={styles.metricValue}>{stats.totalConversations}</p>
                    </div>

                    <div className={styles.metricCard}>
                        <h3>Conversaciones Activas</h3>
                        <p className={styles.metricValue}>{stats.activeConversations}</p>
                    </div>

                    <div className={styles.metricCard}>
                        <h3>Mensajes (24h)</h3>
                        <p className={styles.metricValue}>{stats.messagesLast24h}</p>
                    </div>

                    <div className={styles.metricCard}>
                        <h3>Tiempo Respuesta</h3>
                        <p className={styles.metricValue}>{stats.avgResponseTime}s</p>
                    </div>
                </div>
            </div>
        </>
    );
}
