"use server";
import { ActionResultWithData } from "@/actions";
import { prisma } from "@/lib/db/prisma";
import { DeskItemForDetail } from "../infrastructure/queries";
import { getUserErrorMessage } from "@/lib/utils/errors";
import { PrismaDeskItemRepository } from "../infrastructure/repositories";

export async function getDeskItemById(id: string): Promise<ActionResultWithData<DeskItemForDetail | null>> {
    try{   
        const deskItemRepository = new PrismaDeskItemRepository(prisma);
        const item = await deskItemRepository.getById(id);
        return { success: true, data: item };
    } catch (error) {
        return { success: false, error: getUserErrorMessage(error) };
    }
}