import { PrismaDeskRepository } from "@/features/desk/infrastructure/repositories/PrismaDeskRepository";
import { prisma } from "@/lib/db/prisma";
import { CreateDeskUseCase } from "@/features/desk/application/use-cases/CreateDeskUseCase";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { SupabaseDeskStorage } from "@/features/desk/infrastructure/storage";

export async function makeCreateDeskUseCase() {
    const deskRepository = new PrismaDeskRepository(prisma);
    const supabase = await createServerSupabaseClient();
    const storage = new SupabaseDeskStorage(supabase);
    return new CreateDeskUseCase(deskRepository, storage);
}
