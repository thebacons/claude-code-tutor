// ============================================================================
// LiveTerminal - WebSocket-connected xterm.js Terminal
// ============================================================================

import React, { useEffect, useRef, useState, useCallback } from 'react';

// Use window to persist terminal instance across HMR and re-renders
// This ensures only one terminal exists even with Vite hot reload
const getGlobalState = () => {
  if (!window.__LIVE_TERMINAL_STATE__) {
    window.__LIVE_TERMINAL_STATE__ = {
      terminal: null,
      sessionId: null,
      fitAddon: null
    };
  }
  return window.__LIVE_TERMINAL_STATE__;
};

export function LiveTerminal({ socket, isConnected, onReady }) {
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const fitAddonRef = useRef(null);
  const sessionIdRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  // Initialize terminal
  useEffect(() => {
    const globalState = getGlobalState();

    // If we already have a global terminal instance, reuse it
    if (globalState.terminal && terminalRef.current) {
      // Reattach existing terminal to DOM if needed
      if (!terminalRef.current.hasChildNodes()) {
        globalState.terminal.open(terminalRef.current);
        if (globalState.fitAddon) globalState.fitAddon.fit();
      }
      xtermRef.current = globalState.terminal;
      fitAddonRef.current = globalState.fitAddon;
      sessionIdRef.current = globalState.sessionId;
      setIsReady(true);
      onReady?.(globalState.terminal);
      return;
    }

    // Check if terminal is already being initialized (async race condition)
    if (globalState.initializing) {
      return;
    }
    globalState.initializing = true;

    let terminal = null;
    let fitAddon = null;
    let cancelled = false;

    const initTerminal = async () => {
      // Double-check we still need to init after async imports
      if (cancelled || globalState.terminal) {
        globalState.initializing = false;
        return;
      }
      try {
        const { Terminal } = await import('@xterm/xterm');
        const { FitAddon } = await import('@xterm/addon-fit');
        const { WebLinksAddon } = await import('@xterm/addon-web-links');

        // Import CSS
        await import('@xterm/xterm/css/xterm.css');

        terminal = new Terminal({
          cursorBlink: true,
          fontSize: 14,
          fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
          theme: {
            background: '#1a1b26',
            foreground: '#a9b1d6',
            cursor: '#c0caf5',
            cursorAccent: '#1a1b26',
            selection: '#33467c',
            black: '#32344a',
            red: '#f7768e',
            green: '#9ece6a',
            yellow: '#e0af68',
            blue: '#7aa2f7',
            magenta: '#ad8ee6',
            cyan: '#449dab',
            white: '#787c99',
            brightBlack: '#444b6a',
            brightRed: '#ff7a93',
            brightGreen: '#b9f27c',
            brightYellow: '#ff9e64',
            brightBlue: '#7da6ff',
            brightMagenta: '#bb9af7',
            brightCyan: '#0db9d7',
            brightWhite: '#acb0d0',
          }
        });

        fitAddon = new FitAddon();
        fitAddonRef.current = fitAddon;

        terminal.loadAddon(fitAddon);
        terminal.loadAddon(new WebLinksAddon());

        if (terminalRef.current) {
          terminal.open(terminalRef.current);
          fitAddon.fit();

          // Welcome message
          terminal.writeln('\x1b[1;35m╔══════════════════════════════════════════════╗\x1b[0m');
          terminal.writeln('\x1b[1;35m║\x1b[0m   \x1b[1;36mClaude Code Live Terminal\x1b[0m                  \x1b[1;35m║\x1b[0m');
          terminal.writeln('\x1b[1;35m║\x1b[0m   Connected to real shell session            \x1b[1;35m║\x1b[0m');
          terminal.writeln('\x1b[1;35m╚══════════════════════════════════════════════╝\x1b[0m');
          terminal.writeln('');
          terminal.writeln('\x1b[33mWaiting for connection...\x1b[0m');

          // Store globally to prevent duplicates
          globalState.terminal = terminal;
          globalState.fitAddon = fitAddon;
          globalState.initializing = false;
          xtermRef.current = terminal;
          setIsReady(true);
          onReady?.(terminal);
        }
      } catch (err) {
        console.error('[LiveTerminal] Initialization error:', err);
        setError('Failed to initialize terminal');
        globalState.initializing = false;
      }
    };

    initTerminal();

    const handleResize = () => {
      if (fitAddonRef.current) {
        fitAddonRef.current.fit();
        // Notify server of resize
        if (socket?.emit && sessionIdRef.current) {
          const dims = fitAddonRef.current.proposeDimensions();
          if (dims) {
            socket.emit('terminal:resize', {
              sessionId: sessionIdRef.current,
              cols: dims.cols,
              rows: dims.rows
            });
          }
        }
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelled = true;
      window.removeEventListener('resize', handleResize);
      // Don't dispose terminal on cleanup - we want to keep it for reuse
      // The terminal will be disposed when the page unloads
    };
  }, [onReady, socket]);

  // Create terminal session when connected
  useEffect(() => {
    if (!isConnected || !socket?.emit || !xtermRef.current) return;

    const globalState = getGlobalState();

    // If we already have a global session, reuse it
    if (globalState.sessionId) {
      sessionIdRef.current = globalState.sessionId;
      return;
    }

    // Create server-side terminal session
    socket.emit('terminal:create', (response) => {
      if (response.success) {
        globalState.sessionId = response.sessionId;
        sessionIdRef.current = response.sessionId;
        xtermRef.current.writeln('');
        xtermRef.current.writeln('\x1b[32m✓ Terminal session created\x1b[0m');
        xtermRef.current.writeln('');

        // Fit and notify server of initial size
        if (fitAddonRef.current) {
          fitAddonRef.current.fit();
          const dims = fitAddonRef.current.proposeDimensions();
          if (dims) {
            socket.emit('terminal:resize', {
              sessionId: response.sessionId,
              cols: dims.cols,
              rows: dims.rows
            });
          }
        }
      } else {
        xtermRef.current.writeln(`\x1b[31mError: ${response.error}\x1b[0m`);
        setError(response.error);
      }
    });

    // Handle terminal output from server
    const handleOutput = (data) => {
      if (data.sessionId === sessionIdRef.current && xtermRef.current) {
        xtermRef.current.write(data.data);
      }
    };

    // Handle terminal exit
    const handleExit = (data) => {
      if (data.sessionId === sessionIdRef.current && xtermRef.current) {
        xtermRef.current.writeln('');
        xtermRef.current.writeln(`\x1b[33mSession ended (exit code: ${data.exitCode})\x1b[0m`);
      }
    };

    socket.on('terminal:output', handleOutput);
    socket.on('terminal:exit', handleExit);

    // Handle user input
    const handleData = (data) => {
      if (sessionIdRef.current) {
        socket.emit('terminal:input', {
          sessionId: sessionIdRef.current,
          data
        });
      }
    };

    xtermRef.current.onData(handleData);

    return () => {
      socket.off('terminal:output', handleOutput);
      socket.off('terminal:exit', handleExit);
    };
  }, [isConnected, socket, isReady]);

  // Get session ID (for parent components)
  const getSessionId = useCallback(() => sessionIdRef.current, []);

  return (
    <div className="rounded-lg overflow-hidden border border-gray-700 flex flex-col">
      {/* Terminal Header */}
      <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="text-gray-400 ml-2 text-sm font-medium">Live Terminal</span>
        <div className="ml-auto flex items-center gap-2">
          {isConnected ? (
            <span className="text-green-400 text-xs flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Connected
            </span>
          ) : (
            <span className="text-red-400 text-xs flex items-center gap-1">
              <span className="w-2 h-2 bg-red-400 rounded-full"></span>
              Disconnected
            </span>
          )}
        </div>
      </div>

      {/* Terminal Body */}
      <div
        ref={terminalRef}
        className="flex-1 min-h-80"
        style={{ backgroundColor: '#1a1b26' }}
      />

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/50 text-red-200 px-4 py-2 text-sm">
          Error: {error}
        </div>
      )}
    </div>
  );
}

export default LiveTerminal;
