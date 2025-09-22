import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  username: string;
  password: string; // Store as plain string for simplicity
  isAdmin: boolean;
  onboardingStatus: 'incomplete' | 'daytypes' | 'health' | 'finance' | 'completed';
  createdAt: Date;
  lastLoginAt?: Date;
}

const UserSchema = new Schema<IUser>({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    minlength: 3,
    maxlength: 20,
    trim: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  isAdmin: { 
    type: Boolean, 
    default: false 
  },
  onboardingStatus: {
    type: String,
    enum: ['incomplete', 'daytypes', 'health', 'finance', 'guide', 'completed'],
    default: 'incomplete'
  },
  createdAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date }
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
