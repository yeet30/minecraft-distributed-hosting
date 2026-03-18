import { useState } from 'react';
import {Pencil, Trash2, Loader2} from 'lucide-react';
import './joined-drive-folders.css'
import { useConfirm } from '../../hooks/useConfirm';
import PermissionsList from '../permissions-list';

type Props = { //Move this type to a common place
    servers: { type: 'owned' | 'joined', id: string; name: string; path: string; permittedUsers: {
        id:string,type:string, emailAddress:string, role:string, displayName:string, photoLink:string}[]
    }[],
    loadingServers: boolean,
    serversErrors: string,
    loadServers: any
}

export default function JoinedDriveFolders({servers, loadingServers, serversErrors,loadServers}:Props){

    const {confirm, popup} = useConfirm();

    const [serverId,setServerId] = useState('')

    const [loadingJoin,setLoadingJoin] = useState<boolean>(false);
    const [loadingDelete,setLoadingDelete] = useState<string | null>(null);
    const [loadingDownload,setloadingDownload] = useState<string | null>(null);
    const [loadingUpload,setLoadingUpload] = useState<string | null>(null);
    const [loadingEdit,setLoadingEdit] = useState<string | null>(null);


    async function handleJoin() {
        const result = await window.ipcRenderer.invoke("join-server", serverId);

        if (!result.success) {
            alert(result.error);
            await window.ipcRenderer.invoke("open-external-link", result.link);
            return;
        }
        
        loadServers();
    }

    async function handleDelete(server:any){

        const accepted = await confirm({
            message:"Are you sure you want to delete this folder from the shared Google Drive?",
            confirmText:"Yes",
        })

        if(!accepted)
            return;

        setLoadingDelete(server.id)
        const result = await window.ipcRenderer.invoke("drive-delete-server", server.id);
        setLoadingDelete(null)
        if (!result.success) 
            alert(result.error);
        else
            loadServers();
    }

    async function handleDownload(server:any){

        const accepted = await confirm({
            message:"This action syncs up your Local server folder by overwriting it with the files in the shared Google Drive.",
        })

        if(!accepted)
            return;

        setloadingDownload(server.id)
        const result = await window.ipcRenderer.invoke("sync-server", server.id)
        setloadingDownload(null)
        if (!result.success)
            alert(result.error)
        else
            alert(`Files are synced up in the directory: ${server.path}`)

    }

    async function handleUpload(server:any){

        const accepted = await confirm({
            message:"This action syncs up the shared Google Drive folder by overwriting it with the files in your local directory.",
        })

        if(!accepted)
            return;

        setLoadingUpload(server.id)
        const result = await window.ipcRenderer.invoke("upload-server-folder", server.id)
        setLoadingUpload(null)
        console.log("Result: ", result)

        if(!result.success)
            alert(result.error)
        else
            alert(`Files are synced up in the directory: ${server.name}`)
    }

    async function handleEdit(server:any){
        setLoadingEdit(server.id)
        await window.ipcRenderer.invoke("set-server-path", server.id);
        setLoadingEdit(null)
        await loadServers();
    }

    return(
        <div className='joined-drive-folder'>
            {popup}

            {!servers  && <h4>Start by creating your first server folder.</h4>}
            {loadingServers  
                ? <span id='loading-span'>
                    <Loader2 size={24} className='spinner'/>
                    <h4>Loading servers...</h4>
                </span>
                : 
                <ul id='servers-ul'>
                    <li>
                        <span className='first-row'>
                            <span className='list-text'>
                                <input type="text" 
                                placeholder='Join New Server' 
                                value={serverId}
                                onChange={(e)=>setServerId(e.target.value)}/>
                            </span>

                            <span>
                                <button 
                                className='list-button'
                                style={{backgroundColor:"rgb(10, 30, 10)"}}
                                onClick={handleJoin}>
                                    {loadingJoin && <Loader2 size={12} className='spinner'/>}
                                    Join
                                </button>
                            </span>
                        </span>
                        <span className='second-row'>Paste the ID in the field above</span>
                    </li>

                    {servers.filter(server => server.type=== 'joined').map(server => (
                        <li key={server.id}>
                            <span className='first-row'>
                                <span className='list-text'>
                                    {server.name}
                                </span>

                                <span>
                                    <button 
                                    className='list-button'
                                    style={{backgroundColor:"rgb(10, 30, 10)", marginRight:"1px"}}
                                    disabled={loadingDownload === server.id}
                                    onClick={() => handleDownload(server)}>
                                        {loadingDownload === server.id && <Loader2 size={12} className='spinner'/>}
                                        Download
                                    </button>
                                    <button 
                                    className='list-button'
                                    style={{backgroundColor:"rgb(10, 10, 30)", marginRight:"1px"}}
                                    disabled={loadingUpload === server.id}
                                    onClick={() => handleUpload(server)}>
                                        {loadingUpload === server.id && <Loader2 size={12} className='spinner'/>}
                                        Upload
                                    </button>
                                    <button
                                    className='list-button'
                                    style={{backgroundColor:"rgb(50, 0, 0)"}}
                                    disabled={loadingDelete === server.id}
                                    onClick={()=>{handleDelete(server)}}>
                                        {loadingDelete === server.id && <Loader2 size={12} className='spinner'/>}
                                        <Trash2 size={16}/>
                                    </button>
                                </span>
                            </span>

                            <span className='second-row'>
                                {server.path 
                                    ? server.path
                                    : "C:\\Set the path for this folder"
                                }
                                <button
                                className='list-button'
                                style={{backgroundColor:"rgb(10, 10, 10)"}}
                                disabled={loadingEdit === server.id}
                                onClick={() => handleEdit(server)}>
                                    {loadingEdit === server.id && <Loader2 size={12} className='spinner'/>}
                                    Path <Pencil size={12} style={{borderBottom:"solid", borderWidth:"1px"}}/>
                                </button>
                            </span>

                            <span className='third-row'>
                                <PermissionsList permissionsList={server.permittedUsers} serverId={server.id} loadServers={loadServers}/>
                            </span>
                        </li>
                    )).reverse()}
                </ul>
            }
            {serversErrors}
        </div>
    )
}