import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import DayType from '@/lib/schemas/DayType';

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);
    await connectDB();

    const dayTypes = await DayType.find().sort({ createdAt: -1 });
    return NextResponse.json({ ok: true, dayTypes });
  } catch (error) {
    console.error('Day Types GET error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to fetch day types',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth(req);
    await connectDB();

    const payload = await req.json();
    console.log('Day Type POST payload:', payload);
    
    // Validate required fields
    if (!payload.name || !payload.intendedWake || !payload.intendedSleep || !payload.intendedSteps) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Ensure routineChecklist is an array
    const routineChecklist = Array.isArray(payload.routineChecklist) ? payload.routineChecklist : [];

    const dayTypeData = {
      ...payload,
      routineChecklist
    };

    const dayType = await DayType.create(dayTypeData);
    console.log('Day Type created:', dayType);
    
    return NextResponse.json({ ok: true, dayType });
  } catch (error) {
    console.error('Day Type POST error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to create day type',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
