'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingCard, Skeleton } from '@/components/ui/loading';
import { useToast } from '@/hooks/use-toast';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  PiggyBank,
  Plus,
  Settings,
  Receipt
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

export default function FinancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayTransactions, setTodayTransactions] = useState<Transaction[]>([]);
  const { error: showError } = useToast();

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
            <DollarSign className="h-6 w-6 text-green-400" />
            <h1 className="text-2xl lg:text-3xl font-semibold text-white">Finance Tracker</h1>
          </div>
          <p className="text-gray-400">Track your daily expenses and income</p>
        </div>
        <div className="flex space-x-2">
          <Link href="/finance/setup">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              <Settings className="mr-2 h-4 w-4" />
              Setup
            </Button>
          </Link>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-green-400">₹{stats.credits.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Today's Income</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-red-400" />
              <div>
                <div className="text-2xl font-bold text-red-400">₹{stats.debits.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Today's Expenses</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <PiggyBank className="h-5 w-5 text-blue-400" />
              <div>
                <div className={`text-2xl font-bold ${stats.net >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ₹{stats.net.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Net Today</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Receipt className="h-5 w-5 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-white">{todayTransactions.length}</div>
                <div className="text-sm text-gray-400">Transactions Today</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Transactions */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Today's Transactions</CardTitle>
          <CardDescription className="text-gray-400">
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
                <div key={transaction._id} className="flex items-center justify-between p-4 border border-gray-700 rounded-lg bg-gray-800">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${transaction.type === 'credit' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <div>
                      <div className="font-medium text-white">{transaction.desc || transaction.category}</div>
                      <div className="text-sm text-gray-400">
                        {transaction.category} • {transaction.account}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                      {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">
                      {new Date(transaction.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="p-4 bg-green-500/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Receipt className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No Transactions Today</h3>
              <p className="text-gray-400">Start tracking your expenses and income</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
          <CardDescription className="text-gray-400">Common financial tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col space-y-2 border-gray-600 text-gray-300 hover:bg-gray-800">
              <DollarSign className="h-6 w-6" />
              <span>Add Income</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2 border-gray-600 text-gray-300 hover:bg-gray-800">
              <CreditCard className="h-6 w-6" />
              <span>Add Expense</span>
            </Button>
            <Link href="/finance/setup">
              <Button variant="outline" className="h-20 w-full flex flex-col space-y-2 border-gray-600 text-gray-300 hover:bg-gray-800">
                <Settings className="h-6 w-6" />
                <span>Finance Setup</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}