import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

/**
 * Magazine 상세 데이터 타입
 */
export interface MagazineDetailData {
  id: string;
  image_url: string;
  category: string;
  title: string;
  description: string;
  content: string;
  tags: string[] | null;
}

/**
 * Hook 반환 타입
 */
interface UseMagazineDetailReturn {
  magazine: MagazineDetailData | null;
  loading: boolean;
  error: string | null;
}

/**
 * Magazine 상세 조회 Hook
 * 
 * @param id - 조회할 Magazine의 UUID
 * @returns magazine 데이터, 로딩 상태, 에러 메시지
 */
export const useMagazineDetail = (id: string): UseMagazineDetailReturn => {
  const [magazine, setMagazine] = useState<MagazineDetailData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Supabase에서 Magazine 데이터를 조회합니다.
     */
    const fetchMagazine = async () => {
      try {
        // 1. 로딩 시작
        setLoading(true);
        setError(null);

        // 2. Supabase magazine 테이블에서 id와 일치하는 데이터 조회
        const { data, error: fetchError } = await supabase
          .from("magazine")
          .select("id, image_url, category, title, description, content, tags")
          .eq("id", id)
          .single();

        // 3. 에러 처리
        if (fetchError) {
          console.error("Magazine 조회 실패:", fetchError);
          setError(fetchError.message);
          setMagazine(null);
          return;
        }

        // 4. 데이터가 없는 경우
        if (!data) {
          setError("해당 Magazine을 찾을 수 없습니다.");
          setMagazine(null);
          return;
        }

        // 5. 조회 성공 - 데이터 설정
        setMagazine({
          id: data.id,
          image_url: data.image_url,
          category: data.category,
          title: data.title,
          description: data.description,
          content: data.content,
          tags: data.tags,
        });
      } catch (error) {
        console.error("Magazine 조회 중 예외 발생:", error);
        setError(error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.");
        setMagazine(null);
      } finally {
        // 6. 로딩 종료
        setLoading(false);
      }
    };

    // ID가 유효한 경우에만 조회
    if (id) {
      fetchMagazine();
    } else {
      setError("유효하지 않은 Magazine ID입니다.");
      setLoading(false);
    }
  }, [id]); // id가 변경될 때마다 재조회

  return { magazine, loading, error };
};

