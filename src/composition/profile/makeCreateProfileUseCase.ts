import { PrismaDeskRepository } from "@/features/desk/infrastructure/repositories";
import { CreateProfileUseCase } from "@/features/profile/application/use-cases";
import { PrismaProfileRepository } from "@/features/profile/infrastructure/repositories";
import { SupabaseAvatarStorage } from "@/features/profile/infrastructure/storage";
import { PrismaSchoolRepository } from "@/features/school/infrastructure/repositories";
import { prisma } from "@/lib/db/prisma";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function makeCreateProfileUseCase() {
    const supabase = await createServerSupabaseClient();

    const profileRepository = new PrismaProfileRepository(prisma);
    const schoolRepository = new PrismaSchoolRepository(prisma);
    const avatarStorage = new SupabaseAvatarStorage(supabase);
    const deskRepository = new PrismaDeskRepository(prisma);
    return new CreateProfileUseCase(profileRepository, avatarStorage, schoolRepository, deskRepository);
}