import { useEffect, useState } from 'react'
import './playitgg-link.css'

export default function PlayitggLink(){

    const [link,setLink] = useState("")

    useEffect(()=>{
        function handleOutput (_: any, data: string) { 
            setLink(data) 
        };

        window.ipcRenderer.on("playitgg-output", handleOutput);

        return () => {
            window.ipcRenderer.off("playitgg-output", handleOutput);
        };
    },[])

    return(
        <div className='playitgg-wrapper'>
            <pre>{link}</pre>
        </div>
    )
}