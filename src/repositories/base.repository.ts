// repositories/base.repository.ts
import { camelizeKeys, snakeizeKeys, toSnakeCase } from "@/lib/naming";
import { SupabaseClient } from "@supabase/supabase-js";

export abstract class BaseRepository<
  TDbRow,
  TDomain,
  TDbInsert = TDbRow,
  TDbUpdate = Partial<TDbRow>,
  TInsert = TDomain,
  TUpdate = Partial<TDomain>,
> {
  protected constructor(
    protected readonly client: SupabaseClient,
    protected readonly tableName: string,
  ) {}

  protected toDomain(data: TDbRow): TDomain {
    return camelizeKeys(data) as TDomain;
  }

  protected toDb(data: TInsert | TUpdate): TDbInsert | TDbUpdate {
    return snakeizeKeys(data) as TDbInsert | TDbUpdate;
  }

  protected mapColumn(column: string): string {
    return toSnakeCase(column);
  }

  async getById(id: string): Promise<TDomain> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) throw error;
    return this.toDomain(data);
  }

  async getSingleBy(column: string, value: string): Promise<TDomain | null> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select("*")
      .eq(this.mapColumn(column), value)
      .maybeSingle();
    if (error || !data) return null;
    return this.toDomain(data);
  }

  /**
   * Check if profile exists for user
   */
  async existsById(id: string): Promise<boolean> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select("id")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        if (error.code === "PGRST116") {
          return false;
        }
        throw error;
      }

      return !!data;
    } catch {
      return false;
    }
  }

  async create(data: TInsert): Promise<TDomain> {
    const { data: result, error } = await this.client
      .from(this.tableName)
      .insert(this.toDb(data) as TDbInsert)
      .select()
      .single();

    if (error) throw error;
    return this.toDomain(result);
  }

  async update(id: string, updatedFields: TUpdate): Promise<TDomain> {
    const { data, error } = await this.client
      .from(this.tableName)
      .update(this.toDb(updatedFields) as TDbUpdate)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return this.toDomain(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client
      .from(this.tableName)
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
  async getAllBy(
    column: string,
    value: string,
    tableName?: string,
  ): Promise<TDomain[]> {
    const { data, error } = await this.client
      .from(tableName || this.tableName)
      .select()
      .eq(this.mapColumn(column), value);
    if (error) {
      throw error;
    }
    return (data || []).map((row) => this.toDomain(row));
  }

  async getAll(tableName?: string): Promise<TDomain[]> {
    const { data, error } = await this.client
      .from(tableName || this.tableName)
      .select();
    if (error) {
      throw error;
    }
    return (data || []).map((row) => this.toDomain(row));
  }
}