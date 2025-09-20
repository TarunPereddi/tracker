import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import HealthLog from '@/lib/schemas/HealthLog';

export async function GET(
  req: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    await requireAuth(req);
    await connectDB();

    const log = await HealthLog.findOne({ date: params.date });
    
    if (!log) {
      return NextResponse.json({ ok: false, error: 'Health log not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, log });
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Failed to fetch health log' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    await requireAuth(req);
    await connectDB();

    await HealthLog.findOneAndDelete({ date: params.date });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Failed to delete health log' }, { status: 500 });
  }
}
