import { connectDB } from '../../../lib/db';
import TierEntry from '../../../models/TierEntry';
import { verifyAuth } from '../../../lib/auth';

export default async function handler(req, res) {
  await connectDB();
  if (req.method === 'GET') {
    const items = await TierEntry.find().sort({ updatedAt: -1 }).limit(200);
    return res.json(items);
  }
  if (req.method === 'POST') {
    const user = verifyAuth(req);
    if (!user) return res.status(401).end();
    if (user.role !== 'admin') return res.status(403).end();
    const payload = req.body || {};
    const created = await TierEntry.create({ ...payload, createdBy: user.sub });
    return res.status(201).json(created);
  }
  res.status(405).end();
}
