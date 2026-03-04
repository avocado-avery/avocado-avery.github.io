import React, { Component } from 'react'
import $ from 'jquery';

import { FILESYSTEM, resolvePath, findInFilesystem, getTree, normalizePath, shortPath } from '../shared/filesystem';

// All recognized commands
const COMMANDS = [
  "help", "clear", "ls", "cd", "pwd", "cat", "echo", "whoami",
  "uname", "date", "history", "mkdir", "touch", "rm", "grep", "find",
  "tree", "neofetch", "curl", "wget", "ping", "ssh", "systemctl",
  "service", "ps", "top", "htop", "df", "du", "free", "uptime",
  "w", "who", "last", "man", "nano", "vim", "head", "tail", "less",
  "more", "wc", "sort", "uniq", "diff", "chmod", "chown", "sudo",
  "su", "kill", "killall", "pkill", "alias", "export", "env",
  "printenv", "which", "whereis", "locate", "tar", "zip", "unzip",
  "gzip", "apt", "yum", "dnf", "pacman", "git", "docker", "python",
  "python3", "node", "npm", "pip", "make", "gcc", "bash", "sh", "zsh",
  "ifconfig", "ip", "netstat", "ss", "traceroute", "nslookup", "dig",
  "host", "route", "arp", "hostname", "iptables", "nmap", "whois",
  "pstree", "lsof", "lscpu", "lsblk", "lsusb", "lspci", "lsmod",
  "journalctl", "hostnamectl", "timedatectl", "vmstat", "iostat",
  "stat", "file", "md5sum", "sha256sum", "id", "groups", "finger",
  "passwd", "umask", "cal", "cowsay", "fortune", "sl", "rev",
  "base64", "sleep", "exit", "logout", "reboot", "shutdown",
  "seq", "factor", "expr", "hack", "matrix", "figlet", "banner",
  "code", "firefox", "trash", "settings", "sendmsg", "about-avery",
  "open", "jobs", "bg", "fg", "crontab"
];

// Color helper - returns HTML span with color
function c(text, color) {
  return `<span style="color:${color}">${text}</span>`;
}
const C = {
  green: (t) => c(t, '#4E9A06'),
  blue: (t) => c(t, '#1793D1'),
  red: (t) => c(t, '#cc3333'),
  yellow: (t) => c(t, '#cc6633'),
  cyan: (t) => c(t, '#5fafaf'),
  dim: (t) => c(t, '#555'),
  grey: (t) => c(t, '#7c7c7c'),
  white: (t) => c(t, '#c5c8c6'),
  bold: (t) => `<span style="font-weight:bold">${t}</span>`,
};

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
}

export class Terminal extends Component {
  constructor() {
    super();
    this.cursor = "";
    this.terminal_rows = 1;
    this.currentPath = "/home/avery";
    this.previousPath = "/home/avery";
    this.prev_commands = [];
    this.commands_index = -1;
    this.aliases = {
      'll': 'ls -la',
      'la': 'ls -a',
      'l': 'ls',
      '..': 'cd ..',
      '...': 'cd ../..',
      'c': 'clear',
      'h': 'history',
    };
    this.envVars = {
      'USER': 'avery',
      'HOME': '/home/avery',
      'PATH': '/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin',
      'SHELL': '/bin/zsh',
      'HOSTNAME': 'archlinux',
      'TERM': 'xterm-kitty',
      'LANG': 'en_US.UTF-8',
      'EDITOR': 'vim',
    };
    this.state = {
      terminal: [],
    }
  }

  componentDidMount() {
    this.reStartTerminal();
  }

  componentDidUpdate() {
    clearInterval(this.cursor);
    this.startCursor(this.terminal_rows - 2);
  }

  componentWillUnmount() {
    clearInterval(this.cursor);
  }

  reStartTerminal = () => {
    clearInterval(this.cursor);
    this.terminal_rows = 1;
    this.setState({ terminal: [] }, () => {
      this.appendTerminalRow();
    });
  }

  appendTerminalRow = () => {
    let terminal = this.state.terminal;
    terminal.push(this.terminalRow(this.terminal_rows));
    this.setState({ terminal });
    this.terminal_rows += 2;
  }

  getPromptPath = () => {
    return shortPath(this.currentPath);
  }

  terminalRow = (id) => {
    return (
      <React.Fragment key={id}>
        <div className="flex w-full h-5">
          <div className="flex">
            <div className="text-ubt-green">avery@archlinux</div>
            <div className="text-white mx-px font-medium">:</div>
            <div className="text-ubt-blue">{this.getPromptPath()}</div>
            <div className="text-white mx-px font-medium mr-1">$</div>
          </div>
          <div id="cmd" onClick={this.focusCursor} className="bg-transperent relative flex-1 overflow-hidden">
            <span id={`show-${id}`} className="float-left whitespace-pre pb-1 opacity-100 font-normal tracking-wider"></span>
            <div id={`cursor-${id}`} className="float-left mt-1 w-1.5 h-3.5 bg-white"></div>
            <input id={`terminal-input-${id}`} data-row-id={id} onKeyDown={this.checkKey} onBlur={this.unFocusCursor} className="absolute top-0 left-0 w-full opacity-0 outline-none bg-transparent" spellCheck={false} autoFocus={true} autoComplete="off" type="text" />
          </div>
        </div>
        <div id={`row-result-${id}`} className={"my-2 font-normal whitespace-pre-wrap break-words"}></div>
      </React.Fragment>
    );
  }

  focusCursor = (e) => {
    clearInterval(this.cursor);
    this.startCursor($(e.target).data("row-id"));
  }

  unFocusCursor = (e) => {
    this.stopCursor($(e.target).data("row-id"));
  }

  startCursor = (id) => {
    clearInterval(this.cursor);
    $(`input#terminal-input-${id}`).trigger("focus");
    $(`input#terminal-input-${id}`).on("input", function () {
      $(`#cmd span#show-${id}`).text($(this).val());
    });
    this.cursor = window.setInterval(function () {
      if ($(`#cursor-${id}`).css('visibility') === 'visible') {
        $(`#cursor-${id}`).css({ visibility: 'hidden' });
      } else {
        $(`#cursor-${id}`).css({ visibility: 'visible' });
      }
    }, 500);
  }

  stopCursor = (id) => {
    clearInterval(this.cursor);
    $(`#cursor-${id}`).css({ visibility: 'visible' });
  }

  removeCursor = (id) => {
    this.stopCursor(id);
    $(`#cursor-${id}`).css({ display: 'none' });
  }

  clearInput = (id) => {
    $(`input#terminal-input-${id}`).trigger("blur");
  }

  checkKey = (e) => {
    if (e.key === "Enter") {
      let terminal_row_id = $(e.target).data("row-id");
      let command = $(`input#terminal-input-${terminal_row_id}`).val().trim();
      if (command.length !== 0) {
        this.removeCursor(terminal_row_id);
        this.handleInput(command, terminal_row_id);
      } else {
        this.removeCursor(terminal_row_id);
        this.appendTerminalRow();
        return;
      }
      this.prev_commands.push(command);
      this.commands_index = this.prev_commands.length - 1;
      this.clearInput(terminal_row_id);
    }
    else if (e.key === "Tab") {
      e.preventDefault();
      let terminal_row_id = $(e.target).data("row-id");
      let input = $(`input#terminal-input-${terminal_row_id}`).val();
      let completed = this.tabComplete(input);
      if (completed !== input) {
        $(`input#terminal-input-${terminal_row_id}`).val(completed);
        $(`#show-${terminal_row_id}`).text(completed);
      }
    }
    else if (e.key === "ArrowUp") {
      let prev_command;
      if (this.commands_index <= -1) prev_command = "";
      else prev_command = this.prev_commands[this.commands_index];
      let terminal_row_id = $(e.target).data("row-id");
      $(`input#terminal-input-${terminal_row_id}`).val(prev_command);
      $(`#show-${terminal_row_id}`).text(prev_command);
      this.commands_index--;
    }
    else if (e.key === "ArrowDown") {
      let prev_command;
      if (this.commands_index >= this.prev_commands.length) return;
      if (this.commands_index <= -1) this.commands_index = 0;
      if (this.commands_index === this.prev_commands.length) prev_command = "";
      else prev_command = this.prev_commands[this.commands_index];
      let terminal_row_id = $(e.target).data("row-id");
      $(`input#terminal-input-${terminal_row_id}`).val(prev_command);
      $(`#show-${terminal_row_id}`).text(prev_command);
      this.commands_index++;
    }
  }

  // Tab completion
  tabComplete = (input) => {
    const parts = input.split(/\s+/);
    if (parts.length === 1) {
      // Command completion
      const partial = parts[0].toLowerCase();
      const matches = COMMANDS.filter(cmd => cmd.startsWith(partial));
      if (matches.length === 1) return matches[0] + ' ';
      return input;
    } else {
      // File/directory completion
      const partial = parts[parts.length - 1];
      const dir = resolvePath(this.currentPath);
      if (dir && dir.type === 'dir') {
        const entries = Object.keys(dir.contents);
        const matches = entries.filter(name => name.startsWith(partial));
        if (matches.length === 1) {
          parts[parts.length - 1] = matches[0];
          return parts.join(' ');
        }
      }
      return input;
    }
  }

  // Expand aliases
  expandAliases = (raw) => {
    const parts = raw.split(/\s+/);
    if (this.aliases[parts[0]]) {
      parts[0] = this.aliases[parts[0]];
      return parts.join(' ');
    }
    return raw;
  }

  // Expand environment variables
  expandEnvVars = (raw) => {
    return raw.replace(/\$(\w+)/g, (match, varName) => {
      if (varName === 'PWD') return this.currentPath;
      return this.envVars[varName] || match;
    });
  }

