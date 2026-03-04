import React, { Component } from "react";

export class SideBarApp extends Component {
    constructor() {
        super();
        this.id = null;
        this.state = {
            showTitle: false,
            scaleImage: false,
        };
    }

    componentDidMount() {
        this.id = this.props.id;
    }

    scaleImage = () => {
        setTimeout(() => {
            this.setState({ scaleImage: false });
        }, 1000);
        this.setState({ scaleImage: true });
    }

    openApp = () => {
        if (!this.props.isMinimized[this.id] && this.props.isClose[this.id]) {
            this.scaleImage();
        }
        this.props.openApp(this.id);
        this.setState({ showTitle: false });
    };

    render() {
        const isOpen = this.props.isClose[this.id] === false;
        const isFocused = isOpen && this.props.isFocus[this.id];

        return (
            <div
                tabIndex="0"
                onClick={this.openApp}
                onMouseEnter={() => { this.setState({ showTitle: true }); }}
                onMouseLeave={() => { this.setState({ showTitle: false }); }}
                className={"hypr-dock-app outline-none" + (isFocused ? " active" : "")}
                id={"sidebar-" + this.props.id}
            >
                <img width="24px" height="24px" className="w-6" src={this.props.icon} alt="App Icon" />
                <img className={(this.state.scaleImage ? " scale " : "") + " scalable-app-icon w-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"} src={this.props.icon} alt="" />
                {isOpen && <div className="hypr-dock-indicator" />}
                <div
                    className={
                        (this.state.showTitle ? " visible " : " invisible ") +
                        " w-max py-1 px-2 absolute top-1/2 -translate-y-1/2 left-full ml-4 text-ubt-grey text-xs font-mono"
                    }
                    style={{
                        backgroundColor: 'rgba(17, 17, 17, 0.92)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: '8px',
                    }}
                >
                    {this.props.title}
                </div>
            </div>
        );
    }
}

export default SideBarApp;
