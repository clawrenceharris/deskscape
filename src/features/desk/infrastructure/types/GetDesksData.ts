export type GetDesksData = {
    where?: object & {
        schoolId?: string;
        creatorId?: string;
        members?: {
            userId?: string;
        }[];
    };
}