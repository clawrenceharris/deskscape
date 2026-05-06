"use client";
import { useDeskContext, useLayout } from "@/app/providers";
import { useMediaQuery } from "@/hooks";
import { DesksColumn, DeskColumn } from "@/features/desk/presentation/components/columns";
import { NotebookColumn } from "./_components";
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
    materialIndex,
    setMaterialIndex,
    handleNotebookClick,
    handleDeskClick,
    handleDesksOpen,
    handleDeskExit,
    handleNotebookExit
  } = useHomeNavigation();
  const { openLeftLayout, openExpandedLayout } = useLayout();
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
  function handleDeskCollapse() {
    if(isMobile) {
      openLeftLayout();
      return;
    }
    openExpandedLayout();
  }

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
          onCollapse={handleDesksCollapse}
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
            onCollapse={handleDeskCollapse}
            onNotebookClick={handleNotebookClick}
            columnType={"center"}
            onDeskClick={handleDeskClick}
        />
      </AnimatePresence>
      <AnimatePresence mode="popLayout">
        {isRightMode && 
          <NotebookColumn 
            className="border rounded-l-none border-l-0"
            materialIndex={materialIndex}
            onMaterialIndexChange={setMaterialIndex}
            closedWidth={0}
            onCollapse={handleNotebookExit}
            openWidth={isMobile ? "100%" : 450}
            
            columnType={"right"}
          />}
      </AnimatePresence>
    
       
    </main>
    </div>
  );
};