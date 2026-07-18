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
  s.setAttribute("data-tags", "spatial_task_switching_rdoc");
  (document.head || document.documentElement).appendChild(s);
})();
/* ************************************ */

/* ************************************ */
/* Define helper functions */
/* ************************************ */
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

const getInstructFeedback = () =>
  `<div class="centerbox"><p class="center-block-text">${feedbackInstructText}</p></div>`;

const getFeedback = () =>
  `<div class="bigbox"><div class="picture_box"><p class="block-text">${feedbackText}</p></div></div>`;

const task_switch_arr = [
  "task_stay_cue_stay",
  "task_stay_cue_switch",
  "task_switch_cue_switch",
  "task_switch_cue_switch",
];

var makeTaskSwitches = numTrials =>
  jsPsych.randomization.repeat(task_switch_arr, numTrials / 4);

var createTrialTypes = function (task_switches) {
  // creating stims for trial
  var stims = [];

  // randomly select location of first quadrant
  const quadMapping = {
    1: quadMappings.top,
    2: quadMappings.top,
    3: quadMappings.bottom,
    4: quadMappings.bottom,
  };
  var whichQuadStart = jsPsych.randomization.repeat([1, 2, 3, 4], 1).pop();
  var spatial_cue = quadMapping[whichQuadStart];

  const shapes = [
    "blue_circle",
    "blue_square",
    "orange_circle",
    "orange_square",
  ];
  var shape = shapes[Math.floor(Math.random() * 4)];

  var color;
  var form;

  if (shape.includes("blue")) {
    color = "blue";
  } else if (shape.includes("orange")) {
    color = "orange";
  }

  if (shape.includes("circle")) {
    form = "circle";
  } else if (shape.includes("square")) {
    form = "square";
  }

  if (spatial_cue === "form") {
    if (form === "circle") {
      var correct_response = responseMappings.form.circle;
    } else {
      var correct_response = responseMappings.form.square;
    }
  } else {
    if (color === "blue") {
      var correct_response = responseMappings.color.blue;
    } else {
      var correct_response = responseMappings.color.orange;
    }
  }

  var first_stim = {
    whichQuadrant: whichQuadStart,
    spatial_cue: spatial_cue,
    shape: shape,
    form: form,
    color: color,
    correct_response: correct_response,
  };
  stims.push(first_stim);

  var last_quad = whichQuadStart;

  for (i = 0; i < task_switches.length; i++) {
    var current_condition = task_switches[i];
    var shape = shapes[Math.floor(Math.random() * 4)];
    var color;
    var form;

    if (shape.includes("blue")) {
      color = "blue";
    } else if (shape.includes("orange")) {
      color = "orange";
    }

    if (shape.includes("circle")) {
      form = "circle";
    } else if (shape.includes("square")) {
      form = "square";
    }

    var current_quad;

    if (current_condition == "task_stay_cue_stay") {
      current_quad = last_quad;
    } else if (current_condition == "task_stay_cue_switch") {
      current_quad = last_quad;
      if (last_quad == 1) {
        current_quad = 2;
      } else if (last_quad == 2) {
        current_quad = 1;
      } else if (last_quad == 3) {
        current_quad = 4;
      } else {
        current_quad = 3;
      }
    } else {
      if (last_quad == 1 || last_quad == 2) {
        var current_quad = jsPsych.randomization.repeat([3, 4], 1).pop();
      } else {
        var current_quad = jsPsych.randomization.repeat([1, 2], 1).pop();
      }
    }
    var spatial_cue = quadMapping[current_quad];

    if (spatial_cue === "form") {
      if (form === "circle") {
        var correct_response = responseMappings.form.circle;
      } else {
        var correct_response = responseMappings.form.square;
      }
    } else {
      if (color === "blue") {
        var correct_response = responseMappings.color.blue;
      } else {
        var correct_response = responseMappings.color.orange;
      }
    }

    var current_stim = {
      whichQuadrant: current_quad,
      spatial_cue: spatial_cue,
      shape: shape,
      color: color,
      form: form,
      correct_response: correct_response,
    };
    stims.push(current_stim);

    last_quad = current_quad;
  }

  return stims;
};

