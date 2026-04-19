"use client";
import { Column, type ColumnProps } from "./Column";
import { Button } from "@/components/ui";
import { Eye, Plus, Trash } from "lucide-react";
import { EmptyState, LoadingState } from "@/components/states";
import { useDeskContext, useModal, useUser } from "@/app/providers";
import { DESK_ITEM_MODAL_TYPES } from "@/features/deskItem/presentation/components/modals";
import type { DeskItemForDetail } from "@/features/deskItem/infrastructure/queries";
import { Desk } from "../Desk";
import { useDesks } from "../../hooks/useDesks";
import { DeskHeader } from "../ui/DeskHeader";
import { useDesk } from "../../hooks/useDesk";

interface DeskColumnProps extends ColumnProps {
  deskId: string | null;
  onDeskItemSelected: (item: DeskItemForDetail | null) => void;
}

export function DeskColumn ({
  onDeskItemSelected,
  ...props
}: DeskColumnProps) {
  const {currentDeskId}= useDeskContext();
  const {data: currentDesk = null, isLoading} = useDesk(currentDeskId ?? null);
  const { user } = useUser();
  const {openModal, closeModal} = useModal();
  const handleCreateDeskItem = (deskItem: DeskItemForDetail) => {
    closeModal();
    onDeskItemSelected(deskItem);
  };
  const handleCreateDeskItemClick = () => {
    if (!currentDesk) return;
    openModal(DESK_ITEM_MODAL_TYPES.CREATE, {
      deskId: currentDesk.id,
      onSuccess: handleCreateDeskItem,
      onCancel: closeModal
    });
  }
  if (isLoading) {
    return (
      <Column {...props}>
        <LoadingState />
      </Column>
    );
  }

  if (!currentDesk) {
    return (
      <Column title={""} {...props}>
        <div className="h-full flex-1 flex-col flex items-center justify-center">  
          <EmptyState title="" message="Select a Desk on the left to see it's contents" />
        </div>
      </Column>
    );
  }
 
  const headerRight = (
     
      <Button
        onClick={handleCreateDeskItemClick}
        size="icon"
        variant="primary"
      >
        <Plus strokeWidth={3}/>
      </Button>
  );

  return (
    <Column
      title={currentDesk.name}
      showsHeader={currentDesk != null}
      headerRight={headerRight}
      
      contentContainerClassName="h-full overflow-y-auto"
      {...props}
    >
        <DeskHeader deskItems={currentDesk.items} />

        <Desk
          onCreateDeskItemClick={handleCreateDeskItemClick}
          onSearchChange={() =>{}}
          onDeskItemClick={onDeskItemSelected}
        />
        
        {!currentDesk.isPublic && user.id !== currentDesk.creatorId && (
          <Button
            onClick={() => {}}
            style={{ marginBottom: 30 }}
            variant="destructive"
            className="w-full mb-4"
          >
            <Trash/> Leave Desk
          </Button>
        )}
    </Column>
  );
}

