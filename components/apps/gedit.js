import React, { Component } from 'react';
import $ from 'jquery';

import emailjs from '@emailjs/browser';

export class Gedit extends Component {

    constructor() {
        super();
        this.state = {
            sending: false,
        }
    }

    componentDidMount() {
        emailjs.init(process.env.NEXT_PUBLIC_USER_ID);
    }

    sendMessage = async () => {
        let name = $("#sender-name").val();
        let subject = $("#sender-subject").val();
        let message = $("#sender-message").val();

        name = name.trim();
        subject = subject.trim();
        message = message.trim();

        let error = false;

        if (name.length === 0) {
            $("#sender-name").val('');
            $("#sender-name").attr("placeholder", "Name must not be Empty!");
            error = true;
        }

        if (message.length === 0) {
            $("#sender-message").val('');
            $("#sender-message").attr("placeholder", "Message must not be Empty!");
            error = true;
        }
        if (error) return;

        this.setState({ sending: true });

        const serviceID = process.env.NEXT_PUBLIC_SERVICE_ID;
        const templateID = process.env.NEXT_PUBLIC_TEMPLATE_ID;
        const templateParams = {
            'name': name,
            'subject': subject,
            'message': message,
        }

        emailjs.send(serviceID, templateID, templateParams).then(() => {
            this.setState({ sending: false });
            $("#close-gedit").trigger("click");
        }).catch(() => {
            this.setState({ sending: false });
            $("#close-gedit").trigger("click");
        })
    }

    render() {
        return (
            <div className="w-full h-full relative flex flex-col text-ubt-grey select-none" style={{ backgroundColor: '#0c0c0c' }}>
                <div className="flex items-center justify-between w-full text-xs font-mono" style={{ backgroundColor: '#141414', borderBottom: '1px solid #242424', padding: '6px 12px' }}>
                    <span className="font-bold" style={{ color: '#7c7c7c' }}>Send a Message</span>
                    <div className="flex">
                        <div onClick={this.sendMessage} className="px-3 py-0.5 cursor-pointer hover:bg-white hover:bg-opacity-5 font-mono text-ubt-blue" style={{ border: '1px solid #242424' }}>Send</div>
                    </div>
                </div>
                <div className="relative flex-grow flex flex-col font-mono windowMainScreen" style={{ backgroundColor: '#0a0a0a' }}>
                    <div className="absolute left-0 top-0 h-full px-2" style={{ backgroundColor: '#060606' }}></div>
                    <div className="relative">
                        <input id="sender-name" className="w-full focus:bg-white focus:bg-opacity-5 outline-none text-sm pl-6 py-1 bg-transparent" style={{ color: '#cc6633' }} placeholder="Your Email / Name :" spellCheck="false" autoComplete="off" type="text" />
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
                {
                    (this.state.sending
                        ?
                        <div className="flex justify-center items-center animate-pulse h-full w-full bg-black bg-opacity-50 absolute top-0 left-0">
                            <img className="w-8 absolute animate-spin" src="./themes/Yaru/status/process-working-symbolic.svg" alt="Loading" style={{ opacity: 0.5 }} />
                        </div>
                        : null
                    )
                }
            </div>
        )
    }
}

export default Gedit;

export const displayGedit = () => {
    return <Gedit> </Gedit>;
}
