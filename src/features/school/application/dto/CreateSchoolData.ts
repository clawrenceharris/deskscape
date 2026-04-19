export type CreateSchoolData = {
    name: string;
    students: {
        userId: string;
    }[];
    desks: {
        id: string;
    }[];
}