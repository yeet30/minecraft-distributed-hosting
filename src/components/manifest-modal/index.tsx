import { useEffect, useState } from 'react'
import './manifest-modal.css'
import { IManifestUpdates } from '../../lib/types'
import { useWatcherManifest, useServerStore } from '../../store/store'
import { FolderOpen } from 'lucide-react'

export default function ManifestModal({bufferType}: {bufferType: "upsert" | "remove"}){

    const {selectedServer} = useServerStore()
    const {trackedFiles} = useWatcherManifest();

    const [manifestChanges,setManifestChanges] = useState<IManifestUpdates>({
        toAdd: new Set<string>(), 
        toRemove: new Set<string>()
    })

    async function saveManifest(){
        await window.ipcRenderer.invoke("write-manifest", selectedServer?.path)
        getManifest()
    }

    async function getManifest() {
        const buff = await window.ipcRenderer.invoke("get-manifest-updates")
        setManifestChanges(buff)
    }

    useEffect(()=>{getManifest()},[trackedFiles])

    if(bufferType === "upsert")
        return(
            <div className='manifest-modal-wrapper'>
                <div className='manifest-title'>
                    <h4>Files to be updated in manifest.json:</h4>
                </div>
                <div className='files-div'>
                    <ul>
                        {Array.from(manifestChanges.toAdd).map((file)=>(
                            <li key={file}>{file}</li>
                        ))}
                    </ul>
                </div>
                <div className='manifest-buttons'>
                    <button 
                        onClick={()=> saveManifest()} 
                        title='Writes the changes to the manifest.json file'
                    >Write to Manifest
                    </button>
                    <button 
                        title='Open the manifest.json file'
                        onClick={()=>window.ipcRenderer.invoke("open-manifest", selectedServer?.path)}
                        >
                        <FolderOpen size={16}/>
                    </button>
                </div>
            </div>
        )
    else if(bufferType === "remove")
        return (
            <div className='manifest-modal-wrapper'>
                <div className='manifest-title'>
                    <h4>Files to be removed from manifest.json:</h4>
                </div>
                <div className='files-div'>
                    <ul>
                        {Array.from(manifestChanges.toRemove).map((file)=>(
                            <li key={file}>{file}</li>
                        ))}
                    </ul>
                </div>
                <div className='manifest-buttons'>
                    <button 
                        onClick={()=> saveManifest()} 
                        title='Writes the changes to the manifest.json file'
                    >Write to Manifest
                    </button>
                    <button 
                        title='Open the manifest.json file'
                        onClick={()=>window.ipcRenderer.invoke("open-manifest", selectedServer?.path)}
                        >
                        <FolderOpen size={16}/>
                    </button>
                </div>
            </div>
    )
}