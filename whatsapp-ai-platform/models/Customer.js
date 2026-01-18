import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
    phone: { type: String, required: true, unique: true },
    name: String,
    email: String,
    totalPurchases: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    lastPurchaseDate: Date,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Customer || mongoose.model('Customer', customerSchema);
