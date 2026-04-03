import { PrismaClient } from "../../../../../generated/prisma/client";
import { UserProfile } from "../../domain/entities";
import { UserProfileRepository } from "../../domain/repositories";

export class PrismaUserProfileRepository implements UserProfileRepository {
    constructor(private readonly prisma: PrismaClient) {}
   
    async createProfile(profile: UserProfile): Promise<UserProfile> {
        const newProfile = await this.prisma.profile.create({
            data: {
                displayName: profile.displayName,
                username: profile.username,
                avatarUrl: profile.avatarUrl,
                avatarPath: profile.avatarPath,
                userId: profile.userId,
            },
            select: {
                id: true,
                displayName: true,
                username: true,
                avatarUrl: true,
                avatarPath: true,
                userId: true,
            },
        });
        return new UserProfile({
            displayName: newProfile.displayName,
            username: newProfile.username,
            avatarUrl: newProfile.avatarUrl,
            userId: newProfile.userId,
            avatarPath: newProfile.avatarPath,
        });
    }
    async updateProfile(userId: string, profile: UserProfile): Promise<void> {
        
        await this.prisma.profile.update({
            where: { userId },
            data: {
                displayName: profile.displayName,
                username: profile.username,
                avatarUrl: profile.avatarUrl,
                avatarPath: profile.avatarPath,
            },
        });
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
    async getProfileByUsername(username: string): Promise<UserProfile | null> {
       const profile = await this.prisma.profile.findFirst({
        where: { username },
        
       });
       return profile ? new UserProfile({
        displayName: profile.displayName,
        username: profile.username,
        avatarUrl: profile.avatarUrl,
        userId: profile.userId,
        avatarPath: profile.avatarPath,
       }) : null;
    }

    async getProfileByUserId(userId: string): Promise<UserProfile | null> {
        const profile = await this.prisma.profile.findUnique({
            where: { userId },
            
        });
        return profile ? new UserProfile({
            userId: profile.userId,
            displayName: profile.displayName,
            username: profile.username,
            avatarUrl: profile.avatarUrl,
            avatarPath: profile.avatarPath,
        }) : null;
    }
    async upsert(profile: UserProfile): Promise<UserProfile> {
        const newProfile = await this.prisma.profile.upsert({
            where: { userId: profile.userId },
            update: {
                displayName: profile.displayName,
                username: profile.username,
                avatarUrl: profile.avatarUrl,
                avatarPath: profile.avatarPath,
            },
            create: {
                userId: profile.userId,
                displayName: profile.displayName,
                username: profile.username,
                avatarUrl: profile.avatarUrl,
                avatarPath: profile.avatarPath,
            },
        });
        return new UserProfile({
            userId: newProfile.userId,
            displayName: newProfile.displayName,
            username: newProfile.username,
            avatarUrl: newProfile.avatarUrl,
            avatarPath: newProfile.avatarPath,
        });
    }
}