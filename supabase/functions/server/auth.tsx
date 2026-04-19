import * as kv from "./kv_store.tsx";
import { createHash } from "node:crypto";

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
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
  // 1. CHECK IF EMAIL EXISTS
  const existingUserId = await kv.get(`user:email:${email.toLowerCase()}`);
  
  if (existingUserId) {
    // This exact message will be sent to the frontend
    throw new Error('Already have an account with this email. Please login.');
  }

  // 2. CREATE NEW USER
  const userId = `user-${Date.now()}`;
  const now = new Date();
  const expires = new Date(now.getTime() + 6 * 60 * 60 * 1000); // 6 hours free

  const user: User = {
    id: userId,
    email: email.toLowerCase(),
    passwordHash: hashPassword(password),
    name,
    subscription: {
      plan: 'free',
      expiresAt: expires.toISOString(),
    },
    createdAt: now.toISOString(),
  };

  // Save the user data and the email-to-id mapping
  await kv.set(`user:${userId}`, user);
  await kv.set(`user:email:${email.toLowerCase()}`, userId);

  return user;
}

export async function login(email: string, password: string): Promise<User> {
  const userId = await kv.get(`user:email:${email.toLowerCase()}`);
  if (!userId) {
    throw new Error('No account found with this email.');
  }

  const user = await kv.get(`user:${userId}`) as User;
  if (!user || user.passwordHash !== hashPassword(password)) {
    throw new Error('Incorrect password.');
  }

  return user;
}