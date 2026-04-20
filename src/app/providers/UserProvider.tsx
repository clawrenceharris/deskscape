"use client";
import React from "react";
import { createContext, useContext } from "react";
import { usePathname, useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateProfileModal } from "@/features/profile/presentation/components/modals";
import { Dialog } from "@/components/ui";
import { ProfileForDetail } from "@/features/profile/infrastructure/queries";
import { useUserProfile } from "@/features/profile/presentation/hooks";
import { ErrorState } from "@/components/states";

type UserContextType = {
  user: User;
  profile: ProfileForDetail;
};
const UserContext = createContext<UserContextType | undefined>(undefined);

type UserProviderProps = {
  children: React.ReactNode;
  user: User | null;
};

export function UserProvider({
  children,
  user,
}: UserProviderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const {data: profile, error, isLoading: isLoadingProfile, refetch} = useUserProfile(user?.id ?? null);
  
  if (!user && !pathname.includes("auth")) {
    return (
      <div className="page-center">
        <Loader2 strokeWidth={2.5} size={40} className="animate-spin" />
      </div>
    );
  }
  if (!user && pathname.includes("auth")) {
    return <>{children}</>;
  }
  if (!user) {
    return (
      <div className="page-center">
        <p>You are not logged in. Please login to continue.</p>
        <Button variant="outline" onClick={() => router.push("/auth/login")}>
          Login
        </Button>
      </div>
    );
  }

  if (isLoadingProfile) {
    return (
      <div className="page-center">
        <Loader2 strokeWidth={2.5} size={40} className="animate-spin" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="page-center">
       <ErrorState
        variant="card"
        title="Error loading profile"
        message={error.message}
        onAction={() => router.refresh()}
        actionLabel="Refresh"
        onRetry={refetch}
       />
      </div>
    );
  }
  if (profile === null) {
    return (
      <div className="page-center">
        <Dialog defaultOpen open>
          <CreateProfileModal
            userId={user.id}
            onSuccess={() => {
              router.refresh();
              refetch();
            }}
          />
        </Dialog>
      </div>
    );
  }

  if (profile === undefined) {
    return (
      <div className="page-center">
        <Loader2 strokeWidth={2.5} size={40} className="animate-spin" />
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ profile, user }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
}
