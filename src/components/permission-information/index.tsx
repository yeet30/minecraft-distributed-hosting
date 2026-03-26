import './permission-information.css'
import { useServerStore, useUserStore } from '../../store/store';
import { useState } from 'react';
import { Loader2, AlertCircle, ExternalLink } from 'lucide-react';

export default function PermissionInformation() {

    const { driveScopeAllowed, checkDriveScope}= useUserStore();
    const { loadServers } = useServerStore();
    
    const [loadingLaunch, setLoadingLaunch] = useState(false);

    async function handleLaunch(){
        setLoadingLaunch(true)
        const result = await window.ipcRenderer.invoke("request-drive-scope");
        if (!result.success) {
            alert(result.error);
            return;
        }
        setLoadingLaunch(false)
        checkDriveScope()
        loadServers()
    }

    if (!driveScopeAllowed)
        return (
            <div className='permission-information'>
                <h3>Please grant the app permission to see the files created by others and the folders you joined.</h3>
                <div className='access-statement'>
                    <AlertCircle size={48}/>
                    <h4> The app is only able to see the folders you give access to.</h4>
                </div>
                <span>
                    <button 
                    onClick={handleLaunch}
                    disabled={loadingLaunch}>
                        {loadingLaunch ? <Loader2 size={16} className='spinner'/> : ''}
                        Enable Collaboration <ExternalLink size={16}/>
                    </button>
                </span>
            </div>
        )
    
}