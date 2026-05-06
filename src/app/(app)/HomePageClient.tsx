"use client";
import { useDeskContext, useLayout } from "@/app/providers";
import { useMediaQuery } from "@/hooks";
import { DesksColumn, DeskColumn } from "@/features/desk/presentation/components/columns";
import { RightColumn } from "./_components";
import { AnimatePresence } from "motion/react";
import { useDesk } from "@/features/desk/presentation/hooks";
import { useHomeNavigation } from "@/app/providers";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { Header } from "@/components/shared";

export function HomePageClient() {
  const {
    currentDeskId,
  } = useDeskContext();
  const { isColumnOpen } = useLayout();
  const { data: currentDesk = null } = useDesk(currentDeskId ?? null);
  const isRightMode = useMemo(() => isColumnOpen("right"), [isColumnOpen]);
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
  function handleDesksCollapse(e: React.MouseEvent<HTMLButtonElement>) {
   
    if(currentDeskId) {
      e.preventDefault();
      handleDeskExit();
      return;
    }
    handleDeskExit();
  }
  const isMobile = useMediaQuery("(max-width: 768px)", {
    initializeWithValue: false,
  });

  
  return (
    <div className="page"> 
      <Header/>
      <main>
    <AnimatePresence mode="popLayout">
      {isColumnOpen("left") && isMobile && 
        <DesksColumn
          className="border rounded-r-none"
          openWidth={"100%"}
          closedWidth={0}
          collapsable={false}
          onOpen={handleDesksOpen}
          onDeskClick={handleDeskClick}
          columnType={"left"}
        /> }
      {!isMobile && 
      
        <DesksColumn
          className="border rounded-r-none"
          openWidth={400}
          closedWidth={55}
          collapsable={true}
          onOpen={handleDesksOpen}
          onCollapse={handleDesksCollapse}
          onDeskClick={handleDeskClick}
          columnType={"left"}
        /> }
      </AnimatePresence>
      <AnimatePresence mode="popLayout">
         
          <DeskColumn
          className={cn("border rounded-l-none border-l-0", isRightMode ? "rounded-none" : "")}

          openWidth={"100%"}
          closedWidth={isMobile ? 0 : 55}
          deskId={currentDesk?.id ?? null}
          onCollapse={handleDeskExit}
          onNotebookClick={handleNotebookClick}
          columnType={"center"}
          onDeskClick={handleDeskClick}
        />
      </AnimatePresence>
      <AnimatePresence mode="popLayout">
        {isRightMode && 
          <RightColumn 
            className="border rounded-l-none border-l-0"
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
    
       
    </main>
    </div>
  );
};