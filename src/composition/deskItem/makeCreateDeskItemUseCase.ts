import { CreateDeskItemUseCase } from "@/features/deskItem/application/use-cases";
import { prisma } from "@/lib/db/prisma";
import { SupabaseDeskStorage } from "@/features/desk/infrastructure/storage";
import { PrismaDeskItemRepository } from "@/features/deskItem/infrastructure/repositories/PrismaDeskItemRepository";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function makeCreateDeskItemUseCase() {
    const supabase = await createServerSupabaseClient();
    const repository = new PrismaDeskItemRepository(prisma);
    const storage = new SupabaseDeskStorage(supabase);
    return new CreateDeskItemUseCase(repository, storage);
}