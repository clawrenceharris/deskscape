import { DialogContent } from "@/components/ui/dialog";
import { CreateOrUpdateDeskItemForm } from "../forms";
import {  UpdateDeskItemModalProps } from "@/lib/modals/types";

export function UpdateDeskItemModal({deskItemId, onSuccess, onError, onCancel}: UpdateDeskItemModalProps) {
    return (
    <DialogContent
      title="Edit Notebook"
      description="Your Notebook is a collection of materials that you and your friends can use to study."
    >
      <CreateOrUpdateDeskItemForm deskItemId={deskItemId} onSuccess={onSuccess} onError={onError} onCancel={onCancel} />
    </DialogContent>
  );
}