import { UpdateNotebookUseCase } from "@/features/notebook/application/use-cases";
import { PrismaNotebookRepository } from "@/features/notebook/infrastructure/repositories";
import { prisma } from "@/lib/db/prisma";
import { SupabaseDeskStorage } from "@/features/desk/infrastructure/storage";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function makeUpdateNotebookUseCase(): Promise<UpdateNotebookUseCase> {
    const supabase = await createServerSupabaseClient();
    const repository = new PrismaNotebookRepository(prisma);
    const storage = new SupabaseDeskStorage(supabase);
    return new UpdateNotebookUseCase(repository, storage);
}