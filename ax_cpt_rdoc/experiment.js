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
  s.setAttribute("data-tags", "ax_cpt_rdoc");
  (document.head || document.documentElement).appendChild(s);
})();
/* ************************************ */

/* ************************************ */
/* Define helper functions */
/* ************************************ */

/* ********** ITIS ****************** */

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

function shuffleArray(array) {
  // Create a copy of the original array
  const shuffledArray = [...array];

  // Perform Fisher-Yates shuffle
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
}

/* ********** GETTERS ****************** */
const getCurrAttentionCheckQuestion = () =>
  `${currentAttentionCheckData.Q} <div class="block-text">This screen will advance automatically in 15 seconds. Do not press shift.</div>`;

const getCurrAttentionCheckAnswer = () => currentAttentionCheckData.A;

const getInstructFeedback = () =>
  `<div class="centerbox"><p class="center-block-text">${feedbackInstructText}</p></div>`;

const getFeedback = () =>
  `<div class="bigbox"><div class="picture_box"><p class="block-text">${feedbackText}</p></div></div>`;

const getCondition = () => currCondition;

const getExpStage = () => expStage;

const getCue = () => currCue;

const getStim = () => currStim;

const getCurrBlockNum = () =>
  getExpStage() === "practice" ? practiceCount : testCount;

function extractTextFromStimulus(obj) {
  // Create a temporary DOM element to parse the HTML string
  var tempDiv = document.createElement("div");
  tempDiv.innerHTML = obj.stimulus;

  // Query the desired element and return its text content
  var textElement = tempDiv.querySelector(".centerbox .AX_text");
  return textElement ? textElement.textContent : null;
}

// Data logging
function appendData() {
  var data = jsPsych.data.get().last(1).values()[0];

  correctTrial = 0;
  if (data.response == data.correct_response) {
    correctTrial = 1;
  }

  let parsedLetter = extractTextFromStimulus(data);

  jsPsych.data
    .get()
    .addToLast({ correct_trial: correctTrial, probe_letter: parsedLetter });
}

/* ********** SETTING CURRENT CUE AND STIM FROM BLOCK LIST ****************** */
var setStims = function () {
  currCondition = blockList.shift();
  const isAXorBX = currCondition === "AX" || currCondition === "BX";
  const isAXorAY = currCondition === "AX" || currCondition === "AY";

  const setAXText = letter =>
    `<div class = centerbox><div class = AX_text>${letter}</div></div>`;

  currCue = isAXorAY ? setAXText("A") : getChar();
  currStim = isAXorBX ? setAXText("X") : getChar();
};

const createHTML = char =>
  `<div class="centerbox"><div class="AX_text">${char}</div></div>`;

const getChar = () =>
  createHTML(chars[Math.floor(Math.random() * chars.length)]);

