"use client";
import { DialogContent } from "@/components/ui";
import type { CreateProfileModalProps } from "@/lib/modals/types";
import { useModal } from "@/app/providers/ModalProvider";
import { CreateProfileForm } from "./CreateProfileForm";

export function CreateProfileModal({
  onSuccess,
  user,
}: CreateProfileModalProps) {
    
  return (
    <DialogContent
      title="Create Profile"
      showCloseButton={false}
      
      description="Set up your new profile to personalize your experience and let others find you."
      className="max-w-2xl"
    >
        <CreateProfileForm
            user={user}
            onSuccess={onSuccess}
         
        />
    </DialogContent>
  );
}