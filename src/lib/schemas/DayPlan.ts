import mongoose, { Document, Schema } from 'mongoose';

export interface IRoutineCheck {
  key: string;
  checked: boolean;
  ts?: Date;
}

export interface ICompliance {
  checklistPct: number;
  stepsMet: boolean;
  wakeMet: boolean;
  sleepMet: boolean;
}

export interface IDayPlan extends Document {
  _id: string;
  date: string;
  dayTypeId: string;
  overrides?: {
    intendedWake?: string;
    intendedSleep?: string;
    intendedSteps?: number;
    routineChecklist?: Array<{
      key: string;
      label: string;
      defaultChecked: boolean;
    }>;
  };
  routineChecks: IRoutineCheck[];
  compliance?: ICompliance;
  createdAt: Date;
  updatedAt: Date;
}

const DayPlanSchema = new Schema<IDayPlan>({
  date: { type: String, required: true, unique: true },
  dayTypeId: { type: String, required: true },
  overrides: {
    intendedWake: String,
    intendedSleep: String,
    intendedSteps: Number,
    routineChecklist: [{
      key: String,
      label: String,
      defaultChecked: Boolean
    }]
  },
  routineChecks: [{
    key: { type: String, required: true },
    checked: { type: Boolean, required: true },
    ts: { type: Date, default: Date.now }
  }],
  compliance: {
    checklistPct: { type: Number, default: 0 },
    stepsMet: { type: Boolean, default: false },
    wakeMet: { type: Boolean, default: false },
    sleepMet: { type: Boolean, default: false }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

DayPlanSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.DayPlan || mongoose.model<IDayPlan>('DayPlan', DayPlanSchema);
