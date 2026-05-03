import { ProfileButton } from "@/components/shared";
import { AvatarGroup, AvatarGroupCount } from "@/components/ui";
import { useDesk } from "../../hooks/useDesk";
import {  LoadingState } from "@/components/states";
import { useState } from "react";
import { DeskHeader } from "../ui";
import { useNotebooksByDeskId } from "@/features/notebook/presentation/hooks";
import { Tab, useDeskContext } from "@/app/providers/DeskProvider";
type DeskDetailsColumnProps = {
    deskId: string;
}

export function DeskDetailsColumn({deskId}: DeskDetailsColumnProps) {
    const { data: desk, isLoading } = useDesk(deskId);
    const { data: notebooks = []} = useNotebooksByDeskId(deskId);
    const { currentTab, setCurrentTab } = useDeskContext();
    function handleTabClick(tab: Tab) {
        setCurrentTab(tab);
    }
    if(isLoading) return <LoadingState />;
    if(!desk) return null;
  return (
    <div>

    
      <div
          style={{
            backgroundSize: "cover",
            backgroundImage: "url(https://i.ibb.co/JcYbrj5/school-background2.png)",
          }}
          className="flex h-40 relative "
        >
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/60 w-full h-full" />
          <div className="absolute text-white px-4 py-2 bottom-0 left-0 flex items-center justify-between w-full">
            <p>{desk.name}</p>
            <AvatarGroup  className="flex items-center">
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
        <DeskHeader notebooks={notebooks} />
        <div className="flex flex-col gap-2 p-3">
          <button type="button" className={`flex-1 flex p-3 bg-muted rounded-lg text-muted-foreground hover:text-foreground/50 hover:bg-muted transition-colors ${currentTab === "notebooks" ? "text-primary bg-primary/10 hover:bg-primary/15 hover:text-primary/80" : ""}`} onClick={() => handleTabClick("notebooks")}>
          Notebooks
        </button>
        <button type="button" className={`flex-1 flex p-3 bg-muted/60 rounded-lg text-muted-foreground hover:text-foreground/50 hover:bg-muted transition-colors ${currentTab === "chalkboards" ? "text-primary bg-primary/10 hover:bg-primary/15 hover:text-primary/80" : ""}`} onClick={() => handleTabClick("chalkboards")}>
          Chalkboard
        </button>
        <button type="button" className={`flex-1 flex p-3 bg-muted/60 rounded-lg text-muted-foreground hover:text-foreground/50 hover:bg-muted transition-colors ${currentTab === "members" ? "text-primary bg-primary/10 hover:bg-primary/15 hover:text-primary/80" : ""}`} onClick={() => handleTabClick("members")}>
          Members
        </button>
        
        
      </div>
    </div>
  );
}
/**
 * 
 *  <div className="centered">
            <EmptyState
              title="No notebooks found" 
              message="Your search didn't match any notebooks." 
              buttonVariant="outline"
              onAction={clearResults}
              actionLabel="Clear search"
            />
          </div>
 */