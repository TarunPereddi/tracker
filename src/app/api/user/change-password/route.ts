import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import User from '@/lib/schemas/User';

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    await connectDB();

    const { currentPassword, newPassword } = await req.json();
    
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Current password and new password are required' 
      }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ 
        ok: false, 
        error: 'New password must be at least 6 characters' 
      }, { status: 400 });
    }

    // Get user and verify current password
    const userDoc = await User.findById(user.id);
    
    if (!userDoc) {
      return NextResponse.json({ 
        ok: false, 
        error: 'User not found' 
      }, { status: 404 });
    }

    // Verify current password
    if (userDoc.password !== currentPassword) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Current password is incorrect' 
      }, { status: 401 });
    }

    // Update password
    userDoc.password = newPassword;
    await userDoc.save();

    return NextResponse.json({ 
      ok: true, 
      message: 'Password changed successfully' 
    });
  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to change password',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
