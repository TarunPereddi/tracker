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

export async function DELETE(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    await connectDB();

    const { confirmPassword } = await req.json();
    
    if (!confirmPassword) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Password confirmation is required' 
      }, { status: 400 });
    }

    // Get user to verify password
    const userDoc = await User.findById(user.id);
    
    if (!userDoc) {
      return NextResponse.json({ 
        ok: false, 
        error: 'User not found' 
      }, { status: 404 });
    }

    // Verify password
    if (userDoc.password !== confirmPassword) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Invalid password' 
      }, { status: 401 });
    }

    // Delete all user's data
    await Promise.all([
      Transaction.deleteMany({ userId: user.id }),
      SkillLog.deleteMany({ userId: user.id }),
      HealthLog.deleteMany({ userId: user.id }),
      JobApplication.deleteMany({ userId: user.id }),
      DayPlan.deleteMany({ userId: user.id }),
      DayType.deleteMany({ userId: user.id }),
      FinanceSetup.deleteMany({ userId: user.id })
    ]);

    // Finally, delete the user account
    await User.findByIdAndDelete(user.id);

    return NextResponse.json({ 
      ok: true, 
      message: 'Account and all data have been permanently deleted' 
    });
  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to delete account',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
