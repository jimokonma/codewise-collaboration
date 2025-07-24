import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lazwjsdjeiwwyslzpelb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxhendqc2RqZWl3d3lzbHpwZWxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNDk4MjAsImV4cCI6MjA2ODgyNTgyMH0.60gPCPVHshuK3FNVW4m1HgPQkvMX7YkthKp4izlsLyo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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