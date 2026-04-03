import { Loader2 } from 'lucide-react';
import './joined-drive-folders.css'
import ServerSlot from '../server-slot';
import { useServerStore, useUserStore } from '../../store/store';
import PermissionInformation from '../permission-information';
import JoinServer from '../join-server';

export default function JoinedDriveFolders(){

    const { servers, loadingServers } = useServerStore();
    const { driveScopeAllowed} = useUserStore();

    return(
        <div className='joined-drive-folder'>
            <PermissionInformation/>
            {(loadingServers  && driveScopeAllowed)
                ? <span id='loading-span'>
                    <Loader2 size={24} className='spinner'/>
                    <h4>Loading servers...</h4>
                </span>
                : 
                <ul id='servers-ul'>
                    {servers.filter(server => server.type=== 'joined').map(server => (
                        <li key={server.id}>
                            <ServerSlot server={server}/>
                        </li>
                    )).reverse()}
                    <li>
                        <JoinServer/>
                    </li>
                </ul>
            }
        </div>
    )
}