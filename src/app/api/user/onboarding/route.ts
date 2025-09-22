import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { requireAuth, createToken } from '@/lib/auth';
import User from '@/lib/schemas/User';

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    await connectDB();

    const { status } = await req.json();
    
    if (!status || !['incomplete', 'daytypes', 'health', 'finance', 'guide', 'completed'].includes(status)) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Invalid onboarding status' 
      }, { status: 400 });
    }

    // Update user's onboarding status
    const updatedUser = await User.findByIdAndUpdate(user.id, { onboardingStatus: status }, { new: true });
    
    if (!updatedUser) {
      return NextResponse.json({ 
        ok: false, 
        error: 'User not found' 
      }, { status: 404 });
    }

    // Create new JWT token with updated onboarding status
    const newToken = createToken(
      updatedUser._id.toString(),
      updatedUser.username,
      updatedUser.isAdmin,
      updatedUser.onboardingStatus
    );

    const response = NextResponse.json({ 
      ok: true, 
      message: 'Onboarding status updated successfully',
      onboardingStatus: status
    });

    // Update cookie with new token
    response.cookies.set('session', newToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      secure: process.env.NODE_ENV === 'production'
    });

    return response;
  } catch (error) {
    console.error('Onboarding status update error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to update onboarding status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    await connectDB();

    const userDoc = await User.findById(user.id);
    if (!userDoc) {
      return NextResponse.json({ 
        ok: false, 
        error: 'User not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      ok: true, 
      onboardingStatus: userDoc.onboardingStatus
    });
  } catch (error) {
    console.error('Get onboarding status error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to get onboarding status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
