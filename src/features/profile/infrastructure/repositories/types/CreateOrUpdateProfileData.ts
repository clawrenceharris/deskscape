export type CreateOrUpdateProfileData = {
    userId: string;
    username: string;
    schoolId: string | null;
    displayName: string | null;
    avatarUrl: string | null;
    avatarPath: string | null;
}