function getKeyMappingForTask(group_index) {
  // Adjust group index to use values from 0 to 14.
  // Oversampling adjustments:
  // - For group indices 0 to 4: use index for "other" and middle for "AX"
  // - For group indices 5 to 14: use index for "AX" and middle for "other"
  if (0 <= group_index && group_index <= 4) {
    // Mapping for "Other" - Index and "AX" - Middle
    possibleResponses = [
      ["middle finger", ".", "period key (.)"],
      ["index finger", ",", "comma key (,)"],
    ];
  } else if (5 <= group_index && group_index <= 14) {
    // Mapping for "AX" - Index and "Other" - Middle
    possibleResponses = [
      ["index finger", ",", "comma key (,)"],
      ["middle finger", ".", "period key (.)"],
    ];
  } else {
    throw new Error("Group index out of bounds");
  }
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
const fixationDuration = 500;
const conditionValues = ["AX", "BY", "BX", "AY"];

var group_index = window.efVars?.group_index ?? 1;

getKeyMappingForTask(group_index);

const choices = [possibleResponses[0][1], possibleResponses[1][1]];

/* ******************************* */
/* TASK TEXT */
/* ******************************* */
var endText = `
  <div class="centerbox">
    <p class="center-block-text">Thanks for completing this task!</p>
    <p class="center-block-text">Press <i>enter</i> to continue.</p>
  </div>`;

var feedbackInstructText = `
  <p class=center-block-text>
    Welcome! This experiment will take around 17 minutes.
  </p>
  <p class=center-block-text>
    To avoid technical issues,
    please keep the experiment tab (on Chrome or Firefox)
    active and fullscreen for the whole duration of each task.
  </p>
  <p class=center-block-text> Press <i>enter</i> to begin.</p>
`;

var speedReminder = `
  <p class = block-text>
    Try to respond as quickly and accurately as possible.
  </p>
`;

var feedbackText = `
  <div class = centerbox>
    <p class = center-block-text>Press <i>enter</i> to begin practice.</p>
  </div>
`;

var promptTextList = `
  <ul style="text-align:left;">
    <li>${
      possibleResponses[0][0] === "index finger" ? "A -> X" : "Anything else"
    }: comma key (,)</li>
    <li>${
      possibleResponses[0][0] === "index finger" ? "Anything else" : "A -> X"
    }: period key (.)</li>
  </ul>
`;

var promptText = `
  <div class = prompt_box>
    <p class = center-block-text style = "font-size:16px; line-height:80%;">${
      possibleResponses[0][0] === "index finger" ? "A -> X" : "Anything else"
    }: comma key (,)</p>
    <p class = center-block-text style = "font-size:16px; line-height:80%;">${
      possibleResponses[0][0] === "index finger" ? "Anything else" : "A -> X"
    }: period key (.)</p>
  </div>
`;

var pageInstruct = [
  `
  <div class = centerbox>
    <p class=block-text>Place your <b>index finger</b> on the <b>comma key (,)</b> and your <b>middle finger</b> on the <b>period key (.)</b></p>
    <p class = block-text>During this task, on each trial you will see a letter presented, a short break, and then a second letter. For instance, you may see an "A" followed by an "F".</p>
    <p class = block-text>If the first letter was an "A" <b>AND</b> the second letter is an "X", press your <b>${possibleResponses[0][0]}</b>. Otherwise, press your <b>${possibleResponses[1][0]}</b>.</p>

  </div>
  `,
  `
  <div class = centerbox>
    <p class = block-text>We'll start with a practice round. During practice, you will receive feedback and a reminder of the rules. These will be taken out for the test, so make sure you understand the instructions before moving on.</p>
    <p class = block-text>Remember, press your <b>${possibleResponses[0][0]}</b> after you see "A" followed by an "X", and your <b>${possibleResponses[1][0]}</b> for all other combinations.</p>
    ${speedReminder}
  </div>
  `,
];

/* ******************************* */
/* TIMINGS */
/* ******************************* */
var possibleResponses;

// cue
const cueStimulusDuration = 500;
const cueTrialDuration = 500;
// probe
const probeStimulusDuration = 1000;
const probeTrialDuration = 1500;

// generic task variables
var instructTimeThresh = 5;

/* ******************************* */
/* ATTENTION CHECK STUFF  */
/* ******************************* */
var runAttentionChecks = true;

/* ******************************* */
/* THRESHOLDS */
/* ******************************* */
var practiceThresh = 3; // 3 practice blocks max
var accuracyThresh = 0.8; // block-level accuracy feedback
var practiceAccuracyThresh = 0.8; // min accuracy to proceed to test
var rtThresh = 750;
var missedResponseThresh = 0.1; // get feedback if missed responses > 10% of trials

/* ******************************* */
/* Conditions/Num Trials */
/* ******************************* */
var chars = "BCDEFGHIJLMNOPQRSTUVWZ";

/* ************ CONDITION PROPORTIONS ************ */
// 4 AX: 2 BX: 2 AY: 2 BY
var trialProportions = [
  "AX",
  "AX",
  "AX",
  "AX",
  "BX",
  "BX",
  "AY",
  "AY",
  "BY",
  "BY",
];

/* ************ TASK LENGTH SETUP ************ */
var numTestBlocks = 3; // 3 test blocks - 150 trials total
var numTrialsPerBlock = trialProportions.length * 5; // 50 trials per test block
var practiceLen = trialProportions.length / 2; // 5
var currCondition = "";
var expStage = "practice";

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */

// *** FIXATION *** //
var fixation = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "<div class = centerbox><div class = fixation>+</div></div>",
  choices: ["NO_KEYS"],
  data: function () {
    const stage = getExpStage();
    return {
      trial_id: `${stage}_fixation`,
      exp_stage: stage,
      trial_duration: fixationDuration,
      stimulus_duration: fixationDuration,
      block_num: stage === "practice" ? practiceCount : testCount,
    };
  },
  stimulus_duration: fixationDuration, // 500
  trial_duration: fixationDuration, // 500
  prompt: function (data) {
    return getExpStage() === "practice" ? promptText : "";
  },
};

// *** ISI *** //
var ISI = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "<div class = centerbox><div class = fixation>+</div></div>",
  // choices: ["NO_KEYS"],
  response_ends_trial: false,
  data: function () {
    const stage = getExpStage();
    return {
      trial_id: `${stage}_inter-stimulus`,
      exp_stage: stage,
      trial_duration: fixationDuration + 2500,
      stimulus_duration: fixationDuration + 2500,
      block_num: stage === "practice" ? practiceCount : testCount,
    };
  },
  stimulus_duration: fixationDuration + 2500, // 3000
  trial_duration: fixationDuration + 2500, // 3000
  prompt: function () {
    return getExpStage() === "practice" ? promptText : "";
  },
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
    return getExpStage() === "practice" ? promptText : "";
  },
  on_finish: function (data) {
    data["trial_duration"] = ITIms * 1000;
    data["stimulus_duration"] = ITIms * 1000;
  },
};

