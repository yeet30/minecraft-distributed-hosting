import './modal.css'
import { useState } from 'react';

export default function Modal({isOpen, onClose, children}:any){

    const [activeTab,setActiveTab] = useState(0)
    
    if(!isOpen) return null;

    return (
        <>
            <div id='modal-overlay' onClick={onClose}/>
            <div id='modal'>
                <button id='modal-close' onClick={onClose}>✕</button>
                <div id='modal-tabs'>
                    {children.map((item: any,index:number) => (
                        <h4 key={index} 
                        className={`tab ${activeTab === index ? 'active': ''}`}
                        onClick={()=>{setActiveTab(index)}}>
                            {item.title}
                        </h4>
                    ))}
                </div>
                <div id='title-seperator'/>
                <div id='children'>{children[activeTab].content}</div>
            </div>   
        </>
    )
}