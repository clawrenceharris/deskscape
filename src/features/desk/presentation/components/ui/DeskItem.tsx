import {  Card, CardHeader, CardFooter, CardTitle } from "@/components/ui";
import { getShortDate } from "@/lib/utils/fomatDate";
import type { DeskItemForCard } from "@/features/deskItem/infrastructure/queries";
import { cn } from "@/lib/utils";
import { FilePreviewer } from "@/components/shared";

interface DeskItemProps {
  deskItem: DeskItemForCard;
  onClick: () => void;
  selected?: boolean;
  className?: string;
}
export function DeskItem({
  onClick,
  selected,
  deskItem,
  className,
}: DeskItemProps) {

  return (
    <Card
    onClick={onClick}
    style={{
      border: selected ? "1.4px solid var(--primary)" : "none",
    }}
    className={cn("flex bg-primary-foreground h-[300px] flex-col position-relative p-0 w-full max-w-[300px] md:max-w-[370px] mx-auto transition-all duration-200 whitespace-nowrap box-shadow cursor-pointer rounded-xl", className)}
  >
    <CardHeader className="flex h-[250px] relative text-white">
      <FilePreviewer className="absolute inset-0 size-full object-cover" visible filename={deskItem.materials[0]?.title ?? ""} url={deskItem.materials[0]?.url ?? ""} />
      <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/80 w-full h-full" />
       

         <div className="absolute px-4 py-2 bottom-0 left-0 flex items-center justify-between w-full">

        
        <CardTitle className="text-sm">{deskItem.title}</CardTitle>
        <span className="text-muted-foreground text-xs">{`${getShortDate(new Date(deskItem.updatedAt))}`}</span>
      </div>
    </CardHeader>
    <CardFooter className="flex justify-between pb-4 px-3 w-full rounded-b-xl bg-primary-foreground">
      {
        deskItem.materials.length > 0 ? (
            <p className="text-muted-foreground">
              {`${deskItem.creator.displayName || deskItem.creator.username} added `}
              <span className="inline-block max-w-[120px] align-bottom truncate font-bold">
                {deskItem.materials[0].title}
              </span>
         
             {deskItem.materials.length > 1 ? `and ${deskItem.materials.length - 1} others` : ""} 
            </p>
          ) :
          ( <p className="text-muted-foreground">No materials yet</p> )
      }
    </CardFooter>
  </Card>
  );
}
