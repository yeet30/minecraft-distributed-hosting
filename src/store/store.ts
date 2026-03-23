import { create } from "zustand";
import { IServerFolder } from "../lib/types";

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

    setServerById: (id: string) => void;
    setServerByIndex: (index: number) => void;

    loadServers: () => Promise<void>;
}

const useServerStore = create<ServerStore>((set,get) => ({
    servers: [],
    selectedServer: null,
    loadingServers: false,
    serversErrors: "",

    setServerById: (id:string) => set({ selectedServer: get().servers.find(server=> server.id === id) }),
    setServerByIndex: (index: number) => set({ selectedServer: get().servers[index] }),

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
                selectedServer: servers[0] ?? null,
                serversErrors: (!ownedResult.success ? ownedResult.error : '') + (!joinedResult.success ? joinedResult.error : ''),
                loadingServers: false
            });
        }
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
                loadingUser: false
            });
        },

    checkDriveScope: 
        async function() {
            const res = await window.ipcRenderer.invoke("is-request-allowed")
            set({driveScopeAllowed: res})
        },
}))

export {useServerStore, useUserStore};