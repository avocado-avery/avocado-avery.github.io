import React, { Component } from 'react';
import Settings from '../apps/settings';

import { displayTerminal } from '../apps/terminal'

export class Window extends Component {
    constructor() {
        super();
        this.state = {
            closed: false,
        }
    }

    focusWindow = () => {
        this.props.focus(this.props.id);
    }

    minimizeWindow = () => {
        const id = this.props.id;
        var sidebarEl = document.querySelector("#sidebar-" + id);
        if (sidebarEl) {
            var sidebBarApp = sidebarEl.getBoundingClientRect();
            var r = document.querySelector("#" + id);
            if (r) r.style.transform = `translate(${-310}px,${sidebBarApp.y.toFixed(1) - 240}px) scale(0.2)`;
        }
        this.props.hasMinimised(id);
    }

    maximizeWindow = () => {
        this.props.toggleMaximize(this.props.id);
    }

    closeWindow = () => {
        this.setState({ closed: true }, () => {
            this.props.hideSideBar(this.props.id, false);
            setTimeout(() => {
                this.props.closed(this.props.id)
            }, 200)
        });
    }

    render() {
        const { tilePosition, minimized, isFocused, maximized } = this.props;

        // Use tile position for sizing and placement (fixed positioning for precise control)
        const style = tilePosition ? {
            position: 'fixed',
            left: `${tilePosition.x}px`,
            top: `${tilePosition.y}px`,
            width: `${tilePosition.w}px`,
            height: `${tilePosition.h}px`,
            transition: 'left 200ms ease, top 200ms ease, width 200ms ease, height 200ms ease',
        } : {
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60%',
            height: '85%',
        };

        return (
            <div
                style={style}
                className={(this.state.closed ? " closed-window " : "") + (minimized ? " opacity-0 invisible duration-200 " : "") + (maximized ? " z-40 " : (isFocused ? " z-30 " : " z-20 notFocused")) + " opened-window overflow-hidden main-window window-shadow flex flex-col"}
                id={this.props.id}
                onClick={this.focusWindow}
            >
                <WindowTopBar title={this.props.title} id={this.props.id} minimize={this.minimizeWindow} maximize={this.maximizeWindow} close={this.closeWindow} maximized={this.props.maximized} />
                {(this.props.id === "settings"
                    ? <Settings changeBackgroundImage={this.props.changeBackgroundImage} currBgImgName={this.props.bg_image_name} />
                    : <WindowMainScreen screen={this.props.screen} title={this.props.title}
                        addFolder={this.props.id === "terminal" ? this.props.addFolder : null}
                        openApp={this.props.openApp} />)}
            </div>
        )
    }
}

export default Window

// Window's title bar — GNOME/Linux style with right-aligned controls
export function WindowTopBar(props) {
    return (
        <div className="window-titlebar relative py-1 px-3 w-full select-none flex items-center" style={{ backgroundColor: 'rgba(17, 17, 17, 0.95)', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div className="flex-1 text-center text-xs font-mono tracking-wide" style={{ color: '#7c7c7c' }}>{props.title}</div>
            <div className="flex items-center shrink-0">
                <button tabIndex="-1" className="focus:outline-none cursor-default flex justify-center items-center window-btn window-btn-minimize" onClick={props.minimize}>
                    <svg width="10" height="10" viewBox="0 0 10 10"><line x1="2" y1="5" x2="8" y2="5" stroke="currentColor" strokeWidth="1.2"/></svg>
                </button>
                <button tabIndex="-1" className="focus:outline-none cursor-default flex justify-center items-center window-btn window-btn-maximize" onClick={props.maximize}>
                    {props.maximized ? (
                        <svg width="10" height="10" viewBox="0 0 10 10">
                            <rect x="0.5" y="2.5" width="6" height="6" fill="none" stroke="currentColor" strokeWidth="1.2"/>
                            <polyline points="3,2.5 3,0.5 9.5,0.5 9.5,7 7.5,7" fill="none" stroke="currentColor" strokeWidth="1.2"/>
                        </svg>
                    ) : (
                        <svg width="10" height="10" viewBox="0 0 10 10"><rect x="1.5" y="1.5" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="1.2"/></svg>
                    )}
                </button>
                <button tabIndex="-1" id={`close-${props.id}`} className="focus:outline-none cursor-default flex justify-center items-center window-btn window-btn-close" onClick={props.close}>
                    <svg width="10" height="10" viewBox="0 0 10 10"><line x1="2" y1="2" x2="8" y2="8" stroke="currentColor" strokeWidth="1.2"/><line x1="8" y1="2" x2="2" y2="8" stroke="currentColor" strokeWidth="1.2"/></svg>
                </button>
            </div>
        </div>
    )
}

// Window's Main Screen
export class WindowMainScreen extends Component {
    constructor() {
        super();
        this.state = {
            setDarkBg: false,
        }
    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({ setDarkBg: true });
        }, 3000);
    }
    render() {
        return (
            <div className={"w-full flex-grow z-20 max-h-full overflow-y-auto windowMainScreen" + (this.state.setDarkBg ? " bg-ub-drk-abrgn " : " bg-ub-cool-grey")} style={{ borderRadius: '0 0 12px 12px' }}>
                {this.props.addFolder ? displayTerminal(this.props.addFolder, this.props.openApp) : this.props.screen()}
            </div>
        )
    }
}
