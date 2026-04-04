import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './main-page.css'
import GreetingSection from "../../components/greeting-section"
import BurgerMenu from '../../components/burger-menu';
import MembersSection from '../../components/members-section';
import { useUserStore, useServerStore, useLocalStore } from '../../store/store.ts'
import { ILockStatus } from '../../lib/types.ts';
import { useConfirm } from '../../hooks/useConfirm/index.tsx';

export default function MainPage(){

    const navigate = useNavigate();
    const { confirm, popup } = useConfirm();
    const { selectedServer, loadServers, setServerByIndex, setLockStatus } = useServerStore();
    const { loadUser, checkDriveScope } = useUserStore();
    const { loadLocalVariables } = useLocalStore();
    
    const [isQuitting, setIsQuitting] = useState(false);

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

    useEffect(() => {
        if (!selectedServer) return;

        const handler = (_: unknown, lock: ILockStatus) => {
            setLockStatus(lock);
        };

        window.ipcRenderer.on("lock-updated", handler);

        return () => {
            window.ipcRenderer.off("lock-updated", handler);
        };
    }, [selectedServer]);

    useEffect(() => {
        window.ipcRenderer.on('app-quitting', () => {
            setIsQuitting(true)
        })
    }, [])

    useEffect(() => {
        const handler = async (_: unknown, { isHosting }: { isHosting: boolean }) => {
            const confirmed = await confirm({
                message: isHosting
                    ? "You are currently hosting a server. Closing will stop the server and upload all files to the cloud. This may take a moment."
                    : "Are you sure you want to quit?",
                confirmText: "Quit",
                cancelText: "Cancel"
            });

            if (confirmed) {
                window.ipcRenderer.invoke('confirm-quit-response', true);
            }
        };

        window.ipcRenderer.on('confirm-quit', handler);
        return () => window.ipcRenderer.off('confirm-quit', handler);
    }, []);


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

            {popup}

            {isQuitting && (
                <div className='quit-overlay'>
                    <p>Stopping server...</p>
                </div>
            )}
        </section>
    )
}