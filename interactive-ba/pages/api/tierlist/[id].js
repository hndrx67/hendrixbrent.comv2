import { connectDB } from '../../../lib/db';
import TierEntry from '../../../models/TierEntry';
import { verifyAuth } from '../../../lib/auth';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).end();

  if (req.method === 'PUT') {
    const user = verifyAuth(req);
    if (!user) return res.status(401).end();
    // admin or owner
    const entry = await TierEntry.findById(id);
    if (!entry) return res.status(404).end();
    if (user.role !== 'admin' && entry.createdBy?.toString() !== user.sub) return res.status(403).end();
    Object.assign(entry, req.body, { updatedAt: Date.now() });
    await entry.save();
    return res.json(entry);
  }

  if (req.method === 'DELETE') {
    const user = verifyAuth(req);
    if (!user) return res.status(401).end();
    const entry = await TierEntry.findById(id);
    if (!entry) return res.status(404).end();
    if (user.role !== 'admin' && entry.createdBy?.toString() !== user.sub) return res.status(403).end();
    await entry.remove();
    return res.json({ ok: true });
  }

  if (req.method === 'GET') {
    const entry = await TierEntry.findById(id);
    if (!entry) return res.status(404).end();
    return res.json(entry);
  }

  res.status(405).end();
}
