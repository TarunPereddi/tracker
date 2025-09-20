import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import DayPlan from '@/lib/schemas/DayPlan';

export async function GET(
  req: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    await requireAuth(req);
    await connectDB();

    const dayPlan = await DayPlan.findOne({ date: params.date });
    return NextResponse.json({ ok: true, dayPlan });
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Failed to fetch day plan' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    await requireAuth(req);
    await connectDB();

    const { routineChecks } = await req.json();
    
    const dayPlan = await DayPlan.findOneAndUpdate(
      { date: params.date },
      { $set: { routineChecks } },
      { new: true }
    );

    if (!dayPlan) {
      return NextResponse.json({ ok: false, error: 'Day plan not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, dayPlan });
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Failed to update day plan' }, { status: 500 });
  }
}