var getFixation = () =>
  "<div class = centerbox><div class = fixation>+</div></div>";

var getCue = function () {
  stim = stims.shift();
  shape = stim.shape;
  correct_response = stim.correct_response;
  whichQuadrant = stim.whichQuadrant;
  color = stim.color;
  form = stim.form;

  return stop_boards[whichQuadrant - 1][0] + stop_boards[whichQuadrant - 1][1];
};

var getStim = function () {
  return (
    task_boards[whichQuadrant - 1][0] +
    preFileType +
    shape +
    fileTypePNG +
    task_boards[whichQuadrant - 1][1]
  );
};

const getCurrBlockNum = () =>
  getExpStage() === "practice" ? practiceCount : testCount;

var appendData = function () {
  curr_trial = jsPsych.getProgress().current_trial_global;
  trial_id = jsPsych.data.get().filter({ trial_index: curr_trial })
    .trials[0].trial_id;
  current_trial += 1;
  task_switch = "na";
  if (current_trial > 1) {
    task_switch = task_switches[current_trial - 2]; // this might be off
  }

  if (trial_id == "practice_trial") {
    current_block = practiceCount;
  } else if (trial_id == "test_trial") {
    current_block = testCount;
  }

  jsPsych.data.get().addToLast({
    spatial_cue:
      whichQuadrant === 1
        ? quadMappings.top
        : whichQuadrant === 2
        ? quadMappings.top
        : quadMappings.bottom,
    condition: task_switch,
    correct_response: correct_response,
    whichQuadrant: whichQuadrant,
    shape: shape,
    form: form,
    color: color,
    current_trial: current_trial,
    current_block: current_block,
    block_num: getCurrBlockNum(),
  });

  if (trial_id == "practice_trial" || trial_id == "test_trial") {
    correct_trial = 0;
    if (jsPsych.data.get().last().trials[0].response == correct_response) {
      correct_trial = 1;
    }
    jsPsych.data.get().addToLast({
      correct_trial: correct_trial,
    });
  }
};

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
const fixationDuration = 500;

function getResponseMappings(group_index) {
  // Adjust group index to use values from 0 to 14.
  // Oversampling adjustments:
  // - No longer sample index for "square, blue"; middle for "circle, orange"
  // - Evenly sample the remaining key mappings
  if (0 <= group_index && group_index <= 4) {
    return {
      quadMappings: { top: "form", bottom: "color" },
      responseMappings: {
        form: { circle: ",", square: "." },
        color: { blue: ",", orange: "." },
      },
    };
  } else if (5 <= group_index && group_index <= 9) {
    return {
      quadMappings: { top: "form", bottom: "color" },
      responseMappings: {
        form: { circle: ",", square: "." },
        color: { blue: ".", orange: "," },
      },
    };
  } else if (10 <= group_index && group_index <= 14) {
    return {
      quadMappings: { top: "color", bottom: "form" },
      responseMappings: {
        form: { circle: ".", square: "," },
        color: { blue: ".", orange: "," },
      },
    };
  } else {
    throw new Error("Group index out of bounds");
  }
}

var group_index = window.efVars?.group_index ?? 1;

var { responseMappings, quadMappings } = getResponseMappings(group_index);

const choices = [",", "."];

var endText = `
  <div class="centerbox">
    <p class="center-block-text">Thanks for completing this task!</p>
    <p class="center-block-text">Press <i>enter</i> to continue.</p>
  </div>
`;

