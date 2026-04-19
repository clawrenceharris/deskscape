import { Material } from "../../domain/entities";
import { MaterialType } from "../../domain/value-objects";

type PrismaMaterialRow = {
  id: string;
  deskItemId: string;
  url: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
};

export function materialMapper(row: PrismaMaterialRow): Material {
  const type =
    MaterialType[row.type as keyof typeof MaterialType] ?? MaterialType.OTHER;
  return new Material({
    id: row.id,
    deskItemId: row.deskItemId,
    url: row.url,
    type,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  });
}
