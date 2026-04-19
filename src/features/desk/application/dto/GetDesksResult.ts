import { DeskForDetail } from "../../infrastructure/queries";

export type GetDesksResult = {
    success: true;
    data: DeskForDetail[];
} | {
    success: false;
    error: string;
}