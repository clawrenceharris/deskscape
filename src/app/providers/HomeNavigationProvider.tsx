"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDeskContext, useLayout } from "@/app/providers";
import type { DeskForCard } from "@/features/desk/infrastructure/queries";
import type { NotebookForDetail } from "@/features/notebook/infrastructure/queries";

export const APP_ROUTES = {
  desks: "/desks",
  desk: (deskId: string) => `/desks/${deskId}`,
  notebook: (deskId: string, notebookId: string) => `/desks/${deskId}/notebooks/${notebookId}`,
  notebooks: (deskId: string) => `/desks/${deskId}/notebooks`,
  studyRooms: (deskId: string) => `/desks/${deskId}/study-rooms`,
  burningQuestions: (deskId: string) => `/desks/${deskId}/burning-questions`,
  deskMembers: (deskId: string) => `/desks/${deskId}/members`,
  chalkboard: (deskId: string) => `/desks/${deskId}/chalkboard`,
  settings: (deskId: string) => `/desks/${deskId}/settings`,
  notifications: (deskId: string) => `/desks/${deskId}/notifications`,
} as const;

export const RIGHT_MODES = {
  profile: "pf",
  notebook: "notebook",
} as const;

export const PROFILE_ORIGINS = {
  notebook: "notebook",
  direct: "direct",
} as const;

export const PANELS = {
  left: "l",
  center: "c",
  right: "r",
} as const;

export type ProfileOrigin = keyof typeof PROFILE_ORIGINS;
export enum DeskSection {
  home = "home",
  notebooks = "notebooks",
  chalkboard = "chalkboard",
  burningQuestions = "burning-questions",
  studyRooms = "study-rooms",
  members = "members",
  settings = "settings",
  notifications = "notifications",
}

type HomeNavigationContextType = {
  materialIndex: number;
  setMaterialIndex: (index: number) => void;
  handleNotebookClick: (notebook: NotebookForDetail) => void;
  handleDeskClick: (desk: DeskForCard) => void;
  handleDesksOpen: () => void;
  handleDeskExit: () => void;
  handleSectionClick: (section: DeskSection) => void;
  handleNotebookExit: () => void;
  };

const HomeNavigationContext = createContext<HomeNavigationContextType | undefined>(undefined);

type HomeNavigationProviderProps = {
  children: React.ReactNode;
};

function getRouteState(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const [root, deskId, section, notebookId] = segments;

  if (root !== "desks") {
    return {
      deskId: null,
      notebookId: null,
      section: null,
      hasRightPanel: false,
    };
  }

  function getSection(section: string) {
   
    if(section === DeskSection.notebooks) {
      return DeskSection.notebooks;
    }
    if(section === DeskSection.chalkboard) {
      return DeskSection.chalkboard;
    }
    if(section === DeskSection.burningQuestions) {
      return DeskSection.burningQuestions;
    }
    if(section === DeskSection.studyRooms) {
      return DeskSection.studyRooms;
    }
    return null;
  }

  return {
    deskId: deskId ?? null,
    notebookId: section === DeskSection.notebooks ? notebookId ?? null : null,
    section: getSection(section),
    hasRightPanel: section === DeskSection.notebooks && !!notebookId,
  };
}

