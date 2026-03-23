import { useState } from 'react';
import { Loader2, AlertCircle, ExternalLink} from 'lucide-react';
import './joined-drive-folders.css'
import ServerSlot from '../server-slot';
import { useServerStore, useUserStore } from '../../store/store';

export default function JoinedDriveFolders(){

    const { servers, loadingServers, loadServers } = useServerStore();
    const { driveScopeAllowed, checkDriveScope}= useUserStore();

    const [serverId,setServerId] = useState('')
    const [loadingLaunch, setLoadingLaunch] = useState(false);
    const [loadingJoin,setLoadingJoin] = useState(false);

    async function handleLaunch(){
        setLoadingLaunch(true)
        const result = await window.ipcRenderer.invoke("request-drive-scope");
        if (!result.success) {
            alert(result.error);
            return;
        }
        setLoadingLaunch(false)
        checkDriveScope()
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
        setServerId('')
        loadServers();
    }

    return(
        <div className='joined-drive-folder'>

            {(!servers.length && driveScopeAllowed)  && 
                <h3>Paste the ID provided to you in the invitation email to join a server.</h3>
            }
            {!driveScopeAllowed && (
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