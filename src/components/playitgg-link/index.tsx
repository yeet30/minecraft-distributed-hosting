import { useEffect, useState } from 'react'
import { Copy, Check } from "lucide-react";
import './playitgg-link.css'
import { useServerStore } from '../../store/store'

export default function PlayitggLink(){

    const [link,setLink] = useState("")
    const [copied, setCopied] = useState(false);
    const {lockStatus} = useServerStore();

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    }

    useEffect(()=>{
        console.log(lockStatus)
        if(!lockStatus || lockStatus.status !=="online") {
            setLink("")
            return
        }
        setLink(lockStatus.publicIp)
    }, [lockStatus])

    if(!link) return null

    return(
        <span className='link-wrapper'>
            <pre>
                {link}
            </pre>

            <button
                onClick={handleCopy}
                style={{ color: copied ? "#4caf50" : "#ccc" }}
                title="Copy to clipboard"
            >
                {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
        </span>
    )
}