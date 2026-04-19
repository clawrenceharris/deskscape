"use server";
import { prisma } from "@/lib/db/prisma";
import { GetDesksUseCase } from "../application/use-cases";
import { PrismaDeskRepository } from "../infrastructure/repositories";
import { GetDesksResult } from "../application/dto";

export async function getUserDesks (userId: string): Promise<GetDesksResult> {
    const deskRepository = new PrismaDeskRepository(prisma);
    const getUserDesksUseCase = new GetDesksUseCase(deskRepository);
    const result = await  getUserDesksUseCase.execute({ 
        where: { 
            OR: [
                { creator: { userId } },
                { members: { some: { profile: { userId } } } },
              ],
        }
    });
    
    return result;
}