var feedbackInstructText = `
  <p class="center-block-text">
    Welcome! This experiment will take around 11 minutes.
  </p>
  <p class="center-block-text">
    To avoid technical issues, please keep the experiment tab (on Chrome or Firefox) active and in fullscreen mode for the whole duration of each task.
  </p>
  <p class="center-block-text"> Press <i>enter</i> to begin.</p>
`;

var speedReminder =
  "<p class = block-text>Try to respond as quickly and accurately as possible.</p>";

var sumInstructTime = 0; // ms
var instructTimeThresh = 5; // /in seconds

var runAttentionChecks = true;

var expStage = "practice";
var practiceLen = 4; // divisible by 4,  2 (switch or stay) by 2 (mag or parity)]
var numTrialsPerBlock = 64; //  divisible by 4
var numTestBlocks = 3;

var accuracy_thresh = 0.8;
var practice_accuracy_thresh = 0.75;

var rt_thresh = 750;
var missed_response_thresh = 0.1;
var practice_thresh = 3;

var fileTypePNG = ".png'></img>";
var preFileType =
  "<img class = center src='/static/experiments/spatial_task_switching_rdoc/images/";

var current_trial = 0;

var task_boards = [
  [
    [
      "<div class = bigbox><div class = quad_box><div class = decision-top-left><div class = gng_number><div class = cue-text>",
    ],
    ["</div></div></div></div></div>"],
  ],
  [
    [
      "<div class = bigbox><div class = quad_box><div class = decision-top-right><div class = gng_number><div class = cue-text>",
    ],
    ["</div></div></div></div></div>"],
  ],
  [
    [
      "<div class = bigbox><div class = quad_box><div class = decision-bottom-right><div class = gng_number><div class = cue-text>",
    ],
    ["</div></div></div></div></div>"],
  ],
  [
    [
      "<div class = bigbox><div class = quad_box><div class = decision-bottom-left><div class = gng_number><div class = cue-text>",
    ],
    ["</div></div></div></div></div>"],
  ],
];

var stop_boards = [
  [
    [
      "<div class = bigbox><div class = quad_box><div class = decision-top-left>",
    ],
    ["</div></div></div>"],
  ],
  [
    [
      "<div class = bigbox><div class = quad_box><div class = decision-top-right>",
    ],
    ["</div></div></div>"],
  ],
  [
    [
      "<div class = bigbox><div class = quad_box><div class = decision-bottom-right>",
    ],
    ["</div></div></div>"],
  ],
  [
    [
      "<div class = bigbox><div class = quad_box><div class = decision-bottom-left>",
    ],
    ["</div></div></div>"],
  ],
];

var prompt_text_list = `
  <ul style="text-align:left;">
    <li>Top 2 quadrants: judge the shape on its <b>${quadMappings.top}</b></li>
    <li><b>${
      quadMappings.top === "form"
        ? responseMappings.form.circle === ","
          ? "circle"
          : "square"
        : quadMappings.top === "color"
        ? responseMappings.color.blue === ","
          ? "blue"
          : "orange"
        : ""
    }</b>: comma key (,)</li>
    <li><b>${
      quadMappings.top === "form"
        ? responseMappings.form.circle === "."
          ? "circle"
          : "square"
        : quadMappings.top === "color"
        ? responseMappings.color.blue === "."
          ? "blue"
          : "orange"
        : ""
    }</b>: period key (.)</li>
    <li>Bottom 2 quadrants: judge the shape on its <b>${
      quadMappings.bottom
    }</b></li>
    <li><b>${
      quadMappings.bottom === "form"
        ? responseMappings.form.circle === ","
          ? "circle"
          : "square"
        : quadMappings.bottom === "color"
        ? responseMappings.color.blue === ","
          ? "blue"
          : "orange"
        : ""
    }</b>: comma key (,)</li>
    <li><b>${
      quadMappings.bottom === "form"
        ? responseMappings.form.circle === "."
          ? "circle"
          : "square"
        : quadMappings.bottom === "color"
        ? responseMappings.color.blue === "."
          ? "blue"
          : "orange"
        : ""
    }</b>: period key (.)</li>
  </ul>`;

