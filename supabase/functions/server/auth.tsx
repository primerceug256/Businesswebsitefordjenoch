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
  
  // 1. Check if the email exists in the database
  const existingUserId = await kv.get(`user:email:${cleanEmail}`);
  
  if (existingUserId) {
    // We add "VERSION 2" so you can see if the code is actually updated
    throw new Error('VERSION 2: You already have an account with this email. Please Login instead.');
  }

  const userId = `user-${Date.now()}`;
  const now = new Date();
  const expires = new Date(now.getTime() + 6 * 60 * 60 * 1000); 

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

  // Save the user and the email reference
  await kv.set(`user:${userId}`, user);
  await kv.set(`user:email:${cleanEmail}`, userId);

  return user;
}

export async function login(email: string, password: string): Promise<User> {
  const cleanEmail = email.toLowerCase().trim();
  const userId = await kv.get(`user:email:${cleanEmail}`);
  
  if (!userId) {
    throw new Error('Account not found. Please Sign Up first.');
  }

  const user = await kv.get(`user:${userId}`) as User;
  if (!user || user.passwordHash !== hashPassword(password)) {
    throw new Error('Incorrect password.');
  }

  return user;
}