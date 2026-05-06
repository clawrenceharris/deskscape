"use client";
import { useDeskContext } from "@/app/providers";
import { Column, type ColumnProps } from "@/features/desk/presentation/components/columns";
import { NotebookView } from "@/features/notebook/presentation/components/views";
import { X } from "lucide-react";
import { EmptyState, ErrorState, LoadingState } from "@/components/states";
import { useNotebook } from "@/features/notebook/presentation/hooks";

type RightColumnProps = ColumnProps & {
  materialIndex: number;
  onMaterialIndexChange: (index: number) => void;
};

export function NotebookColumn({
  materialIndex,
  onMaterialIndexChange,
  ...props
}: RightColumnProps) {
  const { currentNotebookId } = useDeskContext();
  const { data: currentNotebook = null, error, isLoading: notebookLoading } = useNotebook(currentNotebookId ?? null);
  
  if(notebookLoading) {
    return (
      <Column
        {...props}
        toggleIcon={ <X strokeWidth={3} /> }
      >
        <div className="centered">
          <LoadingState />
        </div>
      </Column>
    );
  }
  if(error) {
    return (
      <Column
        {...props}
        toggleIcon={ <X strokeWidth={3} /> }
      >
        <div className="centered">
          <ErrorState message={error.message} />
        </div>
      </Column>
    );
  }
  if(!currentNotebook) {
    return (
      <Column
        {...props}
        toggleIcon={ <X strokeWidth={3} /> }
      >
        <div className="centered">
          <EmptyState variant="page" title="Not Found" message="This Notebook does not exist or has been deleted." />
        </div>
      </Column>
    );
  }
  return (
    <Column
      {...props}
      toggleIcon={ <X strokeWidth={3} /> }
    >
      <div className="relative min-h-0 flex-1 overflow-hidden">
       
          <NotebookView
            notebook={currentNotebook}
            onProfileClick={() => {}}
            materialIndex={materialIndex}
            onMaterialIndexChange={onMaterialIndexChange}
          />
        
      </div>
    </Column>
  );
}