var prompt_text = `
  <div class="prompt_box">
    <div class='prompt_content' style='margin-bottom: 80px;'>
      <p>Top 2 quadrants, judge the shape on its <b>${quadMappings.top}</b>:</p>
      <ul>
        <li><b>${
          quadMappings.top === "form"
            ? responseMappings.form.circle === ","
              ? "circle"
              : "square"
            : quadMappings.top === "color"
            ? responseMappings.color.blue === ","
              ? "blue"
              : "orange"
            : ""
        }</b>: comma key (,)</li>
        <li><b>${
          quadMappings.top === "form"
            ? responseMappings.form.circle === "."
              ? "circle"
              : "square"
            : quadMappings.top === "color"
            ? responseMappings.color.blue === "."
              ? "blue"
              : "orange"
            : ""
        }</b>: period key (.)</li>
      </ul>
    </div>
    <div class='prompt_content' style='margin-top: 80px;'>
      <p>Bottom 2 quadrants, judge the shape on its <b>${
        quadMappings.bottom
      }</b>:</p>
       <ul>
        <li><b>${
          quadMappings.bottom === "form"
            ? responseMappings.form.circle === ","
              ? "circle"
              : "square"
            : quadMappings.bottom === "color"
            ? responseMappings.color.blue === ","
              ? "blue"
              : "orange"
            : ""
        }</b>: comma key (,)</li>
        <li><b>${
          quadMappings.bottom === "form"
            ? responseMappings.form.circle === "."
              ? "circle"
              : "square"
            : quadMappings.bottom === "color"
            ? responseMappings.color.blue === "."
              ? "blue"
              : "orange"
            : ""
        }</b>: period key (.)</li>
      </ul>
    </div>
  </div>`;

var pageInstruct = [
  `<div class = centerbox>
    <p class="block-text">Place your <b>index finger</b> on the <b>comma key (,)</b> and your <b>middle finger</b> on the <b>period key (.)</b></p>
    <p class = block-text>During this task, on each trial you will see a single shape in one of the four quadrants of the screen.
    Based upon which quadrant the shape is presented, you will complete a different task for that shape.
    </p>
    <p class = block-text>In the top two quadrants, please judge the shape based on its <b>${
      quadMappings.top
    }</b>. Press your <b>index finger</b> ${
    quadMappings.top === "form" ? "if it's a" : "if it's"
  }
    <b>${
      quadMappings.top === "form"
        ? responseMappings.form.circle === ","
          ? "circle"
          : "square"
        : quadMappings.top === "color"
        ? responseMappings.color.blue === ","
          ? "<span style='color:#87CEEB'>blue</span>"
          : "<span style='color:#FFD700'>orange</span>"
        : ""
    }</b> and your <b>middle finger</b> ${
    quadMappings.top === "form" ? "if it's a" : "if it's"
  }
    <b>${
      quadMappings.top === "form"
        ? responseMappings.form.circle === "."
          ? "circle"
          : "square"
        : quadMappings.top === "color"
        ? responseMappings.color.blue === "."
          ? "<span style='color:#87CEEB'>blue</span>"
          : "<span style='color:#FFD700'>orange</span>"
        : ""
    }</b>. 
    </p>
     <p class = block-text>In the bottom two quadrants, please judge the shape based on its <b>${
       quadMappings.bottom
     }</b>. Press your <b>index finger</b> ${
    quadMappings.bottom === "form" ? "if it's a" : "if it's"
  }
    <b>${
      quadMappings.bottom === "form"
        ? responseMappings.form.circle === ","
          ? "circle"
          : "square"
        : quadMappings.bottom === "color"
        ? responseMappings.color.blue === ","
          ? "<span style='color:#87CEEB'>blue</span>"
          : "<span style='color:#FFD700'>orange</span>"
        : ""
    }</b> and your <b>middle finger</b> ${
    quadMappings.bottom === "form" ? "if it's a" : "if it's"
  }
    <b>${
      quadMappings.bottom === "form"
        ? responseMappings.form.circle === "."
          ? "circle"
          : "square"
        : quadMappings.bottom === "color"
        ? responseMappings.color.blue === "."
          ? "<span style='color:#87CEEB'>blue</span>"
          : "<span style='color:#FFD700'>orange</span>"
        : ""
    }</b>. 
    </p>
  </div>`,
  `<div class = centerbox>
    <p class = block-text>We'll start with a practice round. During practice, you will receive feedback and a reminder of the rules. These will be taken out for the test, so make sure you understand the instructions before moving on.</p>
    ${speedReminder}
  </div>`,
];

