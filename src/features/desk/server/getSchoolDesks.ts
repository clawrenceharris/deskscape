"use server";
import { PrismaDeskRepository } from "../infrastructure/repositories";
import { GetDesksUseCase } from "../application/use-cases";
import { prisma } from "@/lib/db/prisma";
import { GetDesksResult } from "../application/dto";

export const getSchoolDesks = async (schoolId: string): Promise<GetDesksResult> => {
    const deskRepository = new PrismaDeskRepository(prisma);
    const getSchoolDesksUseCase = new GetDesksUseCase(deskRepository);
    const result = await getSchoolDesksUseCase.execute({ where: { schoolId } });
    if(!result.success){
        return { success: false, error: result.error };
    }
    return { success: true, data: result.data };
}