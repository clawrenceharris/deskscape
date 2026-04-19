export type CreateDeskData = {
    name: string;
    schoolId: string;
    isPublic: boolean;
    creatorId: string;
    imageUrl: string | null;
    imagePath: string | null;
    description: string | null;
}