// IMAGES TO PRELOAD
var pathSource = "/static/experiments/spatial_task_switching_rdoc/images/";
var shapesPreload = [
  "blue_circle",
  "blue_square",
  "orange_circle",
  "orange_square",
];
var images = [];
for (i = 0; i < shapesPreload.length; i++) {
  images.push(pathSource + shapesPreload[i] + ".png");
}

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

var feedbackText =
  "<div class = centerbox><p class = center-block-text>Press <i>enter</i> to begin practice.</p></div>";

var feedback_block = {
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

var feedback_instruct_block = {
  type: jsPsychHtmlKeyboardResponse,
  data: {
    trial_id: "instruction_feedback",
    trial_duration: 30000,
  },
  choices: ["Enter"],
  stimulus: getInstructFeedback,
  trial_duration: 30000,
};

var sumInstructTime = 0;
var instructTimers = [];
var instructionPages = pageInstruct; // an array of HTML instruction pages
var instructions_block = [];

// Create one timed trial per page
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
      }, 60000);
      instructTimers.push(timer);
    },
    on_finish: function (data) {
      instructTimers.forEach(t => clearTimeout(t));
      instructTimers = [];
      sumInstructTime += data.rt != null ? data.rt : 60000;
    },
  };
}

for (let i = 0; i < instructionPages.length; i++) {
  instructions_block.push(createInstructionTrial(i));
}

// Keep this
var feedback_instruct_block = {
  type: jsPsychHtmlKeyboardResponse,
  data: {
    trial_id: "instruction_feedback",
    trial_duration: 30000,
  },
  choices: ["Enter"],
  stimulus: getInstructFeedback,
  trial_duration: 30000,
};

var instruction_node = {
  timeline: [feedback_instruct_block, ...instructions_block],
  loop_function: function () {
    sumInstructTime = 0;
    const trials = jsPsych.data
      .get()
      .filter({ trial_id: "instructions" }).trials;

    for (let i = 0; i < trials.length; i++) {
      sumInstructTime += trials[i].rt != null ? trials[i].rt : 60000;
    }

    if (sumInstructTime <= instructTimeThresh * 1000) {
      feedbackInstructText = `
        <p class=block-text>Read through instructions too quickly. Please take your time and make sure you understand the instructions.</p>
        <p class=block-text>Press <i>enter</i> to continue.</p>`;
      return true;
    } else {
      feedbackInstructText = `
        <p class=block-text>Done with instructions. Press <i>enter</i> to continue.</p>`;
      return false;
    }
  },
};

var end_block = {
  type: jsPsychHtmlKeyboardResponse,
  data: {
    trial_id: "end",
    exp_id: "spatial_task_switching_rdoc",
    trial_duration: 15000,
  },
  trial_duration: 15000,
  stimulus: endText,
  choices: ["Enter"],
};

