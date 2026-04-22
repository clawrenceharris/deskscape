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
import { SearchBar } from "@/components/shared";
import { useSearch } from "@/hooks";
import { useCallback, useState } from "react";
import { useNotebooksByDeskId } from "@/features/notebook/presentation/hooks/useNotebooks";

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
  const {data: desk, isLoading} = useDesk(deskId);
  const { user, profile } = useUser();
  const { modals: { "desk:create": createDeskModal }} = useModals();
  const { modals: { "notebook:create": createNotebookModal }} = useModals();


  function filterNotebooks(
    notebook: NotebookForDetail,
    search: string
  ): boolean {
    return notebook.title.toLowerCase().includes(search.toLowerCase());
  } 
  const {data: notebooks = []} = useNotebooksByDeskId(deskId);

  const {
    query,
    clearResults,
    search: searchNotebooks,
    results: filteredNotebooks,
  } = useSearch<NotebookForDetail>({
    filter: (notebook, q) => filterNotebooks(notebook, q),
    data: notebooks,
  });
  const isMyDesk = desk && desk.id === profile.myDesk?.desk.id;
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
        <div className="h-full flex-1 flex-col flex items-center justify-center">  
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
 
  const headerRight = (
     <div className="flex items-center gap-2">
        <SearchBar
          value={query}
          expandedWidthClassName="w-65"
          placeholder="Search notebooks"
          onChange={searchNotebooks}
          
        />
        <Button
          onClick={() => createNotebookModal.open(desk.id)}
          size="icon"
          variant="primary"
        >
          <Plus strokeWidth={3}/>
        </Button>
      </div>
  );

  return (
    <Column
      title={isMyDesk ? "Your Desk" : desk.name}
      showsHeader={desk != null}
      headerRight={headerRight}
      contentContainerClassName="h-full overflow-y-auto"
      {...props}
    >
        <DeskHeader notebooks={notebooks} />

        {query && filteredNotebooks.length === 0 ?  
          <div className="centered">
            <EmptyState 
              title="No notebooks found" 
              message="Your search didn't match any notebooks." 
              buttonVariant="outline"
              onAction={clearResults}
              actionLabel="Clear search"
            />
          </div>
          : 
          <Desk
            notebooks={query ? filteredNotebooks : notebooks}
            onCreateNotebookClick={() => createNotebookModal.open(desk.id)}
            onNotebookClick={onNotebookClick}
          />}
        
        {!desk.isPublic && user.id !== desk.creatorId && (
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

