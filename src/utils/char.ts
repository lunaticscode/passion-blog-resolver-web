export const escapeRegExp = (str: string) => {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};

// 1) 출처 입력
// 2) 사진 설명을 입력하세요.
// 3) naver.me

export const filteredTextarea = (str: string) => {
  return str.replace(/사진 설명을 입력하세요\.?|출처 입력|naver\.me/g, "");
};

export const addStopCharFromPerSentence = (str: string) => {
  const addedStr = str
    .split("\n")
    .map((sen) => {
      if (sen[sen.length - 1] === ".") {
        return sen;
      }
      if (sen.trim() === "") {
        return "\n";
      }
      return `${sen}.\n`;
    })
    .join("");

  return addedStr.replace(/ \./g, "");
};
