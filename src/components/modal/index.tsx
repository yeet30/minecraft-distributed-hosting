import './modal.css'
import { useState, useEffect } from 'react';
import { IModalItems } from '../../lib/types';

interface IModal {
    isOpen: boolean,
    onClose: () => void,
    items: IModalItems[],
    width?: number,
    height?: number
}

export default function Modal({ isOpen, onClose, items, width = 400, height = 300}: IModal) {

    const [activeTab, setActiveTab] = useState(0)

    useEffect(() => {
        setActiveTab(0)
    }, [items, isOpen])

    if (!isOpen) return null;

    const safeIndex = activeTab < items.length ? activeTab : 0;

    return (
        <div className='modal-wrapper'>
            <div id='modal-overlay' onClick={onClose} />
            <div id='modal'
                style={{
                    width: width,
                    height: height
                }}
            >
                <button id='modal-close' onClick={onClose}>✕</button>
                <div className='tab-section'>
                    <div id='modal-tabs'>
                        {items.map((item: any, index: number) => (
                            <h4 key={index}
                                className={`tab ${activeTab === index ? 'active' : ''}`}
                                onClick={() => { setActiveTab(index) }}>
                                {item.title}
                            </h4>
                        ))}
                    </div>
                    <div id='title-seperator' />
                </div>
                <div id='children'>{items[safeIndex].content}</div>
            </div>
        </div>
    )
}