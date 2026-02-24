import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './login-page.css';

export default function LoginPage(){

    const navigate = useNavigate();

    const [error,setError] = useState("");
    const [loading,setLoading] = useState(false);

    async function handleLogin() {
        setLoading(true)
        const result = await window.ipcRenderer.invoke("google-login");
        setLoading(false)

        if(result.success)
            navigate("/main")
        else
            setError(result.error || "Login Failed")
    };

    useEffect(() => {
        async function checkLoggedIn(){
            const loggedIn = await window.ipcRenderer.invoke("google-is-logged-in");
            if(loggedIn) navigate ("/main")
        }
        checkLoggedIn();
    },[])


    return (
        <div className='wrapper'>
            <h1 id='login-title'>Please login with your Google account</h1>
            <p>{loading && "Waiting for authentication"}</p>
            <button id='login-button' onClick={handleLogin} disabled={loading}>
                Login
            </button>
            {error && (
                <p style ={{color:"red"}}>
                    {error}
                </p>
            )}
        </div>
    )
}

