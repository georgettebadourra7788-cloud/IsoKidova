import { estimatedTimeFor, phaseFor, firstName } from "../shared.js";

// Hand-authored 14-day science curriculum focused on inquiry skills
// (observation, hypotheses, fair testing, reading data) rather than one
// narrow content topic - science assessments most often flag a skill gap
// like "doesn't understand how experiments work" or "can't read a graph"
// rather than a single fact, and these skills transfer across any specific
// topic a tutor is covering.

export const subject = "Science";
export const topic = "Scientific method and inquiry skills";

export function matches(text) {
  return /science|scientific method|hypothesis|experiment/i.test(text || "");
}

export function build({ child, score }) {
  const name = firstName(child);
  const baseline = score ? `${score.correct} of ${score.total}` : "roughly half";

  const days = [
    {
      title: "Questions Science Can Test",
      focusSkill: "Testable questions",
      learningObjective: `By the end of the session, ${name} will correctly sort 4 of 5 questions into "science can test this" or "this is an opinion" categories.`,
      tutorActivity: 'Explain that science answers questions that can be checked by observing or measuring, not questions of taste or opinion. Give one clear example of each, then compare them side by side.',
      childPractice:
        'Label each question "testable" or "opinion":\nDoes a plant grow taller with more sunlight?\nIs chocolate ice cream the best flavor?\nDoes ice melt faster in warm water or cold water?\nIs the color blue prettier than red?\nDo plants need water to grow?',
      teachingTip: "If a question can be answered by measuring or observing something, it's testable - if it depends on personal taste, it's an opinion.",
      successCheck: "4 of 5 correct.",
    },
    {
      title: "Observations vs. Inferences",
      focusSkill: "Observation vs. inference",
      learningObjective: `By the end of the session, ${name} will correctly tell the difference between an observation (what you see) and an inference (what you think it means) in 4 of 5 examples.`,
      tutorActivity: 'Show a picture or object and ask "what do you SEE?" (observation) versus "what do you THINK is happening?" (inference). Point out that two people can agree on an observation but disagree on an inference.',
      childPractice:
        'Label each "observation" or "inference":\nThe ground is wet. (___)\nIt rained last night. (___)\nThe plant\'s leaves are turning yellow. (___)\nThe plant isn\'t getting enough water. (___)\nThe dog is wagging its tail. (___)',
      teachingTip: "A good check: an observation could be captured by a camera; an inference is the explanation added afterward.",
      successCheck: "4 of 5 correct.",
    },
    {
      title: "Making a Hypothesis",
      focusSkill: "Hypotheses",
      learningObjective: `By the end of the session, ${name} will correctly write a hypothesis in the "if...then..." format for 4 of 5 questions.`,
      tutorActivity: 'Teach the "if [I do this], then [this will happen], because [reason]" hypothesis format using a simple example (if a plant gets more sunlight, then it will grow taller, because sunlight helps plants make food).',
      childPractice:
        "Write an if...then hypothesis for each:\nDoes a ball bounce higher on concrete or on grass?\nDoes a plant grow better with tap water or salt water?\nDoes a paper airplane fly farther with big wings or small wings?\nDoes ice melt faster in the sun or in the shade?",
      teachingTip: "A hypothesis doesn't need to be correct to be good - the point is making a testable prediction, not guessing the right answer.",
      successCheck: "4 of 5 correct format.",
    },
    {
      title: "Designing a Fair Test",
      focusSkill: "Fair tests / variables",
      learningObjective: `By the end of the session, ${name} will correctly identify the one thing being changed (the variable) and the things kept the same in 4 of 5 experiment descriptions.`,
      tutorActivity: 'Explain that a fair test changes only ONE thing at a time (the variable) and keeps everything else the same, so you know what caused the result. Walk through one example identifying the changed thing and the kept-the-same things.',
      childPractice:
        "For each experiment, name what was changed and what was kept the same:\nTwo plants get different amounts of water, but the same sunlight and soil.\nTwo balls of different sizes are dropped from the same height onto the same surface.\nTwo groups of seeds are given the same water and soil, but one gets more light.",
      teachingTip: "Ask 'if two things changed at once, how would you know which one caused the result?' - it makes the need for a fair test concrete.",
      successCheck: "4 of 5 correct.",
    },
    {
      title: "Reading a Simple Data Table",
      focusSkill: "Reading data tables",
      learningObjective: `By the end of the session, ${name} will correctly answer 4 of 5 questions using information from a data table.`,
      tutorActivity: "Show a simple table (e.g. plant height over 4 weeks). Point out the column headers and rows, then ask questions that require finding a specific cell, then comparing two cells.",
      childPractice:
        "Using a table showing Plant A and Plant B's height (cm) at Week 1, 2, 3, 4: Which plant was taller at Week 2? How much did Plant A grow from Week 1 to Week 4? Which week did Plant B grow the most?",
      teachingTip: "Have the child point to the exact row and column before answering - it prevents guessing from memory instead of reading the table.",
      successCheck: "4 of 5 correct.",
    },
    {
      title: "Reading a Bar Graph",
      focusSkill: "Reading graphs",
      learningObjective: `By the end of the session, ${name} will correctly answer 4 of 5 questions using a bar graph.`,
      tutorActivity: "Show a simple bar graph (e.g. favorite class subjects, or seeds sprouted per group). Point out the axis labels and what each bar represents before asking comparison questions.",
      childPractice: "Using a bar graph of 4 groups' sprouted seed counts: Which group had the most sprouts? Which had the fewest? How many more did Group A have than Group C?",
      teachingTip: "Always check the axis labels first, out loud, before reading any bar's value - it's the most common source of misreading a graph.",
      successCheck: "4 of 5 correct.",
    },
    {
      title: "Week 1 Checkpoint",
      focusSkill: "Mixed inquiry review",
      learningObjective: `By the end of the session, ${name} and the tutor will identify which inquiry skills (testable questions, observation vs. inference, hypotheses, fair tests, reading data) are still shaky, based on a mixed review.`,
      tutorActivity: "Give a short mixed review covering everything practiced this week. Note which items are answered confidently and which are still difficult - these become the focus for the rest of the plan.",
      childPractice: "Mixed review (6 items) - one from each skill practiced this week.",
      teachingTip: "Note the specific items that were wrong or slow, without correcting them yet - that list is this week's target list.",
      successCheck: "5 of 6 correct, with specific misses noted for extra practice.",
    },
    {
      title: "Cause and Effect in Experiments",
      focusSkill: "Cause and effect",
      learningObjective: `By the end of the session, ${name} will correctly explain the cause-and-effect relationship shown in 4 of 5 simple experiment results.`,
      tutorActivity: 'Present a simple result (e.g. "the plant with more sunlight grew taller") and ask "what caused this effect?" then "how do we know it was that, and not something else?" tying back to fair testing.',
      childPractice:
        "For each result, name the cause and the effect:\nThe ice cube in the sun melted faster than the one in the shade.\nThe car with bigger wheels rolled farther down the ramp.\nThe plant with fertilizer grew more leaves than the one without.",
      teachingTip: "Practice the sentence frame '___ caused ___' out loud before writing - it makes the relationship concrete.",
      successCheck: "4 of 5 correct.",
    },
    {
      title: "Interpreting a Science Diagram",
      focusSkill: "Reading diagrams",
      learningObjective: `By the end of the session, ${name} will correctly answer 4 of 5 questions about a labeled science diagram (e.g. a life cycle or a simple system).`,
      tutorActivity: "Show a labeled diagram (a life cycle, the water cycle, or a simple food chain). Point out the labels and arrows, and how the order/direction carries meaning.",
      childPractice: "Using a labeled life-cycle diagram: What comes right after the egg stage? Which stage comes before the adult stage? What does the arrow between two stages mean?",
      teachingTip: "Trace the arrows with a finger while explaining out loud - it reinforces that diagrams show a sequence or relationship, not just a list.",
      successCheck: "4 of 5 correct.",
    },
    {
      title: "Applying the Scientific Method to a New Question",
      focusSkill: "Applying the method",
      learningObjective: `By the end of the session, ${name} will correctly write a question, hypothesis, and one fair-test detail for a brand-new scenario.`,
      tutorActivity: "Present a new, unfamiliar scenario (e.g. does music affect how fast someone finishes a puzzle?) and guide the child through each step: question, hypothesis, and what would be kept the same versus changed.",
      childPractice: "For the scenario 'Does the color of a room affect how calm people feel?', write: a testable question, an if...then hypothesis, and one thing that should stay the same between test groups.",
      teachingTip: "Let the child pick their own everyday question if the given scenario doesn't interest them - engagement matters more than the specific topic.",
      successCheck: "3 of 3 parts written correctly.",
    },
    {
      title: "Designing a Simple Experiment",
      focusSkill: "Experiment design",
      learningObjective: `By the end of the session, ${name} will independently design a simple, fair experiment (question, hypothesis, variable, what's kept the same) for a topic of their choice.`,
      tutorActivity: "Let the child choose a simple, testable question they're curious about. Guide them through designing the experiment using everything practiced so far, stepping back once they've got the structure.",
      childPractice: "Design your own simple experiment: write the question, a hypothesis, the one variable you'd change, and two things you'd keep the same.",
      teachingTip: "Resist correcting the science content too early - focus feedback on whether the TEST is fair, not whether the hypothesis will turn out true.",
      successCheck: "4 of 4 parts included and internally consistent.",
    },
    {
      title: "Analyzing Experiment Results",
      focusSkill: "Analyzing results",
      learningObjective: `By the end of the session, ${name} will correctly interpret a set of results and state whether they support or don't support a given hypothesis, in 3 of 4 examples.`,
      tutorActivity: 'Give a hypothesis and a small data table or graph of results. Ask "do these results support the hypothesis, or not? How do you know?"',
      childPractice: "For hypothesis 'plants grow taller with more sunlight' and a table showing 3 plants' heights at 3 different light levels: do the results support the hypothesis? Explain using the numbers.",
      teachingTip: "It's fine (and realistic) for results to only partly support a hypothesis - teach the child to say so honestly rather than forcing a yes/no.",
      successCheck: "3 of 4 correct with a data-based explanation.",
    },
    {
      title: "Mixed Science Challenge",
      focusSkill: "Mixed challenge",
      learningObjective: `By the end of the session, ${name} will correctly complete 5 of 6 mixed inquiry items spanning every skill in the plan.`,
      tutorActivity: "Give a mixed set touching testable questions, hypotheses, fair tests, and reading data/graphs, at a relaxed and comfortable pace.",
      childPractice: "Mixed challenge (6 items) spanning testable questions, hypotheses, fair tests, and reading a table or graph.",
      teachingTip: "Celebrate accuracy first, speed second - a confident, correct answer matters more than a fast guess.",
      successCheck: "5 of 6 correct.",
    },
    {
      title: "Final Check & Progress Comparison",
      focusSkill: "Final assessment",
      learningObjective: `By the end of the session, ${name} will complete a short mixed inquiry-skills assessment and the tutor will compare the result with the original baseline (${baseline}).`,
      tutorActivity: "Give a short, low-pressure mixed assessment covering testable questions, hypotheses, fair tests, and reading data. Compare the result to the starting assessment and note which specific skills have improved.",
      childPractice: "Final check (5-6 items) mixing testable questions, a hypothesis, and one data/graph reading question.",
      teachingTip: "Frame this as a celebration of progress, not a test to pass or fail - compare to where the child started, not to a perfect score.",
      successCheck: `5 of 6 correct, an improvement on the baseline of ${baseline}.`,
    },
  ];

  return days.map((day, i) => {
    const dayNumber = i + 1;
    const { phase, difficulty } = phaseFor(dayNumber);
    return { dayNumber, difficulty, estimatedTime: estimatedTimeFor(child?.age, phase), ...day };
  });
}
