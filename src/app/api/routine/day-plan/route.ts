import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import DayPlan from '@/lib/schemas/DayPlan';
import DayType from '@/lib/schemas/DayType';

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
    console.error('Day Plans GET error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to fetch day plans',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth(req);
    await connectDB();

    const { date, dayTypeId, overrides } = await req.json();
    console.log('Day Plan POST payload:', { date, dayTypeId, overrides });
    
    if (!date || !dayTypeId) {
      return NextResponse.json({ ok: false, error: 'Date and dayTypeId are required' }, { status: 400 });
    }

    // Verify dayTypeId exists
    const dayType = await DayType.findById(dayTypeId);
    if (!dayType) {
      return NextResponse.json({ ok: false, error: 'Day type not found' }, { status: 404 });
    }

    const dayPlan = await DayPlan.findOneAndUpdate(
      { date },
      { 
        $set: { 
          dayTypeId, 
          overrides: overrides || {},
          routineChecks: [] // Reset routine checks when changing day type
        } 
      },
      { upsert: true, new: true }
    );

    console.log('Day Plan saved:', dayPlan);
    return NextResponse.json({ ok: true, dayPlan });
  } catch (error) {
    console.error('Day Plan POST error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to save day plan',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
