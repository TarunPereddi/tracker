import mongoose, { Document, Schema } from 'mongoose';

export interface ISkillLog extends Document {
  _id: string;
  date: string;
  topic: string;
  resource: string;
  minutes: number;
  outcome?: string;
  confidence: 'Low' | 'Medium' | 'High';
  tags?: string[];
  createdAt: Date;
}

const SkillLogSchema = new Schema<ISkillLog>({
  date: { type: String, required: true },
  topic: { type: String, required: true },
  resource: { type: String, required: true },
  minutes: { type: Number, required: true },
  outcome: { type: String },
  confidence: { 
    type: String, 
    required: true, 
    enum: ['Low', 'Medium', 'High'] 
  },
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.SkillLog || mongoose.model<ISkillLog>('SkillLog', SkillLogSchema);
