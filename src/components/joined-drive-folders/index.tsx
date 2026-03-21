import { useEffect, useState } from 'react';
import {Pencil, Trash2, Loader2, AlertCircle, ExternalLink} from 'lucide-react';
import './joined-drive-folders.css'
import { useConfirm } from '../../hooks/useConfirm';
import PermissionsList from '../permissions-list';
import { IServerFolder } from '../../lib/types';

type Props = { 
    servers: IServerFolder[],
    loadingServers: boolean,
    loadServers: any
}

export default function JoinedDriveFolders({servers, loadingServers,loadServers}:Props){

    const {confirm, popup} = useConfirm();

    const [serverId,setServerId] = useState('')
    const [isAllowed, setIsAllowed] = useState(false)

    const [loadingLaunch, setLoadingLaunch] = useState<boolean>(false);
    const [loadingJoin,setLoadingJoin] = useState<boolean>(false);
    const [loadingDelete,setLoadingDelete] = useState<string | null>(null);
    const [loadingDownload,setloadingDownload] = useState<string | null>(null);
    const [loadingUpload,setLoadingUpload] = useState<string | null>(null);
    const [loadingEdit,setLoadingEdit] = useState<string | null>(null);


    async function handleLaunch(){
        setLoadingLaunch(true)
        const result = await window.ipcRenderer.invoke("request-drive-scope");
        if (!result.success) {
            alert(result.error);
            return;
        }
        setLoadingLaunch(false)
        checkRequestAllowed()
        loadServers()
    }

    async function handleJoin() {
        setLoadingJoin(true)
        const res = await window.ipcRenderer.invoke("join-by-id", serverId)
        console.log("Res: ", res)
        if(!res.success){
            alert(res.error)
            setLoadingJoin(false)
            return
        }
        
        alert("Joined server!")
        setLoadingJoin(false)
        await loadServers();
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

    async function checkRequestAllowed(){
        const res = await window.ipcRenderer.invoke("is-request-allowed")
        setIsAllowed(res)
    }

    useEffect(() =>{
        checkRequestAllowed()
    },[])

    return(
        <div className='joined-drive-folder'>
            {popup}

            {(!servers.length && isAllowed)  && 
                <h3>Paste the ID provided to you in the invitation email to join a server.</h3>
            }
            {!isAllowed && (
                <div className='permission-information'>
                    <h3>Please grant the app permission to see the folders you joined.</h3>
                    <div className='access-statement'>
                        <AlertCircle size={48}/>
                        <h4> The app is only able to see the folders you give access to.</h4>
                    </div>
                    <span>
                        <button 
                        onClick={handleLaunch}
                        disabled={loadingLaunch}>
                            {loadingLaunch ? <Loader2 size={16} className='spinner'/> : ''}
                            Launch Browser <ExternalLink size={16}/>
                        </button>
                    </span>
                </div>
            )}
            {loadingServers  
                ? <span id='loading-span'>
                    <Loader2 size={24} className='spinner'/>
                    <h4>Loading servers...</h4>
                </span>
                : 
                <ul id='servers-ul'>
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
                    <li>
                        <span className='first-row'>
                            <span className='list-text'>
                                <input type="text" 
                                placeholder='Paste the ID here.' 
                                value={serverId}
                                onChange={(e)=>setServerId(e.target.value)}/>
                            </span>

                            <span>
                                <button 
                                className='list-button'
                                style={{backgroundColor:"rgb(10, 30, 10)"}}
                                disabled={loadingJoin}
                                onClick={handleJoin}>
                                    {loadingJoin && <Loader2 size={12} className='spinner'/>}
                                    Join
                                </button>
                            </span>
                        </span>
                        <span className='second-row'>+ Join New Server</span>
                    </li>
                </ul>
            }
        </div>
    )
}