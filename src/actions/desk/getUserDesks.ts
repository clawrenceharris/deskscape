"use server";
import { prisma } from "@/lib/db/prisma";
import { GetDesksUseCase } from "@/features/desk/application/use-cases";
import { PrismaDeskRepository } from "@/features/desk/infrastructure/repositories";
import { GetDesksResult } from "@/features/desk/application/dto";

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