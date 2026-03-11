import { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './main-page.css'
import GreetingSection from "../../components/greeting-section"
import BurgerMenu from '../../components/burger-menu';
import MembersSection from '../../components/members-section';

export default function MainPage(){

    const navigate = useNavigate();

    const [servers, setServers] = useState<{ id: string; name: string ; path: string}[]>([]);
    const [selectedServer, setSelectedServer] = useState<{ id: string; name: string ; path: string}>(servers[0]);
    const [loadingServers, setLoadingServers] = useState(false);
    const [serversErrors,setServersErrors] = useState("");
    const [loadingUser,setLoadingUser] = useState(false);
    const [userProps,setUserProps] = useState({
        name: '',
        picture: ""
    })

    const greetingProps = {
        userProps: userProps,
        loadingUser: loadingUser,
        servers: servers,
        selectedServer: selectedServer,
        setSelectedServer: setSelectedServer
    }

    const driveProps = {
        ownedServers:servers,
        joinedServers:[servers[0]],
        loadingServers: loadingServers,
        serversErrors: serversErrors,
        loadServers: loadServers
    }

    async function checkLoggedIn(){
        const loggedIn = await window.ipcRenderer.invoke("google-is-logged-in");
        if(!loggedIn) navigate ("/")
    }

    async function loadUser(){
        setLoadingUser(true)
        const user = await window.ipcRenderer.invoke("google-get-user")
        setUserProps({
            name: user.name,
            picture: user.picture
        });
        setLoadingUser(false)
    }

    async function loadServers(){
        setLoadingServers(true);

        const result = await window.ipcRenderer.invoke("drive-get-root");

        if (result.success) {
            for (const server of result.servers) 
                server.path = await window.ipcRenderer.invoke("get-server-path", server.id) || "";
            setServers(result.servers);
        }
        else
            setServersErrors(result.error);

        setLoadingServers(false);
    };

    useEffect(() =>{
        checkLoggedIn();
        loadUser();
        loadServers();
    },[])

    useEffect(()=>{
        setSelectedServer(servers[0])
    },[servers])


    return (
        <section id="main-section">
            <section id='members-section'>
                <MembersSection/>
            </section>
            <section id='greeting-section'>
                <GreetingSection {...greetingProps}/>
            </section>
            <section id='menu-section'>
                <BurgerMenu picture={userProps.picture} driveProps={driveProps}/>
            </section>
        </section>
    )
}