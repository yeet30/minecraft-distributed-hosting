import './scripts-options.css'
import { Pencil } from 'lucide-react'
import { useEffect, useState } from 'react';
import { useLocalStore } from '../../store/store';

export default function ScriptsOptions(){

    const {allocatedRAM, playitggPath, setPlayitggPath, setAllocatedRAM} = useLocalStore();
    const [enable, setEnable] = useState<boolean>(playitggPath ? true : false)
    const [pathBuffer, setPathBuffer] = useState<string>(playitggPath)
    const [ram,setRam] = useState({
        min: allocatedRAM.MIN,
        max: allocatedRAM.MAX
    })

    async function handlePath(){
        const path = await window.ipcRenderer.invoke("choose-file-directory")
        if(!path || path === playitggPath)
            return
        setPathBuffer(path)
    }

    function handleMin(e:any){
        if(e.target.value> ram.max) {
            setRam(prev => ({...prev, min: ram.max}))
            return
        }
        setRam(prev => ({...prev, min: Number(e.target.value)}))
    }

    function handleMax(e:any){
        if(e.target.value < ram.min) {
            setRam(prev => ({...prev, min: ram.min}))
            return
        }
        setRam(prev => ({...prev, max: Number(e.target.value)}))
    }

    useEffect(()=>{
        setPathBuffer(playitggPath)
    }, [playitggPath])
    
    function handleSave() {
        if (enable && !pathBuffer) {
            alert("Please set the path if you want to enable playit.gg");
            return;
        }

        if (!enable)
            setPathBuffer("");

        let changes: string[] = [];

        if (pathBuffer !== playitggPath) {
            setPlayitggPath(pathBuffer);
            changes.push("path");
        }

        if (!enable && playitggPath !== "") {
            setPlayitggPath("");
            changes.push("path");
        }

        if (ram.min !== allocatedRAM.MIN || ram.max !== allocatedRAM.MAX) {
            setAllocatedRAM(ram.min, ram.max);
            changes.push("ram");
        }

        if (changes.length > 0)
            alert(`Changes made to the ${changes.join(" and ")} are saved.`);
    }

    return (
        <div className='scripts-wrapper'>
            <div className='playitgg-div'>
                <div className='playitgg-contents'>
                    <span className='playitgg-title'>
                        <h3>Playit.GG</h3>
                        <label htmlFor="enable-check" id='enable-label' className = {enable ? "enabled": ""}>
                            Enable
                            <input 
                            type="checkbox"
                            name="enable-check" 
                            id='enable-check' 
                            checked={enable}
                            onChange={(e) => setEnable(e.target.checked)}/>
                        </label>
                    </span>
                    <span className='path-span'>
                        {pathBuffer
                            ? pathBuffer
                            : <span className='path-span'>
                                C:\\Set the path for this file
                                <button className='path-button' onClick={handlePath}>
                                    Set Path
                                    <Pencil size={12} style={{borderBottom:"solid", borderWidth:"1px"}}/>
                                </button>
                            </span>
                        }
                    </span>
                    <span className='second-row'>
                        {pathBuffer && 
                            <button className='path-button' onClick={handlePath}>
                                Change Path
                                <Pencil size={12} style={{borderBottom:"solid", borderWidth:"1px"}}/>
                            </button>
                        }
                    </span>
                </div>

                {!enable && <div className='playitgg-overlay'/>}
            </div>
            

            <h3>RAM Allocation</h3>
            <div className='ram-allocation'>
                <div className='ram-div'>
                    <label htmlFor="min-ram">Min RAM</label>
                    <span><input 
                        id='min-ram' 
                        name="min-ram" 
                        type="number" 
                        value={ram.min}
                        onChange={(e) => handleMin(e)}/> 
                        MB
                    </span>
                </div>
                
                <div className='ram-div'>
                    <label htmlFor="max-ram">
                        Max RAM
                    </label>
                    <span>
                        <input 
                        id='max-ram' 
                        name="max-ram" 
                        type="number" 
                        value={ram.max}
                        onChange={(e) => handleMax(e)}/> 
                    MB
                    </span>
                </div>
            </div>
            <span className='save-span'>
                <button className='save-button' onClick={handleSave}>Save Changes</button>
            </span>
        </div>
    )
}