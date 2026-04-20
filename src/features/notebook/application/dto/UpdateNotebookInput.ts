import { UpdateNotebookFormValues } from "@/types";

export type UpdateNotebookInput = {
    notebookId: string;
    data: UpdateNotebookFormValues & {
        removeMaterialIds?: string[];
        keepMaterialIds?: string[];
    }
}