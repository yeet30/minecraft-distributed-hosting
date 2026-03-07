import { useEffect, useState } from 'react';
import {Pencil, Trash2, Loader2} from 'lucide-react';
import './drive-folder.css'

export default function DriveFolders(){

    const maxSlots:number = 3;

    const [servers, setServers] = useState<{ id: string; name: string ; path: string}[]>([]);
    const [loadingServers, setLoadingServers] = useState(false);
    const [serversErrors,setServersErrors] = useState("");
    const [loadingCreate,setLoadingCreate] = useState<string | null>(null);
    const [loadingDelete,setLoadingDelete] = useState<string | null>(null);
    const [loadingSync,setLoadingSync] = useState<string | null>(null);
    const [loadingUpload,setLoadingUpload] = useState<string | null>(null);
    const [loadingEdit,setLoadingEdit] = useState<string | null>(null);

    async function loadServers(){
        setLoadingServers(true);

        const result = await window.ipcRenderer.invoke("drive-get-root");

        if (result.success) {
            for (const server of result.servers) 
                server.path = await window.ipcRenderer.invoke("get-server-path", server.id) || "";
            setServers(result.servers);
        }
        else
            setServersErrors(result.error);

        setLoadingServers(false);
    };

    async function handleCreate(key:string){
        setLoadingCreate(key)
        const result = await window.ipcRenderer.invoke("drive-create-server");
        setLoadingCreate(null)
        if (!result.success) {
            alert(result.error);
        } else {
            alert("Server created!");
        }

        loadServers();
    }

    async function handleDelete(server:any){
        setLoadingDelete(server.id)
        const result = await window.ipcRenderer.invoke("drive-delete-server", server.id);
        setLoadingDelete(null)
        if (!result.success) 
            alert(result.error);
        else
            loadServers();
    }

    async function handleSync(server:any){
        setLoadingSync(server.id)
        const result = await window.ipcRenderer.invoke("sync-server", server.id)
        setLoadingSync(null)
        console.log("Result: " ,result)

        if (!result.success)
            alert(result.error)
        else
            alert(`Files are synced up in the directory: ${server.path}`)
    }

    async function handleEdit(server:any){
        setLoadingEdit(server.id)
        await window.ipcRenderer.invoke("set-server-path", server.id);
        setLoadingEdit(null)
        await loadServers();
    }

    async function handleUpload(server:any){
        setLoadingUpload(server.id)
        const result = await window.ipcRenderer.invoke("upload-server-folder", server.id)
        setLoadingUpload(null)
        console.log("Result: ", result)

        if(!result.success)
            alert(result.error)
        else
            alert(`Files are synced up in the directory: ${server.name}`)
    }

    useEffect(()=>{
        loadServers();
    },[])


    return(
        <>
            {!servers  && <h4>Start by creating your first server folder.</h4>}
            {loadingServers  
                ? <span id='loading-span'>
                    <Loader2 size={24} className='spinner'/>
                    <h4>Loading servers...</h4>
                </span>
                : 
                <ul>
                    {servers.map(server => (
                        <li key={server.id}>
                            <span className='first-row'>
                                <span className='list-text'>
                                    {server.name}
                                </span>

                                <span>
                                    Sync:
                                    <button 
                                    className='list-button'
                                    style={{backgroundColor:"rgb(10, 10, 20)", marginRight:"1px"}}
                                    disabled={loadingSync === server.id}
                                    onClick={() => handleSync(server)}>
                                        {loadingSync === server.id && <Loader2 size={12} className='spinner'/>}
                                        Local
                                    </button>
                                    /
                                    <button 
                                    className='list-button'
                                    style={{backgroundColor:"rgb(10, 10, 20)", marginRight:"1px"}}
                                    disabled={loadingUpload === server.id}
                                    onClick={() => handleUpload(server)}>
                                        {loadingUpload === server.id && <Loader2 size={12} className='spinner'/>}
                                        Drive
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
                            </span>

                            <span className='third-row'>
                                <button
                                className='list-button'
                                style={{backgroundColor:"rgb(10, 10, 10)"}}
                                disabled={loadingEdit === server.id}
                                onClick={() => handleEdit(server)}>
                                    {loadingEdit === server.id && <Loader2 size={12} className='spinner'/>}
                                    Edit <Pencil size={12} style={{borderBottom:"solid", borderWidth:"1px"}}/>
                                </button>
                            </span>
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
            {serversErrors}
        </>
    )
}