"use server"

import { getCurrentUser } from "@/features/auth/server";
import { UserProvider } from "../providers";

export default async function RootLayoutWrapper({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  
  return(
    <UserProvider user={user}>
        {children}
    </UserProvider>
  )


}

