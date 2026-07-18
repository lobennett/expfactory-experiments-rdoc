/* ************************************ */
/* Roundtable Proof-of-Human — invisible bot/human classification (rt.js).
   Injected here because expfactory assembles the page from config.json's
   run-list (src-only script tags); this carries the required data-site-key
   attribute and a per-task data-tags for dashboard filtering. */
(function () {
  if (window.__roundtableInjected) return;
  window.__roundtableInjected = true;
  var s = document.createElement("script");
  s.src = "https://cdn.roundtable.ai/v1/rt.js";
  s.setAttribute("data-site-key", "pub-2rS0iJL0dtTNoNyPTpvm");
  s.setAttribute("data-tags", "n_back_rdoc");
  (document.head || document.documentElement).appendChild(s);
})();
/* ************************************ */

/* ************************************ */
/*       Define Helper Functions        */
/* ************************************ */
// PARAMETERS FOR DECAYING EXPONENTIAL FUNCTION
var meanITI = 0.5;

function sampleFromDecayingExponential() {
  // Decay parameter of the exponential distribution λ = 1 / μ
  var lambdaParam = 1 / meanITI;
  var minValue = 0;
  var maxValue = 5;

  /**
   * Sample one value with replacement
   * from a decaying exponential distribution within a specified range.
   *
   * @param {number} lambdaParam
   * - The decay parameter lambda of the exponential distribution.
   * @param {number} minValue - The minimum value of the range.
   * @param {number} maxValue - The maximum value of the range.
   * @returns {number}
   * A single value sampled from the decaying
   * exponential distribution within the specified range.
   */
  var sample;
  do {
    sample = -Math.log(Math.random()) / lambdaParam;
  } while (sample < minValue || sample > maxValue);
  return sample;
}

function shuffleChecksArray(array) {
  // Create a copy of the original array
  const shuffledArray = [...array];

  // Perform Fisher-Yates shuffle
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
}

function createConditionsArray(expLen) {
  let array = new Array(expLen).fill("mismatch");

  function sampleWithReplacement(array, sampleCount) {
    let sampledValues = [];
    for (let i = 0; i < sampleCount; i++) {
      let randomIndex = Math.floor(Math.random() * array.length);
      sampledValues.push(array[randomIndex]);
    }
    return sampledValues;
  }

  function setMatchesInChunk(chunk, count, excludedIndex) {
    let indicesSet = new Set([excludedIndex]);
    for (let i = 0; i < count; i++) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * 12);
      } while (indicesSet.has(randomIndex));
      chunk[randomIndex] = "match";
      indicesSet.add(randomIndex);
    }
  }

  let firstDelays = [0, 24, 48, 72, 96];
  let secondDelays = [12, 36, 60, 84, 108];

  let firstDelaysSample = sampleWithReplacement(firstDelays, 7);
  let secondDelaysSample = sampleWithReplacement(secondDelays, 7);

  for (let i = 0; i < array.length; i += 12) {
    let chunk = array.slice(i, i + 12);
    let randomIndex1 = Math.floor(Math.random() * 12);
    chunk[randomIndex1] = "match";

    if (firstDelays.includes(i)) {
      let count = firstDelaysSample.filter(x => x === i).length;
      setMatchesInChunk(chunk, count, randomIndex1);
    } else if (secondDelays.includes(i)) {
      let count = secondDelaysSample.filter(x => x === i).length;
      setMatchesInChunk(chunk, count, randomIndex1);
    }

    for (let j = 0; j < chunk.length; j++) {
      array[i + j] = chunk[j];
    }
  }

  return array;
}

const getCurrAttentionCheckQuestion = () =>
  `${currentAttentionCheckData.Q} <div class=block-text>This screen will advance automatically in 15 seconds. Do not press shift.</div>`;

const getCurrAttentionCheckAnswer = () => currentAttentionCheckData.A;

var attentionCheckData = [
  // key presses
  {
    Q: "<p class='block-text'>Press the q key</p>",
    A: 81,
  },
  {
    Q: "<p class='block-text'>Press the p key</p>",
    A: 80,
  },
  {
    Q: "<p class='block-text'>Press the r key</p>",
    A: 82,
  },
  {
    Q: "<p class='block-text'>Press the s key</p>",
    A: 83,
  },
  {
    Q: "<p class='block-text'>Press the t key</p>",
    A: 84,
  },
  {
    Q: "<p class='block-text'>Press the j key</p>",
    A: 74,
  },
  {
    Q: "<p class='block-text'>Press the k key</p>",
    A: 75,
  },
  {
    Q: "<p class='block-text'>Press the e key</p>",
    A: 69,
  },
  {
    Q: "<p class='block-text'>Press the m key</p>",
    A: 77,
  },
  {
    Q: "<p class='block-text'>Press the i key</p>",
    A: 73,
  },
  {
    Q: "<p class='block-text'>Press the u key</p>",
    A: 85,
  },
  // alphabet
  // start
  {
    Q: "<p class='block-text'>Press the key for the first letter of the English alphabet.</p>",
    A: 65,
  },
  {
    Q: "<p class='block-text'>Press the key for the second letter of the English alphabet.</p>",
    A: 66,
  },
  {
    Q: "<p class='block-text'>Press the key for the third letter of the English alphabet.</p>",
    A: 67,
  },
  // end
  {
    Q: "<p class='block-text'>Press the key for the third to last letter of the English alphabet.</p>",
    A: 88,
  },
  {
    Q: "<p class='block-text'>Press the key for the second to last letter of the English alphabet.</p>",
    A: 89,
  },
  {
    Q: "<p class='block-text'>Press the key for the last letter of the English alphabet.</p>",
    A: 90,
  },
];

