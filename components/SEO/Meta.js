import React from 'react'
import Head from 'next/head';

export default function Meta() {
    const title = "Avery Hughes | Cybersecurity Student & Security Researcher";
    const description = "Cybersecurity student and security researcher specializing in penetration testing, network security, and ethical hacking. Explore an interactive Arch Linux-themed portfolio featuring projects, skills, and experience.";
    const siteUrl = "https://itsavery.me";
    const ogImage = `${siteUrl}/images/logos/logo_1200.png`;
    const twitterImage = `${siteUrl}/images/logos/logo_1024.png`;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Avery Hughes",
        "url": siteUrl,
        "image": ogImage,
        "jobTitle": "Cybersecurity Student",
        "description": description,
        "sameAs": [
            "https://github.com/avocado-avery",
            "https://www.linkedin.com/in/averyhughes"
        ],
        "knowsAbout": [
            "Cybersecurity",
            "Penetration Testing",
            "Network Security",
            "Ethical Hacking",
            "Linux Administration",
            "Security Research"
        ]
    };

    const websiteJsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": title,
        "url": siteUrl,
        "description": description,
        "author": {
            "@type": "Person",
            "name": "Avery Hughes"
        }
    };

    return (
        <Head>
            {/* Primary Meta Tags */}
            <title>{title}</title>
            <meta charSet="utf-8" />
            <meta name="title" content={title} />
            <meta name="description" content={description} />
            <meta name="author" content="Avery Hughes" />
            <meta name="keywords" content="avery hughes, cybersecurity, penetration testing, security researcher, ethical hacking, network security, arch linux, portfolio, CTF, bug bounty, infosec, cybersecurity student, security engineer" />
            <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
            <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="language" content="English" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#1793D1" />
            <meta name="color-scheme" content="dark" />
            <meta name="generator" content="Next.js" />

            {/* Canonical URL */}
            <link rel="canonical" href={siteUrl} />

            {/* Favicons - all derived from /favicon.ico */}
            <link rel="icon" href="/favicon.ico" sizes="48x48" />
            <link rel="icon" type="image/png" sizes="16x16" href="/images/logos/favicon-16x16.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/images/logos/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="96x96" href="/images/logos/favicon-96x96.png" />
            <link rel="apple-touch-icon" sizes="180x180" href="/images/logos/favicon-180x180.png" />
            <link rel="manifest" href="/site.webmanifest" />

            {/* Schema.org structured data */}
            <meta itemProp="name" content={title} />
            <meta itemProp="description" content={description} />
            <meta itemProp="image" content={ogImage} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={siteUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="1200" />
            <meta property="og:image:alt" content="Avery Hughes - Cybersecurity Portfolio" />
            <meta property="og:site_name" content="Avery Hughes Portfolio" />
            <meta property="og:locale" content="en_US" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={twitterImage} />
            <meta name="twitter:site" content="@averyhughes" />
            <meta name="twitter:creator" content="@averyhughes" />

            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
            />

            {/* Fonts */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&family=JetBrains+Mono:wght@300;400;500;700&display=swap" as="style" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&family=JetBrains+Mono:wght@300;400;500;700&display=swap" rel="stylesheet"></link>
        </Head>
    )
}
