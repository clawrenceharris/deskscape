import { DeskItemRepository } from "../../domain/repositories";
import { DeskItemForDetail, deskItemForDetailArgs, DeskItemVote, deskItemVoteArgs } from "../queries";
import { Prisma, PrismaClientType } from "@/lib/db/prisma";
import { CreateDeskItemData, UpdateDeskItemData, VoteDeskItemData } from "./types";
import { DownloadDeskItemInput, GetDeskItemsInput, RemoveVoteData } from "../../application/dto";

export class PrismaDeskItemRepository implements DeskItemRepository {
    constructor(private readonly prisma: PrismaClientType) {}
    async getAll(input?: GetDeskItemsInput): Promise<DeskItemForDetail[]> {
        const where: Prisma.DeskItemWhereInput = input?.where ?? {};
        const deskItems = await this.prisma.deskItem.findMany({
            where,
            ...deskItemForDetailArgs,
        });
        return deskItems;
    }
    async create(input: CreateDeskItemData): Promise<DeskItemForDetail> {
        const data: Prisma.DeskItemCreateInput = {
            title: input.title,
            description: input.description,
            desk: { connect: { id: input.deskId } },
            materials: { create: input.materials },
            creator: { connect: { userId: input.creatorId } },
        };
        const newItem = await this.prisma.deskItem.create({ data, ...deskItemForDetailArgs });
        return newItem;
    }
    async update(input: UpdateDeskItemData): Promise<DeskItemForDetail> {
        const data: Prisma.DeskItemUpdateInput = {
            title: input.title,
            description: input.description,
        };
        if ((input.materialsToCreate?.length ?? 0) > 0 || (input.materialIdsToDelete?.length ?? 0) > 0) {
            data.materials = {
                ...(input.materialsToCreate?.length
                    ? { create: input.materialsToCreate }
                    : {}),
                ...(input.materialIdsToDelete?.length
                    ? { deleteMany: { id: { in: input.materialIdsToDelete } } }
                    : {}),
            };
        }
        const updated = await this.prisma.deskItem.update({
            where: { id: input.deskItemId },
            data,
            ...deskItemForDetailArgs,
        });
        return updated;
    }
    async getById(id: string): Promise<DeskItemForDetail | null> {
        const deskItem = await this.prisma.deskItem.findUnique({
            where: { id },
            ...deskItemForDetailArgs,
        });
        return deskItem;
    }
  
    async delete(id: string): Promise<DeskItemForDetail> {
        const deletedDeskItem = await this.prisma.deskItem.delete({
            where: { id },
            ...deskItemForDetailArgs,
        });
        return deletedDeskItem;
    }
    async vote(data: VoteDeskItemData): Promise<void> {
        

        await this.prisma.vote.upsert({
            where: {

                userId_deskItemId: {
                    userId: data.userId,
                    deskItemId: data.deskItemId,
                },
                deskItemId: data.deskItemId,
            },
            create: {
                userId: data.userId,
                deskItemId: data.deskItemId,
                isUpvote: data.isUpvote,
            },
            update: {
                isUpvote: data.isUpvote,
            },
        });
    }
    async removeVote(data: RemoveVoteData): Promise<void> {
        await this.prisma.vote.delete({
            where: { userId_deskItemId: { userId: data.userId, deskItemId: data.deskItemId } },
        });
    }

    async getVotesByDeskItemId(deskItemId: string): Promise<DeskItemVote[]> {
        return this.prisma.vote.findMany({
            where: { deskItemId },
            ...deskItemVoteArgs,
        });
    }
    async downloadDeskItem(input: DownloadDeskItemInput): Promise<void> {
        await this.prisma.download.upsert({
            where: { userId_deskItemId: { userId: input.userId, deskItemId: input.deskItemId } },
            create: {
                userId: input.userId,
                deskItemId: input.deskItemId,
            },
            update: {
                createdAt: new Date(),
            },

        });
    }

}