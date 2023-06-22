function mTextArea() {
  document.querySelectorAll("textarea").forEach((ele) => {
    let elem = ele,
      textLines = 0,
      currentLineNumber = 0,
      currentCaretPosition = 0,
      currentCaretPosInLine = 0;

    function getLinesLength(lineNums) {
      let len = 0;
      for (let i = 0; i < lineNums; i++) {
        len = len + textLines[i].length;
      }
      return len + lineNums;
    }

    function minLength(lineNum) {
      return textLines[lineNum].length < currentCaretPosInLine
        ? textLines[lineNum].length
        : currentCaretPosInLine;
    }

    function init() {
      textLines = elem.value.split("\n");

      currentState("arrowdown");
    }

    function currentState(k) {
      k = k.toLowerCase();

      if (k == "arrowdown" || k == "arrowleft") {
        currentCaretPosition = elem.selectionStart;
      }
      if (k == "arrowup" || k == "arrowright") {
        currentCaretPosition = elem.selectionEnd;
      }

      currentLineNumber = elem.value
        .substring(0, currentCaretPosition)
        .split("\n").length;

      if (k == "arrowup" || k == "arrowdown") {
        currentCaretPosInLine =
          currentCaretPosition - getLinesLength(currentLineNumber - 1);
      }
    }

    function toPreviousLine() {
      return getPreviousLineCaretPosition();
    }

    function toNextLine() {
      return getNextLineCaretPosition();
    }

    function getPreviousLineCaretPosition() {
      if (currentLineNumber == 1) {
        return currentCaretPosition;
      }
      return (
        getLinesLength(currentLineNumber - 2) + minLength(currentLineNumber - 2)
      );
    }

    function getNextLineCaretPosition(elem) {
      if (textLines.length == currentLineNumber) {
        return currentCaretPosition;
      }
      return getLinesLength(currentLineNumber) + minLength(currentLineNumber);
    }

    function keyHandler(evt) {
      let k = evt.key.toLowerCase();

      if (k == "arrowdown") {
        ++elem.selectionStart;
        currentState(k);
        evt.preventDefault();
      }

      if (k == "arrowup") {
        if (elem.selectionEnd == 0) {
          return;
        }
        --elem.selectionEnd;
        currentState(k);
        evt.preventDefault();
      }

      if (k == "arrowleft") {
        currentState(k);
        elem.selectionEnd = toPreviousLine();
        evt.preventDefault();
      }

      if (k == "arrowright") {
        currentState(k);
        elem.selectionStart = toNextLine();
        evt.preventDefault();
      }
    }

    function clickHandler(evt) {
      currentState("arrowup");
    }

    elem.addEventListener("keydown", keyHandler);
    elem.addEventListener("click", clickHandler);

    init();
  });
}

mTextArea();
