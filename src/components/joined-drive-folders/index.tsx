import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import './joined-drive-folders.css'
import ServerSlot from '../server-slot';
import { useServerStore, useUserStore } from '../../store/store';
import PermissionInformation from '../permission-information';

export default function JoinedDriveFolders(){

    const { servers, loadingServers, loadServers } = useServerStore();
    const { driveScopeAllowed} = useUserStore();

    const [serverId,setServerId] = useState('')
    const [loadingJoin,setLoadingJoin] = useState(false);

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
        setServerId('')
        loadServers();
    }

    return(
        <div className='joined-drive-folder'>

            {(!servers.length && driveScopeAllowed)  && 
                <h3>Paste the ID provided to you in the invitation email to join a server.</h3>
            }
            <PermissionInformation/>
            {(loadingServers  && driveScopeAllowed)
                ? <span id='loading-span'>
                    <Loader2 size={24} className='spinner'/>
                    <h4>Loading servers...</h4>
                </span>
                : 
                <ul id='servers-ul'>
                    {servers.filter(server => server.type=== 'joined').map(server => (
                        <li key={server.id}>
                            <ServerSlot server={server}/>
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