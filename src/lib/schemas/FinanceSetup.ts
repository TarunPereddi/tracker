import mongoose, { Document, Schema } from 'mongoose';

export interface IIncomeSource {
  name: string;
  amount: number;
  creditDay: number; // Day of month when credited
}

export interface IEMI {
  name: string;
  amount: number;
  debitDay: number; // Day of month when debited
  lender?: string;
}

export interface ILivingExpense {
  name: string;
  amount: number;
  debitDay: number; // Day of month when debited
  category: 'rent' | 'utilities' | 'subscriptions' | 'other';
}

export interface IInvestment {
  name: string;
  type: 'SIP' | 'MF' | 'Gold' | 'Stock' | 'FD' | 'PPF' | 'Other';
  amount: number;
  debitDay: number; // Day of month when paid
  currentValue?: number;
}

export interface IFinanceSetup extends Document {
  _id: string;
  currentBalance: number;
  incomeSources: IIncomeSource[];
  emis: IEMI[];
  livingExpenses: ILivingExpense[];
  investments: IInvestment[];
  createdAt: Date;
  updatedAt: Date;
}

const FinanceSetupSchema = new Schema<IFinanceSetup>({
  currentBalance: { type: Number, default: 0 },
  incomeSources: [{
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    creditDay: { type: Number, required: true, min: 1, max: 31 }
  }],
  emis: [{
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    debitDay: { type: Number, required: true, min: 1, max: 31 },
    lender: { type: String }
  }],
  livingExpenses: [{
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    debitDay: { type: Number, required: true, min: 1, max: 31 },
    category: { 
      type: String, 
      required: true,
      enum: ['rent', 'utilities', 'subscriptions', 'other']
    }
  }],
  investments: [{
    name: { type: String, required: true },
    type: { 
      type: String, 
      required: true,
      enum: ['SIP', 'MF', 'Gold', 'Stock', 'FD', 'PPF', 'Other']
    },
    amount: { type: Number, required: true },
    debitDay: { type: Number, required: true, min: 1, max: 31 },
    currentValue: { type: Number }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

FinanceSetupSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.FinanceSetup || mongoose.model<IFinanceSetup>('FinanceSetup', FinanceSetupSchema);