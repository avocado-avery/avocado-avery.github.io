import React, { useState, useEffect } from 'react'

function DesktopMenu(props) {

    const [isFullScreen, setIsFullScreen] = useState(false)

    useEffect(() => {
        document.addEventListener('fullscreenchange', checkFullScreen);
        return () => {
            document.removeEventListener('fullscreenchange', checkFullScreen);
        };
    }, [])


    const openTerminal = () => {
        props.openApp("terminal");
    }

    const openSettings = () => {
        props.openApp("settings");
    }

    const checkFullScreen = () => {
        if (document.fullscreenElement) {
            setIsFullScreen(true)
        } else {
            setIsFullScreen(false)
        }
    }

    const goFullScreen = () => {
        try {
            if (document.fullscreenElement) {
                document.exitFullscreen()
            } else {
                document.documentElement.requestFullscreen()
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    return (
        <div id="desktop-menu" className={(props.active ? " block " : " hidden ") + " context-menu-bg cursor-default w-52 text-left py-2 absolute z-50 text-xs font-mono"}>
            <div onClick={props.addNewFolder} className="w-full py-1 hover:bg-white hover:bg-opacity-5 mb-0.5">
                <span className="ml-4 text-ubt-blue">+</span> <span className="ml-2 text-ubt-grey">New Folder</span>
            </div>
            <Devider />
            <div className="w-full py-1 hover:bg-white hover:bg-opacity-5 mb-0.5" style={{ color: '#444' }}>
                <span className="ml-4">&nbsp;</span> <span className="ml-2">Paste</span>
            </div>
            <Devider />
            <div className="w-full py-1 hover:bg-white hover:bg-opacity-5 mb-0.5" style={{ color: '#444' }}>
                <span className="ml-4">&nbsp;</span> <span className="ml-2">Show Desktop in Files</span>
            </div>
            <div onClick={openTerminal} className="w-full py-1 hover:bg-white hover:bg-opacity-5 mb-0.5">
                <span className="ml-4 text-ubt-blue">$</span> <span className="ml-2 text-ubt-grey">Open in Terminal</span>
            </div>
            <Devider />
            <div onClick={openSettings} className="w-full py-1 hover:bg-white hover:bg-opacity-5 mb-0.5">
                <span className="ml-4 text-ubt-blue">&gt;</span> <span className="ml-2 text-ubt-grey">Change Background...</span>
            </div>
            <Devider />
            <div className="w-full py-1 hover:bg-white hover:bg-opacity-5 mb-0.5" style={{ color: '#444' }}>
                <span className="ml-4">&nbsp;</span> <span className="ml-2">Display Settings</span>
            </div>
            <div onClick={openSettings} className="w-full py-1 hover:bg-white hover:bg-opacity-5 mb-0.5">
                <span className="ml-4 text-ubt-blue">&gt;</span> <span className="ml-2 text-ubt-grey">Settings</span>
            </div>
            <Devider />
            <div onClick={goFullScreen} className="w-full py-1 hover:bg-white hover:bg-opacity-5 mb-0.5">
                <span className="ml-4 text-ubt-blue">#</span> <span className="ml-2 text-ubt-grey">{isFullScreen ? "Exit" : "Enter"} Full Screen</span>
            </div>
        </div>
    )
}

function Devider() {
    return (
        <div className="flex justify-center w-full">
            <div className="w-4/5 my-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}></div>
        </div>
    );
}


export default DesktopMenu