const getExpStage = () => expStage;

const getInstructFeedback = () =>
  `<div class="centerbox"><p class="center-block-text">${feedbackInstructText}</p></div>`;

const getFeedback = () =>
  `<div class="bigbox"><div class="picture_box"><p class="block-text">${feedbackText}</p></div></div>`;

var randomDraw = function (lst) {
  var index = Math.floor(Math.random() * lst.length);
  return lst[index];
};

var createTrialTypes = function (blockLen, delay, exp_stage) {
  stims = [];
  firstStims = [];
  var correctResponse;
  var nbackCondition;

  for (var i = 0; i < delay; i++) {
    nbackCondition = "N/A";
    probe = randomDraw(letters);
    correctResponse = possibleResponses[1][1];

    firstStim = {
      condition: nbackCondition,
      probe: probe,
      correct_response: correctResponse,
      delay: delay,
    };
    firstStims.push(firstStim);
  }
  stims = [];

  if (exp_stage == "practice") {
    for (
      var numIterations = 0;
      numIterations < blockLen / nbackConditions.length;
      numIterations++
    ) {
      for (
        var numNBackConds = 0;
        numNBackConds < nbackConditions.length;
        numNBackConds++
      ) {
        nbackCondition = nbackConditions[numNBackConds];

        stim = {
          condition: nbackCondition,
          correct_response:
            nbackCondition == "match"
              ? possibleResponses[0][1]
              : possibleResponses[1][1],
        };
        stims.push(stim);
      }
    }
  } else {
    for (var i = 0; i < blockLen; i++) {
      nbackCondition = testNBackConditions.shift();

      stim = {
        condition: nbackCondition,
        correct_response:
          nbackCondition == "match"
            ? possibleResponses[0][1]
            : possibleResponses[1][1],
      };
      stims.push(stim);
    }
  }

  stims = shuffleArray(stims);
  stims = firstStims.concat(stims);

  stimLen = stims.length;

  newStims = [];
  for (i = 0; i < stimLen; i++) {
    if (i < delay) {
      stim = stims.shift();
      nbackCondition = stim.condition;
      probe = stim.probe;
      correctResponse = stim.correct_response;
      delay = stim.delay;
    } else {
      stim = stims.shift();
      nbackCondition = stim.condition;

      if (nbackCondition == "match") {
        probe = randomDraw([
          newStims[i - delay].probe.toUpperCase(),
          newStims[i - delay].probe.toLowerCase(),
        ]);

        correctResponse = possibleResponses[0][1];
      } else if (nbackCondition == "mismatch") {
        probe = randomDraw(
          "bBdDgGtTvV".split("").filter(function (y) {
            return (
              $.inArray(y, [
                newStims[i - delay].probe.toLowerCase(),
                newStims[i - delay].probe.toUpperCase(),
              ]) == -1
            );
          })
        );

        correctResponse = possibleResponses[1][1];
      }
    }

    stim = {
      condition: nbackCondition,
      probe: probe,
      correct_response: correctResponse,
      delay: delay,
    };

    newStims.push(stim);
  }

  return newStims;
};

var getStim = function () {
  stim = stims.shift();
  nbackCondition = stim.condition;
  probe = stim.probe;
  correctResponse = stim.correct_response;
  delay = stim.delay;

  if (probe == probe.toUpperCase()) {
    letterCase = "uppercase";
  } else if (probe == probe.toLowerCase()) {
    letterCase = "lowercase";
  }

  return (
    taskBoards[0] +
    preFileType +
    letterCase +
    "_" +
    probe.toUpperCase() +
    fileTypePNG +
    taskBoards[1]
  );
};

const getCurrBlockNum = () =>
  getExpStage() === "practice" ? practiceCount : testCount;

