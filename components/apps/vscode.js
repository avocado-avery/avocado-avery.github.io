import React, { Component } from 'react'

const REPO_URL = 'https://github.com/avocado-avery/avocado-avery.github.io';
const EMBED_URL = 'https://github1s.com/avocado-avery/avocado-avery.github.io';

// github1s is a third-party service (https://github.com/conwnet/github1s) -- not my
// work, but it's amazing. It's also outside my control, so if the embed never loads
// we fall back to a link rather than leaving an empty window.
export class VsCode extends Component {
    constructor() {
        super();
        this.state = { loaded: false, timedOut: false };
    }

    componentDidMount() {
        this.timer = setTimeout(() => {
            if (!this.state.loaded) this.setState({ timedOut: true });
        }, 8000);
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    render() {
        return (
            <div className="h-full w-full relative" style={{ backgroundColor: '#0c0c0c' }}>
                <iframe
                    src={EMBED_URL}
                    frameBorder="0"
                    title="VS Code — source of this site"
                    className="h-full w-full"
                    style={{ backgroundColor: '#0c0c0c' }}
                    onLoad={() => this.setState({ loaded: true })}
                />
                {this.state.timedOut && !this.state.loaded && (
                    <div className="absolute inset-0 flex flex-col justify-center items-center font-mono text-xs px-6 text-center" style={{ backgroundColor: '#0c0c0c' }}>
                        <p style={{ color: '#7c7c7c' }}>The github1s embed didn&rsquo;t load.</p>
                        <a href={REPO_URL} target="_blank" rel="noreferrer noopener" className="mt-4 px-4 py-2 rounded no-underline" style={{ color: '#1793D1', border: '1px solid rgba(255,255,255,0.08)' }}>
                            Browse the source on GitHub
                        </a>
                    </div>
                )}
            </div>
        )
    }
}

export default VsCode;

export const displayVsCode = () => {
    return <VsCode />;
}
