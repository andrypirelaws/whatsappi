import '@/styles/globals.css';
import 'reactflow/dist/style.css';
import { Toaster } from 'react-hot-toast';
import Layout from '@/components/Layout/Sidebar';

export default function App({ Component, pageProps }) {
    return (
        <Layout>
            <Component {...pageProps} />
            <Toaster position="top-right" />
        </Layout>
    );
}
