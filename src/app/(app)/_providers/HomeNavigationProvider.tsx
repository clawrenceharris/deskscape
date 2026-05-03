/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDeskContext, useLayout, useUser } from "@/app/providers";
import { useMediaQuery } from "@/hooks";
import { useDesk, useUserDesks } from "@/features/desk/presentation/hooks";
import type { DeskForCard } from "@/features/desk/infrastructure/queries";
import type { NotebookForDetail } from "@/features/notebook/infrastructure/queries";

export const Q = {
  desk: "desk",
  notebook: "notebook",
  user: "u",
  origin: "o",
  rightMode: "r",
  panel: "pn",
  materialIndex: "m",
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

export function HomeNavigationProvider({ children }: HomeNavigationProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hydratedRef = useRef(false);
  const hydratingRef = useRef(true);
  const [currentProfileUserId, setCurrentProfileUserId] = useState<string | null>(null);
  const [profileOrigin, setProfileOrigin] = useState<ProfileOrigin>("direct");
  const [materialIndex, setMaterialIndex] = useState(0);
  const isMobile = useMediaQuery("(max-width: 768px)", {
    initializeWithValue: false,
  });
  const { user } = useUser();
  const { currentDeskId, currentNotebookId, setCurrentDeskId, setCurrentNotebookId } = useDeskContext();
  const { isLoading: desksLoading } = useUserDesks(user.id);
  const { data: currentDesk = null } = useDesk(currentDeskId ?? null);
  const {
    openColumn,
    isColumnOpen,
    setRightMode,
    rightMode,
    selectNotebookLayout,
    selectDeskLayout,
    closeRightLayout,
    openLeftLayout,
  } = useLayout();

  useEffect(() => {
    if (desksLoading) return;

    hydratingRef.current = true;

    const deskParam = searchParams.get(Q.desk);
    const notebookParam = searchParams.get(Q.notebook);
    const userParam = searchParams.get(Q.user);
    const originParam = searchParams.get(Q.origin);
    const panelParam = searchParams.get(Q.panel);
    const modeParam = searchParams.get(Q.rightMode);
    const materialIndexParam = searchParams.get(Q.materialIndex);
    const parsedMaterialIndex = Number.parseInt(materialIndexParam ?? "0", 10);

    setCurrentDeskId(deskParam ?? null);
    setCurrentNotebookId(notebookParam ?? null);
    setMaterialIndex(Number.isFinite(parsedMaterialIndex) && parsedMaterialIndex >= 0 ? parsedMaterialIndex : 0);

    if (modeParam === RIGHT_MODES.profile && userParam) {
      setCurrentProfileUserId(userParam);
      setProfileOrigin(originParam === PROFILE_ORIGINS.notebook ? "notebook" : "direct");
      setRightMode("profile");
    } else {
      setCurrentProfileUserId(null);
      setProfileOrigin("direct");
      if (modeParam === RIGHT_MODES.notebook) {
        setRightMode("notebook");
      }
    }

    if (panelParam === PANELS.left) {
      openColumn("left");
    } else if (panelParam === PANELS.center) {
      openColumn("center");
    } else if (panelParam === PANELS.right) {
      openColumn("right");
    } else if (modeParam === RIGHT_MODES.profile && userParam) {
      openColumn("right");
    } else if (notebookParam) {
      selectNotebookLayout();
    } else if (deskParam) {
      selectDeskLayout();
    } else {
      openLeftLayout();
    }

    hydratedRef.current = true;
    hydratingRef.current = false;
  }, [desksLoading, openColumn, openLeftLayout, searchParams, selectNotebookLayout, selectDeskLayout, setCurrentDeskId, setCurrentNotebookId, setRightMode]);

  useEffect(() => {
    if (!hydratedRef.current || hydratingRef.current) return;

    const next = new URLSearchParams(searchParams.toString());

    if (currentDeskId) next.set(Q.desk, currentDeskId);
    else next.delete(Q.desk);

    if (currentNotebookId) next.set(Q.notebook, currentNotebookId);
    else next.delete(Q.notebook);

    if (currentNotebookId) next.set(Q.materialIndex, String(materialIndex));
    else next.delete(Q.materialIndex);

    if (rightMode === "profile" && currentProfileUserId) {
      next.set(Q.rightMode, RIGHT_MODES.profile);
      next.set(Q.user, currentProfileUserId);
      next.set(Q.origin, profileOrigin === "notebook" ? PROFILE_ORIGINS.notebook : PROFILE_ORIGINS.direct);
    } else {
      next.delete(Q.rightMode);
      next.delete(Q.user);
      next.delete(Q.origin);
    }

    if (isMobile) {
      if (isColumnOpen("right")) next.set(Q.panel, PANELS.right);
      else if (isColumnOpen("center")) next.set(Q.panel, PANELS.center);
      else next.set(Q.panel, PANELS.left);
    } else {
      next.set(Q.panel, isColumnOpen("right") ? PANELS.right : PANELS.center);
    }

    const currentQuery = searchParams.toString();
    const nextQuery = next.toString();
    if (currentQuery !== nextQuery) {
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
    }
  }, [
    currentDeskId,
    currentNotebookId,
    materialIndex,
    isColumnOpen,
    isMobile,
    pathname,
    rightMode,
    currentProfileUserId,
    profileOrigin,
    router,
    searchParams,
  ]);

  const handleNotebookClick = useCallback((item: NotebookForDetail | null) => {
    setCurrentProfileUserId(null);
    setProfileOrigin("direct");
    setMaterialIndex(0);
    if (!item) {
      setCurrentNotebookId(null);
      closeRightLayout();
      return;
    }
    setCurrentDeskId(item.deskId);
    setCurrentNotebookId(item.id);
    selectNotebookLayout();
  }, [closeRightLayout, selectNotebookLayout, setCurrentDeskId, setCurrentNotebookId]);

  const handleDeskClick = useCallback((desk: DeskForCard) => {
    setCurrentProfileUserId(null);
    setProfileOrigin("direct");
    setMaterialIndex(0);
    if (currentDesk?.id === desk.id) {
      setCurrentDeskId(null);
      setCurrentNotebookId(null);
      openLeftLayout();
      return;
    }
    setCurrentDeskId(desk.id);
    setCurrentNotebookId(null);
    selectDeskLayout();
  }, [currentDesk?.id, openLeftLayout, selectDeskLayout, setCurrentDeskId, setCurrentNotebookId]);

  const handleDesksOpen = useCallback(() => {
    handleNotebookClick(null);
  }, [handleNotebookClick]);

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
  }, [openLeftLayout, setCurrentDeskId, setCurrentNotebookId]);

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
