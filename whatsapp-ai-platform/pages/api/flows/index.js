import dbConnect from '@/lib/mongodb';
import Flow from '@/models/Flow';

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'GET') {
        try {
            const flows = await Flow.find().sort({ createdAt: -1 });
            return res.json({ flows });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    if (req.method === 'POST') {
        try {
            const flow = await Flow.create(req.body);
            return res.status(201).json(flow);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
