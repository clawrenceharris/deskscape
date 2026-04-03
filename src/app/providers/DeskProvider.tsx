"use client";
import { DeskDto } from "@/types";
import { createContext, useContext, useState } from "react";
type DeskContextType = {
  desks: DeskDto[];
  setDesks: (desks: DeskDto[]) => void;
}
type DeskProviderProps = {
  children: React.ReactNode;
  initialDesks: DeskDto[];

}
const DeskContext = createContext<DeskContextType | undefined>(undefined);

export function DeskProvider({ children,initialDesks }: DeskProviderProps) {
  
  const [desks, setDesks] = useState<DeskDto[]>(initialDesks);
    return <DeskContext.Provider value={{ desks,setDesks }}>{children}</DeskContext.Provider>;
}

export function useDesk() {
  return useContext(DeskContext);
}
