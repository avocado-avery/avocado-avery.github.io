import React from 'react';
import UbuntuApp from '../base/ubuntu_app';

export class AllApplications extends React.Component {
    constructor() {
        super();
        this.state = {
            query: "",
            apps: [],
            category: 0
        }
    }

    componentDidMount() {
        this.setState({
            apps: this.props.apps
        })
    }

    handleChange = (e) => {
        this.setState({
            query: e.target.value,
            apps: e.target.value === "" || e.target.value === null ?
                this.props.apps : this.state.apps.filter(
                    (app) => app.title.toLowerCase().includes(e.target.value.toLowerCase())
                )
        })
    }

    renderApps = () => {

        let appsJsx = [];
        let frequentAppsInfo = JSON.parse(localStorage.getItem("frequentApps"));
        let getFrequentApps = () => {
            let frequentApps = [];
            if (frequentAppsInfo) {
                frequentAppsInfo.forEach((app_info) => {
                    let app = this.props.apps.find(app => app.id === app_info.id);
                    if (app) {
                        frequentApps.push(app);
                    }
                })
            }
            return frequentApps;
        }

        let apps = this.state.category === 0 ? [...this.state.apps] : getFrequentApps();
        apps.forEach((app, index) => {
            const props = {
                name: app.title,
                id: app.id,
                icon: app.icon,
                openApp: this.props.openApp
            }

            appsJsx.push(
                <UbuntuApp key={index} {...props} />
            );
        });
        return appsJsx;
    }

    handleSwitch = (category) => {
        if (category !== this.state.category) {
            this.setState({
                category: category
            })
        }
    }

    render() {
        return (
            <div className="absolute h-full top-7 w-full z-20 pl-12 justify-center md:pl-20" style={{ backgroundColor: 'rgba(12, 12, 12, 0.9)', backdropFilter: 'blur(12px)' }}>
                <div className="flex md:pr-20 pt-5 align-center justify-center">
                    <div className="flex w-2/3 h-full items-center pl-2 pr-2 overflow-hidden md:w-1/3" style={{ backgroundColor: '#1a1a1a', border: '1px solid #242424' }}>
                        <img className="w-5 h-5" alt="search icon" src={'./images/logos/search.png'} style={{ opacity: 0.5 }} />
                        <input className="w-3/4 p-1 bg-transparent focus:outline-none text-ubt-grey font-mono text-sm"
                            placeholder="Type to search..."
                            value={this.state.query}
                            onChange={this.handleChange} />
                    </div>
                </div>
                <div className="grid md:grid-cols-6 md:grid-rows-3 grid-cols-3 grid-rows-6 md:gap-4 gap-1 md:px-20 px-5 pt-10 justify-center">
                    {this.renderApps()}
                </div>
                <div className="flex align-center justify-center w-full fixed bottom-0 mb-15 pr-20 md:pr-20">
                    <div className="w-1/4 text-center group text-ubt-grey bg-transparent cursor-pointer items-center font-mono text-xs" onClick={this.handleSwitch.bind(this, 1)}>
                        <span>Frequent</span>
                        {this.state.category === 1 ? <div className="h-0.5 mt-1 self-center" style={{ backgroundColor: '#1793D1' }} />
                            : <div className="h-0.5 mt-1 bg-transparent group-hover:bg-gray-700" />}
                    </div>
                    <div className="w-1/4 text-center group text-ubt-grey bg-transparent cursor-pointer items-center font-mono text-xs" onClick={this.handleSwitch.bind(this, 0)}>
                        <span>All</span>
                        {this.state.category === 0 ? <div className="h-0.5 mt-1 self-center" style={{ backgroundColor: '#1793D1' }} />
                            : <div className="h-0.5 mt-1 bg-transparent group-hover:bg-gray-700" />}
                    </div>
                </div>
            </div>
        )
    }
}

export default AllApplications;
