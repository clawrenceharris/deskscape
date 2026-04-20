import { Prisma } from "@/lib/db/prisma";
export const notebookMaterialArgs = {
  select: {
    id: true,
    notebookId: true,
    path: true,
    notebook: {
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
export const notebookForDetailArgs = {
    include: {
      votes: {
        select: {
          userId: true,
          isUpvote: true,
          notebookId: true,
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
        
        ...notebookMaterialArgs,
        
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
    
  } satisfies Prisma.NotebookDefaultArgs;
export const notebookForCardArgs = {
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
        ...notebookMaterialArgs,
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
  } satisfies Prisma.NotebookDefaultArgs;

  export const notebookVoteArgs = {
    select: {
      userId: true,
      isUpvote: true,
    },
  } satisfies Prisma.VoteDefaultArgs;
  export type NotebookForDetail = Prisma.NotebookGetPayload<typeof notebookForDetailArgs>;
  export type NotebookForCard = Prisma.NotebookGetPayload<typeof notebookForCardArgs>;
  export type NotebookVote = Prisma.VoteGetPayload<typeof notebookVoteArgs>;
  export type NotebookMaterial = Prisma.MaterialGetPayload<typeof notebookMaterialArgs>;