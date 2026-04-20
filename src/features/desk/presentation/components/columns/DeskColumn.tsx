"use client";
import { Column, type ColumnProps } from "./Column";
import { Button } from "@/components/ui";
import { Plus, Trash } from "lucide-react";
import { EmptyState, LoadingState } from "@/components/states";
import { useUser } from "@/app/providers";
import { NOTEBOOK_MODAL_TYPES } from "@/features/notebook/presentation/components/modals";
import type { NotebookForDetail } from "@/features/notebook/infrastructure/queries";
import { Desk } from "../Desk";
import { DeskHeader } from "../ui/DeskHeader";
import { useDesk } from "../../hooks/useDesk";
import { DESK_MODAL_TYPES } from "../modals";
import { DeskForCard } from "@/features/desk/infrastructure/queries";
import { useModals } from "@/hooks/useModals";

interface DeskColumnProps extends ColumnProps {
  deskId: string | null;
  onNotebookClick: (item: NotebookForDetail | null) => void;
  onDeskClick: (desk: DeskForCard) => void;
}

export function DeskColumn ({
  onNotebookClick,
  deskId,

  ...props
}: DeskColumnProps) {
  const {data: currentDesk = null, isLoading} = useDesk(deskId);
  const { user } = useUser();
  const { modals } = useModals();
 
  
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
          <EmptyState 
            title="Nothing to see here..." 
            variant="card"
            imageUrl="https://i.ibb.co/H87K7h0/desk.png"
            message="Select a Desk on the left to see its contents or create a new one" 
            buttonVariant="tertiary"
            buttonIcon={<Plus strokeWidth={3}/>}
            onAction={modals[DESK_MODAL_TYPES.CREATE].open}
            actionLabel="Create a new desk"
          />
        </div>
      </Column>
    );
  }
 
  const headerRight = (
     
      <Button
        onClick={() => modals[NOTEBOOK_MODAL_TYPES.CREATE].open(currentDesk.id)}
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
        <DeskHeader notebooks={currentDesk.notebooks} />

        <Desk
          onCreateNotebookClick={() => modals[NOTEBOOK_MODAL_TYPES.CREATE].open(currentDesk.id)}
          onSearchChange={() =>{}}
          onNotebookClick={onNotebookClick}
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

