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

export interface ILockStatus {
    hostName: string;
    hostEmail: string;
    publicIp: string;
    startedAt: string;
    expiresAt: string;
    status: "starting" | "online" | "stopping" | "offline" 
};

export interface ILocalVariables{
    selectedIndex: number;
    playitggPath: string;
    allocatedRAM: {
        MIN: number,
        MAX: number
    }
}

export interface IStartupOptions {
    folderId: string;
    serverPath: string,
    playitggPath: string;
    RAMoptions: {
        MIN: number;
        MAX: number;
    };
}