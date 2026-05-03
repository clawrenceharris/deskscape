"use client"
import { ProfileButton,ThemeButton } from ".";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUserProfile } from "@/features/profile/presentation/hooks";
import { useAuth } from "@/app/providers";

export function Header() {
  const { user } = useAuth();
  const { data: profile } = useUserProfile(user?.id ?? null);
  const router = useRouter();
  const handleProfileClick = () => {
    if(!profile) return;
    router.push(`/?r=pf&u=${profile.userId}`);
  };
  

  return (
      <header className="flex items-center gap-4 justify-between px-4">
        <div className="flex items-center gap-4">
          {profile && (
            <ProfileButton 
            className="p-1"
            onClick={handleProfileClick}
            profile={profile} 
            showsName={false} 
          />)}
          <ThemeButton /> 
        </div>

        <div className="flex items-center gap-2 justify-center bg-white/80 backdrop-blur-sm rounded-full size-[50px]">
          <Image src="/images/logo-secondary-2.png" alt="Desk Share Logo" width={40} height={40}/>
        </div>
      </header>
  );
}