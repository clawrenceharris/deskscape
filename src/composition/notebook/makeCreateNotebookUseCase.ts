import { CreateNotebookUseCase } from "@/features/notebook/application/use-cases";
import { prisma } from "@/lib/db/prisma";
import { SupabaseDeskStorage } from "@/features/desk/infrastructure/storage";
import { PrismaNotebookRepository } from "@/features/notebook/infrastructure/repositories/PrismaNotebookRepository";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function makeCreateNotebookUseCase() {
    const supabase = await createServerSupabaseClient();
    const repository = new PrismaNotebookRepository(prisma);
    const storage = new SupabaseDeskStorage(supabase);
    return new CreateNotebookUseCase(repository, storage);
}