import { ChangeEvent, useEffect, useState } from "react";
import { pageCls } from "../consts/className";
import { api } from "../utils/api";
import axios from "axios";
import ConvertResultModal from "../components/convert/ConvertResultModal";
import Loading from "../components/Loading";
import { addStopCharFromPerSentence, filteredTextarea } from "../utils/char";
// const LOCALSTORAGE_KEYS = {
//   ARTICLE: "keyword-page-article",
//   KEYWORDS: "keyword-page-replace-keywords",
//   REPLACE_TEXTMAP: "keyword-page-replace-textmap",
//   CONVERTED_TEXT: "keyword-page-converted-text",
//   CONVERTED_DISPLAY_ARTICLE: "keyword-page-converted-display-text",
// };

const ConvertPage = () => {
  const [keywords, setKeywords] = useState<Record<string, string[]> | null>(
    null
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [article, setArticle] = useState<string>("");
  const [convertedText, setConvertedText] = useState<string>("");
  const [convertedDisplayText, setConvertedDisplayText] = useState<string>("");
  const [replaceTextMap, setReplaceTextMap] = useState<Record<string, string>>(
    {}
  );
  const [resultModalOpen, setResultModalOpen] = useState<boolean>(false);
  const [processedArticle, setProcessedArticle] = useState<string>("");

  const handleClickAnalysis = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      setKeywords(null);
      setReplaceTextMap({});
      setConvertedText("");
      setConvertedDisplayText("");
      const reqResult = await api.post("/keyword/extract", {
        article,
        type: "keyword",
      });
      const { isError, data } = reqResult.data;
      if (isError) {
        alert("API 호출 에러, 관리자에게 문의해주세요.");
        return;
      }
      const replaceTargetTextMap: Record<string, string> = {};
      const srcKeywords = Object.keys(data);
      srcKeywords.forEach((keyword) => (replaceTargetTextMap[keyword] = ""));
      setKeywords(data);
      setConvertedText(article || "");
      setConvertedDisplayText(article || "");
    } catch (err) {
      console.log(err);
      alert("알수 없는 에러, 관리자에게 문의해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeArticle = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const filteredText = addStopCharFromPerSentence(
      filteredTextarea(e.target.value)
    );
    setArticle(filteredText);
  };

  const handleClickAltKeyword = (
    srcKeyword: string,
    replaceKeyword: string
  ) => {
    if (replaceTextMap[srcKeyword]) {
      if (replaceTextMap[srcKeyword] === replaceKeyword) {
        setReplaceTextMap((prev) => ({ ...prev, [srcKeyword]: "" }));
        return;
      }
      setReplaceTextMap((prev) => ({ ...prev, [srcKeyword]: replaceKeyword }));
      return;
    }
    setReplaceTextMap((prev) => ({ ...prev, [srcKeyword]: replaceKeyword }));
  };

  const onChangeReplaceKeyword = () => {
    let replacedArticle = article || "";
    let replacedDisplayArticle = article || "";
    for (const targetText in replaceTextMap) {
      const replaceText = replaceTextMap[targetText] || targetText;
      const regex = new RegExp(targetText, "g");
      replacedArticle = replacedArticle.replace(regex, replaceText);

      replacedDisplayArticle = replacedDisplayArticle.replace(
        regex,
        Object.keys(replaceTextMap).includes(replaceText)
          ? replaceText
          : `<span style="color: rgb(93, 154, 211); font-weight: bold;">${replaceText}</span>`
      );
      replacedDisplayArticle = replacedDisplayArticle.replace(/\n/g, "<br/>");
    }
    setConvertedText(replacedArticle);
    setConvertedDisplayText(replacedDisplayArticle);
  };

  useEffect(() => {
    if (convertedText && Object.values(replaceTextMap).length) {
      onChangeReplaceKeyword();
    }
  }, [replaceTextMap]);

  const handleClickRandomKeyword = () => {
    if (!keywords || !Object.keys(keywords).length) return;
    for (const srcKeyword in keywords) {
      const randomIndex = Math.floor(
        Math.random() * keywords[srcKeyword].length
      );

      setReplaceTextMap((prev) => ({
        ...prev,
        [srcKeyword]: keywords[srcKeyword][randomIndex],
      }));
    }
  };
  const handleClickResetKeyword = () => {
    if (!keywords || !Object.keys(keywords).length) return;
    for (const srcKeyword in keywords) {
      setReplaceTextMap((prev) => ({ ...prev, [srcKeyword]: "" }));
    }
  };

  const hadnleClickProcessingArticle = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      setProcessedArticle("");
      const processedResult = await axios.post("/keyword/processing-article", {
        article: convertedText,
      });
      const { isError, data } = processedResult.data;
      if (isError) {
        alert("API 호출 에러, 관리자에게 문의해주세요.");
        return;
      }
      setProcessedArticle(data);
      setResultModalOpen(true);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setResultModalOpen(false);
  };

  // useEffect(() => {
  //   // localStorage.setItem(LOCALSTORAGE_KEYS.KEYWORDS, article || "");
  //   // localStorage.setItem(LOCALSTORAGE_KEYS.CONVERTED_TEXT, convertedText || "");
  //   // if (keywords && Object.keys(keywords).length) {
  //   //   localStorage.setItem(
  //   //     "keyword-page-replace-keywords",
  //   //     JSON.stringify(keywords)
  //   //   );
  //   // }
  //   // if (replaceTextMap && Object.keys(replaceTextMap).length) {
  //   //   localStorage.setItem(
  //   //     LOCALSTORAGE_KEYS.REPLACE_TEXTMAP,
  //   //     JSON.stringify(replaceTextMap)
  //   //   );
  //   // }
  //   // localStorage.setItem(
  //   //   LOCALSTORAGE_KEYS.CONVERTED_DISPLAY_ARTICLE,
  //   //   convertedDisplayText || ""
  //   // );
  // }, [keywords, replaceTextMap, convertedDisplayText, article, convertedText]);

  return (
    <div className={pageCls}>
      <div className={`convert-${pageCls}-wrapper`}>
        <div className={"convert-target-textarea"}>
          <div className={"convert-textarea-wrapper"}>
            <textarea
              value={article}
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
        <div className={"convert-keyword-setting"}>
          {isLoading && <h3>데이터를 불러오는 중....</h3>}
          {keywords && (
            <>
              {Object.keys(keywords).map((leftKeyword, index) => (
                <div
                  className={"extract-result-wrapper"}
                  key={`extract-result-${index}`}
                >
                  <div className={"extract-result-src-keyword"}>
                    {leftKeyword}
                  </div>
                  <div className={`extract-result-alt-keywords`}>
                    {keywords[leftKeyword].map((altKeyword, altIndex) => (
                      <div
                        className={"extract-result-alt-keyword"}
                        data-active={replaceTextMap[leftKeyword] === altKeyword}
                        onClick={() =>
                          handleClickAltKeyword(leftKeyword, altKeyword)
                        }
                        key={`extract-result-alt-keyword-${index}-${altIndex}`}
                      >
                        {altKeyword}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="extract-result-action-buttons-wrapper">
                <button
                  onClick={handleClickRandomKeyword}
                  className="extract-result-select-random-keyword-button"
                >
                  랜덤 키워드 선택
                </button>
                <button
                  onClick={handleClickResetKeyword}
                  className="extract-result-select-random-keyword-button"
                >
                  키워드 선택 해제
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <ConvertResultModal
        open={resultModalOpen}
        onClose={handleCloseModal}
        result={processedArticle}
      />
      <Loading isLoading={isLoading} />
    </div>
  );
};
export default ConvertPage;
