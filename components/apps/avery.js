import React, { Component } from 'react';
import { FILESYSTEM, resolvePath, shortPath, normalizePath } from '../shared/filesystem';

// Simple syntax highlighting rules by file extension
function highlightLine(line, filename) {
  const ext = filename.split('.').pop();
  let html = escapeHtml(line);

  if (ext === 'sh' || filename === '.bashrc') {
    // Bash syntax
    html = html
      .replace(/^(\s*#.*)$/g, '<span style="color:#555">$1</span>')
      .replace(/\b(if|then|else|fi|for|do|done|while|case|esac|function|return|exit|echo|export|alias|source|local|readonly)\b/g, '<span style="color:#cc6633">$1</span>')
      .replace(/(\$\w+|\$\{[^}]+\})/g, '<span style="color:#1793D1">$1</span>')
      .replace(/"([^"]*)"/g, '"<span style="color:#4E9A06">$1</span>"')
  } else if (ext === 'py') {
    // Python syntax
    html = html
      .replace(/^(\s*#.*)$/g, '<span style="color:#555">$1</span>')
      .replace(/(""".*?"""|\'\'\'.*?\'\'\')/g, '<span style="color:#4E9A06">$1</span>')
      .replace(/\b(import|from|def|class|if|elif|else|for|while|try|except|finally|with|as|return|yield|raise|pass|break|continue|and|or|not|in|is|True|False|None|print|self)\b/g, '<span style="color:#cc6633">$1</span>')
      .replace(/"([^"]*)"/g, '"<span style="color:#4E9A06">$1</span>"')
      .replace(/'([^']*)'/g, '\'<span style="color:#4E9A06">$1</span>\'')
  } else if (ext === 'md') {
    // Markdown syntax
    html = html
      .replace(/^(#{1,6}\s.*)$/g, '<span style="color:#1793D1;font-weight:bold">$1</span>')
      .replace(/^(\s*[-*]\s)/g, '<span style="color:#cc6633">$1</span>')
      .replace(/\*\*([^*]+)\*\*/g, '<span style="font-weight:bold;color:#c5c8c6">$1</span>')
      .replace(/`([^`]+)`/g, '<span style="color:#4E9A06;background:rgba(78,154,6,0.1);padding:0 2px">$1</span>')
  } else if (filename === '.vimrc') {
    // Vimscript
    html = html
      .replace(/^(\s*".*)$/g, '<span style="color:#555">$1</span>')
      .replace(/\b(set|syntax|colorscheme|on|off)\b/g, '<span style="color:#cc6633">$1</span>')
  } else if (ext === 'txt') {
    // Text files - highlight headers and special patterns
    html = html
      .replace(/^(={3,})$/g, '<span style="color:#1793D1">$1</span>')
      .replace(/^(\[[\+\!\*\-]\]\s.*)$/g, '<span style="color:#4E9A06">$1</span>')
      .replace(/^(\w[\w\s]+:)\s/g, '<span style="color:#1793D1">$1</span> ')
      .replace(/(https?:\/\/\S+)/g, '<span style="color:#1793D1;text-decoration:underline">$1</span>')
  }

  return html;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export class AboutAvery extends Component {
  constructor() {
    super();
    this.state = {
      currentPath: '/home/avery',
      selectedFile: null,
      fileContent: null,
      viewMode: 'grid',
    };
  }

  componentDidMount() {
    const saved = localStorage.getItem('file-manager-path');
    if (saved) {
      const node = resolvePath(saved);
      if (node && node.type === 'dir') {
        this.setState({ currentPath: saved });
      }
    }
  }

  navigate = (name) => {
    const newPath = normalizePath(this.state.currentPath + '/' + name);
    const node = resolvePath(newPath);
    if (!node) return;

    if (node.type === 'dir') {
      this.setState({ currentPath: newPath, selectedFile: null, fileContent: null });
      localStorage.setItem('file-manager-path', newPath);
    } else if (node.type === 'file') {
      this.setState({ selectedFile: name, fileContent: node.content });
    }
  }

  navigateTo = (path) => {
    const node = resolvePath(path);
    if (node && node.type === 'dir') {
      this.setState({ currentPath: path, selectedFile: null, fileContent: null });
      localStorage.setItem('file-manager-path', path);
    }
  }

  goUp = () => {
    if (this.state.currentPath === '/home/avery') return;
    const parts = this.state.currentPath.split('/');
    parts.pop();
    const parent = parts.join('/') || '/home/avery';
    this.navigateTo(parent);
  }

  goHome = () => {
    this.navigateTo('/home/avery');
  }

  closeFileView = () => {
    this.setState({ selectedFile: null, fileContent: null });
  }

  getFileIcon = (name, type) => {
    if (type === 'dir') return '📁';
    if (name.endsWith('.sh')) return '⚙️';
    if (name.endsWith('.py')) return '🐍';
    if (name.endsWith('.md')) return '📝';
    if (name.endsWith('.txt')) return '📄';
    if (name.startsWith('.')) return '🔧';
    return '📄';
  }

  getFileColor = (name, type) => {
    if (type === 'dir') return '#1793D1';
    if (name.endsWith('.sh')) return '#4E9A06';
    if (name.endsWith('.py')) return '#3776AB';
    if (name.endsWith('.md')) return '#cc6633';
    if (name.startsWith('.')) return '#7c7c7c';
    return '#c5c8c6';
  }

  renderBreadcrumb = () => {
    const parts = this.state.currentPath.split('/').filter(Boolean);
    const crumbs = [];
    let accumulated = '';

    for (let i = 0; i < parts.length; i++) {
      accumulated += '/' + parts[i];
      const path = accumulated;
      const isLast = i === parts.length - 1;
      crumbs.push(
        <React.Fragment key={i}>
          {i > 0 && <span className="mx-1" style={{ color: '#555' }}>/</span>}
          <span
            className={isLast ? '' : 'cursor-pointer hover:underline'}
            style={{ color: isLast ? '#c5c8c6' : '#1793D1' }}
            onClick={isLast ? undefined : () => this.navigateTo(path)}
          >
            {parts[i]}
          </span>
        </React.Fragment>
      );
    }

    return crumbs;
  }

  renderSidebar = () => {
    const homeDir = FILESYSTEM['/home/avery'];
    const dirs = Object.entries(homeDir.contents)
      .filter(([, item]) => item.type === 'dir')
      .filter(([name]) => !name.startsWith('.'))
      .sort(([a], [b]) => a.localeCompare(b));

    return (
      <div className="flex flex-col py-2" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        <div
          className="flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-white hover:bg-opacity-5 rounded-r-lg text-xs font-mono"
          style={{ color: this.state.currentPath === '/home/avery' ? '#1793D1' : '#999' }}
          onClick={this.goHome}
        >
          <span>🏠</span>
          <span>Home</span>
        </div>
        {dirs.map(([name]) => {
          const path = '/home/avery/' + name;
          const isActive = this.state.currentPath === path;
          return (
            <div
              key={name}
              className="flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-white hover:bg-opacity-5 rounded-r-lg text-xs font-mono"
              style={{
                color: isActive ? '#1793D1' : '#999',
                backgroundColor: isActive ? 'rgba(23, 147, 209, 0.08)' : 'transparent',
                borderLeft: isActive ? '2px solid #1793D1' : '2px solid transparent',
              }}
              onClick={() => this.navigateTo(path)}
            >
              <span>📁</span>
              <span>{name}</span>
            </div>
          );
        })}
      </div>
    );
  }

  renderFileGrid = () => {
    const dir = resolvePath(this.state.currentPath);
    if (!dir || dir.type !== 'dir') return null;

    const entries = Object.entries(dir.contents)
      .filter(([name]) => !name.startsWith('.'))
      .sort(([, a], [, b]) => {
        if (a.type === 'dir' && b.type !== 'dir') return -1;
        if (a.type !== 'dir' && b.type === 'dir') return 1;
        return 0;
      });

    const hidden = Object.entries(dir.contents)
      .filter(([name]) => name.startsWith('.'))
      .sort(([a], [b]) => a.localeCompare(b));

    const allEntries = [...entries, ...hidden];

    if (allEntries.length === 0) {
      return (
        <div className="flex-grow flex items-center justify-center">
          <span className="font-mono text-xs" style={{ color: '#555' }}>Empty directory</span>
        </div>
      );
    }

    return (
      <div className="flex-grow overflow-y-auto windowMainScreen">
        <div className="flex flex-wrap gap-2 p-3 justify-center">
          {allEntries.map(([name, item]) => (
            <div
              key={name}
              className="flex flex-col items-center justify-center p-2 cursor-pointer hover:bg-white hover:bg-opacity-5 transition-colors rounded-lg"
              style={{
                width: '90px',
                minHeight: '80px',
                border: this.state.selectedFile === name ? '1px solid #1793D1' : '1px solid transparent',
                backgroundColor: this.state.selectedFile === name ? 'rgba(23, 147, 209, 0.08)' : 'transparent',
              }}
              onClick={() => this.navigate(name)}
            >
              <span className="text-2xl mb-1">{this.getFileIcon(name, item.type)}</span>
              <span
                className="text-center font-mono leading-tight break-all"
                style={{ fontSize: '10px', color: this.getFileColor(name, item.type) }}
              >
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  renderFileContent = () => {
    if (!this.state.selectedFile || !this.state.fileContent) return null;

    const lines = this.state.fileContent.split('\n');
    const lineCount = lines.length;
    const lineNumWidth = Math.max(String(lineCount).length, 2);
    const filePath = shortPath(this.state.currentPath) + '/' + this.state.selectedFile;

    return (
      <div className="flex flex-col h-full" style={{ backgroundColor: '#0a0a0a' }}>
        {/* Vim-style file content with line numbers */}
        <div className="flex-grow overflow-y-auto windowMainScreen flex justify-center">
          <div className="w-full max-w-4xl">
            {lines.map((line, i) => (
              <div key={i} className="flex font-mono" style={{ fontSize: '12px', lineHeight: '20px' }}>
                <span
                  className="select-none text-right pr-3 flex-shrink-0"
                  style={{
                    width: `${lineNumWidth + 2}ch`,
                    color: '#555',
                    backgroundColor: '#080808',
                    borderRight: '1px solid #1a1a1a',
                  }}
                >
                  {i + 1}
                </span>
                <span
                  className="pl-3 flex-grow whitespace-pre-wrap break-words"
                  style={{ color: '#c5c8c6' }}
                  dangerouslySetInnerHTML={{ __html: highlightLine(line, this.state.selectedFile) || '&nbsp;' }}
                />
              </div>
            ))}
            {/* Vim tilde lines for empty space */}
            {lineCount < 20 && Array.from({ length: 20 - lineCount }, (_, i) => (
              <div key={`tilde-${i}`} className="flex font-mono" style={{ fontSize: '12px', lineHeight: '20px' }}>
                <span
                  className="select-none text-right pr-3 flex-shrink-0"
                  style={{
                    width: `${lineNumWidth + 2}ch`,
                    backgroundColor: '#080808',
                    borderRight: '1px solid #1a1a1a',
                  }}
                >&nbsp;</span>
                <span className="pl-3" style={{ color: '#1793D1' }}>~</span>
              </div>
            ))}
          </div>
        </div>

        {/* Vim statusline */}
        <div className="flex items-center justify-between font-mono select-none" style={{ fontSize: '11px', height: '22px' }}>
          <div className="flex items-center h-full">
            <span className="px-2 h-full flex items-center font-bold" style={{ backgroundColor: '#1793D1', color: '#0a0a0a' }}>
              NORMAL
            </span>
            <span className="px-2 h-full flex items-center" style={{ backgroundColor: '#1a1a1a', color: '#c5c8c6' }}>
              {filePath}
            </span>
            <span className="px-2 h-full flex items-center" style={{ backgroundColor: '#111', color: '#555' }}>
              {this.state.fileContent.length}B
            </span>
          </div>
          <div className="flex items-center h-full">
            <span className="px-2 h-full flex items-center" style={{ backgroundColor: '#111', color: '#555' }}>
              utf-8
            </span>
            <span className="px-2 h-full flex items-center" style={{ backgroundColor: '#1a1a1a', color: '#7c7c7c' }}>
              {lineCount}L
            </span>
            <span className="px-2 h-full flex items-center font-bold" style={{ backgroundColor: '#1793D1', color: '#0a0a0a' }}>
              1:{1}
            </span>
          </div>
        </div>

        {/* Vim command line */}
        <div className="flex items-center font-mono" style={{ fontSize: '11px', height: '20px', backgroundColor: '#0a0a0a' }}>
          <span className="px-2" style={{ color: '#555' }}>
            "{this.state.selectedFile}" {lineCount}L, {this.state.fileContent.length}B
          </span>
          <span className="ml-auto px-2 cursor-pointer hover:underline" style={{ color: '#cc3333' }} onClick={this.closeFileView}>
            :q
          </span>
        </div>
      </div>
    );
  }

  renderStatusBar = () => {
    const dir = resolvePath(this.state.currentPath);
    const count = dir && dir.type === 'dir' ? Object.keys(dir.contents).length : 0;
    const visibleCount = dir && dir.type === 'dir' ?
      Object.keys(dir.contents).filter(n => !n.startsWith('.')).length : 0;

    return (
      <div className="flex items-center justify-between px-3 py-1 text-xs font-mono" style={{ backgroundColor: '#111111', borderTop: '1px solid rgba(255,255,255,0.06)', color: '#555', borderRadius: '0 0 12px 12px' }}>
        <span>{visibleCount} items{count > visibleCount ? ` (${count - visibleCount} hidden)` : ''}</span>
        <span>{shortPath(this.state.currentPath)}</span>
      </div>
    );
  }

  render() {
    return (
      <div className="w-full h-full flex flex-col select-none" style={{ backgroundColor: '#0c0c0c', color: '#c5c8c6' }}>
        {/* Toolbar */}
        <div className="flex items-center gap-1 px-2 py-1 text-xs font-mono" style={{ backgroundColor: '#141414', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div
            className="px-2 py-0.5 cursor-pointer hover:bg-white hover:bg-opacity-5 rounded"
            style={{ color: this.state.currentPath !== '/home/avery' ? '#c5c8c6' : '#555' }}
            onClick={this.goUp}
            title="Go up"
          >
            ↑
          </div>
          <div
            className="px-2 py-0.5 cursor-pointer hover:bg-white hover:bg-opacity-5 rounded"
            style={{ color: '#c5c8c6' }}
            onClick={this.goHome}
            title="Home"
          >
            ~
          </div>
          <div className="flex-grow flex items-center px-2 py-0.5 mx-1 rounded" style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.06)' }}>
            {this.renderBreadcrumb()}
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-grow overflow-hidden">
          {/* Sidebar */}
          <div className="hidden md:flex flex-col w-40" style={{ backgroundColor: '#111111' }}>
            {this.renderSidebar()}
          </div>

          {/* File area */}
          <div className="flex flex-col flex-grow">
            {this.state.selectedFile && this.state.fileContent
              ? this.renderFileContent()
              : this.renderFileGrid()
            }
          </div>
        </div>

        {/* Status bar */}
        {!this.state.selectedFile && this.renderStatusBar()}
      </div>
    );
  }
}

export default AboutAvery;

export const displayAboutAvery = () => {
  return <AboutAvery />;
}
