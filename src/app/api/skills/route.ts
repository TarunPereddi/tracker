import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import SkillLog from '@/lib/schemas/SkillLog';

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);
    await connectDB();

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const category = searchParams.get('category');
    const skill = searchParams.get('skill');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query: any = {};
    
    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    }
    
    if (category) {
      query.category = category;
    }
    
    if (skill) {
      query.skill = { $regex: skill, $options: 'i' };
    }

    const skills = await SkillLog.find(query)
      .sort({ date: -1, createdAt: -1 })
      .limit(limit);

    return NextResponse.json({ ok: true, skills });
  } catch (error) {
    console.error('Skills GET error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to fetch skills',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth(req);
    await connectDB();

    const payload = await req.json();
    console.log('Skill POST payload:', payload);
    
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

    const skill = await SkillLog.create(payload);
    console.log('Skill log created:', skill);
    
    return NextResponse.json({ ok: true, skill });
  } catch (error) {
    console.error('Skill POST error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to create skill log',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
