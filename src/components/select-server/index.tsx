import './select-server.css'
import { useEffect, useState } from 'react';
import { useServerStore } from '../../store/store'
import { Play, Loader2 } from "lucide-react";
import { IServerFolder } from '../../lib/types';

export default function SelectServer(){

    const {servers, 
        selectedServer, 
        loadingServers,
        loadingHosting, 
        setHostingStatus,
        setLoadingHosting, 
        setServerById, 
        setSelectedIndex
    } = useServerStore();

    const [list, setList] = useState<IServerFolder[]>(servers)
    const [isListOpen, setIsListOpen] = useState(false)
    const [serverDisplay, setServerDisplay] = useState<string>(selectedServer?.name ?? "")

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
        if(loadingServers || !selectedServer) return
        setLoadingHosting(true)
        const res = await window.ipcRenderer.invoke("get-server-lock", selectedServer.id)
        setLoadingHosting(false)
        if(!res.isHosted) {
            setHostingStatus(null)
            return 
        }
        setHostingStatus(res.lock)
    }

    useEffect(()=>{
        setList(servers)
    },[servers])

    useEffect(()=>{
        setServerDisplay(selectedServer?.name ?? "");
        handleLock()
    },[selectedServer])

    return (
        <div className="select-server-wrapper">

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

        </div>
    )
}