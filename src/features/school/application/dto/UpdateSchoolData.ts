export type UpdateSchoolData = {
    id: string;
    name?: string;
    students?: {
        userId: string;
    }[];
    desks?: {
        id: string;
    }[];
}