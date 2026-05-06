"use client";
import {  Card, CardHeader, CardFooter, CardTitle } from "@/components/ui";
import { getShortDate } from "@/lib/utils/fomatDate";
import type { NotebookForCard } from "@/features/notebook/infrastructure/queries";
import { cn } from "@/lib/utils";
import { FilePreviewer } from "@/components/shared";

interface NotebookGridItemProps {
  notebook: NotebookForCard;
  onClick: () => void;
  selected?: boolean;
  className?: string;
}
export function NotebookGridItem({
  onClick,
  selected,
  notebook,
  className,
}: NotebookGridItemProps) {
  return (
    <Card
    onClick={onClick}
   
    className={cn("flex bg-primary-foreground h-[300px] flex-col position-relative p-0 w-full max-w-[300px] md:max-w-[370px] mx-auto transition-all duration-200 whitespace-nowrap box-shadow cursor-pointer rounded-xl", selected && "outline-2 outline-secondary/50", className)}
  >
    <CardHeader className="flex h-[250px] relative text-white">
      <FilePreviewer 
        enableNavigation={false}
        className="absolute inset-0 size-full object-cover" 
        materials={notebook.materials}
        enableExpand={false}
      />
      <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/80 w-full h-full" />
       

         <div className="absolute px-4 py-2 bottom-0 left-0 flex items-center justify-between w-full">

        
        <CardTitle className="text-sm">{notebook.title}</CardTitle>
        <span className="text-muted-foreground text-xs">{`${getShortDate(new Date(notebook.updatedAt))}`}</span>
      </div>
    </CardHeader>
    <CardFooter className="flex justify-between pb-4 px-3 w-full rounded-b-xl bg-primary-foreground">
      {
        notebook.materials.length > 0 ? (
            <p className="text-muted-foreground">
              {`${notebook.creator.displayName || notebook.creator.username} posted `}
              <span className="inline-block max-w-[150px] w-full align-bottom truncate font-bold">
                {notebook.materials[0].title}
              </span>
         
             {notebook.materials.length > 1 ? `and ${notebook.materials.length - 1} more` : ""} 
            </p>
          ) :
          ( <p className="text-muted-foreground">No materials yet</p> )
      }
    </CardFooter>
  </Card>
  );
}
