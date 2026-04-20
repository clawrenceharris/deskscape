export type CreateNotebookData = {
    title: string;
    description: string | null;
    deskId: string;
    creatorId: string;
    materials: {
        type: "NOTES" | "QUIZ" | "WORKSHEET" | "STUDY_GUIDE" | "OTHER";
        url: string;
        path: string;
        title: string;
        mimeType: string;
        authorId: string;
    }[];
}