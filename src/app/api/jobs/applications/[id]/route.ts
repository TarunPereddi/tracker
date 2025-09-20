import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import JobApplication from '@/lib/schemas/JobApplication';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth(req);
    await connectDB();

    const application = await JobApplication.findById(params.id);
    
    if (!application) {
      return NextResponse.json({ ok: false, error: 'Job application not found' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, application });
  } catch (error) {
    console.error('Job Application GET error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to fetch job application',
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

    const payload = await req.json();
    console.log('Job Application PUT payload:', payload);

    const application = await JobApplication.findByIdAndUpdate(
      params.id,
      { $set: payload },
      { new: true }
    );

    if (!application) {
      return NextResponse.json({ ok: false, error: 'Job application not found' }, { status: 404 });
    }

    console.log('Job application updated:', application);
    return NextResponse.json({ ok: true, application });
  } catch (error) {
    console.error('Job Application PUT error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to update job application',
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

    const application = await JobApplication.findByIdAndDelete(params.id);

    if (!application) {
      return NextResponse.json({ ok: false, error: 'Job application not found' }, { status: 404 });
    }

    console.log('Job application deleted:', application);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Job Application DELETE error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to delete job application',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
