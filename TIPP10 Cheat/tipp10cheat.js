// ==UserScript==
// @name         TIPP10 Cheat
// @name:de      TIPP10 Cheat
// @namespace    http://tampermonkey.net/
// @version      0.0.6
// @description  Fakes lessons on tipp10.com!
// @description:de Fake Lektionen auf tipp10.com!
// @author       Sirvierl0ffel
// @match        *://online.tipp10.com/*/training/
// @icon         https://i.imgur.com/zTDoadV.png
// @icon64       https://i.imgur.com/L1SG5wo.png
// @grant        none
// ==/UserScript==

// Icons: https://imgur.com/a/jZHMEQg

/* globals $, TIPP10, language */

(function () {
  'use strict';

  // Ensure the script was not already loaded
  if (window.CHEAT_LOADED) return;
  Object.defineProperty(window, 'CHEAT_LOADED', {
    value: true,
    writable: false,
  });

  const CHEAT_VERSION = '0.0.6';

  //#region HTML
  const CHEAT_CSS = `
/* =========================== Run background ============================ */

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



/* Run state table */

#cheat-run-table {
  width: 600px;
  background: rgba(0, 0, 0, 0.4);
  margin: 10px 10px 10px 10px;
  padding: 5px;
  border: 1px solid rgba(255, 255, 255, 0.4);
}

/* Container with centered child */
.center {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Cell style */
#cheat-run-table td {
  font-family: 'Courier New', 'Lucida Console', 'monospace', 'sans-serif';
  font-size: 16px;
  color: #ffffff;
}
.cheat-run-table-label {
  font-weight: normal;
  text-align: right;
  margin: 0px 5px 0px 5px;
}
.cheat-run-table-data-cell {
  font-weight: normal;
  white-space: nowrap;
  padding-right: 20px;
  width: 100%;
}

/* Lesson processing states */
.cheat-lessons-done {
  border: 1px solid #00b000;
}
.cheat-lesson-current {
  border: 1px solid #ffff00;
}
.cheat-lessons-undone {
  border: 1px solid #b00000;
}



/* ============================== Cheat panel ============================== */

#cheat {
  color: black;
  line-height: normal;
  font-weight: normal;
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


/* ============================ Cheat settings ============================= */
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
  font-size: 13px;
  font-weight: normal;
  margin-left: 5px;
  color: #000000;
  font-size: 14px;
}

#cheat-settings br {
  font-family: Arial;
  font-size: 14px;
  font-weight: normal;
  margin-left: 5px;
  color: #000000;
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
  box-sizing: border-box;
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
  position: absolute;
  width: 200px;
  height: 14px;
  font-size: 10px;
  color: #d80000;
}

/* Cheat panel bottom */
#cheat-bottom {
  margin-top: 8px;
  text-align: right;
  width: max;
}

#cheat-button {
  color: black;
  font-family: Calibri;
  font-size: 14px;
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
    <div id="cheat-subtitle">v${CHEAT_VERSION} by Sirvierl0ffel</div>
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
          <label for="cheat-error">Error %</label><br />
          <input id="cheat-error" class="cheat-input" type="number" value="0" step="1" min="0" max="100" />
        </td>
        <td>
          <label for="cheat-error-random">Random +</label><br />
          <input id="cheat-error-random" class="cheat-input" type="number" value="8" step="1" min="0" max="100" />
        </td>
      </tr>

      <tr>
        <td>
          <label for="cheat-interval">Interval (m)</label><br />
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
  //#endregion

  // Keys near other keys for authentic errors, for now only German QWERTZ for Windows is fully supported
  const KEY_NEIGHBOR_MAPS = {
    /* spell-checker: disable */
    def: {
      ' ': '.,',
      '\u00B6': '., ',
      'a': 'sqy',
      'b': 'gv n',
      'c': 'dxv f',
      'd': 'esfc',
      'e': 'wrd34',
      'f': 'rdgcv',
      'g': 'tfvb',
      'h': 'gzbn',
      'i': 'uok',
      'j': 'hk',
      'k': 'jl,',
      'l': 'ka',
      'm': 'n ',
      'n': 'mj',
      'o': 'ip',
      'p': 'o',
      'q': 'was',
      'r': 'etf',
      's': 'awdxz',
      't': 'frg',
      'u': 'uiy',
      'v': 'bcg ',
      'w': 'asdqe',
      'x': 'ys',
      'y': 'thu',
      'z': 'xc',
    },
    de_qwertz_win: {
      '<': '>ay',
      '>': '<ay',
      '^': '°\t1',
      '°': '^\t1',
      ',': ';m.,',
      '.': '.,-',
      ';': ',:',
      '-': '_.\u00F6\u00E4',
      '_': '-:',
      "'": '#+*',
      '#': "'+",
      '+': '*#´',
      ' ': '.,\u00B6',
      '\u00B6': '., ',
      '0': '=op9\u00DF',
      '1': '^2q!',
      '2': '"2qwe13',
      '3': '\u00A724wer',
      '4': '$35er',
      '5': '%46rt',
      '6': '&57t',
      '7': '/68u',
      '8': '(79',
      '9': ')80iop',
      '=': '0OP9\u00DF',
      '!': '1"Q°',
      '"': '2qwe!\u00A7',
      '\u00A7': '3"$wer',
      '$': '435ER',
      '%': '5$&RT',
      '& ': '6%/T',
      '/': '7&(U',
      '(': '8/)',
      ')': '9(=IOP',
      'a': 'sqy',
      'b': 'gv n',
      'c': 'dxv f',
      'd': 'esfc',
      'e': 'wrd34',
      'f': 'rdgcv',
      'g': 'tfvb',
      'h': 'gzbn',
      'i': 'uok',
      'j': 'hk',
      'k': 'jl,',
      'l': 'k\u00F6,.',
      'm': 'n, ',
      'n': 'mj',
      'o': 'ip',
      'p': 'o\u00F6\u00FC+',
      'q': 'was',
      'r': 'etf',
      's': 'awdx',
      't': 'frg',
      'u': 'uiz',
      'v': 'bcg ',
      'w': 'asdqe',
      'x': 'ys<',
      'y': 'xc<',
      'z': 'thu',
      '\u00FC': '\u00F6p\u00E4',
      '\u00F6': 'l\u00E4-',
      '\u00E4': '\u00F6\u00FC#',
    },
    /* spell-checker: enable */
  };

  const START_DELAY_MS = 10000; // Extra delay before starting
  const MESSAGE_DURATION_MS = 5000; // Extra delay between lessons

  // Insert html
  $('<style>').text(CHEAT_CSS).appendTo(document.head);
  $('body').html(CHEAT_HTML + $('body').html());

  let show = false; // TIPP10 presence
  let lastTitle;
  let enabled = getCookie('cheatEnabled', 'true') === 'true';
  let queue = []; // Queue text field as integer array

  // Run variables
  let running = false;
  let canceled = false;
  let startMS = 0;
  let lessons = [];
  let lessonIdx = 0;
  let totalDurationMS = 0;
  let completeMS = 0;

  // Add cheat queue change listener to parse lesson numbers and provide custom validity
  $('#cheat-queue').change(() => {
    let value = $('#cheat-queue').val();
    value = value.trim().replace(/ +(?= )/g, ''); // Trim and remove double spaces
    if (value.length === 0) {
      queueVal('Empty!');
      return;
    }
    let lessonStrings = value.split(' ');
    queue = new Array(lessonStrings.length);
    for (let i = 0; i < lessonStrings.length; i++) {
      queue[i] = parseInt(lessonStrings[i]);
      if (isNaN(queue[i]) || lessonStrings[i].length != String(queue[i]).length) {
        queueVal('No number: "' + lessonStrings[i] + '"');
        return;
      }
      if (queue[i] < 1) {
        queueVal('To small lesson number: ' + lessonStrings[i]);
        return;
      }
      if (queue[i] > 20) {
        queueVal('To large lesson number: ' + lessonStrings[i]);
        return;
      }
    }
    queueVal('');
  });
  function queueVal(message) {
    $('#cheat-queue')[0].setCustomValidity(message);
    $('#cheat-queue-hint').text(message);
  }

  // Input elements
  let inputs = [
    $('#cheat-strokes'),
    $('#cheat-strokes-random'),
    $('#cheat-error'),
    $('#cheat-error-random'),
    $('#cheat-interval'),
    $('#cheat-interval-random'),
    $('#cheat-duration'),
    $('#cheat-queue'),
  ];

  // Link cookies to input elements
  for (let input of inputs) {
    let cookie = input.prop('id').replace('-', '');
    // Cooky stuff
    input.val(getCookie(cookie, input.val()));
    input.change(() => {
      let v = input.val();

      // Invalid when empty
      if (v.length == 0) input[0].setCustomValidity('Empty!');
      else if (input[0].validationMessage === 'Empty!') input[0].setCustomValidity('');

      if (!input.is(':invalid')) setCookie(cookie, v);
    });
    input.keydown(() => input.change()); // Update validity when typing
  }
  function setCookie(c_name, value) {
    let date = new Date(2147483647 * 1000).toUTCString();
    let c_value = escape(value) + '; expires=' + date + ' SameSite=None; Secure';
    document.cookie = c_name + '=' + c_value;
  }
  function getCookie(c_name, def) {
    let i;
    let x;
    let y;
    let ARRcookies = document.cookie.split(';');
    for (i = 0; i < ARRcookies.length; i++) {
      x = ARRcookies[i].substr(0, ARRcookies[i].indexOf('='));
      y = ARRcookies[i].substr(ARRcookies[i].indexOf('=') + 1);
      x = x.replace(/^\s+|\s+$/g, '');
      if (x === c_name) {
        return unescape(y);
      }
    }
    return def;
  }

  refreshVis();
  function refreshVis() {
    $('#cheat').css('display', enabled && show ? 'block' : 'none');
    $('#cheat').focus();
  }

  // Add toggle key listener
  $('body').on('keydown', (evt) => {
    if (evt.key === 'Home') {
      if (running || !show) return;
      enabled = !enabled;
      refreshVis();
      setCookie('cheatEnabled', String(enabled));
    }
  });

  // Stop button state
  let stopHit;
  let to;
  $('#cheat-button').on('click', () => {
    if (running) {
      // Stop button state handling
      if (!stopHit && !canceled) {
        stopHit = true;
        $('#cheat-button').css('color', '#cc0000');
        $('#cheat-button').html('!Stop!');
        to = setTimeout(() => {
          stopHit = false;
          $('#cheat-button').css('color', 'black');
          $('#cheat-button').html('Stop');
        }, 3000);
        return;
      }
      clearTimeout(to);
      stopHit = false;
      $('#cheat-button').css('color', 'black');
      $('#cheat-button').html('Stop');

      // Stop tick
      running = false;

      // Revert document to previous state
      for (let input of inputs) input.prop('disabled', false);
      $('#cheat-background').css('display', 'none');
      $('#cheat-button').html('Run');
      document.title = lastTitle;
    } else {
      // Check TIPP10 presence and input validity
      if (window.TIPP10 == undefined) return;
      for (let input of inputs) {
        input.change();
        if (input.is(':invalid')) return;
      }

      // Update document to running mode
      for (let input of inputs) input.prop('disabled', true);
      $('#cheat-background').css('display', 'block');
      $('#cheat-button').html('Stop');
      lastTitle = document.title;
      document.title = '\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25 TIPP10 \uD83D\uDD25\uD83D\uDD25\uD83D\uDD25'; // Light TIPP10 on fire

      // Prepare run variables and lesson schedule
      canceled = false;
      running = true;
      totalDurationMS = START_DELAY_MS;
      lessons = new Array(queue.length);
      lessonIdx = 0;
      startMS = Date.now();
      completeMS = startMS + START_DELAY_MS - MESSAGE_DURATION_MS;
      for (let i = 0; i < queue.length; i++) {
        let lessonId = queue[i];
        let delayM = Math.floor(random('#cheat-interval', '#cheat-interval-random') + 0.1);
        let durationM = parseEl('#cheat-duration');
        let targetStrokesP10M = Math.floor(random('#cheat-strokes', '#cheat-strokes-random'));
        let targetErrorPct = random('#cheat-error', '#cheat-error-random');
        lessons[i] = new Lesson(targetStrokesP10M, targetErrorPct, delayM, durationM, lessonId);
        if (i > 0) {
          const durationMS = lessons[i].durationM * 60 * 1000;
          const delayMS = lessons[i].delayM * 60 * 1000;
          totalDurationMS += MESSAGE_DURATION_MS + durationMS + delayMS;
        }
      }
      updateScheduleState();

      // Element reading helper functions
      function parseEl(selector) {
        return parseFloat($(selector).val());
      }
      function random(valSelector, randomSelector) {
        let val = parseEl(valSelector);
        let add = parseEl(randomSelector);
        let min = parseFloat($(valSelector).prop('min'));
        let max = parseFloat($(valSelector).prop('max'));
        return Math.min(Math.max(val + Math.random() * add, min), max);
      }
    }
  });

  setInterval(tick, 50);
  function tick() {
    // Ensure TIPP10 instance exists
    if (window.TIPP10 == undefined) {
      // When running, cancel run and display error
      // After the now "Exit" button is hit, running will be false and the panel will disappear
      if (running) {
        if (!canceled) {
          canceled = true;
          clearTimeout(to);
          stopHit = false;
          $('#cheat-button').css('color', 'black');
          $('#cheat-button').html('Exit');
          $('#cheat-info-state').html('[00:00:00] Error: TIPP10 instance not found!');
          $('#cheat-info-time').html('[00:00:00]');
        }
      } else if (show) {
        show = false;
        refreshVis();
      }
    } else if (!show) {
      show = true;
      refreshVis();
    }

    // Ensure a schedule is running
    if (!running || canceled) return;

    let nowMS = Date.now();

    // Update total timer
    $('#cheat-info-time').html('[' + formatMs(totalDurationMS - (nowMS - startMS)) + ']');

    // Do nothing for the specified start delay
    if (nowMS - startMS < START_DELAY_MS) {
      let timeLeft = formatMs(START_DELAY_MS - (nowMS - startMS));
      $('#cheat-info-state').html('[' + timeLeft + '] Starting');
      return;
    }

    let lesson = lessons[lessonIdx];

    if (!lesson.completed) {
      let durationMs = 0;
      let delayMs = 0;

      // Apply delays, if the lesson is not the first one
      if (lessonIdx > 0) {
        durationMs = lesson.durationM * 60 * 1000;
        delayMs = lesson.delayM * 60 * 1000;

        let pastMs = nowMS - completeMS;

        // Cancel completion for the "Faked a Lesson" message display duration
        if (pastMs < MESSAGE_DURATION_MS) {
          let timeLeft = formatMs(MESSAGE_DURATION_MS - pastMs);
          $('#cheat-info-state').html('[' + timeLeft + '] Faked a Lesson');
          return;
        }
        pastMs -= MESSAGE_DURATION_MS;

        // Cancel completion for the delay of the last lesson
        if (pastMs < delayMs) {
          let timeLeft = formatMs(delayMs - pastMs);
          $('#cheat-info-state').html('[' + timeLeft + '] Waiting for Interval');
          return;
        }
        pastMs -= delayMs;

        // Cancel completion for the lessons duration
        if (pastMs < durationMs) {
          let timeLeft = formatMs(durationMs - pastMs);
          $('#cheat-info-state').html('[' + timeLeft + '] Waiting for Lesson Duration');
          return;
        }
      }

      // Complete lesson and go to next
      lesson.complete();
      completeMS += MESSAGE_DURATION_MS + delayMs + durationMs;
      lessonIdx++;
      updateScheduleState();

      // End lesson, if lesson index is over the queues length
      if (lessonIdx == lessons.length) {
        canceled = true;
        clearTimeout(to);
        stopHit = false;
        $('#cheat-button').css('color', 'black');
        $('#cheat-button').html('Done');
        $('#cheat-info-state').html('[00:00:00] Done!');
        $('#cheat-info-time').html('[00:00:00]');
      }
    }
  }

  function formatMs(ms) {
    let seconds = Math.floor(Math.max(ms, 0) / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let hoursString = String(hours).padStart(2, '0');
    let minutesString = String(minutes % 60).padStart(2, '0');
    let secondsString = String(seconds % 60).padStart(2, '0');
    return hoursString + ':' + minutesString + ':' + secondsString;
  }

  function updateScheduleState() {
    let done = '';
    let current = '';
    let undone = '';
    for (let i = 0; i < lessonIdx; i++) done += (i > 0 ? ' ' : '') + lessons[i].lessonId;
    current = lessonIdx < lessons.length ? String(lessons[lessonIdx].lessonId) : '';
    for (let i = lessonIdx + 1; i < lessons.length; i++) undone += (i > 0 ? ' ' : '') + lessons[i].lessonId;
    if (done.length > 0) {
      done = '<span class="cheat-lessons-done">' + done + '</span> ';
    }
    if (current.length > 0) {
      current = '<span class="cheat-lesson-current">' + current + '</span>';
    }
    if (undone.length > 0) {
      undone = ' <span class="cheat-lessons-undone">' + undone + '</span>';
    }
    $('#cheat-info-lessons').html(done + current + undone);
  }

  function Lesson(targetStrokesP10M, targetErrorPct, delayM, durationM, lessonId) {
    this.delayM = delayM;
    this.durationM = durationM;
    this.lessonId = lessonId;
    this.completed = false;

    this.complete = function () {
      if (this.completed) throw new Error('Tried to complete already completed lesson!');

      this.completed = true;

      let targetStrokeCount = Math.floor((targetStrokesP10M * durationM) / 10);

      // Generate error indices
      let errorIndices = new Array(targetStrokeCount);
      for (let i = 0; i < errorIndices.length; i++) errorIndices[i] = i;
      for (let j, x, i = errorIndices.length; i; j = parseInt(Math.random() * i), x = errorIndices[--i], errorIndices[i] = errorIndices[j], errorIndices[j] = x);
      errorIndices = errorIndices.slice(0, (targetStrokeCount * targetErrorPct) / 100);

      // Make lesson text request
      TIPP10.main._t131(`/${language}/training/data/init/0/0/${lessonId}/0/`, function (req) {
        let data = JSON.parse(req.responseText);

        let layoutStrokes = data.layout; // Stroke count info
        let lines = data.lesson.split('\n'); // Lines of this lesson
        let keyboardLayout = data.settings.user_keyboard; // Selected keyboard layout

        // Type lines
        let charCount = 0;
        let strokeCount = 0;
        let errorCount = 0;
        let errorString = '';

        let p_e = {};

        let p_lc = '';

        let line;
        typeLoop: while (true) {
          // Get new random line that is not equal to the last
          // one, if the lesson consists of multiple lines
          if (lines.length > 1) {
            let newLine = line;
            while (newLine === line) {
              newLine = lines[Math.floor(Math.random() * lines.length)];
            }
            line = newLine;
          }

          // Type every character and a pilcrow sign
          let realLine = line + '\u00B6';
          for (let i = 0; i < realLine.length; i++) {
            let c = realLine[i];

            // Type error
            if (errorIndices.includes(charCount)) {
              let ec = generateError(realLine, i, c);

              get(ec).ea++;
              get(c).et++;
              errorCount++;
              addChar(ec);
              errorString += '1';
            }

            get(c).eo++;
            charCount++;
            addChar(c);
            errorString += '0';

            // Exit type loop if the target stroke count is reached
            if (strokeCount >= targetStrokeCount) break typeLoop;
          }
        }

        // Generates an authentic error for a character
        function generateError(line, i, c) {
          let doubled = 0.3; // Chances to type the last character
          let switched1 = 0.3; // Chances to type the next character
          let switched2 = 0.1; // Chances to type the next next character
          if (Math.random() < doubled && i > 0 && line[i - 1] !== c) {
            return line[i - 1];
          } else if (Math.random() < switched1 && i + 1 < line.length && line[i + 1] !== c) {
            return line[i + 1];
          } else if (Math.random() < switched2 && i + 2 < line.length && line[i + 2] !== c) {
            return line[i + 2];
          } else {
            let map = KEY_NEIGHBOR_MAPS[keyboardLayout] || KEY_NEIGHBOR_MAPS.def;
            let choices = map[c] || 'abcdefghijklmnopqrstuvwxyz ,.1234567890'; // cspell:disable-line
            let upper = c.toUpperCase();
            if (upper === c) choices += upper + upper;
            let error = c;
            let tries = 0;
            while (error === c) {
              error = choices[Math.floor(Math.random() * choices.length)];
              // Can't find error, so just return space or a, depending on which is an error
              if (tries++ > 50) return c === ' ' ? 'a' : ' ';
            }
            return error;
          }
        }

        // Adds a char to the lesson
        function addChar(c) {
          let code = c.charCodeAt(0);
          if (layoutStrokes[code][1] != 0) strokeCount++;
          if (layoutStrokes[code][2] != 0) strokeCount++;
          strokeCount++;
          p_lc += c;
        }

        // Gets occurrence and error stats object for character
        function get(c) {
          let code = c.charCodeAt(0);
          if (!p_e[code]) {
            p_e[code] = {
              eo: 0,
              et: 0,
              ea: 0,
            };
          }
          return p_e[code];
        }

        let p_r = {
          csrf: data.csrf,

          // Lesson stats
          l: String(lessonId),
          ta: 0, // lesson task (?)
          t: durationM * 60,
          c: charCount,
          s: strokeCount,
          e: errorCount,
          le: errorString,

          // Lesson settings
          tt: 'ticker', // (?)
          dt: 0, // duration type, 0 = time
          dv: String(durationM), // duration value
          ec: 1, // error correction type, 1 = retype
          eb: 0, // (?)
          es: 0, // (?)
          ak: 0, // (?)
          ac: 0, // (?)
          ah: 0, // (?)
          ap: 0, // (?)
          ab: 0, // (?)
          ai: 1, // (?)
          am: 0, // (?)
        };

        let p_ls = ''; // (?)

        // Make result request
        let r = JSON.stringify(p_r);
        let e = JSON.stringify(p_e);
        let lc = encodeURIComponent(p_lc);
        let ls = encodeURIComponent(p_ls);
        TIPP10.main._t131(`/${language}/training/data/result/`, () => {}, `r=${r}&e=${e}&lc=${lc}&ls=${ls}`);
      });
    };
  }
})();
