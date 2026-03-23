import './select-server.css'
import { useEffect, useState } from 'react';
import { useServerStore } from '../../store/store'
import { Play } from "lucide-react";
import { IServerFolder } from '../../lib/types';

export default function SelectServer(){

    const {servers, selectedServer, setServerById} = useServerStore();

    const [list, setList] = useState<IServerFolder[]>(servers)
    const [isListOpen, setIsListOpen] = useState(false)
    const [serverDisplay, setServerDisplay] = useState<string>(selectedServer?.name ?? "")

    function handleButton(){
        setIsListOpen(!isListOpen)
    }

    function handleSelect(serverId: string){
        const selected = list.find(server => server.id === serverId)
        if(!selected) return;
        setIsListOpen(false)
        setServerById(selected.id)
        setServerDisplay(selected.name)
    }

    useEffect(()=>{
        setList(servers)
    },[servers])

    return (
        <div className="select-server-wrapper">

            <button className={`select-button ${isListOpen && 'open'}`} onClick={handleButton}>
                <span className='button-title'>{serverDisplay}</span>
                <Play size={12} className={`server-arrow ${isListOpen && 'open'}`} fill="currentColor"/>
            </button>

            <div className={`server-drawer ${isListOpen && 'open'}`}>
                <span className='owned'>
                    <span className='server-type'>
                        Owned
                    </span>
                </span>
                {list.filter((server) => server.type === "owned" ).map(server => (
                    <span className='server-item' key={server.id} onClick={()=>handleSelect(server.id)}>
                        <span className='item-text'>{server.name}</span>
                    </span>
                ))}
                <span className='joined'>
                    <span className='server-type'>
                        Joined
                    </span>
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