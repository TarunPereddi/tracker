'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, CreditCard, PiggyBank } from 'lucide-react';

export default function FinancePage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Finance Tracker</h1>
          <p className="text-gray-600">Manage your finances, track expenses, and monitor investments</p>
        </div>
        <Button>
          <DollarSign className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">₹2,50,000</div>
                <div className="text-sm text-gray-500">Net Worth</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">₹50,000</div>
                <div className="text-sm text-gray-500">Monthly Income</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-red-500" />
              <div>
                <div className="text-2xl font-bold">₹35,000</div>
                <div className="text-sm text-gray-500">Monthly Expenses</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <PiggyBank className="h-5 w-5 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">₹15,000</div>
                <div className="text-sm text-gray-500">Monthly Savings</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coming Soon */}
      <Card>
        <CardHeader>
          <CardTitle>Finance Tracker</CardTitle>
          <CardDescription>Coming Soon - Full finance management features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <DollarSign className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p>Finance tracking features are under development.</p>
            <p className="text-sm">This will include expense tracking, investment monitoring, and financial analytics.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