export function HomeNavigationProvider({ children }: HomeNavigationProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [materialIndex, setMaterialIndex] = useState(0);
  const {currentDeskId, setCurrentDeskId, setCurrentNotebookId, setCurrentSection } = useDeskContext();
  const {
    selectNotebookLayout,
    selectDeskLayout,
    openLeftLayout,
    selectSectionLayout,
    closeRightLayout,
  } = useLayout();

  useEffect(() => {
    const route = getRouteState(pathname);
   
    setCurrentDeskId(route.deskId);
    setCurrentNotebookId(route.notebookId);
   
    if (route.notebookId) {
      setCurrentSection(DeskSection.notebooks);
      selectNotebookLayout();
    }
    else if (route.section) {
      setCurrentSection(route.section);
      selectSectionLayout();
    }
    else if (route.deskId) {
      selectDeskLayout(false);
    } 
  }, [openLeftLayout, pathname, selectDeskLayout, selectNotebookLayout, selectSectionLayout, setCurrentDeskId, setCurrentNotebookId, setCurrentSection]);
  const handleSectionClick = useCallback((section: DeskSection) => {
    if(!currentDeskId) {
      return;
    }
    setCurrentSection(section);
    selectSectionLayout();
    if(section === DeskSection.chalkboard) {
      router.push(APP_ROUTES.chalkboard(currentDeskId));
      return;
    }
    if(section === DeskSection.burningQuestions) {
      router.push(APP_ROUTES.burningQuestions(currentDeskId));
      return;
    }
    if(section === DeskSection.studyRooms) {
      router.push(APP_ROUTES.studyRooms(currentDeskId));
      return;
    }
    if(section === DeskSection.home) {
      router.push(APP_ROUTES.desk(currentDeskId));
      return;
    }
    if(section === DeskSection.members) {
      router.push(APP_ROUTES.deskMembers(currentDeskId));
      return;
    }
    if(section === DeskSection.settings) {
      router.push(APP_ROUTES.settings(currentDeskId));
      return;
    }
    if(section === DeskSection.notifications) {
      router.push(APP_ROUTES.notifications(currentDeskId));
      return;
    }

  }, [currentDeskId, router, selectSectionLayout, setCurrentSection]);
  const handleNotebookClick = useCallback((notebook: NotebookForDetail) => {
    setMaterialIndex(0);
    setCurrentDeskId(notebook.deskId);
    setCurrentNotebookId(notebook.id);
    selectNotebookLayout();
    router.push(APP_ROUTES.notebook(notebook.deskId, notebook.id));
  }, [router, selectNotebookLayout, setCurrentDeskId, setCurrentNotebookId]);

  const handleDeskClick = useCallback((desk: DeskForCard) => {
    setMaterialIndex(0);
    setCurrentDeskId(desk.id);
    setCurrentNotebookId(null);
    selectDeskLayout(false);
    router.push(APP_ROUTES.desk(desk.id));
  }, [router, selectDeskLayout, setCurrentDeskId, setCurrentNotebookId]);

  const handleDesksOpen = useCallback(() => {
    setCurrentDeskId(null);
    setCurrentNotebookId(null);
    setMaterialIndex(0);
    openLeftLayout();
    router.push(APP_ROUTES.desks);
  }, [openLeftLayout, router, setCurrentDeskId, setCurrentNotebookId]);

  
  const handleDeskExit = useCallback(() => {
    setCurrentDeskId(null);
    setCurrentNotebookId(null);
    setMaterialIndex(0);
    openLeftLayout();
    setCurrentSection(null);
    router.push(APP_ROUTES.desks);
  }, [openLeftLayout, router, setCurrentDeskId, setCurrentNotebookId, setCurrentSection]);

  const handleNotebookExit = useCallback(() => {
    if(!currentDeskId) {
      return;
    }
    setCurrentNotebookId(null);
    closeRightLayout();
    router.push(APP_ROUTES.notebooks(currentDeskId));
  }, [closeRightLayout, currentDeskId, router, setCurrentNotebookId]);

  return (
    <HomeNavigationContext.Provider
      value={{
        materialIndex,
        setMaterialIndex,
        handleNotebookClick,
        handleNotebookExit,
        handleDeskClick,
        handleDesksOpen,
        handleDeskExit,
        handleSectionClick
      }}
    >
      {children}
    </HomeNavigationContext.Provider>
  );
}

export function useHomeNavigation() {
  const context = useContext(HomeNavigationContext);
  if (!context) {
    throw new Error("useHomeNavigation must be used within a HomeNavigationProvider");
  }
  return context;
}
