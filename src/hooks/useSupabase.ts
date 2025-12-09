import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export function useSupabase() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading, supabase };
}

/**
 * Hook para realizar queries no Supabase
 */
export function useSupabaseQuery<T>(
  table: string,
  query?: (builder: any) => any
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        let builder = supabase.from(table).select('*');
        
        if (query) {
          builder = query(builder);
        }

        const { data: result, error: queryError } = await builder;

        if (queryError) throw queryError;

        setData(result || []);
        setError(null);
      } catch (err) {
        setError(err as Error);
        console.error('Supabase query error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [table]);

  return { data, loading, error };
}
