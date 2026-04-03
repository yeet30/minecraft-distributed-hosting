import { useState } from 'react';
import { Loader2} from 'lucide-react';
import './owned-drive-folders.css'
import { useConfirm } from '../../hooks/useConfirm';
import ServerSlot from '../server-slot/index.tsx';
import { useServerStore } from '../../store/store.ts';

export default function OwnedDriveFolders(){

    const { servers, loadingServers, loadServers } = useServerStore();
    const {confirm, popup} = useConfirm();
    const maxSlots:number = 3;
    const [loadingCreate,setLoadingCreate] = useState(false);

    async function handleCreate(){

        const acceptedCreate = await confirm({
            message:"Do you want to create a new shared folder in your Google Drive?",
            confirmText:"Yes",
            cancelText:"No"
        })

        if(!acceptedCreate)
            return;

        setLoadingCreate(true)
        const result = await window.ipcRenderer.invoke("drive-create-server");
        
        if (!result.success) {
            alert(result.error);
            setLoadingCreate(false)
            return
        }

        const acceptPath = await confirm({
            message: `Choose the local folder path for your server. The files will be downloaded to and uploaded from here.`,
            confirmText:"Proceed",
            cancelText:"Cancel"
        })

        if (!acceptPath) {
            alert("Created Server Folder! Please set the path later if you want to work with it.");
            setLoadingCreate(false)
            await loadServers();
            return
        }

        await window.ipcRenderer.invoke("set-server-path", result.folderId);
        
        setLoadingCreate(false)
        alert("Created Server Folder!");
        await loadServers();
    }

    return(
        <div className='owned-drive-wrapper'>
            {popup}

            {!servers.length  && <h3>Start by creating your first server folder.</h3>}
            {loadingServers  
                ? <span id='loading-span'>
                    <Loader2 size={24} className='spinner'/>
                    <h4>Loading servers...</h4>
                </span>
                : 
                <ul id='servers-ul'>
                    {servers.filter(server => server.type === 'owned').map(server => (
                        <li key={server.id}>
                            <ServerSlot server={server}/>
                        </li>
                    )).reverse()}

                    {Array.from({ length: maxSlots - servers.filter(server => server.type === 'owned').length })
                    .map((_, index) => (
                        <li key={`ghost-${index}`}>
                            <span className='first-row'>
                                <span className='list-text ghost'>
                                    + Create New Server
                                </span>

                                <span>
                                    <button 
                                    className='list-button'
                                    style={{backgroundColor:"rgb(10, 30, 10)"}}
                                    disabled={loadingCreate}
                                    onClick={handleCreate}>
                                        {loadingCreate && <Loader2 size={12} className='spinner'/>}
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