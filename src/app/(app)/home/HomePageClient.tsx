"use client";
import { useDeskContext, useLayout, useUser} from "@/app/providers";
import { useMediaQuery } from "@/hooks";
import { DesksColumn, DeskColumn } from "@/features/desk/presentation/components/columns";
import { DeskForCard } from "@/features/desk/infrastructure/queries";
import { DeskItemForDetail } from "@/features/deskItem/infrastructure/queries";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { UserProfile } from "@/features/profile/domain/entities";
import { RightColumn } from "./_components";
import { AnimatePresence } from "motion/react";
import { useUserDesks,useDesk } from "@/features/desk/presentation/hooks";
import { useDeskItem } from "@/features/deskItem/presentation/hooks";

const Q = {
  desk: "desk",
  item: "item",
  user: "u",
  origin: "o",
  rightMode: "r",
  panel: "pn",
} as const;

const RIGHT_MODES = {
  profile: "pf",
  deskItem: "item",
} as const;
const PROFILE_ORIGINS = {
  item: "item",
  direct: "direct",
} as const;
type ProfileOrigin = keyof typeof PROFILE_ORIGINS;
const PANELS = {
  left: "l",
  center: "c",
  right: "r",
} as const;
export function HomePageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hydratedRef = useRef(false);
  const hydratingRef = useRef(true);
  const [currentProfileUserId, setCurrentProfileUserId] = useState<string | null>(null);
  const [profileOrigin, setProfileOrigin] = useState<ProfileOrigin>("direct");
  const { user } = useUser();
  const {
    currentDeskItemId,
    setCurrentDeskItemId,
    setCurrentDeskId,
    currentDeskId,
  } = useDeskContext();

  const isMobile = useMediaQuery("(max-width: 768px)", {
    initializeWithValue: false,
  });
  const { isLoading: desksLoading } = useUserDesks(user.id);
  const {data: currentDesk = null} = useDesk(currentDeskId ?? null);
  const {data: currentDeskItem = null} = useDeskItem(currentDeskItemId ?? null);
  const {
    openColumn,
    isColumnOpen,
    setRightMode,
    rightMode,
    selectDeskItemLayout,
    selectDeskLayout,
    closeRightLayout,
    openLeftLayout,
  } = useLayout();
 
  useEffect(() => {
    if (desksLoading) return;

    hydratingRef.current = true;

    const deskParam = searchParams.get(Q.desk);
    const itemParam = searchParams.get(Q.item);
    const userParam = searchParams.get(Q.user);
    const originParam = searchParams.get(Q.origin);
    const panelParam = searchParams.get(Q.panel);
    const modeParam = searchParams.get(Q.rightMode);

    setCurrentDeskId(deskParam ?? null);
    setCurrentDeskItemId(itemParam ?? null);

    if (modeParam === RIGHT_MODES.profile && userParam) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentProfileUserId(userParam);
      setProfileOrigin(originParam === PROFILE_ORIGINS.item ? "item" : "direct");
      setRightMode("profile");
    } else {
      setCurrentProfileUserId(null);
      setProfileOrigin("direct");
      if (modeParam === RIGHT_MODES.deskItem) {
        setRightMode("deskItem");
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
    } else if (itemParam) {
      selectDeskItemLayout();
    } else if (deskParam) {
      selectDeskLayout();
    } else {
      openLeftLayout();
    }

    hydratedRef.current = true;
    hydratingRef.current = false;
  }, [desksLoading, openColumn, openLeftLayout, searchParams, selectDeskItemLayout, selectDeskLayout, setCurrentDeskId, setCurrentDeskItemId, setRightMode]);

  useEffect(() => {
    if (!hydratedRef.current || hydratingRef.current) return;

    const next = new URLSearchParams(searchParams.toString());

    if (currentDeskId) next.set(Q.desk, currentDeskId);
    else next.delete(Q.desk);

    if (currentDeskItemId) next.set(Q.item, currentDeskItemId);
    else next.delete(Q.item);

    if (rightMode === "profile" && currentProfileUserId) {
      next.set(Q.rightMode, RIGHT_MODES.profile);
      next.set(Q.user, currentProfileUserId);
      next.set(Q.origin, profileOrigin === "item" ? PROFILE_ORIGINS.item : PROFILE_ORIGINS.direct);
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
    currentDeskItemId,
    isColumnOpen,
    isMobile,
    pathname,
    rightMode,
    currentProfileUserId,
    profileOrigin,
    router,
    searchParams,
  ]);

  const handleDeskItemSelected = (item: DeskItemForDetail | null) => {
    setCurrentProfileUserId(null);
    setProfileOrigin("direct");
    if (!item) {
      setCurrentDeskItemId(null);
      closeRightLayout();
      return;
    }
    setCurrentDeskId(item.deskId);
    setCurrentDeskItemId(item.id);
    selectDeskItemLayout();
  };

  const handleDeskClick = (desk: DeskForCard) => {
    setCurrentProfileUserId(null);
    setProfileOrigin("direct");
    if (currentDesk?.id === desk.id) {
      setCurrentDeskId(null);
      setCurrentDeskItemId(null);
      openLeftLayout();
      return;
    }
    setCurrentDeskId(desk.id);
    setCurrentDeskItemId(null);
    selectDeskLayout();
  };

  const handleDesksOpen = () => {
    handleDeskItemSelected(null);
  };
  const handleProfileOpen = (userId: string, origin: ProfileOrigin) => {
    setCurrentProfileUserId(userId);
    setProfileOrigin(origin);
    setRightMode("profile");
    openColumn("right");
  };
  const handleProfileExit = () => {
    if (profileOrigin === "item" && currentDeskItemId) {
      setCurrentProfileUserId(null);
      setProfileOrigin("direct");
      setRightMode("deskItem");
      openColumn("right");
      return;
    }
    setCurrentProfileUserId(null);
    setProfileOrigin("direct");
    closeRightLayout();
  };

  
  return (
    <>
    <AnimatePresence mode="popLayout">
      {isColumnOpen("left") && isMobile && 
        <DesksColumn
          openWidth={"100%"}
          closedWidth={0}
          collapsable={false}
          onOpen={handleDesksOpen}
          onDeskClick={handleDeskClick}
          columnType={"left"}
        /> }
      {!isMobile && 
      
        <DesksColumn
          openWidth={400}
          closedWidth={55}
          collapsable={true}
          onOpen={handleDesksOpen}
          onDeskClick={handleDeskClick}
          columnType={"left"}
        /> }
      </AnimatePresence>
      <AnimatePresence mode="popLayout">
        { isColumnOpen("center") && 
          <DeskColumn
          
          openWidth={"100%"}
          closedWidth={isMobile ? 0 : 55}
          deskId={currentDesk?.id ?? null}
          onCollapse={() => {
            setCurrentDeskId(null);
            setCurrentDeskItemId(null);
            openLeftLayout();
          }}
          onDeskItemSelected={handleDeskItemSelected}
          columnType={"center"}
        /> }
      </AnimatePresence>
      <AnimatePresence mode="popLayout">
        {isColumnOpen("right") && 
          <RightColumn  
            profileUserId={currentProfileUserId}
            profileOrigin={profileOrigin}
            onProfileOpen={handleProfileOpen}
            onProfileExit={handleProfileExit}
            closedWidth={0}
            openWidth={isMobile ? "100%" : 350}
            style={{
              maxWidth: 650,
            }}
            columnType={"right"}
          />}
      </AnimatePresence>
    
       
    </>
  );
};