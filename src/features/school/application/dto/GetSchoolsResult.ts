import { SchoolForDetail } from "../../infrastructure/queries";

export type GetSchoolsResult = {
    success: true;
    data: SchoolForDetail[];
} | {
    success: false;
    error: string;
}