import { Prisma } from "@/lib/db/prisma";

export const schoolForDetailArgs = {
    select: {
        id: true,
        name: true,
        students: {
            select: {
                userId: true,
                username: true,
                displayName: true,
                avatarUrl: true,
            },
        },
        desks: true,
    },
} satisfies Prisma.SchoolDefaultArgs;

export type SchoolForDetail = Prisma.SchoolGetPayload<typeof schoolForDetailArgs>;