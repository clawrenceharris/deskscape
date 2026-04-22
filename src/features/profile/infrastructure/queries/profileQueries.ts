import { deskForDetailArgs } from "@/features/desk/infrastructure/queries";
import { Prisma } from "@/lib/db/prisma";

export const profileForDetailArgs = {
    include: {
        school: {
            select: {
                id: true,
                name: true,
            },
        },
        createdDesks: {
            ...deskForDetailArgs,
        },
        memberships: {
            select: {
                id: true,
                desk: {
                    ...deskForDetailArgs,
                },
            },
        },
        notebooks: {
            select: {
                id: true,
                title: true,
                votes: true,
                materials: true,
            },
        },
        myDesk: {
            select:{
                desk:{
                    ...deskForDetailArgs,
                }
            }
                
                
        },
    },
    
  } satisfies Prisma.ProfileDefaultArgs;

  export const profileForButtonArgs = {
    select: {
      userId: true,
      username: true,
      displayName: true,
      avatarUrl: true,
    },
  } satisfies Prisma.ProfileDefaultArgs;
  export type ProfileForDetail = Prisma.ProfileGetPayload<typeof profileForDetailArgs>;
  export type ProfileForButton = Prisma.ProfileGetPayload<typeof profileForButtonArgs>;
  