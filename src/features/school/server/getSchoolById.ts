"use server";
import { prisma } from "@/lib/db/prisma";
import { PrismaSchoolRepository } from "../infrastructure/repositories";
import { getUserErrorMessage } from "@/lib/utils/errors";
import { ActionResultWithData } from "@/actions";
import { SchoolForDetail } from "../infrastructure/queries";

export async function getSchoolById(schoolId: string): Promise<ActionResultWithData<SchoolForDetail | null>> {
    try {
        const schoolRepository = new PrismaSchoolRepository(prisma);
        const school = await schoolRepository.getSchoolById(schoolId);
        return { success: true as const, data: school };
    } catch (error) {
        return { success: false as const, error: getUserErrorMessage(error) };
    }
}