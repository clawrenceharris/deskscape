"use client"
import { ProfileForButton } from "@/features/profile/infrastructure/queries";
import { Avatar, AvatarFallback, AvatarImage, Button, ButtonProps } from "../ui";
import { useUser } from "@/app/providers";
import { cn } from "@/lib/utils";

interface ProfileButtonProps extends ButtonProps {
  showsName?: boolean;
  profile: ProfileForButton;
}
export function ProfileButton({
  showsName,
  profile,
  disabled,
  className,
  ...props
}: ProfileButtonProps) {
  const {user} = useUser();
  
  if (!profile) return null;
  console.log(profile);
  return (
    <div className="flex items-center gap-2">

    
      <Button
        {...props}
        variant="default"
        size="icon-lg"
        className={cn("flex bg-primary-foreground rounded-full justify-center items-center gap-2", `shadow-md shadow-black/20 ${props.size === "icon-xs" ? "size-[25px]" : props.size === "icon-sm" ? "size-[35px]" : "size-[50px]"}`, disabled ? "pointer-events-none": "", className)} 
      >

     <Avatar className="w-full h-full">
      <AvatarImage src={profile?.avatarUrl ?? undefined} />
      <AvatarFallback className={`${props.size === "icon-xs" ? "text-xs" : props.size === "icon-sm" ? "text-sm" : "text-lg"}  border`}>
        {profile.displayName
          ? (() => {
              const names = profile.displayName.trim().split(/\s+/);
              if (names.length === 1) {
                return names[0][0]?.toUpperCase() ?? "";
              } else {
                const first = names[0][0]?.toUpperCase() ?? "";
                const last = names[names.length - 1][0]?.toUpperCase() ?? "";
                return first + last;
              }
            })()
          : profile.username?.charAt(0).toUpperCase() ?? ""}
   
      </AvatarFallback>
     </Avatar>

     
      </Button>
      {showsName && (
        <p className="row ">
          {profile.userId === user.id
            ? "You"
            : profile?.displayName || profile.username}
         
        </p>
      )}
    </div>
  );
};

