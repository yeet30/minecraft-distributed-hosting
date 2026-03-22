import './popup.css'

export default function Popup({isOpen, onClose,onAccept,confirmingOption,decliningOption,children}:any){

    if(!isOpen) return null;

    return (
        <div className='popup-wrapper'>
            <div id='popup-overlay' onClick={(e) => { e.stopPropagation(); onClose(); }}/>
                <div id='popup' onClick={(e) => e.stopPropagation()}>
                    <div id='children'>{children}</div>
                    <span id='popup-options'>
                        <button onClick={onClose}>{decliningOption}</button>
                        <button onClick={onAccept}>{confirmingOption}</button>
                    </span>
                <button id='popup-close' onClick={onClose}>✕</button>
            </div>   
        </div>
    )
}