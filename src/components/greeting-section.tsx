import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

export default function GreetingSection({userProps, loadingUser}:any){

    const navigate = useNavigate();

    const [loggingOut,setLoggingOut] = useState(false);

    async function handleLogout(){
        setLoggingOut(true)    
        const response = await window.ipcRenderer.invoke("google-logout")
        setLoggingOut(false)
        if(response.success) 
            navigate("/")
    }

    useEffect(()=>{
        
    },[])

    if(loadingUser)
        return <h2>Loading user information...</h2>
    else
        return (
            <section style={{
                width: "100%",
                textAlign: "center"
            }}>
                <h2
                    style={{fontSize:"2rem"}}
                >Welcome, {userProps.name}!
                </h2>
                {loggingOut && (
                    <p>Logging out...</p>
                )}
                <button onClick={handleLogout} disabled={loggingOut}>Log out</button>
            </section>
        )
}