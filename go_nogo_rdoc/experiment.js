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
  s.setAttribute("data-tags", "go_nogo_rdoc");
  (document.head || document.documentElement).appendChild(s);
})();
/* ************************************ */

/* ************************************ */
/* Define helper functions */
/* ************************************ */

/* ************* ITIs **************** */
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

const getExpStage = () => expStage;

/* Append gap and current trial to data and then recalculate for next trial*/
var appendData = function (data) {
  var currentTrial = jsPsych.data.get().last().trials[0];
  var correctTrial = 0;
  if (currentTrial.response == correctResponse) {
    correctTrial = 1;
  }

  data.correct_trial = correctTrial;
  data.shape = data.condition === "go" ? "filled square" : "outlined square";

  currentTrial += 1;
};

const getInstructFeedback = () =>
  `<div class="centerbox"><p class="center-block-text">${feedbackInstructText}</p></div>`;

const getFeedback = () =>
  `<div class="bigbox"><div class="picture_box"><p class="block-text">${feedbackText}</p></div></div>`;

var getStim = function () {
  stim = blockStims.pop();
  correctResponse = stim.data.correct_response;
  return stim.stimulus;
};

const getCurrBlockNum = () =>
  getExpStage() === "practice" ? practiceCount : testCount;

var getData = function () {
  stimData = stim.data;
  stimData["trial_duration"] = stimTrialDuration;
  stimData["stimulus_duration"] = stimStimulusDuration;
  return stimData;
};

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
const fixationDuration = 500;

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

// Speed reminder
var speedReminder = `
  <p class="block-text">
    Try to respond as quickly and accurately as possible.
  </p>
`;

// eslint-disable-next-line no-unused-vars
var expStage = "practice";
// *: Timing
const stimStimulusDuration = 1000;
const stimTrialDuration = 1500;

// generic task variables
var runAttentionChecks = true;
var sumInstructTime = 0; // ms
var instructTimeThresh = 5; // /in seconds
var goResponse = " "; // spacebar

var numGoStim = 6;
var correctResponses = [
  ["go", goResponse],
  ["nogo", null],
];

// styled with css
var stims = [
  ["solid white", "stim1"],
  ["outlined white", "stim2"],
];

var group_index = window.efVars?.group_index ?? 1;

var currentTrial = 0;
var practiceStimuli = [
  {
    stimulus:
      "<div class = bigbox><div class = centerbox><div class = gng_number><div class = cue-text><div id = " +
      stims[1][1] +
      "></div></div></div></div></div>",
    data: {
      correct_response: correctResponses[1][1],
      condition: correctResponses[1][0],
      trial_id: "practice_trial",
    },
    key_answer: correctResponses[1][1],
  },
].concat(
  Array(numGoStim).fill({
    stimulus:
      "<div class = bigbox><div class = centerbox><div class = gng_number><div class = cue-text><div  id = " +
      stims[0][1] +
      "></div></div></div></div></div>",
    data: {
      correct_response: correctResponses[0][1],
      condition: correctResponses[0][0],
      trial_id: "practice_trial",
    },
    key_answer: correctResponses[0][1],
  })
);

var testStimuliBlock = [
  {
    stimulus:
      "<div class = bigbox><div class = centerbox><div class = gng_number><div class = cue-text><div id = " +
      stims[1][1] +
      "></div></div></div></div></div>",
    data: {
      correct_response: correctResponses[1][1],
      condition: correctResponses[1][0],
      trial_id: "test_trial",
    },
  },
].concat(
  Array(numGoStim).fill({
    stimulus:
      "<div class = bigbox><div class = centerbox><div class = gng_number><div class = cue-text><div  id = " +
      stims[0][1] +
      "></div></div></div></div></div>",
    data: {
      correct_response: correctResponses[0][1],
      condition: correctResponses[0][0],
      trial_id: "test_trial",
    },
  })
);

var accuracyThresh = 0.8; // min acc for block-level feedback
var practiceAccuracyThresh = 0.85; // min acc to proceed to test blocks, 6 out of 7 ~ .857

var rtThresh = 750;
var missedResponseThresh = 0.1;

var practiceLen = 7;
var practiceThresh = 3;
var numTrialsPerBlock = 63; // multiple of 7 (6go:1nogo)
var numTestBlocks = 3;

var promptTextList = `
  <ul style="text-align:left;">
    <li>${stims[0][0]} square: spacebar</li>
    <li>${stims[1][0]} square: do not respond</li>
  </ul>
`;

var promptText = `
  <div class="prompt_box">
    <p class="center-block-text" style="font-size:16px; line-height:80%;">${stims[0][0]} square: spacebar</p>
    <p class="center-block-text" style="font-size:16px; line-height:80%;">${stims[1][0]} square: do not respond</p>
  </div>
`;

