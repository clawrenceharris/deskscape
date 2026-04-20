"use client"
import { useUser } from "@/app/providers";
import { ProfileButton,ThemeButton } from ".";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function Header() {
  const { profile } = useUser();
  const router = useRouter();
  const handleProfileClick = () => {
    router.push(`/home?r=pf&u=${profile.userId}`);
  };
  

  return (
      <header className="flex items-center gap-4 justify-between px-6">
        <div className="flex items-center gap-4">
          {profile && (
            <ProfileButton 
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