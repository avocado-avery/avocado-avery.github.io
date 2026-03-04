import React, { Component } from 'react';
import Clock from '../util components/clock';
import Status from '../util components/status';
import StatusCard from '../util components/status_card';

export default class Navbar extends Component {
	constructor() {
		super();
		this.state = {
			status_card: false
		};
	}

	render() {
		return (
			<div className="waybar select-none text-xs font-mono text-ubt-grey">
				{/* Left module — arch logo */}
				<div className="waybar-module">
					<img src="./themes/Yaru/status/arch-logo.svg" alt="arch" className="w-3.5 h-3.5" style={{ filter: 'brightness(0) saturate(100%) invert(44%) sepia(93%) saturate(1267%) hue-rotate(176deg) brightness(95%) contrast(87%)' }} />
					<span className="text-ubt-blue" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>arch</span>
				</div>

				{/* Center module — clock */}
				<div className="waybar-module" style={{ fontSize: '11px', letterSpacing: '0.02em' }}>
					<Clock />
				</div>

				{/* Right module — status */}
				<div
					id="status-bar"
					tabIndex="0"
					onFocus={() => { this.setState({ status_card: true }); }}
					className="waybar-module outline-none cursor-pointer relative"
				>
					<Status />
					<StatusCard
						shutDown={this.props.shutDown}
						lockScreen={this.props.lockScreen}
						visible={this.state.status_card}
						toggleVisible={() => { this.setState({ status_card: false }); }}
					/>
				</div>
			</div>
		);
	}
}
