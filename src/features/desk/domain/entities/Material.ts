import { MaterialType } from "@/features/materials/domain/value-objects";

export class Material {
  constructor(private readonly props: {
    id: string;
    title: string;
    type: MaterialType;
    url: string;
    path: string;
    createdAt: Date;
    description: string;
    subject: string;
    updatedAt: Date;
    creatorId: string;
    deskItemId: string;
  }) {}
  get id() {
    return this.props.id;
  }
  get title() {
    return this.props.title;
  }
 
  get type() {
    return this.props.type;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
  get creatorId() {
    return this.props.creatorId;
  }
  get deskItemId() {
    return this.props.deskItemId;
  }
  get subject() {
    return this.props.subject;
  }
  get url() {
    return this.props.url;
  }
  get path() {
    return this.props.path;
  }
}