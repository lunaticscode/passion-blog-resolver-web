import { useState } from "react";
import { api } from "../utils/api";
export type ExtractType = "keyword" | "sentence" | "article" | "keyword2";
const useExtractFromGPT = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getExtractResult = async (type: ExtractType, article: string) => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const reqResult = await api.post("/keyword/extract", { type, article });
      const { isError, data } = reqResult.data;
      if (isError) {
        alert("API 호출 에러, 관리자에게 문의해주세요.");
        return;
      }
      return data;
    } catch (err) {
      console.log(err);
      alert("알수 없는 에러, 관리자에게 문의해주세요.");
    } finally {
      setIsLoading(false);
    }
  };
  return { isLoading, getExtractResult };
};
export default useExtractFromGPT;
