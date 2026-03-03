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

export class StatusCard extends Component {
	constructor() {
		super();
		this.wrapperRef = React.createRef();
		this.state = {
			sound_level: 75,
			brightness_level: 100
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

	render() {
		return (
			<div
				ref={this.wrapperRef}
				className={
					'absolute py-3 top-7 right-3 status-card' +
					(this.props.visible ? ' visible animateShow' : ' invisible')
				}
				style={{ backgroundColor: '#141414', border: '1px solid #242424', width: '260px' }}
			>
				<div className="absolute w-0 h-0 -top-1 right-6 top-arrow-up" />
				<div className="w-full py-1.5 flex items-center justify-center hover:bg-white hover:bg-opacity-5">
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
				<div className="w-full py-1.5 flex items-center justify-center hover:bg-white hover:bg-opacity-5">
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
					<div className="w-3/5 my-2" style={{ borderTop: '1px solid #242424' }} />
				</div>
				<div className="w-full py-1.5 flex items-center justify-center hover:bg-white hover:bg-opacity-5">
					<div className="w-8">
						<img width="16px" height="16px" src="./themes/Yaru/status/network-wireless-signal-good-symbolic.svg" alt="wifi" />
					</div>
					<div className="w-2/3 flex items-center justify-between text-ubt-grey text-xs font-mono">
						<span>archlinux-net</span>
						<SmallArrow angle="right" />
					</div>
				</div>
				<div className="w-full py-1.5 flex items-center justify-center hover:bg-white hover:bg-opacity-5">
					<div className="w-8">
						<img width="16px" height="16px" src="./themes/Yaru/status/bluetooth-symbolic.svg" alt="bluetooth" />
					</div>
					<div className="w-2/3 flex items-center justify-between text-ubt-grey text-xs font-mono">
						<span>Off</span>
						<SmallArrow angle="right" />
					</div>
				</div>
				<div className="w-full py-1.5 flex items-center justify-center hover:bg-white hover:bg-opacity-5">
					<div className="w-8">
						<img width="16px" height="16px" src="./themes/Yaru/status/battery-good-symbolic.svg" alt="battery" />
					</div>
					<div className="w-2/3 flex items-center justify-between text-ubt-grey text-xs font-mono">
						<span>2:40 Remaining (75%)</span>
						<SmallArrow angle="right" />
					</div>
				</div>
				<div className="flex content-center justify-center w-full">
					<div className="w-3/5 my-2" style={{ borderTop: '1px solid #242424' }} />
				</div>
				<div
					id="open-settings"
					className="w-full py-1.5 flex items-center justify-center hover:bg-white hover:bg-opacity-5"
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
					className="w-full py-1.5 flex items-center justify-center hover:bg-white hover:bg-opacity-5"
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
					className="w-full py-1.5 flex items-center justify-center hover:bg-white hover:bg-opacity-5"
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
