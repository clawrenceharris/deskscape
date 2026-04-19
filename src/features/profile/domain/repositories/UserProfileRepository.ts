import { ProfileForDetail } from "../../infrastructure/queries";
import { CreateOrUpdateProfileData } from "../../infrastructure/repositories/types/CreateOrUpdateProfileData";

export interface UserProfileRepository {
    existsByUsername(username: string): Promise<boolean>;
    getProfileByUserId(userId: string): Promise<ProfileForDetail | null>
    createProfile(data: CreateOrUpdateProfileData): Promise<ProfileForDetail>
    updateProfile(data: Partial<CreateOrUpdateProfileData>): Promise<ProfileForDetail>
    deleteProfile(userId: string): Promise<void>
    existsByUserId(userId: string): Promise<boolean>
    getProfileByUsername(username: string): Promise<ProfileForDetail | null>
    upsert(data: CreateOrUpdateProfileData): Promise<ProfileForDetail>
}