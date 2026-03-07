import './modal.css'

export default function Modal({isOpen, onClose,title,children}:any){
    
    if(!isOpen) return null;

    return (
        <>
            <div id='modal-overlay' onClick={onClose}/>
            <div id='modal'>
                <h2 id='modal-title'>{title}</h2>
                <div id='children'>{children}</div>
                <button id='modal-close' onClick={onClose}>✕</button>
            </div>   
        </>
    )
}