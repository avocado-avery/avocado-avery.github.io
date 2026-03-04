import React, { Component } from 'react';

export class Welcome extends Component {
    render() {
        return (
            <div className="h-full w-full flex flex-col" style={{ backgroundColor: '#0c0c0c' }}>
                {/* Firefox-style tab bar */}
                <div className="w-full pt-0.5 pb-1 flex items-center text-xs font-mono" style={{ backgroundColor: '#141414', borderBottom: '1px solid #242424' }}>
                    <div className="ml-3 px-2 py-0.5 rounded" style={{ backgroundColor: '#1a1a1a', color: '#7c7c7c', border: '1px solid #242424' }}>
                        avery://about
                    </div>
                </div>

                {/* Page content */}
                <div className="flex-grow overflow-y-auto flex justify-center items-start py-12 px-4 windowMainScreen">
                    <div className="w-full max-w-lg flex flex-col items-center gap-6">
                        {/* Avatar / header area */}
                        <div className="flex flex-col items-center gap-3">
                            <img
                                src="./images/Avery-hughes-6485-scaled.jpg"
                                alt="Avery Hughes"
                                className="rounded-full object-cover"
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    border: '2px solid rgba(23,147,209,0.3)',
                                }}
                            />
                            <div className="text-center">
                                <h1 className="text-lg font-mono font-bold tracking-wide" style={{ color: '#e0e0e0' }}>
                                    Avery Hughes
                                </h1>
                                <p className="text-xs font-mono mt-1" style={{ color: '#1793D1' }}>
                                    Cybersecurity &middot; Team Lieutenant &middot; Unix Lead &middot; Offensive Security
                                </p>
                            </div>
                        </div>

                        {/* Divider */}
                        <div style={{ width: '80px', height: '1px', background: 'rgba(255,255,255,0.06)' }} />

                        {/* Bio */}
                        <div className="text-center font-mono text-xs leading-relaxed px-4" style={{ color: '#999' }}>
                            <p>
                                Cybersecurity student at Indiana Tech (graduating May 2027) with a focus on
                                offensive security, Linux systems, and breaking things to understand how they work.
                            </p>
                            <p className="mt-3">
               
                            </p>
                            <p className="mt-3" style={{ color: '#555' }}>
                                Feel free to poke around the desktop — open the terminal, check out the file manager,
                                or look at the resume. Everything is interactive.
                            </p>
                        </div>

                        {/* Divider */}
                        <div style={{ width: '80px', height: '1px', background: 'rgba(255,255,255,0.06)' }} />

                        {/* Link cards */}
                        <div className="flex flex-wrap gap-2 justify-center">
                            <LinkCard
                                label="GitHub"
                                sub="@avocado-avery"
                                href="https://github.com/avocado-avery"
                            />
                            <LinkCard
                                label="LinkedIn"
                                sub="avery-hughes06"
                                href="https://www.linkedin.com/in/avery-hughes06/"
                            />
                            <LinkCard
                                label="HackTheBox"
                                sub="profile"
                                href="https://app.hackthebox.com/users/2071893"
                            />
                        </div>

                        {/* Footer hint */}
                        <p className="font-mono text-center mt-2" style={{ color: '#333', fontSize: '10px' }}>
                            close this tab anytime &middot; it won't come back until you reload
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

function LinkCard({ label, sub, href }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center px-5 py-3 rounded-lg font-mono transition-all duration-150 cursor-pointer no-underline"
            style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                minWidth: '120px',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(23,147,209,0.08)';
                e.currentTarget.style.borderColor = 'rgba(23,147,209,0.2)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
            }}
        >
            <span className="text-xs font-bold" style={{ color: '#c5c8c6' }}>{label}</span>
            <span style={{ color: '#1793D1', fontSize: '10px' }}>{sub}</span>
        </a>
    );
}

export default Welcome;

export const displayWelcome = () => {
    return <Welcome />;
};
