import { Prisma } from "@/lib/db/prisma";

export type GetDesksInput = {
    where?: Prisma.DeskWhereInput;  
}