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
      <Button
        {...props}
        variant="default"
        size="icon-lg"
        className={cn("flex p-1 bg-primary-foreground rounded-full justify-center items-center gap-2", `shadow-md shadow-black/20 dark:shadow-black ${props.size === "icon-xs" ? "size-[25px]" : props.size === "icon-sm" ? "size-[35px]" : "size-[50px]"}`, disabled ? "pointer-events-none": "", className)} 
      >

     <Avatar className="w-full h-full">
      <AvatarImage src={profile?.avatarUrl ?? undefined} />
      <AvatarFallback className={`${props.size === "icon-xs" ? "text-xs" : props.size === "icon-sm" ? "text-sm" : "text-lg"}  border`}>
        {profile.displayName ? profile.displayName.charAt(0) : profile.username?.charAt(0) ?? ""}
      </AvatarFallback>
     </Avatar>

      {showsName && (
        <p className="row ">
          {profile.userId === user.id
            ? "You"
            : profile?.displayName || profile.username}
         
        </p>
      )}
      </Button>
    
  );
};

