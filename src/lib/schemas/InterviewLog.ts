import mongoose, { Document, Schema } from 'mongoose';

export interface IInterviewLog extends Document {
  _id: string;
  applicationId: string;
  date: string;
  round: 'Tech' | 'HR' | 'Manager' | 'System Design' | 'Pair';
  questions?: string[];
  selfRating1to10?: number;
  outcome?: 'Pass' | 'Fail' | 'Pending';
  actions?: string;
  createdAt: Date;
}

const InterviewLogSchema = new Schema<IInterviewLog>({
  applicationId: { type: String, required: true },
  date: { type: String, required: true },
  round: { 
    type: String, 
    required: true, 
    enum: ['Tech', 'HR', 'Manager', 'System Design', 'Pair'] 
  },
  questions: [String],
  selfRating1to10: { type: Number, min: 1, max: 10 },
  outcome: { 
    type: String, 
    enum: ['Pass', 'Fail', 'Pending'] 
  },
  actions: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.InterviewLog || mongoose.model<IInterviewLog>('InterviewLog', InterviewLogSchema);
