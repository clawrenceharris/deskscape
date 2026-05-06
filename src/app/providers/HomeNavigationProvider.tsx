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
  deskMembers: (deskId: string) => `/desks/${deskId}/members`,
  deskChalkboard: (deskId: string) => `/desks/${deskId}/chalkboard`,
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
  notebooks = "notebooks",
  chalkboard = "chalkboard",
  burningQuestions = "burning-questions",
  studyRooms = "study-rooms",
}

type HomeNavigationContextType = {
  currentProfileUserId: string | null;
  profileOrigin: ProfileOrigin;
  materialIndex: number;
  setMaterialIndex: (index: number) => void;
  handleNotebookClick: (item: NotebookForDetail | null) => void;
  handleDeskClick: (desk: DeskForCard) => void;
  handleDesksOpen: () => void;
  handleProfileOpen: (userId: string, origin: ProfileOrigin) => void;
  handleProfileExit: () => void;
  handleDeskExit: () => void;
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
      section: DeskSection.notebooks,
      hasRightPanel: false,
    };
  }

    

  return {
    deskId: deskId ?? null,
    notebookId: section === DeskSection.notebooks ? notebookId ?? null : null,
    section: section === DeskSection.chalkboard     
    ? DeskSection.chalkboard
    : section === DeskSection.burningQuestions
    ? DeskSection.burningQuestions
    : section === DeskSection.studyRooms
    ? DeskSection.studyRooms
    : null,
    hasRightPanel: section === DeskSection.notebooks && !!notebookId,
  };
}

export function HomeNavigationProvider({ children }: HomeNavigationProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentProfileUserId, setCurrentProfileUserId] = useState<string | null>(null);
  const [profileOrigin, setProfileOrigin] = useState<ProfileOrigin>("direct");
  const [materialIndex, setMaterialIndex] = useState(0);
  const { currentDeskId, currentNotebookId, setCurrentDeskId, setCurrentNotebookId, setCurrentSection } = useDeskContext();
  const {
    openColumn,
    setRightMode,
    selectNotebookLayout,
    selectDeskLayout,
    closeRightLayout,
    openLeftLayout,
  } = useLayout();

  useEffect(() => {
    const route = getRouteState(pathname);
   
    setCurrentDeskId(route.deskId);
    setCurrentNotebookId(route.notebookId);

    if(!route.section) {
      return;
    }
    setCurrentSection(route.section);
   

    if (route.notebookId) {
      setRightMode("notebook");
      selectNotebookLayout();
    } else if (route.deskId) {
      selectDeskLayout();
    } else {
      openLeftLayout();
    }
  }, [openLeftLayout, pathname, selectDeskLayout, selectNotebookLayout, setCurrentDeskId, setCurrentNotebookId, setCurrentSection, setRightMode]);

  const handleNotebookClick = useCallback((item: NotebookForDetail | null) => {
    setCurrentProfileUserId(null);
    setProfileOrigin("direct");
    setMaterialIndex(0);
    if (!item) {
      setCurrentNotebookId(null);
      closeRightLayout();
      router.push(currentDeskId ? APP_ROUTES.desk(currentDeskId) : APP_ROUTES.desks);
      return;
    }
    setCurrentDeskId(item.deskId);
    setCurrentNotebookId(item.id);
    selectNotebookLayout();
    router.push(APP_ROUTES.notebook(item.deskId, item.id));
  }, [closeRightLayout, currentDeskId, router, selectNotebookLayout, setCurrentDeskId, setCurrentNotebookId]);

  const handleDeskClick = useCallback((desk: DeskForCard) => {
    setCurrentProfileUserId(null);
    setProfileOrigin("direct");
    setMaterialIndex(0);
    if (currentDeskId === desk.id) {
      setCurrentDeskId(null);
      setCurrentNotebookId(null);
      openLeftLayout();
      router.push(APP_ROUTES.desks);
      return;
    }
    setCurrentDeskId(desk.id);
    setCurrentNotebookId(null);
    selectDeskLayout();
    router.push(APP_ROUTES.desk(desk.id));
  }, [currentDeskId, openLeftLayout, router, selectDeskLayout, setCurrentDeskId, setCurrentNotebookId]);

  const handleDesksOpen = useCallback(() => {
    setCurrentDeskId(null);
    setCurrentNotebookId(null);
    setMaterialIndex(0);
    openLeftLayout();
    router.push(APP_ROUTES.desks);
  }, [openLeftLayout, router, setCurrentDeskId, setCurrentNotebookId]);

  const handleProfileOpen = useCallback((userId: string, origin: ProfileOrigin) => {
    setCurrentProfileUserId(userId);
    setProfileOrigin(origin);
    setRightMode("profile");
    openColumn("right");
  }, [openColumn, setRightMode]);

  const handleProfileExit = useCallback(() => {
    if (profileOrigin === "notebook" && currentNotebookId) {
      setCurrentProfileUserId(null);
      setProfileOrigin("direct");
      setRightMode("notebook");
      openColumn("right");
      return;
    }
    setCurrentProfileUserId(null);
    setProfileOrigin("direct");
    closeRightLayout();
  }, [closeRightLayout, currentNotebookId, openColumn, profileOrigin, setRightMode]);

  const handleDeskExit = useCallback(() => {
    setCurrentDeskId(null);
    setCurrentNotebookId(null);
    setMaterialIndex(0);
    openLeftLayout();
    router.push(APP_ROUTES.desks);
  }, [openLeftLayout, router, setCurrentDeskId, setCurrentNotebookId]);

  return (
    <HomeNavigationContext.Provider
      value={{
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
