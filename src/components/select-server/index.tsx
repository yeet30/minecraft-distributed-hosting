import './select-server.css'
import { useEffect, useState } from 'react';
import { useServerStore, useUserStore, useLocalStore } from '../../store/store'
import { Play, Loader2 } from "lucide-react";
import { IServerFolder } from '../../lib/types';

export default function SelectServer(){

    const { setSelectedIndex } = useLocalStore();
    const {userEmail} = useUserStore();
    const {servers, 
        selectedServer, 
        loadingServers,
        loadingHosting,
        lockStatus,
        setLockStatus,
        setLoadingHosting, 
        setServerById, 
    } = useServerStore();

    const [list, setList] = useState<IServerFolder[]>(servers)
    const [isListOpen, setIsListOpen] = useState(false)
    const [serverDisplay, setServerDisplay] = useState<string>(selectedServer?.name ?? "")

    function getHostingMessage(): string {
        switch (lockStatus && lockStatus.status) {
            case "online":
            return `is currently hosted by ${lockStatus.hostEmail === userEmail ? "you" : lockStatus.hostName}${lockStatus.publicIp ? " at:": "."}`;
            case "starting":
            return "is starting the hosting...";
            case "stopping":
            return "is stopping the hosting...";
            default:
            return "is not being hosted right now.";
        }
    }

    function handleButton(){
        setIsListOpen(!isListOpen)
    }

    function handleSelect(serverId: string){
        const index = list.findIndex(server => server.id === serverId);
        const selected = list[index];
        if(!selected) return;
        setIsListOpen(false)
        setSelectedIndex(index)
        setServerById(selected.id)
        setServerDisplay(selected.name)
    }

    async function handleLock(){
        if (loadingServers || !selectedServer?.id) return
        setLoadingHosting(true)
        try {
            const lockRes = await window.ipcRenderer.invoke("get-server-lock", selectedServer.id)
            setLockStatus(lockRes.lockData)
        } catch (err) {
            console.error("Failed to get server lock:", err)
        } finally {
            setLoadingHosting(false)
        }
    }    

    useEffect(()=>{
        if (!selectedServer) return;
        setServerDisplay(selectedServer?.name ?? "");
        
        handleLock();
    },[selectedServer])

    useEffect(()=>{
        setList(servers)
    },[servers])


    return (
        <div className="select-server-wrapper">
            <span>
                <button className={`select-button ${isListOpen && 'open'}`} onClick={handleButton}>
                    <span className='button-title'>
                        {(loadingServers || loadingHosting)
                            ? <p><Loader2 size={12} className='spinner'/> Loading</p>
                            : serverDisplay
                        }
                    </span>
                    <Play size={12} className={`server-arrow ${isListOpen && 'open'}`} fill="currentColor"/>
                </button>

                <div className={`server-drawer ${isListOpen && 'open'}`}>
                    <span className='owned'>
                        {list.filter((server) => server.type === "owned" ).length>0 
                            && <span className='server-type'>
                                Owned
                            </span>
                        }
                    </span>
                    {list.filter((server) => server.type === "owned" ).map(server => (
                        <span className='server-item' key={server.id} onClick={()=>handleSelect(server.id)}>
                            <span className='item-text'>{server.name}</span>
                        </span>
                    ))}
                    <span className='joined'>
                        {list.filter((server) => server.type === "joined" ).length > 0 
                            && <span className='server-type'>
                                Joined
                            </span>
                        }
                    </span>
                    {list.filter((server) => server.type === "joined" ).map(server => (
                        <span className='server-item' key={server.id} onClick={()=>handleSelect(server.id)}>
                            <span className='item-text'>{server.name}</span>
                        </span>
                    ))}
                </div>
            </span>
            <h4>
                {loadingHosting
                    ? "... the server"
                    : getHostingMessage()
                }
            </h4>
        </div>
    )
}