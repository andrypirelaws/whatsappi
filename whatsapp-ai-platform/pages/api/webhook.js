import dbConnect from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';
import Customer from '@/models/Customer';
import whatsappService from '@/lib/whatsapp';
import { generateAIResponse } from '@/lib/openai';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const mode = req.query['hub.mode'];
        const token = req.query['hub.verify_token'];
        const challenge = req.query['hub.challenge'];

        if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
            console.log('✅ Webhook verificado');
            return res.status(200).send(challenge);
        }
        return res.status(403).send('Forbidden');
    }

    if (req.method === 'POST') {
        await dbConnect();

        try {
            const { entry } = req.body;

            for (const item of entry) {
                const changes = item.changes;

                for (const change of changes) {
                    if (change.value.messages) {
                        await processIncomingMessage(change.value);
                    }

                    if (change.value.statuses) {
                        await processMessageStatus(change.value.statuses);
                    }
                }
            }

            return res.status(200).json({ success: true });

        } catch (error) {
            console.error('Error webhook:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}

async function processIncomingMessage(value) {
    const message = value.messages[0];
    const customerPhone = message.from;
    const messageText = message.text?.body || '';
    const whatsappMessageId = message.id;

    console.log(`📩 Mensaje de ${customerPhone}: ${messageText}`);

    let customer = await Customer.findOne({ phone: customerPhone });
    if (!customer) {
        customer = await Customer.create({
            phone: customerPhone,
            name: value.contacts?.[0]?.profile?.name || 'Cliente'
        });
    }

    let conversation = await Conversation.findOne({
        customerPhone,
        status: { $in: ['active', 'pending'] }
    });

    if (!conversation) {
        conversation = await Conversation.create({
            customerId: customer._id,
            customerPhone,
            customerName: customer.name,
            status: 'active',
            isWindowOpen: true,
            windowExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });
    } else {
        conversation.updateWindow();
        await conversation.save();
    }

    await Message.create({
        conversationId: conversation._id,
        whatsappMessageId,
        type: 'text',
        direction: 'incoming',
        sender: {
            type: 'customer',
            name: customer.name,
            phone: customerPhone
        },
        content: { text: messageText },
        timestamp: new Date(message.timestamp * 1000)
    });

    conversation.metadata.totalMessages += 1;
    await conversation.save();

    if (conversation.aiEnabled && !conversation.assignedAgent) {
        await handleAiResponse(conversation, messageText, customerPhone);
    }
}

async function handleAiResponse(conversation, messageText, customerPhone) {
    try {
        const messages = await Message.find({ conversationId: conversation._id })
            .sort({ timestamp: -1 })
            .limit(10);

        const chatHistory = messages.reverse().map(msg => ({
            role: msg.direction === 'incoming' ? 'user' : 'assistant',
            content: msg.content.text
        }));

        const systemPrompt = {
            role: 'system',
            content: `Eres un asistente de "Rifas la Bendición de Dios". Responde en máximo 3 líneas, amable y profesional. Usa emojis ocasionalmente 🎉`
        };

        const aiMessages = [systemPrompt, ...chatHistory, { role: 'user', content: messageText }];
        const aiResponse = await generateAIResponse(aiMessages);

        await whatsappService.sendMessage(customerPhone, aiResponse.text);

        await Message.create({
            conversationId: conversation._id,
            type: 'text',
            direction: 'outgoing',
            sender: { type: 'ai', name: 'Asistente Virtual' },
            content: { text: aiResponse.text },
            isAiGenerated: true,
            status: 'sent'
        });

        console.log(`🤖 Respuesta AI a ${customerPhone}`);
    } catch (error) {
        console.error('Error AI:', error);
    }
}

async function processMessageStatus(statuses) {
    for (const status of statuses) {
        await Message.findOneAndUpdate(
            { whatsappMessageId: status.id },
            { status: status.status }
        );
    }
}
