import { Prisma } from "@/lib/db/prisma";

export type GetNotebooksInput = {
    where?: Prisma.NotebookWhereInput;
}