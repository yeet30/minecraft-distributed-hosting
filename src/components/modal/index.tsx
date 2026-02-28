import './modal.css'

export default function Modal({isOpen, onClose,children}:any){
    
    if(!isOpen) return null;

    return (
        <>
            <div id='modal-overlay' onClick={onClose}/>
            <div id='modal'>
                <button id='modal-close' onClick={onClose}>✕</button>
                {children}
            </div>   
        </>
    )
}