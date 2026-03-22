import './server-slot.css'
import { useState, useEffect } from 'react'
import { IServerFolder } from '../../lib/types'
import { useConfirm } from '../../hooks/useConfirm'
import {Pencil, Trash2, Loader2, Upload, Download} from 'lucide-react';
import PermissionsList from '../permissions-list';

type Props = {
    server: IServerFolder,
    userEmail: string,
    loadServers: () => void
}

export default function ServerSlot({ server, userEmail, loadServers }:Props){

    const {confirm, popup} = useConfirm();

    const [isOwner,setIsOwner] = useState(false)
    const [permissionId, setPermissionId] = useState<string | null>(null)
    const [loadingDelete,setLoadingDelete] = useState<string | null>(null);
    const [loadingDownload,setloadingDownload] = useState<string | null>(null);
    const [loadingUpload,setLoadingUpload] = useState<string | null>(null);
    const [loadingEdit,setLoadingEdit] = useState<string | null>(null);

    const listProps = {
        permissionsList: server.permittedUsers,
        serverId: server.id,
        isOwner: isOwner,
        loadServers: loadServers
    }

    async function handleDelete(server:any){

        if(isOwner){
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
        else {
            const accepted = await confirm({
                message:"Are you sure you want to leave from this shared Google Drive folder?",
                confirmText:"Yes",
            })

            if(!accepted)
                return;

            setLoadingDelete(server.id)
            const result = await window.ipcRenderer.invoke("drive-remove-permission", server.id, permissionId);
            setLoadingDelete(null)
            if (!result.success) 
                alert(result.error);
            else
                loadServers();
        }
        
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

    useEffect(() => {
        server.permittedUsers.forEach(user => {
            if(user.emailAddress === userEmail){
                setPermissionId(user.id)

                if(user.role === "owner")
                    setIsOwner(true);
            }
        })
        
    }, [server.permittedUsers, userEmail]);

    return (
        <div className='server-slot'>
            {popup}
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
                        <Download size={16}/>
                    </button>
                    <button 
                    className='list-button'
                    style={{backgroundColor:"rgb(10, 10, 30)", marginRight:"1px"}}
                    disabled={loadingUpload === server.id}
                    onClick={() => handleUpload(server)}>
                        {loadingUpload === server.id && <Loader2 size={12} className='spinner'/>}
                        <Upload size={16}/>
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
                <PermissionsList {...listProps}/>
            </span>
        </div>
    )
}