var appendData = function () {
  var currentTrial = jsPsych.data.get().last().trials[0];

  var correctTrial = 0;
  if (currentTrial.response == correctResponse) {
    correctTrial = 1;
  }

  jsPsych.data.get().addToLast({
    condition: nbackCondition,
    probe: probe,
    correct_response: correctResponse,
    delay: delay,
    letter_case: letterCase,
    correct_trial: correctTrial,
    block_num: getExpStage() == "practice" ? practiceCount : testCount,
  });
};

/* ************************************ */
/*    Define Experimental Variables     */
/* ************************************ */
// common variables
const fixationDuration = 500;
var possibleResponses;

function getKeyMappingForTask(group_index) {
  // Adjust group index to use values from 0 to 14.
  // Oversampling adjustments:
  // - For group indices 0 to 4: use index for "mismatch" and middle for "match"
  // - For group indices 5 to 14: use index for "match" and middle for "mismatch"
  if (0 <= group_index && group_index <= 4) {
    // Mapping for "mismatch" - Index and "match" - Middle
    possibleResponses = [
      ["middle finger", ".", "period key (.)"],
      ["index finger", ",", "comma key (,)"],
    ];
  } else if (5 <= group_index && group_index <= 14) {
    // Mapping for "match" - Index and "mismatch" - Middle
    possibleResponses = [
      ["index finger", ",", "comma key (,)"],
      ["middle finger", ".", "period key (.)"],
    ];
  } else {
    throw new Error("Group index out of bounds");
  }
}

var group_index = window.efVars?.group_index ?? 1;

getKeyMappingForTask(group_index);

const choices = [possibleResponses[0][1], possibleResponses[1][1]];

var endText = `
  <div class="centerbox">
    <p class="center-block-text">Thanks for completing this task!</p>
    <p class="center-block-text">Press <i>enter</i> to continue.</p>
  </div>
`;

var feedbackInstructText = `
  <p class="center-block-text">
    Welcome! This experiment will take around 10 minutes.
  </p>
  <p class="center-block-text">
    To avoid technical issues, please keep the experiment tab (on Chrome or Firefox) active and in fullscreen mode for the whole duration of each task.
  </p>
  <p class="center-block-text"> Press <i>enter</i> to begin.</p>
`;

var expStage = "practice";
var letters = "bBdDgGtTvV".split("");

// *: Timing
const stimStimulusDuration = 1000;
const stimTrialDuration = 1500;

// generic task variables
var runAttentionChecks = true;
var sumInstructTime = 0; // ms
var instructTimeThresh = 5;

var expLen = 120;
var practiceLen = 5;
var numTrialsPerBlock = 12;
var numTestBlocks = expLen / numTrialsPerBlock; //  10 test blocks total
var practiceThresh = 3;

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

var delays = shuffleArray([1, 2]);

delays = [...delays, ...delays, ...delays, ...delays, ...delays];

var delay = 1;
var nbackConditions = ["match", "mismatch", "mismatch", "mismatch", "mismatch"];

var stims = createTrialTypes(practiceLen, delay, "practice");

var accuracyThresh = 0.8;
var practiceAccuracyThresh = 0.8;
var rtThresh = 750;
var missedResponseThresh = 0.1;

var pathSource = "/static/experiments/n_back_rdoc/images/";
var fileTypePNG = ".png'></img>";
var preFileType =
  "<img class = center src='/static/experiments/n_back_rdoc/images/";

var promptTextList = `
  <ul style="text-align:left;">
    <li>Match the current letter to the letter that appeared some number of trials ago</li>
    <li>${
      possibleResponses[0][0] === "index finger" ? "Match" : "Mismatch"
    }: comma key (,)</li>
    <li>${
      possibleResponses[0][0] === "index finger" ? "Mismatch" : "Match"
    }: period key (.)</li>
  </ul>
`;

var getPromptText = function () {
  return `
    <div class="prompt_box">
      <p class="center-block-text" style="font-size:16px; line-height:80%;">Match the current letter to the letter that appeared ${delay} ${
    delay === 1 ? "trial" : "trials"
  } ago.</p>
      <p class="center-block-text" style="font-size:16px; line-height:80%;">${
        possibleResponses[0][0] === "index finger" ? "Match" : "Mismatch"
      }: comma key (,)</p>
      <p class="center-block-text" style="font-size:16px; line-height:80%;">${
        possibleResponses[0][0] === "index finger" ? "Mismatch" : "Match"
      }: period key (.)</p>
    </div>
  `;
};

var speedReminder =
  "<p class = block-text>Try to respond as quickly and accurately as possible.</p>";

