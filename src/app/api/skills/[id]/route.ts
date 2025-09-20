import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import SkillLog from '@/lib/schemas/SkillLog';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth(req);
    await connectDB();

    const skill = await SkillLog.findById(params.id);
    if (!skill) {
      return NextResponse.json({ ok: false, error: 'Skill log not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, skill });
  } catch (error) {
    console.error('Skill GET error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to fetch skill log',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth(req);
    await connectDB();

    const payload = await req.json();
    console.log('Skill PUT payload:', payload);
    
    // Validate required fields
    if (!payload.date || !payload.skill || !payload.category || !payload.timeSpent || !payload.resource || !payload.difficulty) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Missing required fields: date, skill, category, timeSpent, resource, difficulty' 
      }, { status: 400 });
    }

    // Ensure timeSpent is a number
    payload.timeSpent = Number(payload.timeSpent);
    
    if (isNaN(payload.timeSpent) || payload.timeSpent < 1) {
      return NextResponse.json({ 
        ok: false, 
        error: 'timeSpent must be a positive number' 
      }, { status: 400 });
    }

    const skill = await SkillLog.findByIdAndUpdate(
      params.id, 
      { ...payload, updatedAt: new Date() }, 
      { new: true, runValidators: true }
    );

    if (!skill) {
      return NextResponse.json({ ok: false, error: 'Skill log not found' }, { status: 404 });
    }

    console.log('Skill log updated:', skill);
    
    return NextResponse.json({ ok: true, skill });
  } catch (error) {
    console.error('Skill PUT error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to update skill log',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth(req);
    await connectDB();

    const skill = await SkillLog.findByIdAndDelete(params.id);
    if (!skill) {
      return NextResponse.json({ ok: false, error: 'Skill log not found' }, { status: 404 });
    }

    console.log('Skill log deleted:', skill);
    
    return NextResponse.json({ ok: true, message: 'Skill log deleted successfully' });
  } catch (error) {
    console.error('Skill DELETE error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to delete skill log',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}