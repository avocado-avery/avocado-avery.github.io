import Head from 'next/head';

export default function NotFound() {
    return (
        <>
            <Head>
                <title>404 — Page Not Found | Avery Hughes</title>
                <meta name="robots" content="noindex, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#1793D1" />
                <meta name="color-scheme" content="dark" />
                <link rel="icon" href="/favicon.ico" sizes="48x48" />
            </Head>
            <div
                className="w-screen h-screen flex flex-col justify-center items-center font-mono select-none"
                style={{ backgroundColor: '#0c0c0c', color: '#c5c8c6' }}
            >
                <h1 className="text-sm" style={{ color: '#7c7c7c' }}>
                    <span style={{ color: '#cc3333' }}>error:</span> 404 — no such file or directory
                </h1>
                <p className="text-xs mt-3" style={{ color: '#555' }}>
                    That path does not exist on this machine.
                </p>
                <a
                    href="/"
                    className="text-xs mt-8 px-4 py-2 rounded transition-colors hover:bg-white hover:bg-opacity-5"
                    style={{ color: '#1793D1', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                    cd ~
                </a>
            </div>
        </>
    );
}
