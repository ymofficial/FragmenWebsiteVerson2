import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');
  
  // Simple protection
  if (secret !== 'fragmen_setup_2024') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();

    const existing = await User.findOne({ email: 'admin@fragmen.com' });
    if (existing) {
      return NextResponse.json({ message: 'Admin user already exists', email: 'admin@fragmen.com' });
    }

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@fragmen.com',
      password: 'admin123',
      role: 'admin',
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Admin user created!',
      email: admin.email,
      note: 'Login with: admin@fragmen.com / admin123'
    });
  } catch (error: any) {
    console.error('Setup Error:', error);
    return NextResponse.json({ 
      error: error.message, 
      stack: error.stack,
      cause: error.cause
    }, { status: 500 });
  }
}
