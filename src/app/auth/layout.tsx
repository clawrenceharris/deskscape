"use server"
import { getCurrentUser } from "@/features/auth/server";
import { redirect } from "next/navigation";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (user) {
    redirect("/home");
  }
  return (
    <main className="page-center">
      {children}
    </main>
   
  );
}

