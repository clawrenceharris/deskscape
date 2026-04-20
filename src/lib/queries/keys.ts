export const deskKeys = {
    all: ["desks"] as const,
    lists: () => [...deskKeys.all] as const,
    listByUserId: (userId: string) => [...deskKeys.lists(), "user", userId] as const,
    listBySchoolId: (schoolId: string) => [...deskKeys.lists(), "school", schoolId] as const,
    details: () => [...deskKeys.all, "detail"] as const,
    detail: (deskId: string) => [...deskKeys.details(), deskId] as const,
}

export const notebookKeys = {
    all: ["notebooks"] as const,
    lists: () => [...notebookKeys.all] as const,
    listByDeskId: (deskId: string) => [...notebookKeys.lists(), deskId] as const,
    listByUserId: (userId: string) => [...notebookKeys.lists(), "user", userId] as const,
    details: () => [...notebookKeys.all, "detail"] as const,
    votes: (notebookId: string) => [...notebookKeys.all, "votes", notebookId] as const,
    detail: (notebookId: string) => [...notebookKeys.details(), notebookId] as const,
}

export const schoolKeys = {
    all: ["schools"] as const,
    lists: () => [...schoolKeys.all] as const,
    list: () => [...schoolKeys.all] as const,
    listByUserId: (userId: string) => [...schoolKeys.list(), "user", userId] as const,
    details: () => [...schoolKeys.all, "detail"] as const,
    detail: (schoolId: string) => [...schoolKeys.all, schoolId] as const,
}

export const profileKeys = {
    all: ["profiles"] as const,
    details: () => [...profileKeys.all, "detail"] as const,
    detail: (userId: string) => [...profileKeys.details(), userId] as const,
}