import mongoose from 'mongoose';

const nodeSchema = new mongoose.Schema({
    id: String,
    type: { type: String, enum: ['trigger', 'message', 'ai_response', 'condition', 'delay', 'action'] },
    position: { x: Number, y: Number },
    data: {
        label: String,
        messageText: String,
        aiPrompt: String,
        aiModel: { type: String, default: 'gpt-4' },
        temperature: { type: Number, default: 0.7 },
        maxTokens: { type: Number, default: 150 },
        conditionType: String,
        conditionValue: String,
        delayTime: Number,
        delayUnit: String,
        keyword: String
    }
}, { _id: false });

const edgeSchema = new mongoose.Schema({
    id: String,
    source: String,
    target: String,
    sourceHandle: String,
    targetHandle: String,
    label: String
}, { _id: false });

const flowSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    status: { type: String, enum: ['draft', 'active', 'paused'], default: 'draft' },
    trigger: {
        type: { type: String, enum: ['keyword', 'welcome', 'menu_option', 'purchase'] },
        value: String
    },
    nodes: [nodeSchema],
    edges: [edgeSchema],
    stats: {
        totalExecutions: { type: Number, default: 0 },
        completedExecutions: { type: Number, default: 0 }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Flow || mongoose.model('Flow', flowSchema);
