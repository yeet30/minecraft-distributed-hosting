import { useState } from 'react'
import './permissions-list.css'
import { ChevronsDown, ChevronsLeft, Trash2 } from 'lucide-react'
import Modal from '../modal'
import InvitationInterface from '../invitation-interface'
import { IPermittedUser } from '../../lib/types'

type Props = {
    permissionsList: IPermittedUser[],
    serverId: string,
    isOwner: boolean,
    loadServers: () => void;
}

export default function PermissionsList({ permissionsList, serverId , isOwner, loadServers}: Props) {

    const [list, setList] = useState(permissionsList)
    const [isListOpen, setIsListOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);

    function handleMembers() {
        setIsListOpen(!isListOpen)
    }

    async function handleAdd() {
        setIsModalOpen(true)
    }

    async function handleRemove(memberId: string) {

        try {
            const result = await window.ipcRenderer.invoke('drive-remove-permission', serverId, memberId)
        
            if (!result.success){
                alert(result.error)
                return
            }
            
            setList(prev => prev.filter(item => item.id !== memberId))

            alert("User removed.")

            loadServers()

        } catch (error) {
            console.error(error)
        }
        
    }

    return (
        <>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} width={450} height={350} items={[
                {
                    title: "Invite User",
                    content: <InvitationInterface serverId={serverId} loadServers={loadServers}/>
                }
            ]} />

            <div id='permissions-dropdown'>
                <button id='permissions-button' className={isListOpen ? 'open' : ''} onClick={handleMembers}>
                    <span id='permissions-title' className={isListOpen ? 'open' : ''}>Members</span>
                    <span id='permissions-chevrons'>{isListOpen ? <ChevronsDown size={18} /> : <ChevronsLeft size={18} />}</span>
                </button>
                <div id='permissions-drawer' className={isListOpen ? 'open' : ''}>
                    <span id='members-titles'>
                        <span>Username</span>
                        <span>Role</span>
                    </span>
                    {list.map(member => (
                        <span id='members-item' key={member.id}>
                            <span id='member-span'>
                                <span id='member-username'>{member.displayName}</span>
                                <span id='member-role'>({member.role})</span>
                                <span id='member-remove'>
                                    {isOwner
                                        && <button id='remove-button' onClick={() => { handleRemove(member.id) }}><Trash2 size={16} /></button>
                                    }
                                </span>
                            </span>
                        </span>
                    ))}
                    {isOwner && <span id='invite-member'><button onClick={handleAdd}>Invite Member</button></span>}
                </div>
            </div>
        </>
    )
}