import { supabase } from './supabase';
import type { AuthSession } from '@supabase/supabase-js';

export async function signIn(email: string, password: string) {
  if (!email || !password) {
    throw new Error('Please provide both email and password');
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      throw new Error('Invalid email or password');
    }
    throw new Error(error.message);
  }
}

export async function signUp(email: string, password: string) {
  if (!email || !password) {
    throw new Error('Please provide both email and password');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    if (error.message.includes('already registered')) {
      throw new Error('This email is already registered. Please try logging in instead.');
    }
    throw new Error(error.message);
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  return await supabase.auth.getSession();
}

export function onAuthStateChange(callback: (event: string, session: AuthSession | null) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
}