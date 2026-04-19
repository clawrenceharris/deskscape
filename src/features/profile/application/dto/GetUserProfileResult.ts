import { ProfileForDetail } from "../../infrastructure/queries";

export type GetUserProfileResult = {
    success: true;
    data: ProfileForDetail | null;
} | {
    success: false;
    error: string;
}