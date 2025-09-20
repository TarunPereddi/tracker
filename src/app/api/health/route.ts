import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import HealthLog from '@/lib/schemas/HealthLog';

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);
    await connectDB();

    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const limit = parseInt(searchParams.get('limit') || '30');

    let query = {};
    if (date) {
      query = { date };
    }

    const logs = await HealthLog.find(query)
      .sort({ date: -1 })
      .limit(limit);

    return NextResponse.json({ ok: true, logs });
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Failed to fetch health logs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth(req);
    await connectDB();

    const payload = await req.json();
    
    // Validate required fields
    if (!payload.date) {
      return NextResponse.json({ ok: false, error: 'Date is required' }, { status: 400 });
    }

    // Upsert health log
    const log = await HealthLog.findOneAndUpdate(
      { date: payload.date },
      { $set: payload },
      { upsert: true, new: true }
    );

    return NextResponse.json({ ok: true, log });
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Failed to save health log' }, { status: 500 });
  }
}