var pageInstruct = [
  `
  <div class="centerbox">
    <p class="block-text">Place your <b>index finger</b> on the <b>comma key (,)</b> and your <b>middle finger</b> on the <b>period key (.)</b></p>
    <p class="block-text">During this task, on each trial you will see a letter.</p>
    <p class="block-text">Your task is to match the current letter to the letter that appeared either 1 or 2 trials ago, depending on the delay given to you for that block.</p>
    <p class="block-text">Press your <b>index finger</b> if the letters <b>${
      possibleResponses[0][0] === "index finger" ? "match" : "mismatch"
    }</b>, and your <b>middle finger</b> if they <b>${
    possibleResponses[0][0] === "index finger" ? "mismatch" : "match"
  }</b>.</p>
    <p class="block-text">Your delay (the number of trials ago to which you compare the current letter) will change from block to block. You will be given the delay at the start of every block of trials.</p>
    <p class="block-text">Capitalization does not matter, so "T" matches with "t".</p>
  </div>
  `,
  `
  <div class="centerbox">
    <p class="block-text"><b>Your delay for this practice round is ${delay}</b>.</p>
    <p class="block-text">For blocks with a delay of <b>${delay}</b>, please respond <b>mismatch</b> for the <b>first ${
    delay === 1 ? "trial" : "two trials"
  }</b>.</p>
    <p class="block-text">We'll start with a practice round. During practice, you will receive feedback and a reminder of the rules. These will be taken out for the test, so make sure you understand the instructions before moving on.</p>
    ${speedReminder}
  </div>
  `,
];

// IMAGES TO PRELOAD
var pathSource = "/static/experiments/n_back_rdoc/images/";
var lettersPreload = ["B", "D", "G", "T", "V"];
var casePreload = ["lowercase", "uppercase"];
var images = [];

for (i = 0; i < lettersPreload.length; i++) {
  for (x = 0; x < casePreload.length; x++) {
    images.push(pathSource + casePreload[x] + "_" + lettersPreload[i] + ".png");
  }
}
// preload them later when we have access to jsPsych variable

/* ************************************ */
/*          Define Game Boards          */
/* ************************************ */

var taskBoards = [
  "<div class = bigbox><div class = centerbox><div class = gng_number><div class = cue-text>",
  "</div></div></div></div>",
];

/* ************************************ */
/*        Set up jsPsych blocks         */
/* ************************************ */
var attentionCheckData = shuffleChecksArray(attentionCheckData);
var currentAttentionCheckData = attentionCheckData.shift();

// Set up attention check node
var attentionCheckBlock = {
  type: jsPsychAttentionCheckRdoc,
  data: {
    trial_id: "test_attention_check",
    trial_duration: 15000,
    timing_post_trial: 1000,
    exp_stage: "test",
  },
  question: getCurrAttentionCheckQuestion,
  key_answer: getCurrAttentionCheckAnswer,
  response_ends_trial: true,
  timing_post_trial: 1000,
  trial_duration: 15000,
  on_finish: data => (data["block_num"] = testCount),
};

var attentionNode = {
  timeline: [attentionCheckBlock],
  conditional_function: function () {
    return runAttentionChecks;
  },
};

var feedbackInstructBlock = {
  type: jsPsychHtmlKeyboardResponse,
  data: {
    trial_id: "instruction_feedback",
    trial_duration: 30000,
  },
  choices: ["Enter"],
  stimulus: getInstructFeedback,
  trial_duration: 30000,
};

var feedbackInstructBlock = {
  type: jsPsychHtmlKeyboardResponse,
  choices: ["Enter"],
  stimulus: getInstructFeedback,
  data: {
    trial_id: "instruction_feedback",
    trial_duration: 30000,
  },
  trial_duration: 30000,
};

var sumInstructTime = 0; // ms
var instructionPages = pageInstruct;
var instructionsBlock = [];
var instructTimers = [];

function createInstructionTrial(pageIndex) {
  return {
    type: jsPsychInstructions,
    pages: [instructionPages[pageIndex]], // Show one page at a time
    show_clickable_nav: true,
    allow_keys: false,
    data: {
      exp_id: expID,
      trial_id: "instructions",
      page_index: pageIndex,
      stimulus: instructionPages[pageIndex],
    },
    on_load: function () {
      // Set timeout for auto-advance
      const timer = setTimeout(() => {
        jsPsych.finishTrial();
      }, 60000); // 60 seconds per page
      instructTimers.push(timer);
    },
    on_finish: function (data) {
      // Clear all active timers
      instructTimers.forEach(t => clearTimeout(t));
      instructTimers = [];
      if (data.rt != null) {
        sumInstructTime += data.rt;
      }
    },
  };
}

// Push all instruction pages as separate timed trials
for (var i = 0; i < instructionPages.length; i++) {
  instructionsBlock.push(createInstructionTrial(i));
}

