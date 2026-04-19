export interface DeskItemStorage {
    upload(input: {userId:string, deskId: string, file: File}): Promise<{ path: string; url: string}>;
    delete(path: string): Promise<void>;
}