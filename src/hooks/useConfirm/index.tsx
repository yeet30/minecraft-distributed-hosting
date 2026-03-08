import { useState } from "react"
import Popup from "../../components/popup"

export function useConfirm() {

    const [isOpen, setIsOpen] = useState(false)
    const [text, setText] = useState("")
    const [confirmText, setConfirmText] = useState("Confirm")
    const [cancelText, setCancelText] = useState("Cancel")

    const [resolver, setResolver] = useState<(value:boolean)=>void>()

    function confirm(options:{
        message:string
        confirmText?:string
        cancelText?:string
    }){

        setText(options.message)
        setConfirmText(options.confirmText ?? "Confirm")
        setCancelText(options.cancelText ?? "Cancel")

        setIsOpen(true)

        return new Promise<boolean>((resolve)=>{
            setResolver(() => resolve)
        })
    }

    function handleAccept(){
        resolver?.(true)
        setIsOpen(false)
    }

    function handleClose(){
        resolver?.(false)
        setIsOpen(false)
    }

    const popup = (
        <Popup
            isOpen={isOpen}
            onClose={handleClose}
            onAccept={handleAccept}
            confirmingOption={confirmText}
            decliningOption={cancelText}
        >
            {text}
        </Popup>
    )

    return { confirm, popup }
}