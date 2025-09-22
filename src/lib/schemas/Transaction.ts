import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  _id: string;
  userId: string;
  date: string;
  type: 'debit' | 'credit';
  account: string;
  category: string;
  amount: number;
  desc?: string;
  tags?: string[];
  cardName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  userId: { type: String, required: true },
  date: { type: String, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['debit', 'credit'] 
  },
  account: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  desc: { type: String },
  tags: [String],
  cardName: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

TransactionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
