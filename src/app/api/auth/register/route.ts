import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/schemas/User';
import RegistrationCode from '@/lib/schemas/RegistrationCode';
import { createToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const { username, password, passcode } = await req.json();
    
    // Basic validation
    if (!username || !password || !passcode) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Username, password, and passcode are required' 
      }, { status: 400 });
    }
    
    // Check if it's admin setup passcode first
    const isAdminSetup = passcode === process.env.ADMIN_SETUP_PASSCODE;
    
    if (!isAdminSetup) {
      // Verify passcode against database
      const activeCode = await RegistrationCode.findOne({ 
        code: passcode, 
        isActive: true 
      });

      if (!activeCode) {
        return NextResponse.json({
          ok: false,
          error: 'Invalid or expired registration code'
        }, { status: 401 });
      }
    }
    
    if (username.length < 3 || username.length > 20) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Username must be between 3 and 20 characters' 
      }, { status: 400 });
    }
    
    if (password.length < 6) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Password must be at least 6 characters' 
      }, { status: 400 });
    }
    
    // Check if username already exists
    const existingUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Username already exists' 
      }, { status: 400 });
    }
    
    // Create new user
    const user = await User.create({
      username: username.toLowerCase(),
      password, // Store as plain string for simplicity
      isAdmin: isAdminSetup // Set admin status if using admin setup passcode
    });
    
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
    console.error('Registration error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Registration failed. Please try again.' 
    }, { status: 500 });
  }
}
