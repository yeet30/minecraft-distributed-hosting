/// <reference types="vite/client" />

interface Window {
    ipcRenderer: {
        invoke: (channel: string,...args: any[]) => Promise<any>;
    }
}