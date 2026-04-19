"use client"
import { ProfileForButton } from "@/features/profile/infrastructure/queries";
import { Avatar, AvatarFallback, AvatarImage, Button, ButtonProps } from "../ui";
import { useUser } from "@/app/providers";

interface ProfileButtonProps extends ButtonProps {
  showsName?: boolean;
  profile: ProfileForButton;
}
export function ProfileButton({
  showsName,
  profile,
  ...props
}: ProfileButtonProps) {
  const {user} = useUser();
  
  if (!profile) return null;

  return (
      <Button
        variant="default"
        size="icon-lg"
        className="flex rounded-full justify-center items-center gap-2"
        
        {...props}
      >

     <Avatar className={`${props.size === "icon-xs" ? "size-[25px]" : props.size === "icon-sm" ? "size-[30px]" : "size-[40px]"} `}>
      <AvatarImage src={profile?.avatarUrl ?? undefined} />
      <AvatarFallback className="text-lg bg-muted-background">
        {profile.displayName ? profile.displayName.charAt(0) : profile.username.charAt(0)}
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

