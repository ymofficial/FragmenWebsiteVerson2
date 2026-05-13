import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password)
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });

    await dbConnect();

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });

    const token = await signToken({ 
      userId: user._id.toString(), 
      role: user.role, 
      email: user.email,
      name: user.name 
    });

    const response = NextResponse.json({ 
      success: true, 
      user: { name: user.name, email: user.email, role: user.role } 
    });

    // Set authentication cookie for all users
    response.cookies.set({
      name: 'admin_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
