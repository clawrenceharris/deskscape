export interface BaseRepository<TDomain> {
  getById(id: string): Promise<TDomain | null>;
  getSingleBy(column: string, value: string): Promise<TDomain | null>;
  existsById(id: string): Promise<boolean>;
  create(data: TDomain): Promise<TDomain>;
  update(id: string, updatedFields: Partial<TDomain>): Promise<TDomain>;
  delete(id: string): Promise<void>;
  getAllBy(column: string, value: string, tableName?: string): Promise<TDomain[]>;
  getAll(tableName?: string): Promise<TDomain[]>;

}