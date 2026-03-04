import React, { Component } from 'react';
import SmallArrow from './small_arrow';
import onClickOutside from 'react-onclickoutside';

class Slider extends Component {
    render() {
        return (
            <input
                type="range"
                onChange={this.props.onChange}
                className={this.props.className}
                name={this.props.name}
                min="0"
                max="100"
                value={this.props.value}
                step="1"
            />
        );
    }
}

const wifiNetworks = [
    { name: 'arch-btw', strength: 'excellent', connected: true },
    { name: 'pretty-fly-for-a-wifi', strength: 'good' },
    { name: 'FBI Surveillance Van #7', strength: 'good' },
    { name: 'it hurts when IP', strength: 'fair' },
    { name: 'Wu-Tang LAN', strength: 'fair' },
    { name: 'LAN Solo', strength: 'weak' },
    { name: 'yell PASSWORD for password', strength: 'weak' },
    { name: 'loading...', strength: 'weak' },
];

const bluetoothDevices = [
    { name: "Avery's AirPods", status: 'connected', icon: '\u{1F3A7}' },
    { name: 'smart toaster', status: 'paired', icon: '\u{1F35E}' },
    { name: 'mysterious device', status: 'nearby', icon: '\u{1F47B}' },
    { name: 'Keyboard (refusing to pair)', status: 'error', icon: '\u{2328}' },
    { name: "neighbor's speaker", status: 'nearby', icon: '\u{1F50A}' },
];

const batteryStats = [
    { label: 'Status', value: 'On Battery' },
    { label: 'Percentage', value: '75%' },
    { label: 'Time Remaining', value: '2:40' },
    { label: 'Health', value: 'vibing' },
    { label: 'Cycles', value: '420 (nice)' },
    { label: 'Temperature', value: 'cool as a cucumber' },
];

export class StatusCard extends Component {
    constructor() {
        super();
        this.wrapperRef = React.createRef();
        this.state = {
            sound_level: 75,
            brightness_level: 100,
            openDropdown: null, // 'wifi' | 'bluetooth' | 'battery' | null
        };
    }
    handleClickOutside = () => {
        this.props.toggleVisible();
    };
    componentDidMount() {
        this.setState({
            sound_level: localStorage.getItem('sound-level') || 75,
            brightness_level: localStorage.getItem('brightness-level') || 100
        }, () => {
            document.getElementById('monitor-screen').style.filter = `brightness(${3 / 400 * this.state.brightness_level +
                0.25})`;
        })
    }

    handleBrightness = (e) => {
        this.setState({ brightness_level: e.target.value });
        localStorage.setItem('brightness-level', e.target.value);
        document.getElementById('monitor-screen').style.filter = `brightness(${3 / 400 * e.target.value + 0.25})`;
    };

    handleSound = (e) => {
        this.setState({ sound_level: e.target.value });
        localStorage.setItem('sound-level', e.target.value);
    };

    toggleDropdown = (name) => {
        this.setState({ openDropdown: this.state.openDropdown === name ? null : name });
    };

