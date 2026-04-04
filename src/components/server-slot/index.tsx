import './server-slot.css'
import { useState, useEffect, useRef } from 'react'
import { IServerFolder } from '../../lib/types';
import { useConfirm } from '../../hooks/useConfirm'
import { Pencil, Trash2, Loader2, Upload, Download, Save } from 'lucide-react';
import PermissionsList from '../permissions-list';
import { useServerStore, useUserStore } from '../../store/store';

type Props = {
    server : IServerFolder
}

export default function ServerSlot({ server } : Props){

    const {userEmail} = useUserStore();
    const {loadServers} = useServerStore();
    const {confirm, popup} = useConfirm();

    const inputRef = useRef<HTMLInputElement>(null);
    const [isOwner,setIsOwner] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [nameBuffer, setNameBuffer] = useState(server.name)
    const [permissionId, setPermissionId] = useState<string | null>(null)
    const [loading, setLoading] = useState({
        download: false,
        upload: false,
        delete: false,
        path: false,
        edit: false
    })

    const listProps = {
        permissionsList: server.permittedUsers, 
        serverId: server.id, 
        isOwner
    }

    async function handleEdit(){
        if(server.name !== nameBuffer){
            setLoading(prev => ({...prev, edit:true}))
            const res = await window.ipcRenderer.invoke("rename-server", server.id, nameBuffer)
            if(!res.success)
                alert(res.error)
            else
                loadServers()
            setLoading(prev => ({...prev, edit:false}))
        }
        setIsEditing(false)
    }

    async function handleDownload(server:any){

        const accepted = await confirm({
            message:"This action syncs up your Local server folder by overwriting it with the files in the shared Google Drive.",
        })

        if(!accepted)
            return;

        setLoading(prev => ({...prev, download: true}))
        const result = await window.ipcRenderer.invoke("sync-server", server.id)
        setLoading(prev => ({...prev, download: false}))
        
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

        setLoading(prev => ({...prev, upload: true}))
        const result = await window.ipcRenderer.invoke("upload-server-folder", server.id)
        setLoading(prev => ({...prev, upload: false}))

        if(!result.success)
            alert(result.error)
        else
            alert(`Files are synced up in the directory: ${server.name}`)
    }

    async function handleDelete(server:any){
        if(isOwner){
            const accepted = await confirm({
                message:"Are you sure you want to delete this folder from the shared Google Drive?",
                confirmText:"Yes",
                cancelText:"No"
            })

            if(!accepted)
                return;

            setLoading(prev => ({...prev, delete: true}))
            const result = await window.ipcRenderer.invoke("drive-delete-server", server.id);
            setLoading(prev => ({...prev, delete: false}))
            if (!result.success) 
                alert(result.error);
            else
                await loadServers();
        }
        else {
            const accepted = await confirm({
                message:"Are you sure you want to leave from this shared Google Drive folder?",
                confirmText:"Yes",
                cancelText: "No"
            })

            if(!accepted)
                return;

            setLoading(prev => ({...prev, delete: true}))
            const result = await window.ipcRenderer.invoke("drive-remove-permission", server.id, permissionId, false);
            setLoading(prev => ({...prev, delete: false}))
            if (!result.success) 
                alert(result.error);
            else
                await loadServers();
        }
    
    }

    async function handlePath(server:any){
        setLoading(prev => ({...prev, path: true}))
        await window.ipcRenderer.invoke("set-server-path", server.id);
        setLoading(prev => ({...prev, path: false}))
        await loadServers();
    }

    function handleType(e: React.ChangeEvent<HTMLInputElement>) {
        const newValue = e.currentTarget.value
        if ( inputRef.current && (newValue.length < nameBuffer.length || inputRef.current?.getBoundingClientRect().width < 220))
            setNameBuffer(newValue)
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
                    <input type="text"
                        ref={inputRef}
                        className='name-input'
                        value={nameBuffer}
                        readOnly = {!isEditing}
                        onChange={ (e) => handleType(e)}
                        style={{ width: `${nameBuffer.length}ch`}}
                    />
                    {isEditing
                        ?
                        <button className='edit-button' onClick={handleEdit} disabled={loading.edit}>
                            {loading.edit 
                                ?
                                <Loader2 size={12} className='spinner'/>
                                :
                                <Save size={12}/>
                            }
                        </button>
                        :
                        <button className='edit-button' onClick={()=>{
                            setIsEditing(true)
                            setTimeout(() => inputRef.current?.focus(), 0);
                        }}>
                            <Pencil size={12}/>
                        </button>
                    }
                </span>

                <span className='button-span'>
                    <button 
                    className='list-button'
                    disabled={loading.download}
                    onClick={() => handleDownload(server)}>
                        {loading.download && <Loader2 size={12} className='spinner'/>}
                        <Download size={16}/>
                    </button>
                    <button 
                    className='list-button'
                    disabled={loading.upload}
                    onClick={() => handleUpload(server)}>
                        {loading.upload && <Loader2 size={12} className='spinner'/>}
                        <Upload size={16}/>
                    </button>
                    <button
                    className='list-button'
                    style={{backgroundColor:"rgb(50, 0, 0)"}}
                    disabled={loading.delete}
                    onClick={()=>{handleDelete(server)}}>
                        {loading.delete && <Loader2 size={12} className='spinner'/>}
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
                disabled={loading.path}
                style={{backgroundColor: "rgba(0,0,0,0.5)"}}
                onClick={() => handlePath(server)}>
                    {loading.path && <Loader2 size={12} className='spinner'/>}
                    Path <Pencil size={12} style={{borderBottom:"solid", borderWidth:"1px"}}/>
                </button>
            </span>

            <span className='third-row'>
                <PermissionsList {...listProps}/>
            </span>
        </div>
    )
}