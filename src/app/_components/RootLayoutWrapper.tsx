"use server"

import { getCurrentUser } from "@/features/auth/server";
import { getCurrentProfile } from "@/features/profile/server/getCurrentProfile";
import { UserProvider } from "../providers";
import { redirect } from "next/navigation";
import { UserProfileDto } from "@/types/profile";

export default async function RootLayoutWrapper({ children }: { children: React.ReactNode }) {
  const profileEntity = await getCurrentProfile();
  const user = await getCurrentUser();
  const profileDto: UserProfileDto | null = profileEntity
  ? {
    userId: profileEntity.userId,
    username: profileEntity.username,
    displayName: profileEntity.displayName,
    avatarUrl: profileEntity.avatarUrl,
    avatarPath: profileEntity.avatarPath,
  }
  : null;
  
  return(
    <UserProvider user={user} initialProfile={profileDto}>
      <main className="flex justify-center bg-linear-to-br to-primary from-accent">
        {children}
      </main>
    </UserProvider>
  )

}

