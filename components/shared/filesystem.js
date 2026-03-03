// Shared virtual filesystem for terminal and file manager
// Both components import from here so navigation stays in sync

const FILESYSTEM = {
  "/home/avery": {
    type: "dir",
    contents: {
      "about.txt": {
        type: "file",
        content: `Avery Hughes | Cybersecurity Student | Unix Lead & Offensive Security Specialist
Indiana Tech Cyber Warriors | BS Cybersecurity, Minor CS | Graduating May 2027

Passionate about building secure infrastructure, self-hosting services,
and exploring offensive/defensive security. Based in Fort Wayne, IN.

Strong interest in network security, systems administration, and blockchain technology.
When not hardening servers or deploying containers, I enjoy competing in CTF
competitions and tinkering with my homelab.`
      },
      "resume.txt": {
        type: "file",
        content: `Avery Hughes - Resume
=====================
View full resume: open the Resume tab or visit /files/Avery-Hughes-Resume.pdf

Skills: Python, Bash, Solidity, FastAPI, Docker, Nginx, IPFS, Proxmox,
        ZFS/LVM, Active Directory, DNS/DHCP, LDAP, Splunk

Security: Penetration Testing, Incident Response, System Hardening,
          Offensive Security, Network Security

Certifications: CompTIA Security+ (in progress), NCL Certificates`
      },
      "contact.txt": {
        type: "file",
        content: `Email:    avery@averyhughes.dev
LinkedIn: linkedin.com/in/avery-hughes06
GitHub:   github.com/avocado-avery
HackTheBox: app.hackthebox.com/users/2071893`
      },
      "skills.txt": {
        type: "file",
        content: `[+] Programming & Scripting
    Python, Bash, Solidity, FastAPI

[+] Infrastructure & DevOps
    Docker, Nginx, IPFS, Proxmox, ZFS/LVM

[+] Security
    Penetration Testing, Incident Response, System Hardening
    Offensive Security, Network Security

[+] Systems Administration
    Active Directory, DNS/DHCP, LDAP, Splunk

[+] Leadership
    Team Lieutenant (Cyber Warriors), Unix Lead
    Offensive Security Co-Lead, Technical Training & Documentation

[+] Honors & Awards
    Springer CCIS Author, CCDC National Appearance
    Ball Venture Grant Recipient, Dean's List`
      },
      "education": {
        type: "dir",
        contents: {
          "indiana-tech.txt": {
            type: "file",
            content: `Indiana Institute of Technology
================================
Degree:   Bachelor of Science in Cybersecurity
Minor:    Computer Science
Expected: May 2027
Location: Fort Wayne, IN

Honors:   Dean's List, Springer CCIS Author
Activities: Cyber Warriors (Team Lieutenant, Unix Lead, OffSec Co-Lead)`
          }
        }
      },
      "experience": {
        type: "dir",
        contents: {
          "ball-venture-grant.txt": {
            type: "file",
            content: `Program Developer & Digital Literacy Educator
Ball Venture Grant | Fort Wayne, IN
October 2025 - Current

- Developed and delivered hybrid training sessions for seniors on
  technology basics and cybersecurity awareness.
- Built an AI-powered platform to personalize learning, track progress,
  and provide ongoing digital support.
- Increased participants in digital confidence and engagement by teaching
  safe online practices and social connectivity tools.`
          },
          "it-service-agent.txt": {
            type: "file",
            content: `IT Service Agent
Indiana Institute of Technology | Fort Wayne, IN
September 2025 - Current

- Resolve 100+ IT tickets monthly, troubleshooting network, software,
  MFA, SSO, Microsoft Office, and hardware issues.
- Assist in deploying and maintaining campus-wide IT infrastructure
  for 1,500+ students and faculty.
- Reduce system downtime by 30% through monitoring and rapid response.`
          },
          "data-center-technician.txt": {
            type: "file",
            content: `Data Center Technician
Indiana Institute of Technology | Fort Wayne, IN
August 2025 - Current

- Redesigned data center layout with Proxmox and ZFS/LVM-thin to
  improve efficiency, airflow, and system reliability.
- Integrated NetBox IPAM, Splunk monitoring, and LDAP to centralize
  visibility and strengthen infrastructure management.
- Standardized configurations and documentation to enhance
  maintainability and reduce operational overhead.`
          },
          "research-assistant.txt": {
            type: "file",
            content: `Undergrad Research Assistant
University of Notre Dame | Remote
February 2025 - Current

- Build decentralized backend APIs using Python, FastAPI, Solidity,
  and IPFS to support Web3DB's distributed data architecture.
- Designed and implemented encryption, key-management, and access-control
  modules to enhance security and data integrity.
- First-author publication in Springer CCIS:
  "Secure and Scalable Data Management Using Web3DB"`
          },
          "cyber-warriors.txt": {
            type: "file",
            content: `Indiana Tech Cyber Warriors
Indiana Institute of Technology | Fort Wayne, IN
July 2024 - Current

Role: Team Lieutenant | Unix Specialty Lead | Offensive Security Co-Lead

- Lead Unix, offensive security, and team-wide training sessions
  for a 20-member competitive cybersecurity team.
- Develop exercises, documentation, and reports focused on penetration
  testing, system hardening, and incident response.
- Coordinate competition strategy and execution, contributing to high
  team placements across cybersecurity events.`
          }
        }
      },
      "projects": {
        type: "dir",
        contents: {
          "core-infrastructure-dockerization.md": {
            type: "file",
            content: `# Core Infrastructure Dockerization

Containerized core services with Docker & Nginx reverse proxy
(SSL/TLS, DNS) for secure, scalable access.

Implemented version-controlled configs and automated deployments
to streamline updates and maintenance.

Tech: Docker, Nginx, Linux, Bash
Repo: github.com/avocado-avery`
          },
          "local-ai-deployment.md": {
            type: "file",
            content: `# Local AI Deployment

Deployed AI/ML models on internal Linux infrastructure for secure
research, reducing reliance on cloud services.

Implemented GPU passthrough and containerized environments for
reproducible training and inference.

Tech: Python, Docker, Linux
Repo: github.com/avocado-avery`
          },
          "COAL.md": {
            type: "file",
            content: `# COAL - Cyber Defense Competition Script

Built SSH automation tool to mass-execute scripts across hosts;
deployed in National CCDC and UBUFF Lockdown.

Improved team response time by automating repetitive tasks and
standardizing configurations during competitions.

Tech: Bash, Python
Repo: github.com/avocado-avery`
          },
          "magicLAMP.md": {
            type: "file",
            content: `# magicLAMP - Automated LAMP Stack Deployment

Authored Bash script to provision Linux, Apache, MySQL, PHP stacks,
cutting setup time from hours to minutes.

Enhanced portability by designing idempotent installs with consistent,
tested configurations.

Tech: Bash, Linux
Repo: github.com/avocado-avery`
          }
        }
      },
      "competitions": {
        type: "dir",
        contents: {
          "ccdc.txt": {
            type: "file",
            content: `National Collegiate Cyber Defense Competition (CCDC)
====================================================
2x Indiana Qualifier | 2x Midwest Qualifier | 1x National Appearance

Competed in the premier collegiate cybersecurity defense competition,
progressing from state to national level. Responsibilities included
Unix system hardening, incident response, and team coordination.`
          },
          "cyberforce.txt": {
            type: "file",
            content: `Department of Energy CyberForce Competition
============================================
1x Appearance

Participated in the DOE's cybersecurity competition focused on
defending critical energy infrastructure from simulated attacks.`
          },
          "cptc.txt": {
            type: "file",
            content: `Collegiate Penetration Testing Competition (CPTC)
=================================================
2x Appearance

Competed in offensive security competition focusing on professional
penetration testing methodology, reporting, and team collaboration.`
          },
          "ubuff-lockdown.txt": {
            type: "file",
            content: `University at Buffalo Lockdown
==============================
1x Appearance

Competed in the Buffalo State cybersecurity competition,
applying defensive and offensive techniques in a live environment.`
          }
        }
      },
      "scripts": {
        type: "dir",
        contents: {
          "backup.sh": {
            type: "file",
            content: `#!/bin/bash
# Automated backup script for homelab
# Avery Hughes - 2025

BACKUP_DIR="/mnt/backup"
DATE=$(date +%Y%m%d_%H%M%S)

echo "[*] Starting backup: $DATE"
rsync -avz --delete /home/avery/ "$BACKUP_DIR/home_$DATE/"
echo "[+] Backup complete: $BACKUP_DIR/home_$DATE/"`
          },
          "deploy.sh": {
            type: "file",
            content: `#!/bin/bash
# Docker deployment script
# Avery Hughes - 2025

echo "[*] Pulling latest images..."
docker-compose pull
echo "[*] Restarting services..."
docker-compose up -d --remove-orphans
echo "[+] Deployment complete"
docker-compose ps`
          },
          "monitor.py": {
            type: "file",
            content: `#!/usr/bin/env python3
"""System monitoring script for homelab infrastructure."""

import subprocess, json, datetime

def check_services():
    services = ["nginx", "docker", "sshd", "splunk"]
    for svc in services:
        result = subprocess.run(
            ["systemctl", "is-active", svc],
            capture_output=True, text=True
        )
        status = result.stdout.strip()
        print(f"[{'+'  if status == 'active' else '!'}] {svc}: {status}")

if __name__ == "__main__":
    check_services()`
          },
          "scan.py": {
            type: "file",
            content: `#!/usr/bin/env python3
"""Network vulnerability scanner - educational use only."""

import socket, sys

def scan_ports(target, ports):
    print(f"[*] Scanning {target}...")
    for port in ports:
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.settimeout(1)
            result = s.connect_ex((target, port))
            if result == 0:
                print(f"[+] Port {port}: OPEN")
            s.close()
        except Exception as e:
            print(f"[-] Error scanning port {port}: {e}")

if __name__ == "__main__":
    common_ports = [21, 22, 80, 443, 8080, 3306, 5432]
    scan_ports("localhost", common_ports)`
          }
        }
      },
      ".secrets": {
        type: "dir",
        contents: {
          "flag.txt": {
            type: "file",
            content: `Nice work! You found the hidden flag.
flag{y0u_f0und_4v3ry5_s3cr3t_f1l3}

If you're a recruiter who found this, I appreciate the thoroughness.
Feel free to reach out: linkedin.com/in/avery-hughes06`
          },
          ".env": {
            type: "file",
            content: `# Not real credentials, but good instinct checking here
DATABASE_URL=postgresql://avery:nice_try@localhost/portfolio
SECRET_KEY=you_thought_this_was_real_huh
API_KEY=flag{3nv_f1l3s_sh0uld_n3v3r_b3_c0mm1tt3d}`
          }
        }
      },
      ".bashrc": {
        type: "file",
        content: `# ~/.bashrc - Avery Hughes
export PS1="\\[\\033[01;32m\\]avery@archlinux\\[\\033[00m\\]:\\[\\033[01;34m\\]\\w\\[\\033[00m\\]\\$ "
export EDITOR=vim
export PATH="$HOME/.local/bin:$PATH"

alias ll='ls -la'
alias la='ls -a'
alias ..='cd ..'
alias ...='cd ../..'
alias grep='grep --color=auto'
alias docker-clean='docker system prune -af'`
      },
      ".vimrc": {
        type: "file",
        content: `" ~/.vimrc - Avery Hughes
set number
set relativenumber
set tabstop=4
set shiftwidth=4
set expandtab
set autoindent
set hlsearch
syntax on
colorscheme desert`
      }
    }
  }
};

