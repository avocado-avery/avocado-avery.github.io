import React, { Component } from 'react';

export class Firefox extends Component {
    constructor() {
        super();
        this.home_url = 'https://www.google.com/webhp?igu=1';
        this.state = {
            url: 'https://www.google.com/webhp?igu=1',
            display_url: "https://www.google.com",
        }
    }

    componentDidMount() {
        let lastVisitedUrl = localStorage.getItem("firefox-url");
        let lastDisplayedUrl = localStorage.getItem("firefox-display-url");
        if (lastVisitedUrl !== null && lastVisitedUrl !== undefined) {
            this.setState({ url: lastVisitedUrl, display_url: lastDisplayedUrl }, this.refreshBrowser);
        }
    }

    storeVisitedUrl = (url, display_url) => {
        localStorage.setItem("firefox-url", url);
        localStorage.setItem("firefox-display-url", display_url);
    }

    refreshBrowser = () => {
        document.getElementById("firefox-screen").src += '';
    }

    goToHome = () => {
        this.setState({ url: this.home_url, display_url: "https://www.google.com" });
        this.refreshBrowser();
    }

    checkKey = (e) => {
        if (e.key === "Enter") {
            let url = e.target.value;
            let display_url = "";

            url = url.trim();
            if (url.length === 0) return;

            if (url.indexOf("http://") !== 0 && url.indexOf("https://") !== 0) {
                url = "https://" + url;
            }

            url = encodeURI(url);
            display_url = url;
            if (url.includes("google.com")) {
                url = 'https://www.google.com/webhp?igu=1';
                display_url = "https://www.google.com";
            }
            this.setState({ url, display_url: url });
            this.storeVisitedUrl(url, display_url);
            document.getElementById("firefox-url-bar").blur();
        }
    }

    handleDisplayUrl = (e) => {
        this.setState({ display_url: e.target.value });
    }

    displayUrlBar = () => {
        return (
            <div className="w-full pt-0.5 pb-1 flex justify-start items-center text-xs font-mono" style={{ backgroundColor: '#141414', borderBottom: '1px solid #242424' }}>
                <div onClick={this.refreshBrowser} className="ml-2 mr-1 flex justify-center items-center hover:bg-white hover:bg-opacity-5 p-0.5">
                    <img className="w-4" src="./themes/Yaru/status/chrome_refresh.svg" alt="Refresh" style={{ opacity: 0.6 }} />
                </div>
                <div onClick={this.goToHome} className="mr-2 ml-1 flex justify-center items-center hover:bg-white hover:bg-opacity-5 p-0.5">
                    <img className="w-4" src="./themes/Yaru/status/chrome_home.svg" alt="Home" style={{ opacity: 0.6 }} />
                </div>
                <input onKeyDown={this.checkKey} onChange={this.handleDisplayUrl} value={this.state.display_url} id="firefox-url-bar" className="outline-none pl-2 py-0.5 mr-3 w-5/6 text-ubt-grey focus:text-white bg-transparent" style={{ border: '1px solid #242424' }} type="url" spellCheck={false} autoComplete="off" />
            </div>
        );
    }

    render() {
        return (
            <div className="h-full w-full flex flex-col" style={{ backgroundColor: '#0c0c0c' }}>
                {this.displayUrlBar()}
                <iframe src={this.state.url} className="flex-grow" id="firefox-screen" frameBorder="0" title="Firefox Browser"></iframe>
            </div>
        )
    }
}

export default Firefox

export const displayFirefox = () => {
    return <Firefox> </Firefox>;
}
