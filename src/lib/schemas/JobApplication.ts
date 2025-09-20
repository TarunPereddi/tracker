import mongoose, { Document, Schema } from 'mongoose';

export interface IHRContact {
  name?: string;
  email?: string;
  phone?: string;
}

export interface IHistoryEvent {
  ts: Date;
  event: string;
  notes?: string;
}

export interface IJobApplication extends Document {
  _id: string;
  dateApplied: string;
  company: string;
  role: string;
  location?: string;
  salaryRange?: string;
  source: 'LinkedIn' | 'Referral' | 'Portal' | 'Company Site' | 'Other';
  hrContact?: IHRContact;
  resumeVersion?: string;
  status: 'Applied' | 'HR Screen' | 'Assignment' | 'Tech' | 'Manager' | 'Offer' | 'Rejected' | 'Ghosted';
  nextFollowUp?: string;
  notes?: string;
  history: IHistoryEvent[];
  createdAt: Date;
  updatedAt: Date;
}

const JobApplicationSchema = new Schema<IJobApplication>({
  dateApplied: { type: String, required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  location: { type: String },
  salaryRange: { type: String },
  source: { 
    type: String, 
    required: true, 
    enum: ['LinkedIn', 'Referral', 'Portal', 'Company Site', 'Other'] 
  },
  hrContact: {
    name: { type: String },
    email: { type: String },
    phone: { type: String }
  },
  resumeVersion: { type: String },
  status: { 
    type: String, 
    required: true, 
    enum: ['Applied', 'HR Screen', 'Assignment', 'Tech', 'Manager', 'Offer', 'Rejected', 'Ghosted'] 
  },
  nextFollowUp: { type: String },
  notes: { type: String },
  history: [{
    ts: { type: Date, required: true },
    event: { type: String, required: true },
    notes: { type: String }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

JobApplicationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.JobApplication || mongoose.model<IJobApplication>('JobApplication', JobApplicationSchema);
