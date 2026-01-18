import dbConnect from '@/lib/mongodb';
import Flow from '@/models/Flow';

export default async function handler(req, res) {
    await dbConnect();

    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            const flow = await Flow.findById(id);
            if (!flow) return res.status(404).json({ error: 'No encontrado' });
            return res.json(flow);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    if (req.method === 'PUT') {
        try {
            const flow = await Flow.findByIdAndUpdate(id, req.body, { new: true });
            return res.json(flow);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    if (req.method === 'PATCH') {
        try {
            const flow = await Flow.findByIdAndUpdate(
                id,
                { $set: req.body },
                { new: true }
            );
            return res.json(flow);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    if (req.method === 'DELETE') {
        try {
            await Flow.findByIdAndDelete(id);
            return res.json({ success: true });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
