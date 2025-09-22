import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import RegistrationCode from '@/lib/schemas/RegistrationCode';

function generateRandomCode(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(req: NextRequest) {
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

    // Deactivate all existing codes
    await RegistrationCode.updateMany({}, { isActive: false });

    // Generate new code
    let newCode: string;
    let isUnique = false;
    
    while (!isUnique) {
      newCode = generateRandomCode();
      const existing = await RegistrationCode.findOne({ code: newCode });
      if (!existing) {
        isUnique = true;
      }
    }

    // Create new active code
    const registrationCode = await RegistrationCode.create({
      code: newCode!,
      createdBy: user.id,
      isActive: true
    });

    return NextResponse.json({ 
      ok: true, 
      code: registrationCode.code,
      message: 'New registration code generated successfully' 
    });
  } catch (error) {
    console.error('Generate registration code error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Failed to generate registration code',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
