import { UpdateDeskItemFormValues } from "@/types";

type UpdateDeskItemData = UpdateDeskItemFormValues & {
    removeMaterialIds?: string[];
    keepMaterialIds?: string[];
}

export type UpdateDeskItemInput = {
    deskItemId: string;
    data: UpdateDeskItemData;
}