var pageInstruct = `
  <div class="centerbox">
    <p class="block-text">Place your <b>index finger</b> on the <b>spacebar</b>.</p>
    <p class="block-text">In this experiment, on each trial a ${stims[0][0]} or ${stims[1][0]} square will appear on the screen.</p>
    <p class="block-text">If you see the <b>${stims[0][0]} square</b>, you should respond by pressing your <b>index finger</b> as quickly as possible.</p>
    <p class="block-text">If you see the <b>${stims[1][0]} square</b>, you should <b>not respond</b>.</p>
    <p class="block-text">We'll start with a practice round. During practice, you will receive feedback and a reminder of the rules. These will be taken out for the test, so make sure you understand the instructions before moving on.</p>
    ${speedReminder}
  </div>
`;

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

var sumInstructTime = 0;
var instructTimer;

var instructionsBlock = {
  type: jsPsychInstructions,
  data: {
    trial_id: "instructions",
    trial_duration: null,
    stimulus: pageInstruct,
  },
  pages: [pageInstruct], // assuming pageInstruct is a single page of HTML
  allow_keys: false,
  show_clickable_nav: true,
  on_load: function () {
    // Automatically end the trial after 60s if participant hasn't navigated
    instructTimer = setTimeout(() => {
      jsPsych.finishTrial();
    }, 60000); // 60 seconds
  },
  on_finish: function (data) {
    // Clear the auto-advance timer
    clearTimeout(instructTimer);
    // If participant didn't click 'next', count as 60s
    if (data.rt === null) {
      data.rt = 60000;
    }
    sumInstructTime += data.rt;
  },
};

var instructionNode = {
  timeline: [feedbackInstructBlock, instructionsBlock],
  loop_function: function (data) {
    for (i = 0; i < data.trials.length; i++) {
      if (
        data.trials[i].trial_id == "instructions" &&
        data.trials[i].rt != null
      ) {
        sumInstructTime += data.trials[i].rt;
      }
    }
    if (sumInstructTime <= instructTimeThresh * 1000) {
      feedbackInstructText =
        "<p class=block-text>Read through instructions too quickly. Please take your time and make sure you understand the instructions.</p><p class=block-text>Press <i>enter</i> to continue.</p>";
      return true;
    } else if (sumInstructTime > instructTimeThresh * 1000) {
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
    };
  },
  choices: ["Enter"],
  stimulus: getFeedback,
  trial_duration: 30000,
  response_ends_trial: true,
};

var fixationBlock = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "<div class = centerbox><div class = fixation>+</div></div>",
  choices: ["NO_KEYS"],
  data: function () {
    return {
      trial_id: "test_fixation",
      exp_stage: "test",
      trial_duration: fixationDuration,
      stimulus_duration: fixationDuration,
      block_num: testCount,
    };
  },
  stimulus_duration: fixationDuration,
  trial_duration: fixationDuration,
};

var promptFixationBlock = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "<div class = centerbox><div class = fixation>+</div></div>",
  choices: "none",
  data: function () {
    return {
      trial_id: "practice_fixation",
      exp_stage: "practice",
      trial_duration: fixationDuration,
      stimulus_duration: fixationDuration,
      block_num: practiceCount,
    };
  },
  stimulus_duration: fixationDuration,
  trial_duration: fixationDuration,
  prompt: promptText,
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

var practiceTrials = [];
for (var i = 0; i < practiceLen; i++) {
  var practiceTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: getStim,
    data: function () {
      return Object.assign(getData(), {
        exp_stage: "practice",
        choices: [goResponse],
        block_num: practiceCount,
      });
    },
    choices: [goResponse],
    stimulus_duration: stimStimulusDuration, // 1000,
    trial_duration: stimTrialDuration, // 1500
    response_ends_trial: false,

    on_finish: appendData,
    prompt: promptText,
  };

  var practiceFeedbackBlock = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
      var last = jsPsych.data.get().last(1).values()[0];
      if (last.condition == "go") {
        if (last.response == last.correct_response) {
          return "<div class = center-box><divp class = center-text>Correct!</div></div>";
        } else {
          return "<div class = center-box><div class = center-text>The shape was solid</div></div>";
        }
      } else {
        if (last.response == last.correct_response) {
          return "<div class = center-box><div class = center-text>Correct!</div></div>";
        } else {
          return "<div class = center-box><div class = center-text>The shape was outlined</div></div>";
        }
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
    prompt: promptText,
    trial_duration: 500,
    stimulus_duration: 500,
  };
  practiceTrials.push(
    promptFixationBlock,
    practiceTrial,
    practiceFeedbackBlock,
    ITIBlock
  );
}

