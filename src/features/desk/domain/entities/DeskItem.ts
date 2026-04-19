import { DeskItemMaterial } from "@/features/deskItem/infrastructure/queries";
import { UserProfile } from "@/features/profile/domain/entities";

/** Snapshot loaded with the item (e.g. aggregate / query). Empty when not included. */
export type DeskItemProps = {
  id: string;
  title: string;
  creatorId: string;
  deskId: string;
  createdAt: string;
  updatedAt: string;
  materials: DeskItemMaterial[];
  creator: UserProfile;
};

export class DeskItem {
  constructor(private readonly props: DeskItemProps) {}

  get id() {
    return this.props.id;
  }
  get creator() {
    return this.props.creator;
  }
  get title() {
    return this.props.title;
  }
  get creatorId() {
    return this.props.creatorId;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
  get deskId() {
    return this.props.deskId;
  }
  get materials() {
    return this.props.materials;
  }
}
