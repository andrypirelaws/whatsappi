import dbConnect from '@/lib/mongodb';
import Conversation from '@/models/Conversation';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'GET') {
        try {
            const { status = 'active' } = req.query;

            const conversations = await Conversation.find({ status })
                .sort({ lastMessageAt: -1 })
                .limit(50);

            return res.json({ conversations });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
