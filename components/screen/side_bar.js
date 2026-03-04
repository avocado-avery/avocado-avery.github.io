import React, { useState } from 'react'
import SideBarApp from '../base/side_bar_app';

let renderApps = (props) => {
    let sideBarAppsJsx = [];
    props.apps.forEach((app, index) => {
        if (props.favourite_apps[app.id] === false) return;
        sideBarAppsJsx.push(
            <SideBarApp key={index} id={app.id} title={app.title} icon={app.icon} isClose={props.closed_windows} isFocus={props.focused_windows} openApp={props.openAppByAppId} isMinimized={props.isMinimized} openFromMinimised={props.openFromMinimised} />
        );
    });
    return sideBarAppsJsx;
}

export default function SideBar(props) {

    function showSideBar() {
        props.hideSideBar(null, false);
    }

    function hideSideBar() {
        setTimeout(() => {
            props.hideSideBar(null, true);
        }, 2000);
    }

    return (
        <>
            <div className={"hypr-dock" + (props.hide ? " hidden" : "")} >
                {
                    (
                        Object.keys(props.closed_windows).length !== 0
                            ? renderApps(props)
                            : null
                    )
                }
                <div className="hypr-dock-separator" />
                <AllApps showApps={props.showAllApps} />
            </div>
            <div onMouseEnter={showSideBar} onMouseLeave={hideSideBar} className={"w-1 h-full absolute top-0 left-0 bg-transparent z-50"}></div>
        </>
    )
}

export function AllApps(props) {

    const [title, setTitle] = useState(false);

    return (
        <div
            className="hypr-dock-app"
            onMouseEnter={() => { setTitle(true); }}
            onMouseLeave={() => { setTitle(false); }}
            onClick={props.showApps}
        >
            <div className="relative">
                <img width="24px" height="24px" className="w-6" src="./themes/Yaru/system/view-app-grid-symbolic.svg" alt="View applications" style={{ opacity: 0.5 }} />
                <div
                    className={
                        (title ? " visible " : " invisible ") +
                        " w-max py-1 px-2 absolute top-1/2 -translate-y-1/2 left-full ml-4 text-ubt-grey text-xs font-mono"
                    }
                    style={{
                        backgroundColor: 'rgba(17, 17, 17, 0.92)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: '8px',
                    }}
                >
                    Show Applications
                </div>
            </div>
        </div>
    );
}
