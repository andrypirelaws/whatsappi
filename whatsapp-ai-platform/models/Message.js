import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
    whatsappMessageId: { type: String, unique: true, sparse: true },
    type: { type: String, enum: ['text', 'image', 'template'], default: 'text' },
    direction: { type: String, enum: ['incoming', 'outgoing'], required: true },
    sender: {
        type: { type: String, enum: ['customer', 'agent', 'ai'], required: true },
        name: String,
        phone: String,
        agentEmail: String
    },
    content: {
        text: String,
        mediaUrl: String,
        templateName: String
    },
    status: { type: String, enum: ['sent', 'delivered', 'read', 'failed'], default: 'sent' },
    isAiGenerated: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Message || mongoose.model('Message', messageSchema);
