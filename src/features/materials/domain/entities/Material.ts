// src/features/materials/domain/entities/Material.ts
import { Visibility } from "../value-objects/Visibility";
import { MaterialType } from "../value-objects/MaterialType";

type MaterialProps = {
  id: string;
  title: string;
  description: string;
  type: MaterialType;
  subject: string;
  authorId: string;
  visibility: Visibility;
  createdAt: Date;
};

export class Material {
  constructor(private readonly props: MaterialProps) {}

  get id() {
    return this.props.id;
  }

  get title() {
    return this.props.title;
  }

  get visibility() {
    return this.props.visibility;
  }

  isPublic() {
    return this.props.visibility === "public";
  }
}