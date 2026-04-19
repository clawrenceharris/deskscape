"use client";
import { Column, type ColumnProps } from "./Column";
import { useDeskContext, useModal, useUser } from "@/app/providers";
import { Button } from "@/components/ui";
import { Plus } from "lucide-react";
import { EmptyState, ErrorState, LoadingState } from "@/components/states";
import { useState } from "react";
import { useSearch } from "@/hooks";
import { DESK_MODAL_TYPES } from "../modals";
import { DeskListItem } from "../ui";
import type { DeskForCard, DeskForDetail } from "@/features/desk/infrastructure/queries";
import { useUserDesks } from "../../hooks/useUserDesks";
import { useDesk } from "../../hooks";

interface DesksColumnProps extends ColumnProps {
  onDeskClick: (desk: DeskForCard) => void;
}

export function DesksColumn ({
  onDeskClick,
  ...props
}: DesksColumnProps) {
  const { user, profile } = useUser();
  const { currentDeskId } = useDeskContext();
  const { data: currentDesk } = useDesk(currentDeskId ?? null);
  const {data: desks = [], isLoading, error} = useUserDesks(user.id);
  const [search] = useState("");
  const { results: filteredDesks, isLoading: isFilteredDesksLoading } = useSearch({
    data: desks,
    filter: (desk) => desk.name.toLowerCase().includes(search.toLowerCase()),
  });
  const {openModal, closeModal} = useModal();
  const handleCreateDesk = (desk: DeskForDetail) =>{
    closeModal();
    onDeskClick(desk);
  }
  const handleCreateDeskClick = () => {
    openModal(DESK_MODAL_TYPES.CREATE, { 
      userId: user.id, 
      currentSchoolId: profile.schoolId,
      onSuccess: handleCreateDesk,
      onCancel:closeModal
      
    });
  }
  const headerRight = (
    <Button
      onClick={handleCreateDeskClick}
      size="icon"
      variant="primary"
    >
      <Plus strokeWidth={3}/>
    </Button>
  );

  if(isFilteredDesksLoading) {
    return (
      <Column {...props}>
        <LoadingState />
      </Column>
    );
  }
 
 
  if (isLoading) {
    return (
      <Column {...props}>
        <LoadingState />
      </Column>
    );
  }
  if(error) {
    return (
      <Column {...props}>
        <ErrorState message={error.message} />
      </Column>
    );
  }
  if(desks.length === 0) {
    return (
      <Column headerRight={headerRight} title={"Desks"} {...props}>
        <div className="h-full flex-1 flex items-center justify-center">  
          <EmptyState message="You don't have any desks yet." />
        </div>
      </Column>
    );
  }
  return (
    <Column  headerRight={headerRight} title={"Desks"} {...props}>
       
        
          <div className="flex flex-col gap-4 overflow-y-auto pb-20 pt-8 px-3">
            {(search ? filteredDesks : desks).map((desk) => (
              
                <DeskListItem
                  onClick={() => {
                    onDeskClick(desk);
                  }}
                  
                  selected={desk.id === currentDesk?.id}
                  key={desk.id}
                  desk={desk}
                />
            ))}
          </div>
      
        <Button variant="primary" className="w-full absolute bottom-4 left-1/2 -translate-x-1/2 max-w-[200px]" onClick={() => {}}>
          Discover Desks
        </Button>
    </Column>
  );
}

