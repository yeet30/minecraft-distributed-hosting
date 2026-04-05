import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './burger-menu.css';
import Modal from "../modal";
import OwnedDriveFolders from "../owned-drive-folders";
import JoinedDriveFolders from "../joined-drive-folders";
import ScriptsOptions from "../scripts-options";
import { useUserStore } from "../../store/store";
import { IModalItems } from "../../lib/types";

export default function BurgerMenu() {

    const {userPicture} = useUserStore(); 

    const navigate = useNavigate();

    const [isMenuOpen, setisMenuOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalItems, setModalItems] = useState<IModalItems[]>(
        [{
            title: "Your Folders",
            content: <OwnedDriveFolders/>
        }]
    )

    async function handleLogout() {
        setLoggingOut(true)
        const response = await window.ipcRenderer.invoke("google-logout")
        setLoggingOut(false)
        setisMenuOpen(false)
        if (response.success)
            navigate("/")
    }

    function handleScripts(){
        setisMenuOpen(false)
        setModalItems([{
            title: "Script Options",
            content: <ScriptsOptions/>
        }])
        setIsModalOpen(true)
    }

    function handleDrive() {
        setisMenuOpen(false)
        setModalItems([
            {
                title: "Your Folders",
                content: <OwnedDriveFolders/>
            },
            {
                title: "Joined Folders",
                content: <JoinedDriveFolders/>
            }
        ])
        setIsModalOpen(true)
    }

    return (
        <section id="burger-wrapper">

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} items={modalItems}/>

            <div id="menu-clicker" onClick={() => { setisMenuOpen(!isMenuOpen) }} className={isMenuOpen ? 'open' : 'close'}>
                <img
                    id="profile-picture"
                    src={userPicture}
                    alt="Profile Picture"
                    width="40"
                    height="40"
                />
                <span id="settings-span" className={isMenuOpen ? 'open' : 'close'}>Settings</span>
                <div id="hamburger-icon">
                    ☰
                </div>
            </div>
            <div id="drawer" className={isMenuOpen ? 'open' : 'close'}>
                <ul className={isMenuOpen ? 'open' : 'close'}>
                    <li onClick={handleScripts}>Scripts</li>
                    <li onClick={handleDrive}>Drive Folders</li>
                    <li onClick={handleLogout}>Log Out</li>
                    {loggingOut && ( <p>Logging out...</p> )}
                </ul>
            </div>
            {isMenuOpen && <div id="burger-overlay" onClick={() => setisMenuOpen(false)} />}
        </section>
    )
}