"use client";
import { useUser } from "@/app/providers";
import Image from "next/image";
import { SignOutButton } from "@/features/auth/presentation/components/ui";
export default function HomePageClient() {
    const {  profile, user } = useUser();
    console.log("profile", profile);
    console.log("username", profile.username);

  return (
  <div>
    <h1>Home Page</h1>
    <p>Welcome {profile.displayName}</p>
    <p>User Email: {user.email}</p>
    <p>Username: {profile.username}</p>
    <p>User ID: {profile.userId}</p>
    {profile.avatarUrl && (
      <Image
        src={profile.avatarUrl}
        alt={profile.username}
        width={100}
        height={100}
      />
    )}
        <SignOutButton />

   
  </div>);
}