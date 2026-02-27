import { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './main-page.css'
import GreetingSection from "../../components/greeting-section"
import BurgerMenu from '../../components/burger-menu';
import MembersSection from '../../components/members-section';

export default function MainPage(){

    const navigate = useNavigate();

    const [loadingUser,setLoadingUser] = useState(false);
    const [userProps,setUserProps] = useState({
        name: '',
        picture: ""
    })

    const greetingProps = {
        userProps: userProps,
        loadingUser: loadingUser
    }

    useEffect(() =>{
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
        checkLoggedIn();
        loadUser();
    },[])


    return (
        <section id="main-section">
            <section id='members-section'>
                <MembersSection/>
            </section>
            <section id='greeting-section'>
                <GreetingSection {...greetingProps}/>
            </section>
            <section id='menu-section'>
                <BurgerMenu {...userProps}/>
            </section>
        </section>
    )
}