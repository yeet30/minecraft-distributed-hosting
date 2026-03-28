import './greeting-section.css'
import { useServerStore, useUserStore, useLocalStore } from '../../store/store'
import SelectServer from '../select-server';
import { Loader2, Power, Square, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import PermissionInformation from '../permission-information';
import ServerConsole from '../server-console';
import PlayitggLink from '../playitgg-link';

export default function GreetingSection() {

    const { userName, userEmail, loadingUser, driveScopeAllowed } = useUserStore();
    const { selectedServer, hostingStatus, loadingServers, setHostingStatus } = useServerStore();
    const { playitggPath } = useLocalStore();

    const [loadingOnOff, setLoadingOnOff] = useState(false)
    const [notAtTop, setNotAtTop] = useState(false);

    async function handleStart() {
        if (loadingServers || !selectedServer) return
        setLoadingOnOff(true)

        const result = await window.ipcRenderer.invoke("start-server", selectedServer.id)
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

    async function handleLaunch(){
        if(!selectedServer) return
        const res= await window.ipcRenderer.invoke("launch-server-consoles", selectedServer.path)
        if(!res.success){
            alert(res.message)
            return
        }
    }

    async function handleStopProcess(){
        if(!selectedServer) return
        const res= await window.ipcRenderer.invoke("stop-server-consoles")
        if(!res.success){
            alert(res.message)
            return
        }
    }

    async function handlePlayitggLaunch(){
        if(!selectedServer) return
        const res = await window.ipcRenderer.invoke("launch-server-consoles", selectedServer.path ,playitggPath)
        if(!res.success) {
            alert(res.error)
            return
        }

    }

    async function handlePlayitggStop(){
        const res = await window.ipcRenderer.invoke("stop-server-consoles")
        if(!res.success) {
            alert(res.error)
            return
        }
        
    }

    useEffect(() => {
        const handleScroll = () => {
        setNotAtTop(window.scrollY > 0);
        };

        window.addEventListener("scroll", handleScroll);

        // Initial check
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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
                <SelectServer/>
                <button onClick={handleLaunch}>Launch</button>
                <button onClick={handleStopProcess}>Stop</button>
                <button onClick={handlePlayitggLaunch}>Launch playitgg</button>
                <button onClick={handlePlayitggStop}>Stop playitgg</button>
                <div className='playitgg-link'>
                    <PlayitggLink/>
                </div>
            </div>
            {hostingStatus && hostingStatus?.isHosted
            }
            <div className='console-section'><ServerConsole/></div>
            {notAtTop && 
                <button 
                className='scroller-button'
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                    <ChevronUp size={20}/>
                </button>}
        </section>
    )
}