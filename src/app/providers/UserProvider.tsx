"use client";
import React, { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";
import { CreateProfileModal } from "@/features/profile/presentation/components";
import { UserProfileDto } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui";

const UserContext = createContext<{user: User, profile: UserProfileDto, setProfile: (profile: UserProfileDto | null) => void } | undefined>(undefined);

type UserProviderProps = {
  children: React.ReactNode;
  initialProfile: UserProfileDto | null;
  user: User | null;
}

export function UserProvider({ children, user, initialProfile }: UserProviderProps) {
const [profile, setProfile] = useState<UserProfileDto | null>(initialProfile ?? null);
  const pathname = usePathname();
  console.log("profile", profile);
const router = useRouter();
useEffect(() => {
  if(!user && !pathname.includes("auth")) {
    router.push("/auth/login");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProfile(null);
  }
}, [user, pathname, router]);
  useEffect(() => {
    if(user && pathname.includes("auth")) {
      router.push("/home"); 
    }
  }, [pathname, router, user]);
  

  if(!user && !pathname.includes("auth")){
    return (
    <div className="flex flex-col items-center justify-center h-screen bg-linear-to-br to-primary from-accent">
      <Loader2 className="animate-spin" />
    </div>)
  }
  else if(!user && pathname.includes("auth")) {
    return (<>{children}</>)
    
  }
  else if(!user){
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-linear-to-br to-primary from-accent">

      <p>You are not logged in. Please login to continue.</p>
      <Button variant="outline" onClick={() => router.push("/auth/login")}>
        Login
      </Button>
    </div>);
  }
  if(!profile) return (
    <div className="flex flex-col items-center justify-center h-screen bg-linear-to-br to-primary from-accent">
      <Dialog defaultOpen  open={!profile}>

     
      <CreateProfileModal onSuccess={(profile) => setProfile(profile)} user={user} />
       </Dialog>
    </div>
  );

  return (
    <UserContext.Provider
      value={{ profile, setProfile, user }}
    >
      {children}
    </UserContext.Provider>
  );
}


export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
}