import { create } from "zustand";
import { IServerFolder, ILockStatus } from "../lib/types";

type UserStore = {
    userName: string;
    userEmail: string;
    userPicture: string;
    loadingUser: boolean;
    driveScopeAllowed: false;

    checkDriveScope: () => Promise<void>;
    loadUser: () => Promise<void>;
}

type ServerStore = {
    servers: IServerFolder[];
    selectedServer: IServerFolder | null;
    loadingServers: boolean;
    serversErrors: string;
    lockStatus: ILockStatus;
    loadingHosting: boolean;
    serverRunning: boolean;
    
    setLoadingHosting: (loading: boolean) => void,
    setLockStatus: (status: ILockStatus) => void;
    setServerById: (id: string) => void;
    setServerRunning: (isRunning: boolean) => void,
    setServerByIndex: (index:number) => void
    loadServers: () => Promise<void>;
}

export interface LocalVariables{
    selectedIndex: number;
    playitggPath: string;
    allocatedRAM: {
        MIN: number,
        MAX: number
    }

    loadLocalVariables: () => Promise<void>
    setSelectedIndex: (index: number) => Promise<void>
    setAllocatedRAM: (min: number, max: number) => Promise<void>
    setPlayitggPath: (path: string) => void
};

const useServerStore = create<ServerStore>((set,get) => ({
    servers: [],
    selectedServer: null,
    loadingServers: false,
    serversErrors: "",
    lockStatus: {
        hostName: "",
        hostEmail: "",
        publicIp: "",
        startedAt: "",
        expiresAt: "",
        status:  "offline" 
    },
    loadingHosting: true,
    serverRunning: false,

    setLoadingHosting: (loading: boolean) => set({loadingHosting: loading}),
    setLockStatus: (status: ILockStatus) => set({lockStatus: status}),
    setServerRunning: (isRunning: boolean) => set({serverRunning: isRunning}),
    setServerById: (id:string) => set({ selectedServer: get().servers.find(server=> server.id === id) }),
    setServerByIndex: (index:number) => set({ selectedServer: get().servers[index] ?? get().servers[0] ?? null }),

    loadServers : 
        async function() {
            set({ loadingServers: true });

            const ownedResult = await window.ipcRenderer.invoke("drive-get-root");
            const joinedResult = await window.ipcRenderer.invoke("get-joined-folders");

            const owned = ownedResult.success ? ownedResult.servers : [];
            const joined = joinedResult.success ? joinedResult.servers : [];
            const servers = [...owned, ...joined];

            set({
                servers,
                serversErrors: (!ownedResult.success ? ownedResult.error : '') + (!joinedResult.success ? joinedResult.error : ''),
                loadingServers: false
            });
        },

    
}));

const useUserStore = create<UserStore>((set) => ({
    userName: "", 
    userEmail: "", 
    userPicture: "",
    loadingUser: false,
    driveScopeAllowed: false,

    loadUser : 
        async function() {
            set({ loadingUser: true });
            const user = await window.ipcRenderer.invoke("google-get-user");
            set({
                userName: user.name,
                userEmail: user.email,
                userPicture: user.picture,
                loadingUser: false,
            });
        },

    checkDriveScope: 
        async function() {
            const res = await window.ipcRenderer.invoke("is-request-allowed")
            set({driveScopeAllowed: res})
        },
}))

const useLocalStore = create<LocalVariables>((set) => ({
    selectedIndex: 0,
    playitggPath: "",
    allocatedRAM: {
        MIN: 2048,
        MAX: 4096,
    },

    loadLocalVariables:
        async function() {
            const path = await window.ipcRenderer.invoke("get-local-variable", "playitggPath")
            const index = await window.ipcRenderer.invoke("get-local-variable", "selectedIndex")
            const allocatedRAM = await window.ipcRenderer.invoke("get-local-variable", "allocatedRAM")
            
            set({
                playitggPath: path,
                selectedIndex: index,
                allocatedRAM: allocatedRAM || {MIN: 2048, MAX: 4096},
            })
        },

    setSelectedIndex:
        async function(index:number) {
            await window.ipcRenderer.invoke("set-local-variable", "selectedIndex" ,index)
        },

    setAllocatedRAM:
        async function (min: number, max: number){
            const allocatedRAM = {
                MIN: min,
                MAX: max
            }
            set({allocatedRAM: allocatedRAM})
            await window.ipcRenderer.invoke("set-local-variable", "allocatedRAM", allocatedRAM)
        },
    
    setPlayitggPath: 
        async function (path: string) {
            await window.ipcRenderer.invoke("set-local-variable", "playitggPath", path)
            set({playitggPath:path})
        }
}))



export {useServerStore, useUserStore, useLocalStore};