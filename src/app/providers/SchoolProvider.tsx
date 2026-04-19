"use client";
import { createContext, useContext, useState } from "react";

type SchoolContextType = {
  currentSchoolId: string | null;
  setCurrentSchoolId: (schoolId: string | null) => void;
}
type SchoolProviderProps = {
  children: React.ReactNode;
}
const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export function SchoolProvider({ children }: SchoolProviderProps) {
  const [currentSchoolId, setCurrentSchoolId] = useState<string | null>(null);

  return <SchoolContext.Provider value={{ 
    currentSchoolId,
    setCurrentSchoolId,
    }}>
      {children}
    </SchoolContext.Provider>;
}

export function useSchool() {
  const context = useContext(SchoolContext);
  if (!context) throw new Error("useSchool must be used within a SchoolProvider");
  return context;
}
