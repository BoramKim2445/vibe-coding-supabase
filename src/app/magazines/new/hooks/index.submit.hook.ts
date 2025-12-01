import { supabase } from "@/lib/supabase";

/**
 * Magazine 등록 데이터 타입
 */
interface MagazineSubmitData {
  imageFile: File | null;
  category: string;
  title: string;
  description: string;
  content: string;
  tags: string[] | null;
}

/**
 * Magazine 등록 결과 타입
 */
interface SubmitResult {
  success: boolean;
  id?: number;
  error?: string;
}

/**
 * Magazine 등록 Hook
 *
 * @returns submitMagazine 함수
 */
export const useSubmitMagazine = () => {
  /**
   * Magazine 데이터를 Supabase에 등록합니다.
   *
   * @param data - 등록할 Magazine 데이터
   * @returns 등록 결과 (성공 여부, ID, 에러 메시지)
   */
  const submitMagazine = async (data: MagazineSubmitData): Promise<SubmitResult> => {
    try {
      let imageUrl: string | null = null;

      // 1. 이미지 파일이 있는 경우 Supabase Storage에 업로드
      if (data.imageFile) {
        // 1-1. 날짜별 경로 생성 (yyyy/mm/dd)
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const datePath = `${year}/${month}/${day}`;

        // 1-2. UUID 생성
        const uuid = crypto.randomUUID();

        // 1-3. 파일명 생성 (yyyy/mm/dd/{UUID}.jpg)
        const fileName = `${datePath}/${uuid}.jpg`;

        // 1-4. Supabase Storage에 업로드
        const { error: uploadError } = await supabase.storage.from("vibe-condig-supabse-storage").upload(fileName, data.imageFile, {
          contentType: data.imageFile.type,
          upsert: false,
        });

        if (uploadError) {
          console.error("이미지 업로드 실패:", uploadError);
          return {
            success: false,
            error: `이미지 업로드 실패: ${uploadError.message}`,
          };
        }

        // 1-5. 업로드된 이미지의 public URL 가져오기
        const {
          data: { publicUrl },
        } = supabase.storage.from("vibe-condig-supabse-storage").getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      // 2. Supabase magazine 테이블에 데이터 삽입
      const { data: insertedData, error } = await supabase
        .from("magazine")
        .insert([
          {
            image_url: imageUrl,
            category: data.category,
            title: data.title,
            description: data.description,
            content: data.content,
            tags: data.tags,
          },
        ])
        .select("id")
        .single();

      // 3. 에러 처리
      if (error) {
        console.error("Magazine 등록 실패:", error);
        return {
          success: false,
          error: error.message,
        };
      }

      // 4. 등록 성공
      if (insertedData && insertedData.id) {
        return {
          success: true,
          id: insertedData.id,
        };
      }

      // 5. 예상치 못한 경우
      return {
        success: false,
        error: "등록 결과를 확인할 수 없습니다.",
      };
    } catch (error) {
      console.error("Magazine 등록 중 예외 발생:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
      };
    }
  };

  return { submitMagazine };
};
