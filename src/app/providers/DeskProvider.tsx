"use client";
import { createContext, useContext, useState } from "react";

type DeskContextType = {
  setCurrentDeskId: (deskId: string | null) => void;
  setCurrentNotebookId: (notebookId: string | null) => void;
  currentDeskId: string | null;
  currentNotebookId: string | null;
  currentTab: "notebooks" | "chalkboards" | "members";
  setCurrentTab: (tab: "notebooks" | "chalkboards" | "members") => void;
}

type DeskProviderProps = {
  children: React.ReactNode;

}
const DeskContext = createContext<DeskContextType | undefined>(undefined);

export function DeskProvider({ children }: DeskProviderProps) {
  const [currentDeskId, setCurrentDeskId] = useState<string | null>(null);
  const [currentNotebookId, setCurrentNotebookId] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<"notebooks" | "chalkboards" | "members">("notebooks");
  return <DeskContext.Provider value={{ 
    setCurrentNotebookId,
    currentNotebookId,
    currentDeskId,
    setCurrentDeskId,
    currentTab,
    setCurrentTab,
    }}>
      {children}
    </DeskContext.Provider>;
}

export function useDeskContext() {
  const context = useContext(DeskContext);
  if (!context) throw new Error("useDesk must be used within a DeskProvider");
  return context;
}
