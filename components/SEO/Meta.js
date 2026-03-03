import React from 'react'
import Head from 'next/head';

export default function Meta() {
    return (
        <Head>
           /* Primary Meta Tags */
            <title>Avery Hughes Portfolio - Cybersecurity Student</title>
            <meta charSet="utf-8" />
            <meta name="title" content="Avery Hughes Portfolio - Cybersecurity Student" />
            <meta name="description"
                content="Avery Hughes' Personal Portfolio Website. Made with Arch Linux theme by Next.js and Tailwind CSS." />
            <meta name="author" content="Avery Hughes" />
            <meta name="keywords"
                content="avery hughes, avery hughes portfolio, cybersecurity portfolio, arch linux portfolio, avery hughes cybersecurity, security engineer portfolio" />
            <meta name="robots" content="index, follow" />
            <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="language" content="English" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#0c0c0c" />

            /* Search Engine */
            <meta name="image" content="images/logos/fevicon.png" />
            /* Schema.org for Google */
            <meta itemProp="name" content="Avery Hughes Portfolio - Cybersecurity Student" />
            <meta itemProp="description"
                content="Avery Hughes' Personal Portfolio Website. Made with Arch Linux theme by Next.js and Tailwind CSS." />
            <meta itemProp="image" content="images/logos/fevicon.png" />
            /* Twitter */
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content="Avery Hughes Portfolio - Cybersecurity Student" />
            <meta name="twitter:description"
                content="Avery Hughes' Personal Portfolio Website. Made with Arch Linux theme by Next.js and Tailwind CSS." />
            <meta name="twitter:site" content="averyhughes" />
            <meta name="twitter:creator" content="averyhughes" />
            <meta name="twitter:image:src" content="images/logos/logo_1024.png" />
            /* Open Graph general (Facebook, Pinterest & Google+) */
            <meta name="og:title" content="Avery Hughes Portfolio - Cybersecurity Student" />
            <meta name="og:description"
                content="Avery Hughes' Personal Portfolio Website. Made with Arch Linux theme by Next.js and Tailwind CSS." />
            <meta name="og:image" content="images/logos/logo_1200.png" />
            <meta name="og:url" content="https://averyhughes.dev/" />
            <meta name="og:site_name" content="Avery Hughes Personal Portfolio" />
            <meta name="og:locale" content="en_US" />
            <meta name="og:type" content="website" />

            <link rel="icon" href="images/logos/fevicon.svg" />
            <link rel="apple-touch-icon" href="images/logos/logo.png" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&family=JetBrains+Mono:wght@300;400;500;700&display=swap" as="style" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&family=JetBrains+Mono:wght@300;400;500;700&display=swap" rel="stylesheet"></link>
        </Head>
    )
}
