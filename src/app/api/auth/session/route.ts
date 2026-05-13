import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json({ isAdmin: false });
    }

    const payload = await verifyToken(token);
    
    if (payload) {
      return NextResponse.json({ 
        isLoggedIn: true, 
        isAdmin: payload.role === 'admin',
        user: payload 
      });
    }

    return NextResponse.json({ isLoggedIn: false });
  } catch (error) {
    return NextResponse.json({ isLoggedIn: false });
  }
}
