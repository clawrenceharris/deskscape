"use server";
import { PrismaDeskRepository } from "@/features/desk/infrastructure/repositories";
import { GetDesksUseCase } from "@/features/desk/application/use-cases";
import { prisma } from "@/lib/db/prisma";
import { GetDesksResult } from "@/features/desk/application/dto";

export const getSchoolDesks = async (schoolId: string): Promise<GetDesksResult> => {
    const deskRepository = new PrismaDeskRepository(prisma);
    const getSchoolDesksUseCase = new GetDesksUseCase(deskRepository);
    const result = await getSchoolDesksUseCase.execute({ where: { schoolId } });
    if(!result.success){
        return { success: false, error: result.error };
    }
    return { success: true, data: result.data };
}