import dbConnect from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';
import whatsappService from '@/lib/whatsapp';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    await dbConnect();

    const { id } = req.query;
    const { text } = req.body;

    try {
        const conversation = await Conversation.findById(id);

        if (!conversation) {
            return res.status(404).json({ error: 'Conversación no encontrada' });
        }

        const now = new Date();
        if (!conversation.isWindowOpen || conversation.windowExpiresAt < now) {
            return res.status(400).json({
                error: 'Ventana cerrada',
                message: 'Solo puedes enviar templates aprobados'
            });
        }

        await whatsappService.sendMessage(conversation.customerPhone, text);

        await Message.create({
            conversationId: conversation._id,
            type: 'text',
            direction: 'outgoing',
            sender: { type: 'agent', name: 'Agente', agentEmail: 'admin@rifas.com' },
            content: { text },
            status: 'sent'
        });

        if (conversation.aiEnabled) {
            conversation.aiEnabled = false;
            conversation.assignedAgent = 'admin@rifas.com';
            await conversation.save();
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error enviando:', error);
        res.status(500).json({ error: error.message });
    }
}
