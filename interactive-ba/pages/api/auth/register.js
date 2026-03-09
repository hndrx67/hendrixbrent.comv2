import { connectDB } from '../../../lib/db';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Missing' });
  await connectDB();
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ error: 'Already exists' });
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash: hash });
  res.status(201).json({ id: user._id, email: user.email });
}
