import { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './main-page.css'

export default function MainPage(){
    
    const navigate = useNavigate();

    const [name,setName] = useState('');
    const [loadingUser,setLoadingUser] = useState(false);
    const [loggingOut,setLoggingOut] = useState(false);

    useEffect(() =>{
        async function checkLoggedIn(){
            const loggedIn = await window.ipcRenderer.invoke("google-is-logged-in");
            if(!loggedIn) navigate ("/")
        }
        async function loadUser(){
            setLoadingUser(true)
            const user = await window.ipcRenderer.invoke("google-get-user")
            setName(user.name);
            setLoadingUser(false)
        }
        checkLoggedIn();
        loadUser();
    },[])

    async function handleLogout(){
        setLoggingOut(true)    
        const response = await window.ipcRenderer.invoke("google-logout")
        setLoggingOut(false)
        if(response.success) 
            navigate("/")
    }

    return (
        <>
            <section id="greeting-section">
                {loadingUser
                    ? <p>Loading user information...</p>
                    : <h1>Welcome, {name}!</h1>
                }
                {loggingOut && (
                    <p>Logging out...</p>
                )}
                <button onClick={handleLogout} disabled={loggingOut}>Log out</button>
            </section>
            
        </>
    )
}