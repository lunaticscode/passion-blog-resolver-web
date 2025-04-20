import { ChangeEvent, FC, useEffect, useMemo, useState } from "react";
import { pageCls } from "../consts/className";
import Accordion from "../components/Accordion";
import { CheckIcon } from "../components/icons";
import Loading from "../components/Loading";
import ConvertResultModal from "../components/convert/ConvertResultModal";
import { escapeRegExp } from "../utils/char";
import { api } from "../utils/api";
const filteredRegex =
  /(form\.naver\.com|네이버 폼 설문에 바로 참여해 보세요|blog\.naver\.com)/g;

type SentenceList = Record<string, Array<string>>;

interface ConvertSentencePageProps {
  mode?: "basic" | "multi";
}

const ConvertSentencePage2: FC<ConvertSentencePageProps> = ({
  mode = "basic",
}) => {
  const submitText = useMemo(
    () => (mode === "basic" ? "교체 결과 확인" : "문장 교체 + 구조 변경"),
    [mode]
  );
  const [article, setArticle] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [processedArticle, setProcessedArticle] = useState<string>("");
  const [sentenceList, setSentenceList] = useState<SentenceList | null>(null);
  const [targetSentenceList, setTargetSentenceList] = useState<string[] | null>(
    null
  );
  const [convertedDisplayText, setConvertedDisplayText] = useState<string>("");
  ("");
  const [convertedText, setConvertedText] = useState<string>("");
  const [replaceTextMap, setReplaceTextMap] = useState<Record<string, string>>(
    {}
  );
  const [resultModalOpen, setResultModalOpen] = useState<boolean>(false);

  // ======== //
  const [extractLoadingStatus, setExtractLoadingStatus] = useState<boolean[]>(
    []
  );
  const [recommandSentenceMap, setRecommandSentenceMap] = useState<
    Record<string, string[]>
  >({});

  const extractRecommandSentence = async (
    targetSentence: string,
    targetSentenceIndex: number
  ) => {
    setExtractLoadingStatus((prev) =>
      prev.map((status, idx) => (idx === targetSentenceIndex ? true : status))
    );
    try {
      const { data: reqResult } = await api.post("/keyword/extract", {
        type: "sentence",
        article: targetSentence,
      });

      setRecommandSentenceMap((prev) => ({
        ...prev,
        [targetSentence]: reqResult.data,
      }));
    } catch (err) {
      alert("(!) 추천 문장 추출 오류");
      console.error(err);
    } finally {
      setExtractLoadingStatus((prev) =>
        prev.map((status, idx) =>
          idx === targetSentenceIndex ? false : status
        )
      );
    }
  };

  const handleClickAnalysis = async () => {
    if (!article) return;
    try {
      setSentenceList(null);
      setConvertedText("");
      setConvertedDisplayText("");
      const sentenceList = article
        .split("\n")
        .map((sentence) =>
          sentence
            .trim()
            .replace(/\t/g, "")
            .replace(/\n/g, "")
            .replace(/\b/g, "")
        )
        .filter((v) => v.trim().length > 1);
      setTargetSentenceList(sentenceList);

      let _replaceTextMap: Record<string, string> = {};
      let _recommandSentenceMap: Record<string, string[]> = {};
      for (const srcText of sentenceList) {
        _replaceTextMap[srcText] = "";
        _recommandSentenceMap[srcText] = [];
      }

      setReplaceTextMap(_replaceTextMap);
      setRecommandSentenceMap(_recommandSentenceMap);
      setExtractLoadingStatus(
        Array.from({ length: sentenceList.length }, () => false)
      );

      return;
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };
  const handleChangeArticle = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setArticle(e.target.value.replace('"', "“").replace(filteredRegex, ""));
  };
  const hadnleClickProcessingArticle = async () => {
    if (mode === "multi") {
      if (isLoading) return;
      try {
        setIsLoading(true);
        setProcessedArticle("");
        const processedResult = await api.post("/keyword/processing-article", {
          article: convertedText,
          withStructure: true,
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
    } else {
      setResultModalOpen(true);
    }
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

    for (const targetText in replaceTextMap) {
      const replaceText = replaceTextMap[targetText] || targetText;

      const regex = new RegExp(escapeRegExp(targetText), "g");
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

  const handleClickRandomSelect = (targetSentence: string) => {
    const randomTargetList = recommandSentenceMap[targetSentence];

    if (!randomTargetList.length) return;
    const randomIndex = Math.floor(Math.random() * randomTargetList.length);
    setReplaceTextMap((prev) => ({
      ...prev,
      [targetSentence]: recommandSentenceMap[targetSentence][randomIndex],
    }));
  };

  const handleClickDeselect = (targetSentence: string) => {
    setReplaceTextMap((prev) => ({
      ...prev,
      [targetSentence]: "",
    }));
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
                  {submitText}
                </button>
              </div>
            </>
          )}
        </div>
        <div>
          <div className={"convert-sentence-list-wrapper"}>
            {targetSentenceList && targetSentenceList.length && (
              <Accordion>
                {targetSentenceList.map(
                  (targetSentence, targetSentenceIndex) => (
                    <div
                      className={`convert-sentence-wrapper`}
                      key={`convert-sentence-accordion-${targetSentenceIndex}`}
                    >
                      <Accordion.Button index={targetSentenceIndex}>
                        <div>
                          <div
                            style={{
                              display: "inline-block",
                              marginRight: "1px",
                              background: replaceTextMap[targetSentence]
                                ? "crimson"
                                : "silver",
                              color: "white",
                              borderRadius: "5px",
                              padding: "0px 5px",
                              fontSize: "13px",
                              verticalAlign: "top",
                              fontWeight: "bold",
                            }}
                          >
                            {targetSentenceIndex}
                          </div>{" "}
                          {targetSentence}
                        </div>
                      </Accordion.Button>
                      <Accordion.Pannel index={targetSentenceIndex}>
                        <div className={"convert-alt-sentence-list"}>
                          <button
                            disabled={extractLoadingStatus[targetSentenceIndex]}
                            onClick={() =>
                              extractRecommandSentence(
                                targetSentence,
                                targetSentenceIndex
                              )
                            }
                            style={{
                              backgroundColor: extractLoadingStatus[
                                targetSentenceIndex
                              ]
                                ? "silver"
                                : "rgb(93, 154, 211)",
                              padding: "5px 10px",
                              color: "white",
                              border: "none",
                              borderRadius: "5px",
                              boxShadow: "0px 0px 3px silver",
                              cursor: "pointer",
                            }}
                          >
                            {extractLoadingStatus[targetSentenceIndex]
                              ? "추출 중..."
                              : recommandSentenceMap &&
                                recommandSentenceMap[targetSentence]?.length
                              ? "재추출"
                              : "추천 문장 추출"}
                          </button>
                          {recommandSentenceMap &&
                          recommandSentenceMap[targetSentence]?.length ? (
                            <>
                              <button
                                onClick={() =>
                                  handleClickRandomSelect(targetSentence)
                                }
                                style={{
                                  backgroundColor: "black",
                                  marginLeft: "10px",
                                  cursor: "pointer",
                                  padding: "5px 10px",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "5px",
                                  boxShadow: "0px 0px 3px silver",
                                }}
                              >
                                랜덤 선택
                              </button>
                              <button
                                onClick={() =>
                                  handleClickDeselect(targetSentence)
                                }
                                style={{
                                  backgroundColor: "black",
                                  marginLeft: "10px",
                                  cursor: "pointer",
                                  padding: "5px 10px",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "5px",
                                  boxShadow: "0px 0px 3px silver",
                                }}
                              >
                                선택 해제
                              </button>
                              <div style={{ width: "100%", height: "15px" }} />
                            </>
                          ) : null}
                          {Object.keys(recommandSentenceMap).length &&
                            recommandSentenceMap[targetSentence]?.map(
                              (altSentence, altIndex) => (
                                <div
                                  className="convert-alt-sentence"
                                  onClick={() =>
                                    handleClickAltSentence(
                                      targetSentence,
                                      altSentence
                                    )
                                  }
                                  key={`alt-sentence-${targetSentenceIndex}-${altIndex}`}
                                >
                                  <div
                                    className={"convert-alt-sentence-checkbox"}
                                  >
                                    <CheckIcon
                                      width={24}
                                      className={
                                        replaceTextMap[targetSentence] ===
                                        altSentence
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
                  )
                )}
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
export default ConvertSentencePage2;
