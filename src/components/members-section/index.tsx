import './members-section.css'
import { useServerStore } from '../../store/store'
import { useEffect, useState } from 'react'
import { RotateCcw } from 'lucide-react'

export default function MembersSection(){

    const { selectedServer, lockStatus } = useServerStore()
    const [maxPlayers, setMaxPlayers] = useState<number | null>(null)
    const [players, setPlayers] = useState<string[]>([]);
    const [uptime, setUptime] = useState<number>(0); // seconds

    const [spinning, setSpinning] = useState(false);

    function handleClick(){
        setSpinning(true);
        setTimeout(() => {
            window.location.reload();
        }, 400);
    };

    function formatUptime(seconds: number): string {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;

        const mm = String(m).padStart(2, "0");
        const ss = String(s).padStart(2, "0");

        if (h > 0)
            return `${h}:${mm}:${ss}`;
        return `${mm}:${ss}`;
    }

    async function getMaxPlayers(){
        if(!selectedServer) return
        const res = await window.ipcRenderer.invoke("get-max-players", selectedServer.path)
        setMaxPlayers(res)
    }

    async function getCurrentPlayers(){
        const players = await window.ipcRenderer.invoke("get-current-players")
        setPlayers(players)
    }

    useEffect(()=>{
        if(lockStatus.status !== "online") {
            setMaxPlayers(null)
            return
        }
        getCurrentPlayers();
        getMaxPlayers();
    },[lockStatus])

    useEffect(() => {
        if (!lockStatus?.startedAt || lockStatus.status === "offline") {
            setUptime(0);
            return;
        }

        const startedAt = new Date(lockStatus.startedAt).getTime();
        
        // Set initial value
        setUptime(Math.floor((Date.now() - startedAt) / 1000));

        // Tick every second
        const interval = setInterval(() => {
            setUptime(Math.floor((Date.now() - startedAt) / 1000));
        }, 1000);

        return () => clearInterval(interval);
    }, [lockStatus?.startedAt, lockStatus?.status]);

    if(!maxPlayers)
        return (
            <section className="members-section">
                <button className='refresh-button' title='Refresh page' onClick={handleClick}>
                    <RotateCcw className={`refresh-svg ${spinning ? "spin" : ""}`} size={24}/>
                </button>
            </section>
        )
    return (
        <section className="members-section">
            <button className='refresh-button' title='Refresh page' onClick={handleClick}>
                <RotateCcw className={`refresh-svg ${spinning ? "spin" : ""}`} size={24}/>
            </button>
            <div className='members-div'>
                <h3>Online Players: <span>{players.length}/{maxPlayers}</span></h3>
                {players.map((player, index) =>
                    <span className="player-name" key={index}>{player}</span>
                )}
            <span className='uptime-span'>Uptime: {formatUptime(uptime)}</span>
            </div>
        </section>
    )
}