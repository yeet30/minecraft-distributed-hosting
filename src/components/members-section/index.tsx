import './members-section.css'
import { useServerStore } from '../../store/store'
import { useEffect, useState } from 'react'
import { RotateCcw } from 'lucide-react'

export default function MembersSection(){

    const { selectedServer, lockStatus } = useServerStore()
    const [maxPlayers, setMaxPlayers] = useState<number | null>(null)
    const [players, setPlayers] = useState<string[]>([]);

    const [spinning, setSpinning] = useState(false);

    function handleClick(){
        setSpinning(true);
        setTimeout(() => {
            window.location.reload();
        }, 400);
    };

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


    if(!maxPlayers)
        return (
            <section className="members-section">
                <button className='refresh-button' onClick={handleClick}>
                    <RotateCcw className={`refresh-svg ${spinning ? "spin" : ""}`} size={24}/>
                </button>
            </section>
        )
    return (
        <section className="members-section">
            <button className='refresh-button' onClick={handleClick}>
                <RotateCcw className={`refresh-svg ${spinning ? "spin" : ""}`} size={24}/>
            </button>
            <div className='members-div'>
                <h3>Online Players: <span>{players.length}/{maxPlayers}</span></h3>
                {players.map((player, index) =>
                    <span className="player-name" key={index}>{player}</span>
                )}
            </div>
        </section>
    )
}