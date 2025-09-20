import { NextRequest, NextResponse } from 'next/server';
import { createToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { passcode } = await req.json();
    
    if (passcode !== process.env.APP_PASSCODE) {
      return NextResponse.json({ ok: false, error: 'Invalid passcode' }, { status: 401 });
    }

    const token = createToken('user-1');
    
    const response = NextResponse.json({ ok: true });
    response.cookies.set('session', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      secure: process.env.NODE_ENV === 'production'
    });

    return response;
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Login failed' }, { status: 500 });
  }
}
