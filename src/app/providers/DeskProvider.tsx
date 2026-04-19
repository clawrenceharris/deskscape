"use client";
import { createContext, useContext, useState } from "react";

type DeskContextType = {
  setCurrentDeskId: (deskId: string | null) => void;
  setCurrentDeskItemId: (deskItemId: string | null) => void;
  currentDeskId: string | null;
  currentDeskItemId: string | null;
}

type DeskProviderProps = {
  children: React.ReactNode;

}
const DeskContext = createContext<DeskContextType | undefined>(undefined);

export function DeskProvider({ children }: DeskProviderProps) {
  const [currentDeskId, setCurrentDeskId] = useState<string | null>(null);
  const [currentDeskItemId, setCurrentDeskItemId] = useState<string | null>(null);
  
  return <DeskContext.Provider value={{ 
    setCurrentDeskItemId,
    currentDeskItemId,
    currentDeskId,
    setCurrentDeskId,
    }}>
      {children}
    </DeskContext.Provider>;
}

export function useDeskContext() {
  const context = useContext(DeskContext);
  if (!context) throw new Error("useDesk must be used within a DeskProvider");
  return context;
}
