"use client";
import { DialogContent } from "@/components/ui/dialog";
import { CreateDeskForm } from "../forms";
import { CreateDeskModalProps } from "@/lib/modals/types";

export function CreateDeskModal({userId, onSuccess, onCancel}: CreateDeskModalProps) {
 
  return (
    <DialogContent
      title="Create Desk"
      description="Create a new desk to organize your materials"
      className="max-w-2xl"
    >
      <CreateDeskForm 
        userId={userId} 
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </DialogContent>
  );
}