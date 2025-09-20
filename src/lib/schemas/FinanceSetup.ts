import mongoose, { Document, Schema } from 'mongoose';

export interface ISalarySource {
  name: string;
  amountMonthly: number;
  creditDay?: number;
}

export interface IEMI {
  name: string;
  amount: number;
  dueDay: number;
  lender?: string;
}

export interface IRecurringBill {
  name: string;
  amount: number;
  dueDay: number;
}

export interface ICard {
  name: string;
  last4?: string;
  billDueDay?: number;
  creditLimit?: number;
}

export interface IInvestment {
  type: 'SIP' | 'MF' | 'Gold' | 'Stock' | 'FD' | 'PPF' | string;
  name: string;
  amountMonthly?: number;
  currentValue?: number;
}

export interface IProperty {
  name: string;
  estValue?: number;
  size?: string;
}

export interface IMoneyLent {
  to: string;
  amount: number;
  expectedReturn?: string;
}

export interface IMoneyBorrowed {
  from: string;
  amount: number;
  emi?: number;
}

export interface ITargets {
  emergencyFundTarget?: number;
  debtPriority?: string;
}

export interface IFinanceSetup extends Document {
  _id: string;
  salarySources: ISalarySource[];
  emis: IEMI[];
  recurringBills: IRecurringBill[];
  cards: ICard[];
  investments: IInvestment[];
  properties: IProperty[];
  moneyLent: IMoneyLent[];
  moneyBorrowed: IMoneyBorrowed[];
  targets?: ITargets;
  createdAt: Date;
  updatedAt: Date;
}

const FinanceSetupSchema = new Schema<IFinanceSetup>({
  salarySources: [{
    name: { type: String, required: true },
    amountMonthly: { type: Number, required: true },
    creditDay: { type: Number }
  }],
  emis: [{
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    dueDay: { type: Number, required: true },
    lender: { type: String }
  }],
  recurringBills: [{
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    dueDay: { type: Number, required: true }
  }],
  cards: [{
    name: { type: String, required: true },
    last4: { type: String },
    billDueDay: { type: Number },
    creditLimit: { type: Number }
  }],
  investments: [{
    type: { type: String, required: true },
    name: { type: String, required: true },
    amountMonthly: { type: Number },
    currentValue: { type: Number }
  }],
  properties: [{
    name: { type: String, required: true },
    estValue: { type: Number },
    size: { type: String }
  }],
  moneyLent: [{
    to: { type: String, required: true },
    amount: { type: Number, required: true },
    expectedReturn: { type: String }
  }],
  moneyBorrowed: [{
    from: { type: String, required: true },
    amount: { type: Number, required: true },
    emi: { type: Number }
  }],
  targets: {
    emergencyFundTarget: { type: Number },
    debtPriority: { type: String }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

FinanceSetupSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.FinanceSetup || mongoose.model<IFinanceSetup>('FinanceSetup', FinanceSetupSchema);
