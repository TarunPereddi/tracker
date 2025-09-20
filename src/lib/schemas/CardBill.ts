import mongoose, { Document, Schema } from 'mongoose';

export interface ICardBill extends Document {
  _id: string;
  cardName: string;
  month: string;
  statementFrom: string;
  statementTo: string;
  amount: number;
  paid: boolean;
  paidOn?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CardBillSchema = new Schema<ICardBill>({
  cardName: { type: String, required: true },
  month: { type: String, required: true },
  statementFrom: { type: String, required: true },
  statementTo: { type: String, required: true },
  amount: { type: Number, required: true },
  paid: { type: Boolean, default: false },
  paidOn: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

CardBillSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.CardBill || mongoose.model<ICardBill>('CardBill', CardBillSchema);
