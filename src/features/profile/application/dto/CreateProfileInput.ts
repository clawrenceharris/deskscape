export type CreateProfileInput = {
    userId: string;
    username: string;
    displayName?: string | null;
    avatarFile?: File | null;
    schoolId?: string | null;
}