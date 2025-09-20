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
    console.error('Health GET error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to fetch health logs',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth(req);
    await connectDB();

    const payload = await req.json();
    console.log('Health POST payload:', payload);
    
    // Validate required fields
    if (!payload.date) {
      return NextResponse.json({ ok: false, error: 'Date is required' }, { status: 400 });
    }

    // Ensure supplements object has all required fields
    const supplements = {
      multi: payload.supplements?.multi || false,
      d3k2: payload.supplements?.d3k2 || false,
      b12: payload.supplements?.b12 || false,
      creatine: payload.supplements?.creatine || false,
      fishOil: payload.supplements?.fishOil || false,
      other: payload.supplements?.other || []
    };

    const healthData = {
      ...payload,
      supplements
    };

    // Upsert health log
    const log = await HealthLog.findOneAndUpdate(
      { date: payload.date },
      { $set: healthData },
      { upsert: true, new: true }
    );

    console.log('Health log saved:', log);
    return NextResponse.json({ ok: true, log });
  } catch (error) {
    console.error('Health POST error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to save health log',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
