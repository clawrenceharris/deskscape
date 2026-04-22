"use client";
import { MotionProps } from "motion/react";
import { getShortDate } from "@/lib/utils/";
import { Avatar, AvatarImage, AvatarFallback, AvatarGroup, Card, CardFooter, CardHeader, AvatarGroupCount } from "@/components/ui";
import { DeskForCard } from "@/features/desk/infrastructure/queries";
import { ProfileButton } from "@/components/shared";

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
  const lastItem = desk.notebooks[desk.notebooks.length - 1];

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
          backgroundImage: "url(https://i.ibb.co/JcYbrj5/school-background2.png)",
        }}
        className="flex h-30 relative"
      >
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/60 w-full h-full" />
         

           <div className="absolute text-white  px-4 py-2 bottom-0 left-0 flex items-center justify-between w-full">

          
          <p>{desk.name}</p>
          <AvatarGroup  className="flex items-center">
            {desk.members.slice(0, 3).map((member) => (
              <ProfileButton disabled size="icon-sm" profile={member.profile} key={member.profile.userId}/>
            ))}
            {desk.members.length > 3 && <AvatarGroupCount className="text-foreground size-[20px] bg-secondary-foreground">+{desk.members.length - 3}</AvatarGroupCount>}
          </AvatarGroup>
         
        </div>
      </CardHeader>
      <CardFooter className="flex justify-between pb-4 w-full line-clamp-1 rounded-b-xl bg-primary-foreground">
       
        {
          lastItem ? (
              <p className="text-muted-foreground">{`${lastItem.creator.displayName || lastItem.creator.username} posted`}
              {" "}
              <span className="inline-block max-w-[150px] align-bottom truncate font-bold">
                {lastItem.title}
              </span>
              {" "}
              {`${getShortDate(new Date(lastItem.createdAt))}`}
              </p>
          )
            :
             ( <p className="text-muted-foreground">No activity yet</p>
            
            )
        }
        
      </CardFooter>
    </Card>
  );
};

