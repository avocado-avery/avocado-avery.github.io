import React from 'react'
import Head from 'next/head';

const FONT_HREF = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&family=JetBrains+Mono:wght@300;400;500;700&display=swap";

export default function Meta() {
    const title = "Avery Hughes | Cybersecurity Student & Security Researcher";
    const description = "Cybersecurity student at Indiana Tech specializing in offensive security, Linux systems administration, and penetration testing. Cyber Warriors Team Lieutenant and Unix Lead, CCDC national competitor, and Springer CCIS published author.";
    const siteUrl = "https://itsavery.me";
    const ogImage = `${siteUrl}/images/logos/og-image.png`;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Avery Hughes",
        "url": siteUrl,
        "image": `${siteUrl}/images/Avery-hughes-6485-scaled.jpg`,
        "jobTitle": "Cybersecurity Student",
        "description": description,
        "email": "mailto:ajhughes@itsavery.me",
        "alumniOf": {
            "@type": "CollegeOrUniversity",
            "name": "Indiana Institute of Technology",
            "url": "https://www.indianatech.edu/"
        },
        "homeLocation": {
            "@type": "Place",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Fort Wayne",
                "addressRegion": "IN",
                "addressCountry": "US"
            }
        },
        "sameAs": [
            "https://github.com/avocado-avery",
            "https://www.linkedin.com/in/avery-hughes06/",
            "https://profile.hackthebox.com/profile/019cb195-6bda-72b0-abc2-4338a024079e"
        ],
        "knowsAbout": [
            "Cybersecurity",
            "Penetration Testing",
            "Network Security",
            "Offensive Security",
            "Incident Response",
            "System Hardening",
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
        "inLanguage": "en-US",
        "author": {
            "@type": "Person",
            "name": "Avery Hughes"
        }
    };

    // Appends the font stylesheet after parse so it never blocks first paint.
    // index.css declares fallback stacks, so text renders immediately either way.
    const asyncFont = `(function(){var l=document.createElement('link');l.rel='stylesheet';l.href=${JSON.stringify(FONT_HREF)};document.head.appendChild(l);})();`;

    return (
        <Head>
            {/* Primary Meta Tags */}
            <title>{title}</title>
            <meta charSet="utf-8" />
            <meta name="description" content={description} />
            <meta name="author" content="Avery Hughes" />
            <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#1793D1" />
            <meta name="color-scheme" content="dark" />

            {/* Canonical URL */}
            <link rel="canonical" href={siteUrl} />

            {/* Favicons */}
            <link rel="icon" href="/favicon.ico" sizes="48x48" />
            <link rel="icon" type="image/png" sizes="16x16" href="/images/logos/favicon-16x16.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/images/logos/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="96x96" href="/images/logos/favicon-96x96.png" />
            <link rel="apple-touch-icon" sizes="180x180" href="/images/logos/favicon-180x180.png" />
            <link rel="manifest" href="/site.webmanifest" />

            {/* Open Graph / Facebook / LinkedIn */}
            <meta property="og:type" content="profile" />
            <meta property="profile:first_name" content="Avery" />
            <meta property="profile:last_name" content="Hughes" />
            <meta property="og:url" content={siteUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:image:type" content="image/png" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content="Avery Hughes - Cybersecurity Student & Security Researcher" />
            <meta property="og:site_name" content="Avery Hughes Portfolio" />
            <meta property="og:locale" content="en_US" />

            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
            />

            {/* Fonts - non-blocking */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <script dangerouslySetInnerHTML={{ __html: asyncFont }} />
            <noscript><link rel="stylesheet" href={FONT_HREF} /></noscript>
        </Head>
    )
}
