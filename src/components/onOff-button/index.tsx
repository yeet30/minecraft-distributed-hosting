import './onOff-buttons.css'
import { Loader2, Power, Square } from 'lucide-react';
import { useState } from 'react';
import { useServerStore, useUserStore, useLocalStore } from '../../store/store'
import { IStartupOptions } from '../../lib/types';

export default function OnOffButton(){

    const { userEmail } = useUserStore();
    const {loadingServers, setHostingStatus } = useServerStore();
    const { selectedServer, hostingStatus} = useServerStore();
    const { playitggPath, allocatedRAM } = useLocalStore();
    const [loadingOnOff, setLoadingOnOff] = useState(false)

    async function handleStart() {
        if (loadingServers || !selectedServer) return
        setLoadingOnOff(true)

        const options: IStartupOptions = {
            folderId: selectedServer.id,
            serverPath: selectedServer.path,
            playitggPath: playitggPath,
            RAMoptions: allocatedRAM,
        }

        const result = await window.ipcRenderer.invoke("start-server", options)
        if (!result.success) {
            setHostingStatus(null)
            alert(result.error)
            setLoadingOnOff(false)
            return
        }
        setHostingStatus(result.hostingStatus)
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

    return(
        <div className='onOff-wrapper'>
            {hostingStatus && hostingStatus?.isHosted
                ?
                    <button 
                    className='onOff-button' 
                    onClick={handleStop} 
                    disabled={hostingStatus.lock.hostEmail !== userEmail}>
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
    )
}