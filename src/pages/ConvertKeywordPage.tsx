import { ChangeEvent, FC, Fragment, useEffect, useMemo, useState } from "react";
import { pageCls } from "../consts/className";
import { api } from "../utils/api";
import Accordion from "../components/Accordion";
import axios from "axios";
import ConvertResultModal from "../components/convert/ConvertResultModal";
import Loading from "../components/Loading";

const filteredRegex =
  /(form\.naver\.com|네이버 폼 설문에 바로 참여해 보세요|blog\.naver\.com)/g;

interface ConvertKeywordPageProps {
  mode?: "basic" | "multi";
}
const ConvertKeywordPage: FC<ConvertKeywordPageProps> = ({
  mode = "basic",
}) => {
  const submitText = useMemo(
    () =>
      mode === "basic"
        ? "변환된 키워드에 맞는 조사 생성"
        : "조사 재적용 + 구조 변경",
    [mode]
  );
  const [convertTargetText, setConvertTargetText] = useState<string>("");
  const [convertTargetSentenceList, setConvertTargetSentenceList] = useState<
    string[]
  >([]);
  const [replaceMap, setReplaceMap] = useState<
    Record<number, Record<string, string[]> | null>
  >({});
  const [replacedMap, setReplacedMap] = useState<Record<string, string>>({}); // {"0-1", "replaced-string"}
  const [replacedStatusMap, setReplacedStatusMap] = useState<
    Record<number, string[]>
  >({}); // { "word in sentence": ["replacing-word-1", "replacing-word-2"] }
  const [extractLoadingStatus, setExtractLoadingStatus] = useState<
    Record<number, boolean>
  >({});
  // const [convertedDisplayText, _setConvertedDisplayText] = useState<string>("");
  // ("");
  const [processedArticle, setProcessedArticle] = useState<string>("");
  const [resultModalOpen, setResultModalOpen] = useState<boolean>(false);
  const [convertedText, setConvertedText] = useState<string>("");
  const [convertedTextForDisplay, setConvertedTextForDisplay] =
    useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClickExtractWords = async (replaceMapIndex: number) => {
    try {
      setExtractLoadingStatus((prev) => ({ ...prev, [replaceMapIndex]: true }));
      const reqResult = await api.post("/keyword/extract", {
        type: "keyword2",
        article: convertTargetSentenceList[replaceMapIndex],
      });
      const { isError, data } = reqResult.data;
      if (isError) {
        alert("API 호출 에러, 관리자에게 문의해주세요.");
        return;
      }
      setExtractLoadingStatus((prev) => ({
        ...prev,
        [replaceMapIndex]: false,
      }));
      setReplaceMap((prev) => ({ ...prev, [replaceMapIndex]: data }));

      // replacedMap init only target word
      if (data && Object.keys(data).length) {
        const initReplacedMap: Record<string, string> = {};
        Object.keys(data).forEach((_, index) => {
          initReplacedMap[`${replaceMapIndex}-${index}`] = "";
        });
        setReplacedMap((prev) => ({ ...prev, ...initReplacedMap }));
      }
    } catch (err) {}
  };

  const handleClickAnalysis = async () => {
    if (!convertTargetText) return;
    const sentenceList = convertTargetText
      .split("\n")
      .filter((line) => line.trim() && line.trim() !== "." && line.length > 1);

    for (let i = 0; i < sentenceList.length; i++) {
      setReplaceMap((prev) => ({ ...prev, [i]: null }));
      setExtractLoadingStatus((prev) => ({ ...prev, [i]: false }));
      setReplacedStatusMap((prev) => ({ ...prev, [i]: [] }));
    }
    setConvertTargetSentenceList(sentenceList);
  };
  const handleChangeArticle = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value || "";
    const filteredText = text
      .replace(filteredRegex, "")
      .split("\n")
      .map((line) => line.trim())
      .filter((lineStr) => lineStr !== ".")
      .join("\n");
    setConvertTargetText(filteredText);
  };

  const hadnleClickProcessingArticle = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      setProcessedArticle("");
      const processedResult = await api.post("/keyword/processing-article", {
        article: convertedText,
        withStructure: mode === "basic" ? false : true,
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

  const handleClickReplaceTargetWord = (
    replaceTargetKey: string,
    replaceTargetWord: string
  ) => {
    const isExistInTargetKey =
      replacedMap[replaceTargetKey] === replaceTargetWord;
    setReplacedMap((prev) => ({
      ...prev,
      [replaceTargetKey]: isExistInTargetKey ? "" : replaceTargetWord,
    }));
    const sentenceIndex = Number(replaceTargetKey.split("-")[0]);
    setReplacedStatusMap((prev) => ({
      ...prev,
      [sentenceIndex]: isExistInTargetKey
        ? prev[sentenceIndex].filter(
            (prevWord) => prevWord !== replaceTargetWord
          )
        : [...prev[sentenceIndex], replaceTargetWord],
    }));
  };

  const handleClickActionForUnitSentence = (
    sentenceIndex: number,
    action: "random" | "remove"
  ) => {
    const targetReplaceWordMap = replaceMap[sentenceIndex];
    if (!targetReplaceWordMap || !Object.keys(targetReplaceWordMap).length)
      return;

    if (action === "random") {
      const randomReplaceWordMap: Record<string, string> = {};
      Object.keys(targetReplaceWordMap).forEach((_, targetWordIndex) => {
        const key = `${sentenceIndex}-${targetWordIndex}`;
        const randomTargetWords =
          Object.values(targetReplaceWordMap)[targetWordIndex];
        const randomIndex = Math.floor(
          Math.random() * randomTargetWords.length
        );
        randomReplaceWordMap[key] = randomTargetWords[randomIndex];
      });
      setReplacedMap((prev) => ({ ...prev, ...randomReplaceWordMap }));
      setReplacedStatusMap((prev) => ({
        ...prev,
        [sentenceIndex]: Object.values(randomReplaceWordMap),
      }));
    }
    if (action === "remove") {
      const removedReplaceWordMap: Record<string, string> = {};
      Object.keys(targetReplaceWordMap).forEach((_, targetWordIndex) => {
        removedReplaceWordMap[`${sentenceIndex}-${targetWordIndex}`] = "";
      });
      setReplacedMap((prev) => ({ ...prev, ...removedReplaceWordMap }));
      setReplacedStatusMap((prev) => ({ ...prev, [sentenceIndex]: [] }));
    }
  };

  const renderConvertedText = () => {
    // if (!Object.values(replacedStatusMap).flat().length) return;

    const convertedSentenceList: string[] = [];
    const convertedSentenceListForDisplay: string[] = [];
    Object.keys(replacedStatusMap).forEach((sentenceIndex) => {
      // if (sentenceIndex === "0" || sentenceIndex === "1") {
      const originSentence = convertTargetSentenceList[Number(sentenceIndex)];
      const originWords = Object.keys(replaceMap[Number(sentenceIndex)] || {});
      let replacedSentence = originSentence;
      let replacedSentenceForDisplay = `<div style="display: inline-block; font-size:12px; margin-right:3px; color: white; background-color: crimson; padding: 3px 5px; font-weight: bold;">${sentenceIndex}</div>${originSentence}`;
      originWords.forEach((originWord, originWordIndex) => {
        // submit용
        replacedSentence = replacedSentence.replace(
          originWord,
          replacedMap[`${sentenceIndex}-${originWordIndex}`] || originWord
        );

        // display용
        replacedSentenceForDisplay = replacedSentenceForDisplay.replace(
          originWord,
          replacedMap[`${sentenceIndex}-${originWordIndex}`]
            ? `<span style="color: crimson;">${
                replacedMap[`${sentenceIndex}-${originWordIndex}`]
              }</span>`
            : originWord
        );
      });

      convertedSentenceList.push(replacedSentence);
      convertedSentenceListForDisplay.push(replacedSentenceForDisplay);
      // }
    });
    setConvertedText(convertedSentenceList.join("\n"));
    setConvertedTextForDisplay(
      convertedSentenceListForDisplay.join("<br/><br/>")
    );
  };

  const handleCloseModal = () => {
    setResultModalOpen(false);
  };

  useEffect(() => {
    // if (Object.keys(replacedStatusMap).length)
    renderConvertedText();
  }, [replacedStatusMap]);

  return (
    <div className={pageCls}>
      <div className={`convert-${pageCls}-wrapper`}>
        <div className={"convert-target-textarea"}>
          <div className={"convert-textarea-wrapper"}>
            <textarea
              className={"convert-textarea"}
              onChange={handleChangeArticle}
              value={convertTargetText}
            />
          </div>
          <div className={"conver-target-submit-button-wrapper"}>
            <button
              onClick={handleClickAnalysis}
              disabled={isLoading}
              className={"convert-target-submit-button"}
            >
              문장 추출
            </button>
          </div>
          {convertedText && (
            <>
              <div
                className={"convert-result-wrapper"}
                dangerouslySetInnerHTML={{ __html: convertedTextForDisplay }}
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
        <div style={{ height: "calc(100vh - 90px)", overflow: "auto" }}>
          <Accordion>
            {convertTargetSentenceList.map((sentence, index) => (
              <Fragment key={`sentence-key-${index}`}>
                <Accordion.Button index={index}>
                  <div style={{ cursor: "pointer" }}>
                    <div
                      style={{
                        display: "inline-block",
                        marginRight: "1px",
                        background: replacedStatusMap[index].length
                          ? "crimson"
                          : "silver",
                        color: "white",
                        borderRadius: "5px",
                        padding: "1px 5px",
                        fontSize: "13px",
                        verticalAlign: "top",
                        fontWeight: "bold",
                      }}
                    >
                      {index}
                    </div>{" "}
                    <span
                      style={{
                        fontWeight: replacedStatusMap[index].length
                          ? "bold"
                          : "normal",
                      }}
                    >
                      {sentence}
                    </span>
                  </div>
                </Accordion.Button>
                <Accordion.Pannel index={index}>
                  <div>
                    {replaceMap[index] ? (
                      <div>
                        <button
                          disabled={extractLoadingStatus[index]}
                          onClick={() => handleClickExtractWords(index)}
                          style={{
                            backgroundColor: extractLoadingStatus[index]
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
                          {extractLoadingStatus[index]
                            ? "추출 중..."
                            : "재추출"}
                        </button>
                        {!extractLoadingStatus[index] &&
                        Object.keys(replaceMap[index]).length ? (
                          <>
                            <button
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
                              onClick={() =>
                                handleClickActionForUnitSentence(
                                  index,
                                  "random"
                                )
                              }
                            >
                              랜덤 선택
                            </button>
                            <button
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
                              onClick={() => {
                                handleClickActionForUnitSentence(
                                  index,
                                  "remove"
                                );
                              }}
                            >
                              선택 해제
                            </button>
                          </>
                        ) : null}
                        <div>
                          {Object.keys(replaceMap[index]).map(
                            (targetWord, targetIndex) => (
                              <div key={`replace-target-key-${targetIndex}`}>
                                <div style={{ marginTop: "20px" }}>
                                  <div
                                    style={{
                                      display: "inline-block",
                                      marginRight: "1px",
                                      color: replacedMap[
                                        `${index}-${targetIndex}`
                                      ]
                                        ? "crimson"
                                        : "silver",
                                      borderRadius: "5px",
                                      fontSize: "17px",
                                      verticalAlign: "top",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    #{targetIndex}
                                  </div>{" "}
                                  <span
                                    style={{
                                      color: replacedMap[
                                        `${index}-${targetIndex}`
                                      ]
                                        ? "crimson"
                                        : "silver",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {targetWord}
                                  </span>
                                </div>
                                <div>
                                  <div>
                                    {replaceMap?.[index]?.[targetWord].map(
                                      (replaceWord, replaceIndex) => (
                                        <div
                                          onClick={() =>
                                            handleClickReplaceTargetWord(
                                              `${index}-${targetIndex}`,
                                              replaceWord
                                            )
                                          }
                                          style={{
                                            display: "inline-block",
                                            backgroundColor:
                                              replacedMap[
                                                `${index}-${targetIndex}`
                                              ] === replaceWord
                                                ? "crimson"
                                                : "white",
                                            color:
                                              replacedMap[
                                                `${index}-${targetIndex}`
                                              ] === replaceWord
                                                ? "white"
                                                : "silver",
                                            border: "1px solid black",
                                            borderColor:
                                              replacedMap[
                                                `${index}-${targetIndex}`
                                              ] === replaceWord
                                                ? "crimson"
                                                : "silver",
                                            borderRadius: "5px",
                                            margin: "5px 5px 0px 0px",
                                            padding: "3px 5px",
                                            cursor: "pointer",
                                          }}
                                          key={`${targetIndex}-${replaceIndex}-replace-word-key`}
                                        >
                                          {replaceWord}
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    ) : (
                      <button
                        disabled={extractLoadingStatus[index]}
                        onClick={() => handleClickExtractWords(index)}
                        style={{
                          backgroundColor: extractLoadingStatus[index]
                            ? "silver"
                            : "rgb(93, 154, 211)",
                          padding: "5px 10px",
                          cursor: "pointer",
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                          boxShadow: "0px 0px 3px silver",
                        }}
                      >
                        {extractLoadingStatus[index]
                          ? "추출 중..."
                          : "단어 추출"}
                      </button>
                    )}
                  </div>
                </Accordion.Pannel>
              </Fragment>
            ))}
          </Accordion>
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
export default ConvertKeywordPage;
