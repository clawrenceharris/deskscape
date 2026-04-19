"use server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { User } from "@supabase/supabase-js";

export async function getCurrentUser(): Promise<User | null> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) return null;
    return data.user;
}