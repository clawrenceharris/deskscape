"use client";
import { DialogContent } from "@/components/ui/dialog";
import { CreateDeskItemModalProps } from "@/lib/modals/types";
import { CreateOrUpdateDeskItemForm } from "../forms";

export function CreateDeskItemModal({deskId, onSuccess, onError, onCancel}: CreateDeskItemModalProps) {
  
  return (
    <DialogContent 
      title="Create Desk Item" 
      className="overflow-hidden"
      description="Create a new desk item to add to your desk">
      <CreateOrUpdateDeskItemForm 
        deskId={deskId} 
        onSuccess={onSuccess} 
        onError={onError} 
        onCancel={onCancel}
      />
    </DialogContent>
  );
}