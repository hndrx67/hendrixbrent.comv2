import mongoose from 'mongoose';
import Visit from './models/Visit';

const MONGODB_URI = process.env.MONGODB_URI;

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        if (!mongoose.connections[0].readyState) {
            await mongoose.connect(MONGODB_URI);
        }

        // Get total visits
        const totalVisits = await Visit.countDocuments();

        // Get today's visits
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayVisits = await Visit.countDocuments({
            timestamp: { $gte: today }
        });

        // Get daily stats for last 7 days
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            date.setHours(0, 0, 0, 0);
            return date;
        });

        const dailyStats = await Promise.all(
            last7Days.map(async (date) => {
                const nextDay = new Date(date);
                nextDay.setDate(date.getDate() + 1);
                return Visit.countDocuments({
                    timestamp: {
                        $gte: date,
                        $lt: nextDay
                    }
                });
            })
        );

        res.status(200).json({
            totalVisits,
            todayVisits,
            dailyStats
        });
    } catch (error) {
        console.error('Error getting statistics:', error);
        res.status(500).json({ message: 'Error getting statistics' });
    }
}