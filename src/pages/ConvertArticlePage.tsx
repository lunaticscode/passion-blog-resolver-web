import { useState } from "react";
import { pageCls } from "../consts/className";

const ConvertArticlePage = () => {
  const [convertedDisplayText, setConvertedDisplayText] = useState<string>("");
  ("");
  const [convertedText, setConvertedText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClickAnalysis = () => {};
  const handleChangeArticle = () => {};
  const hadnleClickProcessingArticle = () => {};
  return (
    <div className={pageCls}>
      <div className={`convert-${pageCls}-wrapper`}>
        <div className={"convert-target-textarea"}>
          <div className={"convert-textarea-wrapper"}>
            <textarea
              className={"convert-textarea"}
              onChange={handleChangeArticle}
            />
          </div>
          <div className={"conver-target-submit-button-wrapper"}>
            <button
              onClick={handleClickAnalysis}
              disabled={isLoading}
              className={"convert-target-submit-button"}
            >
              키워드 분석
            </button>
          </div>
          {convertedText && (
            <>
              <div
                className={"convert-result-wrapper"}
                dangerouslySetInnerHTML={{ __html: convertedDisplayText }}
              />
              <div className={"convert-result-processing-button-wrapper"}>
                <button
                  className={"convert-result-processing-button"}
                  disabled={isLoading}
                  onClick={hadnleClickProcessingArticle}
                >
                  변환된 키워드에 맞는 조사 생성
                </button>
              </div>
            </>
          )}
        </div>
        <div></div>
      </div>
    </div>
  );
};
export default ConvertArticlePage;
