import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import DayType from '@/lib/schemas/DayType';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth(req);
    await connectDB();

    const dayType = await DayType.findById(params.id);
    if (!dayType) {
      return NextResponse.json({ ok: false, error: 'Day type not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, dayType });
  } catch (error) {
    console.error('Day Type GET error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to fetch day type',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth(req);
    await connectDB();

    const payload = await req.json();
    console.log('Day Type PUT payload:', payload);
    
    // Validate required fields
    if (!payload.name || !payload.intendedWake || !payload.intendedSleep || !payload.intendedSteps) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Ensure routineChecklist is an array
    const routineChecklist = Array.isArray(payload.routineChecklist) ? payload.routineChecklist : [];

    const dayTypeData = {
      ...payload,
      routineChecklist,
      updatedAt: new Date()
    };

    const dayType = await DayType.findByIdAndUpdate(
      params.id, 
      dayTypeData, 
      { new: true, runValidators: true }
    );

    if (!dayType) {
      return NextResponse.json({ ok: false, error: 'Day type not found' }, { status: 404 });
    }

    console.log('Day Type updated:', dayType);
    
    return NextResponse.json({ ok: true, dayType });
  } catch (error) {
    console.error('Day Type PUT error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to update day type',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth(req);
    await connectDB();

    const dayType = await DayType.findByIdAndDelete(params.id);
    if (!dayType) {
      return NextResponse.json({ ok: false, error: 'Day type not found' }, { status: 404 });
    }

    console.log('Day Type deleted:', dayType);
    
    return NextResponse.json({ ok: true, message: 'Day type deleted successfully' });
  } catch (error) {
    console.error('Day Type DELETE error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to delete day type',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
