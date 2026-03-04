import React from 'react';

export default function WelcomeCard({ visible, openApp }) {
    return (
        <div
            className={"fixed flex flex-col items-center justify-center select-none transition-all duration-300 z-10 " + (visible ? "opacity-100" : "opacity-0 pointer-events-none")}
            style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            }}
        >
            <div
                className="flex flex-col items-center gap-4 px-10 py-8"
                style={{
                    background: 'rgba(17, 17, 17, 0.85)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '16px',
                    minWidth: '320px',
                }}
            >
                {/* Name */}
                <div className="text-center">
                    <h1 className="text-xl font-mono font-bold tracking-wide" style={{ color: '#e0e0e0' }}>
                        Avery Hughes
                    </h1>
                    <p className="text-xs font-mono mt-1" style={{ color: '#1793D1' }}>
                        Cybersecurity &middot; Unix Lead &middot; Offensive Security
                    </p>
                    <p className="text-xs font-mono mt-1" style={{ color: '#5c5c5c' }}>
                        BS Cybersecurity @ Indiana Tech &middot; May 2027
                    </p>
                </div>

                {/* Divider */}
                <div style={{ width: '60px', height: '1px', background: 'rgba(255,255,255,0.08)' }} />

                {/* Quick links */}
                <div className="flex gap-2 flex-wrap justify-center">
                    <WelcomeBtn label="Resume" onClick={() => openApp("resume")} primary />
                    <WelcomeBtn label="LinkedIn" onClick={() => window.open("https://www.linkedin.com/in/avery-hughes06/", "_blank")} />
                    <WelcomeBtn label="GitHub" onClick={() => window.open("https://github.com/avocado-avery", "_blank")} />
                    <WelcomeBtn label="Contact" onClick={() => openApp("gedit")} />
                </div>

                {/* Hint */}
                <p className="text-center font-mono" style={{ color: '#3c3c3c', fontSize: '10px' }}>
                    double-click desktop icons to explore
                </p>
            </div>
        </div>
    );
}

function WelcomeBtn({ label, onClick, primary }) {
    return (
        <button
            onClick={onClick}
            className="font-mono text-xs px-4 py-1.5 rounded-lg transition-all duration-150 cursor-pointer outline-none"
            style={{
                background: primary ? 'rgba(23, 147, 209, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${primary ? 'rgba(23, 147, 209, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
                color: primary ? '#1793D1' : '#8c8c8c',
            }}
            onMouseEnter={(e) => {
                e.target.style.background = primary ? 'rgba(23, 147, 209, 0.25)' : 'rgba(255, 255, 255, 0.08)';
                e.target.style.color = primary ? '#1793D1' : '#c5c8c6';
            }}
            onMouseLeave={(e) => {
                e.target.style.background = primary ? 'rgba(23, 147, 209, 0.15)' : 'rgba(255, 255, 255, 0.04)';
                e.target.style.color = primary ? '#1793D1' : '#8c8c8c';
            }}
        >
            {label}
        </button>
    );
}
