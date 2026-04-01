import './OnOff-buttons.css'
import { Loader2, Power, Square } from 'lucide-react';
import { useState } from 'react';
import { useServerStore, useUserStore, useLocalStore } from '../../store/store'
import { IStartupOptions } from '../../lib/types';

export default function OnOffButton(){

    const { userEmail } = useUserStore();
    const { loadingServers, selectedServer, lockStatus, setLockStatus} = useServerStore();
    const { playitggPath, allocatedRAM, checklist } = useLocalStore();
    const [loadingOnOff, setLoadingOnOff] = useState(false)

    async function handleStart() {
        if (loadingServers || !selectedServer) return
        setLoadingOnOff(true)

        const options: IStartupOptions = {
            checklist: checklist,
            folderId: selectedServer.id,
            serverPath: selectedServer.path,
            playitggPath: playitggPath,
            RAMoptions: allocatedRAM,
        }

        const result = await window.ipcRenderer.invoke("start-server", options)

        console.log("Start res: ", result)
        
        if (!result.success){
            alert(result.error)
            setLoadingOnOff(false)
            return
        }
        setLockStatus(result.lockStatus)
        setLoadingOnOff(false)
    }

    async function handleStop() {
        if (!lockStatus || !selectedServer) return 
        setLoadingOnOff(true)

        const options = {
            shouldUpload: checklist.upload,
            folderId: selectedServer.id
        }

        const res = await window.ipcRenderer.invoke("stop-server", options)
        console.log("Stop res: ", res)
        if (!res.success){
            alert(res.error)
            return
        }
        setLockStatus(res.lockData)
        setLoadingOnOff(false)
    }

    return(
        <div className='onOff-wrapper'>
            {lockStatus && lockStatus.status === "online"
                ?
                    <button 
                    className='onOff-button' 
                    onClick={handleStop} 
                    disabled={lockStatus.hostEmail !== userEmail || loadingServers}>
                        {loadingOnOff  
                            ? <Loader2 size={128} className='spinner'/>
                            : <Square size={120} fill="currentColor"/>
                        }
                    </button>
                :
                    <button className='onOff-button' onClick={handleStart} disabled={loadingOnOff || loadingServers}>
                        {loadingOnOff 
                            ? <Loader2 size={128} className='spinner'/>
                            : <Power size={128}/>
                        }
                    </button>
            }
        </div>
    )
}