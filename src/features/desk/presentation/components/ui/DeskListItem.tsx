"use client";
import { MotionProps } from "motion/react";
import { getShortDate } from "@/lib/utils/";
import { Avatar, AvatarImage, AvatarFallback, AvatarGroup, Card, CardFooter, CardHeader } from "@/components/ui";
import { DeskForCard } from "@/features/desk/infrastructure/queries";

interface DeskListItemProps extends MotionProps {
  onClick?: (desk: DeskForCard) => void;
  desk: DeskForCard;
  selected?: boolean;
}

export function DeskListItem ({
  selected,
  desk,
  onClick
}: DeskListItemProps) {
  const lastItem = desk.items[desk.items.length - 1];

  return (
    <Card
      
      onClick={() => onClick?.(desk)}
      className={`
        relative
        flex flex-col 
        bg-primary-foreground 
        w-full max-w-[400px] 
        outline-0
        mx-auto p-0 
        min-h-[150px]
        transition-all duration-90
        whitespace-nowrap 
        box-shadow 
        cursor-pointer 
        rounded-xl 
        ${selected ? "outline-2 outline-secondary" : ""}`}
    >
      <CardHeader
        style={{
          backgroundSize: "cover",
          backgroundImage: desk.imageUrl ? `url(${desk.imageUrl})` : "url(https://i.ibb.co/JcYbrj5/school-background2.png)",
        }}
        className="flex h-30 relative  "
      >
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/60 w-full h-full" />
         

           <div className="absolute text-white  px-4 py-2 bottom-0 left-0 flex items-center justify-between w-full">

          
          <p>{desk.name}</p>
          <p>{desk.items.length} items</p>
        </div>
      </CardHeader>
      <CardFooter className="flex justify-between pb-4 w-full rounded-b-xl bg-primary-foreground">
       
        {
          lastItem ? (
              <p className="text-muted-foreground">{`${lastItem.creator.displayName || lastItem.creator.username} posted ${lastItem.title} ${getShortDate(new Date(lastItem.createdAt))}`}</p>
          )
            :
             ( <p className="text-muted-foreground">No activity yet</p>
            
            )
        }
         <AvatarGroup>
          {desk.members.map((member) => (
            <Avatar key={member.profile.username}>
              <AvatarImage src={member.profile.avatarUrl ?? undefined} />
              <AvatarFallback>{member.profile.displayName?.charAt(0) || member.profile.username.charAt(0)}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
      </CardFooter>
    </Card>
  );
};

