"use server";
import { GetDesksInput, GetDesksResult } from "@/features/desk/application/dto";
import { GetDesksUseCase } from "@/features/desk/application/use-cases";
import { PrismaDeskRepository } from "@/features/desk/infrastructure/repositories";
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