// Combine feedback + instruction pages into node
var instructionNode = {
  timeline: [feedbackInstructBlock, ...instructionsBlock],
  loop_function: function (data) {
    sumInstructTime = 0;
    for (var i = 0; i < data.trials.length; i++) {
      var trial = data.trials[i];
      if (trial.trial_id === "instructions") {
        if (trial.rt != null) {
          sumInstructTime += trial.rt;
        } else {
          sumInstructTime += 60000;
        }
      }
    }
    if (sumInstructTime <= instructTimeThresh * 1000) {
      feedbackInstructText =
        "<p class=block-text>Read through instructions too quickly. Please take your time and make sure you understand the instructions.</p><p class=block-text>Press <i>enter</i> to continue.</p>";
      sumInstructTime = 0; // Reset in case they loop
      return true;
    } else {
      feedbackInstructText =
        "<p class=block-text>Done with instructions. Press <i>enter</i> to continue.</p>";
      return false;
    }
  },
};

var fixationBlock = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "<div class = centerbox><div class = fixation>+</div></div>",
  choices: ["NO_KEYS"],
  data: function () {
    if (getExpStage() == "practice") {
      return {
        trial_id: "practice_fixation",
        trial_duration: fixationDuration,
        stimulus_duration: fixationDuration,
        exp_stage: "practice",
        block_num: practiceCount,
      };
    } else {
      return {
        trial_id: "test_fixation",
        trial_duration: fixationDuration,
        stimulus_duration: fixationDuration,
        exp_stage: "test",
        block_num: testCount,
      };
    }
  },
  trial_duration: fixationDuration, // 500
  stimulus_duration: fixationDuration,
  prompt: function () {
    if (getExpStage() == "practice") {
      return getPromptText();
    } else {
      return "";
    }
  },
};

var feedbackText =
  "<div class = centerbox><p class = center-block-text>Press <i>enter</i> to begin practice.</p></div>";

var feedbackBlock = {
  type: jsPsychHtmlKeyboardResponse,
  data: function () {
    const stage = getExpStage();
    return {
      trial_id: `${stage}_feedback`,
      exp_stage: stage,
      trial_duration: 30000,
    };
  },
  choices: ["Enter"],
  stimulus: getFeedback,
  trial_duration: 30000,
  response_ends_trial: true,
  on_finish: data =>
    (data["block_num"] =
      getExpStage() == "practice" ? practiceCount : testCount),
};

var ITIms = null;

// *** ITI *** //
var ITIBlock = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "<div class = centerbox><div class = fixation>+</div></div>",
  is_html: true,
  choices: ["NO_KEYS"],
  data: function () {
    const stage = getExpStage();
    return {
      trial_id: `${stage}_ITI`,
      ITIParams: {
        min: 0,
        max: 5,
        mean: 0.5,
      },
      block_num: stage === "practice" ? practiceCount : testCount,
      exp_stage: stage,
    };
  },
  trial_duration: function () {
    ITIms = sampleFromDecayingExponential();
    return ITIms * 1000;
  },
  prompt: function () {
    return getExpStage() === "practice" ? getPromptText() : "";
  },
  on_finish: function (data) {
    data["trial_duration"] = ITIms * 1000;
    data["stimulus_duration"] = ITIms * 1000;
  },
};

/* ************************************ */
/*        Set up timeline blocks        */
/* ************************************ */
var practiceTrials1 = [];
var practiceTrials2 = [];
for (i = 0; i < practiceLen + 1; i++) {
  var practiceTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: getStim,
    data: {
      trial_id: "practice_trial",
      exp_stage: "practice",
      choices: choices,
      trial_duration: stimTrialDuration,
      stimulus_duration: stimStimulusDuration,
    },
    choices: choices,
    stimulus_duration: stimStimulusDuration, // 1000
    trial_duration: stimTrialDuration, // 1500
    response_ends_trial: false,
    prompt: getPromptText,
    on_finish: appendData,
  };

  var practiceFeedbackBlock = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
      var last = jsPsych.data.get().last(1).values()[0];
      if (last.response == null) {
        return "<div class=center-box><div class=center-text><font size =20>Respond Faster!</font></div></div>";
      } else if (last.correct_trial == 1) {
        return "<div class=center-box><div class=center-text><font size =20>Correct!</font></div></div>";
      } else {
        return "<div class=center-box><div class=center-text><font size =20>Incorrect</font></div></div>";
      }
    },
    data: function () {
      return {
        exp_stage: "practice",
        trial_id: "practice_feedback",
        trial_duration: 500,
        stimulus_duration: 500,
        block_num: practiceCount,
      };
    },
    choices: ["NO_KEYS"],
    stimulus_duration: 500,
    trial_duration: 500,
    prompt: getPromptText,
  };

  practiceTrials1.push(
    fixationBlock,
    practiceTrial,
    practiceFeedbackBlock,
    ITIBlock
  );
}
for (i = 0; i < practiceLen + 2; i++) {
  var practiceTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: getStim,
    data: {
      trial_id: "practice_trial",
      exp_stage: "practice",
      choices: choices,
      trial_duration: stimTrialDuration,
      stimulus_duration: stimStimulusDuration,
    },
    choices: choices,
    stimulus_duration: stimStimulusDuration, // 1000
    trial_duration: stimTrialDuration, // 1500
    response_ends_trial: false,
    prompt: getPromptText,
    on_finish: appendData,
  };

  var practiceFeedbackBlock = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
      var last = jsPsych.data.get().last(1).values()[0];
      if (last.response == null) {
        return "<div class = fb_box><div class = center-text><font size =20>Respond Faster!</font></div></div>";
      } else if (last.correct_trial == 1) {
        return "<div class = fb_box><div class = center-text><font size =20>Correct!</font></div></div>";
      } else {
        return "<div class = fb_box><div class = center-text><font size =20>Incorrect</font></div></div>";
      }
    },
    data: function () {
      return {
        exp_stage: "practice",
        trial_id: "practice_feedback",
        trial_duration: 500,
        stimulus_duration: 500,
        block_num: practiceCount,
      };
    },
    choices: ["NO_KEYS"],
    stimulus_duration: 500,
    trial_duration: 500,
    prompt: getPromptText,
  };

  practiceTrials2.push(
    fixationBlock,
    practiceTrial,
    practiceFeedbackBlock,
    ITIBlock
  );
}

