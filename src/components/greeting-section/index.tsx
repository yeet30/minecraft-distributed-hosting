import './greeting-section.css'
import { useServerStore, useUserStore } from '../../store/store'
import SelectServer from '../select-server';
import { ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import PermissionInformation from '../permission-information';
import ServerConsole from '../server-console';
import PlayitggLink from '../playitgg-link';
import OnOffButton from '../onOff-button';

export default function GreetingSection() {

    const { userName, loadingUser, driveScopeAllowed } = useUserStore();
    const { hostingStatus} = useServerStore();

    const [notAtTop, setNotAtTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
        setNotAtTop(window.scrollY > 0);
        };

        window.addEventListener("scroll", handleScroll);

        // Initial check
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (loadingUser)
        return <h2 className="greeting-title">Loading user information...</h2>
    else if(!driveScopeAllowed)
        return (
            <section className="greeting-wrapper">
                <h2 className="greeting-title">Welcome, {userName}!</h2>
                <PermissionInformation/>
            </section>
        )
    return (
        <section className="greeting-wrapper">
            <div className='first-page'>
                <h2 className="greeting-title">Welcome, {userName}!</h2>
                <div className='starter-section'>
                <div><OnOffButton/></div>
                <div><SelectServer/></div>
                <div className='playitgg-link'>
                    <PlayitggLink/>
                </div>
            </div>
            </div>
            {hostingStatus && hostingStatus?.isHosted
            }
            <div className='console-section'><ServerConsole/></div>
            {notAtTop && 
                <button 
                className='scroller-button'
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                    <ChevronUp size={20}/>
                </button>}
        </section>
    )
}