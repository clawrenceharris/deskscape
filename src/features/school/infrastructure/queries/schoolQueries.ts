import { deskForDetailArgs } from "@/features/desk/infrastructure/queries";
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
        schoolDesk: {
            select: {
                desk: {
                    ...deskForDetailArgs,
                },
            },
        },
        desks: true,
    },
} satisfies Prisma.SchoolDefaultArgs;

export type SchoolForDetail = Prisma.SchoolGetPayload<typeof schoolForDetailArgs>;