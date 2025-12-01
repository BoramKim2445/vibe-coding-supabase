'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

// Magazine 데이터 타입 정의
export interface MagazineItem {
  id: string;
  image_url: string;
  category: string;
  title: string;
  description: string;
  tags: string[] | null;
}

// Hook의 반환 타입
interface UseMagazinesResult {
  magazines: MagazineItem[];
  loading: boolean;
  error: string | null;
}

/**
 * Supabase에서 매거진 데이터를 조회하는 커스텀 Hook
 * @returns {UseMagazinesResult} magazines 배열, 로딩 상태, 에러 상태
 */
export function useMagazines(): UseMagazinesResult {
  const [magazines, setMagazines] = useState<MagazineItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMagazines() {
      try {
        setLoading(true);
        setError(null);

        // Supabase에서 magazine 테이블 조회
        const { data, error: fetchError } = await supabase
          .from('magazine')
          .select('id, image_url, category, title, description, tags')
          .limit(10);

        if (fetchError) {
          throw fetchError;
        }

        // 데이터를 상태에 저장
        setMagazines(data || []);
      } catch (err) {
        console.error('매거진 데이터 조회 실패:', err);
        setError(err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    }

    fetchMagazines();
  }, []);

  return { magazines, loading, error };
}

