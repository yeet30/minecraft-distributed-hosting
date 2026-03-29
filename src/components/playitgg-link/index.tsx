import { useEffect, useState } from 'react'
import './playitgg-link.css'
import { useServerStore } from '../../store/store'

export default function PlayitggLink(){

    const [link,setLink] = useState("")
    const {hostingStatus} = useServerStore();

    useEffect(()=>{
        if(!hostingStatus || !hostingStatus.isHosted) return
        setLink(hostingStatus.lock.publicIp)
    }, [hostingStatus])

    return(
        <div className='playitgg-wrapper'>
            <pre>{link}</pre>
        </div>
    )
}