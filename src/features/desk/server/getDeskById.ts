"use server";
import { prisma } from "@/lib/db/prisma";
import { DeskForDetail } from "../infrastructure/queries";
import { ActionResultWithData } from "@/actions";
import { PrismaDeskRepository } from "../infrastructure/repositories";
import { getUserErrorMessage } from "@/lib/utils/errors";

export async function getDeskById(deskId: string):Promise<ActionResultWithData<DeskForDetail | null>> {
    try {
        const deskRepository = new PrismaDeskRepository(prisma);
        const desk = await deskRepository.getById(deskId);
        return { success: true, data: desk };
    } catch (error) {
        return { success: false, error: getUserErrorMessage(error) };
    }
}