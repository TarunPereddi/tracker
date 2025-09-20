import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import JobApplication from '@/lib/schemas/JobApplication';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth(req);
    await connectDB();

    const payload = await req.json();
    console.log('Interview POST payload:', payload);
    
    // Validate required fields
    if (!payload.date || !payload.type) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Missing required fields: date, type' 
      }, { status: 400 });
    }

    const application = await JobApplication.findById(params.id);
    
    if (!application) {
      return NextResponse.json({ ok: false, error: 'Job application not found' }, { status: 404 });
    }

    // Add interview to the application
    application.interviews.push(payload);
    await application.save();

    console.log('Interview added:', payload);
    return NextResponse.json({ ok: true, application });
  } catch (error) {
    console.error('Interview POST error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to add interview',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth(req);
    await connectDB();

    const { interviewId, ...payload } = await req.json();
    console.log('Interview PUT payload:', payload);
    
    if (!interviewId) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Missing interviewId' 
      }, { status: 400 });
    }

    const application = await JobApplication.findById(params.id);
    
    if (!application) {
      return NextResponse.json({ ok: false, error: 'Job application not found' }, { status: 404 });
    }

    // Update specific interview
    const interviewIndex = application.interviews.findIndex(
      (interview: any) => interview._id.toString() === interviewId
    );

    if (interviewIndex === -1) {
      return NextResponse.json({ ok: false, error: 'Interview not found' }, { status: 404 });
    }

    application.interviews[interviewIndex] = { ...application.interviews[interviewIndex], ...payload };
    await application.save();

    console.log('Interview updated:', payload);
    return NextResponse.json({ ok: true, application });
  } catch (error) {
    console.error('Interview PUT error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to update interview',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth(req);
    await connectDB();

    const { searchParams } = new URL(req.url);
    const interviewId = searchParams.get('interviewId');
    
    if (!interviewId) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Missing interviewId' 
      }, { status: 400 });
    }

    const application = await JobApplication.findById(params.id);
    
    if (!application) {
      return NextResponse.json({ ok: false, error: 'Job application not found' }, { status: 404 });
    }

    // Remove specific interview
    application.interviews = application.interviews.filter(
      (interview: any) => interview._id.toString() !== interviewId
    );
    await application.save();

    console.log('Interview deleted:', interviewId);
    return NextResponse.json({ ok: true, application });
  } catch (error) {
    console.error('Interview DELETE error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to delete interview',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
