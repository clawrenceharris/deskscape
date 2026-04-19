import { Prisma } from "@/lib/db/prisma";

export type GetDeskItemsInput = {
    where?: Prisma.DeskItemWhereInput;
}