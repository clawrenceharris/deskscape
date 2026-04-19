import { Prisma } from "@/lib/db/prisma";
export const deskItemMaterialArgs = {
  select: {
    id: true,
    deskItemId: true,
    path: true,
    deskItem: {
      select: {
        id: true,
        deskId: true,
        title: true,
      },
    },
    url: true,
    title: true,
    updatedAt: true,
  },
} satisfies Prisma.MaterialDefaultArgs;
export const deskItemForDetailArgs = {
    include: {
      votes: {
        select: {
          userId: true,
          isUpvote: true,
          deskItemId: true,
        },
      },
      downloads: {
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
      materials: {
        
        ...deskItemMaterialArgs,
        
      },
      creator: {
        select: {
          userId: true,
          username: true,
          displayName: true,
          avatarUrl: true,
        },
      },
    }
    
  } satisfies Prisma.DeskItemDefaultArgs;
export const deskItemCardArgs = {
    select: {
      votes: {
        select: {
          userId: true,
          isUpvote: true,
        },
      },
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      materials: {
        take: 3,
        select:{
          title: true,
          url: true,
          updatedAt: true,
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
    }
  } satisfies Prisma.DeskItemDefaultArgs;

  export const deskItemVoteArgs = {
    select: {
      userId: true,
      isUpvote: true,
    },
  } satisfies Prisma.VoteDefaultArgs;
  export type DeskItemForDetail = Prisma.DeskItemGetPayload<typeof deskItemForDetailArgs>;
  export type DeskItemForCard = Prisma.DeskItemGetPayload<typeof deskItemCardArgs>;
  export type DeskItemVote = Prisma.VoteGetPayload<typeof deskItemVoteArgs>;
  export type DeskItemMaterial = Prisma.MaterialGetPayload<typeof deskItemMaterialArgs>;