var practiceTrials = [];
for (i = 0; i < practiceLen + 1; i++) {
  var fixation_block = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: getFixation,
    choices: ["NO_KEYS"],
    data: {
      exp_stage: "practice",
      trial_id: "practice_fixation",
      trial_duration: 500,
      stimulus_duration: 500,
    },
    stimulus_duration: 500,
    trial_duration: 500,

    prompt: prompt_text,
    on_finish: data => (data["block_num"] = practiceCount),
  };

  var practice_cue_block = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: getCue,
    choices: ["NO_KEYS"],
    data: {
      exp_stage: "practice",
      trial_id: "practice_cue",
      trial_duration: 150,
      stimulus_duration: 150,
    },
    trial_duration: 150, // getCTI
    stimulus_duration: 150, // getCTI

    prompt: prompt_text,
    on_finish: data => (data["block_num"] = practiceCount),
  };

  var practiceTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: getStim,
    choices: choices,
    data: {
      exp_stage: "practice",
      trial_id: "practice_trial",
      choices: choices,
      trial_duration: 1500,
      stimulus_duration: 1000,
    },
    stimulus_duration: 1000, // 1000
    trial_duration: 1500, // 1500
    response_ends_trial: false,
    on_finish: appendData,
    prompt: prompt_text,
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
      return getExpStage() === "practice" ? prompt_text : "";
    },
    on_finish: function (data) {
      data["trial_duration"] = ITIms * 1000;
      data["stimulus_duration"] = ITIms * 1000;
    },
  };

  var practice_feedback_block = {
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
    prompt: prompt_text,
  };
  practiceTrials.push(
    fixation_block,
    practice_cue_block,
    practiceTrial,
    practice_feedback_block,
    ITIBlock
  );
}

var practiceCount = 0;
var practiceNode = {
  timeline: [feedback_block].concat(practiceTrials),
  loop_function: function (data) {
    practiceCount += 1;

    current_trial = 0;

    var sum_rt = 0;
    var sum_responses = 0;
    var correct = 0;
    var total_trials = 0;

    for (var i = 0; i < data.trials.length; i++) {
      if (
        data.trials[i].trial_id == "practice_trial" &&
        data.trials[i].block_num == getCurrBlockNum() - 1
      ) {
        total_trials += 1;
        if (data.trials[i].rt != null) {
          sum_rt += data.trials[i].rt;
          sum_responses += 1;
          if (data.trials[i].response == data.trials[i].correct_response) {
            correct += 1;
          }
        }
      }
    }

    var accuracy = correct / total_trials;
    var missed_responses = (total_trials - sum_responses) / total_trials;
    var ave_rt = sum_rt / sum_responses;

    if (
      accuracy >= practice_accuracy_thresh ||
      practiceCount == practice_thresh
    ) {
      feedbackText = `
      <div class="centerbox">
        <p class="block-text">We will now start the test portion.</p>
        <p class="block-text">Keep your <b>index finger</b> on the <b>comma key (,)</b> and your <b>middle finger</b> on the <b>period key (.)</b></p>
        <p class="block-text">Press <i>enter</i> to continue.</p>
      </div>
      `;

      task_switches = makeTaskSwitches(numTrialsPerBlock);
      stims = createTrialTypes(task_switches);
      expStage = "test";
      return false;
    } else {
      feedbackText =
        "<div class = centerbox><p class = block-text>Please take this time to read your feedback! This screen will advance automatically in 30 seconds.</p>";

      if (accuracy < practice_accuracy_thresh) {
        feedbackText += `
          <p class="block-text">Your accuracy is low. Remember:</p>
          ${prompt_text_list}
        `;
      }

      if (ave_rt > rt_thresh) {
        feedbackText += `
        <p class="block-text">You have been responding too slowly.${speedReminder}</p>
      `;
      }

      if (missed_responses > missed_response_thresh) {
        feedbackText += `
          <p class="block-text">You have not been responding to some trials. Please respond on every trial that requires a response.</p>
        `;
      }

      feedbackText +=
        `<p class="block-text">We are now going to repeat the practice round.</p>` +
        `<p class="block-text">Press <i>enter</i> to begin.</p></div>`;

      task_switches = makeTaskSwitches(practiceLen);
      stims = createTrialTypes(task_switches);
      return true;
    }
  },
};

