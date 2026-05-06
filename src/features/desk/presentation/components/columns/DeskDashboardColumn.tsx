"use client";
import { ProfileButton } from "@/components/shared";
import { AvatarGroup, AvatarGroupCount } from "@/components/ui";
import { useDesk } from "../../hooks/useDesk";
import {  LoadingState } from "@/components/states";
import { DeskNavbar } from "../ui/DeskNavbar";

type DeskDetailsColumnProps = {
    deskId: string | null;
}

export function DeskDashboardColumn({deskId}: DeskDetailsColumnProps) {
  const { data: desk, isLoading } = useDesk(deskId);
  
  if(isLoading) return <LoadingState />;
  if(!desk) return null;
  return (
    
    <div className="h-full flex flex-col flex-1">
      <div className="flex flex-[0.3] relative">
        <div style={{
          backgroundSize: "cover",
          backgroundImage: "url(https://i.ibb.co/N6q6BGpt/desk.png)"}} 
          className="absolute inset-0 w-full h-full" 
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/60 w-full h-full" />
        <div className="absolute text-white px-4 py-2 bottom-0 left-0 flex items-center justify-between w-full">
          
          <div className="flex items-center gap-2 bg-white rounded-full px-2 py-1 text-black">
            <div className="size-2 bg-green-500 rounded-full" />
            <p>{desk.members.length} online</p>
          </div>
        
          <AvatarGroup  className="flex items-center bg-white rounded-full p-1 text-black">
            {desk.members.slice(0, 3).map((member) => (
              <span key={member.profile.userId} onClick={e => e.stopPropagation()}>
                <ProfileButton tabIndex={-1} disabled size="icon-sm" profile={member.profile} />
              </span>
            ))}
            {desk.members.length > 3 &&
              <AvatarGroupCount className="text-foreground size-[20px] bg-secondary-foreground">
                +{desk.members.length - 3}
              </AvatarGroupCount>
            }
          </AvatarGroup>


        </div>
      </div>
      <DeskNavbar />

    </div>
  );
}
