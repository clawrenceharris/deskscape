"use client";
import { Column, type ColumnProps } from "./Column";
import { useDeskContext, useSchoolContext, useUser } from "@/app/providers";
import { Button, Card, CardDescription, CardTitle } from "@/components/ui";
import { Loader2, Plus, Search } from "lucide-react";
import { EmptyState, ErrorState, LoadingState } from "@/components/states";
import { useSearch } from "@/hooks";
import { DeskListItem } from "../ui";
import type { DeskForCard, SchoolDeskForDetail, MyDeskForDetail } from "@/features/desk/infrastructure/queries";
import { useUserDesks } from "../../hooks/useUserDesks";
import { useCreateMyDesk, useCreateSchoolDesk } from "../../hooks";
import { useModals } from "@/hooks/useModals";
import { SearchBar } from "@/components/shared";
import { useSchool } from "@/features/school/presentation/hooks";
import { useUserProfile } from "@/features/profile/presentation/hooks";
import { toast } from "sonner";

interface DesksColumnProps extends ColumnProps {
  onDeskClick: (desk: DeskForCard) => void;
}

export function DesksColumn ({
  onDeskClick,
  ...props
}: DesksColumnProps) {
  const { user } = useUser();
  const { currentDeskId } = useDeskContext();
  const { data: desks = [], isLoading, error } = useUserDesks(user.id);
  const { query, search: searchDesks, clearResults, results: filteredDesks, isLoading: isFilteredDesksLoading } = useSearch({
    data: desks,
    filter: (desk, q) => desk.name.toLowerCase().includes(q.toLowerCase()),
  });
  const { data: profile } = useUserProfile(user.id);
  const { modals: { "desk:create": createDeskModal }} = useModals();
  const { currentSchoolId } = useSchoolContext();
  const { data: school } = useSchool(currentSchoolId);
  const headerRight = (
    <div className="flex items-center gap-2">
      <SearchBar
        placeholder="Search desks"
        expandedWidthClassName="w-47"
        onChange={searchDesks}
        value={query}
      />
      <Button
        onClick={createDeskModal.open}
        size="icon"
        variant="primary"
      >
        <Plus strokeWidth={3}/>
      </Button>
    </div>
  );
  
  if(isFilteredDesksLoading) {
    return (
      <Column {...props}>
        <div className="h-full flex-1 flex items-center justify-center">
          <LoadingState />
        </div>
      </Column>
    );
  }
 
 
  if (isLoading) {
    return (
      <Column {...props}>
        <div className="h-full flex-1 flex items-center justify-center">
          <LoadingState />
        </div>
      </Column>
    );
  }
  if(error) {
    return (
      <Column {...props}>
        <div className="h-full flex-1 flex items-center justify-center">
          <ErrorState message={error.message} />
        </div>
      </Column>
    );
  }
  
  return (
    <Column headerRight={headerRight} title={"Desks"} {...props}>
       
       
      {query && filteredDesks.length === 0 ? ( 
        <div className="centered">
          <EmptyState 
            title="No desks found" 
            message="Your search didn't match any desks." 
            onAction={clearResults} 
            actionLabel="Clear search" 
            buttonVariant="outline"

          /> 
        </div>
      ) : ( 
        <div className="flex flex-col gap-4 overflow-y-auto pb-20 pt-8 px-3">
          {(!profile?.myDesk || !school?.schoolDesk) && (
            <PlaceholderDesks/>
          )}
          <SystemDesks 
            myDesk={profile?.myDesk} 
            schoolDesk={school?.schoolDesk} 
            onDeskClick={onDeskClick}
          />
          {(query ? filteredDesks : desks.filter(desk => desk.id !== profile?.myDesk?.desk.id && desk.id !== school?.schoolDesk?.desk.id)).map((desk) => (

              <DeskListItem
                onClick={onDeskClick}
                selected={desk.id === currentDeskId}
                key={desk.id}
                desk={desk}
              />

          ))}
        </div>
      )}

      <Button
        variant="outline"
        className="absolute border-primary hover:border-primary/80 bg-primary/10 hover:bg-primary/20 text-primary bottom-4 flex left-1/2 -translate-x-1/2 w-full max-w-[200px] mx-auto"
        onClick={() => {
          toast.info("Coming soon!");
        }}
      >
        <Search strokeWidth={2.5}/>
        Discover Desks
      </Button>
    </Column>
  );
}
type DeskPlaceholderProps = {
  title: string;
  actionLabel: string;
  onAction: () => void;
  description: string;
  isLoading: boolean;
}
type SystemDeskListProps = {
  myDesk?: MyDeskForDetail | null;
  schoolDesk?: SchoolDeskForDetail | null;
  onDeskClick: (desk: DeskForCard) => void;
}
function SystemDesks({myDesk, schoolDesk, onDeskClick}: SystemDeskListProps){
  const { currentDeskId } = useDeskContext();
  return (
    <>
      {myDesk && (
        <DeskListItem 
          desk={myDesk.desk} 
          onClick={onDeskClick} 
          selected={myDesk.desk.id === currentDeskId}
        />
      )}
      {schoolDesk && (
        <DeskListItem 
          desk={schoolDesk.desk} 
          onClick={onDeskClick} 
          selected={schoolDesk.desk.id === currentDeskId}

        />
      )}
    </>
  )
}
function PlaceholderDesks(){
  const { currentSchoolId } = useSchoolContext();
  const { user } = useUser();
  const { data: school, refetch: refetchSchool } = useSchool(currentSchoolId);
  const { data: profile, refetch: refetchProfile } = useUserProfile(user.id);
  const { createSchoolDesk, isLoading: isCreateSchoolDeskLoading } = useCreateSchoolDesk();
  const { createMyDesk, isLoading: isCreateMyDeskLoading } = useCreateMyDesk();
  function handleCreateSchoolDesk() {
    if(!school) return;
    createSchoolDesk(school.id);
    refetchSchool();
  }
  function handleCreateMyDesk() {
    createMyDesk(user.id);
    refetchProfile();
  }
  return (

    <>
      {!school?.schoolDesk && (
        <DeskPlaceholder 
          title="My School Desk" 
          description={`A Desk for ${school?.name ?? "this school"} has not been created yet. Create one to share resources with students in the same school.`} 
          actionLabel="Create My School Desk" 
          isLoading={isCreateSchoolDeskLoading}
          onAction={handleCreateSchoolDesk}
        /> 
      )}

      {!profile?.myDesk && (
      
        <DeskPlaceholder 
          title="My Desk" 
          description="'My Desk' is a personal desk just for you. Create one to organize your private resources." 
          actionLabel="Create My Desk" 
          onAction={handleCreateMyDesk} 
          isLoading={isCreateMyDeskLoading}
        /> 
      )}
      
    
    
    </>
  )
}
function DeskPlaceholder({title, description, actionLabel, onAction, isLoading}: DeskPlaceholderProps) {
  return (
    <Card
    aria-disabled={isLoading}
      className={`
        border-dashed border-2 border-secondary/30 hover:border-secondary/60
        relative
        flex flex-col justify-center
        bg-secondary/5 hover:bg-secondary/10
        w-full max-w-[400px] 
        outline-0
        mx-auto px-4
        h-auto
        min-h-[250px]
        transition-all duration-200
        box-shadow 
        cursor-pointer 
        rounded-xl
        group`}  
    >
       
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <CardDescription className="text-sm whitespace-normal max-w-[280px] leading-relaxed">
            {description}
          </CardDescription>
        <Button 
          variant="secondary" 
          className="mt-2 group-hover:bg-secondary/80 transition-colors" 
          disabled={isLoading}
          onClick={onAction}
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : actionLabel}
        </Button>
    </Card>
  );
}
