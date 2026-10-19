import React, { useEffect, useRef, useState } from 'react'
import { FaStepBackward, FaStepForward } from "react-icons/fa";
import { useLocation, useNavigate } from 'react-router';

const NavigationButtons = () => {
    const navigate = useNavigate();
    const [hasNavigated, setHasNavigated] = useState(false);
    const location = useLocation();
    useEffect(() => {
        if (location.pathname != "/") {
            setHasNavigated(true);
        }
    }, [location.pathname])
    const handleBack = () => {
        navigate(-1);
    }
    const handleForward = () => {
        navigate(+1);
    }
    return (
        <div className='h-full w-[20%] flex gap-1.5 opacity-50 hover:opacity-100 items-center justify-center' hidden={hasNavigated === false}>
            <div className='rounded-full opacity-20 hover:opacity-100 active:scale-105 transition-all' onClick={handleBack}><FaStepBackward size={40} /></div>
            <div className='rounded-full opacity-20 hover:opacity-100 active:scale-105 transition-all' onClick={handleForward}><FaStepForward size={40} /></div>
        </div>
    )
}

export default NavigationButtons;