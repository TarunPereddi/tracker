'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Trash2, 
  Save,
  ArrowLeft,
  DollarSign,
  CreditCard,
  Home,
  TrendingUp,
  Zap,
  Edit,
  RotateCcw
} from 'lucide-react';
import Link from 'next/link';

interface IncomeSource {
  name: string;
  amount: number;
  creditDay: number;
}

interface EMI {
  name: string;
  amount: number;
  debitDay: number;
  lender?: string;
}

interface LivingExpense {
  name: string;
  amount: number;
  debitDay: number;
  category: 'rent' | 'utilities' | 'subscriptions' | 'other';
}

interface Investment {
  name: string;
  type: 'SIP' | 'MF' | 'Gold' | 'Stock' | 'FD' | 'PPF' | 'Other';
  amount: number;
  debitDay: number;
  currentValue?: number;
}

interface FinanceSetup {
  _id?: string;
  currentBalance: number;
  incomeSources: IncomeSource[];
  emis: EMI[];
  livingExpenses: LivingExpense[];
  investments: Investment[];
}

export default function FinanceSetupPage() {
  const [setup, setSetup] = useState<FinanceSetup>({
    currentBalance: 0,
    incomeSources: [],
    emis: [],
    livingExpenses: [],
    investments: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSetup();
  }, []);

  const fetchSetup = async () => {
    try {
      const response = await fetch('/api/finance/setup');
      const data = await response.json();
      if (data.ok) {
        setSetup({
          currentBalance: data.setup.currentBalance || 0,
          incomeSources: data.setup.incomeSources || [],
          emis: data.setup.emis || [],
          livingExpenses: data.setup.livingExpenses || [],
          investments: data.setup.investments || []
        });
      }
    } catch (error) {
      console.error('Failed to fetch finance setup:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/finance/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(setup),
      });

      const data = await response.json();
      if (data.ok) {
        // Update onboarding status to completed
        await fetch('/api/user/onboarding', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'completed' }),
        });
        
        alert('Finance setup saved successfully!');
        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        alert(data.error || 'Failed to save finance setup');
      }
    } catch (error) {
      console.error('Failed to save finance setup:', error);
      alert('Failed to save finance setup. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addIncomeSource = () => {
    setSetup(prev => ({
      ...prev,
      incomeSources: [...prev.incomeSources, { name: '', amount: 0, creditDay: 1 }]
    }));
  };

  const addEMI = () => {
    setSetup(prev => ({
      ...prev,
      emis: [...prev.emis, { name: '', amount: 0, debitDay: 1, lender: '' }]
    }));
  };

  const addLivingExpense = () => {
    setSetup(prev => ({
      ...prev,
      livingExpenses: [...prev.livingExpenses, { name: '', amount: 0, debitDay: 1, category: 'other' }]
    }));
  };

  const addInvestment = () => {
    setSetup(prev => ({
      ...prev,
      investments: [...prev.investments, { name: '', type: 'SIP', amount: 0, debitDay: 1, currentValue: 0 }]
    }));
  };

  const resetSetup = () => {
    if (confirm('Are you sure you want to reset all finance setup? This will clear all your data.')) {
      setSetup({
        currentBalance: 0,
        incomeSources: [],
        emis: [],
        livingExpenses: [],
        investments: []
      });
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <Link href="/finance">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Finance
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Finance Setup</h1>
            <p className="text-muted-foreground">Configure your monthly recurring finances</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Button variant="outline" onClick={resetSetup} className="w-full sm:w-auto">
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset Setup
          </Button>
          <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save Setup'}
          </Button>
        </div>
      </div>

      {/* Current Balance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5" />
            Current Balance
          </CardTitle>
          <CardDescription>Your current account balance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Current Balance (₹)</Label>
            <Input
              type="number"
              value={setup.currentBalance}
              onChange={(e) => setSetup(prev => ({ ...prev, currentBalance: Number(e.target.value) }))}
              placeholder="50000"
            />
          </div>
        </CardContent>
      </Card>

      {/* Income Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Income Sources
          </CardTitle>
          <CardDescription>Your monthly income sources and when they credit</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(setup.incomeSources || []).map((source, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-card">
              <div className="space-y-2">
                <Label>Source Name</Label>
                <Input
                  value={source.name}
                  onChange={(e) => setSetup(prev => ({
                    ...prev,
                    incomeSources: prev.incomeSources.map((item, i) => 
                      i === index ? { ...item, name: e.target.value } : item
                    )
                  }))}
                  placeholder="e.g., Salary, Freelance"
                />
              </div>
              <div className="space-y-2">
                <Label>Monthly Amount (₹)</Label>
                <Input
                  type="number"
                  value={source.amount}
                  onChange={(e) => setSetup(prev => ({
                    ...prev,
                    incomeSources: prev.incomeSources.map((item, i) => 
                      i === index ? { ...item, amount: Number(e.target.value) } : item
                    )
                  }))}
                  placeholder="50000"
                />
              </div>
              <div className="space-y-2">
                <Label>Credit Day</Label>
                <Input
                  type="number"
                  min="1"
                  max="31"
                  value={source.creditDay}
                  onChange={(e) => setSetup(prev => ({
                    ...prev,
                    incomeSources: prev.incomeSources.map((item, i) => 
                      i === index ? { ...item, creditDay: Number(e.target.value) } : item
                    )
                  }))}
                  placeholder="1"
                />
              </div>
              <div className="col-span-full flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newName = prompt('Edit source name:', source.name);
                    if (newName !== null) {
                      setSetup(prev => ({
                        ...prev,
                        incomeSources: prev.incomeSources.map((item, i) => 
                          i === index ? { ...item, name: newName } : item
                        )
                      }));
                    }
                  }}
                  className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSetup(prev => ({
                    ...prev,
                    incomeSources: prev.incomeSources.filter((_, i) => i !== index)
                  }))}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={addIncomeSource}>
            <Plus className="mr-2 h-4 w-4" />
            Add Income Source
          </Button>
        </CardContent>
      </Card>

      {/* EMIs & Loans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            EMIs & Loans
          </CardTitle>
          <CardDescription>Your monthly EMI payments and when they debit</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(setup.emis || []).map((emi, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-card">
              <div className="space-y-2">
                <Label>EMI Name</Label>
                <Input
                  value={emi.name}
                  onChange={(e) => setSetup(prev => ({
                    ...prev,
                    emis: prev.emis.map((item, i) => 
                      i === index ? { ...item, name: e.target.value } : item
                    )
                  }))}
                  placeholder="e.g., Home Loan, Car Loan"
                />
              </div>
              <div className="space-y-2">
                <Label>Monthly Amount (₹)</Label>
                <Input
                  type="number"
                  value={emi.amount}
                  onChange={(e) => setSetup(prev => ({
                    ...prev,
                    emis: prev.emis.map((item, i) => 
                      i === index ? { ...item, amount: Number(e.target.value) } : item
                    )
                  }))}
                  placeholder="15000"
                />
              </div>
              <div className="space-y-2">
                <Label>Debit Day</Label>
                <Input
                  type="number"
                  min="1"
                  max="31"
                  value={emi.debitDay}
                  onChange={(e) => setSetup(prev => ({
                    ...prev,
                    emis: prev.emis.map((item, i) => 
                      i === index ? { ...item, debitDay: Number(e.target.value) } : item
                    )
                  }))}
                  placeholder="5"
                />
              </div>
              <div className="space-y-2">
                <Label>Lender (Optional)</Label>
                <Input
                  value={emi.lender || ''}
                  onChange={(e) => setSetup(prev => ({
                    ...prev,
                    emis: prev.emis.map((item, i) => 
                      i === index ? { ...item, lender: e.target.value } : item
                    )
                  }))}
                  placeholder="e.g., HDFC Bank"
                />
              </div>
              <div className="col-span-full flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newName = prompt('Edit EMI name:', emi.name);
                    if (newName !== null) {
                      setSetup(prev => ({
                        ...prev,
                        emis: prev.emis.map((item, i) => 
                          i === index ? { ...item, name: newName } : item
                        )
                      }));
                    }
                  }}
                  className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSetup(prev => ({
                    ...prev,
                    emis: prev.emis.filter((_, i) => i !== index)
                  }))}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={addEMI}>
            <Plus className="mr-2 h-4 w-4" />
            Add EMI
          </Button>
        </CardContent>
      </Card>

      {/* Living Expenses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Home className="mr-2 h-5 w-5" />
            Living Expenses
          </CardTitle>
          <CardDescription>Monthly recurring living expenses and when they debit</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(setup.livingExpenses || []).map((expense, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-card">
              <div className="space-y-2">
                <Label>Expense Name</Label>
                <Input
                  value={expense.name}
                  onChange={(e) => setSetup(prev => ({
                    ...prev,
                    livingExpenses: prev.livingExpenses.map((item, i) => 
                      i === index ? { ...item, name: e.target.value } : item
                    )
                  }))}
                  placeholder="e.g., Rent, Netflix, Electricity"
                />
              </div>
              <div className="space-y-2">
                <Label>Monthly Amount (₹)</Label>
                <Input
                  type="number"
                  value={expense.amount}
                  onChange={(e) => setSetup(prev => ({
                    ...prev,
                    livingExpenses: prev.livingExpenses.map((item, i) => 
                      i === index ? { ...item, amount: Number(e.target.value) } : item
                    )
                  }))}
                  placeholder="10000"
                />
              </div>
              <div className="space-y-2">
                <Label>Debit Day</Label>
                <Input
                  type="number"
                  min="1"
                  max="31"
                  value={expense.debitDay}
                  onChange={(e) => setSetup(prev => ({
                    ...prev,
                    livingExpenses: prev.livingExpenses.map((item, i) => 
                      i === index ? { ...item, debitDay: Number(e.target.value) } : item
                    )
                  }))}
                  placeholder="1"
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={expense.category}
                  onValueChange={(value) => setSetup(prev => ({
                    ...prev,
                    livingExpenses: prev.livingExpenses.map((item, i) => 
                      i === index ? { ...item, category: value as any } : item
                    )
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rent">Rent</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="subscriptions">Subscriptions</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-full flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newName = prompt('Edit expense name:', expense.name);
                    if (newName !== null) {
                      setSetup(prev => ({
                        ...prev,
                        livingExpenses: prev.livingExpenses.map((item, i) => 
                          i === index ? { ...item, name: newName } : item
                        )
                      }));
                    }
                  }}
                  className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSetup(prev => ({
                    ...prev,
                    livingExpenses: prev.livingExpenses.filter((_, i) => i !== index)
                  }))}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={addLivingExpense}>
            <Plus className="mr-2 h-4 w-4" />
            Add Living Expense
          </Button>
        </CardContent>
      </Card>

      {/* Investments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="mr-2 h-5 w-5" />
            Investments
          </CardTitle>
          <CardDescription>Your monthly investments and when you pay them</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(setup.investments || []).map((investment, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg bg-card">
              <div className="space-y-2">
                <Label>Investment Type</Label>
                <Select
                  value={investment.type}
                  onValueChange={(value) => setSetup(prev => ({
                    ...prev,
                    investments: prev.investments.map((item, i) => 
                      i === index ? { ...item, type: value as any } : item
                    )
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SIP">SIP</SelectItem>
                    <SelectItem value="MF">Mutual Fund</SelectItem>
                    <SelectItem value="Gold">Gold</SelectItem>
                    <SelectItem value="Stock">Stock</SelectItem>
                    <SelectItem value="FD">Fixed Deposit</SelectItem>
                    <SelectItem value="PPF">PPF</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={investment.name}
                  onChange={(e) => setSetup(prev => ({
                    ...prev,
                    investments: prev.investments.map((item, i) => 
                      i === index ? { ...item, name: e.target.value } : item
                    )
                  }))}
                  placeholder="e.g., Nifty 50 Index Fund"
                />
              </div>
              <div className="space-y-2">
                <Label>Monthly Amount (₹)</Label>
                <Input
                  type="number"
                  value={investment.amount}
                  onChange={(e) => setSetup(prev => ({
                    ...prev,
                    investments: prev.investments.map((item, i) => 
                      i === index ? { ...item, amount: Number(e.target.value) } : item
                    )
                  }))}
                  placeholder="5000"
                />
              </div>
              <div className="space-y-2">
                <Label>Debit Day</Label>
                <Input
                  type="number"
                  min="1"
                  max="31"
                  value={investment.debitDay}
                  onChange={(e) => setSetup(prev => ({
                    ...prev,
                    investments: prev.investments.map((item, i) => 
                      i === index ? { ...item, debitDay: Number(e.target.value) } : item
                    )
                  }))}
                  placeholder="1"
                />
              </div>
              <div className="space-y-2">
                <Label>Current Value (₹)</Label>
                <Input
                  type="number"
                  value={investment.currentValue || ''}
                  onChange={(e) => setSetup(prev => ({
                    ...prev,
                    investments: prev.investments.map((item, i) => 
                      i === index ? { ...item, currentValue: Number(e.target.value) } : item
                    )
                  }))}
                  placeholder="100000"
                />
              </div>
              <div className="col-span-full flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newName = prompt('Edit investment name:', investment.name);
                    if (newName !== null) {
                      setSetup(prev => ({
                        ...prev,
                        investments: prev.investments.map((item, i) => 
                          i === index ? { ...item, name: newName } : item
                        )
                      }));
                    }
                  }}
                  className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSetup(prev => ({
                    ...prev,
                    investments: prev.investments.filter((_, i) => i !== index)
                  }))}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={addInvestment}>
            <Plus className="mr-2 h-4 w-4" />
            Add Investment
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}