import { NextRequest, NextResponse } from 'next/server';
import { getCareersUsersCollection, hashPassword, createCareersSession, setCareersSessionCookie } from '@/lib/careers-auth';
import { isIgnoredRequest } from '@/lib/visitors';

export async function POST(req: NextRequest) {
  try {
    if (isIgnoredRequest(req)) {
      return NextResponse.json({ error: 'Request blocked' }, { status: 403 });
    }
    
    const { email, password, fullName, phone } = await req.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }
    
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }
    
    const users = await getCareersUsersCollection();
    const existing = await users.findOne({ email: email.toLowerCase() });
    
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }
    
    const passwordHash = hashPassword(password);
    const result = await users.insertOne({
      email: email.toLowerCase(),
      passwordHash,
      fullName: fullName || '',
      phone: phone || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    const userAgent = req.headers.get('user-agent') || undefined;
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : undefined;
    
    const token = await createCareersSession(result.insertedId, userAgent, ip);
    await setCareersSessionCookie(token);
    
    const safeUser = {
      _id: result.insertedId.toString(),
      email: email.toLowerCase(),
      fullName: fullName || '',
      phone: phone || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return NextResponse.json({ user: safeUser });
  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}
