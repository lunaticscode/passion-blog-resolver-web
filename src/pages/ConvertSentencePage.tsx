import { ChangeEvent, useEffect, useState } from "react";
import { pageCls } from "../consts/className";
import useExtractFromGPT from "../hooks/useExtractFromGPT";
import Accordion from "../components/Accordion";
import { CheckIcon } from "../components/icons";
import Loading from "../components/Loading";
import ConvertResultModal from "../components/convert/ConvertResultModal";
import { escapeRegExp } from "../utils/char";

type SentenceList = Record<string, Array<string>>;
const ConvertSentencePage = () => {
  const [article, setArticle] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [processedArticle, setProcessedArticle] = useState<string>("");
  const [sentenceList, setSentenceList] = useState<SentenceList | null>(null);
  const [convertedDisplayText, setConvertedDisplayText] = useState<string>("");
  ("");
  const [convertedText, setConvertedText] = useState<string>("");
  const [replaceTextMap, setReplaceTextMap] = useState<Record<string, string>>(
    {}
  );
  const [resultModalOpen, setResultModalOpen] = useState<boolean>(false);
  const { getExtractResult } = useExtractFromGPT();
  const handleClickAnalysis = async () => {
    if (!article) return;
    try {
      setSentenceList(null);
      setConvertedText("");
      setConvertedDisplayText("");
      const targetSentenceList = article
        .split(".")
        .map((sentence) =>
          sentence
            .trim()
            .replace(/\n/g, "")
            .replace(/\t/g, "")
            .replace(/\b/g, "")
        )
        .filter((v) => v);
      setIsLoading(true);
      const extractResult = await Promise.all(
        targetSentenceList.map(async (ts) => [
          ts,
          await getExtractResult("sentence", ts),
        ])
      );

      setConvertedText(article);
      setProcessedArticle(article);
      setConvertedDisplayText(article);
      const resultMap = extractResult.reduce((acc, cur) => {
        acc[cur[0]] = cur[1];
        return acc;
      }, {} as Record<string, Array<string>>);
      // console.log(resultMap);
      setSentenceList(resultMap);

      if (resultMap && Object.keys(resultMap).length) {
        let _replaceTextMap: Record<string, string> = {};
        for (const srcText in resultMap) {
          _replaceTextMap[srcText] = "";
        }
        setReplaceTextMap(_replaceTextMap);
      }
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };
  const handleChangeArticle = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setArticle(e.target.value.replace('"', "“"));
  };
  const hadnleClickProcessingArticle = () => {
    setResultModalOpen(true);
  };
  const handleClickAltSentence = (srcText: string, altText: string) => {
    setReplaceTextMap((prev) => ({
      ...prev,
      [srcText]: prev[srcText] === altText ? "" : altText,
    }));
  };

  const onChangeSrcArticle = () => {
    let replacedArticle = article || "";
    let replacedDisplayArticle = article || "";
    // console.log("article", article);
    for (const targetText in replaceTextMap) {
      const replaceText = replaceTextMap[targetText] || targetText;

      const regex = new RegExp(escapeRegExp(targetText), "g");
      // console.log(regex, targetText);
      // console.log(regex.test(targetText));
      replacedArticle = replacedArticle.replace(regex, replaceText);

      replacedDisplayArticle = replacedDisplayArticle.replace(
        regex,
        Object.keys(replaceTextMap).includes(replaceText)
          ? replaceText
          : `<span style="color: crimson; font-weight: bold;"><div style="display: inline-block; vertical-align: top; border-radius: 5px; padding: 1px 5px; margin-right: 1px; font-size:11px; background: crimson; color: white;">${Object.keys(
              replaceTextMap
            ).indexOf(targetText)}</div>${replaceText}</span>`
      );
      replacedDisplayArticle = replacedDisplayArticle.replace(/\n/g, "<br/>");
    }
    setConvertedText(replacedArticle);
    setProcessedArticle(replacedArticle);
    setConvertedDisplayText(replacedDisplayArticle);
  };

  const handleClickSelectRandomSentenceList = () => {
    if (!sentenceList || !Object.keys(sentenceList).length) return;
    // batch update 확인
    for (const srcSentence in sentenceList) {
      const randomIndex = Math.floor(
        Math.random() * sentenceList[srcSentence].length
      );

      setReplaceTextMap((prev) => ({
        ...prev,
        [srcSentence]: sentenceList[srcSentence][randomIndex],
      }));
    }
  };

  const handleClickInitialSelected = () => {
    if (!sentenceList || !Object.keys(sentenceList).length) return;
    for (const srcSentence in sentenceList) {
      setReplaceTextMap((prev) => ({ ...prev, [srcSentence]: "" }));
    }
  };

  useEffect(() => {
    if (replaceTextMap && Object.keys(replaceTextMap).length) {
      onChangeSrcArticle();
    }
  }, [replaceTextMap]);
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
              문장 분석
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
        <div>
          <div className={"convert-sentence-list-wrapper"}>
            {sentenceList && (
              <Accordion>
                {Object.keys(sentenceList).map((srcSentence, srcIndex) => (
                  <div
                    className={`convert-sentence-wrapper`}
                    key={`convert-sentence-accordion-${srcIndex}`}
                  >
                    <Accordion.Button index={srcIndex}>
                      <div>
                        <div
                          style={{
                            display: "inline-block",
                            marginRight: "1px",
                            background: "crimson",
                            color: "white",
                            borderRadius: "5px",
                            padding: "0px 5px",
                            fontSize: "13px",
                            verticalAlign: "top",
                            fontWeight: "bold",
                          }}
                        >
                          {srcIndex}
                        </div>{" "}
                        {srcSentence}
                      </div>
                    </Accordion.Button>
                    <Accordion.Pannel index={srcIndex}>
                      <div className={"convert-alt-sentence-list"}>
                        {sentenceList[srcSentence].map(
                          (altSentence, altIndex) => (
                            <div
                              className="convert-alt-sentence"
                              onClick={() =>
                                handleClickAltSentence(srcSentence, altSentence)
                              }
                              key={`alt-sentence-${srcIndex}-${altIndex}`}
                            >
                              <div className={"convert-alt-sentence-checkbox"}>
                                <CheckIcon
                                  width={24}
                                  className={
                                    replaceTextMap[srcSentence] === altSentence
                                      ? "checked"
                                      : ""
                                  }
                                />
                              </div>
                              <div className={"convert-alt-sentence-text"}>
                                {altSentence}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </Accordion.Pannel>
                  </div>
                ))}
              </Accordion>
            )}
          </div>
          {sentenceList && (
            <div className={"convert-sentence-action-buttons-wrapper"}>
              <button onClick={handleClickSelectRandomSentenceList}>
                랜덤 문장 선택
              </button>
              <button onClick={handleClickInitialSelected}>
                문장 선택 해제
              </button>
            </div>
          )}
        </div>
      </div>
      <Loading isLoading={isLoading} />
      <ConvertResultModal
        result={processedArticle}
        open={resultModalOpen}
        onClose={() => setResultModalOpen(false)}
      />
    </div>
  );
};
export default ConvertSentencePage;
