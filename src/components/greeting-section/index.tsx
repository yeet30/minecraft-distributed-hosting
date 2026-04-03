import './greeting-section.css'
import { useUserStore, useServerStore } from '../../store/store'
import SelectServer from '../select-server';
import { ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import PermissionInformation from '../permission-information';
import ServerConsole from '../server-console';
import PlayitggLink from '../playitgg-link';
import OnOffButton from '../OnOff-button';
import StartupProgress from '../startup-progress';

export default function GreetingSection() {

    const { userName, loadingUser, driveScopeAllowed } = useUserStore();
    const {serverRunning, setServerRunning} = useServerStore();
    const [notAtTop, setNotAtTop] = useState(false);
    const [showProgress, setShowProgress] = useState(true)

    useEffect(() => {
        function handleScroll() {
            setNotAtTop(window.scrollY > 0);
        };
        window.addEventListener("scroll", handleScroll);

        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(()=>{
        async function init() {
            const isRunning = await window.ipcRenderer.invoke("is-server-running");
            if(isRunning)
                setServerRunning(true)
            else
                setServerRunning(false)
        };

        init();

        window.ipcRenderer.on("server-started", () => setServerRunning(true));
        window.ipcRenderer.on("server-stopped", () => setServerRunning(false));

        window.ipcRenderer.on("show-progress", () => {
            setShowProgress(true)
        });
        window.ipcRenderer.on("hide-progress", () => {
            setShowProgress(false)
        });
        window.ipcRenderer.on("server-output", (_, line)=> {
            if(/Done\s*\(/.test(line))
                setShowProgress(false)
        })
    }, [])

    if (loadingUser)
        return (
            <section className="greeting-wrapper">
                <h2 className="greeting-title">Loading user information...</h2>
            </section>
        )
    else if(!driveScopeAllowed)
        return (
            <section className="greeting-wrapper">
                <h2 className="greeting-title">Welcome, {userName}!</h2>
                <PermissionInformation/>
            </section>
        )
    return (
        <section className="greeting-wrapper">
            <div className='first-page'>
                <h2 className="greeting-title">Welcome, {userName}!</h2>
                <div className='starter-section'>
                    <div><OnOffButton/></div>
                    {showProgress && <div><StartupProgress/></div>}
                    <div><SelectServer/></div>
                    <div><PlayitggLink/></div>
                </div>
            </div>
            {serverRunning &&
                <div className='console-section'><ServerConsole/></div>
            }
            {notAtTop && 
                <button 
                className='scroller-button'
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                    <ChevronUp size={20}/>
                </button>}
        </section>
    )
}