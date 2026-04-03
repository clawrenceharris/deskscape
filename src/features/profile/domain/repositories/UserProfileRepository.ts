import { UserProfile } from "../entities";

export interface UserProfileRepository {
    existsByUsername(username: string): Promise<boolean>;
    getProfileByUserId(userId: string): Promise<UserProfile | null>
    createProfile(profile: UserProfile): Promise<UserProfile>
    updateProfile(userId: string, profile: Partial<UserProfile>): Promise<void>
    deleteProfile(userId: string): Promise<void>
    existsByUserId(userId: string): Promise<boolean>
    getProfileByUsername(username: string): Promise<UserProfile | null>
    upsert(profile: UserProfile): Promise<UserProfile>
}