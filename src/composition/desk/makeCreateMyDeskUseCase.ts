import { PrismaProfileRepository } from "@/features/profile/infrastructure/repositories";
import { CreateMyDeskUseCase } from "@/features/desk/application/use-cases";
import { PrismaDeskRepository } from "@/features/desk/infrastructure/repositories";
import { prisma } from "@/lib/db/prisma";
export function makeCreateMyDeskUseCase() {
    const deskRepository = new PrismaDeskRepository(prisma);
    const profileRepository = new PrismaProfileRepository(prisma);
    return new CreateMyDeskUseCase(deskRepository, profileRepository);
}