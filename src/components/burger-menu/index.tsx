import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './burger-menu.css';
import Modal from "../modal";
import OwnedDriveFolders from "../owned-drive-folders";
import JoinedDriveFolders from "../joined-drive-folders";
import {IServerFolder} from '../../lib/types.ts'

type BurgerMenuProps = {
    userProps: {
        name: string,
        email: string,
        picture: string
    },
    driveProps: {
        servers: IServerFolder[],
        loadingServers: boolean,
        loadServers: ()=> void
    }
}

export default function BurgerMenu({ userProps, driveProps }: BurgerMenuProps) {

    const navigate = useNavigate();

    const [isMenuOpen, setisMenuOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const ownedProps = {
        servers: driveProps.servers.filter((s: IServerFolder) => s.type === 'owned'),
        loadingServers: driveProps.loadingServers,
        userEmail: userProps.email,
        loadServers: driveProps.loadServers
    }

    const joinedProps = {
        servers: driveProps.servers.filter((s: IServerFolder) => s.type === 'joined'),
        loadingServers: driveProps.loadingServers,
        userEmail: userProps.email,
        loadServers: driveProps.loadServers
    }

    const items = [
        {
            title: "Your Folders",
            content: <OwnedDriveFolders {...ownedProps}   />
        },
        {
            title: "Joined Folders",
            content: <JoinedDriveFolders {...joinedProps} />
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
                    src={userProps.picture}
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