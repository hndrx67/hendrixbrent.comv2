import mongoose from 'mongoose';

const TierSchema = new mongoose.Schema({
  rank: String,
  name: String,
  notes: String,
  corrections: { type: Number, default: 0 },
  trend: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.TierEntry || mongoose.model('TierEntry', TierSchema);
