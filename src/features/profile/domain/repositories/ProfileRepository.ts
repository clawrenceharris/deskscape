import { ProfileForDetail } from "../../infrastructure/queries";
import { CreateOrUpdateProfileData } from "../../infrastructure/repositories/types/CreateOrUpdateProfileData";

export interface ProfileRepository {
    existsByUsername(username: string): Promise<boolean>;
    getByUserId(userId: string): Promise<ProfileForDetail | null>
    create(data: CreateOrUpdateProfileData): Promise<ProfileForDetail>
    update(data: Partial<CreateOrUpdateProfileData>): Promise<ProfileForDetail>
    delete(userId: string): Promise<void>
    existsByUserId(userId: string): Promise<boolean>
    getByUsername(username: string): Promise<ProfileForDetail | null>
    upsert(data: CreateOrUpdateProfileData): Promise<ProfileForDetail>
}