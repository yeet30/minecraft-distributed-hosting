import { useEffect, useState } from 'react'
import './playitgg-link.css'

export default function PlayitggLink(){

    const [link,setLink] = useState("")

    useEffect(()=>{
        function handleOutput (_: any, data: string) {
            const newLine = data;
            setLink(newLine);
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