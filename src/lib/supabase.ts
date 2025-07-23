import { createClient } from '@supabase/supabase-js';

// For demo purposes, using a public Supabase instance
// In production, you'd use your own Supabase project
const supabaseUrl = 'https://demo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

// For a real app, you'd set up your own Supabase project with these environment variables:
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface CollaborationEvent {
  id?: string;
  session_id: string;
  user_id: string;
  event_type: 'code_change' | 'cursor_move' | 'user_join' | 'user_leave';
  data: any;
  created_at?: string;
}

export interface SessionUser {
  id?: string;
  session_id: string;
  user_id: string;
  user_name: string;
  cursor_position?: { line: number; column: number };
  active_file: string;
  last_seen?: string;
}