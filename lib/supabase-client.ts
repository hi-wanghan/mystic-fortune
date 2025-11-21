// 创建 lib/supabase-client.ts 文件
'use client';

import { createClient } from '@supabase/supabase-js';

// 单例模式创建 Supabase 客户端
let supabaseClient: ReturnType<typeof createClient> | null = null;

export const getSupabase = () => {
  if (!supabaseClient) {
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return supabaseClient;
};