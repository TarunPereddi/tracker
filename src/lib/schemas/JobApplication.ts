import mongoose, { Document, Schema } from 'mongoose';

export interface IInterviewLog {
  _id: string;
  date: string;
  type: 'phone' | 'video' | 'in-person' | 'technical' | 'hr' | 'final';
  interviewer?: string;
  notes?: string;
  outcome?: 'pending' | 'passed' | 'failed' | 'rescheduled';
  nextSteps?: string;
  createdAt: Date;
}

export interface IJobApplication extends Document {
  _id: string;
  company: string;
  position: string;
  jobUrl?: string;
  appliedDate: string;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected' | 'withdrawn';
  source: 'linkedin' | 'indeed' | 'company_website' | 'referral' | 'other';
  salaryRange?: string;
  location?: string;
  jobDescription?: string;
  notes?: string;
  followUpDate?: string;
  interviews: IInterviewLog[];
  createdAt: Date;
  updatedAt: Date;
}

const InterviewLogSchema = new Schema<IInterviewLog>({
  date: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['phone', 'video', 'in-person', 'technical', 'hr', 'final']
  },
  interviewer: { type: String },
  notes: { type: String },
  outcome: { 
    type: String,
    enum: ['pending', 'passed', 'failed', 'rescheduled']
  },
  nextSteps: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const JobApplicationSchema = new Schema<IJobApplication>({
  company: { type: String, required: true },
  position: { type: String, required: true },
  jobUrl: { type: String },
  appliedDate: { type: String, required: true },
  status: { 
    type: String, 
    required: true,
    enum: ['applied', 'screening', 'interview', 'offer', 'rejected', 'withdrawn']
  },
  source: { 
    type: String, 
    required: true,
    enum: ['linkedin', 'indeed', 'company_website', 'referral', 'other']
  },
  salaryRange: { type: String },
  location: { type: String },
  jobDescription: { type: String },
  notes: { type: String },
  followUpDate: { type: String },
  interviews: [InterviewLogSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

JobApplicationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.JobApplication || mongoose.model<IJobApplication>('JobApplication', JobApplicationSchema);