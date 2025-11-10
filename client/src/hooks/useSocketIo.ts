/**
 * React Hook for Socket.io Connection
 * Manages real-time collaboration and updates for live coding
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type { ResumeData } from '../types';

// Get the API base URL from environment variable
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5002';
const API_KEY = (import.meta as any).env?.VITE_API_KEY || (import.meta as any).env?.VITE_OPENAI_API_KEY;

export interface CursorPosition {
  row: number;
  column: number;
  sectionId?: string;
  fieldId?: string;
}

export interface TextSelection {
  start: CursorPosition;
  end: CursorPosition;
  text?: string;
}

export interface UserPresence {
  userId: string;
  name: string;
  email?: string;
  color?: string;
}

export interface SocketHookResult {
  isConnected: boolean;
  lastUpdateTime: Date | null;
  editorCount: number;
  sendResumeUpdate: (data: ResumeData) => void;
  sendCursorUpdate: (position: CursorPosition) => void;
  sendSelectionUpdate: (selection: TextSelection) => void;
  activeCursors: Map<string, { position: CursorPosition, user: UserPresence }>;
  activeSelections: Map<string, { selection: TextSelection, user: UserPresence }>;
  connectionError: string | null;
  reconnect: () => void;
  apiKeyValid: boolean;
}

// Generate a random color for user cursors
const generateUserColor = (): string => {
  const colors = [
    '#FF5733', // Red-orange
    '#33FF57', // Green
    '#3357FF', // Blue
    '#F033FF', // Purple
    '#FF33A8', // Pink
    '#33FFF5', // Cyan
    '#FFD700', // Gold
    '#FF8C00'  // Dark orange
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const useSocketIo = (
  resumeId: string,
  user?: { id: string; name: string; email?: string }
): SocketHookResult => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const [editorCount, setEditorCount] = useState<number>(1); // Default to 1 (self)
  const [apiKeyValid, setApiKeyValid] = useState<boolean>(!!API_KEY);
  
  // Using refs to maintain socket instance across renders
  const socketRef = useRef<Socket | null>(null);
  const reconnectAttemptsRef = useRef<number>(0);
  const maxReconnectAttempts = 5;
  
  // Store other users' cursors and selections
  const [activeCursors, setActiveCursors] = useState<
    Map<string, { position: CursorPosition, user: UserPresence }>
  >(new Map());
  
  const [activeSelections, setActiveSelections] = useState<
    Map<string, { selection: TextSelection, user: UserPresence }>
  >(new Map());
  
  // User presence information
  const userPresence = useRef<UserPresence>({
    userId: user?.id || 'anonymous',
    name: user?.name || 'Anonymous',
    email: user?.email,
    color: generateUserColor()
  });
  
  // Connect to Socket.IO
  const connect = useCallback(() => {
    if (!resumeId) return;
    
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.disconnect();
    }
    
    // Initialize Socket.io connection with API key
    socketRef.current = io(API_BASE_URL, {
      query: { resumeId, apiKey: API_KEY },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: maxReconnectAttempts,
      auth: API_KEY ? { token: API_KEY } : undefined
    });
    
    // Set up event listeners
    socketRef.current.on('connect', () => {
      console.log('Socket.io connected!', socketRef.current?.id);
      setIsConnected(true);
      setConnectionError(null);
      reconnectAttemptsRef.current = 0;
      
      // Join the resume editing room
      socketRef.current?.emit('joinRoom', resumeId);
    });
    
    socketRef.current.on('disconnect', () => {
      console.log('Socket.io disconnected');
      setIsConnected(false);
    });
    
    socketRef.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      if (error.message.includes('Authentication failed') || error.message.includes('Invalid API key')) {
        setConnectionError('Invalid API key. Please check your configuration.');
        setApiKeyValid(false);
      } else {
        setConnectionError(`Connection error: ${error.message}`);
      }
      setIsConnected(false);
      
      // Increment reconnect attempts
      reconnectAttemptsRef.current += 1;
    });
    
    socketRef.current.on('editorCount', (data: { count: number }) => {
      setEditorCount(data.count);
    });
    
    socketRef.current.on('resumeUpdated', (data: { data: ResumeData, timestamp: string }) => {
      console.log('Resume updated by another user:', data);
      setLastUpdateTime(new Date(data.timestamp));
      
      // Here you would handle updating the UI with the new data
      // For example, dispatch an update to your state management
      // This would be handled in the component using this hook
    });
    
    socketRef.current.on('cursorUpdated', ({ position, user, clientId }: { 
      position: CursorPosition, 
      user: UserPresence, 
      clientId: string 
    }) => {
      setActiveCursors(prev => {
        const newMap = new Map(prev);
        newMap.set(clientId, { position, user });
        return newMap;
      });
    });
    
    socketRef.current.on('selectionUpdated', ({ selection, user, clientId }: { 
      selection: TextSelection, 
      user: UserPresence, 
      clientId: string 
    }) => {
      setActiveSelections(prev => {
        const newMap = new Map(prev);
        newMap.set(clientId, { selection, user });
        return newMap;
      });
    });
    
    // Clean up
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [resumeId]);
  
  // Initialize connection on mount and when resumeId changes
  useEffect(() => {
    connect();
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [connect]);
  
  // Function to manually reconnect
  const reconnect = useCallback(() => {
    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      reconnectAttemptsRef.current = 0;
    }
    connect();
  }, [connect]);
  
  // Function to send resume updates
  const sendResumeUpdate = useCallback((data: ResumeData) => {
    if (!socketRef.current || !isConnected) {
      console.warn('Cannot send update: socket not connected');
      return;
    }
    
    const timestamp = new Date().toISOString();
    socketRef.current.emit('resumeUpdate', {
      resumeId,
      data,
      timestamp
    });
    
    setLastUpdateTime(new Date(timestamp));
  }, [resumeId, isConnected]);
  
  // Function to send cursor position updates
  const sendCursorUpdate = useCallback((position: CursorPosition) => {
    if (!socketRef.current || !isConnected) {
      return;
    }
    
    socketRef.current.emit('cursorUpdate', {
      resumeId,
      position,
      user: userPresence.current
    });
  }, [resumeId, isConnected]);
  
  // Function to send text selection updates
  const sendSelectionUpdate = useCallback((selection: TextSelection) => {
    if (!socketRef.current || !isConnected) {
      return;
    }
    
    socketRef.current.emit('selectionUpdate', {
      resumeId,
      selection,
      user: userPresence.current
    });
  }, [resumeId, isConnected]);
  
  return {
    isConnected,
    lastUpdateTime,
    editorCount,
    sendResumeUpdate,
    sendCursorUpdate,
    sendSelectionUpdate,
    activeCursors,
    activeSelections,
    connectionError,
    reconnect,
    apiKeyValid
  };
};

export default useSocketIo;