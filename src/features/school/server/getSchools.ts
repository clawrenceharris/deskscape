"use server";
import { makeGetAllSchoolsUseCase } from "@/composition/school";
import { GetSchoolsInput, GetSchoolsResult } from "../application/dto";

export async function getSchools(input?: GetSchoolsInput): Promise<GetSchoolsResult>{
    
    const getAllSchoolsUseCase = makeGetAllSchoolsUseCase();
    const result = await getAllSchoolsUseCase.execute(input);
    if(!result.success){
        return { success: false, error: result.error };
    }
    return { success: true, data: result.data };
}