// Resolve a path to its filesystem node
function resolvePath(path, filesystem) {
  const fs = filesystem || FILESYSTEM;

  // Handle ~ expansion
  path = path.replace(/^~/, '/home/avery');

  // Normalize path (handle .., ., etc.)
  const parts = path.split('/').filter(p => p);
  const normalized = [];
  for (const part of parts) {
    if (part === '..') {
      if (normalized.length > 0) normalized.pop();
    } else if (part !== '.') {
      normalized.push(part);
    }
  }

  const normalizedPath = '/' + normalized.join('/');

  if (normalizedPath === '/home/avery') {
    return fs['/home/avery'];
  }

  // Navigate from /home/avery
  let node = fs['/home/avery'];
  for (let i = 2; i < normalized.length; i++) {
    if (!node || !node.contents || !node.contents[normalized[i]]) {
      return null;
    }
    node = node.contents[normalized[i]];
  }

  return node;
}

// Find files matching a pattern recursively
function findInFilesystem(node, path, pattern) {
  const results = [];
  const lower = pattern.toLowerCase();

  if (node.type === 'file') {
    if (path.toLowerCase().includes(lower) ||
        (node.content && node.content.toLowerCase().includes(lower))) {
      results.push(path);
    }
  } else if (node.type === 'dir') {
    for (const [name, child] of Object.entries(node.contents)) {
      const childPath = path + '/' + name;
      results.push(...findInFilesystem(child, childPath, pattern));
    }
  }

  return results;
}

