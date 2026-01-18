// ============================================================================
// useWebSocket - Socket.IO Connection Hook
// ============================================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const socketRef = useRef(null);
  const listenersRef = useRef(new Map());

  // Initialize socket connection
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[WebSocket] Connected:', socket.id);
      setIsConnected(true);
      setConnectionError(null);
    });

    socket.on('disconnect', (reason) => {
      console.log('[WebSocket] Disconnected:', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('[WebSocket] Connection error:', error);
      setConnectionError(error.message);
      setIsConnected(false);
    });

    socket.on('error', (data) => {
      console.error('[WebSocket] Error:', data);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  // Emit event
  const emit = useCallback((event, data, callback) => {
    if (socketRef.current && isConnected) {
      if (callback) {
        socketRef.current.emit(event, data, callback);
      } else {
        socketRef.current.emit(event, data);
      }
    }
  }, [isConnected]);

  // Add event listener
  const on = useCallback((event, handler) => {
    if (socketRef.current) {
      socketRef.current.on(event, handler);
      listenersRef.current.set(`${event}-${handler.toString()}`, { event, handler });
    }
  }, []);

  // Remove event listener
  const off = useCallback((event, handler) => {
    if (socketRef.current) {
      socketRef.current.off(event, handler);
      listenersRef.current.delete(`${event}-${handler.toString()}`);
    }
  }, []);

  // Get socket instance
  const getSocket = useCallback(() => socketRef.current, []);

  return {
    isConnected,
    connectionError,
    emit,
    on,
    off,
    getSocket
  };
}

export default useWebSocket;
