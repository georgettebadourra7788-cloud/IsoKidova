import { estimatedTimeFor, phaseFor, firstName } from "../shared.js";

// Hand-authored 14-day reading comprehension curriculum: literal
// comprehension and main idea first, then inference/cause-effect/sequencing,
// a checkpoint, applied reading across text types, then independent
// summarizing and a final check against baseline.

// Self-describing metadata (see ../index.js) - what makes this curriculum
// discoverable and organizable by subject as more are added.
export const subject = "Reading";
export const topic = "Reading comprehension";

// "Vocabulary" alone routes to english/vocabulary.js instead - this stays
// scoped to comprehension-specific language so the two don't shadow each
// other in the dispatcher.
export function matches(text) {
  return /(reading comprehension|comprehension|main idea|inference)/i.test(text || "");
}

export function build({ child, score }) {
  const name = firstName(child);
  const baseline = score ? `${score.correct} of ${score.total}` : "roughly half";

  const days = [
    {
      title: "Finding the Main Idea",
      focusSkill: "Main idea",
      learningObjective: `By the end of the session, ${name} will identify the main idea of a short passage in 4 of 5 practice passages.`,
      tutorActivity: `Read a short passage together. Ask "what is this mostly about, in one sentence?" before asking any detail questions. Model the difference between the main idea and a supporting detail using one worked example.`,
      childPractice:
        'Read, then circle the best main idea:\n"Maria fed her dog, then swept the porch, then watered the plants. She likes keeping her yard tidy every morning." Main idea: (a) Maria has a dog (b) Maria has a morning routine to keep her yard tidy (c) Maria waters plants\nWrite the main idea of this passage in one sentence: "The library was quiet except for the soft turning of pages. Students sat at long tables, some reading, some writing notes for a test."',
      teachingTip: "Ask for the main idea before any detail questions - answering details first can make the main idea harder to see.",
      successCheck: "4 of 5 correct.",
    },
    {
      title: "Literal Comprehension - Who, What, Where",
      focusSkill: "Literal comprehension",
      learningObjective: `By the end of the session, ${name} will correctly answer at least 4 of 5 literal (directly-stated) comprehension questions.`,
      tutorActivity: "Read a short passage together, then ask direct who/what/where/when questions whose answers are stated word-for-word in the text. Show how to point to the exact sentence that has the answer.",
      childPractice:
        'Read: "On Saturday, Tom and his sister went to the park. They saw three ducks swimming in the pond and fed them bread." Answer:\nWho went to the park?\nWhen did they go?\nWhat did they see in the pond?\nWhat did they do with the ducks?',
      teachingTip: "Have the child point to or underline the sentence that answers each question - it builds the habit of checking the text instead of guessing.",
      successCheck: "4 of 5 correct.",
    },
    {
      title: "Vocabulary in Context",
      focusSkill: "Vocabulary in context",
      learningObjective: `By the end of the session, ${name} will correctly figure out the meaning of an unfamiliar word from context in 4 of 5 examples.`,
      tutorActivity: 'Pick a sentence with one unfamiliar word. Ask "what do the other words around it tell you about what it might mean?" before allowing a dictionary check - model this with one example first.',
      childPractice:
        'Guess the meaning of the underlined word from context, then explain why:\n"The hikers were exhausted after climbing the steep trail all day." (exhausted = ___)\n"The tiny kitten was dwarfed by the large dog standing next to it." (dwarfed = ___)\n"She whispered so quietly that no one else in the room could hear her." (whispered = ___)',
      teachingTip: "Praise reasonable guesses based on context even when not exact - the strategy matters more than a perfect definition at this stage.",
      successCheck: "4 of 5 correct with a reasonable explanation.",
    },
    {
      title: "Making Simple Inferences",
      focusSkill: "Inference",
      learningObjective: `By the end of the session, ${name} will correctly answer at least 3 of 5 inference questions (combining text clues with what the child already knows).`,
      tutorActivity: 'Read a short passage that implies something without stating it directly. Ask "what does the text tell us, and what do we already know, that lets us figure this out?" - separate the clue from the conclusion out loud.',
      childPractice:
        'Read: "Jake grabbed his umbrella and put on his raincoat before leaving the house." What can you infer? (a) Jake is going swimming (b) It is probably raining or about to rain (c) Jake forgot his backpack\nRead: "Mia\'s hands were covered in flour and the kitchen smelled sweet." What is Mia probably doing? Explain the clues that tell you.',
      teachingTip: "Ask the child to name the specific clue words that led to their answer - this makes the invisible thinking process visible.",
      successCheck: "3 of 5 correct with a stated clue.",
    },
    {
      title: "Cause and Effect",
      focusSkill: "Cause and effect",
      learningObjective: `By the end of the session, ${name} will correctly identify the cause and the effect in 4 of 5 short passages.`,
      tutorActivity: 'Read short passages containing a clear cause and effect. Ask "what happened?" (effect) and "why did it happen?" (cause) separately, then connect them with "because."',
      childPractice:
        'Read each, then write the cause and the effect:\n"Because it rained all night, the field was too muddy to play on."\n"The power went out, so the family lit candles."\n"Tom forgot his lunch, so he was hungry all afternoon."',
      teachingTip: 'Practice the sentence frame "___ happened because ___" out loud before writing - it makes the cause/effect relationship concrete.',
      successCheck: "4 of 5 correct.",
    },
    {
      title: "Sequencing Events",
      focusSkill: "Sequencing",
      learningObjective: `By the end of the session, ${name} will correctly order the events of a short passage in 4 of 5 practice items.`,
      tutorActivity: "Read a short passage with 3-4 clear events, out of a natural first-then-next-last order in the retelling. Ask the child to identify sequence words (first, next, then, after, finally) and use them to order the events.",
      childPractice:
        'Read: "After Sam brushed his teeth, he put on his shoes. But before that, he had gotten dressed. The very first thing he did was wake up." Number the events 1-4 in the order they actually happened: ___ got dressed  ___ put on shoes  ___ woke up  ___ brushed teeth',
      teachingTip: "Some passages describe events out of order on purpose - teach the child to look for sequence words rather than assuming sentence order is event order.",
      successCheck: "4 of 5 correct.",
    },
    {
      title: "Week 1 Checkpoint",
      focusSkill: "Mixed comprehension",
      learningObjective: `By the end of the session, ${name} and the tutor will identify which comprehension skills (main idea, literal detail, vocabulary, inference, cause/effect, sequencing) are still shaky, based on one mixed passage.`,
      tutorActivity: "Give one passage with a mix of question types covering everything practiced this week. Note which question types the child answers confidently and which are still difficult - these become the focus for the rest of the plan.",
      childPractice:
        'Read the passage, then answer: main idea, one literal detail question, one vocabulary-in-context question, and one inference question (the tutor selects a short passage appropriate to the child\'s reading level).',
      teachingTip: "Note the specific skill types that were hardest, not just the overall score - that list drives the rest of the plan.",
      successCheck: "3 of 4 question types answered correctly, with the weak type(s) noted for extra focus.",
    },
    {
      title: "Reading Nonfiction Paragraphs",
      focusSkill: "Nonfiction reading",
      learningObjective: `By the end of the session, ${name} will correctly answer at least 3 of 4 comprehension questions about a short nonfiction paragraph.`,
      tutorActivity: "Read a short factual paragraph (about an animal, a place, or how something works). Nonfiction often needs different strategies than stories - point out headings, facts, and the more direct sentence structure.",
      childPractice:
        'Read: "Octopuses have eight arms and three hearts. Two hearts pump blood to the gills, and one pumps blood to the rest of the body. Octopuses can change color to hide from danger." How many hearts does an octopus have? What do two of the hearts do? Why do octopuses change color?',
      teachingTip: "Nonfiction facts are usually stated directly - encourage the child to answer using the exact words from the text when possible.",
      successCheck: "3 of 4 correct.",
    },
    {
      title: "Reading a Short Story",
      focusSkill: "Fiction reading",
      learningObjective: `By the end of the session, ${name} will correctly answer at least 3 of 4 comprehension questions (character, setting, and plot) about a short story.`,
      tutorActivity: 'Read a short story together. Ask about the characters ("who is in the story?"), the setting ("where and when does it happen?"), and the plot ("what problem happens, and how is it solved?").',
      childPractice: "Read a short story chosen by the tutor, then answer: Who are the main characters? Where does the story happen? What problem do the characters face? How is it solved?",
      teachingTip: "If the child struggles with plot, ask about the problem and solution separately - it's often easier than describing the whole plot at once.",
      successCheck: "3 of 4 correct.",
    },
    {
      title: "Following Multi-Step Instructions",
      focusSkill: "Instructional text",
      learningObjective: `By the end of the session, ${name} will correctly follow and answer questions about a 3-4 step written instruction in 4 of 5 items.`,
      tutorActivity: 'Give short written instructions (a simple recipe step, a game rule, a craft step) and have the child follow or explain them in their own words - reading to do something is a different skill than reading to recall facts.',
      childPractice:
        'Read: "First, draw a large circle. Next, draw two small circles inside it for eyes. Then, draw a curved line for a smile. Finally, color the whole face yellow." What do you draw first? What goes inside the big circle? What color is the face?',
      teachingTip: "Have the child restate instructions in their own words before starting - it reveals whether they truly understood the sequence.",
      successCheck: "4 of 5 correct.",
    },
    {
      title: "Identifying Author's Purpose",
      focusSkill: "Author's purpose",
      learningObjective: `By the end of the session, ${name} will correctly identify whether a passage is meant to inform, entertain, or persuade in 3 of 4 examples.`,
      tutorActivity: 'Show 3-4 very short passages of different types (a fact sheet, a story opening, an advertisement). Ask "why do you think someone wrote this - to tell you facts, to entertain you, or to convince you of something?"',
      childPractice:
        'For each, write inform, entertain, or persuade:\n"Sharks have been on Earth for over 400 million years."\n"Once upon a time, in a castle high on a hill, lived a curious young dragon."\n"Try our new juice today - the tastiest, healthiest drink you\'ll ever have!"',
      teachingTip: "Point out concrete clues for each purpose - facts and numbers signal inform, imaginative openings signal entertain, and strong opinions/calls to action signal persuade.",
      successCheck: "3 of 4 correct.",
    },
    {
      title: "Summarizing a Passage",
      focusSkill: "Summarizing",
      learningObjective: `By the end of the session, ${name} will independently write a 1-2 sentence summary that captures the main idea of a passage, for 3 of 4 passages.`,
      tutorActivity: "Give a short passage and ask the child to summarize it in their own words in 1-2 sentences - not retell every detail. Model the difference between a summary and a retelling with one example first.",
      childPractice: "Read a passage chosen by the tutor, then write a 1-2 sentence summary in your own words (not copied from the text).",
      teachingTip: 'If the child retells everything, ask "if you could only say one sentence, what would it be?" to force the main idea forward.',
      successCheck: "3 of 4 summaries capture the main idea in the child's own words.",
    },
    {
      title: "Mixed Challenge Passage",
      focusSkill: "Mixed challenge",
      learningObjective: `By the end of the session, ${name} will correctly answer at least 4 of 5 mixed comprehension questions on a slightly longer passage, with reduced tutor support.`,
      tutorActivity: "Give a longer passage than earlier in the plan, mixing question types (main idea, detail, inference, vocabulary). Let the child attempt it mostly independently, stepping in only if truly stuck.",
      childPractice: "Read the passage independently, then answer the mixed question set without help unless asked.",
      teachingTip: "Resist correcting mid-passage - let the child finish and self-check against the text afterward.",
      successCheck: "4 of 5 correct.",
    },
    {
      title: "Final Check & Progress Comparison",
      focusSkill: "Final assessment",
      learningObjective: `By the end of the session, ${name} will complete a short mixed comprehension assessment and the tutor will compare the result with the original baseline (${baseline}).`,
      tutorActivity: "Give a short, low-pressure passage with a mix of question types covering everything from the plan. Compare the result with the starting assessment and note which specific skills have improved and which still need continued practice.",
      childPractice: "Read the passage and answer the mixed question set (main idea, one detail, one inference, one vocabulary-in-context question).",
      teachingTip: "Frame this as a celebration of progress, not a test to pass or fail - compare to where the child started, not to a perfect score.",
      successCheck: `3 of 4 question types answered correctly, an improvement on the baseline of ${baseline}.`,
    },
  ];

  return days.map((day, i) => {
    const dayNumber = i + 1;
    const { phase, difficulty } = phaseFor(dayNumber);
    return { dayNumber, difficulty, estimatedTime: estimatedTimeFor(child?.age, phase), ...day };
  });
}
