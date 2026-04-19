"use server"
import { prisma } from "@/lib/db/prisma";
import { GetSchoolsUseCase } from "../application/use-cases";
import { PrismaSchoolRepository } from "../infrastructure/repositories";
import { GetSchoolsResult } from "../application/dto";

export async function getUserSchools (userId: string): Promise<GetSchoolsResult>{
    const schoolRepository = new PrismaSchoolRepository(prisma);
    const useCase = new GetSchoolsUseCase(schoolRepository);
    const result = await  useCase.execute({ where:{
            students: { some: { userId } },
        
        }
    });
    
    return result;
}