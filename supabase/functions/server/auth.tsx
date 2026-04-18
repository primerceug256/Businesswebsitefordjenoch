import * as kv from "./kv_store.tsx";
import { createHash } from "node:crypto";

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  profilePhoto?: string;
  subscription?: {
    plan: string;
    expiresAt: string;
  };
  createdAt: string;
}

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

export async function signup(email: string, password: string, name: string): Promise<User> {
  // Check if user exists
  const existing = await kv.get(`user:email:${email}`);
  if (existing) {
    throw new Error('Email already registered');
  }

  const userId = `user-${Date.now()}`;
  const now = new Date();
  const expires = new Date(now.getTime() + 6 * 60 * 60 * 1000); // 6 hours free for new users

  const user: User = {
    id: userId,
    email,
    passwordHash: hashPassword(password),
    name,
    subscription: {
      plan: 'free',
      expiresAt: expires.toISOString(),
    },
    createdAt: now.toISOString(),
  };

  await kv.set(`user:${userId}`, user);
  await kv.set(`user:email:${email}`, userId);

  return user;
}

export async function login(email: string, password: string): Promise<User> {
  const userId = await kv.get(`user:email:${email}`);
  if (!userId) {
    throw new Error('Invalid email or password');
  }

  const user = await kv.get(`user:${userId}`) as User;
  if (!user || user.passwordHash !== hashPassword(password)) {
    throw new Error('Invalid email or password');
  }

  return user;
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<User> {
  const user = await kv.get(`user:${userId}`) as User;
  if (!user) {
    throw new Error('User not found');
  }

  const updatedUser = { ...user, ...updates };
  await kv.set(`user:${userId}`, updatedUser);

  return updatedUser;
}
