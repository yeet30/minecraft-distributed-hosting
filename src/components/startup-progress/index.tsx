import './startup-progress.css'
import { useState, useEffect } from 'react';
import { Loader2, Check, X } from 'lucide-react';

type ProgressStep = {
    message: string;
    status: 'loading' | 'done' | 'error';
    importance: 'major' | 'minor';
}

export default function StartupProgress(){

    const [minorStep, setMinorStep] = useState<ProgressStep>({
        message: "",
        status: "loading",
        importance: "minor"
    });
    const [majorStep, setMajorStep] = useState<ProgressStep>({
        message: "",
        status: "loading",
        importance: "major"
    })

    useEffect(() => {
        window.ipcRenderer.on("startup-progress", (_, step: ProgressStep) => {
            if(step.importance === "minor")
                setMinorStep(step);
            else setMajorStep(step)
        });
    }, []);

    return (
        <div className="startup-progress">
            {majorStep.message &&
                <div className={`progress-step ${majorStep.status} ${majorStep.importance}`}>
                    {majorStep.status === 'loading' && <Loader2 size={12} className="spinner"/>}
                    {majorStep.status === 'done' && <Check size={12}/>}
                    {majorStep.status === 'error' && <X size={12}/>}
                    <span>{majorStep.message}</span>
                </div>
            }
            {minorStep.message &&
                <div className={`progress-step ${minorStep.status} ${minorStep.importance}`}>
                    {minorStep.status === 'loading' && <Loader2 size={12} className="spinner"/>}
                    {minorStep.status === 'done' && <Check size={12}/>}
                    {minorStep.status === 'error' && <X size={12}/>}
                    <span>{minorStep.message}</span>
                </div>
            }
        </div>
    )
}