var testTrials = [];
testTrials.push(attentionNode);
for (i = 0; i < numTrialsPerBlock + 1; i++) {
  var fixation_block = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: getFixation,
    choices: ["NO_KEYS"],
    data: {
      exp_stage: "test",
      trial_id: "test_fixation",
      trial_duration: 500,
      stimulus_duration: 500,
    },
    stimulus_duration: 500,
    trial_duration: fixationDuration, // 500

    on_finish: data => (data["block_num"] = practiceCount),
  };

  var cue_block = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: getCue,
    choices: ["NO_KEYS"],
    data: {
      exp_stage: "test",
      trial_id: "test_cue",
      trial_duration: 150,
      stimulus_duration: 150,
    },
    trial_duration: 150, // getCTI
    stimulus_duration: 150, // getCTI

    on_finish: data => (data["block_num"] = practiceCount),
  };

  var testTrial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: getStim,
    choices: choices,
    data: {
      exp_stage: "test",
      trial_id: "test_trial",
      choices: choices,
      trial_duration: 1500,
      stimulus_duration: 1000,
    },
    stimulus_duration: 1000, // 1000
    trial_duration: 1500, // 1500

    response_ends_trial: false,
    on_finish: appendData,
  };
  testTrials.push(fixation_block);
  testTrials.push(cue_block);
  testTrials.push(testTrial);
  testTrials.push(ITIBlock);
}

var testCount = 0;
var testNode = {
  timeline: [feedback_block].concat(testTrials),
  loop_function: function (data) {
    testCount += 1;
    current_trial = 0;

    var sum_rt = 0;
    var sum_responses = 0;
    var correct = 0;
    var total_trials = 0;

    for (var i = 0; i < data.trials.length; i++) {
      if (
        data.trials[i].trial_id == "test_trial" &&
        data.trials[i].block_num == getCurrBlockNum() - 1
      ) {
        total_trials += 1;
        if (data.trials[i].rt != null) {
          sum_rt += data.trials[i].rt;
          sum_responses += 1;
          if (data.trials[i].response == data.trials[i].correct_response) {
            correct += 1;
          }
        }
      }
    }

    var accuracy = correct / total_trials;
    var missed_responses = (total_trials - sum_responses) / total_trials;
    var ave_rt = sum_rt / sum_responses;

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

      if (accuracy < accuracy_thresh) {
        feedbackText += `
          <p class="block-text">Your accuracy is low. Remember:</p>
          ${prompt_text_list}
        `;
      }

      if (ave_rt > rt_thresh) {
        feedbackText += `
        <p class="block-text">You have been responding too slowly.${speedReminder}</p>
      `;
      }

      if (missed_responses > missed_response_thresh) {
        feedbackText += `
          <p class="block-text">You have not been responding to some trials. Please respond on every trial that requires a response.</p>
        `;
      }

      feedbackText +=
        "<p class=block-text>Press <i>enter</i> to continue.</p>" + "</div>";

      task_switches = makeTaskSwitches(numTrialsPerBlock);
      stims = createTrialTypes(task_switches);
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
var exit_fullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: false,
};

spatial_task_switching_rdoc_experiment = [];

var spatial_task_switching_rdoc_init = () => {
  jsPsych.pluginAPI.preloadImages(images);
  task_switches = makeTaskSwitches(practiceLen);
  stims = createTrialTypes(task_switches);
  spatial_task_switching_rdoc_experiment.push(fullscreen);
  spatial_task_switching_rdoc_experiment.push(instruction_node);
  spatial_task_switching_rdoc_experiment.push(practiceNode);
  spatial_task_switching_rdoc_experiment.push(testNode);
  spatial_task_switching_rdoc_experiment.push(end_block);
  spatial_task_switching_rdoc_experiment.push(exit_fullscreen);
};
