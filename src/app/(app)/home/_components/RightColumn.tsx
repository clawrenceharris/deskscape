"use client";
import { useDeskContext, useLayout } from "@/app/providers";
import { Column, type ColumnProps } from "@/features/desk/presentation/components/columns";
import { ProfileColumn } from "@/features/profile/presentation/components/columns";
import { DeskItemColumn } from "@/features/deskItem/presentation/components/columns";
import { ChevronLeft, X } from "lucide-react";
import { Button } from "@/components/ui";
import { motion } from "motion/react";
import { EmptyState, LoadingState } from "@/components/states";
import { useDeskItem } from "@/features/deskItem/presentation/hooks";
import { useUserProfile } from "@/features/profile/presentation/hooks";

const panelTransition = {
  type: "tween" as const,
  duration: 0.35,
  ease: [0.32, 0.72, 0, 1] as const,
};
type ProfileOrigin = "item" | "direct";
type RightColumnProps = ColumnProps & {
  profileUserId: string | null;
  profileOrigin: ProfileOrigin;
  onProfileOpen: (userId: string, origin: ProfileOrigin) => void;
  onProfileExit: () => void;
};

export function RightColumn({
  profileUserId,
  profileOrigin,
  onProfileOpen,
  onProfileExit,
  ...props
}: RightColumnProps) {
  const { currentDeskItemId, setCurrentDeskItemId } = useDeskContext();
  const { data: currentDeskItem = null, isLoading: deskItemLoading } = useDeskItem(currentDeskItemId ?? null);
  const { setRightMode, closeRightLayout, rightMode } = useLayout();
  const canReturnToDeskItem = profileOrigin === "item" && !!currentDeskItemId;
  const {data: profile} = useUserProfile(profileUserId);
  console.log(profile);
  const handleCollapse = () => {
    if (rightMode === "profile") {
      onProfileExit();
    } else {
      setCurrentDeskItemId(null);
      closeRightLayout();
    }
  };

  const handleProfileClick = (id: string | null) => {
    if (id) {
      onProfileOpen(id, "item");
      return;
    }
    setRightMode("deskItem");
  };
  if (rightMode === "profile" && profile && !canReturnToDeskItem) {
    return (
      <Column
        {...props}
        onCollapse={handleCollapse}
        title={profile?.displayName ?? profile.username}
        toggle={
          <Button size="icon" variant="ghost" onClick={handleCollapse}>
            <X strokeWidth={3} />
          </Button>
        }
      >
        <ProfileColumn userId={profile.userId} />
      </Column>
    );
  }
  if (deskItemLoading) {
    return (
      <Column
        {...props}
        onCollapse={handleCollapse}
        toggle={null}
      >
        <LoadingState />
      </Column>
    );
  }
  if (!currentDeskItem) {
    return (
      <Column
        {...props}
        onCollapse={handleCollapse}
        toggle={null}
      >
        <EmptyState variant="page" title="Not Found" message="This Desk item does not exist or has been deleted." />
      </Column>
    );
  }
  return (
    <Column
      {...props}
      onCollapse={handleCollapse}
      title={currentDeskItem.title ?? "Untitled Notebook"}
      toggle={
        rightMode === "profile" && canReturnToDeskItem ? (
          <Button size="icon" variant="ghost" onClick={handleCollapse}>
            <ChevronLeft strokeWidth={3} />
          </Button>
        ) : (
          <Button size="icon" variant="ghost" onClick={handleCollapse}>
            <X strokeWidth={3} />
          </Button>
        )
      }
    >
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <motion.div
          className="absolute inset-0 flex min-h-0 flex-col overflow-hidden"
          initial={false}
          animate={{ x: rightMode === "deskItem" ? "0%" : "-100%" }}
          transition={panelTransition}
        >
          <DeskItemColumn
            key={currentDeskItem?.id ?? "desk-item"}
            onProfileClick={handleProfileClick}
            deskItemId={currentDeskItem.id}
          />
        </motion.div>
        <motion.div
        key={profileUserId ?? currentDeskItem?.creator?.userId ?? "profile"}
          className="absolute inset-0 flex min-h-0 flex-col overflow-y-auto"
          initial={false}
          animate={{ x: rightMode === "profile" ? "0%" : "100%" }}
          transition={panelTransition}
        >
          <ProfileColumn userId={profileUserId ?? currentDeskItem.creator.userId} />
        </motion.div>
      </div>
    </Column>
  );
}
