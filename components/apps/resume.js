import React, { Component } from 'react';

export class Resume extends Component {
    render() {
        return (
            <div className="w-full h-full flex flex-col" style={{ backgroundColor: '#1a1a1a' }}>
                <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="text-xs font-mono" style={{ color: '#7c7c7c' }}>Avery-Hughes-Resume.pdf</span>
                    <a
                        href="./files/Avery-Hughes-Resume.pdf"
                        download
                        className="text-xs font-mono px-3 py-1 rounded"
                        style={{ color: '#1793D1', border: '1px solid rgba(23,147,209,0.3)' }}
                    >
                        Download
                    </a>
                </div>
                <iframe
                    src="./files/Avery-Hughes-Resume.pdf"
                    className="w-full flex-grow"
                    title="Avery Hughes Resume"
                    style={{ border: 'none', backgroundColor: '#2a2a2a' }}
                />
            </div>
        );
    }
}

export default Resume;

export const displayResume = () => {
    return <Resume />;
};
