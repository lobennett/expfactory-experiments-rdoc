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
  s.setAttribute("data-tags", "visual_search_rdoc");
  (document.head || document.documentElement).appendChild(s);
})();
/* ************************************ */

/* ************************************ */
/* Define helper functions */
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

function createPracticeStimArrays(blockLen) {
  let blockStimConditions = [];
  let blockStimNums = [];
  let blockStimTargets = [];

  for (let i = 0; i < blockLen; i++) {
    if (i < practiceLen / 2) {
      blockStimConditions.push("feature");
      if (i % 2 === 0) {
        blockStimNums.push(8);
        blockStimTargets.push(1);
      } else {
        blockStimNums.push(24);
        blockStimTargets.push(0);
      }
    } else {
      blockStimConditions.push("conjunction");
      if (i % 2 === 0) {
        blockStimNums.push(8);
        blockStimTargets.push(0);
      } else {
        blockStimNums.push(24);
        blockStimTargets.push(1);
      }
    }
  }

  return { blockStimConditions, blockStimNums, blockStimTargets };
}

function createStimArrays(blockLen) {
  let blockStimConditions = [];
  let blockStimNums = [];
  let blockStimTargets = [];

  const halfLen = blockLen / 2;
  const quarterLen = blockLen / 4;

  for (let i = 0; i < blockLen; i++) {
    // Alternate between "feature" and "conjunction"
    blockStimConditions.push(i < halfLen ? "feature" : "conjunction");

    // For each condition, half "8" and half "24"
    if (i % quarterLen < quarterLen / 2) {
      blockStimNums.push(8);
    } else {
      blockStimNums.push(24);
    }

    // For each condition, half "1" and half "0"
    if (i % (quarterLen / 2) < quarterLen / 4) {
      blockStimTargets.push(1);
    } else {
      blockStimTargets.push(0);
    }
  }

  return { blockStimConditions, blockStimNums, blockStimTargets };
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

var getCurrAttentionCheckQuestion = function () {
  return `${currentAttentionCheckData.Q} <div class=block-text>This screen will advance automatically in 15 seconds. Do not press shift.</div>`;
};

var getCurrAttentionCheckAnswer = function () {
  return currentAttentionCheckData.A;
};

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

var trialTargetPresent;
var condition;
var numberStim;

function getStims(
  blockStimNums,
  blockStimTargets,
  blockStimConditions,
  length
) {
  const containerWidth = window.innerWidth * 0.7;
  const containerHeight = window.innerHeight * 0.7;
  const boxWidth = 40;
  const boxHeight = 80;
  var stims = [];

  for (var i = 0; i < length; i++) {
    const targetPresent = blockStimTargets.shift();
    const stimCondition = blockStimConditions.shift();
    const stimNum = blockStimNums.shift();
    const targetIndex = Math.floor(Math.random() * stimNum);
    const html = generateHTML(
      containerWidth,
      containerHeight,
      targetPresent,
      targetIndex,
      boxWidth,
      boxHeight,
      stimCondition,
      stimNum
    );

    var obj = {
      html: html,
      targetPresent: targetPresent,
      condition: stimCondition,
      stimNum: stimNum,
    };

    stims.push(obj);
  }

  return stims;
}

function getStim() {
  stim = blockStims.shift();
  trialTargetPresent = stim.targetPresent;
  condition = stim.condition;
  numberStim = stim.stimNum;
  return stim.html;
}

const getCurrBlockNum = () =>
  getExpStage() === "practice" ? practiceCount : testCount;

function getStimProperties(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const divs = doc.querySelectorAll(".container > div");
  const ids = Array.from(divs).map(div => div.id);

  const parsedIDList = ids.map(item => {
    if (item === "black-distractor-element") {
      return "black vertical";
    } else if (item === "white-distractor-element") {
      return "white horizontal";
    } else if (item === "target") {
      return "white vertical";
    }
  });

  return parsedIDList;
}

const getTargetLocation = arr => arr.indexOf("white vertical");

function generateHTML(
  containerWidth,
  containerHeight,
  targetPresent,
  targetIndex,
  boxWidth,
  boxHeight,
  stimCondition,
  stimNum
) {
  let html;

  html =
    '<div class="container" style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: ' +
    containerWidth +
    "px; height: " +
    containerHeight +
    'px;">';

  const positions = [];
  let rows;
  let cols;

  if (stimNum === 8) {
    rows = 4;
    cols = 2;
  } else if (stimNum === 24) {
    rows = 6;
    cols = 4;
  } else {
    throw new Error("Invalid value of n. Only 8 or 24 is supported.");
  }

  const spacingX = (containerWidth - cols * boxWidth) / (cols + 1);
  const spacingY = (containerHeight - rows * boxHeight) / (rows + 1);

  for (let i = 0; i < stimNum; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;

    const left = spacingX * (col + 1) + col * boxWidth;
    const top = spacingY * (row + 1) + row * boxHeight;

    positions.push({ left, top });

    if (i === targetIndex && targetPresent) {
      html += generateTargetElement(left, top, boxWidth, boxHeight);
    } else {
      html += generateDistractorElement(
        left,
        top,
        boxWidth,
        boxHeight,
        stimCondition
      );
    }
  }

  html += "</div>";

  return html;
}

function generateTargetElement(left, top, width, height) {
  return (
    '<div id="target" class="box" style="position: absolute; left: ' +
    left +
    "px; top: " +
    top +
    "px; width: " +
    width +
    "px; height: " +
    height +
    'px; background-color: white;"></div>'
  );
}

function generateDistractorElement(left, top, width, height, stimCondition) {
  if (stimCondition === "feature") {
    return (
      '<div id="black-distractor-element" class="box" style="position: absolute; left: ' +
      left +
      "px; top: " +
      top +
      "px; width: " +
      width +
      "px; height: " +
      height +
      'px; background-color: black;"></div>'
    );
  } else if (stimCondition === "conjunction") {
    if (Math.random() < 0.5) {
      return (
        '<div id="white-distractor-element"  class="box" style="position: absolute; left: ' +
        left +
        "px; top: " +
        top +
        "px; width: " +
        width +
        "px; height: " +
        height +
        'px; background-color: white; transform: rotate(90deg); transform-origin: center;"></div>'
      );
    } else {
      return (
        '<div id="black-distractor-element"  class="box" style="position: absolute; left: ' +
        left +
        "px; top: " +
        top +
        "px; width: " +
        width +
        "px; height: " +
        height +
        'px; background-color: black;"></div>'
      );
    }
  }
}

const getExpStage = () => expStage;

const getCurrCondition = () => condition;

const getInstructFeedback = () =>
  `<div class="centerbox"><p class="center-block-text">${feedbackInstructText}</p></div>`;

const getFeedback = () =>
  `<div class="bigbox"><div class="picture_box"><p class="block-text">${feedbackText}</p></div></div>`;

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
const fixationDuration = 500;
function getKeyMappingForTask(group_index) {
  // Adjust group index to use values from 0 to 14.
  // Oversampling adjustments:
  // - For group indices 0 to 4: use index for "absent" and middle for "present"
  // - For group indices 5 to 14: use index for "present" and middle for "absent"
  if (0 <= group_index && group_index <= 4) {
    // Mapping for "absent" - Index and "present" - Middle
    possibleResponses = [
      ["middle finger", ".", "period key (.)"],
      ["index finger", ",", "comma key (,)"],
    ];
  } else if (5 <= group_index && group_index <= 14) {
    // Mapping for "present" - Index and "absent" - Middle
    possibleResponses = [
      ["index finger", ",", "comma key (,)"],
      ["middle finger", ".", "period key (.)"],
    ];
  } else {
    throw new Error("Group index out of bounds");
  }
}

var possibleResponses;

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
    Welcome! This experiment will take around 12 minutes.
  </p>
  <p class="center-block-text">
    To avoid technical issues, please keep the experiment tab (on Chrome or Firefox) active and in fullscreen mode for the whole duration of each task.
  </p>
  <p class="center-block-text"> Press <i>enter</i> to begin.</p>
`;

var speedReminder =
  "<p class = block-text>Try to respond as quickly and accurately as possible.</p>";

const pageInstruct = [
  `<div class="centerbox">
    <p class="block-text">Place your <b>index finger</b> on the <b>comma key (,)</b> and your <b>middle finger</b> on the <b>period key (.)</b></p>
    <p class="block-text">During this task, on each trial rectangles will appear on the screen. The rectangles can be either black or white in color.</p>
    <p class="block-text">On some trials, <b>one</b> of these rectangles will be a <b>vertical white rectangle</b>. We will call this rectangle the 'target'.</p>
    <div style="display: flex; align-items: center; justify-content: center; padding-top: 80px; padding-bottom: 80px;">
    <p style="width: 70%; font-size: 24px;">The target looks like: </p>
    <div style="display: flex; justify-content: center; align-items: center; width:100%;">
    <div id="target" class="box" style="background-color:white; width:40px; height:80px;"></div>
    </div>
    </div>
    </div>
    `,
  `
  <div class="centerbox">
    <p class="block-text">Your task is to determine whether a target is ${
      possibleResponses[0][0] == "index finger" ? "present" : "absent"
    } or ${
    possibleResponses[0][0] == "index finger" ? "absent" : "present"
  } on each trial.</p>
    <p class="block-text">If you determine a target is <b>${
      possibleResponses[0][0] == "index finger" ? "present" : "absent"
    }</b>, press your <b>index finger</b>, and if you determine a target is <b>${
    possibleResponses[0][0] == "index finger" ? "absent" : "present"
  }</b>, press your <b>middle finger</b>.</p>
    <p class="block-text">We'll start with a practice round. During practice, you will receive feedback and a reminder of the rules. These will be taken out for the test, so make sure you understand the instructions before moving on.</p>
    ${speedReminder}
  </div>`,
];

const stimStimulusDuration = 1500;
const stimTrialDuration = 2000;

var runAttentionChecks = true;

// thresholds
var sumInstructTime = 0; // ms
const instructTimeThresh = 5; // /in seconds
const accuracyThresh = 0.8; // threshhold for block-level feedback
const practiceAccuracyThresh = 0.75; //threshold to proceed to test blocks, 3 out of 4 trials for .75

const rtThresh = 1250;
const missedResponseThresh = 0.1;

// trial nums
var practiceLen = 4;
var numTrialsPerBlock = 64;
var numTestBlocks = 3;

var practiceCount = 0;
var practiceThresh = 3;

var expStage = "practice";

/*  ######## Important text values for display ######## */
const promptText = `
<div class="prompt_box">
  <p class="center-block-text" style="font-size: 16px; line-height: 80%;">Target ${
    possibleResponses[0][0] == "index finger" ? "present" : "absent"
  }: comma key (,)</p>
  <p class="center-block-text" style="font-size: 16px; line-height: 80%;">Target ${
    possibleResponses[0][0] == "index finger" ? "absent" : "present"
  }: period key (.)</p>
</div>`;

const promptTextList = `
<ul style="text-align: left; font-size: 24px;">
  <li>Target ${
    possibleResponses[0][0] == "index finger" ? "present" : "absent"
  }: comma key (,)</li>
  <li>Target ${
    possibleResponses[0][0] == "index finger" ? "absent" : "present"
  }: period key (.)</li>
</ul>`;

// setting first value for feature/conjunction condition
const conditionArray = ["feature", "conjunction"];

var blockStims = [];
var blockStimNums = [];
var blockStimTargets = [];
var blockStimConditions = [];

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
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

var feedbackInstructBlock = {
  type: jsPsychHtmlKeyboardResponse,
  choices: ["Enter"],
  data: {
    trial_id: "instruction_feedback",
    trial_duration: 30000,
  },
  stimulus: getInstructFeedback,
  trial_duration: 30000,
};

var testTrial = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: getStim,
  choices: choices,
  stimulus_duration: stimStimulusDuration, // 1500,
  trial_duration: stimTrialDuration, // 1500
  response_ends_trial: false,
  prompt: function () {
    return getExpStage() === "practice" ? promptText : "";
  },
  data: function () {
    const stage = getExpStage();
    return {
      trial_id: `${stage}_trial`,
      choices: choices,
      trial_duration: stimTrialDuration,
      stimulus_duration: stimStimulusDuration,
      block_num: stage === "practice" ? practiceCount : testCount,
    };
  },
  on_finish: function (data) {
    data["target_present"] = trialTargetPresent ? 1 : 0;
    data["num_stimuli"] = numberStim;
    data["condition"] = condition;
    data["exp_stage"] = getExpStage();
    data["correct_response"] = trialTargetPresent
      ? possibleResponses[0][1]
      : possibleResponses[1][1];

    if (data.response !== null) {
      if (trialTargetPresent == 1) {
        if (data.response == possibleResponses[0][1]) {
          data["correct_trial"] = 1;
        } else {
          data["correct_trial"] = 0;
        }
      } else {
        if (data.response == possibleResponses[0][1]) {
          data["correct_trial"] = 0;
        } else {
          data["correct_trial"] = 1;
        }
      }
    } else {
      data["correct_trial"] = null;
    }

    let stimProperties = getStimProperties(data.stimulus);
    data["order_and_color_of_rectangles"] = stimProperties;
    data["target_rectangle_location"] = trialTargetPresent
      ? getTargetLocation(stimProperties)
      : null;
  },
};

var sumInstructTime = 0;
var instructTimers = [];
var instructionPages = pageInstruct; // assumes this is an array of HTML strings
var instructionsBlock = [];

// Build each instruction page as a separate timed trial
function createInstructionTrial(pageIndex) {
  return {
    type: jsPsychInstructions,
    pages: [instructionPages[pageIndex]],
    show_clickable_nav: true,
    allow_keys: false,
    data: {
      trial_id: "instructions",
      page_index: pageIndex,
      stimulus: instructionPages[pageIndex],
    },
    on_load: function () {
      const timer = setTimeout(() => {
        jsPsych.finishTrial();
      }, 60000); // 60 seconds per page
      instructTimers.push(timer);
    },
    on_finish: function (data) {
      instructTimers.forEach(t => clearTimeout(t));
      instructTimers = [];
      sumInstructTime += data.rt != null ? data.rt : 60000;
    },
  };
}

// Generate individual instruction trials
for (let i = 0; i < instructionPages.length; i++) {
  instructionsBlock.push(createInstructionTrial(i));
}
var instructionNode = {
  timeline: [feedbackInstructBlock, ...instructionsBlock],
  loop_function: function (data) {
    sumInstructTime = 0;
    for (let i = 0; i < data.trials.length; i++) {
      if (data.trials[i].trial_id === "instructions") {
        sumInstructTime +=
          data.trials[i].rt != null ? data.trials[i].rt : 60000;
      }
    }

    if (sumInstructTime <= instructTimeThresh * 1000) {
      feedbackInstructText =
        "<p class=block-text>Read through instructions too quickly. Please take your time and make sure you understand the instructions.</p><p class=block-text>Press <i>enter</i> to continue.</p>";
      return true;
    } else {
      feedbackInstructText =
        "<p class=block-text>Done with instructions. Press <i>enter</i> to continue.</p>";
      return false;
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
      block_num: stage === "practice" ? practiceCount : testCount,
    };
  },
  choices: ["Enter"],
  stimulus: getFeedback,
  trial_duration: 30000,
  response_ends_trial: true,
};

var fixationBlock = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<div class="centerbox"><div class="fixation">+</div></div>',
  choices: ["NO_KEYS"],
  data: function () {
    if (getExpStage() == "practice") {
      return {
        trial_id: "practice_fixation",
        exp_stage: "practice",
        trial_duration: fixationDuration,
        stimulus_duration: fixationDuration,
        block_num: practiceCount,
      };
    } else {
      return {
        trial_id: "test_fixation",
        exp_stage: "test",
        trial_duration: fixationDuration,
        stimulus_duration: fixationDuration,
        block_num: testCount,
      };
    }
  },
  prompt: function () {
    if (getExpStage() == "practice") {
      return promptText;
    } else {
      return "";
    }
  },
  stimulus_duration: fixationDuration, // 500
  trial_duration: fixationDuration, // 500
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
  on_load: function () {
    function preventSlash(event) {
      if (event.key === "/" || event.key === "," || event.key === ".") {
        event.preventDefault();
      }
    }
    window.addEventListener("keydown", preventSlash);
    jsPsych.getCurrentTrial().on_close = function () {
      window.removeEventListener("keydown", preventSlash);
    };
  },
  prompt: function () {
    return getExpStage() === "practice" ? promptText : "";
  },
  on_finish: function (data) {
    data["trial_duration"] = ITIms * 1000;
    data["stimulus_duration"] = ITIms * 1000;
  },
};

var practiceFeedbackBlock = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function () {
    var last = jsPsych.data.get().last(1).trials[0];
    if (last.response == null) {
      return "<div class=center-box><p class=center-text>Respond Faster!</div></div>";
    }
    if (last.correct_trial == 1) {
      return "<div class=center-box><p class=center-text>Correct!</div></div>";
    } else if (last.correct_trial == 0) {
      return "<div class=center-box><p class=center-text>Incorrect!</div></div>";
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
  prompt: function () {
    return getExpStage() === "practice" ? promptText : "";
  },
};

var practiceTrials = [];
for (let i = 0; i < practiceLen; i++) {
  practiceTrials.push(
    fixationBlock,
    testTrial,
    practiceFeedbackBlock,
    ITIBlock
  );
}

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

      const { blockStimConditions, blockStimNums, blockStimTargets } =
        createStimArrays(numTrialsPerBlock);

      blockStims = getStims(
        blockStimNums,
        blockStimTargets,
        blockStimConditions,
        numTrialsPerBlock
      );

      blockStims = jsPsych.randomization.repeat(blockStims, 1);

      expStage = "test";
      return false;
    } else {
      feedbackText =
        "<div class = centerbox><p class = block-text>Please take this time to read your feedback! This screen will advance automatically in 30 seconds.</p>";
      if (accuracy < practiceAccuracyThresh) {
        feedbackText +=
          `<p class="block-text">Your accuracy is low. Remember: </p>` +
          promptTextList;
      }
      if (avgRT > rtThresh) {
        feedbackText += `<p class="block-text">You have been responding too slowly. Try to respond as quickly and accurately as possible.</p>`;
      }
      if (missedResponses > missedResponseThresh) {
        feedbackText += `<p class="block-text">You have not been responding to some trials. Please respond on every trial that requires a response.</p>`;
      }

      feedbackText +=
        `<p class="block-text">We are now going to repeat the practice round.</p>` +
        `<p class="block-text">Press <i>enter</i> to begin.</p></div>`;

      const { blockStimConditions, blockStimNums, blockStimTargets } =
        createPracticeStimArrays(practiceLen);

      blockStims = getStims(
        blockStimNums,
        blockStimTargets,
        blockStimConditions,
        practiceLen
      );

      blockStims = jsPsych.randomization.repeat(blockStims, 1);
      return true;
    }
  },
};

var testTrials = [];
testTrials.push(attentionNode);
for (let i = 0; i < numTrialsPerBlock; i++) {
  testTrials.push(fixationBlock, testTrial, ITIBlock);
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

    currentAttentionCheckData = attentionCheckData.shift(); // Shift the first object from the array

    if (testCount == numTestBlocks) {
      feedbackText = `<div class=centerbox>
        <p class=block-text>Done with this task.</p>
        <p class=centerbox>Press <i>enter</i> to continue.</p>
        </div>`;

      return false;
    } else {
      feedbackText =
        "<div class = centerbox><p class = block-text>Please take this time to read your feedback! This screen will advance automatically in 30 seconds.</p>";

      feedbackText += `<p class=block-text>You have completed ${testCount} out of ${numTestBlocks} blocks of trials.</p>`;

      if (accuracy < accuracyThresh) {
        feedbackText +=
          `<p class="block-text">Your accuracy is low. Remember: </p>` +
          promptTextList;
      }
      if (avgRT > rtThresh) {
        feedbackText += `<p class="block-text">You have been responding too slowly. Try to respond as quickly and accurately as possible.</p>`;
      }
      if (missedResponses > missedResponseThresh) {
        feedbackText += `<p class="block-text">You have not been responding to some trials. Please respond on every trial that requires a response.</p>`;
      }

      feedbackText +=
        "<p class=block-text>Press <i>enter</i> to continue.</p>" + "</div>";

      const { blockStimConditions, blockStimNums, blockStimTargets } =
        createStimArrays(numTrialsPerBlock);

      blockStims = getStims(
        blockStimNums,
        blockStimTargets,
        blockStimConditions,
        numTrialsPerBlock
      );

      blockStims = jsPsych.randomization.repeat(blockStims, 1);

      return true;
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

var endBlock = {
  type: jsPsychHtmlKeyboardResponse,
  data: {
    trial_id: "end",
    exp_id: "visual_search_rdoc",
    trial_duration: 15000,
  },
  trial_duration: 15000,
  stimulus: endText,
  choices: ["Enter"],
};

var visual_search_rdoc_experiment = [];
var visual_search_rdoc_init = () => {
  const { blockStimConditions, blockStimNums, blockStimTargets } =
    createPracticeStimArrays(practiceLen);

  blockStims = getStims(
    blockStimNums,
    blockStimTargets,
    blockStimConditions,
    practiceLen
  );

  blockStims = jsPsych.randomization.repeat(blockStims, 1);

  visual_search_rdoc_experiment.push(fullscreen);
  visual_search_rdoc_experiment.push(instructionNode);
  visual_search_rdoc_experiment.push(practiceNode);
  visual_search_rdoc_experiment.push(testNode);
  visual_search_rdoc_experiment.push(endBlock);
  visual_search_rdoc_experiment.push(exitFullscreen);
};
