// ==UserScript==
// @name         TIPP10 Cheat
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Fakes lessons on tipp10.com!
// @author       Sirvierl0ffel
// @match        *://online.tipp10.com/*/training/
// @icon         https://www.google.com/s2/favicons?domain=tipp10.com
// @grant        none
// ==/UserScript==

let CHEAT_LOADED = false;

/* globals $, TIPP10, language */

(function () {
  "use strict";

  if (CHEAT_LOADED) return;

  CHEAT_LOADED = true;

  //console.info("Loaded TIPP10 Cheat v0.0.1");

  const CHEAT_FIRE = decodeURI("%F0%9F%94%A5");

  const KEY_NEIGHBOR_MAPS = {
    def: {
      " ": ".,",
      "\u00B6": "., ",
      a: "sqy",
      b: "gv n",
      c: "dxv f",
      b: "gv n",
      d: "esfc",
      e: "wrd34",
      f: "rdgcv",
      g: "tfvb",
      h: "gzbn",
      i: "uok",
      j: "hk",
      k: "jl,",
      l: "ka",
      m: "n ",
      n: "mj",
      o: "ip",
      p: "o",
      q: "was",
      r: "etf",
      s: "awdxz",
      t: "frg",
      u: "uiy",
      v: "bcg ",
      w: "asdqe",
      x: "ys",
      y: "thu",
      z: "xc",
    },
    de_qwertz_win: {
      "<": ">ay",
      ">": "<ay",
      "^": "°\t1",
      "°": "^\t1",
      ",": ";m.,",
      ";": ",:",
      "-": "_.\u00F6\u00E4",
      _: "-:",
      "'": "#+*",
      "#": "'+",
      "+": "*#´",
      " ": ".,\u00B6",
      "\u00B6": "., ",
      0: "=op9\u00DF",
      1: "^2q!",
      2: '"2qwe13',
      3: "\u00A724wer",
      4: "$35er",
      5: "%46rt",
      6: "&57t",
      7: "/68u",
      8: "(79",
      9: ")80iop",
      "=": "0OP9\u00DF",
      "!": '1"Q°',
      '"': "2qwe!\u00A7",
      "\u00A7": '3"$wer',
      $: "435ER",
      "%": "5$&RT",
      "& ": "6%/T",
      "/": "7&(U",
      "(": "8/)",
      ")": "9(=IOP",
      a: "sqy",
      b: "gv n",
      c: "dxv f",
      b: "gv n",
      d: "esfc",
      e: "wrd34",
      f: "rdgcv",
      g: "tfvb",
      h: "gzbn",
      i: "uok",
      j: "hk",
      k: "jl,",
      l: "k\u00F6,.",
      m: "n, ",
      n: "mj",
      o: "ip",
      p: "o\u00F6\u00FC+",
      q: "was",
      r: "etf",
      s: "awdx",
      t: "frg",
      u: "uiz",
      v: "bcg ",
      w: "asdqe",
      x: "ys<",
      y: "xc<",
      z: "thu",
      "\u00FC": "\u00F6p\u00E4",
      "\u00F6": "l\u00E4-",
      "\u00E4": "\u00F6\u00FC#",
    },
  };

  const CHEAT_CSS = `
/* =========================== Cheat run ============================ */

#cheat-background {
  display: none;
  line-height: normal;
  font-weight: normal;
  user-select: none;
  background: rgba(0, 0, 0, 0.65);
  z-index: 999999;
  position: absolute;
  width: 100%;
  height: 100%;
}

#cheat-run-table {
  width: 600px;
  background: rgba(0, 0, 0, 0.4);
  margin: 10px 10px 10px 10px;
  padding: 5px;
  border: 1px solid rgba(255, 255, 255, 0.4);
}

#cheat-run-table td {
  font-family: 'Courier New', 'Lucida Console', 'monospace', 'sans-serif';
  font-size: 16px;
  color: #ffffff;
}


/* ========================= Cheat table ========================== */
  .cheat-run-table-label {
  margin: 0px 5px 0px 5px;
  text-align: right;
}

.cheat-run-table-data-cell {
  padding-right: 20px;
  width: 100%;
  white-space: nowrap;
}

.cheat-lessons-done {
  border: 1px solid #00b000;
}

.cheat-lesson-current {
  border: 1px solid #ffff00;
}

.cheat-lessons-undone {
  border: 1px solid #b00000;
}

.center {
  widht: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}



/* ========================= Cheat panel ============================= */

#cheat {
  font-family: Roboto, Arial, sans-serif;
  background: #e8e8e8;
  user-select: none;
  position: absolute;
  z-index: 1000000;
  float: right;
  top: 10px;
  right: 10px;
  padding: 10px;
  width: 240px;
  border: 1px solid #c8c8c8;
  border-radius: 5px;
}

/* Cheat panel header */
#cheat-bar {
  height: 40px;
  width: 100%;
  margin-bottom: 14px;
}
#cheat-title {
  font-size: 20px;
  font-weight: bold;
}
#cheat-subtitle {
  font-size: 11px;
  text-align: right;
  color: #808080;
}
#cheat-title-line {
  color: #c0c0c0;
  margin: 0px 1px 0px 1px;
}


/* Cheat settings */
#cheat-settings {
}

#cheat-settings td {
  padding: 0px 3px 8px 3px;
  font-size: revert;
  font-family: Roboto, Arial, sans-serif;
  color: #000000;
}

#cheat-settings label {
  font-family: Arial;
  font-weight: revert;
  margin-left: 5px;
  color: #000000;
  font-size: 14px;
}

#cheat-settings br {
  font-family: Arial;
  font-weight: revert;
  margin-left: 5px;
  color: #000000;
  font-size: 14px;
}

.cheat-input {
  margin: revert;
  font-weight: revert;
  font-family: Calibri;
  font-size: 14px;
  background: #d8d8d8;
  color: #505050;
  width: 100%;
  padding: 2px 2px 3px 6px;
  border: 1px solid #808080;
  border-radius: 2px;
}

.cheat-input:invalid {
  background: #d8c8c8;
  border-color: #ff0000;
}

.cheat-input:disabled {
  color: #a0a0a0;
  border: 1px solid #b8b8b8;
}

#cheat-queue-hint {
  font-family: Arial;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 200px;
  height: 14px;
  font-size: 10px;
  color: #d80000;
}


/* Cheat panel bottom */
#cheat-bottom {
  text-align: right;
  width: max;
}

#cheat-button {
  width: 80px;
  padding: 3px 3px 3px 3px;
}
`;

  const CHEAT_HTML = `
  <div id="cheat-background">
  <div class="center">
    <table id="cheat-run-table">
      <tr>
        <td>
          <div class="cheat-run-table-label">Lessons:</div>
        </td>
        <td class="cheat-run-table-data-cell">
          <div id="cheat-info-lessons">-</div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="cheat-run-table-label">State:</div>
        </td>
        <td class="cheat-run-table-data-cell">
          <div id="cheat-info-state">[00:00:00] -</div>
        </td>
      </tr>
      <tr>
        <td>
          <div class="cheat-run-table-label">Time:</div>
        </td>
        <td class="cheat-run-table-data-cell">
          <div id="cheat-info-time">[00:00:00]</div>
        </td>
      </tr>
    </table>
  </div>
</div>

<div id="cheat">
  <div id="cheat-bar">
    <div id="cheat-title">TIPP10 Cheat</div>
    <hr id="cheat-title-line" />
    <div id="cheat-subtitle">by Sirvierl0ffel</div>
  </div>

  <div id="cheat-settings">
    <table style="width: 100%;">
      <tr>
        <td>
          <label for="cheat-strokes">Strokes/10m</label><br />
          <input id="cheat-strokes" class="cheat-input" type="number" value="1750" step="50" min="250" max="100000" />
        </td>
        <td>
          <label for="cheat-strokes-random">Random +</label><br />
          <input id="cheat-strokes-random" class="cheat-input" type="number" value="500" step="50" min="0" max="100000" />
        </td>
      </tr>

      <tr>
        <td>
          <label for="cheat-error">Error%</label><br />
          <input id="cheat-error" class="cheat-input" type="number" value="0" step="1" min="0" max="100" />
        </td>
        <td>
          <label for="cheat-error-random">Random +</label><br />
          <input id="cheat-error-random" class="cheat-input" type="number" value="8" step="1" min="0" max="100" />
        </td>
      </tr>

      <tr>
        <td>
          <label for="cheat-interval">Interval</label><br />
          <input id="cheat-interval" class="cheat-input" type="number" value="0" step="1" min="0" max="300" />
        </td>
        <td>
          <label for="cheat-interval-random">Random +</label><br />
          <input id="cheat-interval-random" class="cheat-input" type="number" value="5" step="1" min="0" max="300" />
        </td>
      </tr>

      <tr>
        <td colspan="2">
          <label for="cheat-duration">Lesson Duration (m)</label><br />
          <input id="cheat-duration" class="cheat-input" type="number" value="5" step="1" min="1" max="20" />
        </td>
      </tr>

      <tr>
        <td colspan="2">
          <label for="cheat-queue">Lesson Queue</label><br />
          <input id="cheat-queue" class="cheat-input" type="text" value="1 1 1 2 2" />
          <div id="cheat-queue-hint"></div>
        </td>
      </tr>
    </table>
  </div>

  <div id="cheat-bottom">
    <button id="cheat-button">Run</button>
  </div>
</div>
`;

  // Insert html
  $("<style>").text(CHEAT_CSS).appendTo(document.head);
  $("body").html(`${CHEAT_HTML}${$("body").html()}\n`);

  // TIPP10 presence
  let show = false;

  // Document state
  let lastTitle;

  // Constants
  const START_DELAY_MS = 10000;
  const SENT_DURATION_MS = 5000;

  // Settings
  let enabled = getCookie("cheatEnabled", "true") === "true";
  let queue = [];

  // Run variables
  let running = false;
  let canceled = false;
  let startMS = 0;
  let completeMS = 0;
  let lessons = [];
  let lessonIndex = 0;
  let totalDurationMS = 0;

  // Link cookies to inputs
  linkCookie("#cheat-strokes", "cheatStrokes");
  linkCookie("#cheat-strokes-random", "cheatStrokesRandom");
  linkCookie("#cheat-error", "cheatError");
  linkCookie("#cheat-error-random", "cheatErrorRandom");
  linkCookie("#cheat-interval", "cheatInterval");
  linkCookie("#cheat-interval-random", "cheatIntervalRandom");
  linkCookie("#cheat-duration", "cheatDuration");
  linkCookie("#cheat-queue", "cheatQueue");
  function linkCookie(selector, cookie) {
    $(selector).val(getCookie(cookie, $(selector).val()));
    $(selector).change(() => {
      let v = $(selector).val();
      if (v.length == 0) $(selector).setCustomValidity("Empty!");
      if ($(selector).is(":invalid")) return;
      setCookie(cookie, v);
    });
  }
  // Read cookies
  if (enabled && show) {
    $("#cheat").css("display", "block");
  } else {
    $("#cheat").css("display", "none");
  }

  // Focus
  $("#cheat").focus();

  // Add key listener
  $("body").on("keydown", (evt) => {
    if (evt.key === "Home") {
      if (running || !show) return;
      enabled = !enabled;
      $("#cheat").css("display", enabled ? "block" : "none");
      setCookie("cheatEnabled", String(enabled));
    }
  });

  // Add cheat queue change listener to parse queue numbers and give erros
  $("#cheat-queue").change(() => {
    let value = $("#cheat-queue").val();
    value = value.trim().replace(/ +(?= )/g, ""); // Trim and remove double spaces

    if (value.length === 0) {
      queueErr("Empty!");
      return;
    }

    let lessonStrings = value.split(" ");

    queue = new Array(lessonStrings.length);

    for (let i = 0; i < lessonStrings.length; i++) {
      queue[i] = parseInt(lessonStrings[i]);
      if (
        isNaN(queue[i]) ||
        lessonStrings[i].length != ("" + queue[i]).length
      ) {
        queueErr('No number: "' + lessonStrings[i] + '"');
        return;
      }
      if (queue[i] < 1) {
        queueErr("To small lesson number: " + lessonStrings[i]);
        return;
      }
      if (queue[i] > 20) {
        queueErr("To large lesson number: " + lessonStrings[i]);
        return;
      }
    }

    queueErr("");
  });
  function queueErr(message) {
    $("#cheat-queue")[0].setCustomValidity(message);
    $("#cheat-queue-hint").text(message);
  }

  // Stop button state
  let stopHit;
  let to;

  function resetStop() {
    stopHit = false;
    $("#cheat-button").css("color", "black");
    $("#cheat-button").html("Stop");
  }

  // Add start listener
  $("#cheat-button").on("click", function () {
    if (running) {
      // Stop button state handling
      if (!stopHit && !canceled) {
        stopHit = true;
        $("#cheat-button").css("color", "#cc0000");
        $("#cheat-button").html("!Stop!");
        to = setTimeout(resetStop, 3000);
        return;
      }
      clearTimeout(to);
      resetStop();

      // Stop running
      running = false;

      // Revert document to normal mode
      $("#cheat-strokes").prop("disabled", false);
      $("#cheat-strokes-random").prop("disabled", false);
      $("#cheat-error").prop("disabled", false);
      $("#cheat-error-random").prop("disabled", false);
      $("#cheat-interval").prop("disabled", false);
      $("#cheat-interval-random").prop("disabled", false);
      $("#cheat-duration").prop("disabled", false);
      $("#cheat-queue").prop("disabled", false);
      $("#cheat-background").css("display", "none");
      $("#cheat-button").html("Run");
      document.title = lastTitle;
    } else {
      // Check input and window state
      $("#cheat-queue").change();
      if (window.TIPP10 == undefined) return;
      if (
        $("#cheat-strokes").is(":invalid") ||
        $("#cheat-strokes-random").is(":invalid") ||
        $("#cheat-error").is(":invalid") ||
        $("#cheat-error-random").is(":invalid") ||
        $("#cheat-interval").is(":invalid") ||
        $("#cheat-interval-random").is(":invalid") ||
        $("#cheat-duration").is(":invalid") ||
        $("#cheat-queue").is(":invalid")
      ) {
        return;
      }

      // Update document to running mode
      $("#cheat-strokes").prop("disabled", true);
      $("#cheat-strokes-random").prop("disabled", true);
      $("#cheat-error").prop("disabled", true);
      $("#cheat-error-random").prop("disabled", true);
      $("#cheat-interval").prop("disabled", true);
      $("#cheat-interval-random").prop("disabled", true);
      $("#cheat-duration").prop("disabled", true);
      $("#cheat-queue").prop("disabled", true);
      $("#cheat-background").css("display", "block");
      $("#cheat-button").html("Stop");
      lastTitle = document.title;
      let f = CHEAT_FIRE;
      document.title = `${f}${f}${f}TIPP10${f}${f}${f}`;

      // Prepare run varaibles
      canceled = null;
      running = true;
      totalDurationMS = START_DELAY_MS;
      lessons = new Array(queue.length);
      for (let i = 0; i < queue.length; i++) {
        lessons[i] = new Lesson(queue[i]);
        if (i > 0) {
          const lessonDurationMS = parseEl("#cheat-duration") * 60 * 1000;
          const lessonIntervalMS = lessons[i].delay * 60 * 1000;
          totalDurationMS +=
            SENT_DURATION_MS + lessonDurationMS + lessonIntervalMS;
        }
      }
      lessonIndex = 0;
      startMS = Date.now();
      completeMS = startMS + START_DELAY_MS - SENT_DURATION_MS;
      updateLessons();
    }
  });

  setInterval(tick, 50);

  function tick() {
    // Ensure TIPP10 instance exists
    if (window.TIPP10 == undefined) {
      if (running) {
        if (!canceled) {
          canceled = true;
          clearTimeout(to);
          resetStop();
          $("#cheat-button").html("Done");
          $("#cheat-info-state").html("[00:00:00] Error!");
          $("#cheat-info-time").html("[00:00:00]");
        }
      } else if (show) {
        show = false;
        $("#cheat").css("display", "block");
      }
    } else if (!show) {
      show = true;
      if (enabled && show) {
        $("#cheat").css("display", "block");
      } else {
        $("#cheat").css("display", "none");
      }
    }

    if (canceled) return;
    if (!running) return;

    // Run lessons

    let nowMS = Date.now();

    $("#cheat-info-time").html(
      "[" + formatMS2(totalDurationMS - nowMS + startMS) + "]"
    );

    if (nowMS - startMS < START_DELAY_MS) {
      let timeLeft = formatMS2(START_DELAY_MS - nowMS + startMS);
      $("#cheat-info-state").html("[" + timeLeft + "] Starting...");
      return;
    }

    let lesson = lessons[lessonIndex];
    if (!lesson.completed) {
      let lessonDurationMS = 0;
      let lessonIntervalMS = 0;

      if (lessonIndex > 0) {
        lessonDurationMS = parseEl("#cheat-duration") * 60 * 1000;
        lessonIntervalMS = lesson.delay * 60 * 1000;

        let pastMS = nowMS - completeMS;

        if (pastMS < SENT_DURATION_MS) {
          let timeLeft = formatMS2(SENT_DURATION_MS - pastMS);
          $("#cheat-info-state").html("[" + timeLeft + "] Faked a lesson.");
          return;
        }
        pastMS -= SENT_DURATION_MS;

        if (pastMS < lessonIntervalMS) {
          let timeLeft = formatMS2(lessonIntervalMS - pastMS);
          $("#cheat-info-state").html(
            "[" + timeLeft + "] Waiting for interval"
          );
          return;
        }
        pastMS -= lessonIntervalMS;

        if (pastMS < lessonDurationMS) {
          let timeLeft = formatMS2(lessonDurationMS - pastMS);
          $("#cheat-info-state").html(
            "[" + timeLeft + "] Waiting for lesson duration"
          );
          return;
        }
      }

      lesson.complete();
      completeMS += SENT_DURATION_MS + lessonIntervalMS + lessonDurationMS;
      lessonIndex++;
      updateLessons();
      if (lessonIndex == lessons.length) {
        canceled = true;
        clearTimeout(to);
        resetStop();
        $("#cheat-button").html("Done");
        $("#cheat-info-state").html("[00:00:00] Done!");
        $("#cheat-info-time").html("[00:00:00]");
      }
    }
  }

  function formatMS2(millis) {
    millis = Math.max(millis, 0);
    let seconds = Math.floor(millis / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    seconds %= 60;
    minutes %= 60;
    return (
      String(hours).padStart(2, "0") +
      ":" +
      String(minutes).padStart(2, "0") +
      ":" +
      String(seconds).padStart(2, "0")
    );
  }

  function updateLessons() {
    let done = "";
    let current = "";
    let undone = "";
    for (let i = 0; i < lessonIndex; i++)
      done += (i > 0 ? " " : "") + lessons[i].lessonID;
    current =
      lessonIndex < lessons.length ? String(lessons[lessonIndex].lessonID) : "";
    for (let i = lessonIndex + 1; i < lessons.length; i++)
      undone += (i > 0 ? " " : "") + lessons[i].lessonID;
    if (done.length > 0)
      done = '<span class="cheat-lessons-done">' + done + "</span> ";
    if (current.length > 0)
      current = '<span class="cheat-lesson-current">' + current + "</span>";
    if (undone.length > 0)
      undone = ' <span class="cheat-lessons-undone">' + undone + "</span>";
    $("#cheat-info-lessons").html(done + current + undone);
  }

  function Lesson(lessonID) {
    this.lessonID = lessonID;
    this.delay = Math.floor(
      random(
        parseEl("#cheat-interval"),
        parseEl("#cheat-interval-random"),
        0,
        300
      )
    );
    this.completed = false;

    this.complete = function () {
      if (this.completed)
        throw new Error("Tried to complete already completed lesson!");

      this.completed = true;

      let lessonDuration = parseEl("#cheat-duration");
      let targetStrokesP10M = Math.floor(
        random(
          parseEl("#cheat-strokes"),
          parseEl("#cheat-strokes-random"),
          250,
          100000
        )
      );
      let targetErrorPct = random(
        parseEl("#cheat-error"),
        parseEl("#cheat-error-random"),
        0,
        100
      );

      let targetStrokeCount = Math.floor(
        (targetStrokesP10M * lessonDuration) / 10
      );

      // Generate error indices
      let errorIndices = new Array(targetStrokeCount);
      for (let i = 0; i < errorIndices.length; i++) errorIndices[i] = i;
      for (
        let j, x, i = errorIndices.length;
        i;
        j = parseInt(Math.random() * i),
          x = errorIndices[--i],
          errorIndices[i] = errorIndices[j],
          errorIndices[j] = x
      );
      errorIndices = errorIndices.slice(
        0,
        (targetStrokeCount * targetErrorPct) / 100
      );

      // console.info(`Strokes/10m:${targetStrokesP10M} Error%:${targetErrorPct.toFixed(2)},${errorIndices.toString()} Interval:${interval} Duration:${lessonDuration} ID:${lessonId}`);

      // Make lesson text request
      TIPP10.main.SR(
        `/${language}/training/data/init/0/0/${lessonID}/0/`,
        function (req) {
          let data = JSON.parse(req.responseText);

          let lines = data.lesson.split("\n");

          let keyboardLayout = data.settings.user_keyboard;

          // Type lines

          let charCount = 0;
          let strokeCount = 0;
          let errorCount = 0;
          let errorString = "";

          let p_e = {};

          let p_lc = "";

          let line;
          typeLoop: while (true) {
            // Get new random line that is not equal to the last line
            if (lines.length > 1) {
              let newline = line;
              while (newline === line) {
                newline = lines[Math.floor(Math.random() * lines.length)];
              }
              line = newline;
            }

            // Type every characer in line
            let lineReturned = line + "\u00B6";
            for (let i = 0; i < lineReturned.length; i++) {
              let c = lineReturned[i];

              // Type error
              if (errorIndices.includes(charCount)) {
                let ec = generateError(lineReturned, i, c);

                get(ec).ea++;
                get(c).et++;
                errorCount++;
                addChar(ec);
                errorString += "1";
              }

              // Occurences are actually counted before the char is typed
              get(c).eo++;
              charCount++;
              addChar(c);
              errorString += "0";

              // Exit type loop if the target stroke count is reached
              if (strokeCount >= targetStrokeCount) break typeLoop;
            }
          }

          // Generates error for a line
          function generateError(lineReturned, i, c) {
            let doubled = 0.3;
            let switched1 = 0.3;
            let switched2 = 0.1;
            if (Math.random() < doubled && i > 0 && lineReturned[i - 1] !== c) {
              return lineReturned[i - 1];
            } else if (
              Math.random() < switched1 &&
              i + 1 < lineReturned.length &&
              lineReturned[i + 1] !== c
            ) {
              return lineReturned[i + 1];
            } else if (
              Math.random() < switched2 &&
              i + 2 < lineReturned.length &&
              lineReturned[i + 2] !== c
            ) {
              return lineReturned[i + 2];
            } else {
              let map = KEY_NEIGHBOR_MAPS[keyboardLayout];

              if (map == undefined) {
                map = KEY_NEIGHBOR_MAPS.def;
              }

              let choices = map[c];
              if (choices == undefined) {
                choices = "abcdefghijklmnopqrstuvwxyz";
              }

              let upper = c.toUpperCase();
              if (upper === c) choices += c.toLowerCase();

              let choice = c;
              let tries = 0;
              while (choice === c) {
                choice = choices[Math.floor(Math.random() * choices.length)];

                // Can't find error, so just return a or s, depending on which is an error
                if (tries++ > 50) {
                  if (c === "a") return "s";
                  return "a";
                }
              }
              return choice;
            }
          }

          // Adds a char to the lesson
          function addChar(c) {
            let code = c.charCodeAt(0);
            if (data.layout[code][1] != 0) strokeCount++;
            if (data.layout[code][2] != 0) strokeCount++;
            strokeCount++;
            p_lc += c;
          }

          // Gets occurrence and error stats for character
          function get(c) {
            let code = c.charCodeAt(0);
            if (!p_e["" + code]) {
              p_e["" + code] = {
                eo: 0,
                et: 0,
                ea: 0,
              };
            }
            return p_e["" + code];
          }

          // Make result request

          let p_r = {
            l: "" + lessonID,
            ta: 0, // lesson task (?)
            t: lessonDuration * 60,
            c: charCount,
            s: strokeCount,
            e: errorCount,
            le: errorString,

            // settings
            tt: "ticker", // ticker type (?)
            dt: 0, // duration type, 0 = time
            dv: "" + lessonDuration, // duration value (?minutes)
            ec: 1, // error correction
            eb: 0, // error sound
            es: 0, // assistance keyboard
            ak: 0, // assistance ...
            ac: 0,
            ah: 0,
            ap: 0,
            ab: 0,
            ai: 1,
            am: 0,
          };

          let p_ls = "";

          // console.info('r=    ' + JSON.stringify(p_r));
          // console.info('e=    ' + JSON.stringify(p_e));
          // console.info('lc=   ' + encodeURI(p_lc));
          // console.info('ls=   ' + encodeURI(p_ls));

          TIPP10.main.SR(
            `/${language}/training/data/result/`,
            (req) => {},
            `r=${JSON.stringify(p_r)}&e=${JSON.stringify(p_e)}&lc=${encodeURI(
              p_lc
            )}&ls=${encodeURI(p_ls)}`
          );
        }
      );
    };
  }

  function setCookie(c_name, value) {
    let c_value =
      escape(value) +
      "; expires=" +
      new Date(2147483647 * 1000).toUTCString() +
      " SameSite=None; Secure";
    document.cookie = c_name + "=" + c_value;
  }

  function getCookie(c_name, def) {
    let i,
      x,
      y,
      ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
      x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
      y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
      x = x.replace(/^\s+|\s+$/g, "");
      if (x == c_name) {
        return unescape(y);
      }
    }
    return def;
  }

  function parseEl(selector) {
    return parseFloat($(selector).val());
  }

  function random(val, deviation, min, max) {
    return Math.min(Math.max(val + Math.random() * deviation, min), max);
  }
})();
