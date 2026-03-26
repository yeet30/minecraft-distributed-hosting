import './greeting-section.css'
import { useServerStore, useUserStore } from '../../store/store'
import SelectServer from '../select-server';
import { Loader2, Power, Square } from 'lucide-react';
import { useState } from 'react';
import PermissionInformation from '../permission-information';

export default function GreetingSection() {

    const { userName, userEmail, loadingUser, driveScopeAllowed } = useUserStore();
    const { selectedServer, hostingStatus, loadingServers, setHostingStatus } = useServerStore();

    const [loadingOnOff, setLoadingOnOff] = useState(false)

    async function handleStart() {
        if (loadingServers || !selectedServer) return
        setLoadingOnOff(true)
        const result = await window.ipcRenderer.invoke("start-server", selectedServer.id)
        if (!result.success) {
            setHostingStatus(result.lock ?? null)
            alert(result.error)
            setLoadingOnOff(false)
            return
        }
        setHostingStatus(result.lock)
        alert(`Files are synced up in the directory: ${selectedServer.path}`)
        setLoadingOnOff(false)
    }

    async function handleStop() {
        if (!hostingStatus || !selectedServer) return 
        setLoadingOnOff(true)
        const res = await window.ipcRenderer.invoke("stop-server", selectedServer.id)
        if (!res.success) {
            setLoadingOnOff(false)
            alert(res.error)
            return
        }
        setHostingStatus(null)
        alert(`Files are downloaded to the directory: ${selectedServer.path}`)
        setLoadingOnOff(false)
    }

    if (loadingUser)
        return <h2 className="greeting-title">Loading user information...</h2>
    else if(!driveScopeAllowed)
        return (
            <section className="greeting-wrapper">
                <h2 className="greeting-title">Welcome, {userName}!</h2>
                <PermissionInformation/>
            </section>
        )
    return (
        <section className="greeting-wrapper">
            <h2 className="greeting-title">Welcome, {userName}!</h2>
            <div className='starter-section'>
                <div className='button-wrapper'>
                    {hostingStatus?.isHosted
                        ?
                            <button 
                            className='onOff-button' 
                            onClick={handleStop} 
                            disabled={hostingStatus.hostEmail !== userEmail}>
                                {loadingOnOff  
                                    ? <Loader2 size={128} className='spinner'/>
                                    : <Square size={120} fill="currentColor"/>
                                }
                            </button>
                        :
                            <button className='onOff-button' onClick={handleStart} disabled={loadingOnOff}>
                                {loadingOnOff 
                                    ? <Loader2 size={128} className='spinner'/>
                                    : <Power size={128}/>
                                }
                            </button>
                    }
                </div>
            </div>
            <SelectServer/>
        </section>
    )
}