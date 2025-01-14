export const escapeRegExp = (str: string) => {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};

export const filteredTextarea = (str: string) => {
  return str.replace(/사진 설명을 입력하세요\.?|출처 입력/g, "");
};

export const addStopCharFromPerSentence = (str: string) => {
  console.log(str);
  const addedStr1 = str.split("\n").map((sen) => {
    if (sen[sen.length - 1] === ".") {
      return sen;
    }
    if (sen.trim() === "") {
      return "\n";
    }
    return `${sen}.\n`;
  });
  console.log(addedStr1);
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
