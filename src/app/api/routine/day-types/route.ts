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
    return NextResponse.json({ ok: false, error: 'Failed to fetch day types' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth(req);
    await connectDB();

    const payload = await req.json();
    
    // Validate required fields
    if (!payload.name || !payload.intendedWake || !payload.intendedSleep || !payload.intendedSteps) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
    }

    const dayType = await DayType.create(payload);
    return NextResponse.json({ ok: true, dayType });
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Failed to create day type' }, { status: 500 });
  }
}
