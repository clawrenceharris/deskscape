

interface UserProfileProps {    
    userId: string;
    displayName: string | null;
    username: string;
    avatarUrl: string | null;
}

export class UserProfile {
    constructor(private readonly props: UserProfileProps) {}
    
    get displayName() {
        return this.props.displayName;
    }

    get username() {
        return this.props.username;
    }

   
    get avatarUrl() {
        return this.props.avatarUrl;
    }

    get userId() {
        return this.props.userId;
    }
    getName(currentUserId: string) {
        if (this.props.userId === currentUserId) return "You";
        return this.props.displayName ?? this.props.username;
    }

  
   
}