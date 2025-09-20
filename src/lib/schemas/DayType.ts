import mongoose, { Document, Schema } from 'mongoose';

export interface IRoutineItem {
  key: string;
  label: string;
  defaultChecked: boolean;
}

export interface IDayType extends Document {
  _id: string;
  name: string;
  intendedWake: string;
  intendedSleep: string;
  intendedSteps: number;
  routineChecklist: IRoutineItem[];
  createdAt: Date;
}

const DayTypeSchema = new Schema<IDayType>({
  name: { type: String, required: true },
  intendedWake: { type: String, required: true },
  intendedSleep: { type: String, required: true },
  intendedSteps: { type: Number, required: true },
  routineChecklist: [{
    key: { type: String, required: true },
    label: { type: String, required: true },
    defaultChecked: { type: Boolean, default: false }
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.DayType || mongoose.model<IDayType>('DayType', DayTypeSchema);
