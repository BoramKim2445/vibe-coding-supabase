import { createClient } from '@supabase/supabase-js';

// Supabase 프로젝트 URL과 ANON 키
// 실제 환경에서는 환경 변수로 관리해야 합니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

