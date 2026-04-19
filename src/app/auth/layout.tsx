"use server"
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getClaims()
  if (!error && data?.claims) {
    redirect('/home')
 }
  return (
    <main className="page-center">
      {children}
    </main>
   
  );
}

