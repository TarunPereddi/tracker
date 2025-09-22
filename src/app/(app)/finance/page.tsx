'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Modal } from '@/components/ui/modal';
import { LoadingCard, Skeleton } from '@/components/ui/loading';
import { useToast } from '@/hooks/use-toast';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  PiggyBank,
  Plus,
  Settings,
  Receipt,
  X,
  Save
} from 'lucide-react';
import Link from 'next/link';

interface Transaction {
  _id: string;
  date: string;
  type: 'debit' | 'credit';
  account: string;
  category: string;
  amount: number;
  desc?: string;
  tags?: string[];
  cardName?: string;
  createdAt: string;
}

interface TransactionForm {
  date: string;
  type: 'debit' | 'credit';
  account: string;
  category: string;
  amount: number;
  desc: string;
  tags: string;
}

export default function FinancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayTransactions, setTodayTransactions] = useState<Transaction[]>([]);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionType, setTransactionType] = useState<'debit' | 'credit'>('debit');
  const [saving, setSaving] = useState(false);
  const { error: showError, success: showSuccess } = useToast();

  const [transactionForm, setTransactionForm] = useState<TransactionForm>({
    date: new Date().toISOString().split('T')[0],
    type: 'debit',
    account: '',
    category: '',
    amount: 0,
    desc: '',
    tags: ''
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`/api/finance/transactions?startDate=${today}&endDate=${today}`);
      const data = await response.json();
      if (data.ok) {
        setTodayTransactions(data.transactions);
        setTransactions(data.transactions);
      } else {
        showError('Failed to load transactions', data.error);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      showError('Failed to load transactions', 'Please try refreshing the page');
    } finally {
      setLoading(false);
    }
  };

  const getTodayStats = () => {
    const credits = todayTransactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
    const debits = todayTransactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);
    return { credits, debits, net: credits - debits };
  };

  const handleAddTransaction = (type: 'debit' | 'credit') => {
    setTransactionType(type);
    setTransactionForm(prev => ({
      ...prev,
      type,
      date: new Date().toISOString().split('T')[0]
    }));
    setShowTransactionModal(true);
  };

  const handleSaveTransaction = async () => {
    setSaving(true);
    try {
      const payload = {
        ...transactionForm,
        tags: transactionForm.tags ? transactionForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
      };

      const response = await fetch('/api/finance/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.ok) {
        showSuccess('Transaction added successfully!');
        setShowTransactionModal(false);
        setTransactionForm({
          date: new Date().toISOString().split('T')[0],
          type: 'debit',
          account: '',
          category: '',
          amount: 0,
          desc: '',
          tags: ''
        });
        fetchTransactions(); // Refresh the transactions
      } else {
        showError('Failed to add transaction', data.error);
      }
    } catch (error) {
      console.error('Failed to add transaction:', error);
      showError('Failed to add transaction', 'Please try again');
    } finally {
      setSaving(false);
    }
  };

  const stats = getTodayStats();

  if (loading) {
    return (
      <div className="p-4 lg:p-6 space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-6 w-6 text-green-500" />
            <h1 className="text-2xl lg:text-3xl font-semibold text-foreground">Finance Tracker</h1>
          </div>
          <p className="text-muted-foreground">Track your daily expenses and income</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Link href="/finance/setup">
            <Button variant="outline" className="w-full sm:w-auto">
              <Settings className="mr-2 h-4 w-4" />
              Setup
            </Button>
          </Link>
          <Button onClick={() => handleAddTransaction('debit')} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold text-green-500">₹{stats.credits.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Today's Income</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-red-500" />
              <div>
                <div className="text-2xl font-bold text-red-500">₹{stats.debits.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Today's Expenses</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <PiggyBank className="h-5 w-5 text-blue-500" />
              <div>
                <div className={`text-2xl font-bold ${stats.net >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ₹{stats.net.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Net Today</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Receipt className="h-5 w-5 text-purple-500" />
              <div>
                <div className="text-2xl font-bold text-foreground">{todayTransactions.length}</div>
                <div className="text-sm text-muted-foreground">Transactions Today</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Transactions</CardTitle>
          <CardDescription>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {todayTransactions.length > 0 ? (
            <div className="space-y-3">
              {todayTransactions.map((transaction) => (
                <div key={transaction._id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${transaction.type === 'credit' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div>
                      <div className="font-medium text-foreground">{transaction.desc || transaction.category}</div>
                      <div className="text-sm text-muted-foreground">
                        {transaction.category} • {transaction.account}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${transaction.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}>
                      {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(transaction.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="p-4 bg-green-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Receipt className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No Transactions Today</h3>
              <p className="text-muted-foreground">Start tracking your expenses and income</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common financial tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col space-y-2"
              onClick={() => handleAddTransaction('credit')}
            >
              <DollarSign className="h-6 w-6" />
              <span>Add Income</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col space-y-2"
              onClick={() => handleAddTransaction('debit')}
            >
              <CreditCard className="h-6 w-6" />
              <span>Add Expense</span>
            </Button>
            <Link href="/finance/setup">
              <Button variant="outline" className="h-20 w-full flex flex-col space-y-2">
                <Settings className="h-6 w-6" />
                <span>Finance Setup</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Modal */}
      <Modal isOpen={showTransactionModal} onClose={() => setShowTransactionModal(false)}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">
              Add {transactionType === 'credit' ? 'Income' : 'Expense'}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTransactionModal(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={transactionForm.date}
                  onChange={(e) => setTransactionForm(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹) *</Label>
                <Input
                  id="amount"
                  type="number"
                  value={transactionForm.amount}
                  onChange={(e) => setTransactionForm(prev => ({ ...prev, amount: Number(e.target.value) }))}
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={transactionForm.category}
                onChange={(e) => setTransactionForm(prev => ({ ...prev, category: e.target.value }))}
                placeholder={transactionType === 'credit' ? 'e.g., Salary, Freelance' : 'e.g., Food, Transport'}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="account">Account *</Label>
              <Input
                id="account"
                value={transactionForm.account}
                onChange={(e) => setTransactionForm(prev => ({ ...prev, account: e.target.value }))}
                placeholder="e.g., HDFC Bank, Cash"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea
                id="desc"
                value={transactionForm.desc}
                onChange={(e) => setTransactionForm(prev => ({ ...prev, desc: e.target.value }))}
                placeholder="Optional description..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={transactionForm.tags}
                onChange={(e) => setTransactionForm(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="e.g., work, personal, urgent"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowTransactionModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveTransaction}
                disabled={saving}
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : 'Save Transaction'}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}