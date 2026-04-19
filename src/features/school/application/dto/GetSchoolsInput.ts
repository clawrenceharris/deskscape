import { Prisma } from "@/lib/db/prisma";

export type GetSchoolsInput = {
    where?: Prisma.SchoolWhereInput;
}