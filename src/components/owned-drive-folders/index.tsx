import { useState } from 'react';
import { Loader2} from 'lucide-react';
import './owned-drive-folders.css'
import { useConfirm } from '../../hooks/useConfirm';
import {IServerFolder} from '../../lib/types.ts'
import ServerSlot from '../server-slot/index.tsx';

type Props = {
    servers: IServerFolder[],
    loadingServers: boolean,
    userEmail: string,
    loadServers: () => void
}

export default function OwnedDriveFolders({servers, loadingServers, userEmail, loadServers}:Props){

    const {confirm, popup} = useConfirm();

    const maxSlots:number = 3;

    const [loadingCreate,setLoadingCreate] = useState<string | null>(null);


    async function handleCreate(key:string){

        const accepted = await confirm({
            message:"Do you want to create a new shared folder in your Google Drive?",
            confirmText:"Yes",
            cancelText:"No"
        })

        if(!accepted)
            return;

        setLoadingCreate(key)
        const result = await window.ipcRenderer.invoke("drive-create-server");
        setLoadingCreate(null)
        if (!result.success)
            alert(result.error);
        else 
            alert("Server created!");

        loadServers();
    }


    return(
        <div className='owned-drive-wrapper'>
            {popup}

            {!servers.length  && <h4>Start by creating your first server folder.</h4>}
            {loadingServers  
                ? <span id='loading-span'>
                    <Loader2 size={24} className='spinner'/>
                    <h4>Loading servers...</h4>
                </span>
                : 
                <ul id='servers-ul'>
                    {servers.filter(server => server.type=== 'owned').map(server => (
                        <li key={server.id}>
                            <ServerSlot server={server} userEmail={userEmail} loadServers={loadServers}/>
                        </li>
                    )).reverse()}

                    {Array.from({ length: maxSlots - servers.length }).map((_, index) => (
                        <li key={`ghost-${index}`}>
                            <span className='first-row'>
                                <span className='list-text ghost'>
                                    + Create New Server
                                </span>

                                <span>
                                    <button 
                                    className='list-button'
                                    style={{backgroundColor:"rgb(10, 30, 10)"}}
                                    disabled={loadingCreate === `ghost-${index}`}
                                    onClick={()=> handleCreate(`ghost-${index}`)}>
                                        {loadingCreate === `ghost-${index}` && <Loader2 size={12} className='spinner'/>}
                                        Create Server
                                    </button>
                                </span>
                            </span>
                            <span className='second-row'>Empty slot</span>
                        </li>
                    ))}
                </ul>
            }
        </div>
    )
}