import { DeskItemVote } from "../../infrastructure/queries";

export type GetVotesResult = {
    success: true;
    data: DeskItemVote[];
} | {
    success: false;
    error: string;
}