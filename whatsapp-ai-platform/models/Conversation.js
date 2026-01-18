import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    customerPhone: { type: String, required: true, index: true },
    customerName: String,
    status: { type: String, enum: ['active', 'pending', 'closed'], default: 'active' },
    lastMessageAt: { type: Date, default: Date.now },
    windowExpiresAt: Date,
    isWindowOpen: { type: Boolean, default: true },
    assignedAgent: String,
    aiEnabled: { type: Boolean, default: true },
    metadata: {
        totalMessages: { type: Number, default: 0 },
        lastPurchaseId: mongoose.Schema.Types.ObjectId,
        tags: [String]
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

conversationSchema.methods.updateWindow = function () {
    this.lastMessageAt = new Date();
    this.windowExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    this.isWindowOpen = true;
    this.updatedAt = new Date();
};

conversationSchema.methods.closeWindow = function () {
    this.isWindowOpen = false;
    this.status = 'pending';
    this.updatedAt = new Date();
};

export default mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);
