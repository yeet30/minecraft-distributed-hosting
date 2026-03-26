export interface IPermittedUser{
    id:string,
    type:string, 
    emailAddress:string, 
    role:string, 
    displayName:string
}

export interface IServerFolder { 
    type: 'owned' | 'joined',
    id: string; 
    name: string; 
    path: string; 
    permittedUsers: IPermittedUser[]
}

export type THostingStatus = {
    isHosted: boolean,
    lock: {
        hostName: string;
        hostEmail: string;
        startedAt: string;
        expiresAt: string
    }
} | null;