    renderWifiDropdown() {
        return (
            <div className="mx-3 mb-1 py-1 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                {wifiNetworks.map((net, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-1 hover:bg-white hover:bg-opacity-5 cursor-pointer rounded" style={{ fontSize: '10px' }}>
                        <span className="text-ubt-grey font-mono" style={{ color: net.connected ? '#1793D1' : undefined }}>{net.name}</span>
                        <span style={{ color: '#555', fontSize: '9px' }}>{net.connected ? 'connected' : net.strength}</span>
                    </div>
                ))}
            </div>
        );
    }

    renderBluetoothDropdown() {
        const statusColors = { connected: '#1793D1', paired: '#7c7c7c', nearby: '#555', error: '#cc3333' };
        return (
            <div className="mx-3 mb-1 py-1 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                {bluetoothDevices.map((dev, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-1 hover:bg-white hover:bg-opacity-5 cursor-pointer rounded" style={{ fontSize: '10px' }}>
                        <span className="text-ubt-grey font-mono">
                            <span className="mr-1.5">{dev.icon}</span>
                            {dev.name}
                        </span>
                        <span style={{ color: statusColors[dev.status] || '#555', fontSize: '9px' }}>{dev.status}</span>
                    </div>
                ))}
            </div>
        );
    }

    renderBatteryDropdown() {
        return (
            <div className="mx-3 mb-1 py-1 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                {batteryStats.map((stat, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-1" style={{ fontSize: '10px' }}>
                        <span className="font-mono" style={{ color: '#7c7c7c' }}>{stat.label}</span>
                        <span className="font-mono" style={{ color: '#aaa' }}>{stat.value}</span>
                    </div>
                ))}
            </div>
        );
    }

    render() {
        const { openDropdown } = this.state;
        const connectedWifi = wifiNetworks.find(n => n.connected);

        return (
            <div
                ref={this.wrapperRef}
                className={
                    'absolute py-3 top-10 right-0 status-card' +
                    (this.props.visible ? ' visible animateShow' : ' invisible')
                }
                style={{ backgroundColor: 'rgba(17, 17, 17, 0.92)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.06)', width: '260px', borderRadius: '12px' }}
            >
                <div className="w-full py-1.5 flex items-center justify-center hover:bg-white hover:bg-opacity-5 mx-1 rounded-lg">
                    <div className="w-8">
                        <img width="16px" height="16px" src="./themes/Yaru/status/audio-headphones-symbolic.svg" alt="headphone" />
                    </div>
                    <Slider
                        onChange={this.handleSound}
                        className="ubuntu-slider w-2/3"
                        value={this.state.sound_level}
                        name="headphone_range"
                    />
                </div>
                <div className="w-full py-1.5 flex items-center justify-center hover:bg-white hover:bg-opacity-5 mx-1 rounded-lg">
                    <div className="w-8">
                        <img width="16px" height="16px" src="./themes/Yaru/status/display-brightness-symbolic.svg" alt="brightness" />
                    </div>
                    <Slider
                        onChange={this.handleBrightness}
                        className="ubuntu-slider w-2/3"
                        name="brightness_range"
                        value={this.state.brightness_level}
                    />
                </div>
                <div className="flex content-center justify-center w-full">
                    <div className="w-3/5 my-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />
                </div>
                {/* WiFi */}
                <div
                    onClick={() => this.toggleDropdown('wifi')}
                    className="w-full py-1.5 flex items-center justify-center hover:bg-white hover:bg-opacity-5 mx-1 rounded-lg cursor-pointer"
                >
                    <div className="w-8">
                        <img width="16px" height="16px" src="./themes/Yaru/status/network-wireless-signal-good-symbolic.svg" alt="wifi" />
                    </div>
                    <div className="w-2/3 flex items-center justify-between text-ubt-grey text-xs font-mono">
                        <span>{connectedWifi ? connectedWifi.name : 'Not Connected'}</span>
                        <SmallArrow angle={openDropdown === 'wifi' ? 'down' : 'right'} />
                    </div>
                </div>
                {openDropdown === 'wifi' && this.renderWifiDropdown()}
                {/* Bluetooth */}
                <div
                    onClick={() => this.toggleDropdown('bluetooth')}
                    className="w-full py-1.5 flex items-center justify-center hover:bg-white hover:bg-opacity-5 mx-1 rounded-lg cursor-pointer"
                >
                    <div className="w-8">
                        <img width="16px" height="16px" src="./themes/Yaru/status/bluetooth-symbolic.svg" alt="bluetooth" />
                    </div>
                    <div className="w-2/3 flex items-center justify-between text-ubt-grey text-xs font-mono">
                        <span>On</span>
                        <SmallArrow angle={openDropdown === 'bluetooth' ? 'down' : 'right'} />
                    </div>
                </div>
                {openDropdown === 'bluetooth' && this.renderBluetoothDropdown()}
                {/* Battery */}
                <div
                    onClick={() => this.toggleDropdown('battery')}
                    className="w-full py-1.5 flex items-center justify-center hover:bg-white hover:bg-opacity-5 mx-1 rounded-lg cursor-pointer"
                >
                    <div className="w-8">
                        <img width="16px" height="16px" src="./themes/Yaru/status/battery-good-symbolic.svg" alt="battery" />
                    </div>
                    <div className="w-2/3 flex items-center justify-between text-ubt-grey text-xs font-mono">
                        <span>2:40 Remaining (75%)</span>
                        <SmallArrow angle={openDropdown === 'battery' ? 'down' : 'right'} />
                    </div>
                </div>
                {openDropdown === 'battery' && this.renderBatteryDropdown()}
                <div className="flex content-center justify-center w-full">
                    <div className="w-3/5 my-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />
                </div>
                <div
                    id="open-settings"
                    className="w-full py-1.5 flex items-center justify-center hover:bg-white hover:bg-opacity-5 mx-1 rounded-lg"
                >
                    <div className="w-8">
                        <img width="16px" height="16px" src="./themes/Yaru/status/emblem-system-symbolic.svg" alt="settings" />
                    </div>
                    <div className="w-2/3 flex items-center justify-between text-ubt-grey text-xs font-mono">
                        <span>Settings</span>
                    </div>
                </div>
                <div
                    onClick={this.props.lockScreen}
                    className="w-full py-1.5 flex items-center justify-center hover:bg-white hover:bg-opacity-5 mx-1 rounded-lg"
                >
                    <div className="w-8">
                        <img width="16px" height="16px" src="./themes/Yaru/status/changes-prevent-symbolic.svg" alt="lock" />
                    </div>
                    <div className="w-2/3 flex items-center justify-between text-ubt-grey text-xs font-mono">
                        <span>Lock</span>
                    </div>
                </div>
                <div
                    onClick={this.props.shutDown}
                    className="w-full py-1.5 flex items-center justify-center hover:bg-white hover:bg-opacity-5 mx-1 rounded-lg"
                >
                    <div className="w-8">
                        <img width="16px" height="16px" src="./themes/Yaru/status/system-shutdown-symbolic.svg" alt="power" />
                    </div>
                    <div className="w-2/3 flex items-center justify-between text-ubt-grey text-xs font-mono">
                        <span>Power Off / Log Out</span>
                        <SmallArrow angle="right" />
                    </div>
                </div>
            </div>
        );
    }
}

export default onClickOutside(StatusCard);
