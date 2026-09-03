import React, { Component } from 'react';
import $ from 'jquery';

const CONTACT_EMAIL = 'ajhughes@itsavery.me';

export class Gedit extends Component {

    constructor() {
        super();
        this.state = {
            opened: false,
            copied: false,
        }
    }

    componentWillUnmount() {
        clearTimeout(this.resetTimer);
    }

    flash = (key) => {
        this.setState({ [key]: true });
        clearTimeout(this.resetTimer);
        this.resetTimer = setTimeout(() => this.setState({ opened: false, copied: false }), 2500);
    }

    sendMessage = () => {
        let name = $("#sender-name").val().trim();
        let subject = $("#sender-subject").val().trim();
        let message = $("#sender-message").val().trim();

        if (message.length === 0) {
            $("#sender-message").val('');
            $("#sender-message").attr("placeholder", "Message must not be Empty!");
            return;
        }

        const body = name.length > 0 ? `${message}\n\n— ${name}` : message;
        const mailto = `mailto:${CONTACT_EMAIL}`
            + `?subject=${encodeURIComponent(subject || 'Hello from itsavery.me')}`
            + `&body=${encodeURIComponent(body)}`;

        window.location.href = mailto;
        this.flash('opened');
    }

    copyAddress = () => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(CONTACT_EMAIL).then(
                () => this.flash('copied'),
                () => { }
            );
        }
    }

    render() {
        return (
            <div className="w-full h-full relative flex flex-col text-ubt-grey select-none" style={{ backgroundColor: '#0c0c0c' }}>
                <div className="flex items-center justify-between w-full text-xs font-mono" style={{ backgroundColor: '#141414', borderBottom: '1px solid #242424', padding: '6px 12px' }}>
                    <span className="font-bold" style={{ color: '#7c7c7c' }}>Compose Message</span>
                    <div className="flex gap-2 items-center">
                        {this.state.opened && <span className="text-ubt-green py-0.5">Opening mail client…</span>}
                        {this.state.copied && <span className="text-ubt-green py-0.5">Address copied!</span>}
                        <div onClick={this.sendMessage} className="px-3 py-0.5 cursor-pointer hover:bg-white hover:bg-opacity-5 font-mono text-ubt-blue" style={{ border: '1px solid #242424' }}>Send</div>
                    </div>
                </div>
                <div className="relative flex-grow flex flex-col font-mono windowMainScreen" style={{ backgroundColor: '#0a0a0a' }}>
                    <div className="absolute left-0 top-0 h-full px-2" style={{ backgroundColor: '#060606' }}></div>
                    <div className="relative">
                        <input id="sender-name" className="w-full focus:bg-white focus:bg-opacity-5 outline-none text-sm pl-6 py-1 bg-transparent" style={{ color: '#cc6633' }} placeholder="Your Name :" spellCheck="false" autoComplete="off" type="text" />
                        <span className="absolute left-1 top-1/2 transform -translate-y-1/2 text-xs" style={{ color: '#555' }}>1</span>
                    </div>
                    <div className="relative">
                        <input id="sender-subject" className="w-full my-0.5 focus:bg-white focus:bg-opacity-5 outline-none text-sm pl-6 py-1 bg-transparent text-ubt-blue" placeholder="subject (may be a feedback for this website!)" spellCheck="false" autoComplete="off" type="text" />
                        <span className="absolute left-1 top-1/2 transform -translate-y-1/2 text-xs" style={{ color: '#555' }}>2</span>
                    </div>
                    <div className="relative flex-grow">
                        <textarea id="sender-message" className="w-full text-sm resize-none h-full windowMainScreen outline-none tracking-wider pl-6 py-1 bg-transparent" style={{ color: '#999' }} placeholder="Message" spellCheck="false" autoComplete="none" type="text" />
                        <span className="absolute left-1 top-1 text-xs" style={{ color: '#555' }}>3</span>
                    </div>
                </div>
                <div className="flex items-center justify-between px-3 py-1 text-xs font-mono" style={{ backgroundColor: '#111111', borderTop: '1px solid rgba(255,255,255,0.06)', color: '#555', borderRadius: '0 0 12px 12px' }}>
                    <span>Send opens your mail client</span>
                    <span
                        onClick={this.copyAddress}
                        className="cursor-pointer hover:underline"
                        style={{ color: '#1793D1' }}
                        title="Copy address"
                    >
                        {CONTACT_EMAIL}
                    </span>
                </div>
            </div>
        )
    }
}

export default Gedit;

export const displayGedit = () => {
    return <Gedit> </Gedit>;
}
