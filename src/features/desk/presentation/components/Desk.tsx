import { useDeskContext, useUser } from "@/app/providers";
import { EmptyState, LoadingState } from "@/components/states";
import { NotebookForDetail } from "@/features/notebook/infrastructure/queries";
import { Plus } from "lucide-react";
import {NotebookGridItem} from "./ui";
import { useDesk } from "../hooks/useDesk";

interface DeskProps {
  onNotebookClick: (notebook: NotebookForDetail) => void;
  useCase?: "default" | "user";
  selectedNotebookId?: string | null;
  onCreateNotebookClick: () => void;
  notebooks: NotebookForDetail[];
}
export function Desk({
  selectedNotebookId,
  onNotebookClick,
  useCase = "default",
  onCreateNotebookClick,
  notebooks,
}: DeskProps){
  const { currentDeskId} = useDeskContext();
  const {data: desk = null, isLoading} = useDesk(currentDeskId ?? null);
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
  if (notebooks.length === 0) {
    return (
      <div className="h-full flex-1 flex-col flex items-center justify-center">  
       
        <EmptyState
          message={
            useCase === "user"
              ? "This user's Desk is empty. When they post something it will appear here."
              : "No one has contributed to this Desk yet. Be the first to add something!"
          }
          variant="card"
          imageUrl="https://i.ibb.co/H87K7h0/desk.png"
          buttonVariant="tertiary"
          buttonIcon={<Plus strokeWidth={3}/>}
          onAction={onCreateNotebookClick}
          actionLabel="Add a Notebook"
        />
      </div>
    );
  }

  return (
    <>
      {notebooks.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] w-full gap-5 py-10 px-5 max-w-7xl mx-auto">
          {notebooks.map((n, index) => {
            return (
              <NotebookGridItem
                selected={n.id === selectedNotebookId}
                onClick={() => {
                  onNotebookClick(n);
                }}
                key={index}
                notebook={n}
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
            onAction={onCreateNotebookClick}
            actionLabel="Create something new!"
          />
        </div>
      )}
    </>
  );
};

export default Desk;