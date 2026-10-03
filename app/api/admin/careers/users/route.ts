import { NextResponse } from 'next/server';
import { getCareersUsersCollection } from '@/lib/careers-auth';

export async function GET() {
  try {
    const users = await getCareersUsersCollection();
    const allUsers = await users.find({}).sort({ createdAt: -1 }).toArray();
    
    const serialized = allUsers.map(u => ({
      _id: u._id.toString(),
      email: u.email,
      fullName: u.fullName,
      phone: u.phone,
      resumeUrl: u.resumeUrl,
      resumeName: u.resumeName,
      lastLoginAt: u.lastLoginAt,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));
    
    return NextResponse.json(serialized);
  } catch (err) {
    console.error('Error fetching users:', err);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
