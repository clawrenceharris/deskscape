import { notebookForDetailArgs } from "@/features/notebook/infrastructure/queries";
import { Prisma } from "@/lib/db/prisma";

export const deskForDetailArgs = {
    include: {
      creator: {
        select: {
          userId: true,
          username: true,
          displayName: true,
          avatarUrl: true,
        },
      },
     
      members: {
        select: {
          profile: {
            select: {
              userId: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
        },
      },
      notebooks: {
        ...notebookForDetailArgs,
        },
        
        

    },
  } satisfies Prisma.DeskDefaultArgs;
  
  export const deskForCardArgs = {
    include: {
      notebooks: {
        take: 99,
        select: {
          id: true,
          title: true,
          createdAt: true,
          creator:{
            select: {
              userId: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          }
          
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      members: {
        select: {
          profile: {
            select: {
              userId: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
        },
      },
      creator: {
        select: {
          userId: true,
          username: true,
          displayName: true,
          avatarUrl: true,
        },
      },
    },
  } satisfies Prisma.DeskDefaultArgs;
  export const schoolDeskForDetailArgs = {
    select: {
      desk: {
        ...deskForDetailArgs,
      }
    },
  } satisfies Prisma.SchoolDeskDefaultArgs;
  export const myDeskForDetailArgs = {
    select: {
      desk:{
        ...deskForDetailArgs,
      },
    },
  } satisfies Prisma.UserDeskDefaultArgs;

  
  export type DeskForDetail = Prisma.DeskGetPayload<typeof deskForDetailArgs>;
  export type SchoolDeskForDetail = Prisma.SchoolDeskGetPayload<typeof schoolDeskForDetailArgs>;
  export type DeskForCard = Prisma.DeskGetPayload<typeof deskForCardArgs>;
  export type MyDeskForDetail = Prisma.UserDeskGetPayload<typeof myDeskForDetailArgs>;