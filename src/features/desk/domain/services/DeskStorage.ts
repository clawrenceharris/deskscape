export interface DeskStorage {
    uploadImage(input: {userId:string, deskId: string, file: File}): Promise<{ path: string; url: string }>;
    uploadFile(input: {userId:string, deskId: string, file: File}): Promise<{ path: string; url: string }>;
    remove(path: string): Promise<void>;
}