import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import DayPlan from '@/lib/schemas/DayPlan';

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);
    await connectDB();

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let query = {};
    if (startDate && endDate) {
      query = { date: { $gte: startDate, $lte: endDate } };
    }

    const dayPlans = await DayPlan.find(query).sort({ date: -1 });
    return NextResponse.json({ ok: true, dayPlans });
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Failed to fetch day plans' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth(req);
    await connectDB();

    const { date, dayTypeId, overrides } = await req.json();
    
    if (!date || !dayTypeId) {
      return NextResponse.json({ ok: false, error: 'Date and dayTypeId are required' }, { status: 400 });
    }

    const dayPlan = await DayPlan.findOneAndUpdate(
      { date },
      { 
        $set: { 
          dayTypeId, 
          overrides,
          routineChecks: [] // Reset routine checks when changing day type
        } 
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ ok: true, dayPlan });
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Failed to save day plan' }, { status: 500 });
  }
}