  // Main input handler - processes pipes, chaining, redirection
  handleInput = (raw, rowId) => {
    // Handle chaining (;)
    if (raw.includes(';')) {
      const commands = raw.split(';').map(s => s.trim()).filter(Boolean);
      let results = [];
      for (const cmd of commands) {
        results.push(this.processCommand(cmd));
      }
      const combined = results.filter(Boolean).join('\n');
      if (combined) document.getElementById(`row-result-${rowId}`).innerHTML = combined;
      this.appendTerminalRow();
      return;
    }

    // Handle && chaining
    if (raw.includes('&&')) {
      const commands = raw.split('&&').map(s => s.trim()).filter(Boolean);
      let results = [];
      for (const cmd of commands) {
        const result = this.processCommand(cmd);
        results.push(result);
        if (result && result.includes('error') || result && result.includes('not found')) break;
      }
      const combined = results.filter(Boolean).join('\n');
      if (combined) document.getElementById(`row-result-${rowId}`).innerHTML = combined;
      this.appendTerminalRow();
      return;
    }

    // Handle pipes
    if (raw.includes('|') && !raw.includes('||')) {
      const commands = raw.split('|').map(s => s.trim());
      let output = this.captureOutput(commands[0]);
      for (let i = 1; i < commands.length; i++) {
        output = this.processPipe(commands[i], output);
      }
      if (output) document.getElementById(`row-result-${rowId}`).innerHTML = escapeHtml(output);
      this.appendTerminalRow();
      return;
    }

    // Handle redirection
    if (raw.includes('>>') || (raw.includes('>') && !raw.includes('->'))) {
      const append = raw.includes('>>');
      const parts = append ? raw.split('>>') : raw.split('>');
      const cmd = parts[0].trim();
      const filename = parts[1] ? parts[1].trim() : null;
      if (!filename) {
        document.getElementById(`row-result-${rowId}`).innerHTML = C.red('Syntax error: missing filename');
        this.appendTerminalRow();
        return;
      }
      const output = this.captureOutput(cmd);
      const dir = resolvePath(this.currentPath);
      if (dir && dir.type === 'dir') {
        if (dir.contents[filename] && dir.contents[filename].type === 'file') {
          if (append) {
            dir.contents[filename].content += '\n' + output;
          } else {
            dir.contents[filename].content = output;
          }
          document.getElementById(`row-result-${rowId}`).innerHTML = C.dim(`Output written to ${filename}`);
        } else {
          dir.contents[filename] = { type: 'file', content: output };
          document.getElementById(`row-result-${rowId}`).innerHTML = C.dim(`Created ${filename}`);
        }
      }
      this.appendTerminalRow();
      return;
    }

    // Standard command
    const result = this.processCommand(raw);
    if (result === '__CLEAR__') return;
    if (result === '__EXIT__') return;
    if (result) document.getElementById(`row-result-${rowId}`).innerHTML = result;
    this.appendTerminalRow();
  }

  // Capture plain text output for piping
  captureOutput = (raw) => {
    raw = this.expandAliases(raw.trim());
    raw = this.expandEnvVars(raw);
    const parts = raw.split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);

