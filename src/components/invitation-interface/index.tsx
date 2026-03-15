import { useState } from 'react'
import './invitation-interface.css'

type Props = {
    serverId : string
}

export default function InvitationInterface({serverId}:Props){

    const [email,setEmail] = useState('')
    const [role,setRole] = useState('writer')
    const [message,setMessage] = useState('')

    async function handleSend() {

        const result = await window.ipcRenderer.invoke("drive-invite-user", serverId, email, message)

        if(!result.success){
            alert(result.error)
            return
        }
        alert("Invitation sent.")
    }

    return (
        <>
            <div id='invitation-wrapper'>
                <form action="">
                    <div id='email-div' className='input-div'>
                        <label htmlFor="invitation-email">
                            <h4 className='input-title'>User's Email Address</h4>
                        </label>
                        <input 
                        type="email" 
                        name="invitation-email" 
                        id="invitation-email" 
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}/>
                    </div>

                    <div id='role-div' className='input-div'>
                        <h4 className='input-title'>Role</h4>
                        <div className='radio-div'>
                            <input 
                            type="radio" 
                            name="user-role"
                            id='radio-writer'
                            className='user-role' 
                            value="writer" 
                            checked={role==='writer'}
                            onChange={(e)=>setRole(e.target.value)}
                            defaultChecked={true}/>
                            <label htmlFor="radio-writer" className='radio-label'>
                                Writer <span className='radio-description'>(can download and upload files)</span>
                            </label>
                        </div>

                        <div className='radio-div'>
                            <input 
                            type="radio" 
                            name="user-role"
                            id='radio-reader' 
                            className='user-role' 
                            value="reader"
                            checked={role==='reader'}
                            onChange={(e)=>setRole(e.target.value)}/>
                            <label htmlFor="radio-reader" className='radio-label'>
                                Reader <span className='radio-description'>(can download files only)</span> 
                            </label>
                        </div>
                    </div>
                    
                    <div id='message-div' className='input-div'>
                        <label htmlFor="invitation-message">
                            <h4 className='input-title'>Message </h4><span className='radio-description'>(optional)</span>
                        </label>
                        <textarea 
                        name="invitation-message" 
                        id="invitation-message"
                        rows={1}
                        value={message}
                        onChange={(e)=>setMessage(e.target.value)}/>
                    </div>
                    
                    <div id='email-buttons'>
                        <button>Cancel</button>
                        <button onClick={handleSend}>Send</button>
                    </div>

                </form>
            </div>
        </>
    )
}