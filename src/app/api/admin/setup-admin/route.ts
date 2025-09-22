import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/schemas/User';
import RegistrationCode from '@/lib/schemas/RegistrationCode';

export async function POST(req: NextRequest) {
  try {
    const { adminPasscode, username, password } = await req.json();
    
    // Verify admin setup passcode
    if (adminPasscode !== process.env.ADMIN_SETUP_PASSCODE) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Invalid admin setup passcode' 
      }, { status: 401 });
    }

    if (!username || !password) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Username and password are required' 
      }, { status: 400 });
    }

    await connectDB();

    // Check if any admin already exists
    const existingAdmin = await User.findOne({ isAdmin: true });
    if (existingAdmin) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Admin user already exists' 
      }, { status: 400 });
    }

    // Create admin user
    const admin = await User.create({
      username: username.toLowerCase(),
      password,
      isAdmin: true
    });

    // Generate initial registration code
    const initialCode = 'WELCOME1'; // Simple initial code
    await RegistrationCode.create({
      code: initialCode,
      createdBy: admin._id.toString(),
      isActive: true
    });

    return NextResponse.json({ 
      ok: true, 
      message: 'Admin user created successfully',
      admin: { id: admin._id, username: admin.username },
      initialRegistrationCode: initialCode
    });
  } catch (error) {
    console.error('Admin setup error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to setup admin user',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
