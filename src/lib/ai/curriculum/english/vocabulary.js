import { estimatedTimeFor, phaseFor, firstName } from "../shared.js";

// Hand-authored 14-day English vocabulary curriculum: context clues and
// word parts (prefixes/suffixes/roots) first, then synonym/antonym
// relationships, a checkpoint, applying words in reading and writing, then
// independent word study and a final check against baseline.

export const subject = "English Language";
export const topic = "Vocabulary";

export function matches(text) {
  return /vocabulary|word meaning|prefix|suffix/i.test(text || "");
}

export function build({ child, score }) {
  const name = firstName(child);
  const baseline = score ? `${score.correct} of ${score.total}` : "roughly half";

  const days = [
    {
      title: "Context Clues Basics",
      focusSkill: "Context clues",
      learningObjective: `By the end of the session, ${name} will correctly guess the meaning of an unfamiliar word from its sentence in 4 of 5 examples.`,
      tutorActivity:
        'Pick a sentence with one unfamiliar word. Ask "what do the other words around it tell you about what it might mean?" before checking a dictionary - model this out loud with one example first.',
      childPractice:
        'Guess the meaning of the underlined word, then explain why:\n"The ravenous dog gobbled up its food in seconds." (ravenous = ___)\n"The ancient castle looked abandoned and derelict." (derelict = ___)\n"She spoke with such candor that everyone believed her." (candor = ___)',
      teachingTip: "Praise reasonable guesses based on context even when not exact - the strategy matters more than a perfect definition at this stage.",
      successCheck: "4 of 5 correct with a reasonable explanation.",
    },
    {
      title: "Common Prefixes",
      focusSkill: "Prefixes",
      learningObjective: `By the end of the session, ${name} will correctly use un-, re-, and pre- to figure out a word's meaning in 6 of 8 examples.`,
      tutorActivity: 'Teach un- (not), re- (again), and pre- (before) with familiar examples (unhappy, redo, preview). Show how removing the prefix reveals a base word the child likely already knows.',
      childPractice:
        "Write what each word means, using the prefix meaning:\nunfair = __\nrewrite = __\npreheat = __\nunlock = __\nreplay = __\npretest = __\nunwrap = __\nrebuild = __",
      teachingTip: "Have the child find the base word first (fair, write, heat) - the prefix meaning clicks faster once the root is clear.",
      successCheck: "6 of 8 correct.",
    },
    {
      title: "Common Suffixes",
      focusSkill: "Suffixes",
      learningObjective: `By the end of the session, ${name} will correctly use -ful, -less, and -ly to figure out a word's meaning in 6 of 8 examples.`,
      tutorActivity: "Teach -ful (full of), -less (without), and -ly (in a certain way) with familiar examples (careful, careless, quickly). Practice building both members of a pair (careful/careless) from the same root.",
      childPractice:
        "Write what each word means:\nhelpful = __\nhelpless = __\nslowly = __\nfearless = __\ncolorful = __\nquickly = __\nharmless = __\ncheerful = __",
      teachingTip: "Pairing opposite suffixes on the same root (helpful/helpless) makes the meaning of each suffix stand out by contrast.",
      successCheck: "6 of 8 correct.",
    },
    {
      title: "Synonyms",
      focusSkill: "Synonyms",
      learningObjective: `By the end of the session, ${name} will correctly match a word to its synonym in 7 of 10 examples.`,
      tutorActivity: 'Introduce synonyms as "words that mean almost the same thing." Show that authors use synonyms to avoid repeating the same word - find an example in a book or passage the child is reading.',
      childPractice:
        "Match each word to its best synonym:\nhappy - (a) sad (b) joyful (c) tired\nbig - (a) huge (b) tiny (c) quiet\nfast - (a) slow (b) quick (c) heavy\nsmart - (a) clever (b) silly (c) loud\nquiet - (a) noisy (b) silent (c) bright\ntired - (a) exhausted (b) excited (c) angry",
      teachingTip: "Point out that synonyms are rarely IDENTICAL in meaning - a good follow-up question is 'what's slightly different about these two words?'",
      successCheck: "7 of 10 correct.",
    },
    {
      title: "Antonyms",
      focusSkill: "Antonyms",
      learningObjective: `By the end of the session, ${name} will correctly match a word to its antonym in 7 of 10 examples.`,
      tutorActivity: 'Introduce antonyms as "words that mean the opposite." Practice by taking turns saying a word and having the other person give the opposite.',
      childPractice:
        "Write the opposite (antonym) of each word:\nhot = __\nbig = __\nhappy = __\nfast = __\nlight = __\nfull = __\nold = __\nloud = __\nbrave = __\ngenerous = __",
      teachingTip: "Turn it into a quick back-and-forth game - antonym recall builds speed with repetition, not analysis.",
      successCheck: "7 of 10 correct.",
    },
    {
      title: "Word Roots",
      focusSkill: "Word roots",
      learningObjective: `By the end of the session, ${name} will correctly identify the shared root in a family of related words and use it to guess a new word's meaning in 4 of 5 examples.`,
      tutorActivity: 'Introduce one common root, e.g. "tele" (far away) or "port" (carry). Show 2-3 words built from it (telephone, television, telescope / transport, portable, export) and ask what they have in common.',
      childPractice:
        "The root \"port\" means carry. Guess what each word means:\ntransport = __\nportable = __\nexport = __\nimport = __\nWhat do you think a \"reporter\" does, using this root as a clue?",
      teachingTip: "One root per session is enough - depth (several real examples) beats breadth (many roots skimmed) for retention.",
      successCheck: "4 of 5 correct.",
    },
    {
      title: "Week 1 Checkpoint",
      focusSkill: "Mixed vocabulary review",
      learningObjective: `By the end of the session, ${name} and the tutor will identify which vocabulary skills (context clues, prefixes, suffixes, synonyms, antonyms, roots) are still shaky, based on a mixed review.`,
      tutorActivity: "Give a short mixed review covering everything practiced this week. Note which items are answered confidently and which are still difficult - these become the focus for the rest of the plan.",
      childPractice: "Mixed review (8 items) - one from each skill practiced this week: context clues, prefixes, suffixes, synonyms, antonyms, roots.",
      teachingTip: "Note the specific items that were wrong or slow, without correcting them yet - that list is this week's target list.",
      successCheck: "6 of 8 correct, with specific misses noted for extra practice.",
    },
    {
      title: "Vocabulary in a Reading Passage",
      focusSkill: "Vocabulary in context",
      learningObjective: `By the end of the session, ${name} will correctly define 4 of 5 unfamiliar words found in a real short passage, using context.`,
      tutorActivity: "Choose a short passage with 4-5 words above the child's typical vocabulary. Read together, pausing at each target word to apply the context-clue strategy from Day 1.",
      childPractice: "Read the passage the tutor selects. For each bolded word, write a guessed meaning and the context clue that helped.",
      teachingTip: "Real reading material (not isolated sentences) is the real test of whether the strategy transfers.",
      successCheck: "4 of 5 correct.",
    },
    {
      title: "Using New Words in Sentences",
      focusSkill: "Using vocabulary",
      learningObjective: `By the end of the session, ${name} will correctly use 4 of 5 recently learned words in an original, sensible sentence.`,
      tutorActivity: 'Pick 5 words practiced this week. For each, ask "can you use this in a sentence about your own life?" - using a word correctly in a new sentence is a stronger test of understanding than defining it.',
      childPractice: "Write one original sentence using each of these 5 words (chosen from this week's practice) correctly.",
      teachingTip: "A slightly odd but grammatically/semantically correct sentence still counts as a win - don't over-correct style at this stage.",
      successCheck: "4 of 5 sentences use the word correctly.",
    },
    {
      title: "Analogies",
      focusSkill: "Analogies",
      learningObjective: `By the end of the session, ${name} will correctly complete a word analogy in 3 of 5 examples.`,
      tutorActivity: 'Introduce analogies as "the relationship between the first pair must match the second pair." Model with one easy example (hot is to cold as up is to ___) before the child tries alone.',
      childPractice: "Complete each analogy:\nHot is to cold as day is to ___\nHappy is to sad as fast is to ___\nBig is to small as loud is to ___\nDog is to puppy as cat is to ___\nTeacher is to school as doctor is to ___",
      teachingTip: "Say the relationship out loud in words first ('hot and cold are opposites') before filling in the blank - it makes the pattern explicit.",
      successCheck: "3 of 5 correct.",
    },
    {
      title: "Independent Word Study",
      focusSkill: "Independent practice",
      learningObjective: `By the end of the session, ${name} will independently complete a mixed vocabulary set (synonyms, antonyms, context clues) with at least 7 of 10 correct.`,
      tutorActivity: "Hand over a mixed practice set and step back - help only if asked, or after an attempted, incorrect answer. Review mistakes together afterward.",
      childPractice: "Independent mixed set (10 items) drawn from synonyms, antonyms, and context clues practiced so far.",
      teachingTip: "Resist jumping in immediately - a wrong first attempt the child then corrects builds more independence than tutor-led correction.",
      successCheck: "7 of 10 correct with minimal support.",
    },
    {
      title: "Vocabulary in Writing",
      focusSkill: "Vocabulary in writing",
      learningObjective: `By the end of the session, ${name} will use at least 3 recently learned words correctly in a short piece of original writing.`,
      tutorActivity: "Ask the child to write 3-4 sentences about a topic of their choice, deliberately including at least 3 words practiced this week. Review together afterward for correct usage.",
      childPractice: "Write a short paragraph (3-4 sentences) about any topic, using at least 3 vocabulary words from this plan correctly.",
      teachingTip: "Let the child pick the topic - motivation to write about something they care about outweighs a perfectly chosen prompt.",
      successCheck: "3 of 3 target words used correctly.",
    },
    {
      title: "Mixed Vocabulary Challenge",
      focusSkill: "Mixed challenge",
      learningObjective: `By the end of the session, ${name} will correctly complete 7 of 10 mixed vocabulary items covering every skill practiced in the plan.`,
      tutorActivity: "Give a slightly harder mixed set (prefixes, suffixes, synonyms, antonyms, analogies, context clues) at a relaxed, comfortable pace.",
      childPractice: "Mixed challenge set (10 items) spanning every skill practiced across the plan.",
      teachingTip: "Celebrate accuracy first, speed second - a confident, correct answer matters more than a fast guess.",
      successCheck: "7 of 10 correct.",
    },
    {
      title: "Final Check & Progress Comparison",
      focusSkill: "Final assessment",
      learningObjective: `By the end of the session, ${name} will complete a short mixed vocabulary assessment and the tutor will compare the result with the original baseline (${baseline}).`,
      tutorActivity: "Give a short, low-pressure mixed assessment covering context clues, word parts, and synonym/antonym relationships. Compare the result to the starting assessment and note which specific skills have improved.",
      childPractice: "Final check (5-8 items) mixing context clues, prefixes/suffixes, and synonyms/antonyms.",
      teachingTip: "Frame this as a celebration of progress, not a test to pass or fail - compare to where the child started, not to a perfect score.",
      successCheck: `6 of 8 correct, an improvement on the baseline of ${baseline}.`,
    },
  ];

  return days.map((day, i) => {
    const dayNumber = i + 1;
    const { phase, difficulty } = phaseFor(dayNumber);
    return { dayNumber, difficulty, estimatedTime: estimatedTimeFor(child?.age, phase), ...day };
  });
}
