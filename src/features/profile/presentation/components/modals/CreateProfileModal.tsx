"use client";
import { DialogContent } from "@/components/ui";
import type { CreateProfileModalProps } from "@/lib/modals/types";
import { CreateProfileForm } from "../forms";

export function CreateProfileModal({
  onSuccess,
  userId,
}: CreateProfileModalProps) {
    
  return (
    <DialogContent
      title="Create Profile"
      showCloseButton={false}
      description="Set up your new profile to personalize your experience and let others find you."
    >
      <CreateProfileForm
          userId={userId}
          onSuccess={onSuccess}
        />
    </DialogContent>
  );
}