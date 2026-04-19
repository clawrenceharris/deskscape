"use server";

import { makeGetVotesByDeskItemUseCase } from "@/composition/deskItem";
import { GetVotesResult } from "../application/dto/GetVotesResult";
export async function getVotesByDeskItemId(deskItemId: string): Promise<GetVotesResult> {
    const useCase = await makeGetVotesByDeskItemUseCase();
    const result = await useCase.execute(deskItemId);
    return result;
    
}