import './scripts-options.css'
import { Pencil } from 'lucide-react'
import { useEffect, useState } from 'react';
import { useLocalStore } from '../../store/store';
import { IChecklist } from '../../lib/types';
import OptionRow from '../option-row';

export default function ScriptsOptions(){

    const { checklist, javaFlags, playitggPath, setPlayitggPath, setJavaFlags, setChecklist} = useLocalStore();
    const [checklistBuffer, setChecklistBuffer] = useState<IChecklist>(checklist)
    const [pathBuffer, setPathBuffer] = useState<string>(playitggPath)
    const [flagsBuffer,setflagsBuffer] = useState({
        minRAM: javaFlags.minRAM,
        maxRAM: javaFlags.maxRAM,
        customFlags: javaFlags.customFlags
    })

    async function handlePath(){
        const path = await window.ipcRenderer.invoke("choose-file-directory")
        if(!path || path === playitggPath)
            return
        setPathBuffer(path)
    }

    function handleMin(e:React.ChangeEvent<HTMLInputElement>){
        if (e.target.value === "") return
        const value = Number(e.target.value)
        if(value> flagsBuffer.maxRAM) {
            setflagsBuffer(prev => ({...prev, minRAM: flagsBuffer.maxRAM}))
            return
        }
        setflagsBuffer(prev => ({...prev, minRAM: Number(e.target.value)}))
    }

    function handleMax(e:React.ChangeEvent<HTMLInputElement>){
        setflagsBuffer(prev => ({...prev, maxRAM: Number(e.target.value)}))
    }

    function handleFlags(e:React.ChangeEvent<HTMLInputElement>){
        setflagsBuffer(prev => ({...prev, customFlags: e.target.value}))
    }

    useEffect(()=>{
        setPathBuffer(playitggPath)
    }, [playitggPath])
    
    async function handleSave() {
        if (checklistBuffer.playitgg && !pathBuffer) {
            alert("Please set the path if you want to enable playit.gg!");
            return;
        }

        if (!checklistBuffer.playitgg)
            setPathBuffer("");

        let changes: string[] = [];

        if (pathBuffer !== playitggPath) {
            setPlayitggPath(pathBuffer);
            changes.push("path");
        }

        if (!checklistBuffer.playitgg && playitggPath !== "") {
            setPlayitggPath("");
            changes.push("path");
        }

        if(flagsBuffer.customFlags !== javaFlags.customFlags) {
            setJavaFlags(javaFlags.minRAM, javaFlags.maxRAM, flagsBuffer.customFlags)
            changes.push("custom flags")
        }

        if (flagsBuffer.minRAM !== javaFlags.minRAM || flagsBuffer.maxRAM !== javaFlags.maxRAM) {
            setJavaFlags(flagsBuffer.minRAM, flagsBuffer.maxRAM, javaFlags.customFlags)
            changes.push("ram");
        }

        if(checklistBuffer.download !== checklist.download 
            || checklistBuffer.upload !== checklist.upload 
            || checklistBuffer.playitgg !== checklist.playitgg
            || checklistBuffer.serverConsole !== checklist.serverConsole
        ){
            setChecklist(checklistBuffer)
            changes.push("startup options")
        }

        if (changes.length > 0){
            let changesText = "";
            if (changes.length > 2) {
                changesText = changes.slice(0, changes.length - 1).join(", ").concat(" and ", changes[changes.length - 1])
            }
            else changesText = changes.join(" and ")
            alert(`Changes made to the ${changesText} are saved.`);
        }
            
        else
            alert("No changes have been made.")
    }

    if(!checklist)
        return <h3>Loading...</h3>
    return (
        <div className='scripts-wrapper'>
        <div className='options-div'>
            <OptionRow 
                title='Playitgg' 
                enable={checklistBuffer.playitgg} 
                onChange={(newValue) => setChecklistBuffer(prev => ({ ...prev, playitgg: newValue }))}
            >
                <p>Launches the Playit.gg console on startup.</p>
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
            </OptionRow>
            
            <OptionRow 
                title='Launch Server Console' 
                enable={checklistBuffer.serverConsole} 
                onChange={(newValue) => setChecklistBuffer(prev => ({ ...prev, serverConsole: newValue }))}
            >
                <p>Starts the server console on startup.</p>
                <div className='java-flags'>
                    <h4 className='flag-title'>RAM Allocation</h4>
                    <div className='ram-allocation'>
                        <div className='ram-div'>
                            <label htmlFor="min-ram">Min RAM</label>
                            <span>
                                <input 
                                    id='min-ram' 
                                    name="min-ram" 
                                    type="number" 
                                    value={flagsBuffer.minRAM}
                                    onChange={(e) => handleMin(e)}
                                /> 
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
                                value={flagsBuffer.maxRAM}
                                onChange={(e) => handleMax(e)}
                                /> 
                            MB
                            </span>
                        </div>
                    </div>

                    <h4 className='flag-title'>Custom Java Flags</h4>
                    <div className='flags-div'>
                        <input 
                            id='flags-input' 
                            name='flags-input'
                            type="text" 
                            placeholder='Use this field only if you know what you are doing.'
                            value={flagsBuffer.customFlags}
                            onChange={(e)=> handleFlags(e)}
                        />
                    </div>
                </div>
            </OptionRow>

            <OptionRow 
                title='Download' 
                enable={checklistBuffer.download} 
                onChange={(newValue) => setChecklistBuffer(prev => ({ ...prev, download: newValue }))}
            >
                <p>Download the files from the shared drive on startup.</p>
            </OptionRow>

            <OptionRow 
                title='Upload' 
                enable={checklistBuffer.upload} 
                onChange={(newValue) => setChecklistBuffer(prev => ({ ...prev, upload: newValue }))}
            >
                <p>Uploads the files to the shared drive on close down.</p>
            </OptionRow>
        </div>

            <span className='save-span'>
                <button className='save-button' onClick={handleSave}>Save Changes</button>
            </span>
        </div>
    )
}