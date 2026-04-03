export interface DeskPolicyService {
  canCreateDesk(userId: string): Promise<boolean>;
  canUpdateDesk(userId: string, deskId: string): Promise<boolean>;
  canDeleteDesk(userId: string, deskId: string): Promise<boolean>;
  canViewDesk(userId: string, deskId: string): Promise<boolean>;
}