var practiceCount = 0;
var practiceNode = {
  timeline: [feedbackBlock].concat(practiceTrials),
  loop_function: function (data) {
    practiceCount += 1;
    currentTrial = 0;

    var sumRT = 0;
    var sumResponses = 0;
    var correct = 0;
    var totalTrials = 0;

    var totalGoTrials = 0;
    var missedResponse = 0;

    for (var i = 0; i < data.trials.length; i++) {
      if (
        data.trials[i].trial_id == "practice_trial" &&
        data.trials[i].block_num == getCurrBlockNum() - 1
      ) {
        totalTrials += 1;
        if (data.trials[i].rt != null) {
          sumRT += data.trials[i].rt;
          sumResponses += 1;
        }
        if (data.trials[i].response == data.trials[i].correct_response) {
          correct += 1;
        }

        if (data.trials[i].condition == "go") {
          totalGoTrials += 1;
          if (data.trials[i].rt == null) {
            missedResponse += 1;
          }
        }
      }
    }

    var accuracy = correct / totalTrials;
    var missedResponses = missedResponse / totalGoTrials;
    var avgRT = sumRT / sumResponses;

    if (accuracy >= practiceAccuracyThresh || practiceCount == practiceThresh) {
      feedbackText = `
      <div class="centerbox">
        <p class="center-block-text">We will now start the test portion.</p>
        <p class="block-text">Keep your <b>index finger</b> on the <b>spacebar</b></p>
        <p class="block-text">Press <i>enter</i> to continue.</p>
     </div>
    `;

      blockStims = jsPsych.randomization.repeat(
        testStimuliBlock,
        numTrialsPerBlock / testStimuliBlock.length
      );
      expStage = "test";
      return false;
    } else {
      feedbackText =
        "<div class = centerbox><p class = block-text>Please take this time to read your feedback! This screen will advance automatically in 30 seconds.</p>";

      if (accuracy < practiceAccuracyThresh) {
        feedbackText += `
       <p class="block-text">Your accuracy is low. Remember: </p>${promptTextList}
      `;
      }

      if (avgRT > rtThresh) {
        feedbackText += `
        <p class="block-text">You have been responding too slowly.${speedReminder}</p>
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

      blockStims = jsPsych.randomization.repeat(
        practiceStimuli,
        practiceLen / practiceStimuli.length
      );
      return true;
    }
  },
};

var testTrials = [];
testTrials.push(attentionNode);
for (var i = 0; i < numTrialsPerBlock; i++) {
  var testTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: getStim,
    choices: [goResponse],
    data: function () {
      return Object.assign(getData(), {
        exp_stage: "test",
        choices: [goResponse],
        block_num: testCount,
      });
    },

    stimulus_duration: stimStimulusDuration, // 1000
    trial_duration: stimTrialDuration, // 1500
    response_ends_trial: false,
    on_finish: appendData,
  };
  testTrials.push(fixationBlock, testTrial, ITIBlock);
}

var testCount = 0;
var testNode = {
  timeline: [feedbackBlock].concat(testTrials),
  loop_function: function (data) {
    testCount += 1;
    currentTrial = 0;

    var sumRT = 0;
    var sumResponses = 0;
    var correct = 0;
    var totalTrials = 0;
    var totalGoTrials = 0;
    var missedResponse = 0;

    for (var i = 0; i < data.trials.length; i++) {
      if (
        data.trials[i].trial_id == "test_trial" &&
        data.trials[i].block_num == getCurrBlockNum() - 1
      ) {
        totalTrials += 1;
        if (data.trials[i].rt != null) {
          sumRT += data.trials[i].rt;
          sumResponses += 1;
        }
        if (data.trials[i].response == data.trials[i].correct_response) {
          correct += 1;
        }
        if (data.trials[i].condition == "go") {
          totalGoTrials += 1;
          if (data.trials[i].rt == null) {
            missedResponse += 1;
          }
        }
      }
    }
    var accuracy = correct / totalTrials;
    var missedResponses = missedResponse / totalGoTrials;
    var avgRT = sumRT / sumResponses;

    currentAttentionCheckData = attentionCheckData.shift(); // Shift the first object from the array

    if (testCount >= numTestBlocks) {
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
        feedbackText += `
       <p class="block-text">Your accuracy is low. Remember: </p>${promptTextList}
      `;
      }

      if (avgRT > rtThresh) {
        feedbackText += `
        <p class="block-text">You have been responding too slowly.${speedReminder}</p>
      `;
      }

      if (missedResponses > missedResponseThresh) {
        feedbackText += `
        <p class="block-text">You have not been responding to some trials. Please respond on every trial that requires a response.</p>
      `;
      }

      feedbackText +=
        "<p class=block-text>Press <i>enter</i> to continue.</p>" + "</div>";

      blockStims = jsPsych.randomization.repeat(
        testStimuliBlock,
        numTrialsPerBlock / testStimuliBlock.length
      );
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

// Set up post task questionnaire
var expID = "go_nogo_rdoc";

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

var go_nogo_rdoc_experiment = [];
var go_nogo_rdoc_init = () => {
  blockStims = jsPsych.randomization.repeat(
    practiceStimuli,
    practiceLen / practiceStimuli.length
  );

  go_nogo_rdoc_experiment.push(fullscreen);
  go_nogo_rdoc_experiment.push(instructionNode);
  go_nogo_rdoc_experiment.push(practiceNode);
  go_nogo_rdoc_experiment.push(testNode);
  go_nogo_rdoc_experiment.push(endBlock);
  go_nogo_rdoc_experiment.push(exitFullscreen);
};
