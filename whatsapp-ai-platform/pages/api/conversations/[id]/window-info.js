import dbConnect from '@/lib/mongodb';
import Conversation from '@/models/Conversation';

export default async function handler(req, res) {
    await dbConnect();

    const { id } = req.query;

    try {
        const conversation = await Conversation.findById(id);

        if (!conversation) {
            return res.status(404).json({ error: 'No encontrada' });
        }

        const now = new Date();
        const isOpen = conversation.isWindowOpen && conversation.windowExpiresAt > now;
        const timeRemaining = Math.max(0, conversation.windowExpiresAt - now);

        const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

        res.json({
            isOpen,
            timeRemaining: `${hours}h ${minutes}m`,
            expiresAt: conversation.windowExpiresAt
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
