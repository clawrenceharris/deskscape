import { DeskItemForDetail } from "../../infrastructure/queries";

export type GetDeskItemsResult = {
    success: true;
    data: DeskItemForDetail[];
} | {
    success: false;
    error: string;
}