import { UpdateDeskItemUseCase } from "@/features/deskItem/application/use-cases";
import { PrismaDeskItemRepository } from "@/features/deskItem/infrastructure/repositories";
import { prisma } from "@/lib/db/prisma";
import { SupabaseDeskStorage } from "@/features/desk/infrastructure/storage";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function makeUpdateDeskItemUseCase(): Promise<UpdateDeskItemUseCase> {
    const supabase = await createServerSupabaseClient();
    const repository = new PrismaDeskItemRepository(prisma);
    const storage = new SupabaseDeskStorage(supabase);
    return new UpdateDeskItemUseCase(repository, storage);
}