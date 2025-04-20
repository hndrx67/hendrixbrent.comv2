import mongoose from 'mongoose';
import Visit from './models/Visit';

// MongoDB connection string should be in your Vercel environment variables
const MONGODB_URI = process.env.MONGODB_URI;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        if (!mongoose.connections[0].readyState) {
            await mongoose.connect(MONGODB_URI);
        }

        const visit = new Visit();
        await visit.save();

        res.status(200).json({ message: 'Visit logged successfully' });
    } catch (error) {
        console.error('Error logging visit:', error);
        res.status(500).json({ message: 'Error logging visit' });
    }
}