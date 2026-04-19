"use server";

import { makeDownloadDeskItemUseCase } from "@/composition/deskItem";
import { ActionResult } from "..";
import { DownloadDeskItemInput } from "@/features/deskItem/application/dto";

export async function downloadDeskItemAction(input: DownloadDeskItemInput):Promise<ActionResult> {
  const useCase = await makeDownloadDeskItemUseCase();
  const result = await useCase.execute(input);
  return result;
}