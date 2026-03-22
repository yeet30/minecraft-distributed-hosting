import { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './main-page.css'
import GreetingSection from "../../components/greeting-section"
import BurgerMenu from '../../components/burger-menu';
import MembersSection from '../../components/members-section';
import {IServerFolder} from '../../lib/types.ts'

export default function MainPage(){

    const navigate = useNavigate();

    const [servers, setServers] = useState<IServerFolder[]>([]);
    const [selectedServer, setSelectedServer] = useState<number>(0);
    const [loadingServers, setLoadingServers] = useState(false);
    const [serversErrors,setServersErrors] = useState("");
    const [loadingUser,setLoadingUser] = useState(false);
    const [userProps,setUserProps] = useState({name: "", email: "",picture: ""})

    const greetingProps = {
        userProps: userProps,
        loadingUser: loadingUser,
        selectedServer: servers[selectedServer],
        setSelectedServer: setSelectedServer
    }

    const driveProps = {
        servers: servers,
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
            email: user.email,
            picture: user.picture
        });
        setLoadingUser(false)
    }

    async function loadServers(){
        setLoadingServers(true);

        const ownedResult = await window.ipcRenderer.invoke("drive-get-root");
        const joinedResult = await window.ipcRenderer.invoke("get-joined-folders");

        const owned = ownedResult.success ? ownedResult.servers : [];
        const joined = joinedResult.success ? joinedResult.servers : [];

        setServersErrors((!ownedResult.success ? ownedResult.error : '') + (!joinedResult.success ? joinedResult.error : ''))
        setServers([...owned,...joined]);

        console.log(servers)

        setLoadingServers(false);
    };

    useEffect(() =>{
        checkLoggedIn();
        loadUser();
        loadServers();
    },[])

    useEffect(()=>{
        setSelectedServer(0)
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
                <BurgerMenu userProps={userProps} driveProps={driveProps}/>
            </section>
        </section>
    )
}