const outElem = document.querySelector("pre");

/* Clear the output */
document.addEventListener(
  "click",
  () => {
    outElem.textContent = "";
  },
  true
);

function getLinesLength(lineNums) {
  let len = 0;
  for (let i = 0; i < lineNums; i++) {
    len = len + textLines[i].length;
  }
  return len + lineNums;
}

function minLength(lineNum) {
  console.log(textLines[lineNum] + " - " + currentCaretPosInLine);
  return textLines[lineNum].length < currentCaretPosInLine
    ? textLines[lineNum].length
    : currentCaretPosInLine;
}

let textLines;
let currentLineNumber = 0;
let currentCaretPosition = 0;
let currentCaretPosInLine = 0;

function getLineNumber(elem, UpOrDown) {
  textLines = elem.value.split("\n");

  currentLineNumber = elem.value
    .substr(0, currentCaretPosition)
    .split("\n").length;

  let allPreviousLinesTextLength = getLinesLength(currentLineNumber - 1);

  if (!currentCaretPosInLine || UpOrDown) {
    currentCaretPosInLine =
      currentCaretPosition - allPreviousLinesTextLength - currentLineNumber + 1;
  }
}

function toPreviousLine(elem) {
  getLineNumber(elem);
  return getPreviousLineCaretPosition(elem);
}

function toNextLine(elem) {
  getLineNumber(elem);
  return getNextLineCaretPosition(elem);
}

function getPreviousLineCaretPosition(elem) {
  if (currentLineNumber == 1) {
    return currentCaretPosition;
  }
  return getLinesLength(currentLineNumber - 2) + minLength(currentLineNumber - 2);
}

function getNextLineCaretPosition(elem) {
  if (textLines.length == currentLineNumber) {
    return currentCaretPosition;
  }
  return getLinesLength(currentLineNumber) + minLength(currentLineNumber);
}

document.querySelectorAll("textarea").forEach((elem) => {
  elem.addEventListener("keydown", (evt) => {
    let k = evt.key;

    if (k.toLowerCase() == "arrowdown") {
      ++elem.selectionStart;
      currentCaretPosition = elem.selectionStart;
      getLineNumber(elem, true);
      evt.preventDefault();
    }

    if (k.toLowerCase() == "arrowup") {
      if (elem.selectionEnd == 0) {
        return;
      }
      --elem.selectionEnd;
      currentCaretPosition = elem.selectionEnd;
      getLineNumber(elem, true);
      evt.preventDefault();
    }

    if (k.toLowerCase() == "arrowleft") {
      currentCaretPosition = elem.selectionStart;
      elem.selectionEnd = toPreviousLine(elem);
      evt.preventDefault();
    }

    if (k.toLowerCase() == "arrowright") {
      currentCaretPosition = elem.selectionEnd;
      elem.selectionStart = toNextLine(elem);
      evt.preventDefault();
    }

    outElem.textContent += `currentCaretPosition - ${currentCaretPosition}\n`;
    outElem.textContent += `currentLineNumber - ${currentLineNumber}\n`;
    outElem.textContent += `currentCaretPosInLine - ${currentCaretPosInLine}\n`;
  });
});
