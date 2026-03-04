import displayVsCode from './components/apps/vscode';
import { displayTerminal } from './components/apps/terminal';
import { displaySettings } from './components/apps/settings';
import { displayFirefox } from './components/apps/chrome';
import { displayTrash } from './components/apps/trash';
import { displayGedit } from './components/apps/gedit';
import { displayAboutAvery } from './components/apps/avery';
import { displayTerminalCalc } from './components/apps/calc';
import { displayResume } from './components/apps/resume';
import { displayWelcome } from './components/apps/welcome';

const apps = [
    {
        id: "welcome",
        title: "About Me — Firefox",
        icon: './themes/Yaru/apps/firefox.png',
        disabled: false,
        favourite: false,
        desktop_shortcut: false,
        screen: displayWelcome,
        startup: true,
    },
    {
        id: "firefox",
        title: "Firefox",
        icon: './themes/Yaru/apps/firefox.png',
        disabled: false,
        favourite: true,
        desktop_shortcut: true,
        screen: displayFirefox,
    },
    {
        id: "calc",
        title: "Calc",
        icon: './themes/Yaru/apps/calc.png',
        disabled: false,
        favourite: true,
        desktop_shortcut: false,
        screen: displayTerminalCalc,
    },
    {
        id: "resume",
        title: "Resume",
        icon: './themes/Yaru/apps/resume.png',
        disabled: false,
        favourite: true,
        desktop_shortcut: true,
        screen: displayResume,
    },
    {
        id: "about-avery",
        title: "About Avery",
        icon: './themes/Yaru/system/user-home.png',
        disabled: false,
        favourite: true,
        desktop_shortcut: true,
        screen: displayAboutAvery,
    },
    {
        id: "vscode",
        title: "Visual Studio Code",
        icon: './themes/Yaru/apps/vscode.png',
        disabled: false,
        favourite: true,
        desktop_shortcut: false,
        screen: displayVsCode,
    },
    {
        id: "terminal",
        title: "Terminal",
        icon: './themes/Yaru/apps/bash.png',
        disabled: false,
        favourite: true,
        desktop_shortcut: false,
        screen: displayTerminal,
    },
    {
        id: "settings",
        title: "Settings",
        icon: './themes/Yaru/apps/gnome-control-center.png',
        disabled: false,
        favourite: true,
        desktop_shortcut: false,
        screen: displaySettings,
    },
    {
        id: "trash",
        title: "Trash",
        icon: './themes/Yaru/system/user-trash-full.png',
        disabled: false,
        favourite: false,
        desktop_shortcut: true,
        screen: displayTrash,
    },
    {
        id: "gedit",
        title: "Contact Me",
        icon: './themes/Yaru/apps/gedit.png',
        disabled: false,
        favourite: false,
        desktop_shortcut: true,
        screen: displayGedit,
    },
    {
        id: "github",
        title: "GitHub",
        icon: './themes/Yaru/apps/github.png',
        disabled: false,
        favourite: false,
        desktop_shortcut: true,
        isExternalApp: true,
        url: "https://github.com/avocado-avery",
        screen: () => {},
    },
    {
        id: "linkedin",
        title: "LinkedIn",
        icon: './themes/Yaru/apps/linkedin.png',
        disabled: false,
        favourite: false,
        desktop_shortcut: true,
        isExternalApp: true,
        url: "https://www.linkedin.com/in/avery-hughes06/"
    },
    {
        id: "hackthebox",
        title: "HackTheBox",
        icon: './themes/Yaru/apps/hackthebox.png',
        disabled: false,
        favourite: false,
        desktop_shortcut: true,
        isExternalApp: true,
        url: "https://app.hackthebox.com/users/2071893"
    },
]

export default apps;
