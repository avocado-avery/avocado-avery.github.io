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
			<div className="main-navbar-vp absolute top-0 right-0 w-screen flex flex-nowrap justify-between items-center bg-ub-grey text-ubt-grey text-xs select-none z-50" style={{ height: '26px', borderBottom: '1px solid #1a1a1a' }}>
				<div
					tabIndex="0"
					className="pl-3 pr-3 outline-none transition duration-100 ease-in-out border-b border-transparent focus:border-ubb-orange py-1 flex items-center gap-1.5"
				>
					<img src="./themes/Yaru/status/arch-logo.svg" alt="arch" className="w-3.5 h-3.5" style={{ filter: 'brightness(0) saturate(100%) invert(44%) sepia(93%) saturate(1267%) hue-rotate(176deg) brightness(95%) contrast(87%)' }} />
					<span className="font-mono text-ubt-blue" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>arch</span>
				</div>
				<div
					tabIndex="0"
					className="pl-2 pr-2 text-xs outline-none transition duration-100 ease-in-out border-b border-transparent focus:border-ubb-orange py-1 font-mono"
					style={{ fontSize: '11px', letterSpacing: '0.02em' }}
				>
					<Clock />
				</div>
				<div
					id="status-bar"
					tabIndex="0"
					onFocus={() => {
						this.setState({ status_card: true });
					}}
					className="relative pr-3 pl-3 outline-none transition duration-100 ease-in-out border-b border-transparent focus:border-ubb-orange py-1"
				>
					<Status />
					<StatusCard
						shutDown={this.props.shutDown}
						lockScreen={this.props.lockScreen}
						visible={this.state.status_card}
						toggleVisible={() => {
							this.setState({ status_card: false });
						}}
					/>
				</div>
			</div>
		);
	}
}
