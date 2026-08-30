import { estimatedTimeFor, phaseFor, firstName } from "./shared.js";

// Hand-authored 14-day multiplication curriculum: equal-groups foundation,
// then the two easiest fact families (2/5/10, then 3/4), then the facts the
// assessment flags as weak (days 4-6, detected below or defaulting to the
// classically hardest 6-9), a week-1 checkpoint, applied/word-problem days,
// then independent/challenge work and a final check compared to baseline.

function detectWeakFacts(text) {
  const fallback = [6, 7, 8, 9];
  if (!text) return fallback;
  if (/6\D{0,4}9|6\s*(?:to|through)\s*9/i.test(text)) return fallback;
  const found = new Set();
  const re = /(?:[×x]|times table of|table of|times)\s*([2-9])\b|\b([2-9])\s*(?:times|[×x])/gi;
  let m;
  while ((m = re.exec(text))) {
    const n = Number(m[1] || m[2]);
    if (n >= 2 && n <= 9) found.add(n);
  }
  const nums = [...found].filter((n) => n >= 6).sort((a, b) => a - b);
  return nums.length >= 2 ? [...nums, ...fallback].slice(0, 4) : fallback;
}

export function matches(text) {
  return /multipli/i.test(text || "");
}

export function build({ child, assessment, score }) {
  const name = firstName(child);
  const [a, b, c, d] = detectWeakFacts(assessment?.weaknesses || assessment?.topicsAssessed || "");
  const baseline = score ? `${score.correct} of ${score.total}` : "roughly 6 of 10";

  const days = [
    {
      title: "Multiplication as Equal Groups",
      focusSkill: "Equal groups",
      learningObjective: `By the end of the session, ${name} will represent multiplication using equal groups and solve 4 of 5 basic problems correctly.`,
      tutorActivity: `Use small objects (buttons, blocks, counters) or simple drawings to make groups - 3 groups of 4, 4 groups of 3, 2 groups of 5. Ask "How many groups do we have? How many in each group? How many altogether?" Guide ${name} to write the matching multiplication equation for each grouping (e.g. 3 groups of 4 -> 3 × 4 = 12).`,
      childPractice:
        "Draw equal groups and write the matching multiplication equation for each:\n4 groups of 3 = __ × __ = __\n2 groups of 5 = __ × __ = __\n3 groups of 2 = __ × __ = __\n5 groups of 2 = __ × __ = __\n2 groups of 6 = __ × __ = __",
      teachingTip: "Use concrete objects before moving to symbols - let the child physically count the groups before writing the equation.",
      successCheck: "4 of 5 correct independently.",
    },
    {
      title: "×2, ×5 and ×10 Patterns",
      focusSkill: "×2, ×5, ×10",
      learningObjective: `By the end of the session, ${name} will correctly solve at least 8 of 10 multiplication facts from the 2, 5 and 10 times tables.`,
      tutorActivity: `Show the skip-counting pattern for 2s, 5s and 10s (2, 4, 6, 8... / 5, 10, 15, 20... / 10, 20, 30...) on a number line. Have ${name} skip-count aloud, then connect each count to a multiplication fact - "the 3rd skip of 5 is 3 × 5 = 15."`,
      childPractice: "Solve:\n2 × 4 = __\n5 × 3 = __\n10 × 6 = __\n2 × 7 = __\n5 × 5 = __\n10 × 2 = __\n2 × 9 = __\n5 × 8 = __\n10 × 4 = __\n2 × 6 = __",
      teachingTip: "Skip-counting on fingers or along a number line makes the pattern visible before it becomes automatic recall.",
      successCheck: "8 of 10 correct.",
    },
    {
      title: "×3 and ×4 with Visual Support",
      focusSkill: "×3, ×4",
      learningObjective: `By the end of the session, ${name} will correctly solve at least 8 of 10 multiplication facts from the 3 and 4 times tables using an array or grouping strategy when needed.`,
      tutorActivity:
        "Draw arrays (rows and columns of dots) for 3s and 4s facts. Model one or two, then ask the child to draw their own array before solving each fact. Point out that 3 × 4 and 4 × 3 give the same answer in a different array shape.",
      childPractice: "Solve (draw an array first if it helps):\n3 × 4 = __\n4 × 3 = __\n3 × 6 = __\n4 × 5 = __\n3 × 7 = __\n4 × 8 = __\n3 × 9 = __\n4 × 4 = __\n3 × 3 = __\n4 × 6 = __",
      teachingTip: "Point out fact families (3 × 4 = 4 × 3) so the child learns two facts for the effort of one.",
      successCheck: "8 of 10 correct.",
    },
    {
      title: `Introducing ×${a}`,
      focusSkill: `×${a}`,
      learningObjective: `By the end of the session, ${name} will correctly solve at least 6 of 10 multiplication facts from the ${a} times table using a known-fact strategy.`,
      tutorActivity: `Show ${name} how to reach a ×${a} fact from a fact they already know well, e.g. ×${a} = ×${a - 1} + one more group. Work through 2-3 examples together on paper before the child tries any alone.`,
      childPractice: `Solve:\n${a} × 2 = __\n${a} × 3 = __\n${a} × 4 = __\n${a} × 5 = __\n${a} × 6 = __\n${a} × 7 = __\n${a} × 8 = __\n${a} × 9 = __`,
      teachingTip: `Anchor new facts to ones already known ("×${a} is one more group than ×${a - 1}") rather than asking for pure memorization.`,
      successCheck: "6 of 10 correct.",
    },
    {
      title: `Practicing ×${b}`,
      focusSkill: `×${b}`,
      learningObjective: `By the end of the session, ${name} will correctly solve at least 7 of 10 multiplication facts from the ${b} times table.`,
      tutorActivity: `Review yesterday's ×${a} facts briefly (2-3 questions), then introduce ×${b} the same way - connect to a known fact and practice together before independent work.`,
      childPractice: `Solve:\n${b} × 2 = __\n${b} × 3 = __\n${b} × 4 = __\n${b} × 5 = __\n${b} × 6 = __\n${b} × 7 = __\n${b} × 8 = __\n${b} × 9 = __`,
      teachingTip: "A quick 2-3 question review of yesterday's facts before starting new ones strengthens retention.",
      successCheck: "7 of 10 correct.",
    },
    {
      title: `×${c} and ×${d}`,
      focusSkill: `×${c}, ×${d}`,
      learningObjective: `By the end of the session, ${name} will correctly solve at least 7 of 10 multiplication facts mixing the ${c} and ${d} times tables.`,
      tutorActivity: `Introduce ×${c} and ×${d} using the same known-fact strategy as previous days. Point out the pattern between ×${c} and ×${d} (one more group apart) to make ×${d} easier once ×${c} is solid.`,
      childPractice: `Solve:\n${c} × 3 = __\n${d} × 3 = __\n${c} × 5 = __\n${d} × 5 = __\n${c} × 6 = __\n${d} × 6 = __\n${c} × 7 = __\n${d} × 7 = __`,
      teachingTip: `Use a times-table grid so ${name} can see all facts learned so far in one place.`,
      successCheck: "7 of 10 correct.",
    },
    {
      title: "Week 1 Checkpoint",
      focusSkill: "Mixed facts 2-9",
      learningObjective: `By the end of the session, ${name} and the tutor will identify which multiplication facts (from 2-9) are still shaky, based on a mixed review.`,
      tutorActivity: `Give a short mixed quiz covering every times table practiced this week (2, 3, 4, 5, 10, ${a}, ${b}, ${c}, ${d}). Note which facts ${name} answers instantly, which take a moment, and which are still wrong - these become the focus for the rest of the plan.`,
      childPractice: `Mixed quiz (10 questions):\n2 × 6 = __\n5 × 4 = __\n3 × 8 = __\n${a} × 5 = __\n4 × 7 = __\n${b} × 3 = __\n${c} × 4 = __\n10 × 8 = __\n${d} × 2 = __\n3 × 9 = __`,
      teachingTip: "Circle the facts that were wrong or slow, without correcting them yet - that list is this week's target list.",
      successCheck: "7 of 10 correct, with the specific missed facts noted for extra practice next week.",
    },
    {
      title: "Mixed Multiplication Review",
      focusSkill: "Mixed facts",
      learningObjective: `By the end of the session, ${name} will correctly solve at least 8 of 10 mixed multiplication facts, prioritizing the facts missed at the checkpoint.`,
      tutorActivity: "Start with the facts missed on Day 7's quiz - review the known-fact strategy for each, then mix them back in with facts already mastered.",
      childPractice: "Mixed practice set (10 facts drawn from all tables practiced so far, weighted toward last week's checkpoint misses).",
      teachingTip: "Little and often beats one long drill - three short rounds of 3-4 facts work better than one long list.",
      successCheck: "8 of 10 correct.",
    },
    {
      title: "Visual Multiplication Problems",
      focusSkill: "Visual/array problems",
      learningObjective: `By the end of the session, ${name} will solve at least 4 of 5 multiplication problems presented as a picture or array rather than a bare equation.`,
      tutorActivity: "Present multiplication as a picture - a grid of eggs in a carton, rows of chairs, a garden with equal rows of plants. Ask the child to describe what they see (rows and columns) before writing the equation.",
      childPractice:
        "Write the equation and answer for each:\nA carton has 3 rows of 4 eggs. How many eggs? __ × __ = __\nA garden has 5 rows of 6 plants. How many plants? __ × __ = __\nA bookshelf has 4 rows of 7 books. How many books? __ × __ = __",
      teachingTip: "Real, familiar images (egg cartons, chairs, gardens) make the array concept concrete before it becomes abstract.",
      successCheck: "4 of 5 correct.",
    },
    {
      title: "One-Step Word Problems",
      focusSkill: "Word problems",
      learningObjective: `By the end of the session, ${name} will correctly solve at least 4 of 5 one-step multiplication word problems.`,
      tutorActivity: 'Read each problem aloud together. Ask "what are we counting, and how many groups?" before writing any numbers, so the child practices pulling the multiplication out of the words rather than guessing an operation.',
      childPractice:
        "Solve:\nThere are 4 bags with 6 apples in each bag. How many apples in total?\nA classroom has 5 tables with 3 chairs at each table. How many chairs?\nEmma buys 6 packs of stickers with 4 stickers in each pack. How many stickers?\nA parking lot has 7 rows with 5 cars in each row. How many cars?",
      teachingTip: 'Teach the question "how many groups, and how many in each group?" as a first step before any calculation.',
      successCheck: "4 of 5 correct.",
    },
    {
      title: "Choosing the Correct Operation",
      focusSkill: "Operation sense",
      learningObjective: `By the end of the session, ${name} will correctly identify multiplication as the needed operation in at least 4 of 5 mixed word problems (some addition, some multiplication).`,
      tutorActivity: "Mix multiplication and addition word problems together. For each, ask the child to first say which operation fits and why, before solving - this separates 'reading the problem' from 'doing the math.'",
      childPractice:
        "For each, write + or × and then solve:\n3 friends each have 5 marbles. How many in total? ___\nA shop sold 4 apples on Monday and 6 on Tuesday. How many in total? ___\n5 boxes have 3 pencils each. How many pencils? ___\nThere are 8 birds in a tree, then 3 more land. How many birds now? ___",
      teachingTip: "Repeated equal groups signal multiplication; putting two different amounts together signals addition - name that difference explicitly.",
      successCheck: "4 of 5 correct.",
    },
    {
      title: "Independent Word Problems",
      focusSkill: "Word problems (independent)",
      learningObjective: `By the end of the session, ${name} will independently solve at least 4 of 5 multiplication word problems with minimal tutor support.`,
      tutorActivity: "Give the child the problem set and step back - offer help only if asked, or after a problem is attempted and wrong. Review any mistakes together afterward.",
      childPractice:
        "Solve independently:\nA baker makes 6 trays with 8 muffins on each tray. How many muffins?\nThere are 9 shelves with 4 books on each shelf. How many books?\nA farmer plants 7 rows with 6 corn plants in each row. How many plants?\nEach classroom has 24 students in 4 equal groups. How many students per group? (hint: think about the multiplication fact this comes from)",
      teachingTip: "Resist jumping in immediately - a wrong first attempt the child then corrects builds more independence than tutor-led problem solving.",
      successCheck: "4 of 5 correct with minimal support.",
    },
    {
      title: "Mixed Challenge",
      focusSkill: "Mixed challenge",
      learningObjective: `By the end of the session, ${name} will correctly solve at least 7 of 10 mixed multiplication facts and word problems at a slightly faster pace than earlier in the plan.`,
      tutorActivity: "Time a short mixed set (facts and 1-2 word problems) loosely, without pressure - the goal is comfortable fluency, not speed for its own sake. Discuss any remaining hesitations afterward.",
      childPractice: `Mixed set:\n${a} × 6 = __\n${b} × 4 = __\n7 × 3 = __\n${c} × ${d} = __\n5 friends each collect 8 shells. How many shells in total?\n4 shelves have 9 books each. How many books?`,
      teachingTip: "Celebrate accuracy first, speed second - a confident, correct answer matters more than a fast guess.",
      successCheck: "7 of 10 correct.",
    },
    {
      title: "Final Check & Progress Comparison",
      focusSkill: "Final assessment",
      learningObjective: `By the end of the session, ${name} will complete a short mixed multiplication assessment and the tutor will compare the result with the original baseline (${baseline}).`,
      tutorActivity: "Give a short, low-pressure mixed assessment covering the facts and word-problem types from across the plan. Compare the result to the starting assessment and note which specific facts have improved and which still need work going forward.",
      childPractice: `Final check:\n3 × 4 = __\n5 × 6 = __\n${a} × 3 = __\n${b} × 5 = __\n${c} × ${d} = __\nA baker makes 5 trays with 6 muffins each. How many muffins in total?`,
      teachingTip: "Frame this as a celebration of progress, not a test to pass or fail - compare to where the child started, not to a perfect score.",
      successCheck: `8 of 10 correct, an improvement on the baseline of ${baseline}.`,
    },
  ];

  return days.map((day, i) => {
    const dayNumber = i + 1;
    const { phase, difficulty } = phaseFor(dayNumber);
    return { dayNumber, difficulty, estimatedTime: estimatedTimeFor(child?.age, phase), ...day };
  });
}
