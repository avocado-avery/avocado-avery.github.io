import React from 'react'

function BootingScreen(props) {

    return (
        <div style={(props.visible || props.isShutDown ? { zIndex: "100" } : { zIndex: "-20" })} className={(props.visible || props.isShutDown ? " visible opacity-100" : " invisible opacity-0 ") + " absolute duration-500 select-none flex flex-col justify-center items-center top-0 right-0 overflow-hidden m-0 p-0 h-screen w-screen bg-black"}>
            <img width="120px" height="120px" className="md:w-28 w-20" src="./themes/Yaru/status/arch-logo.svg" alt="Arch Linux Logo" style={{ opacity: 0.8 }} />
            <div className="mt-8 w-10 h-10 flex justify-center items-center cursor-pointer" onClick={props.turnOn} >
                {(props.isShutDown
                    ? <div className="rounded-full flex justify-center items-center w-10 h-10 hover:bg-white hover:bg-opacity-10" style={{ border: '1px solid #333' }}><img width="32px" height="32px" className="w-8" src="./themes/Yaru/status/power-button.svg" alt="Power Button" style={{ opacity: 0.7 }} /></div>
                    : <img width="40px" height="40px" className={" w-10 " + (props.visible ? " animate-spin " : "")} src="./themes/Yaru/status/process-working-symbolic.svg" alt="Loading" style={{ opacity: 0.5 }} />)}
            </div>
            <div className="mt-6 font-mono text-xs tracking-widest" style={{ color: '#555', letterSpacing: '0.2em' }}>
                archlinux
            </div>
            <div className="text-xs font-mono mt-12" style={{ color: '#444' }}>
                <a className="hover:text-ubt-blue transition-colors" href="https://www.linkedin.com/in/avery-hughes06/" rel="noreferrer noopener" target="_blank">linkedin</a>
                <span className="mx-2">|</span>
                <a href="https://github.com/avocado-avery" rel="noreferrer noopener" target="_blank" className="hover:text-ubt-blue transition-colors">github</a>
                <span className="mx-2">|</span>
                <a href="https://app.hackthebox.com/users/2071893" rel="noreferrer noopener" target="_blank" className="hover:text-ubt-blue transition-colors">hackthebox</a>
            </div>
        </div>
    )
}

export default BootingScreen
