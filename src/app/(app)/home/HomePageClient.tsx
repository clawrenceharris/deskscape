"use client";
import { useDeskContext, useLayout } from "@/app/providers";
import { useMediaQuery } from "@/hooks";
import { DesksColumn, DeskColumn } from "@/features/desk/presentation/components/columns";
import { RightColumn } from "./_components";
import { AnimatePresence } from "motion/react";
import { useDesk } from "@/features/desk/presentation/hooks";
import { useHomeNavigation } from "./_providers/HomeNavigationProvider";

export function HomePageClient() {
  const {
    currentDeskId,
  } = useDeskContext();
  const { isColumnOpen } = useLayout();
  const { data: currentDesk = null } = useDesk(currentDeskId ?? null);
  const {
    currentProfileUserId,
    profileOrigin,
    materialIndex,
    setMaterialIndex,
    handleNotebookClick,
    handleDeskClick,
    handleDesksOpen,
    handleProfileOpen,
    handleProfileExit,
    handleDeskExit,
  } = useHomeNavigation();

  const isMobile = useMediaQuery("(max-width: 768px)", {
    initializeWithValue: false,
  });

  
  return (
    <>
    <AnimatePresence mode="popLayout">
      {isColumnOpen("left") && isMobile && 
        <DesksColumn
          openWidth={"100%"}
          closedWidth={0}
          collapsable={false}
          onOpen={handleDesksOpen}
          onDeskClick={handleDeskClick}
          columnType={"left"}
        /> }
      {!isMobile && 
      
        <DesksColumn
          openWidth={400}
          closedWidth={55}
          collapsable={true}
          onOpen={handleDesksOpen}
          onDeskClick={handleDeskClick}
          columnType={"left"}
        /> }
      </AnimatePresence>
      <AnimatePresence mode="popLayout">
        {isColumnOpen("center") && 
          <DeskColumn
          
          openWidth={"100%"}
          closedWidth={isMobile ? 0 : 55}
          deskId={currentDesk?.id ?? null}
          onCollapse={handleDeskExit}
          onNotebookClick={handleNotebookClick}
          columnType={"center"}
          onDeskClick={handleDeskClick}
        /> }
      </AnimatePresence>
      <AnimatePresence mode="popLayout">
        {isColumnOpen("right") && 
          <RightColumn  
            profileUserId={currentProfileUserId}
            profileOrigin={profileOrigin}
            onProfileOpen={handleProfileOpen}
            onProfileExit={handleProfileExit}
            materialIndex={materialIndex}
            onMaterialIndexChange={setMaterialIndex}
            closedWidth={0}
            openWidth={isMobile ? "100%" : 450}
            
            columnType={"right"}
          />}
      </AnimatePresence>
    
       
    </>
  );
};