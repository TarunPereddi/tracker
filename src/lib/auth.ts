import { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface AuthUser {
  id: string;
  username: string;
  isAdmin: boolean;
  onboardingStatus: 'incomplete' | 'daytypes' | 'health' | 'finance' | 'guide' | 'completed';
}

export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    const decoded = verify(token, JWT_SECRET) as any;
    return { 
      id: decoded.userId, 
      username: decoded.username, 
      isAdmin: decoded.isAdmin || false,
      onboardingStatus: decoded.onboardingStatus || 'incomplete'
    };
  } catch (error) {
    return null;
  }
}

export async function requireAuth(req: NextRequest): Promise<AuthUser> {
  const token = req.cookies.get('session')?.value;
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  const user = await verifyToken(token);
  if (!user) {
    throw new Error('Invalid authentication token');
  }

  return user;
}

export function createToken(userId: string, username: string, isAdmin: boolean = false, onboardingStatus: string = 'incomplete'): string {
  const jwt = require('jsonwebtoken');
  return jwt.sign({ userId, username, isAdmin, onboardingStatus }, JWT_SECRET, { expiresIn: '30d' });
}
