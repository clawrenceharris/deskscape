"use client";
import { useDeskContext, useUser } from "@/app/providers";
import { EmptyState, LoadingState } from "@/components/states";
import { NotebookForDetail } from "@/features/notebook/infrastructure/queries";
import { Plus } from "lucide-react";
import { NotebookGridItem } from "../ui";
import { DeskHeader } from "../ui/DeskHeader";
import { Column, ColumnProps } from "../columns";
import { DeskForDetail } from "@/features/desk/infrastructure/queries";
import { useModals } from "@/hooks/useModals";
import { Button } from "@/components/ui";
import { useNotebooksByDeskId } from "@/features/notebook/presentation/hooks";
import { useSearch } from "@/hooks";
import { SearchBar } from "@/components/shared";

interface NotebooksViewProps extends ColumnProps {
  onNotebookClick: (notebook: NotebookForDetail) => void;
  desk: DeskForDetail;
}
export function NotebooksView({
  onNotebookClick,
  desk,
  ...props
}: NotebooksViewProps){
  const { modals: { "notebook:create": createNotebookModal }} = useModals();
  const { user } = useUser();
  const { currentNotebookId } = useDeskContext();
  function filterNotebooks(
    notebook: NotebookForDetail,
    search: string
  ): boolean {
    return notebook.title.toLowerCase().includes(search.toLowerCase());
  } 
  const { data: notebooks = [], isLoading: isLoadingNotebooks } = useNotebooksByDeskId(desk.id);
  const {
    query,
    clearResults,
    search: searchNotebooks,
    results: filteredNotebooks,
  } = useSearch<NotebookForDetail>({
    filter: (notebook, q) => filterNotebooks(notebook, q),
    data: notebooks,
  });
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
  if(isLoadingNotebooks) {
    return (
      <Column 
        title="Notebooks" 
        headerRight={headerRight}
        {...props}
      >
        <div className="centered">
          <LoadingState />
        </div>
      </Column>
    );
  }
  if (!desk.isPublic && desk.creatorId !== user.id) {
    return (
      <EmptyState
        message="This Desk is hidden. You don't have permission to view it."
      />
    );
  }
  if (notebooks.length === 0) {
    return (
      <Column 
        title="Notebooks" 
        headerRight={headerRight}
        {...props}
      >
        <div className="centered">  
        
          <EmptyState
            message="This Desk doesn't have any notebooks yet. Check back later or add something yourself!"
            variant="card"
            imageUrl="https://i.ibb.co/H87K7h0/desk.png"
            buttonVariant="tertiary"
            buttonIcon={<Plus strokeWidth={3}/>}
            onAction={() => createNotebookModal.open(desk.id)}
            actionLabel="Add a Notebook"
          />
        </div>
      </Column>
    );
  }
  if(query && filteredNotebooks.length === 0) {
    return (
      <Column 
        title="Notebooks" 
        headerRight={headerRight}
        {...props}
      >
        <div className="centered">  
          <EmptyState 
                title="No notebooks found" 
                message="Your search didn't match any notebooks." 
                buttonVariant="outline"
                onAction={clearResults}
                actionLabel="Clear search"
          />
        </div>
      </Column>
    );
  }
  return (
    <Column 
      title="Notebooks" 
      contentContainerClassName="h-full overflow-y-auto" 
      headerRight={headerRight}
      {...props}
    >

      <DeskHeader notebooks={notebooks} />
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] w-full gap-5 py-10 px-5 max-w-7xl mx-auto">
        {notebooks.map((n, index) => {
          return (
            <NotebookGridItem
            selected={n.id === currentNotebookId}
              onClick={() => {
                onNotebookClick(n);
              }}
              key={index}
              notebook={n}
            />
          );
        })}
      </div>
      
    </Column>
  );
};

export default NotebooksView;