import React from 'react'

function DefaultMenu(props) {
    return (
        <div id="default-menu" className={(props.active ? " block " : " hidden ") + " context-menu-bg cursor-default w-52 text-left py-2 absolute z-50 text-xs font-mono"}>
            <a rel="noreferrer noopener" href="https://github.com/avocado-avery/avocado-avery.github.io" target="_blank" className="w-full block cursor-default py-1 hover:bg-white hover:bg-opacity-5 mb-0.5">
                <span className="ml-4 text-ubt-blue">*</span> <span className="ml-2 text-ubt-grey">Star this Project</span>
            </a>
            <a rel="noreferrer noopener" href="https://github.com/avocado-avery/avocado-avery.github.io/issues" target="_blank" className="w-full block cursor-default py-1 hover:bg-white hover:bg-opacity-5 mb-0.5">
                <span className="ml-4 text-ubt-blue">!</span> <span className="ml-2 text-ubt-grey">Report bugs</span>
            </a>
            <Devider />
            <a rel="noreferrer noopener" href="https://www.linkedin.com/in/avery-hughes06/" target="_blank" className="w-full block cursor-default py-1 hover:bg-white hover:bg-opacity-5 mb-0.5">
                <span className="ml-4 text-ubt-blue">&gt;</span> <span className="ml-2 text-ubt-grey">Follow on <strong>LinkedIn</strong></span>
            </a>
            <a rel="noreferrer noopener" href="https://github.com/avocado-avery" target="_blank" className="w-full block cursor-default py-1 hover:bg-white hover:bg-opacity-5 mb-0.5">
                <span className="ml-4 text-ubt-blue">&gt;</span> <span className="ml-2 text-ubt-grey">Follow on <strong>GitHub</strong></span>
            </a>
            <Devider />
            <div onClick={() => { localStorage.clear(); window.location.reload() }} className="w-full block cursor-default py-1 hover:bg-white hover:bg-opacity-5 mb-0.5">
                <span className="ml-4 text-ubt-blue">~</span> <span className="ml-2 text-ubt-grey">Reset System</span>
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

export default DefaultMenu
