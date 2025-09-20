import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import JobApplication from '@/lib/schemas/JobApplication';

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query: any = {};
    
    if (status) {
      query.status = status;
    }

    const applications = await JobApplication.find(query)
      .sort({ appliedDate: -1, createdAt: -1 })
      .limit(limit);

    return NextResponse.json({ ok: true, applications });
  } catch (error) {
    console.error('Job Applications GET error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to fetch job applications',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth(req);
    await connectDB();

    const payload = await req.json();
    console.log('Job Application POST payload:', payload);
    
    // Validate required fields
    if (!payload.company || !payload.position || !payload.appliedDate || !payload.status || !payload.source) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Missing required fields: company, position, appliedDate, status, source' 
      }, { status: 400 });
    }

    const application = await JobApplication.create(payload);
    console.log('Job application created:', application);
    
    return NextResponse.json({ ok: true, application });
  } catch (error) {
    console.error('Job Application POST error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to create job application',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
