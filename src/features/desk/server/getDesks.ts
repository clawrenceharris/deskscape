"use server";
import { GetDesksInput, GetDesksResult } from "../application/dto";
import { GetDesksUseCase } from "../application/use-cases";
import { PrismaDeskRepository } from "../infrastructure/repositories";
import { prisma } from "@/lib/db/prisma";

export async function getDesks(input?: GetDesksInput): Promise<GetDesksResult> {
    const deskRepository = new PrismaDeskRepository(prisma);
    const getAllDesksUseCase = new GetDesksUseCase(deskRepository);
    const result = await getAllDesksUseCase.execute(input);
    if(!result.success){
        return { success: false, error: result.error };
    }
    return { success: true, data: result.data };
}