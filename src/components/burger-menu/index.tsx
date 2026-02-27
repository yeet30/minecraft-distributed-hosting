import { useState } from "react";
import './burger-menu.css';

export default function BurgerMenu({userName,picture}:any){

    const [isOpen,setIsOpen] = useState(false);

    return (
        <section id="wrapper">
            <div id="menu-clicker" onClick={()=>{setIsOpen(!isOpen)}} className={isOpen ? 'open' : 'close'}>
                <img
                id="profile-picture"
                src={picture} 
                alt="Profile Picture" 
                width="40"
                height="40"
                />
                <span id="settings-span" className={isOpen ? 'open' : 'close'}>Settings</span>
                <div id="hamburger-icon">
                    ☰
                </div>
            </div>
            <div id="drawer" className={isOpen ? 'open' : 'close'}>
                <ul className={isOpen ? 'open' : 'close'}>
                    <li onClick={() => setIsOpen(false)}>Option 1</li>
                    <li onClick={() => setIsOpen(false)}>Option 2</li>
                    <li onClick={() => setIsOpen(false)}>Option 3</li>
                </ul>
            </div>
            {isOpen && <div id="burger-overlay" onClick={() => setIsOpen(false)}/>}
        </section>
    )
}