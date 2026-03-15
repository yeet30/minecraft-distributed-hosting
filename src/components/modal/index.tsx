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
    maxHeight?: number
}

export default function Modal({ isOpen, onClose, items, width = 400, maxHeight = 300}: IModal) {

    const [activeTab, setActiveTab] = useState(0)

    if (!isOpen) return null;

    return (
        <>
            <div id='modal-overlay' onClick={onClose} />
            <div id='modal'
                style={{
                    width: width,
                    maxHeight: maxHeight
                }}>
                <button id='modal-close' onClick={onClose}>✕</button>
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
                <div id='children'>{items[activeTab].content}</div>
            </div>
        </>
    )
}