/* ******************************* */
/* INSTRUCTION STUFF */
/* ******************************* */

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

/* ******************************* */
/* PRACTICE FEEDBACK STUFF */
/* ******************************* */
var practiceFeedbackBlock = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function () {
    var last = jsPsych.data.get().last(1).values()[0];
    if (last.response == null) {
      return (
        "<div class=center-box>" +
        "<div class=center-text>" +
        "<font size =20>Respond Faster!</font></div></div>"
      );
    } else if (last.correct_trial == 1) {
      return (
        "<div class=center-box>" +
        "<div class=center-text><font size =20>Correct!</font></div></div>"
      );
    } else {
      return (
        "<div class=center-box>" +
        "<div class=center-text><font size =20>Incorrect</font></div></div>"
      );
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
  prompt: promptText,
};

var feedbackBlock = {
  type: jsPsychHtmlKeyboardResponse,
  data: function () {
    const stage = getExpStage();
    return {
      trial_id: `${stage}_feedback`,
      exp_stage: stage,
      trial_duration: 30000,
      block_num: stage === "practice" ? practiceCount : testCount,
    };
  },
  choices: ["Enter"],
  stimulus: getFeedback,
  trial_duration: 30000,
  response_ends_trial: true,
};

/* ******************************* */
/* ATTENTION CHECK STUFF */
/* ******************************* */
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

attentionCheckData = shuffleArray(attentionCheckData);
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

var setStimsBlock = {
  type: jsPsychCallFunction,
  func: setStims,
};

/* ******************************* */
/* PRACTICE TRIALS */
/* ******************************* */

/* trial blocks and nodes */
practiceTrials = [];
for (i = 0; i < practiceLen; i++) {
  var cueBlock = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: getCue,
    is_html: true,
    data: function () {
      return {
        trial_id: "practice_cue",
        exp_stage: "practice",
        condition: getCondition(),
        trial_duration: cueTrialDuration,
        stimulus_duration: cueStimulusDuration,
        block_num: practiceCount,
      };
    },
    stimulus_duration: cueStimulusDuration, // 500
    trial_duration: cueTrialDuration, // 500
    response_ends_trial: false,
    prompt: promptText,
    on_finish: function (data) {
      data["cue_letter"] = extractTextFromStimulus(data);
    },
  };
  var probeBlock = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: getStim,
    choices: choices,
    data: function () {
      return {
        trial_id: "practice_trial",
        exp_stage: "practice",
        condition: getCondition(),
        choices: choices,
        trial_duration: probeTrialDuration,
        stimulus_duration: probeStimulusDuration,
        correct_response:
          getCondition() == "AX"
            ? possibleResponses[0][1]
            : possibleResponses[1][1],
        block_num: practiceCount,
      };
    },
    stimulus_duration: probeStimulusDuration,
    trial_duration: probeTrialDuration,

    response_ends_trial: false,
    prompt: promptText,
    on_finish: appendData,
  };

  practiceTrials.push(
    setStimsBlock,
    fixation,
    cueBlock,
    ISI,
    probeBlock,
    practiceFeedbackBlock,
    ITIBlock
  );
}

// loop based on criteria
var practiceCount = 0;
var practiceNode = {
  timeline: [feedbackBlock].concat(practiceTrials),
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
          if (data.trials[i].correct_trial == 1) {
            correct += 1;
          }
        }
      }
    }
    var accuracy = correct / totalTrials;
    var missedResponses = (totalTrials - sumResponses) / totalTrials;
    var avgRT = sumRT / sumResponses;

    if (accuracy >= practiceAccuracyThresh || practiceCount == practiceThresh) {
      feedbackText = `
      <div class="centerbox">
        <p class="center-block-text">We will now start the test portion.</p>
        <p class="block-text">Keep your <b>index finger</b> on the <b>comma key (,)</b> and your <b>middle finger</b> on the <b>period key (.)</b></p>
        <p class="block-text">Press <i>enter</i> to continue.</p>
      </div>`;

      blockList = conditionValues.concat(["AX"]);
      blockList = jsPsych.randomization.repeat(blockList, 10);
      expStage = "test";
      return false;
    } else {
      feedbackText =
        "<div class = centerbox><p class = block-text>Please take this time to read your feedback! This screen will advance automatically in 30 seconds.</p>";

      if (accuracy < practiceAccuracyThresh) {
        feedbackText += `
        <p class = block-text>Your accuracy is low. Remember:</p>
        ${promptTextList}
      `;
      }
      if (avgRT > rtThresh) {
        feedbackText += `
       <p class = block-text>You have been responding too slowly. Try to respond as quickly and accurately as possible.</p>
      `;
      }
      if (missedResponses > missedResponseThresh) {
        feedbackText += `
        <p class = block-text>You have not been responding to some trials. Please respond on every trial that requires a response.</p>
      `;
      }

      feedbackText +=
        `<p class="block-text">We are now going to repeat the practice round.</p>` +
        `<p class="block-text">Press <i>enter</i> to begin.</p></div>`;

      blockList = conditionValues.concat(["AX"]);
      blockList = jsPsych.randomization.repeat(blockList, 1);
      return true;
    }
  },
};

