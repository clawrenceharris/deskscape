import { SupabaseClient } from "@supabase/supabase-js";
import { DeskStorage } from "../../domain/services";

export class SupabaseDeskStorage implements DeskStorage {

    constructor(private readonly supabase: SupabaseClient) {}
    private toSafeFileKeySegment(input: string): string {
        const normalized = input
            .normalize("NFKD")
            .replace(/[^\x00-\x7F]/g, "")
            .replace(/[^a-zA-Z0-9._-]+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^[-.]+|[-.]+$/g, "");
        return normalized || "file";
    }

    async uploadImage(input: {userId:string, deskId: string, file: File}): Promise<{ path: string; url: string }> {
        const { deskId, file,userId } = input;
        const extension = this.toSafeFileKeySegment(file.name.split(".").pop()?.toLowerCase() ?? "jpg");
        const path = `${deskId}/${userId}/image-${Date.now()}.${extension}`;
        const { data, error } = await this.supabase.storage.from('desk').upload(path, file);
        if (error) {
            throw error;
        }
        const {data: {publicUrl}} = this.supabase.storage.from('desk').getPublicUrl(data.path);
        return { path: data.path, url: publicUrl };
    }
    async uploadFile(input: {userId:string, deskId: string, file: File}): Promise<{ path: string; url: string }> {
        const { deskId, file,userId } = input;
        const extension = this.toSafeFileKeySegment(file.name.split(".").pop()?.toLowerCase() ?? "pdf");
        const rawBaseName = file.name.includes(".")
            ? file.name.slice(0, file.name.lastIndexOf("."))
            : file.name;
        const fileName = this.toSafeFileKeySegment(rawBaseName);
        const path = `${deskId}/${userId}/${fileName}-${Date.now()}.${extension}`;
        const { data, error } = await this.supabase.storage.from('desk').upload(path, file);
        if (error) {
            throw error;
        }
        const {data: {publicUrl}} = this.supabase.storage.from('desk').getPublicUrl(data.path);
        return { path: data.path, url: publicUrl };
    }
    async remove(path: string): Promise<void> {
        const { error } = await this.supabase.storage.from('desk').remove([path]);
        if (error) {
            throw error;
        }
    }
}