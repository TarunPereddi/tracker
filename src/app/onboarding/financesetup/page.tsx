'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Trash2, 
  Save,
  ArrowLeft,
  ArrowRight,
  DollarSign,
  CreditCard,
  Home,
  TrendingUp,
  Zap,
  Edit
} from 'lucide-react';

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
  const router = useRouter();
  const { success: showSuccess, error: showError } = useToast();

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
        // Update onboarding status to guide
        await fetch('/api/user/onboarding', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'guide' }),
        });

        showSuccess('Finance setup saved successfully!');
        router.push('/onboarding/guide');
      } else {
        showError(data.error || 'Failed to save finance setup');
      }
    } catch (error) {
      console.error('Failed to save finance setup:', error);
      showError('Failed to save finance setup. Please try again.');
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-4xl">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-muted rounded w-1/4"></div>
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-32 bg-muted rounded"></div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="flex items-center justify-center space-x-2">
              <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" />
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Finance Setup</h1>
            </div>
            <CardDescription className="text-gray-400 text-sm sm:text-base">
              Configure your monthly recurring finances to track your financial health
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Current Balance */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Current Balance
                </CardTitle>
                <CardDescription className="text-gray-400">Your current account balance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label className="text-gray-300">Current Balance (₹)</Label>
                  <Input
                    type="number"
                    value={setup.currentBalance}
                    onChange={(e) => setSetup(prev => ({ ...prev, currentBalance: Number(e.target.value) }))}
                    placeholder="50000"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Income Sources */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Income Sources
                </CardTitle>
                <CardDescription className="text-gray-400">Your monthly income sources and when they credit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(setup.incomeSources || []).map((source, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-700 rounded-lg bg-gray-700">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Source Name</Label>
                      <Input
                        value={source.name}
                        onChange={(e) => setSetup(prev => ({
                          ...prev,
                          incomeSources: prev.incomeSources.map((item, i) => 
                            i === index ? { ...item, name: e.target.value } : item
                          )
                        }))}
                        placeholder="e.g., Salary, Freelance"
                        className="bg-gray-600 border-gray-500 text-white placeholder-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Monthly Amount (₹)</Label>
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
                        className="bg-gray-600 border-gray-500 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Credit Day</Label>
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
                        className="bg-gray-600 border-gray-500 text-white"
                      />
                    </div>
                    <div className="col-span-full flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSetup(prev => ({
                          ...prev,
                          incomeSources: prev.incomeSources.filter((_, i) => i !== index)
                        }))}
                        className="border-red-500 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" onClick={addIncomeSource} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Income Source
                </Button>
              </CardContent>
            </Card>

            {/* EMIs & Loans */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <CreditCard className="mr-2 h-5 w-5" />
                  EMIs & Loans
                </CardTitle>
                <CardDescription className="text-gray-400">Your monthly EMI payments and when they debit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(setup.emis || []).map((emi, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-700 rounded-lg bg-gray-700">
                    <div className="space-y-2">
                      <Label className="text-gray-300">EMI Name</Label>
                      <Input
                        value={emi.name}
                        onChange={(e) => setSetup(prev => ({
                          ...prev,
                          emis: prev.emis.map((item, i) => 
                            i === index ? { ...item, name: e.target.value } : item
                          )
                        }))}
                        placeholder="e.g., Home Loan, Car Loan"
                        className="bg-gray-600 border-gray-500 text-white placeholder-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Monthly Amount (₹)</Label>
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
                        className="bg-gray-600 border-gray-500 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Debit Day</Label>
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
                        className="bg-gray-600 border-gray-500 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Lender (Optional)</Label>
                      <Input
                        value={emi.lender || ''}
                        onChange={(e) => setSetup(prev => ({
                          ...prev,
                          emis: prev.emis.map((item, i) => 
                            i === index ? { ...item, lender: e.target.value } : item
                          )
                        }))}
                        placeholder="e.g., HDFC Bank"
                        className="bg-gray-600 border-gray-500 text-white placeholder-gray-400"
                      />
                    </div>
                    <div className="col-span-full flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSetup(prev => ({
                          ...prev,
                          emis: prev.emis.filter((_, i) => i !== index)
                        }))}
                        className="border-red-500 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" onClick={addEMI} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add EMI
                </Button>
              </CardContent>
            </Card>

            {/* Living Expenses */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Home className="mr-2 h-5 w-5" />
                  Living Expenses
                </CardTitle>
                <CardDescription className="text-gray-400">Monthly recurring living expenses and when they debit</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(setup.livingExpenses || []).map((expense, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-700 rounded-lg bg-gray-700">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Expense Name</Label>
                      <Input
                        value={expense.name}
                        onChange={(e) => setSetup(prev => ({
                          ...prev,
                          livingExpenses: prev.livingExpenses.map((item, i) => 
                            i === index ? { ...item, name: e.target.value } : item
                          )
                        }))}
                        placeholder="e.g., Rent, Netflix, Electricity"
                        className="bg-gray-600 border-gray-500 text-white placeholder-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Monthly Amount (₹)</Label>
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
                        className="bg-gray-600 border-gray-500 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Debit Day</Label>
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
                        className="bg-gray-600 border-gray-500 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Category</Label>
                      <Select
                        value={expense.category}
                        onValueChange={(value) => setSetup(prev => ({
                          ...prev,
                          livingExpenses: prev.livingExpenses.map((item, i) => 
                            i === index ? { ...item, category: value as any } : item
                          )
                        }))}
                      >
                        <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="rent" className="text-white hover:bg-gray-700">Rent</SelectItem>
                          <SelectItem value="utilities" className="text-white hover:bg-gray-700">Utilities</SelectItem>
                          <SelectItem value="subscriptions" className="text-white hover:bg-gray-700">Subscriptions</SelectItem>
                          <SelectItem value="other" className="text-white hover:bg-gray-700">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-full flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSetup(prev => ({
                          ...prev,
                          livingExpenses: prev.livingExpenses.filter((_, i) => i !== index)
                        }))}
                        className="border-red-500 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" onClick={addLivingExpense} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Living Expense
                </Button>
              </CardContent>
            </Card>

            {/* Investments */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Zap className="mr-2 h-5 w-5" />
                  Investments
                </CardTitle>
                <CardDescription className="text-gray-400">Your monthly investments and when you pay them</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(setup.investments || []).map((investment, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-700 rounded-lg bg-gray-700">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Investment Type</Label>
                      <Select
                        value={investment.type}
                        onValueChange={(value) => setSetup(prev => ({
                          ...prev,
                          investments: prev.investments.map((item, i) => 
                            i === index ? { ...item, type: value as any } : item
                          )
                        }))}
                      >
                        <SelectTrigger className="bg-gray-600 border-gray-500 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="SIP" className="text-white hover:bg-gray-700">SIP</SelectItem>
                          <SelectItem value="MF" className="text-white hover:bg-gray-700">Mutual Fund</SelectItem>
                          <SelectItem value="Gold" className="text-white hover:bg-gray-700">Gold</SelectItem>
                          <SelectItem value="Stock" className="text-white hover:bg-gray-700">Stock</SelectItem>
                          <SelectItem value="FD" className="text-white hover:bg-gray-700">Fixed Deposit</SelectItem>
                          <SelectItem value="PPF" className="text-white hover:bg-gray-700">PPF</SelectItem>
                          <SelectItem value="Other" className="text-white hover:bg-gray-700">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Name</Label>
                      <Input
                        value={investment.name}
                        onChange={(e) => setSetup(prev => ({
                          ...prev,
                          investments: prev.investments.map((item, i) => 
                            i === index ? { ...item, name: e.target.value } : item
                          )
                        }))}
                        placeholder="e.g., Nifty 50 Index Fund"
                        className="bg-gray-600 border-gray-500 text-white placeholder-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Monthly Amount (₹)</Label>
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
                        className="bg-gray-600 border-gray-500 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Debit Day</Label>
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
                        className="bg-gray-600 border-gray-500 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Current Value (₹)</Label>
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
                        className="bg-gray-600 border-gray-500 text-white"
                      />
                    </div>
                    <div className="col-span-full flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSetup(prev => ({
                          ...prev,
                          investments: prev.investments.filter((_, i) => i !== index)
                        }))}
                        className="border-red-500 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" onClick={addInvestment} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Investment
                </Button>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row justify-between pt-6 space-y-3 sm:space-y-0">
              <Button
                onClick={() => router.push('/onboarding/daytypes')}
                variant="outline"
                className="border-gray-600 text-gray-300 w-full sm:w-auto"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto"
              >
                {saving ? 'Saving...' : 'Continue'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