var practiceCount = 0;
var practiceNode1 = {
  timeline: [feedbackBlock].concat(practiceTrials1),
  loop_function: function (data) {
    practiceCount += 1;

    var sumRT = 0;
    var sumResponses = 0;
    var correct = 0;
    var totalTrials = 0;
    for (var i = 0; i < data.trials.length; i++) {
      if (
        data.trials[i].trial_id == "practice_trial" &&
        data.trials[i].block_num == getCurrBlockNum() - 1
      ) {
        totalTrials += 1;
        if (data.trials[i].rt != null) {
          sumRT += data.trials[i].rt;
          sumResponses += 1;
          if (data.trials[i].response == data.trials[i].correct_response) {
            correct += 1;
          }
        }
      }
    }

    var accuracy = correct / totalTrials;
    var missedResponses = (totalTrials - sumResponses) / totalTrials;
    var avgRT = sumRT / sumResponses;

    if (accuracy >= practiceAccuracyThresh || practiceCount == practiceThresh) {
      delay = 2;
      feedbackText = `
        <div class="centerbox">
          <p class="center-block-text"><b>We will now start practice for a delay of ${delay}.</b></p>
            <p class="block-text">For blocks with a delay of <b>${delay}</b>, please respond <b>mismatch</b> for the <b>first ${
        delay === 1 ? "trial" : "two trials"
      }</b>.</p>
                  <p class="block-text">Keep your <b>index finger</b> on the <b>comma key (,)</b> and your <b>middle finger</b> on the <b>period key (.)</b></p>

          <p class="block-text">Please match the current letter to the letter that appeared <b>${delay}</b> ${
        delay === 1 ? "trial" : "trials"
      } ago.</p>
          <p class="block-text">Capitalization does not matter, so "T" matches with "t".</p>
          <p class="block-text">Press <i>enter</i> to continue.</p>
        </div>
      `;

      stims = createTrialTypes(practiceLen, delay, "practice");
      practiceCount = 0;
      return false;
    } else {
      feedbackText =
        "<div class = centerbox><p class = block-text>Please take this time to read your feedback! This screen will advance automatically in 30 seconds.</p>";

      if (accuracy < practiceAccuracyThresh) {
        feedbackText += `
        <p class="block-text">Your accuracy is low. Remember:</p>
       ${promptTextList}
      `;
      }

      if (avgRT > rtThresh) {
        feedbackText += `
     <p class="block-text">You have been responding too slowly.</p>
      ${speedReminder}
      `;
      }

      if (missedResponses > missedResponseThresh) {
        feedbackText += `
    <p class="block-text">You have not been responding to some trials. Please respond on every trial that requires a response.</p>
      `;
      }

      feedbackText +=
        `<p class="block-text">We are now going to repeat the practice round.</p>` +
        `<p class="block-text">Press <i>enter</i> to begin.</p></div>`;

      stims = createTrialTypes(practiceLen, delay, "practice");
      return true;
    }
  },
};
var practiceNode2 = {
  timeline: [feedbackBlock].concat(practiceTrials2),
  loop_function: function (data) {
    practiceCount += 1;

    var sumRT = 0;
    var sumResponses = 0;
    var correct = 0;
    var totalTrials = 0;

    for (var i = 0; i < data.trials.length; i++) {
      if (
        data.trials[i].trial_id == "practice_trial" &&
        data.trials[i].block_num == getCurrBlockNum() - 1
      ) {
        totalTrials += 1;
        if (data.trials[i].rt != null) {
          sumRT += data.trials[i].rt;
          sumResponses += 1;
          if (data.trials[i].response == data.trials[i].correct_response) {
            correct += 1;
          }
        }
      }
    }

    var accuracy = correct / totalTrials;
    var missedResponses = (totalTrials - sumResponses) / totalTrials;
    var avgRT = sumRT / sumResponses;

    if (accuracy >= practiceAccuracyThresh || practiceCount == practiceThresh) {
      expStage = "test";
      delay = delays.shift();
      feedbackText = `
      <div class="centerbox">
        <p class="center-block-text">We will now start the test portion.</p>
        <p class="block-text">Keep your <b>index finger</b> on the <b>comma key (,)</b> and your <b>middle finger</b> on the <b>period key (.)</b></p>
        <p class="block-text"><b>Your delay for this block is ${delay}</b>. Please match the current letter to the letter that appeared <b>${delay}</b> ${
        delay === 1 ? "trial" : "trials"
      } ago.</p>
        <p class="block-text">Capitalization does not matter, so "T" matches with "t".</p>
        <p class="block-text">Press <i>enter</i> to continue.</p>
      </div>
    `;

      stims = createTrialTypes(numTrialsPerBlock, delay, "test");

      return false;
    } else {
      feedbackText =
        "<div class = centerbox><p class = block-text>Please take this time to read your feedback! This screen will advance automatically in 30 seconds.</p>";

      if (accuracy < practiceAccuracyThresh) {
        feedbackText += `
        <p class="block-text">Your accuracy is low. Remember:</p>
        ${promptTextList}
      `;
      }

      if (avgRT > rtThresh) {
        feedbackText += `
        <p class="block-text">You have been responding too slowly.</p>
        ${speedReminder}
      `;
      }

      if (missedResponses > missedResponseThresh) {
        feedbackText += `
        <p class="block-text">You have not been responding to some trials. Please respond on every trial that requires a response.</p>
      `;
      }

      feedbackText += `<p class=block-text>We are now going to repeat the practice round.</p>
        <p class=block-text>Press <i>enter</i> to begin.</p>
        </div>`;

      stims = createTrialTypes(practiceLen, delay, "practice");
      return true;
    }
  },
};

