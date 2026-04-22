export type JoinOrLeaveDeskInput = {
    isJoining?: true;
    deskId: string;
    userId: string;
    role: "CONTRIBUTOR" | "OWNER" | "VIEWER"
} | {
    deskId: string;
    userId: string;
    isJoining?: false
}