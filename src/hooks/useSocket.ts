import { useEffect, useRef, useState, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { supabase, CollaborationEvent, SessionUser } from '@/lib/supabase';

interface UseSocketProps {
  sessionId: string;
  onCodeChange?: (code: string, language: string, userId: string) => void;
  onUserCountChange?: (count: number) => void;
  onCursorMove?: (userId: string, position: { line: number; column: number }, userName: string) => void;
}

export const useSocket = ({ sessionId, onCodeChange, onUserCountChange, onCursorMove }: UseSocketProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState(1);
  const [currentUserId] = useState(() => nanoid(8));
  const [userName] = useState(() => `User${Math.floor(Math.random() * 1000)}`);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    const initializeSession = async () => {
      try {
        // Join session as a user
        const { error } = await supabase
          .from('session_users')
          .upsert({
            session_id: sessionId,
            user_id: currentUserId,
            user_name: userName,
            active_file: 'html',
            last_seen: new Date().toISOString()
          });

        if (error) console.log('Error joining session:', error);

        // Subscribe to collaboration events
        channelRef.current = supabase
          .channel(`session:${sessionId}`)
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'collaboration_events',
            filter: `session_id=eq.${sessionId}`
          }, (payload) => {
            const event = payload.new as CollaborationEvent;
            if (event.user_id === currentUserId) return; // Ignore own events

            switch (event.event_type) {
              case 'code_change':
                onCodeChange?.(event.data.code, event.data.language, event.user_id);
                break;
              case 'cursor_move':
                onCursorMove?.(event.user_id, event.data.position, event.data.userName);
                break;
            }
          })
          .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'session_users',
            filter: `session_id=eq.${sessionId}`
          }, async () => {
            // Update user count when users join/leave
            const { data } = await supabase
              .from('session_users')
              .select('*')
              .eq('session_id', sessionId)
              .gte('last_seen', new Date(Date.now() - 30000).toISOString()); // Active in last 30 seconds
            
            if (mounted) {
              setConnectedUsers(data?.length || 1);
              onUserCountChange?.(data?.length || 1);
            }
          })
          .subscribe();

        if (mounted) {
          setIsConnected(true);
        }

        // Keep-alive ping
        const keepAlive = setInterval(async () => {
          if (mounted) {
            await supabase
              .from('session_users')
              .update({ last_seen: new Date().toISOString() })
              .eq('session_id', sessionId)
              .eq('user_id', currentUserId);
          }
        }, 10000);

        return () => {
          clearInterval(keepAlive);
        };
      } catch (error) {
        console.error('Error initializing session:', error);
      }
    };

    initializeSession();

    return () => {
      mounted = false;
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  }, [sessionId, currentUserId, userName, onCodeChange, onUserCountChange, onCursorMove]);

  const emitCodeChange = useCallback(async (code: string, language: string) => {
    try {
      await supabase
        .from('collaboration_events')
        .insert({
          session_id: sessionId,
          user_id: currentUserId,
          event_type: 'code_change',
          data: { code, language }
        });
    } catch (error) {
      console.error('Error emitting code change:', error);
    }
  }, [sessionId, currentUserId]);

  const emitCursorMove = useCallback(async (position: { line: number; column: number }) => {
    try {
      await supabase
        .from('collaboration_events')
        .insert({
          session_id: sessionId,
          user_id: currentUserId,
          event_type: 'cursor_move',
          data: { position, userName }
        });
    } catch (error) {
      console.error('Error emitting cursor move:', error);
    }
  }, [sessionId, currentUserId, userName]);

  return {
    isConnected,
    connectedUsers,
    currentUserId,
    userName,
    emitCodeChange,
    emitCursorMove,
  };
};