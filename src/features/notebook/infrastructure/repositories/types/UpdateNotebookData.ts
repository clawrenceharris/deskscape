
export type UpdateNotebookData = {
    notebookId: string;
    title?: string;
    description?: string | null;
    materialsToCreate?: {
        type: "NOTES" | "QUIZ" | "WORKSHEET" | "STUDY_GUIDE" | "OTHER";
        url: string;
        path: string;
        title: string;
        mimeType: string;
        authorId: string;
    }[];
    materialIdsToDelete?: string[];
}
