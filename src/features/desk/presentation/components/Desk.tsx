import { useDeskContext, useUser } from "@/app/providers";
import { EmptyState, LoadingState } from "@/components/states";
import { DeskItemForDetail } from "@/features/deskItem/infrastructure/queries";
import { Plus } from "lucide-react";
import {DeskItem, DeskHeader} from "./ui";
import { useDesk } from "../hooks/useDesk";
import { useDeskItemsByDeskId } from "@/features/deskItem/presentation/hooks";

interface DeskProps {
  onDeskItemClick: (deskItem: DeskItemForDetail) => void;
  useCase?: "default" | "user";
  selectedItemId?: string | null;
  onSearchChange: (searchTerm: string) => void;
  onCreateDeskItemClick: () => void;
}
export function Desk({
  selectedItemId,
  onDeskItemClick,
  useCase = "default",
  onCreateDeskItemClick,
}: DeskProps){
  const { currentDeskId} = useDeskContext();
  const {data: desk = null, isLoading} = useDesk(currentDeskId ?? null);
  const {data: deskItems = []} = useDeskItemsByDeskId(currentDeskId ?? null);
  const { user } = useUser();
  
  if (isLoading) {
    return (
      <div className="h-full flex-1 flex-col flex items-center justify-center">  
        <LoadingState />
      </div>
    );
  }
  if (!desk) {
    return (
      <EmptyState
      actionLabel="Refresh"
      onAction={() => {
        window.location.reload();
      }}
      
        message=
            "We couldn't find this Desk. Try refreshing the page or check back later."
      />
    );
  }

  if (!desk.isPublic && desk.creatorId !== user.id) {
    return (
      <EmptyState
        message={
          useCase === "user"
            ? "This user's Desk is hidden. You don't have permission to view it."
            : "This Desk is hidden. You don't have permission to view it."
        }
      />
    );
  }
  if (deskItems.length === 0) {
    return (
      <div className="h-full flex-1 flex-col flex items-center justify-center">  
       
        <EmptyState
          message={
            useCase === "user"
              ? "This user's Desk is empty. When they post something it will appear here."
              : "No one has contributed to this Desk yet. Be the first to add something!"
          }
          buttonVariant="tertiary"
          buttonIcon={<Plus strokeWidth={3}/>}
          onAction={onCreateDeskItemClick}
          actionLabel="Create something new!"
        />
      </div>
    );
  }

  return (
    <>
      {deskItems.length ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] w-full gap-5 pb-20 px-5 max-w-7xl mx-auto">
          {deskItems.map((item, index) => {
            return (
              <DeskItem
                selected={item.id === selectedItemId}
                onClick={() => {
                  onDeskItemClick(item);
                }}
                key={index}
                deskItem={item}
              />
            );
          })}
        </div>
      ) : (
        <div className="page-center">
          <EmptyState
            message="No items found"
            buttonVariant="primary"
            buttonIcon={<Plus strokeWidth={3}/>}
            onAction={onCreateDeskItemClick}
            actionLabel="Create something new!"
          />
        </div>
      )}
    </>
  );
};

export default Desk;