
export type JoinDeskInput = {
    deskId: string;
    userId: string;
    role: "CONTRIBUTOR" | "OWNER" | "VIEWER";
}