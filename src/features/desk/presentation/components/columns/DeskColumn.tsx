"use client";
import { Column, type ColumnProps } from "./Column";
import { Plus } from "lucide-react";
import { EmptyState, LoadingState } from "@/components/states";
import { DeskSection, useDeskContext, useUser } from "@/app/providers";
import type { NotebookForDetail } from "@/features/notebook/infrastructure/queries";
import { useDesk } from "../../hooks/useDesk";
import { DeskForCard, DeskForDetail } from "@/features/desk/infrastructure/queries";
import { useModals } from "@/hooks/useModals";
import { useJoinOrLeaveDesk } from "../../hooks/useJoinOrLeaveDesk";
import { ChalkboardView, ComingSoonView, DeskHomeView, NotebooksView } from "../views";

interface DeskColumnProps extends ColumnProps {
  deskId: string | null;
  onNotebookClick: (notebook: NotebookForDetail) => void;
  onDeskClick: (desk: DeskForCard) => void;
}

export function DeskColumn ({
  onNotebookClick,
  deskId,

  ...props
}: DeskColumnProps) {
  const {data: desk, isLoading} = useDesk(deskId);
  const { user } = useUser();
  const { modals: { "desk:create": createDeskModal }} = useModals();
  const { currentSection } = useDeskContext();
  const { joinDesk, leaveDesk, isJoining, isLeaving } = useJoinOrLeaveDesk();

  function handleJoinSchoolDesk() {
    if(!deskId) return;
    joinDesk({deskId, userId: user.id, role: "CONTRIBUTOR"});
  }
  
  function handleLeaveSchoolDesk() {
    if(!deskId) return;
    leaveDesk({deskId, userId: user.id});
  }

  const renderDeskView = (desk: DeskForDetail) => {
   
    switch(currentSection) {
      
      case DeskSection.notebooks:
        return (
          <NotebooksView
            desk={desk}
            onNotebookClick={onNotebookClick}
            {...props}
          />
        );
      case DeskSection.chalkboard:
        return (
          <ChalkboardView
            desk={desk}
            {...props}
          />
        );
      case DeskSection.burningQuestions:
        return (
          <ComingSoonView
            title={"Burning Questions"}
            {...props}
          />
        );
      case DeskSection.studyRooms:
        return (
          <ComingSoonView
            title={"Study Rooms"}
            {...props}
          />
      );
      default:
        return (
          <DeskHomeView {...props} />
        )
    }
  };



  if (isLoading) {
    return (
      <Column {...props}>
        <LoadingState />
      </Column>
    );
  }

  if (!desk) {
    return (
      <Column {...props}>
        <div className="centered">  
          <EmptyState 
            title="Nothing to see here..." 
            variant="card"
            imageUrl="https://i.ibb.co/H87K7h0/desk.png"
            message="Select a Desk on the left to see its contents or create a new one" 
            buttonVariant="tertiary"
           
            buttonIcon={<Plus strokeWidth={3}/>}
            onAction={createDeskModal.open}
            actionLabel="Create a new desk"
          />
        </div>
      </Column>
    );
  }
  if(!desk.members.some(member => member.profile.userId === user.id) && desk.isPublic){
    return (
      <Column {...props}>
        <div className="h-full flex-1 flex items-center justify-center">
          <EmptyState 
            title="You are not a member of this desk" 
            variant="card" imageUrl="https://i.ibb.co/H87K7h0/desk.png" 
            message="You are not a member of this desk yet. Join to view its contents." 
            buttonVariant="tertiary" 
            onAction={handleJoinSchoolDesk} 
            actionLabel="Join desk" 
            isLoadingAction={isJoining}
            isLoadingSecondaryAction={isLeaving}
            secondaryActionLabel="Remove desk"
            onSecondaryAction={handleLeaveSchoolDesk}
          />
        </div>
      </Column>
    );
  }
   
  return renderDeskView(desk)
}


