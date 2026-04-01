import './options-row.css'
import { ReactNode } from 'react'

type OptionProps = {
    title: string,
    enable: boolean,
    onChange: (newValue: boolean ) => void;
    children: ReactNode
}

export default function OptionRow({title, enable, onChange, children}: OptionProps){

    return (
        <div className='option-row-wrapper'>

            <label  htmlFor={`enable-check-${title}`} className={`enable-label ${enable ? "enabled" : ""}`}>
                Enable
                <input 
                type="checkbox"
                name="enable-check" 
                id={`enable-check-${title}`}
                checked={enable}
                onChange={(e) => onChange(e.target.checked)}/>
            </label>

            <div className='contents'>
                <span className='title-row'>
                    <h3>{title}</h3>
                </span>
                <div>
                    {children}
                </div>
            </div>

            {!enable && <div className='overlay'></div>}
        </div>
    )
}