// Print tree structure as array of strings
function getTree(node, prefix, isLast) {
  const lines = [];
  if (!node || !node.contents) return lines;

  const entries = Object.entries(node.contents);
  for (let i = 0; i < entries.length; i++) {
    const [name, child] = entries[i];
    const isLastEntry = i === entries.length - 1;
    const connector = isLastEntry ? '└── ' : '├── ';
    const isDir = child.type === 'dir';

    lines.push({
      text: prefix + connector + name,
      isDir: isDir
    });

    if (isDir) {
      const newPrefix = prefix + (isLastEntry ? '    ' : '│   ');
      lines.push(...getTree(child, newPrefix, isLastEntry));
    }
  }

  return lines;
}

// Normalize an absolute path string
function normalizePath(path) {
  path = path.replace(/^~/, '/home/avery');
  const parts = path.split('/').filter(p => p);
  const normalized = [];
  for (const part of parts) {
    if (part === '..') {
      if (normalized.length > 0) normalized.pop();
    } else if (part !== '.') {
      normalized.push(part);
    }
  }
  return '/' + normalized.join('/');
}

// Get short path (replace /home/avery with ~)
function shortPath(path) {
  return path.replace('/home/avery', '~');
}

export { FILESYSTEM, resolvePath, findInFilesystem, getTree, normalizePath, shortPath };
