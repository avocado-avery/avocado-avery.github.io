/**
 * Single source of truth for Avery's profile content.
 *
 * Rendered by components/SEO/ProfileContent.js, which is the visible page on
 * mobile and the crawlable (screen-reader) copy on desktop. Keep in sync with
 * components/shared/filesystem.js, which presents the same material as files
 * inside the terminal and file manager.
 */

export const PROFILE = {
    name: 'Avery Hughes',
    headline: 'Cybersecurity Student & Security Researcher',
    location: 'Fort Wayne, Indiana',
    email: 'ajhughes@itsavery.me',
    resume: '/files/Avery-Hughes-Resume.pdf',

    intro: [
        'Cybersecurity student at Indiana Institute of Technology, pursuing a BS in Cybersecurity with a minor in Computer Science, graduating May 2027. Team Lieutenant, Unix Specialty Lead, and Offensive Security Co-Lead for the Indiana Tech Cyber Warriors.',
        'Focused on offensive security, Linux systems, and building secure infrastructure.',
    ],

    links: [
        { label: 'GitHub', sub: 'avocado-avery', href: 'https://github.com/avocado-avery' },
        { label: 'LinkedIn', sub: 'avery-hughes06', href: 'https://www.linkedin.com/in/avery-hughes06/' },
        { label: 'HackTheBox', sub: 'profile', href: 'https://profile.hackthebox.com/profile/019cb195-6bda-72b0-abc2-4338a024079e' },
    ],

    education: {
        school: 'Indiana Institute of Technology',
        degree: 'BS in Cybersecurity, minor in Computer Science',
        detail: 'Expected May 2027 · Fort Wayne, IN',
        notes: "Dean's List · Springer CCIS author · Cyber Warriors (Team Lieutenant, Unix Lead, Offensive Security Co-Lead)",
    },

    experience: [
        {
            role: 'Undergraduate Research Assistant',
            org: 'University of Notre Dame',
            meta: 'Remote · February 2025 – present',
            points: [
                'Builds decentralized backend APIs using Python, FastAPI, Solidity, and IPFS supporting Web3DB’s distributed data architecture.',
                'Designed and implemented encryption, key-management, and access-control modules to strengthen security and data integrity.',
                'First-author publication in Springer CCIS: “Secure and Scalable Data Management Using Web3DB”.',
            ],
        },
        {
            role: 'Program Developer & Digital Literacy Educator',
            org: 'Ball Venture Grant',
            meta: 'Fort Wayne, IN · October 2025 – present',
            points: [
                'Developed and delivered hybrid training sessions for seniors on technology basics and cybersecurity awareness.',
                'Built an AI-powered platform to personalize learning, track progress, and provide ongoing digital support.',
                'Grew participant digital confidence and engagement by teaching safe online practices and social connectivity tools.',
            ],
        },
        {
            role: 'Data Center Technician',
            org: 'Indiana Institute of Technology',
            meta: 'Fort Wayne, IN · August 2025 – present',
            points: [
                'Redesigned the data center layout with Proxmox and ZFS/LVM-thin to improve efficiency, airflow, and system reliability.',
                'Integrated NetBox IPAM, Splunk monitoring, and LDAP to centralize visibility and strengthen infrastructure management.',
                'Standardized configurations and documentation to improve maintainability and reduce operational overhead.',
            ],
        },
        {
            role: 'IT Service Agent',
            org: 'Indiana Institute of Technology',
            meta: 'Fort Wayne, IN · September 2025 – present',
            points: [
                'Resolves 100+ IT tickets monthly across network, software, MFA, SSO, Microsoft Office, and hardware issues.',
                'Assists in deploying and maintaining campus-wide IT infrastructure for 1,500+ students and faculty.',
                'Reduced system downtime by 30% through monitoring and rapid response.',
            ],
        },
        {
            role: 'Team Lieutenant · Unix Lead · Offensive Security Co-Lead',
            org: 'Indiana Tech Cyber Warriors',
            meta: 'Fort Wayne, IN · July 2024 – present',
            points: [
                'Leads Unix, offensive security, and team-wide training for a 20-member competitive cybersecurity team.',
                'Develops exercises, documentation, and reports covering penetration testing, system hardening, and incident response.',
                'Coordinates competition strategy and execution, contributing to high team placements.',
            ],
        },
    ],

    projects: [
        {
            name: 'Core Infrastructure Dockerization',
            tech: 'Docker · Nginx · Linux · Bash',
            body: 'Containerized core services with Docker and an Nginx reverse proxy (SSL/TLS, DNS) for secure, scalable access. Implemented version-controlled configs and automated deployments to streamline updates and maintenance.',
        },
        {
            name: 'Local AI Deployment',
            tech: 'Python · Docker · Linux',
            body: 'Deployed AI/ML models on internal Linux infrastructure for secure research, reducing reliance on cloud services. Implemented GPU passthrough and containerized environments for reproducible training and inference.',
        },
        {
            name: 'COAL — Cyber Defense Competition Script',
            tech: 'Bash · Python',
            body: 'SSH automation tool that mass-executes scripts across hosts, deployed in National CCDC and UB Lockdown. Improved team response time by automating repetitive tasks and standardizing configurations during competitions.',
        },
        {
            name: 'magicLAMP — Automated LAMP Stack Deployment',
            tech: 'Bash · Linux',
            body: 'Bash tooling that provisions Linux, Apache, MySQL, and PHP stacks, cutting setup time from hours to minutes. Designed idempotent installs with consistent, tested configurations for portability.',
        },
    ],

    competitions: [
        { name: 'National Collegiate Cyber Defense Competition (CCDC)', detail: '2x Indiana qualifier · 2x Midwest qualifier · 1x national appearance. Unix system hardening, incident response, and team coordination.' },
        { name: 'Collegiate Penetration Testing Competition (CPTC)', detail: '2x appearance. Professional penetration testing methodology, reporting, and collaboration.' },
        { name: 'DOE CyberForce Competition', detail: '1x appearance. Defending simulated critical energy infrastructure.' },
        { name: 'University at Buffalo Lockdown', detail: '1x appearance. Defensive and offensive techniques in a live environment.' },
    ],

    skills: [
        { group: 'Programming & Scripting', items: 'Python, Bash, Solidity, FastAPI' },
        { group: 'Infrastructure & DevOps', items: 'Docker, Nginx, IPFS, Proxmox, ZFS/LVM' },
        { group: 'Security', items: 'Penetration testing, incident response, system hardening, offensive security, network security' },
        { group: 'Systems Administration', items: 'Active Directory, DNS/DHCP, LDAP, Splunk' },
        { group: 'Leadership', items: 'Team Lieutenant (Cyber Warriors), Unix Lead, Offensive Security Co-Lead, technical training and documentation' },
    ],

    honors: [
        'Springer CCIS published author',
        'CCDC national appearance',
        'Ball Venture Grant recipient',
        "Dean's List",
    ],
};

export default PROFILE;
