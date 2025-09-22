import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/schemas/User';
import { createToken } from '@/lib/auth';

function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  return forwarded?.split(',')[0] || realIP || 'unknown';
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const { username, password } = await req.json();
    
    // Basic validation
    if (!username || !password) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Username and password are required' 
      }, { status: 400 });
    }
    
    // Find user by username
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Invalid username or password' 
      }, { status: 401 });
    }
    
    // Check password (simple string comparison for now)
    if (user.password !== password) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Invalid username or password' 
      }, { status: 401 });
    }
    
    // Update last login
    user.lastLoginAt = new Date();
    await user.save();
    
    // Create JWT token
    const token = createToken(user._id.toString(), user.username, user.isAdmin, user.onboardingStatus);
    
    const response = NextResponse.json({ 
      ok: true, 
      user: { 
        id: user._id, 
        username: user.username, 
        isAdmin: user.isAdmin,
        onboardingStatus: user.onboardingStatus 
      } 
    });
    
    // Set cookie
    response.cookies.set('session', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      secure: process.env.NODE_ENV === 'production'
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Login failed. Please try again.' 
    }, { status: 500 });
  }
}
