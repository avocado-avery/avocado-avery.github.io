import React, { Component } from 'react';
import $ from 'jquery';

export class Trash extends Component {
    constructor() {
        super();
        this.trashItems = [
            {
                name: "telnet",
                icon: "./themes/Yaru/system/folder.png"
            },
            {
                name: "default-passwords.txt",
                icon: "./themes/filetypes/txt.png"
            },
            {
                name: "node_modules",
                icon: "./themes/Yaru/system/folder.png"
            },
            {
                name: "unpatched-vm-backup",
                icon: "./themes/Yaru/system/folder.png"
            },
            {
                name: "http-not-https.conf",
                icon: "./themes/filetypes/txt.png"
            },
            {
                name: "password123.kdbx",
                icon: "./themes/Yaru/system/folder.png"
            },
            {
                name: "windows-defender-logs",
                icon: "./themes/Yaru/system/folder.png"
            },
        ];
        this.state = {
            empty: false,
        }
    }

    componentDidMount() {
        let wasEmpty = localStorage.getItem("trash-empty");
        if (wasEmpty !== null && wasEmpty !== undefined) {
            if (wasEmpty === "true") this.setState({ empty: true });
        }
    }

    focusFile = (e) => {
        $(e.target).children().get(0).classList.toggle("opacity-60");
        $(e.target).children().get(1).classList.toggle("bg-ub-orange");
    }

    emptyTrash = () => {
        this.setState({ empty: true });
        localStorage.setItem("trash-empty", true);
    };

    emptyScreen = () => {
        return (
            <div className="flex-grow flex flex-col justify-center items-center">
                <img className="w-24" src="./themes/Yaru/status/user-trash-symbolic.svg" alt="Trash" style={{ opacity: 0.4 }} />
                <span className="font-mono mt-4 text-sm" style={{ color: '#555' }}>Trash is Empty</span>
            </div>
        );
    }

    showTrashItems = () => {
        return (
            <div className="flex-grow ml-4 flex flex-wrap items-start content-start justify-start overflow-y-auto windowMainScreen">
                {
                    this.trashItems.map((item, index) => {
                        return (
                            <div key={index} tabIndex="1" onFocus={this.focusFile} onBlur={this.focusFile} className="flex flex-col items-center text-xs font-mono outline-none w-16 my-2 mx-4">
                                <div className="w-16 h-16 flex items-center justify-center">
                                    <img src={item.icon} alt="File Icons" />
                                </div>
                                <span className="text-center px-0.5" style={{ color: '#999', fontSize: '10px' }}>{item.name}</span>
                            </div>
                        )
                    })
                }
            </div>
        );
    }

    render() {
        return (
            <div className="w-full h-full flex flex-col text-ubt-grey select-none" style={{ backgroundColor: '#0c0c0c' }}>
                <div className="flex items-center justify-between w-full text-xs font-mono" style={{ backgroundColor: '#141414', borderBottom: '1px solid #242424', padding: '6px 12px' }}>
                    <span style={{ color: '#7c7c7c' }}>Trash</span>
                    <div className="flex gap-1">
                        <div className="px-3 py-0.5" style={{ border: '1px solid #242424', color: '#555' }}>Restore</div>
                        <div onClick={this.emptyTrash} className="px-3 py-0.5 cursor-pointer hover:bg-white hover:bg-opacity-5" style={{ border: '1px solid #242424', color: '#cc3333' }}>Empty</div>
                    </div>
                </div>
                {
                    (this.state.empty
                        ? this.emptyScreen()
                        : this.showTrashItems()
                    )
                }
            </div>
        )
    }
}

export default Trash;

export const displayTrash = () => {
    return <Trash> </Trash>;
}
