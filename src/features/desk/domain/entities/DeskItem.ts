


export type DeskItemProps = {
  id: string;
  title: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  deskId: string;
} 
export class DeskItem {
  constructor(private readonly props: DeskItemProps) {} 

  get id() {
    return this.props.id;
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
}