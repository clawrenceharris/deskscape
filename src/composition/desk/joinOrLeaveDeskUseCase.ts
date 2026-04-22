import { JoinDeskUseCase } from "@/features/desk/application/use-cases";
import { PrismaDeskRepository } from "@/features/desk/infrastructure/repositories/PrismaDeskRepository";
import { prisma } from "@/lib/db/prisma";

export function joinOrLeaveDeskUseCase() {
    const deskRepository = new PrismaDeskRepository(prisma);
    return new JoinDeskUseCase(deskRepository);
}