import { DialogContent } from "@/components/ui/dialog";
import { CreateOrUpdateNotebookForm } from "../forms";
import {  UpdateNotebookModalProps } from "@/lib/modals/types";

export function UpdateNotebookModal({notebookId, onSuccess, onError, onCancel}: UpdateNotebookModalProps) {
    return (
    <DialogContent
      title="Edit Notebook"
      description="Your Notebook is a collection of materials that you and your friends can use to study."
    >
      <CreateOrUpdateNotebookForm notebookId={notebookId} onSuccess={onSuccess} onError={onError} onCancel={onCancel} />
    </DialogContent>
  );
}