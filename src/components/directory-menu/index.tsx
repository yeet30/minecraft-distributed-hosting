import './directory-menu.css'
import { FolderCog } from 'lucide-react'
import { useState, useRef } from 'react'

export function DirectoryMenu(){

    const [open, setOpen] = useState(false)
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    function cancelClose() {
        if(closeTimer.current) clearTimeout(closeTimer.current);
    }
    const scheduleClose = () => closeTimer.current = setTimeout(()=> setOpen(false),500)

    return (
        <div className='directory-menu-wrapper'>
            <button className='folder-cog' 
                onClick={()=> setOpen((val) =>!val)}
                onMouseEnter={cancelClose}
                onMouseLeave={scheduleClose}
            >
                <FolderCog/>
            </button>
            {open && (
                <div className='directory-options'
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                >
                    <div>Watcher</div>
                    <div>Manifest</div>
                    <div>Upload</div>
                    <div>Download</div>
                </div>
            )}
        </div>
    )
}