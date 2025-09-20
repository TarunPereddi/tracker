import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('session')?.value;
    
    if (!token) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    return NextResponse.json({ ok: true, user });
  } catch (error) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
}
