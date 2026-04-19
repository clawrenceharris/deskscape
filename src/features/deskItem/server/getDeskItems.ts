"use server";
import { prisma } from "@/lib/db/prisma";
import { GetDeskItemsUseCase } from "../application/use-cases";
import { PrismaDeskItemRepository } from "../infrastructure/repositories";
import { GetDeskItemsInput, GetDeskItemsResult } from "../application/dto";

export async function getDeskItems(input?: GetDeskItemsInput): Promise<GetDeskItemsResult> {
    const repository = new PrismaDeskItemRepository(prisma);
    const useCase = new GetDeskItemsUseCase(repository);  
    const result = await useCase.execute(input);
    return result;
}