    switch (cmd) {
      case 'ls': {
        const dir = resolvePath(this.currentPath);
        if (dir && dir.type === 'dir') {
          const showHidden = args.includes('-a') || args.includes('-la') || args.includes('-al');
          const entries = Object.keys(dir.contents);
          return (showHidden ? entries : entries.filter(e => !e.startsWith('.'))).join('\n');
        }
        return '';
      }
      case 'echo': return args.join(' ');
      case 'cat': {
        if (!args[0]) return '';
        const node = this.resolveFile(args[0]);
        return node && node.type === 'file' ? node.content : '';
      }
      case 'pwd': return this.currentPath;
      case 'whoami': return 'avery';
      case 'date': return new Date().toString();
      case 'hostname': return 'archlinux';
      default: return '';
    }
  }

  // Process piped input
  processPipe = (cmd, input) => {
    const parts = cmd.split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1);

    switch (command) {
      case 'grep': {
        const pattern = args[0];
        if (!pattern) return input;
        return input.split('\n').filter(line => line.toLowerCase().includes(pattern.toLowerCase())).join('\n');
      }
      case 'head': {
        const n = args[0] && args[0].startsWith('-') ? parseInt(args[0].slice(1)) : 10;
        return input.split('\n').slice(0, n).join('\n');
      }
      case 'tail': {
        const n = args[0] && args[0].startsWith('-') ? parseInt(args[0].slice(1)) : 10;
        return input.split('\n').slice(-n).join('\n');
      }
      case 'wc': {
        const lines = input.split('\n').length;
        const words = input.split(/\s+/).filter(Boolean).length;
        const chars = input.length;
        return `${lines} ${words} ${chars}`;
      }
      case 'sort': return input.split('\n').sort().join('\n');
      case 'uniq': return [...new Set(input.split('\n'))].join('\n');
      case 'rev': return input.split('\n').map(l => l.split('').reverse().join('')).join('\n');
      default: return input;
    }
  }

  // Resolve a file from current directory or absolute path
  resolveFile = (name) => {
    if (name.startsWith('/') || name.startsWith('~')) {
      return resolvePath(name);
    }
    const dir = resolvePath(this.currentPath);
    if (dir && dir.type === 'dir' && dir.contents[name]) {
      return dir.contents[name];
    }
    // Try as sub-path
    return resolvePath(this.currentPath + '/' + name);
  }

  // Process a single command and return HTML result
  processCommand = (raw) => {
    raw = this.expandAliases(raw.trim());
    raw = this.expandEnvVars(raw);

    // Expand wildcards
    const dir = resolvePath(this.currentPath);
    if (dir && dir.type === 'dir' && raw.includes('*')) {
      const parts = raw.split(/\s+/);
      const expanded = parts.map(part => {
        if (part.includes('*')) {
          const regex = new RegExp('^' + part.replace(/\*/g, '.*') + '$');
          const matches = Object.keys(dir.contents).filter(f => regex.test(f));
          return matches.length > 0 ? matches.join(' ') : part;
        }
        return part;
      });
      raw = expanded.join(' ');
    }

    const parts = raw.split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);
    const rest = args.join(' ');

    // Check for rm -rf /* easter egg
    if ((raw === 'rm -rf /*' || raw === 'sudo rm -rf /*')) {
      return this.cmdDestroySequence();
    }

    switch (cmd) {
      // ─── NAVIGATION ───
      case 'cd': return this.cmdCd(args[0]);
      case 'ls': return this.cmdLs(args);
      case 'pwd': return escapeHtml(this.currentPath);
      case 'tree': return this.cmdTree();
      case 'find': return this.cmdFind(args[0]);

      // ─── FILE OPS ───
      case 'cat': return this.cmdCat(args);
      case 'head': return this.cmdHead(args);
      case 'tail': return this.cmdTail(args);
      case 'less':
      case 'more': return this.cmdCat(args);
      case 'echo': return escapeHtml(args.join(' '));
      case 'grep': return this.cmdGrep(args);
      case 'wc': return this.cmdWc(args);
      case 'stat': return this.cmdStat(args[0]);
      case 'file': return this.cmdFile(args[0]);
      case 'md5sum': return this.cmdMd5sum(args[0]);
      case 'sha256sum': return this.cmdSha256sum(args[0]);
      case 'touch':
      case 'chmod':
      case 'chown':
      case 'cp':
      case 'mv':
      case 'ln':
        return C.red('Permission denied: read-only portfolio filesystem');

      // ─── SYSTEM INFO ───
      case 'whoami':
        if (args.includes('-v') || args.includes('--verbose')) return this.cmdWhoamiVerbose();
        return 'avery';
      case 'uname': return this.cmdUname(args);
      case 'date': return new Date().toString();
      case 'uptime': return this.cmdUptime();
      case 'hostname': return 'archlinux';
      case 'hostnamectl': return this.cmdHostnamectl();
      case 'timedatectl': return this.cmdTimedatectl();
      case 'neofetch': return this.cmdNeofetch();
      case 'lscpu': return this.cmdLscpu();
      case 'lsblk': return this.cmdLsblk();
      case 'lsusb': return this.cmdLsusb();
      case 'lspci': return this.cmdLspci();
      case 'lsmod': return this.cmdLsmod();
      case 'vmstat': return this.cmdVmstat();
      case 'iostat': return this.cmdIostat();

      // ─── PROCESSES ───
      case 'ps': return this.cmdPs(args);
      case 'top':
      case 'htop': return this.cmdTop();
      case 'pstree': return this.cmdPstree();
      case 'lsof': return this.cmdLsof();
      case 'kill':
      case 'killall':
      case 'pkill': return C.dim(`${cmd}: No processes to kill in web terminal`);

      // ─── MEMORY / DISK ───
      case 'df': return this.cmdDf();
      case 'du': return this.cmdDu(args);
      case 'free': return this.cmdFree();

      // ─── NETWORK ───
      case 'ifconfig': return this.cmdIfconfig();
      case 'ip': return this.cmdIp(args);
      case 'netstat': return this.cmdNetstat();
      case 'ss': return this.cmdSs();
      case 'ping': return this.cmdPing(args[0]);
      case 'traceroute': return this.cmdTraceroute(args[0]);
      case 'nslookup': return this.cmdNslookup(args[0]);
      case 'dig': return this.cmdDig(args[0]);
      case 'host': return this.cmdHost(args[0]);
      case 'route': return this.cmdRoute();
      case 'arp': return this.cmdArp();
      case 'nmap': return this.cmdNmap(args[0]);
      case 'whois': return this.cmdWhois(args[0]);
      case 'curl': return this.cmdCurl(args);
      case 'wget': return this.cmdWget(args);
      case 'ssh': return this.cmdSsh(args);
      case 'iptables': return C.red('iptables: Permission denied (requires root)');

      // ─── USER / PERMS ───
      case 'id': return this.cmdId(args[0]);
      case 'groups': return this.cmdGroups(args[0]);
      case 'finger': return this.cmdFinger(args[0]);
      case 'passwd': return C.red('passwd: Authentication token manipulation error');
      case 'umask': return args[0] ? C.dim('umask: cannot set in read-only terminal') : '0022';
      case 'w':
      case 'who': return this.cmdWho();
      case 'last': return this.cmdLast();
      case 'sudo':
        if (args[0] === 'rm' && (args.includes('-rf') || args.includes('-r'))) {
          if (args.includes('/*')) return this.cmdDestroySequence();
          return C.red('WARNING: Dangerous command detected! Use \'sudo rm -rf /*\' if you dare...');
        }
        return C.red('Nice try. This incident will be reported.');
      case 'su': return C.red('su: Authentication failure');

      // ─── SHELL ───
      case 'history': return this.cmdHistory();
      case 'alias': return this.cmdAlias(args);
      case 'export': return this.cmdExport(args);
      case 'env':
      case 'printenv': return this.cmdEnv();
      case 'which': return this.cmdWhich(args[0]);
      case 'whereis': return this.cmdWhereis(args[0]);
      case 'man': return this.cmdMan(args[0]);
      case 'jobs': return C.dim('No background jobs');
      case 'bg':
      case 'fg': return C.dim(`${cmd}: no job control`);
      case 'crontab': return this.cmdCrontab(args);
      case 'bash':
      case 'sh':
      case 'zsh': return C.dim(`Already running in ${cmd} shell`);

      // ─── PACKAGE MANAGERS ───
      case 'pacman': return this.cmdPacman(args);
      case 'apt':
      case 'yum':
      case 'dnf': return C.dim(`${cmd}: This is Arch Linux. Use pacman.`);

      // ─── DEV TOOLS ───
      case 'git': return this.cmdGit(args);
      case 'docker': return this.cmdDocker(args);
      case 'python':
      case 'python3': return this.cmdPython(args);
      case 'node': return args.includes('-v') || args.includes('--version') ? 'v20.9.0' : C.dim('Node.js REPL not available in web terminal');
      case 'npm': return this.cmdNpm(args);
      case 'pip': return this.cmdPip(args);
      case 'make':
      case 'gcc': return C.dim(`${cmd}: Compiler not available in web terminal`);

      // ─── SYSTEM CONTROL ───
      case 'systemctl': return this.cmdSystemctl(args);
      case 'service': return this.cmdService(args);
      case 'journalctl': return this.cmdJournalctl();
      case 'reboot':
      case 'shutdown':
      case 'halt':
      case 'poweroff': return this.cmdReboot();

      // ─── MISC UTILS ───
      case 'cal': return this.cmdCal();
      case 'cowsay': return this.cmdCowsay(rest);
      case 'fortune': return this.cmdFortune();
      case 'sl': return this.cmdSl();
      case 'rev': return rest ? rest.split('').reverse().join('') : C.red('Usage: rev <text>');
      case 'base64': return this.cmdBase64(args);
      case 'sleep': return C.dim(`sleep: Sleeping for ${args[0] || 1}s... (simulated)`);
      case 'seq': return this.cmdSeq(args);
      case 'factor': return this.cmdFactor(args[0]);
      case 'expr': return this.cmdExpr(args);
      case 'figlet': return this.cmdFiglet(rest);
      case 'banner': return this.cmdBanner(rest);

      // ─── FILE OPERATIONS (read-only) ───
      case 'mkdir':
        if (args[0]) {
          this.props.addFolder(args[0]);
          return '';
        }
        return C.red('mkdir: missing operand');
      case 'rm':
        if (args.includes('-rf') || args.includes('-r')) {
          return C.red('WARNING: Dangerous command detected! Use \'rm -rf /*\' if you dare...');
        }
        return C.red('Permission denied: read-only portfolio filesystem');
      case 'tar':
      case 'zip':
      case 'unzip':
      case 'gzip': return C.dim(`${cmd}: Archive operations not available in web terminal`);
      case 'sort': return C.dim('sort: Requires pipe input');
      case 'uniq': return C.dim('uniq: Requires pipe input');
      case 'diff': return C.dim('diff: Not implemented in web terminal');
      case 'locate': return C.dim('locate: Database not available. Use find instead.');
      case 'nano':
      case 'vim': return C.dim(`${cmd}: This is a web terminal. Use 'cat' to view files.`);

      // ─── APP LAUNCHERS ───
      case 'code':
        if (!args[0] || args[0] === '.') { this.props.openApp("vscode"); return C.dim('Opening VS Code...'); }
        return this.cmdNotFound(cmd);
      case 'firefox':
        if (!args[0] || args[0] === '.') { this.props.openApp("firefox"); return C.dim('Opening Firefox...'); }
        return this.cmdNotFound(cmd);
      case 'about-avery':
        this.props.openApp("about-avery"); return C.dim('Opening About Avery...');
      case 'trash':
        if (!args[0]) { this.props.openApp("trash"); return C.dim('Opening Trash...'); }
        return this.cmdNotFound(cmd);
      case 'settings':
        if (!args[0]) { this.props.openApp("settings"); return C.dim('Opening Settings...'); }
        return this.cmdNotFound(cmd);
      case 'sendmsg':
        this.props.openApp("gedit"); return C.dim('Opening message composer...');
      case 'open':
        if (args[0]) { this.props.openApp(args[0]); return C.dim(`Opening ${args[0]}...`); }
        return C.red('Usage: open <app-name>');

      // ─── EASTER EGGS ───
      case 'hack': return this.cmdHack();
      case 'matrix': return this.cmdMatrix();

      // ─── CLEAR/EXIT ───
      case 'clear':
        this.reStartTerminal();
        return '__CLEAR__';
      case 'exit':
      case 'logout':
        $("#close-terminal").trigger('click');
        return '__EXIT__';
      case 'help': return this.cmdHelp();

      default: return this.cmdNotFound(cmd);
    }
  }

  // ═══════════════════════════════════════
  // COMMAND IMPLEMENTATIONS
  // ═══════════════════════════════════════

  cmdNotFound = (cmd) => {
    // Fuzzy match
    let best = '', bestScore = 0;
    for (const c of COMMANDS) {
      let s = 0;
      for (let i = 0; i < Math.min(cmd.length, c.length); i++) {
        if (cmd[i] === c[i]) s++; else break;
      }
      const similarity = s / Math.max(cmd.length, c.length);
      if (similarity > bestScore) { best = c; bestScore = similarity; }
    }
    if (bestScore > 0.4) {
      return C.red(`Command not found: '${escapeHtml(cmd)}'. Did you mean '${best}'?`);
    }
    return C.red(`Command not found: '${escapeHtml(cmd)}'. Type 'help' for commands.`);
  }

  cmdHelp = () => {
    const lines = [];
    lines.push(C.bold(C.cyan('=== Avery Hughes Portfolio Terminal ===')));
    lines.push(C.dim('Advanced shell with pipes, redirection, aliases, and more!'));
    lines.push('');
    lines.push('  ' + C.bold(C.green('Portfolio Commands:')));
    lines.push('     ' + C.cyan('about-avery') + '  - Open about me');
    lines.push('     ' + C.cyan('neofetch') + '     - System info');
    lines.push('     ' + C.cyan('whoami -v') + '    - Detailed profile');
    lines.push('     ' + C.cyan('sendmsg') + '      - Send a message');
    lines.push('     ' + C.cyan('open <app>') + '   - Open an app');
    lines.push('');
    lines.push('  ' + C.yellow('Navigation:') + ' ls, cd, pwd, tree, find');
    lines.push('  ' + C.yellow('File Ops:') + ' cat, echo, grep, head, tail, wc, stat, file');
    lines.push('  ' + C.yellow('Network:') + ' ping, curl, wget, ifconfig, netstat, nslookup, dig, nmap');
    lines.push('  ' + C.yellow('System:') + ' whoami, uname, date, uptime, hostname, lscpu, lsblk, free, df');
    lines.push('  ' + C.yellow('Processes:') + ' ps, top, htop, pstree, lsof, kill');
    lines.push('  ' + C.yellow('User/Perms:') + ' id, groups, passwd, chmod, umask');
    lines.push('  ' + C.yellow('Packages:') + ' pacman, npm, pip, docker, git');
    lines.push('  ' + C.yellow('Shell:') + ' alias, export, env, history, man');
    lines.push('  ' + C.yellow('Fun:') + ' cowsay, figlet, fortune, sl, hack, matrix, banner, rev');
    lines.push('  ' + C.yellow('System:') + ' clear, help, reboot, exit');
    lines.push('');
    lines.push(C.bold(C.blue('Advanced Features:')));
    lines.push('  ' + C.blue('Pipes:') + '        ls | grep txt');
    lines.push('  ' + C.blue('Redirection:') + '  echo hello > file.txt');
    lines.push('  ' + C.blue('Chaining:') + '     cd projects && ls');
    lines.push('  ' + C.blue('Aliases:') + '      alias ll=\'ls -la\'');
    lines.push('  ' + C.blue('Variables:') + '    echo $USER');
    lines.push('  ' + C.blue('Wildcards:') + '    cat *.txt');
    lines.push('  ' + C.blue('Tab:') + '          Tab key for auto-complete');
    lines.push('');
    lines.push(C.dim('Try \'ls\' to explore files or \'fortune\' for a surprise!'));
    lines.push(C.dim(C.red('Warning: \'rm -rf /*\' will destroy the website!')));
    return lines.join('\n');
  }

  // ─── NAVIGATION ───

  cmdCd = (arg) => {
    if (!arg || arg === '~') {
      this.previousPath = this.currentPath;
      this.currentPath = '/home/avery';
      return '';
    }
    if (arg === '-') {
      const temp = this.currentPath;
      this.currentPath = this.previousPath;
      this.previousPath = temp;
      return this.currentPath;
    }
    if (arg === '/') {
      return C.red('cd: Permission denied: Cannot access root');
    }

    let targetPath;
    if (arg.startsWith('/') || arg.startsWith('~')) {
      targetPath = normalizePath(arg);
    } else {
      targetPath = normalizePath(this.currentPath + '/' + arg);
    }

    const node = resolvePath(targetPath);
    if (!node) return C.red(`cd: ${escapeHtml(arg)}: No such file or directory`);
    if (node.type !== 'dir') return C.red(`cd: ${escapeHtml(arg)}: Not a directory`);

    this.previousPath = this.currentPath;
    this.currentPath = targetPath;
    return '';
  }

  cmdLs = (args) => {
    const showHidden = args.includes('-a') || args.includes('-la') || args.includes('-al');
    const longFormat = args.includes('-l') || args.includes('-la') || args.includes('-al');

    // Check if there's a path argument
    let targetPath = this.currentPath;
    for (const arg of args) {
      if (!arg.startsWith('-')) {
        if (arg.startsWith('/') || arg.startsWith('~')) {
          targetPath = normalizePath(arg);
        } else {
          targetPath = normalizePath(this.currentPath + '/' + arg);
        }
        break;
      }
    }

    const node = resolvePath(targetPath);
    if (!node) return C.red(`ls: cannot access: No such file or directory`);
    if (node.type !== 'dir') {
      // It's a file, show the file name
      const name = targetPath.split('/').pop();
      return longFormat ? `-rw-r--r-- 1 avery avery ${(node.content || '').length.toString().padStart(4)} Mar  1 12:00 ${name}` : name;
    }

    const entries = Object.keys(node.contents);
    const filtered = showHidden ? entries : entries.filter(e => !e.startsWith('.'));
    if (filtered.length === 0) return '';

    if (longFormat) {
      const lines = [];
      for (const name of filtered.sort()) {
        const item = node.contents[name];
        const type = item.type === 'dir' ? 'd' : '-';
        const perms = item.type === 'dir' ? 'rwxr-xr-x' : 'rw-r--r--';
        const size = item.type === 'dir' ? '4096' : (item.content?.length || 0).toString().padStart(4);
        const colorName = item.type === 'dir' ? C.blue(C.bold(escapeHtml(name))) : escapeHtml(name);
        lines.push(`${type}${perms} 1 avery avery ${size} Mar  1 12:00 ${colorName}`);
      }
      return lines.join('\n');
    } else {
      return filtered.sort().map(name => {
        const item = node.contents[name];
        return item.type === 'dir' ? C.blue(C.bold(escapeHtml(name))) : escapeHtml(name);
      }).join('  ');
    }
  }

  cmdTree = () => {
    const node = resolvePath(this.currentPath);
    if (!node || node.type !== 'dir') return C.red('tree: Not a directory');
    const treeLines = getTree(node, '', true);
    const lines = ['.'];
    for (const line of treeLines) {
      lines.push(line.isDir ? line.text.replace(/([\w.-]+)$/, C.blue(C.bold('$1'))) : escapeHtml(line.text));
    }
    return lines.join('\n');
  }

  cmdFind = (pattern) => {
    if (!pattern) return C.red('Usage: find <pattern>');
    const results = findInFilesystem(FILESYSTEM['/home/avery'], '/home/avery', pattern);
    if (results.length === 0) return C.dim('No matches found.');
    return results.map(r => escapeHtml(r)).join('\n');
  }

  // ─── FILE OPS ───

  cmdCat = (args) => {
    if (!args[0]) return C.red('cat: missing file operand');

    // Handle multiple files
    const results = [];
    for (const filename of args) {
      const file = this.resolveFile(filename);
      if (!file) {
        results.push(C.red(`cat: ${escapeHtml(filename)}: No such file or directory`));
        continue;
      }
      if (file.type === 'dir') {
        results.push(C.red(`cat: ${escapeHtml(filename)}: Is a directory`));
        continue;
      }
      results.push(escapeHtml(file.content || ''));
    }
    return results.join('\n');
  }

  cmdHead = (args) => {
    let n = 10;
    let filename = null;
    for (const arg of args) {
      if (arg.startsWith('-') && !isNaN(arg.slice(1))) {
        n = parseInt(arg.slice(1));
      } else if (arg === '-n' && args.indexOf(arg) + 1 < args.length) {
        n = parseInt(args[args.indexOf(arg) + 1]);
      } else if (!arg.startsWith('-')) {
        filename = arg;
      }
    }
    if (!filename) return C.red('head: missing file operand');
    const file = this.resolveFile(filename);
    if (!file || file.type === 'dir') return C.red(`head: ${escapeHtml(filename)}: No such file`);
    return escapeHtml((file.content || '').split('\n').slice(0, n).join('\n'));
  }

  cmdTail = (args) => {
    let n = 10;
    let filename = null;
    for (const arg of args) {
      if (arg.startsWith('-') && !isNaN(arg.slice(1))) {
        n = parseInt(arg.slice(1));
      } else if (!arg.startsWith('-')) {
        filename = arg;
      }
    }
    if (!filename) return C.red('tail: missing file operand');
    const file = this.resolveFile(filename);
    if (!file || file.type === 'dir') return C.red(`tail: ${escapeHtml(filename)}: No such file`);
    return escapeHtml((file.content || '').split('\n').slice(-n).join('\n'));
  }

  cmdGrep = (args) => {
    if (args.length < 2) return C.red('Usage: grep <pattern> <filename>');
    const pattern = args[0];
    const filename = args[1];
    const file = this.resolveFile(filename);
    if (!file) return C.red(`grep: ${escapeHtml(filename)}: No such file or directory`);
    if (file.type === 'dir') return C.red(`grep: ${escapeHtml(filename)}: Is a directory`);
    const lines = (file.content || '').split('\n');
    const matches = lines.filter(line => line.toLowerCase().includes(pattern.toLowerCase()));
    if (matches.length === 0) return C.dim(`No matches found for '${escapeHtml(pattern)}'`);
    return matches.map(m => {
      const idx = m.toLowerCase().indexOf(pattern.toLowerCase());
      const before = escapeHtml(m.substring(0, idx));
      const match = C.red(C.bold(escapeHtml(m.substring(idx, idx + pattern.length))));
      const after = escapeHtml(m.substring(idx + pattern.length));
      return before + match + after;
    }).join('\n');
  }

  cmdWc = (args) => {
    if (!args[0]) return C.red('wc: missing file operand');
    const file = this.resolveFile(args[0]);
    if (!file || file.type !== 'file') return C.red(`wc: ${escapeHtml(args[0])}: No such file`);
    const content = file.content || '';
    const lines = content.split('\n').length;
    const words = content.split(/\s+/).filter(Boolean).length;
    const chars = content.length;
    return `${lines} ${words} ${chars} ${escapeHtml(args[0])}`;
  }

  cmdStat = (filename) => {
    if (!filename) return C.red('Usage: stat <file>');
    const file = this.resolveFile(filename);
    if (!file) return C.red(`stat: cannot stat '${escapeHtml(filename)}': No such file or directory`);
    const size = file.type === 'dir' ? 4096 : (file.content?.length || 0);
    const perm = file.type === 'dir' ? 'drwxr-xr-x' : '-rw-r--r--';
    return [
      `  File: ${escapeHtml(filename)}`,
      `  Size: ${size}     Blocks: 8     IO Block: 4096   ${file.type === 'dir' ? 'directory' : 'regular file'}`,
      `Access: (0${file.type === 'dir' ? '755' : '644'}/${perm})  Uid: (1000/avery)  Gid: (1000/avery)`,
      `Access: 2025-03-01 12:00:00.000000000 -0500`,
      `Modify: 2025-03-01 12:00:00.000000000 -0500`,
    ].join('\n');
  }

  cmdFile = (filename) => {
    if (!filename) return C.red('Usage: file <file>');
    const file = this.resolveFile(filename);
    if (!file) return C.red(`file: cannot open '${escapeHtml(filename)}'`);
    if (file.type === 'dir') return `${escapeHtml(filename)}: directory`;
    const content = file.content || '';
    if (content.startsWith('#!')) return `${escapeHtml(filename)}: script, ASCII text executable`;
    if (filename.endsWith('.md')) return `${escapeHtml(filename)}: Markdown text`;
    return `${escapeHtml(filename)}: ASCII text`;
  }

  cmdMd5sum = (filename) => {
    if (!filename) return C.red('Usage: md5sum <file>');
    if (!this.resolveFile(filename)) return C.red(`md5sum: ${escapeHtml(filename)}: No such file`);
    return `d41d8cd98f00b204e9800998ecf8427e  ${escapeHtml(filename)}`;
  }

  cmdSha256sum = (filename) => {
    if (!filename) return C.red('Usage: sha256sum <file>');
    if (!this.resolveFile(filename)) return C.red(`sha256sum: ${escapeHtml(filename)}: No such file`);
    return `e3b0c44298fc1c149afbf4c8996fb924  ${escapeHtml(filename)}`;
  }

  // ─── SYSTEM INFO ───

  cmdUname = (args) => {
    if (args.includes('-a')) return 'Linux archlinux 6.7.0-arch1-1 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux';
    if (args.includes('-r')) return '6.7.0-arch1-1';
    return 'Linux';
  }

  cmdUptime = () => {
    const days = Math.floor(Math.random() * 30) + 1;
    const hours = Math.floor(Math.random() * 24);
    const load = [(Math.random() * 0.5).toFixed(2), (Math.random() * 0.3).toFixed(2), (Math.random() * 0.2).toFixed(2)];
    return `${new Date().toLocaleTimeString()} up ${days} days, ${hours}:${Math.floor(Math.random() * 60)}, 1 user, load average: ${load.join(', ')}`;
  }

  cmdHostnamectl = () => {
    return [
      '   Static hostname: archlinux',
      '         Icon name: computer-laptop',
      '           Chassis: laptop',
      '  Operating System: Arch Linux',
      '            Kernel: Linux 6.7.0-arch1-1',
      '      Architecture: x86-64',
    ].join('\n');
  }

  cmdTimedatectl = () => {
    const now = new Date();
    return [
      '               Local time: ' + now.toString(),
      '           Universal time: ' + now.toUTCString(),
      '                Time zone: America/Indiana/Indianapolis (EST, -0500)',
      'System clock synchronized: yes',
      '              NTP service: active',
    ].join('\n');
  }

  cmdNeofetch = () => {
    return [
      C.cyan('                   -`') + '                  ' + C.bold('avery') + '@' + C.bold('archlinux'),
      C.cyan('                  .o+`') + '                 ─────────────────',
      C.cyan('                 `ooo/') + '                 ' + C.yellow('OS') + ': Arch Linux x86_64',
      C.cyan('                `+oooo:') + '                ' + C.yellow('Host') + ': Portfolio Terminal v2.0',
      C.cyan('               `+oooooo:') + '               ' + C.yellow('Kernel') + ': 6.7.0-arch1-1',
      C.cyan('               -+oooooo+:') + '              ' + C.yellow('Shell') + ': zsh 5.9',
      C.cyan('             `/:-:++oooo+:') + '             ' + C.yellow('Name') + ': Avery Hughes',
      C.cyan('            `/++++/+++++++:') + '            ' + C.yellow('Role') + ': Cybersecurity Student',
      C.cyan('           `/++++++++++++++:') + '           ' + C.yellow('School') + ': Indiana Tech',
      C.cyan('          `/+++ooooooooooooo/`') + '         ' + C.yellow('Team') + ': Cyber Warriors',
      C.cyan('         ./ooosssso++osssssso+`') + '        ' + C.yellow('Specialty') + ': Unix & OffSec',
      C.cyan('        .oossssso-````/ossssss+`') + '       ' + C.yellow('Skills') + ': Python, Bash, Docker',
      C.cyan('       -osssssso.      :ssssssso.') + '      ' + C.yellow('Achievements') + ': CCDC National, CCIS Author',
      C.cyan('      :osssssss/        osssso+++.') + '     ' + C.yellow('Email') + ': avery@averyhughes.dev',
      C.cyan('     /ossssssss/        +ssssooo/-') + '     ',
      C.cyan('   `/ossssso+/:-        -:/+osssso+-') + '   ' + c('███', '#cc3333') + c('███', '#4E9A06') + c('███', '#cc6633') + c('███', '#1793D1') + c('███', '#5c2d91') + c('███', '#5fafaf'),
      C.cyan('  `+sso+:-`                 `.-/+oso:') + '  ',
      C.cyan(' `++:.                           `-/+/') + ' ',
      C.cyan(' .`                                 `/') + ' ',
    ].join('\n');
  }

  cmdWhoamiVerbose = () => {
    return [
      C.bold(C.cyan('════════════════════════════════════════════════')),
      C.bold(C.cyan('           Avery Hughes - whoami -v')),
      C.bold(C.cyan('════════════════════════════════════════════════')),
      '',
      C.yellow('User:') + '           avery (Avery Hughes)',
      C.yellow('Role:') + '           Cybersecurity Student & Competitor',
      C.yellow('School:') + '         Indiana Institute of Technology',
      C.yellow('Degree:') + '         BS Cybersecurity, Minor CS (May 2027)',
      C.yellow('Organization:') + '   Indiana Tech Cyber Warriors',
      C.yellow('Position:') + '       Team Lieutenant | Unix Lead | OffSec Co-Lead',
      '',
      C.green('Achievements:'),
      '   • CCDC National Appearance (2x State, 2x Midwest)',
      '   • Springer CCIS First-Author Publication',
      '   • Ball Venture Grant Recipient',
      '   • Dean\'s List',
      '',
      C.cyan('Contact:') + ' avery@averyhughes.dev',
      C.cyan('Links:') + '   linkedin.com/in/avery-hughes06 | github.com/avocado-avery',
    ].join('\n');
  }

  cmdLscpu = () => {
    return [
      'Architecture:            x86_64',
      '  CPU op-mode(s):        32-bit, 64-bit',
      '  Byte Order:            Little Endian',
      'CPU(s):                  8',
      'Vendor ID:               GenuineIntel',
      '  Model name:            Intel(R) Core(TM) i7-9700K @ 3.60GHz',
      '  Thread(s) per core:    2',
      '  Core(s) per socket:    4',
      'Virtualization:          VT-x',
    ].join('\n');
  }

  cmdLsblk = () => {
    return [
      'NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS',
      'sda      8:0    0 465.8G  0 disk',
      '├─sda1   8:1    0   512M  0 part /boot/efi',
      '├─sda2   8:2    0    16G  0 part [SWAP]',
      '└─sda3   8:3    0 449.3G  0 part /',
    ].join('\n');
  }

  cmdLsusb = () => {
    return [
      'Bus 002 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub',
      'Bus 001 Device 004: ID 046d:c52b Logitech, Inc. Unifying Receiver',
      'Bus 001 Device 003: ID 8087:0a2b Intel Corp. Bluetooth wireless interface',
      'Bus 001 Device 001: ID 1d6b:0002 Linux Foundation 2.0 root hub',
    ].join('\n');
  }

  cmdLspci = () => {
    return [
      '00:00.0 Host bridge: Intel Corporation 8th Gen Core Processor Host Bridge',
      '00:02.0 VGA compatible controller: Intel Corporation UHD Graphics 630',
      '00:14.0 USB controller: Intel Corporation Cannon Lake PCH USB 3.1 xHCI',
      '00:1f.3 Audio device: Intel Corporation Cannon Lake PCH cAVS',
      '01:00.0 Ethernet controller: Realtek RTL8111/8168 PCI Express Gigabit',
    ].join('\n');
  }

  cmdLsmod = () => {
    return [
      'Module                  Size  Used by',
      'nvidia_uvm           1228800  0',
      'nvidia_drm             69632  2',
      'nvidia_modeset       1212416  3 nvidia_drm',
      'nvidia              40591360  103 nvidia_uvm,nvidia_modeset',
    ].join('\n');
  }

  cmdVmstat = () => {
    return [
      'procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----',
      ' r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st',
      ' 2  0      0 2048576 524288 4194304   0    0    12    34  567  890 15  5 78  2  0',
    ].join('\n');
  }

  cmdIostat = () => {
    return [
      'avg-cpu:  %user   %nice %system %iowait  %steal   %idle',
      '          15.23    0.00    5.67    2.34    0.00   76.76',
      '',
      'Device            tps    kB_read/s    kB_wrtn/s    kB_read    kB_wrtn',
      'sda             23.45       123.45       456.78    1234567    4567890',
    ].join('\n');
  }

  // ─── PROCESSES ───

  cmdPs = (args) => {
    const aux = args.includes('aux') || args.includes('-aux');
    if (aux) {
      return [
        'USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND',
        'root           1  0.0  0.1 169488  9240 ?        Ss   Mar01   0:02 /sbin/init',
        'root         234  0.0  0.2 289744 17584 ?        Ssl  Mar01   0:12 /usr/lib/systemd/systemd',
        'http        1234  0.1  0.5 125380 41232 ?        S    10:30   0:15 nginx: worker process',
        'root        1337  0.0  0.1  72304  8192 ?        Ss   Mar01   0:00 /usr/bin/sshd -D',
        'avery       2024  0.2  0.3 115644 25088 pts/0    Ss   11:45   0:01 -zsh',
        'avery       2156  0.0  0.1  51060  3440 pts/0    R+   11:48   0:00 ps aux',
      ].join('\n');
    }
    return [
      '    PID TTY          TIME CMD',
      '   2024 pts/0    00:00:01 zsh',
      '   2156 pts/0    00:00:00 ps',
    ].join('\n');
  }

  cmdTop = () => {
    return [
      `top - ${new Date().toLocaleTimeString()} up 5 days, 3:27, 1 user, load average: 0.15, 0.08, 0.05`,
      'Tasks: 142 total,   1 running, 141 sleeping,   0 stopped,   0 zombie',
      '%Cpu(s):  2.3 us,  0.7 sy,  0.0 ni, 96.8 id,  0.2 wa,  0.0 hi,  0.0 si',
      'MiB Mem :   7891.2 total,   3421.5 free,   2156.3 used,   2313.4 buff/cache',
      'MiB Swap:   2048.0 total,   2048.0 free,      0.0 used.   5234.9 avail Mem',
      '',
      '    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND',
      '      1 root      20   0  169488   9240   6724 S   0.0   0.1   0:02.34 systemd',
      '   1234 http      20   0  125380  41232  12344 S   0.3   0.5   0:15.67 nginx',
      '   1337 root      20   0   72304   8192   6144 S   0.0   0.1   0:00.12 sshd',
      '   2024 avery     20   0  115644  25088  18432 S   0.1   0.3   0:01.23 zsh',
    ].join('\n');
  }

  cmdPstree = () => {
    return [
      'systemd─┬─NetworkManager───2*[{NetworkManager}]',
      '        ├─cronie',
      '        ├─dbus-daemon',
      '        ├─nginx───4*[nginx]',
      '        ├─sshd───sshd───zsh───pstree',
      '        ├─systemd-journal',
      '        └─systemd-logind',
    ].join('\n');
  }

  cmdLsof = () => {
    return [
      'COMMAND    PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME',
      'systemd      1 root  cwd    DIR  259,2     4096    2 /',
      'nginx     1234 http   mem    REG  259,2   142856  123 /usr/sbin/nginx',
      'sshd      1337 root    3u  IPv4  12345      0t0  TCP *:22 (LISTEN)',
      'zsh       2024 avery cwd    DIR  259,2     4096  456 /home/avery',
    ].join('\n');
  }

  // ─── MEMORY / DISK ───

  cmdDf = () => {
    return [
      'Filesystem      Size  Used Avail Use% Mounted on',
      '/dev/sda3       449G  125G  302G  30% /',
      'tmpfs           3.9G  1.2M  3.9G   1% /tmp',
      '/dev/sda1       512M   64M  449M  13% /boot/efi',
    ].join('\n');
  }

  cmdDu = (args) => {
    const dir = resolvePath(this.currentPath);
    if (!dir || dir.type !== 'dir') return C.red('du: Not a directory');
    const lines = [];
    for (const [name, item] of Object.entries(dir.contents)) {
      const size = item.type === 'dir' ? '4.0K' : `${((item.content?.length || 0) / 1024).toFixed(1)}K`;
      lines.push(`${size}\t./${escapeHtml(name)}`);
    }
    return lines.join('\n');
  }

  cmdFree = () => {
    return [
      '               total        used        free      shared  buff/cache   available',
      'Mem:         8083456     2207488     3501312      134912     2374656     5362688',
      'Swap:        2097152           0     2097152',
    ].join('\n');
  }

  // ─── NETWORK ───

  cmdIfconfig = () => {
    return [
      'eth0: flags=4163&lt;UP,BROADCAST,RUNNING,MULTICAST&gt;  mtu 1500',
      '        inet 192.168.1.100  netmask 255.255.255.0  broadcast 192.168.1.255',
      '        ether 08:00:27:4e:66:a1  txqueuelen 1000  (Ethernet)',
      '        RX packets 142857  bytes 89264531 (85.1 MiB)',
      '        TX packets 98432   bytes 12847392 (12.2 MiB)',
      '',
      'lo: flags=73&lt;UP,LOOPBACK,RUNNING&gt;  mtu 65536',
      '        inet 127.0.0.1  netmask 255.0.0.0',
    ].join('\n');
  }

  cmdIp = (args) => {
    if (!args[0]) return 'Usage: ip [ OPTIONS ] OBJECT { COMMAND | help }';
    if (args[0] === 'addr' || args[0] === 'address') {
      return [
        '1: lo: &lt;LOOPBACK,UP,LOWER_UP&gt; mtu 65536',
        '    inet 127.0.0.1/8 scope host lo',
        '2: eth0: &lt;BROADCAST,MULTICAST,UP,LOWER_UP&gt; mtu 1500',
        '    inet 192.168.1.100/24 brd 192.168.1.255 scope global dynamic eth0',
      ].join('\n');
    }
    if (args[0] === 'route') {
      return [
        'default via 192.168.1.1 dev eth0 proto dhcp metric 100',
        '192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.100',
      ].join('\n');
    }
    return C.dim(`ip ${args[0]}: not fully implemented`);
  }

  cmdNetstat = () => {
    return [
      'Proto Recv-Q Send-Q Local Address           Foreign Address         State',
      'tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN',
      'tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN',
      'tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN',
      'tcp        0      0 192.168.1.100:22        192.168.1.50:54321      ESTABLISHED',
    ].join('\n');
  }

  cmdSs = () => {
    return [
      'Netid  State   Recv-Q  Send-Q   Local Address:Port    Peer Address:Port',
      'tcp    LISTEN  0       128            0.0.0.0:22           0.0.0.0:*',
      'tcp    LISTEN  0       511            0.0.0.0:80           0.0.0.0:*',
      'tcp    LISTEN  0       511            0.0.0.0:443          0.0.0.0:*',
      'tcp    ESTAB   0       0        192.168.1.100:22     192.168.1.50:54321',
    ].join('\n');
  }

  cmdPing = (host) => {
    if (!host) return C.red('Usage: ping <host>');
    const ms = () => (Math.random() * 50 + 5).toFixed(1);
    return [
      `PING ${escapeHtml(host)} (93.184.216.34) 56(84) bytes of data.`,
      `64 bytes from ${escapeHtml(host)}: icmp_seq=1 ttl=56 time=${ms()} ms`,
      `64 bytes from ${escapeHtml(host)}: icmp_seq=2 ttl=56 time=${ms()} ms`,
      `64 bytes from ${escapeHtml(host)}: icmp_seq=3 ttl=56 time=${ms()} ms`,
      '',
      `--- ${escapeHtml(host)} ping statistics ---`,
      `3 packets transmitted, 3 received, 0% packet loss`,
    ].join('\n');
  }

  cmdTraceroute = (host) => {
    if (!host) return C.red('Usage: traceroute <host>');
    return [
      `traceroute to ${escapeHtml(host)} (93.184.216.34), 30 hops max`,
      ' 1  192.168.1.1  1.234 ms  1.198 ms  1.165 ms',
      ' 2  10.0.0.1  5.432 ms  5.398 ms  5.365 ms',
      ' 3  72.14.215.85  12.567 ms  12.534 ms  12.501 ms',
      ` 4  ${escapeHtml(host)}  18.789 ms  18.756 ms  18.723 ms`,
    ].join('\n');
  }

  cmdNslookup = (host) => {
    if (!host) return C.red('Usage: nslookup <host>');
    return [
      'Server:         8.8.8.8',
      'Address:        8.8.8.8#53',
      '',
      'Non-authoritative answer:',
      `Name:   ${escapeHtml(host)}`,
      'Address: 93.184.216.34',
    ].join('\n');
  }

  cmdDig = (host) => {
    if (!host) return C.red('Usage: dig <host>');
    return [
      `; &lt;&lt;&gt;&gt; DiG 9.18.18 &lt;&lt;&gt;&gt; ${escapeHtml(host)}`,
      ';; QUESTION SECTION:',
      `;${escapeHtml(host)}.                IN      A`,
      '',
      ';; ANSWER SECTION:',
      `${escapeHtml(host)}.         3600    IN      A       93.184.216.34`,
      '',
      ';; Query time: 23 msec',
      ';; SERVER: 8.8.8.8#53(8.8.8.8)',
    ].join('\n');
  }

  cmdHost = (host) => {
    if (!host) return C.red('Usage: host <hostname>');
    return `${escapeHtml(host)} has address 93.184.216.34\n${escapeHtml(host)} has IPv6 address 2606:2800:220:1:248:1893:25c8:1946`;
  }

  cmdRoute = () => {
    return [
      'Kernel IP routing table',
      'Destination     Gateway         Genmask         Flags Metric Ref    Use Iface',
      'default         192.168.1.1     0.0.0.0         UG    100    0        0 eth0',
      '192.168.1.0     0.0.0.0         255.255.255.0   U     100    0        0 eth0',
    ].join('\n');
  }

  cmdArp = () => {
    return [
      'Address                  HWtype  HWaddress           Flags Mask  Iface',
      '192.168.1.1              ether   00:11:22:33:44:55   C           eth0',
      '192.168.1.50             ether   aa:bb:cc:dd:ee:ff   C           eth0',
    ].join('\n');
  }

  cmdNmap = (target) => {
    if (!target) return C.red('Usage: nmap <target>');
    return [
      'Starting Nmap 7.94 ( https://nmap.org )',
      `Nmap scan report for ${escapeHtml(target)}`,
      'Host is up (0.0012s latency).',
      'Not shown: 997 closed ports',
      'PORT    STATE SERVICE',
      '22/tcp  open  ssh',
      '80/tcp  open  http',
      '443/tcp open  https',
      '',
      'Nmap done: 1 IP address (1 host up) scanned in 0.23 seconds',
    ].join('\n');
  }

  cmdWhois = (domain) => {
    if (!domain) return C.red('Usage: whois <domain>');
    return [
      `Domain Name: ${escapeHtml(domain).toUpperCase()}`,
      'Registrar: Example Registrar, Inc.',
      'Updated Date: 2024-01-15T00:00:00Z',
      'Creation Date: 2020-01-01T00:00:00Z',
      'Expiration Date: 2025-01-01T00:00:00Z',
      'Domain Status: clientTransferProhibited',
    ].join('\n');
  }

  cmdCurl = (args) => {
    if (!args[0]) return 'Usage: curl [OPTIONS] <URL>';
    return C.dim(`curl: (7) Failed to connect to ${escapeHtml(args[args.length - 1])}: Web terminal has no network access`);
  }

  cmdWget = (args) => {
    if (!args[0]) return 'Usage: wget [OPTIONS] <URL>';
    return C.dim(`wget: unable to resolve host: Web terminal has no network access`);
  }

  cmdSsh = (args) => {
    if (!args[0]) return 'usage: ssh [-p port] [user@]hostname';
    return C.dim(`ssh: connect to host ${escapeHtml(args[args.length - 1])}: Connection refused`);
  }

  // ─── USER / PERMS ───

  cmdId = (user) => {
    const u = user || 'avery';
    return `uid=1000(${escapeHtml(u)}) gid=1000(${escapeHtml(u)}) groups=1000(${escapeHtml(u)}),4(adm),27(sudo),998(wheel),999(docker)`;
  }

  cmdGroups = (user) => {
    const u = user || 'avery';
    return `${escapeHtml(u)} : ${escapeHtml(u)} adm sudo wheel docker`;
  }

  cmdFinger = (user) => {
    const u = user || 'avery';
    if (u === 'avery') {
      return [
        'Login: avery                            Name: Avery Hughes',
        'Directory: /home/avery                  Shell: /bin/zsh',
        'On since Mon Mar 1 10:00 (EST) on pts/0 from portfolio-terminal',
        'Mail: Open to opportunities!',
        'Plan:',
        '  1. Graduate with BS Cybersecurity from Indiana Tech (May 2027)',
        '  2. Continue competing in CCDC, CPTC, and CTFs',
        '  3. Build out homelab infrastructure',
        '  4. Secure systems and break into cybersecurity industry',
        '  Currently seeking: Cybersecurity internships & full-time roles!',
      ].join('\n');
    }
    return C.red(`finger: ${escapeHtml(u)}: no such user`);
  }

  cmdWho = () => {
    const now = new Date();
    return `avery    pts/0        ${now.toISOString().split('T')[0]} ${now.toTimeString().substring(0, 5)} (portfolio-terminal)`;
  }

  cmdLast = () => {
    return [
      'avery    pts/0   192.168.1.100    Thu Mar  1 11:45   still logged in',
      'avery    pts/0   192.168.1.100    Wed Feb 28 09:23 - 18:45  (09:22)',
      'avery    pts/0   192.168.1.100    Tue Feb 27 13:15 - 22:30  (09:15)',
      '',
      'wtmp begins Mon Feb 24 08:00:00 2025',
    ].join('\n');
  }

  // ─── SHELL ───

  cmdHistory = () => {
    return this.prev_commands.map((cmd, i) => `  ${i + 1}  ${escapeHtml(cmd)}`).join('\n') || C.dim('No commands in history');
  }

  cmdAlias = (args) => {
    if (args.length === 0) {
      return Object.entries(this.aliases).map(([k, v]) => `alias ${k}='${v}'`).join('\n');
    }
    const input = args.join(' ');
    const match = input.match(/^(\w+)=['"](.+)['"]$/);
    if (match) {
      this.aliases[match[1]] = match[2];
      return `alias ${match[1]}='${match[2]}'`;
    }
    if (this.aliases[args[0]]) return `alias ${args[0]}='${this.aliases[args[0]]}'`;
    return C.red(`alias: ${escapeHtml(args[0])}: not found`);
  }

  cmdExport = (args) => {
    if (args.length === 0) {
      return Object.entries(this.envVars).map(([k, v]) => `export ${k}="${v}"`).join('\n');
    }
    const input = args.join(' ');
    const match = input.match(/^(\w+)=(.+)$/);
    if (match) {
      this.envVars[match[1]] = match[2].replace(/['"]/g, '');
      return `export ${match[1]}="${this.envVars[match[1]]}"`;
    }
    return C.red('export: Invalid syntax. Use: export VAR=value');
  }

  cmdEnv = () => {
    this.envVars.PWD = this.currentPath;
    return Object.entries(this.envVars).map(([k, v]) => `${k}=${v}`).join('\n');
  }

  cmdWhich = (cmd) => {
    if (!cmd) return C.red('Usage: which <command>');
    if (COMMANDS.includes(cmd)) return `/usr/bin/${escapeHtml(cmd)}`;
    return C.red(`which: no ${escapeHtml(cmd)} in (/usr/local/bin:/usr/bin:/bin)`);
  }

  cmdWhereis = (cmd) => {
    if (!cmd) return C.red('Usage: whereis <command>');
    if (COMMANDS.includes(cmd)) return `${escapeHtml(cmd)}: /usr/bin/${escapeHtml(cmd)} /usr/share/man/man1/${escapeHtml(cmd)}.1.gz`;
    return `${escapeHtml(cmd)}:`;
  }

  cmdMan = (topic) => {
    if (!topic) return 'What manual page do you want?\nUsage: man <command>';
    const pages = {
      ls: 'ls - list directory contents\n\nSYNOPSIS: ls [OPTIONS] [FILE]...\n\nOPTIONS:\n  -a    show hidden files\n  -l    long listing format\n  -la   combination of -l and -a',
      cd: 'cd - change directory\n\nSYNOPSIS: cd [DIRECTORY]\n\nUse cd .. to go up, cd ~ for home, cd - for previous',
      cat: 'cat - concatenate files\n\nSYNOPSIS: cat [FILE]...\n\nDisplay file contents to terminal',
      grep: 'grep - search for patterns\n\nSYNOPSIS: grep <pattern> <filename>\n\nSearch for PATTERN in FILE',
      find: 'find - search for files\n\nSYNOPSIS: find <pattern>\n\nSearch recursively for matching files',
      echo: 'echo - display text\n\nSYNOPSIS: echo [STRING]...\n\nSupports $VARIABLE expansion',
      alias: 'alias - create command aliases\n\nSYNOPSIS: alias [NAME[=VALUE]]\n\nExamples:\n  alias\n  alias ll=\'ls -la\'',
      export: 'export - set environment variables\n\nSYNOPSIS: export [VAR=VALUE]\n\nExamples:\n  export MY_VAR=hello\n  echo $MY_VAR',
    };
    if (pages[topic]) return C.bold(pages[topic]);
    return C.red(`No manual entry for ${escapeHtml(topic)}\n`) + C.dim('Try: man ls, man cd, man cat, man grep, man find, man echo');
  }

  cmdCrontab = (args) => {
    if (!args[0] || args[0] === '-l') {
      return [
        '# m h  dom mon dow   command',
        '0 2 * * * /usr/local/bin/backup.sh',
        '*/15 * * * * /usr/local/bin/monitor.sh',
        '0 */6 * * * docker-compose pull && docker-compose up -d',
      ].join('\n');
    }
    return C.dim('crontab: editing not available in web terminal');
  }

  // ─── PACKAGES ───

  cmdPacman = (args) => {
    if (!args[0]) return 'usage: pacman <operation> [...]';
    if (args[0] === '-Syu') {
      return [
        ':: Synchronizing package databases...',
        ' core is up to date',
        ' extra is up to date',
        ' community is up to date',
        ':: Starting full system upgrade...',
        C.dim('(web terminal: no packages to upgrade)'),
      ].join('\n');
    }
    if (args[0] === '-Ss' && args[1]) {
      return [
        `extra/${escapeHtml(args[1])} 1.0.0-1`,
        '    Package description for ' + escapeHtml(args[1]),
      ].join('\n');
    }
    if (args[0] === '-Q') {
      return [
        'linux 6.7.0.arch1-1',
        'nginx 1.25.3-1',
        'docker 24.0.7-1',
        'python 3.11.6-1',
        'openssh 9.5p1-1',
        'zsh 5.9-4',
      ].join('\n');
    }
    return C.dim(`pacman ${args[0]}: not fully implemented in web terminal`);
  }

  // ─── DEV TOOLS ───

  cmdGit = (args) => {
    if (!args[0]) return 'usage: git [--version] [--help] <command> [<args>]';
    if (args[0] === '--version') return 'git version 2.43.0';
    if (args[0] === 'status') {
      return 'On branch master\nYour branch is up to date with \'origin/master\'.\n\nnothing to commit, working tree clean';
    }
    if (args[0] === 'log') {
      return [
        C.yellow('commit a7f8e9d2c1b3f4e5a6c7d8e9f0a1b2c3d4e5f6a7'),
        'Author: Avery Hughes <avery@averyhughes.dev>',
        'Date:   ' + new Date().toDateString(),
        '',
        '    Updated portfolio with Arch Linux theme',
      ].join('\n');
    }
    if (args[0] === 'branch') return '* ' + C.green('master');
    return C.dim(`git ${args[0]}: not fully implemented in web terminal`);
  }

  cmdDocker = (args) => {
    if (!args[0]) return 'Usage: docker [OPTIONS] COMMAND';
    if (args[0] === 'ps') {
      return [
        'CONTAINER ID   IMAGE           COMMAND                  STATUS        PORTS                    NAMES',
        'a1b2c3d4e5f6   nginx:latest    "/docker-entrypoint.…"   Up 2 hours    0.0.0.0:80->80/tcp       portfolio-web',
        'f6e5d4c3b2a1   postgres:15     "docker-entrypoint.s…"   Up 3 hours    0.0.0.0:5432->5432/tcp   portfolio-db',
        'b2c3d4e5f6a7   grafana:latest  "/run.sh"                Up 3 hours    0.0.0.0:3000->3000/tcp   monitoring',
      ].join('\n');
    }
    if (args[0] === 'images') {
      return [
        'REPOSITORY    TAG       IMAGE ID       CREATED        SIZE',
        'nginx         latest    a1b2c3d4e5f6   2 weeks ago    142MB',
        'postgres      15        f6e5d4c3b2a1   3 weeks ago    379MB',
        'grafana       latest    b2c3d4e5f6a7   1 week ago     298MB',
      ].join('\n');
    }
    if (args[0] === '--version' || args[0] === 'version') return 'Docker version 24.0.7, build afdd53b';
    return C.dim(`docker ${args[0]}: not fully implemented`);
  }

  cmdPython = (args) => {
    if (!args[0]) return C.dim('Python 3.11.6 (web terminal: REPL not available)');
    if (args[0] === '--version') return 'Python 3.11.6';
    return C.dim('python: script execution not available');
  }

  cmdNpm = (args) => {
    if (!args[0]) return 'Usage: npm <command>';
    if (args[0] === '--version' || args[0] === '-v') return '10.2.4';
    if (args[0] === 'list' || args[0] === 'ls') {
      return 'portfolio@2.0.0 /home/avery\n├── next@13.x\n├── react@18.x\n└── tailwindcss@3.x';
    }
    return C.dim(`npm ${args[0]}: not available in web terminal`);
  }

  cmdPip = (args) => {
    if (!args[0]) return 'Usage: pip <command> [options]';
    if (args[0] === '--version') return 'pip 23.3.1 from /usr/lib/python3.11/site-packages/pip';
    if (args[0] === 'list') {
      return 'Package           Version\n-----------------  -------\nrequests           2.31.0\nfastapi            0.104.1\nparamiko           3.3.1\npycryptodome       3.19.0';
    }
    return C.dim(`pip ${args[0]}: not available in web terminal`);
  }

  // ─── SYSTEM CONTROL ───

  cmdSystemctl = (args) => {
    if (!args[0]) return 'Usage: systemctl [COMMAND] [UNIT]';
    if (args[0] === 'status') {
      const unit = args[1] || 'system';
      return [
        `● ${escapeHtml(unit)}.service - ${escapeHtml(unit)} Service`,
        '     Loaded: loaded (/usr/lib/systemd/system/' + escapeHtml(unit) + '.service; enabled)',
        '     Active: ' + C.green('active (running)') + ' since Mon 2025-03-01 10:00:00 EST',
        '   Main PID: 1234 (' + escapeHtml(unit) + ')',
        '      Tasks: 4 (limit: 9524)',
        '     Memory: 24.0M',
      ].join('\n');
    }
    if (args[0] === 'list-units') {
      return [
        'UNIT                     LOAD   ACTIVE SUB     DESCRIPTION',
        'nginx.service            loaded active running Nginx HTTP Server',
        'sshd.service             loaded active running OpenSSH Daemon',
        'docker.service           loaded active running Docker Application Container',
        'cronie.service           loaded active running Periodic Command Scheduler',
      ].join('\n');
    }
    return C.dim(`systemctl ${args[0]}: acknowledged`);
  }

  cmdService = (args) => {
    if (!args[0]) return 'Usage: service <name> <command>';
    return C.dim(`Redirecting to systemctl. Use: systemctl ${args[1] || 'status'} ${args[0]}`);
  }

  cmdJournalctl = () => {
    return [
      '-- Logs begin at Mon 2025-03-01 00:00:00 EST --',
      'Mar 01 10:23:45 archlinux systemd[1]: Started Session 1 of user avery.',
      'Mar 01 10:23:46 archlinux sshd[1234]: Accepted publickey for avery from 192.168.1.50',
      'Mar 01 10:24:12 archlinux nginx[5678]: 192.168.1.50 "GET / HTTP/1.1" 200 4096',
    ].join('\n');
  }

  cmdReboot = () => {
    return [
      C.yellow('Broadcast message from avery@archlinux'),
      '',
      'The system is going down for reboot NOW!',
      '',
      C.dim('Just kidding! This is a web terminal.'),
      C.dim('Refresh the page if you want to \'reboot\''),
    ].join('\n');
  }

  // ─── MISC UTILS ───

  cmdCal = () => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const monthName = now.toLocaleString('default', { month: 'long' });
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = now.getDate();

    const lines = [`      ${monthName} ${year}`, 'Su Mo Tu We Th Fr Sa'];
    let week = '   '.repeat(firstDay);
    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = day.toString().padStart(2, ' ');
      week += (day === today ? C.bold(C.cyan(dayStr)) : dayStr) + ' ';
      if ((firstDay + day) % 7 === 0) {
        lines.push(week);
        week = '';
      }
    }
    if (week.trim()) lines.push(week);
    return lines.join('\n');
  }

  cmdCowsay = (text) => {
    if (!text) text = 'Hire Avery Hughes - CCDC National | Unix Lead | OffSec';
    const safeText = escapeHtml(text);
    const len = text.length;
    return [
      ' ' + '_'.repeat(len + 2),
      '&lt; ' + safeText + ' &gt;',
      ' ' + '-'.repeat(len + 2),
      '        \\   ^__^',
      '         \\  (oo)\\_______',
      '            (__)\\       )\\/\\',
      '                ||----w |',
      '                ||     ||',
    ].join('\n');
  }

  cmdFortune = () => {
    const fortunes = [
      "Avery Hughes: Where Unix mastery meets offensive security.",
      "Looking for a cybersecurity professional? Avery has CCDC national experience!",
      "Fun fact: Avery redesigned a datacenter with Proxmox and ZFS. Your infra could be next!",
      "Hiring tip: Candidates who build interactive terminal portfolios are keepers.",
      "CCDC National | Springer CCIS Author | Ball Venture Grant — Avery is your next hire.",
      "Avery can harden your Linux boxes while automating with Python. What more do you need?",
      "Red team skills + Blue team mindset = Avery Hughes",
      "If you're reading this, Avery's portfolio already impressed you. Imagine him on your team!",
      "avery@averyhughes.dev — The email address that could solve your security problems.",
      "Defense wins championships. Avery wins cybersecurity competitions.",
    ];
    return fortunes[Math.floor(Math.random() * fortunes.length)];
  }

  cmdSl = () => {
    return [
      '====        ________                ___________',
      '_D _|  |_______/        \\__I_I_____===__|_________|',
      ' |(_)---  |   H\\________/ |   |        =|___ ___|',
      ' /     |  |   H  |  |     |   |         ||_| |_||',
      '|      |  |   H  |__--------------------| [___] |',
      '| ________|___H__/__|_____/[][]~\\_______|       |',
      '|/ |   |-----------I_____I [][] []  D   |=======|',
      '',
      C.dim('You meant to type \'ls\', didn\'t you?'),
    ].join('\n');
  }

  cmdBase64 = (args) => {
    if (!args[0]) return C.red('Usage: base64 <text> or base64 -d <encoded>');
    if (args[0] === '-d' && args[1]) {
      try { return atob(args[1]); }
      catch { return C.red('base64: invalid input'); }
    }
    try { return btoa(args.join(' ')); }
    catch { return C.red('base64: encoding error'); }
  }

  cmdSeq = (args) => {
    if (!args[0]) return C.red('Usage: seq [FIRST] [INCREMENT] LAST');
    const last = parseInt(args[args.length - 1]);
    const first = args.length > 1 ? parseInt(args[0]) : 1;
    if (isNaN(first) || isNaN(last)) return C.red('seq: invalid number');
    if (Math.abs(last - first) > 100) return C.red('seq: sequence too long');
    const result = [];
    for (let i = first; i <= last; i++) result.push(i);
    return result.join('\n');
  }

  cmdFactor = (num) => {
    if (!num) return C.red('Usage: factor <number>');
    const n = parseInt(num);
    if (isNaN(n) || n < 2) return C.red('factor: invalid number');
    const factors = [];
    let temp = n;
    for (let i = 2; i <= Math.sqrt(temp); i++) {
      while (temp % i === 0) { factors.push(i); temp /= i; }
    }
    if (temp > 1) factors.push(temp);
    return `${n}: ${factors.join(' ')}`;
  }

  cmdExpr = (args) => {
    if (args.length < 3) return C.red('Usage: expr <num> <op> <num>');
    const a = parseFloat(args[0]), op = args[1], b = parseFloat(args[2]);
    if (isNaN(a) || isNaN(b)) return C.red('expr: non-numeric argument');
    switch (op) {
      case '+': return (a + b).toString();
      case '-': return (a - b).toString();
      case '*': return (a * b).toString();
      case '/': return b !== 0 ? Math.floor(a / b).toString() : C.red('division by zero');
      case '%': return b !== 0 ? (a % b).toString() : C.red('division by zero');
      default: return C.red(`expr: unknown operator '${escapeHtml(op)}'`);
    }
  }

  cmdFiglet = (text) => {
    if (!text) text = 'Avery Hughes';
    if (text.toLowerCase().includes('avery')) {
      return [
        '     _                          ',
        '    / \\__   _____ _ __ _   _    ',
        '   / _ \\ \\ / / _ \\ \'__| | | |   ',
        '  / ___ \\ V /  __/ |  | |_| |   ',
        ' /_/   \\_\\_/ \\___|_|   \\__, |   ',
        '                       |___/    ',
      ].join('\n');
    }
    return [
      '  ____            _    __       _ _       ',
      ' |  _ \\ ___  _ __| |_ / _| ___ | (_) ___  ',
      ' | |_) / _ \\| \'__| __| |_ / _ \\| | |/ _ \\ ',
      ' |  __/ (_) | |  | |_|  _| (_) | | | (_) |',
      ' |_|   \\___/|_|   \\__|_|  \\___/|_|_|\\___/ ',
    ].join('\n');
  }

  cmdBanner = (text) => {
    if (!text) text = 'HIRE AVERY';
    return [
      '',
      ' #     # ### ######  #######',
      ' #     #  #  #     # #      ',
      ' #     #  #  #     # #      ',
      ' #######  #  ######  #####  ',
      ' #     #  #  #   #   #      ',
      ' #     #  #  #    #  #      ',
      ' #     # ### #     # #######',
      '',
      `         >>> ${escapeHtml(text.toUpperCase())} <<<`,
    ].join('\n');
  }

  // ─── EASTER EGGS ───

  cmdHack = () => {
    return [
      C.green('Initializing hack sequence...'),
      C.green('Connecting to mainframe...'),
      C.green('Bypassing firewall...'),
      C.green('Decrypting passwords...'),
      C.green('Uploading backdoor...'),
      C.green('Access granted!'),
      '',
      'Just kidding! This is a portfolio website.',
      'But Avery does know how to do the real thing.',
      C.yellow('Hire him to protect your systems, not hack them!'),
    ].join('\n');
  }

  cmdMatrix = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()";
    const lines = [];
    for (let i = 0; i < 10; i++) {
      let line = '';
      for (let j = 0; j < 60; j++) {
        line += chars[Math.floor(Math.random() * chars.length)];
      }
      lines.push(C.green(line));
    }
    lines.push('');
    lines.push('Wake up, Neo...');
    lines.push('The Matrix has you...');
    lines.push('');
    lines.push(C.yellow('Hiring Avery Hughes = Red Pill'));
    return lines.join('\n');
  }

  cmdDestroySequence = () => {
    return [
      C.red('[!] CRITICAL: Executing rm -rf /*'),
      '',
      C.red('Deleting all files...'),
      C.red('Removing /home/avery...'),
      C.red('Removing /var/www/html...'),
      C.red('Removing /etc/nginx...'),
      C.red('Removing system files...'),
      C.red('Removing /boot...'),
      '',
      C.red('[X] All files deleted.'),
      '',
      'Why would you delete my website?',
      C.dim('Just kidding. Refresh the page to \'reboot\'.'),
      '',
      C.yellow('But seriously, hire Avery — he knows better than to run rm -rf /*'),
    ].join('\n');
  }

  render() {
    return (
      <div className="h-full w-full text-sm font-mono p-2 overflow-y-auto" id="terminal-body" style={{ backgroundColor: '#0a0a0a', color: '#c5c8c6' }}>
        {this.state.terminal}
      </div>
    )
  }
}

export default Terminal

export const displayTerminal = (addFolder, openApp) => {
  return <Terminal addFolder={addFolder} openApp={openApp}> </Terminal>;
}
