import { UserProfile } from "@/features/profile/domain/entities";
import { MaterialType } from "@/types";

export type MaterialProps = {
  id: string;
  deskItemId: string;
  url: string;
  type: MaterialType;
  title: string | null;
  fileName: string | null;
  mimeType: string | null;
  createdAt: string;
  updatedAt: string;
  author: UserProfile;
};

export class Material {
  constructor(private readonly props: MaterialProps) {}

  get id() {
    return this.props.id;
  }
  get deskItemId() {
    return this.props.deskItemId;
  }
  get url() {
    return this.props.url;
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
  get title() {
    return this.props.title;
  }
  get fileName() {
    return this.props.fileName;
  }
  get mimeType() {
    return this.props.mimeType;
  }
  get author() {
    return this.props.author;
  }
}
