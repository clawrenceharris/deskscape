import { GetDeskItemsInput, RemoveVoteData, DownloadDeskItemInput } from "../../application/dto";
import { DeskItemForDetail, DeskItemVote } from "../../infrastructure/queries";
import { CreateDeskItemData, UpdateDeskItemData, VoteDeskItemData } from "../../infrastructure/repositories/types";

export interface DeskItemRepository {
    getAll(input?: GetDeskItemsInput): Promise<DeskItemForDetail[]>;
    create(data: CreateDeskItemData): Promise<DeskItemForDetail>;
    getById(id: string): Promise<DeskItemForDetail | null>;
    delete(id: string): Promise<DeskItemForDetail>;
    vote(data: VoteDeskItemData): Promise<void>;
    removeVote(data: RemoveVoteData): Promise<void>;
    getVotesByDeskItemId(deskItemId: string): Promise<DeskItemVote[]>;
    downloadDeskItem(input: DownloadDeskItemInput): Promise<void>;
    update(data: UpdateDeskItemData): Promise<DeskItemForDetail>;
}
