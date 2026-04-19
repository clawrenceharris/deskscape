import { DeskItemForDetail } from "../../infrastructure/queries";

export type UpdateDeskItemResult = {
    success: true;
    data: DeskItemForDetail;
} | {
    success: false;
    error: string;
}