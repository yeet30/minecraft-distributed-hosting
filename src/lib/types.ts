import { ReactNode } from "react";

export interface IModalItems {
    title: string,
    content: ReactNode
}

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
        hostedAd: string;
        startedAt: string;
        expiresAt: string;
    }
} | null;