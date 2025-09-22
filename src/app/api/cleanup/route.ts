import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import User from '@/lib/schemas/User';
import Transaction from '@/lib/schemas/Transaction';
import SkillLog from '@/lib/schemas/SkillLog';
import HealthLog from '@/lib/schemas/HealthLog';
import JobApplication from '@/lib/schemas/JobApplication';
import DayPlan from '@/lib/schemas/DayPlan';
import DayType from '@/lib/schemas/DayType';
import FinanceSetup from '@/lib/schemas/FinanceSetup';
import RegistrationCode from '@/lib/schemas/RegistrationCode';

export async function DELETE(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    
    // Check if user is admin
    if (!user.isAdmin) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Admin access required' 
      }, { status: 403 });
    }

    await connectDB();

    // Delete all user data but preserve users and admin accounts
    await Promise.all([
      Transaction.deleteMany({}),
      SkillLog.deleteMany({}),
      HealthLog.deleteMany({}),
      JobApplication.deleteMany({}),
      DayPlan.deleteMany({}),
      DayType.deleteMany({}),
      FinanceSetup.deleteMany({}),
      RegistrationCode.deleteMany({})
    ]);

    return NextResponse.json({ 
      ok: true, 
      message: 'All data has been cleaned successfully' 
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to clean data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
