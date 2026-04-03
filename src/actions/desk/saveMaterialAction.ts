"use server";

import { z } from "zod";
import { makeSaveMaterialToDeskUseCase } from "@/composition/desk/makeSaveMaterialToDeskUseCase";

const schema = z.object({
  materialId: z.string().min(1),
});

export async function saveMaterialAction(rawInput: unknown) {
  const input = schema.parse(rawInput);
  const useCase = makeSaveMaterialToDeskUseCase();

  return useCase.execute(input);
}