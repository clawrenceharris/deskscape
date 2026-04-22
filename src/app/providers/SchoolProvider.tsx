"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./UserProvider";

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
  const { profile } = useUser();
  useEffect(() => {
    if(!profile){
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentSchoolId(profile.schoolId);
  }, [profile]);
  return <SchoolContext.Provider value={{ 
    currentSchoolId,
    setCurrentSchoolId,
    }}>
      {children}
    </SchoolContext.Provider>;
}

export function useSchoolContext() {
  const context = useContext(SchoolContext);
  if (!context) throw new Error("useSchool must be used within a SchoolProvider");
  return context;
}
