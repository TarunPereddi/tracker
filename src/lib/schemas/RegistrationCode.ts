import mongoose, { Document, Schema } from 'mongoose';

export interface IRegistrationCode extends Document {
  _id: string;
  code: string;
  createdBy: string; // Admin user ID who created this code
  createdAt: Date;
  isActive: boolean;
}

const RegistrationCodeSchema = new Schema<IRegistrationCode>({
  code: { 
    type: String, 
    required: true, 
    unique: true,
    length: 8 // 8-character codes
  },
  createdBy: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
});

export default mongoose.models.RegistrationCode || mongoose.model<IRegistrationCode>('RegistrationCode', RegistrationCodeSchema);
