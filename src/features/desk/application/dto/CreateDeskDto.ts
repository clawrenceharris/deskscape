
export type CreateDeskInput = {
    name: string;
    schoolId: string;
    isPublic: boolean;
    creatorId: string;
    imageFile?: File | null;
    description?: string;
}
