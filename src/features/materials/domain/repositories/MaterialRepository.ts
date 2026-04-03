import { Material } from "../entities/Material";

export interface MaterialRepository {
  findById(id: string): Promise<Material | null>;
  findPublic(filters?: {
    subject?: string;
    type?: string;
  }): Promise<Material[]>;
  create(material: Material): Promise<Material>;
}