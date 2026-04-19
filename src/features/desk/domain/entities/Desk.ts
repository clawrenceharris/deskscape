import type { DeskItem } from "./DeskItem";

export type DeskProps = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  schoolId: string;
  imageUrl: string | null;
  imagePath: string | null;
  isPublic: boolean;
  creatorId: string;
  /** Child entities; no back-reference to `Desk` on each item. */
  items: DeskItem[];
};

export class Desk {
  constructor(private readonly props: DeskProps) {}

  get id() {
    return this.props.id;
  }
  get name() {
    return this.props.name;
  }
  get items() {
    return this.props.items;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
  get schoolId() {
    return this.props.schoolId;
  }
  get imageUrl() {
    return this.props.imageUrl;
  }
  get imagePath() {
    return this.props.imagePath;
  }
  get isPublic() {
    return this.props.isPublic;
  }
  get creatorId() {
    return this.props.creatorId;
  }
}
