import mongoose, { Document, Schema } from 'mongoose';

export interface IMonthlySkillSummary extends Document {
  _id: string;
  month: string;
  minutesByTag: { [key: string]: number };
  projectsBuilt: number;
  weakAreas: string[];
  createdAt: Date;
}

const MonthlySkillSummarySchema = new Schema<IMonthlySkillSummary>({
  month: { type: String, required: true, unique: true },
  minutesByTag: { type: Schema.Types.Mixed, default: {} },
  projectsBuilt: { type: Number, default: 0 },
  weakAreas: [String],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.MonthlySkillSummary || mongoose.model<IMonthlySkillSummary>('MonthlySkillSummary', MonthlySkillSummarySchema);