/* ******************************* */
/* TEST TRIALS */
/* ******************************* */
var testTrials = [];
testTrials.push(attentionNode);
for (i = 0; i < numTrialsPerBlock; i++) {
  var cueBlock = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: getCue,
    is_html: true,
    data: function () {
      return {
        trial_id: "test_cue",
        exp_stage: "test",
        condition: getCondition(),
        trial_duration: cueTrialDuration,
        stimulus_duration: cueStimulusDuration,
        block_num: testCount,
      };
    },
    stimulus_duration: cueStimulusDuration,
    trial_duration: cueTrialDuration,
    response_ends_trial: false,
    on_finish: function (data) {
      data["cue_letter"] = extractTextFromStimulus(data);
    },
  };
  var probeBlock = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: getStim,
    choices: choices,
    data: function () {
      return {
        trial_id: "test_trial",
        exp_stage: "test",
        condition: getCondition(),
        choices: choices,
        trial_duration: probeTrialDuration,
        stimulus_duration: probeStimulusDuration,
        correct_response:
          getCondition() == "AX"
            ? possibleResponses[0][1]
            : possibleResponses[1][1],
        block_num: testCount,
      };
    },
    stimulus_duration: probeStimulusDuration,
    trial_duration: probeTrialDuration,
    response_ends_trial: false,
    on_finish: appendData,
  };
  testTrials.push(setStimsBlock, fixation, cueBlock, ISI, probeBlock, ITIBlock);
}

var testCount = 0;
var testNode = {
  timeline: [feedbackBlock].concat(testTrials),
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
          if (data.trials[i].correct_trial == 1) {
            correct += 1;
          }
        }
      }
    }

    var accuracy = correct / totalTrials;
    var missedResponses = (totalTrials - sumResponses) / totalTrials;
    var avgRT = sumRT / sumResponses;

    currentAttentionCheckData = attentionCheckData.shift();

    if (testCount == numTestBlocks) {
      feedbackText = `
        <div class=centerbox>
        <p class=block-text>Done with this task.</p> +
        <p class=centerbox>Press <i>enter</i> to continue.</p> +
        </div>
      `;

      return false;
    } else {
      feedbackText =
        "<div class = centerbox><p class = block-text>Please take this time to read your feedback! This screen will advance automatically in 30 seconds.</p>";

      feedbackText += `<p class=block-text>You have completed ${testCount} out of ${numTestBlocks} blocks of trials.</p>`;

      if (accuracy < accuracyThresh) {
        feedbackText += `
        <p class = block-text>Your accuracy is low. Remember:</p>
        ${promptTextList}
      `;
      }
      if (avgRT > rtThresh) {
        feedbackText += `
       <p class = block-text>You have been responding too slowly. Try to respond as quickly and accurately as possible.</p>
      `;
      }
      if (missedResponses > missedResponseThresh) {
        feedbackText += `
        <p class = block-text>You have not been responding to some trials. Please respond on every trial that requires a response.</p>
      `;
      }

      feedbackText +=
        "<p class=block-text>Press <i>enter</i> to continue.</p>" + "</div>";

      blockList = jsPsych.randomization.repeat(
        trialProportions,
        numTrialsPerBlock / trialProportions.length
      );
      return true;
    }
  },
  // on_timeline_finish: function () {
  //   window.dataSync();
  // },
};

/* ******************************* */
/* JSPSYCH REQUIRED IN ALL SCRIPTS */
/* ******************************* */

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

var expID = "ax_cpt_rdoc"; // for this experiment

// last block in timeline
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

var ax_cpt_rdoc_experiment = [];
var ax_cpt_rdoc_init = () => {
  blockList = conditionValues.concat(["AX"]);
  blockList = jsPsych.randomization.repeat(blockList, 1);
  ax_cpt_rdoc_experiment.push(fullscreen);
  ax_cpt_rdoc_experiment.push(instructionNode);
  ax_cpt_rdoc_experiment.push(practiceNode);
  ax_cpt_rdoc_experiment.push(testNode);
  ax_cpt_rdoc_experiment.push(endBlock);
  ax_cpt_rdoc_experiment.push(exitFullscreen);
};
