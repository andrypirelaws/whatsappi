import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './Sidebar.module.css';

export default function Layout({ children }) {
    const router = useRouter();

    const menuItems = [
        { path: '/', icon: '📊', label: 'Dashboard' },
        { path: '/inbox', icon: '💬', label: 'Inbox' },
        { path: '/flows', icon: '🔀', label: 'Flujos' },
        { path: '/contacts', icon: '👥', label: 'Contactos' },
        { path: '/settings', icon: '⚙️', label: 'Configuración' }
    ];

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    <h2>🤖 WhatsApp AI</h2>
                </div>

                <nav className={styles.nav}>
                    {menuItems.map(item => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={router.pathname === item.path ? styles.active : ''}
                            style={{ textDecoration: 'none' }}
                        >
                            <span className={styles.icon}>{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </aside>

            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}
