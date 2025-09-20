import mongoose, { Document, Schema } from 'mongoose';

export interface ISupplements {
  multi: boolean;
  d3k2: boolean;
  b12: boolean;
  creatine: boolean;
  fishOil: boolean;
  other?: string[];
}

export interface IHealthLog extends Document {
  _id: string;
  date: string;
  weightKg?: number;
  bodyFatPct?: number;
  muscleMassPct?: number;
  sleepHrs?: number;
  energy1to10?: number;
  steps?: number;
  waterLiters?: number;
  workoutType?: string;
  supplements: ISupplements;
  mood?: 'Very Low' | 'Low' | 'Ok' | 'Good' | 'Great';
  notes?: string;
  photoBase64?: string;
  createdAt: Date;
  updatedAt: Date;
}

const HealthLogSchema = new Schema<IHealthLog>({
  date: { type: String, required: true, unique: true },
  weightKg: { type: Number },
  bodyFatPct: { type: Number },
  muscleMassPct: { type: Number },
  sleepHrs: { type: Number },
  energy1to10: { type: Number, min: 1, max: 10 },
  steps: { type: Number },
  waterLiters: { type: Number, min: 0, max: 10 },
  workoutType: { type: String },
  supplements: {
    multi: { type: Boolean, default: false },
    d3k2: { type: Boolean, default: false },
    b12: { type: Boolean, default: false },
    creatine: { type: Boolean, default: false },
    fishOil: { type: Boolean, default: false },
    other: [String]
  },
  mood: { 
    type: String, 
    enum: ['Very Low', 'Low', 'Ok', 'Good', 'Great'] 
  },
  notes: { type: String },
  photoBase64: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

HealthLogSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.HealthLog || mongoose.model<IHealthLog>('HealthLog', HealthLogSchema);
