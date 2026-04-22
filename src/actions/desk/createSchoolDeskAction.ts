"use server";
import { makeCreateSchoolDeskUseCase } from "@/composition/desk";
import { ActionResultWithData } from "../index";
import { SchoolDeskForDetail } from "@/features/desk/infrastructure/queries";
import { getUserErrorMessage } from "@/lib/utils/errors";

export async function createSchoolDeskAction(schoolId: string): Promise<ActionResultWithData<SchoolDeskForDetail>> {
    try {
        const useCase = makeCreateSchoolDeskUseCase();
        const result = await useCase.execute(schoolId);
        if(!result.success){
            return { success: false as const, error: result.error.message };
        }
        return result;
    } catch (error) {
        return { success: false as const, error: getUserErrorMessage(error) };
    }
}