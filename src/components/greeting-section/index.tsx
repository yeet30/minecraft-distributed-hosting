import './greeting-section.css'
import { useUserStore } from '../../store/store'
import SelectServer from '../select-server';
import { useState } from 'react';
import { Power } from 'lucide-react';

export default function GreetingSection(){

    const {userName, loadingUser} = useUserStore();

    const [isHosted,setIsHosted] = useState(true)

    async function handleStart(){
        
    }

    if(loadingUser)
        return <h2 className="greeting-title">Loading user information...</h2>
    else
        return (
            <section className="greeting-wrapper">
                <h2 className="greeting-title">Welcome, {userName}!</h2>

                <div className='starter-section'>
                    <div className='button-wrapper'>
                        <button className='starter-button' onClick={handleStart}>
                            <Power size={128}/>
                        </button>
                    </div>
                </div>

                <div className='server-info'>
                    <span><SelectServer/></span> 
                    {isHosted
                        ? <h4>is currently hosted by Player-1</h4>
                        : <h4>is not being hosted right now.</h4>
                    }
                </div>
            </section>
        )
}