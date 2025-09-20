import mongoose, { Document, Schema } from 'mongoose';

export interface ISkillLog extends Document {
  _id: string;
  date: string;
  skill: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'mobile' | 'ai-ml' | 'data-science' | 'cybersecurity' | 'system-design' | 'algorithms' | 'tools' | 'soft-skills' | 'other';
  timeSpent: number; // in minutes
  resource: string; // course, book, tutorial, practice, etc.
  description?: string;
  outcome?: string; // what was learned/achieved
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating?: number; // 1-5 rating of the resource/session
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SkillLogSchema = new Schema<ISkillLog>({
  date: { type: String, required: true },
  skill: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['frontend', 'backend', 'database', 'devops', 'mobile', 'ai-ml', 'data-science', 'cybersecurity', 'system-design', 'algorithms', 'tools', 'soft-skills', 'other']
  },
  timeSpent: { type: Number, required: true, min: 1 },
  resource: { type: String, required: true },
  description: { type: String },
  outcome: { type: String },
  tags: [{ type: String }],
  difficulty: { 
    type: String, 
    required: true,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  rating: { type: Number, min: 1, max: 5 },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

SkillLogSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.SkillLog || mongoose.model<ISkillLog>('SkillLog', SkillLogSchema);