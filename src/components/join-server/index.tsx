import './join-server.css'
import { useServerStore, useUserStore } from '../../store/store';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useConfirm } from '../../hooks/useConfirm';

export default function JoinServer(){

    const { servers, loadServers } = useServerStore();
    const { driveScopeAllowed } = useUserStore();
    const {confirm, popup} = useConfirm();
    const [serverId,setServerId] = useState('')
    const [loadingJoin,setLoadingJoin] = useState(false);

    async function handleJoin() {
        setLoadingJoin(true)
        const res = await window.ipcRenderer.invoke("join-by-id", serverId)
        console.log("Join result: ", res)
        if(!res.success){
            alert(res.error)
            setLoadingJoin(false)
            return
        }

        const acceptPath = await confirm({
            message: `Choose the local folder path for your server. The files will be downloaded to and uploaded from here.`,
            confirmText:"Proceed",
            cancelText:"Cancel"
        })

        if (!acceptPath) {
            alert("Joined Server Folder! Please set the path later if you want to work with it.");
            setLoadingJoin(false)
            await loadServers();
            return
        }

        await window.ipcRenderer.invoke("set-server-path", res.folder.id);
        await loadServers();
        setLoadingJoin(false)
        setServerId('')
    }

    return (
        <div className='join-server-wrapper'>
            {popup}
            {(!servers.length && driveScopeAllowed)  && 
                <h3>Paste the ID provided to you in the invitation email below to join a server.</h3>
            }
            <div className='rows'>
                <span className='first-row'>
                    <span className='list-text'>
                        <input type="text" 
                        id='join-input'
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
            </div>   
        </div>
    )
}