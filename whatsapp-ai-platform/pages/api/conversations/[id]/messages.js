import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';

export default async function handler(req, res) {
    await dbConnect();

    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            const messages = await Message.find({ conversationId: id })
                .sort({ timestamp: 1 })
                .limit(100);

            return res.json({ messages });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
