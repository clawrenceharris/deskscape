import { CreateOrUpdateProfileUseCase } from "@/features/profile/application/use-cases";
import { PrismaUserProfileRepository } from "@/features/profile/infrastructure/repositories";
import { SupabaseAvatarStorage } from "@/features/profile/infrastructure/storage";
import { prisma } from "@/lib/db/prisma";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function makeCreateOrUpdateProfileUseCase() {
    const userProfileRepository = new PrismaUserProfileRepository(prisma);
    const supabase = await createServerSupabaseClient();
    const avatarStorage = new SupabaseAvatarStorage(supabase);
    return new CreateOrUpdateProfileUseCase(userProfileRepository, avatarStorage);
}