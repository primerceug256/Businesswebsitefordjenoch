import * as kv from "./kv_store.tsx";
import { createHash } from "node:crypto";

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  subscription?: { plan: string; expiresAt: string };
  createdAt: string;
}

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

export async function signup(email: string, password: string, name: string): Promise<User> {
  const cleanEmail = email.toLowerCase().trim();
  
  // 1. CHECK IF EMAIL ALREADY EXISTS
  const existingUserId = await kv.get(`user:email:${cleanEmail}`);
  if (existingUserId) {
    throw new Error('Email is already registered. Please try logging in instead.');
  }

  // 2. CREATE NEW USER
  const userId = `user-${Date.now()}`;
  const now = new Date();
  const expires = new Date(now.getTime() + 6 * 60 * 60 * 1000); // 6 hours free

  const user: User = {
    id: userId,
    email: cleanEmail,
    passwordHash: hashPassword(password),
    name,
    subscription: {
      plan: 'free',
      expiresAt: expires.toISOString(),
    },
    createdAt: now.toISOString(),
  };

  // Save user data and email lookup
  await kv.set(`user:${userId}`, user);
  await kv.set(`user:email:${cleanEmail}`, userId);

  return user;
}

export async function login(email: string, password: string): Promise<User> {
  const cleanEmail = email.toLowerCase().trim();
  const userId = await kv.get(`user:email:${cleanEmail}`);
  
  if (!userId) {
    throw new Error('No account found with this email.');
  }

  const user = await kv.get(`user:${userId}`) as User;
  if (!user || user.passwordHash !== hashPassword(password)) {
    throw new Error('Incorrect password.');
  }

  return user;
}