export const deskKeys = {
    all: ["desks"] as const,
    lists: () => [...deskKeys.all] as const,
    listByUserId: (userId: string) => [...deskKeys.lists(), "user", userId] as const,
    listBySchoolId: (schoolId: string) => [...deskKeys.lists(), "school", schoolId] as const,
    details: () => [...deskKeys.all, "detail"] as const,
    detail: (id: string) => [...deskKeys.details(), id] as const,
}

export const deskItemKeys = {
    all: ["deskItems"] as const,
    lists: () => [...deskItemKeys.all] as const,
    listByDeskId: (deskId: string) => [...deskItemKeys.lists(), deskId] as const,
    listByUserId: (userId: string) => [...deskItemKeys.lists(), "user", userId] as const,
    details: () => [...deskItemKeys.all, "detail"] as const,
    votes: (deskItemId: string) => [...deskItemKeys.all, "votes", deskItemId] as const,
    detail: (id: string) => [...deskItemKeys.details(), id] as const,
}

export const schoolKeys = {
    all: ["schools"] as const,
    lists: () => [...schoolKeys.all] as const,
    list: () => [...schoolKeys.all] as const,
    listByUserId: (userId: string) => [...schoolKeys.list(), "user", userId] as const,
    details: () => [...schoolKeys.all, "detail"] as const,
    detail: (id: string) => [...schoolKeys.all, id] as const,
}

export const profileKeys = {
    all: ["profiles"] as const,
    details: () => [...profileKeys.all, "detail"] as const,
    detail: (userId: string) => [...profileKeys.details(), userId] as const,
}