var testTrials1 = [];
testTrials1.push(attentionNode);
for (i = 0; i < numTrialsPerBlock + 1; i++) {
  var testTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: getStim,
    data: {
      trial_id: "test_trial",
      exp_stage: "test",
      choices: choices,
      trial_duration: stimTrialDuration,
      stimulus_duration: stimStimulusDuration,
    },
    choices: choices,
    stimulus_duration: stimStimulusDuration, // 1000
    trial_duration: stimTrialDuration, // 1500
    response_ends_trial: false,
    on_finish: appendData,
  };
  testTrials1.push(fixationBlock, testTrial, ITIBlock);
}
var testTrials2 = [];
testTrials2.push(attentionNode);
for (i = 0; i < numTrialsPerBlock + 2; i++) {
  var testTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: getStim,
    data: {
      trial_id: "test_trial",
      exp_stage: "test",
      choices: choices,
      trial_duration: stimTrialDuration,
      stimulus_duration: stimStimulusDuration,
    },
    choices: choices,
    stimulus_duration: stimStimulusDuration, // 1000
    trial_duration: stimTrialDuration, // 1500
    response_ends_trial: false,
    on_finish: appendData,
  };
  testTrials2.push(fixationBlock, testTrial, ITIBlock);
}

var testCount = 0; // global
var testNode1 = {
  timeline: [feedbackBlock].concat(testTrials1),
  loop_function: function (data) {
    testCount += 1;

    var sumRT = 0;
    var sumResponses = 0;
    var correct = 0;
    var totalTrials = 0;

    for (var i = 0; i < data.trials.length; i++) {
      if (
        data.trials[i].trial_id == "test_trial" &&
        data.trials[i].block_num == getCurrBlockNum() - 1
      ) {
        totalTrials += 1;
        if (data.trials[i].rt != null) {
          sumRT += data.trials[i].rt;
          sumResponses += 1;
          if (data.trials[i].response == data.trials[i].correct_response) {
            correct += 1;
          }
        }
      }
    }

    var accuracy = correct / totalTrials;
    var missedResponses = (totalTrials - sumResponses) / totalTrials;
    var avgRT = sumRT / sumResponses;

    currentAttentionCheckData = attentionCheckData.shift(); // Shift the first object from the array

    if (testCount == numTestBlocks) {
      feedbackText = `<div class=centerbox>
        <p class=block-text>Done with this task.</p>
        <p class=centerbox>Press <i>enter</i> to continue.</p>
        </div>`;

      return false;
    } else {
      delay = delays.shift();

      feedbackText =
        "<div class = centerbox><p class = block-text>Please take this time to read your feedback! This screen will advance automatically in 30 seconds.</p>";

      feedbackText += `<p class=block-text>You have completed ${testCount} out of ${numTestBlocks} blocks of trials.</p>`;

      if (accuracy < accuracyThresh) {
        feedbackText += `
        <p class="block-text">Your accuracy is low. Remember:</p>
        ${promptTextList}
      `;
      }

      if (avgRT > rtThresh) {
        feedbackText += `
        <p class="block-text">You have been responding too slowly.</p>
        ${speedReminder}
      `;
      }

      if (missedResponses > missedResponseThresh) {
        feedbackText += `
        <p class="block-text">You have not been responding to some trials. Please respond on every trial that requires a response.</p>
      `;
      }

      feedbackText += `<p class=block-text><b>Your delay for this next block is ${delay}</b>.</p>`;

      feedbackText +=
        "<p class=block-text>Press <i>enter</i> to continue.</p>" + "</div>";

      stims = createTrialTypes(numTrialsPerBlock, delay, "test");
      return false;
    }
  },
  on_timeline_finish: function () {
    window.dataSync();
  },
};

