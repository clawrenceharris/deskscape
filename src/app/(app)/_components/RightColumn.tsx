"use client";
import { ProfileOrigin, useDeskContext, useLayout } from "@/app/providers";
import { Column, type ColumnProps } from "@/features/desk/presentation/components/columns";
import { ProfileColumn } from "@/features/profile/presentation/components/columns";
import { NotebookColumn } from "@/features/notebook/presentation/components/columns";
import { ChevronLeft, X } from "lucide-react";
import { Button } from "@/components/ui";
import { motion } from "motion/react";
import { EmptyState, LoadingState } from "@/components/states";
import { useNotebook } from "@/features/notebook/presentation/hooks";
import { useUserProfile } from "@/features/profile/presentation/hooks";
import { useMemo } from "react";

const panelTransition = {
  type: "tween" as const,
  duration: 0.35,
  ease: [0.32, 0.72, 0, 1] as const,
};
type RightColumnProps = ColumnProps & {
  profileUserId: string | null;
  profileOrigin: ProfileOrigin;
  materialIndex: number;
  onMaterialIndexChange: (index: number) => void;
  onProfileOpen: (userId: string, origin: ProfileOrigin) => void;
  onProfileExit: () => void;
};

export function RightColumn({
  profileUserId,
  profileOrigin,
  materialIndex,
  onMaterialIndexChange,
  onProfileOpen,
  onProfileExit,
  ...props
}: RightColumnProps) {
  const { currentNotebookId, setCurrentNotebookId } = useDeskContext();
  const { data: currentNotebook = null, isLoading: notebookLoading } = useNotebook(currentNotebookId ?? null);
  const { closeRightLayout, rightMode } = useLayout();
  const canReturnToNotebook = profileOrigin === "notebook" && !!currentNotebookId;
  const {data: profile} = useUserProfile(profileUserId);
  const handleCollapse = () => {
    if (rightMode === "profile") {
      onProfileExit();
    } else {
      setCurrentNotebookId(null);
      closeRightLayout();
    }
  };

  const handleProfileClick = (id: string) => {
    if (id) {
      onProfileOpen(id, "notebook");
      return;
    }
  };
  const title = useMemo(() => {
    if (rightMode === "profile" && profile) {
      return profile.displayName ?? profile.username;
    }
    return currentNotebook?.title ?? "Untitled Notebook";
  }, [rightMode, profile, currentNotebook]);
  if (rightMode === "profile" && profile && !canReturnToNotebook) {
    return (
      <Column
        {...props}
        onCollapse={handleCollapse}
        title={title}
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
  if (notebookLoading) {
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
  if (!currentNotebook) {
    return (
      <Column
        {...props}
        onCollapse={handleCollapse}
        toggle={null}
      >
        <EmptyState variant="page" title="Not Found" message="This Notebook does not exist or has been deleted." />
      </Column>
    );
  }
  return (
    <Column
      {...props}
      onCollapse={handleCollapse}
      title={title}
      toggle={
        rightMode === "profile" && canReturnToNotebook ? (
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
          animate={{ x: rightMode === "notebook" ? "0%" : "-100%" }}
          transition={panelTransition}
        >
          <NotebookColumn
            key={currentNotebook.id}
            onProfileClick={handleProfileClick}
            notebookId={currentNotebook.id}
            materialIndex={materialIndex}
            onMaterialIndexChange={onMaterialIndexChange}
          />
        </motion.div>
        <motion.div
          key={profileUserId ?? currentNotebook?.creator?.userId ?? "profile"}
          className="absolute inset-0 flex min-h-0 flex-col overflow-y-auto"
          initial={false}
          animate={{ x: rightMode === "profile" ? "0%" : "100%" }}
          transition={panelTransition}
        >
          <ProfileColumn 
            userId={profileUserId ?? currentNotebook.creator.userId}
          />
        </motion.div>
      </div>
    </Column>
  );
}
