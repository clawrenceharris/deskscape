import { PrismaClientType } from "@/lib/db/prisma";
import { UserProfileRepository } from "../../domain/repositories";
import { CreateOrUpdateProfileData } from "./types";
import { ProfileForDetail, profileForDetailArgs } from "../queries";

export class PrismaUserProfileRepository implements UserProfileRepository {
    constructor(private readonly prisma: PrismaClientType) {}
   
    async createProfile(data: CreateOrUpdateProfileData): Promise<ProfileForDetail> {
        const newProfile = await this.prisma.profile.create({
            data,
            ...profileForDetailArgs,
        });
        return newProfile;
    }
    async updateProfile(data: CreateOrUpdateProfileData): Promise<ProfileForDetail> {
       
        const newProfile =await this.prisma.profile.update({
            where: { userId: data.userId },
            data,
            ...profileForDetailArgs,
        });
        return newProfile;
    }
    async deleteProfile(userId: string): Promise<void> {
        await this.prisma.profile.delete({
            where: { userId },
        });
    }
    async existsByUserId(userId: string): Promise<boolean> {
        const profile = await this.prisma.profile.findFirst({
            where: { userId },
        });
        return profile ? true : false;
    }
    async existsByUsername(username: string): Promise<boolean> {
        const profile = await this.prisma.profile.findFirst({
            where: { username },
        });
        return profile ? true : false;
    }
    async getProfileByUsername(username: string): Promise<ProfileForDetail | null> {
       const profile = await this.prisma.profile.findFirst({
        where: { username },
        ...profileForDetailArgs,
        
       });
       return profile ?? null;
    }

    async getProfileByUserId(userId: string): Promise<ProfileForDetail | null> {
        const profile = await this.prisma.profile.findUnique({
            where: { userId },
            ...profileForDetailArgs,
        });
        return profile;
    }
    async upsert(data: CreateOrUpdateProfileData): Promise<ProfileForDetail> {
        const newProfile = await this.prisma.profile.upsert({
            where: { userId: data.userId },
            update: data,
            create: data,
            ...profileForDetailArgs,
        });
        return newProfile;
    }
}