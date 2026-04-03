export class UserProfile {
    constructor(private readonly props: {
        userId: string;
        displayName: string | null;
        username: string;
        avatarPath: string | null;
        avatarUrl: string | null;
    }) {}
    
    get displayName() {
        return this.props.displayName;
    }

    get username() {
        return this.props.username;
    }

    get avatarPath() {
        return this.props.avatarPath;
    }

    get avatarUrl() {
        return this.props.avatarUrl;
    }

    get userId() {
        return this.props.userId;
    }

  
   
}