import { PrismaClient } from "../../../../../generated/prisma/client";
import { DeskItem } from "../../domain/entities";
import { Desk } from "../../domain/entities/Desk";
import { DeskRepository } from "../../domain/repositories";
import { deskMapper, deskItemMapper } from "../mappers";

export class PrismaDeskRepository implements DeskRepository {
  constructor(private readonly prisma: PrismaClient) {}
    async getUserDesks(userId: string): Promise<Desk[]> {
        const desks = await this.prisma.desk.findMany({
            where: {
                creatorId: userId,
            },
        });
        return desks.map((desk) => new Desk({
            id: desk.id,
            name: desk.name,
            createdAt: desk.createdAt.toISOString(),
            updatedAt: desk.updatedAt.toISOString(),
            schoolId: desk.schoolId,
            imageUrl: desk.imageUrl,
            imagePath: desk.imagePath,
            isPublic: desk.isPublic,
            creatorId: desk.creatorId,
        }));
    }
    async getDesksBySchoolId(schoolId: string): Promise<Desk[]> {
        const desks = await this.prisma.desk.findMany({
            where: {
                schoolId,
            },
        });
        return desks.map((desk) => deskMapper(desk));
    }
    async getDeskById(id: string): Promise<Desk | null> {
       const desk = await this.prisma.desk.findUnique({
        where: {
            id,
        },
       });
       return desk ? deskMapper(desk) : null;
    }
    async createDesk(desk: Desk): Promise<Desk> {
        const newDesk = await this.prisma.desk.create({
            data: {
                name: desk.name,
                schoolId: desk.schoolId,
                imageUrl: desk.imageUrl,
                imagePath: desk.imagePath,
                isPublic: desk.isPublic,
                creatorId: desk.creatorId,
            },
            select: {
                id: true,
                name: true,
                createdAt: true,
                updatedAt: true,
                schoolId: true,
                imageUrl: true,
                imagePath: true,
                isPublic: true,
                creatorId: true,
            },
        });
        return deskMapper(newDesk);
           
    }
    async updateDesk(desk: Desk): Promise<Desk> {
        const updatedDesk = await this.prisma.desk.update({
            where: {
                id: desk.id,
            },
            data: {
            id: desk.id,
            name: desk.name,
            createdAt: new Date(desk.createdAt),
            updatedAt: new Date(desk.updatedAt),
            schoolId: desk.schoolId,
            imageUrl: desk.imageUrl,
            imagePath: desk.imagePath,
            isPublic: desk.isPublic,
            creatorId: desk.creatorId,
        }});
        return new Desk(deskMapper(updatedDesk));
    }
    async getDeskItemsByDeskId(deskId: string): Promise<DeskItem[]> {
        const items = await this.prisma.deskItem.findMany({
            where: {
                deskId,
            },
        });
        return items.map((item) => deskItemMapper(item));
    }
    async getDeskItemById(id: string): Promise<DeskItem | null> {
        const item = await this.prisma.deskItem.findUnique({
            where: {
                id,
            },
        });
        return item ? deskItemMapper(item) : null;
    }
    async deleteDesk(id: string): Promise<void> {
        await this.prisma.desk.delete({
            where: {
                id,
            },
        });
    }
}