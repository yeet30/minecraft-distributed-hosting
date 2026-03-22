import './modal.css'
import { ReactNode, useState } from 'react';

interface IModal {
    isOpen: boolean,
    onClose: () => void,
    items: {
        title: string,
        content: ReactNode
    }[],
    width?: number,
    height?: number
}

export default function Modal({ isOpen, onClose, items, width = 400, height = 300}: IModal) {

    const [activeTab, setActiveTab] = useState(0)

    if (!isOpen) return null;

    return (
        <div className='modal-wrapper'>
            <div id='modal-overlay' onClick={onClose} />
            <div id='modal'
                style={{
                    width: width,
                    height: height
                }}>
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
                <div id='children'>{items[activeTab].content}</div>
            </div>
        </div>
    )
}