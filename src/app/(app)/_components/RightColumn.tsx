"use client";
import { useDeskContext, useLayout } from "@/app/providers";
import { Column, type ColumnProps } from "@/features/desk/presentation/components/columns";
import { NotebookView } from "@/features/notebook/presentation/components/views";
import { X } from "lucide-react";
import { EmptyState, LoadingState } from "@/components/states";
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
  const { data: currentNotebook = null, isLoading: notebookLoading } = useNotebook(currentNotebookId ?? null);

  if (notebookLoading) {
    return (
      <Column
        {...props}
        toggle={null}
      >
        <LoadingState />
      </Column>
    );
  }
  if (!currentNotebook) {
    return (
      <Column
        {...props}
        toggle={null}
      >
        <EmptyState variant="page" title="Not Found" message="This Notebook does not exist or has been deleted." />
      </Column>
    );
  }
  return (
    <Column
      {...props}
      title={currentNotebook.title}
      toggleIcon={ <X strokeWidth={3} /> }
    >
      <div className="relative min-h-0 flex-1 overflow-hidden">
       
          <NotebookView
            key={currentNotebook.id}
            onProfileClick={() => {}}
            notebookId={currentNotebook.id}
            materialIndex={materialIndex}
            onMaterialIndexChange={onMaterialIndexChange}
          />
        
      </div>
    </Column>
  );
}
