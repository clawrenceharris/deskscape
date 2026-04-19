"use client"
import { useUser } from "@/app/providers";
import { ProfileButton,ThemeButton } from ".";
import { useRouter } from "next/navigation";


export function Header() {
  const { profile } = useUser();
  const router = useRouter();
  const handleProfileClick = () => {
    router.push(`/home?r=pf&u=${profile.userId}`);
  };
  

  return (
      <header className="flex items-center gap-4">
        {profile && <ProfileButton onClick={handleProfileClick} profile={profile} showsName={false} />}
        <ThemeButton />
      </header>
  );
}