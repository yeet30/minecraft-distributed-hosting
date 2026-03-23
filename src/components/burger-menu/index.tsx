import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './burger-menu.css';
import Modal from "../modal";
import OwnedDriveFolders from "../owned-drive-folders";
import JoinedDriveFolders from "../joined-drive-folders";
import { useUserStore } from "../../store/store";

export default function BurgerMenu() {

    const {userPicture} = useUserStore(); 

    const navigate = useNavigate();

    const [isMenuOpen, setisMenuOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const items = [
        {
            title: "Your Folders",
            content: <OwnedDriveFolders/>
        },
        {
            title: "Joined Folders",
            content: <JoinedDriveFolders/>
        }
    ]

    async function handleLogout() {
        setLoggingOut(true)
        setisMenuOpen(false)
        const response = await window.ipcRenderer.invoke("google-logout")
        setLoggingOut(false)
        if (response.success)
            navigate("/")
    }

    function handleDrive() {
        setisMenuOpen(false)
        setIsModalOpen(true)
    }

    return (
        <section id="wrapper">

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} items={items}/>

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
                    <li onClick={() => setisMenuOpen(false)}>Scripts</li>
                    <li onClick={handleDrive}>Drive Folders</li>
                    <li onClick={handleLogout}>Log Out</li>
                    {loggingOut && (
                        <p>Logging out...</p>
                    )}
                </ul>
            </div>
            {isMenuOpen && <div id="burger-overlay" onClick={() => setisMenuOpen(false)} />}
        </section>
    )
}