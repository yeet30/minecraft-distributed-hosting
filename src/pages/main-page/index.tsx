import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './main-page.css'
import GreetingSection from "../../components/greeting-section"
import BurgerMenu from '../../components/burger-menu';
import MembersSection from '../../components/members-section';
import { useUserStore, useServerStore, useLocalStore } from '../../store/store.ts'

export default function MainPage(){

    const navigate = useNavigate();

    const { loadServers, setServerByIndex } = useServerStore();
    const { loadUser, checkDriveScope } = useUserStore();
    const { loadLocalVariables } = useLocalStore();

    async function checkLoggedIn(){
        const loggedIn = await window.ipcRenderer.invoke("google-is-logged-in");
        if(!loggedIn) navigate ("/")
    }

    useEffect(() =>{
        async function init() {
            await checkLoggedIn();
            await loadUser();
            await checkDriveScope();
            await loadLocalVariables();
            await loadServers();

            const index = useLocalStore.getState().selectedIndex;
            setServerByIndex(index);
        }
        init()
    },[])


    return (
        <section id="main-section">
            <section id='members-section'>
                <MembersSection/>
            </section>
            <section id='greeting-section'>
                <GreetingSection/>
            </section>
            <section id='menu-section'>
                <BurgerMenu/>
            </section>
        </section>
    )
}