var testNode2 = {
  timeline: [feedbackBlock].concat(testTrials2),
  loop_function: function (data) {
    testCount += 1;

    var sumRT = 0;
    var sumResponses = 0;
    var correct = 0;
    var totalTrials = 0;

    for (var i = 0; i < data.trials.length; i++) {
      if (
        data.trials[i].trial_id == "test_trial" &&
        data.trials[i].block_num == getCurrBlockNum() - 1
      ) {
        totalTrials += 1;
        if (data.trials[i].rt != null) {
          sumRT += data.trials[i].rt;
          sumResponses += 1;
          if (data.trials[i].response == data.trials[i].correct_response) {
            correct += 1;
          }
        }
      }
    }

    var accuracy = correct / totalTrials;
    var missedResponses = (totalTrials - sumResponses) / totalTrials;
    var avgRT = sumRT / sumResponses;

    currentAttentionCheckData = attentionCheckData.shift(); // Shift the first object from the array

    if (testCount == numTestBlocks) {
      feedbackText =
        "<div class=centerbox><p class = block-text>Done with this test. Press <i>enter</i> to continue.</p></div>";

      return false;
    } else {
      delay = delays.shift();

      feedbackText =
        "<div class = centerbox><p class = block-text>Please take this time to read your feedback! This screen will advance automatically in 30 seconds.</p>";

      feedbackText += `<p class=block-text>You have completed ${testCount} out of ${numTestBlocks} blocks of trials.</p>`;

      if (accuracy < accuracyThresh) {
        feedbackText += `
        <p class="block-text">Your accuracy is low. Remember:</p>
        ${promptTextList}
      `;
      }

      if (avgRT > rtThresh) {
        feedbackText += `
        <p class="block-text">You have been responding too slowly.</p>
        ${speedReminder}
      `;
      }

      if (missedResponses > missedResponseThresh) {
        feedbackText += `
        <p class="block-text">You have not been responding to some trials. Please respond on every trial that requires a response.</p>
      `;
      }

      feedbackText += `<p class=block-text><b>Your delay for this next block is ${delay}</b>.</p>`;

      feedbackText +=
        "<p class=block-text>Press <i>enter</i> to continue.</p>" + "</div>";

      stims = createTrialTypes(numTrialsPerBlock, delay, "test");
      return false;
    }
  },
  on_timeline_finish: function () {
    window.dataSync();
  },
};

var fullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: true,
  on_finish: function (data) {
    data["group_index"] = group_index;
  },
};
var exitFullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: false,
};

// Set up post task questionnaire
var expID = "n_back_rdoc";

var endBlock = {
  type: jsPsychHtmlKeyboardResponse,
  data: {
    trial_id: "end",
    exp_id: expID,
    trial_duration: 15000,
  },
  trial_duration: 15000,
  stimulus: endText,
  choices: ["Enter"],
};

var n_back_rdoc_experiment = [];
var n_back_rdoc_init = () => {
  testNBackConditions = createConditionsArray(expLen);
  jsPsych.pluginAPI.preloadImages(images);

  n_back_rdoc_experiment.push(fullscreen);
  n_back_rdoc_experiment.push(instructionNode);
  // practice node 1 - delay 1
  n_back_rdoc_experiment.push(practiceNode1);
  // practice node 2 - delay 2
  n_back_rdoc_experiment.push(practiceNode2);
  const startingDelay = delays[0];

  if (startingDelay == 1) {
    // test node, 1 then 2
    for (var i = 0; i < numTestBlocks / 2; i++) {
      n_back_rdoc_experiment.push(testNode1);
      n_back_rdoc_experiment.push(testNode2);
    }
  } else {
    // test node, 1 then 2
    for (var i = 0; i < numTestBlocks / 2; i++) {
      n_back_rdoc_experiment.push(testNode2);
      n_back_rdoc_experiment.push(testNode1);
    }
  }
  n_back_rdoc_experiment.push(endBlock);
  n_back_rdoc_experiment.push(exitFullscreen);
};
