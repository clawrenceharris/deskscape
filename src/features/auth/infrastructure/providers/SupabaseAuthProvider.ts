import type { SupabaseClient } from "@supabase/supabase-js";
import { User } from "@supabase/supabase-js";

import { AuthProvider } from "../../domain/services/AuthProvider";

function appOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (explicit) return explicit;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export class SupabaseAuthProvider implements AuthProvider {
  constructor(private readonly client: SupabaseClient) {}

  async getUserId(): Promise<string | null> {
    const {
      data: { user },
      error,
    } = await this.client.auth.getUser();
    if (error) return null;
    if (!user) return null;
    return user.id;
  }
  
  async getUser(): Promise<User | null> {
    const {
      data: { user },
      error,
    } = await this.client.auth.getUser();
    if (error) throw error;
    
    return user;
  }
  async signInWithEmail(email: string, password: string): Promise<void> {
    const { error } = await this.client.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error
  }

  async signUp(email: string, password: string): Promise<User> {
    const {
      data: { user },
      error,
    } = await this.client.auth.signUp({
      email,
      password
    });
    if (error) throw error;
    if (!user) throw new Error("User not found");
    return user;
  }

  async signOut(): Promise<void> {
    await this.client.auth.signOut();
  }

  async requestPasswordReset(email: string): Promise<void> {
    await this.client.auth.resetPasswordForEmail(email, {
      redirectTo: `${appOrigin()}/auth/update-password`,
    });
  }

  async resetPassword(newPassword: string, token: string): Promise<void> {
    void token;
    const { error } = await this.client.auth.updateUser({
      password: newPassword,
    });
    if (error) throw new Error(error.message);
  }
}
