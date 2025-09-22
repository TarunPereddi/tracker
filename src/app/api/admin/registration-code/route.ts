import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import RegistrationCode from '@/lib/schemas/RegistrationCode';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    
    // Check if user is admin
    if (!user.isAdmin) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Admin access required' 
      }, { status: 403 });
    }

    await connectDB();

    // Get current active registration code
    const activeCode = await RegistrationCode.findOne({ isActive: true })
      .sort({ createdAt: -1 });

    if (!activeCode) {
      return NextResponse.json({ 
        ok: false, 
        error: 'No active registration code found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      ok: true, 
      code: activeCode.code,
      createdAt: activeCode.createdAt,
      createdBy: activeCode.createdBy
    });
  } catch (error) {
    console.error('Get registration code error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to get registration code',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
