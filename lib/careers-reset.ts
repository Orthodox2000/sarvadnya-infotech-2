import { getDb } from './mongodb-utils';

export interface PasswordReset {
  _id?: any;
  userId: any;
  email: string;
  otpHash: string;
  expiresAt: Date;
  attempts: number;
  used: boolean;
  createdAt: Date;
  ip?: string;
  userAgent?: string;
  resetTokenHash?: string;
  resetTokenExpiresAt?: Date;
}

export async function getPasswordResetsCollection() {
  const db = await getDb();
  return db.collection<PasswordReset>('careers_password_resets');
}