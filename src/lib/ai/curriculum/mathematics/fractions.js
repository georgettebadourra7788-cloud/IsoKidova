import { estimatedTimeFor, phaseFor, firstName } from "../shared.js";

// Hand-authored 14-day fractions curriculum: what a fraction is and
// comparing/ordering them, then equivalence and operations, a checkpoint,
// real-world application (including converting to decimals, since that's a
// common paired weakness), then independent work and a final check.

export const subject = "Mathematics";
export const topic = "Fractions";

export function matches(text) {
  return /fraction/i.test(text || "");
}

export function build({ child, assessment, score }) {
  const name = firstName(child);
  const alsoDecimals = /decimal/i.test(assessment?.weaknesses || assessment?.topicsAssessed || "");
  const baseline = score ? `${score.correct} of ${score.total}` : "roughly half";

  const days = [
    {
      title: "What Is a Fraction?",
      focusSkill: "Fraction basics",
      learningObjective: `By the end of the session, ${name} will identify the numerator and denominator and shade a fraction of a shape correctly in 4 of 5 examples.`,
      tutorActivity: `Draw a circle or rectangle and divide it into equal parts. Shade some parts and ask "how many parts are shaded, and how many parts total?" Show how this becomes a fraction (shaded/total), naming the top number the numerator and the bottom the denominator.`,
      childPractice:
        "Shade the fraction shown, then write numerator and denominator separately:\n3/4 of a rectangle (8 parts) - shade 3/4\n1/2 of a circle - shade half\n2/3 of a rectangle (6 parts) - shade 2/3\nFor 5/8: numerator = __, denominator = __",
      teachingTip: "Use a physical object (a pizza drawing, a chocolate bar) rather than an abstract shape at first - food splits are intuitive.",
      successCheck: "4 of 5 correct.",
    },
    {
      title: "Comparing Fractions with the Same Denominator",
      focusSkill: "Comparing like fractions",
      learningObjective: `By the end of the session, ${name} will correctly compare two fractions with the same denominator in 4 of 5 examples.`,
      tutorActivity: `Show two fractions with the same denominator (e.g. 3/8 and 5/8) using shaded shapes side by side. Ask "which is bigger, and how do you know?" - guide ${name} to see that with the same denominator, more shaded parts means a bigger fraction.`,
      childPractice: "Circle the bigger fraction:\n3/8 or 5/8\n2/6 or 4/6\n7/10 or 3/10\n1/4 or 3/4\n5/9 or 2/9",
      teachingTip: "Keep the denominator the same across every example this session - mixing denominators in comparisons comes later, once this pattern is solid.",
      successCheck: "4 of 5 correct.",
    },
    {
      title: "Fractions on a Number Line",
      focusSkill: "Fractions on a number line",
      learningObjective: `By the end of the session, ${name} will correctly place 4 of 5 fractions on a number line between 0 and 1.`,
      tutorActivity: "Draw a number line from 0 to 1. Mark halves together first, then quarters, asking the child to count the equal spaces before placing each fraction.",
      childPractice: "Mark these on a 0-to-1 number line: 1/2, 1/4, 3/4, 1/3, 2/3.",
      teachingTip: "Fold a paper strip into equal parts and lay it along a drawn line - it makes the equal-spacing idea physical, not just visual.",
      successCheck: "4 of 5 correct.",
    },
    {
      title: "Equivalent Fractions",
      focusSkill: "Equivalent fractions",
      learningObjective: `By the end of the session, ${name} will correctly find an equivalent fraction in 6 of 10 examples using a multiply-both-parts strategy.`,
      tutorActivity: 'Show that multiplying (or dividing) the numerator and denominator by the same number keeps the fraction\'s value the same, using a shaded-shape example (1/2 = 2/4 = 4/8, all the same amount shaded). Model "whatever you do to the top, do to the bottom."',
      childPractice: "Find an equivalent fraction:\n1/2 = __/4\n1/3 = __/6\n2/5 = __/10\n3/4 = __/8\n1/2 = __/8\n2/3 = __/9\n1/4 = __/12\n3/5 = __/10\n2/2 = __/6\n1/5 = __/10",
      teachingTip: "Draw the equivalence out at least once (two shapes with different numbers of parts, same amount shaded) before jumping to the number pattern alone.",
      successCheck: "6 of 10 correct.",
    },
    {
      title: "Comparing Fractions with Different Denominators",
      focusSkill: "Comparing unlike fractions",
      learningObjective: `By the end of the session, ${name} will correctly compare two fractions with different denominators in 6 of 10 examples by converting to a common denominator.`,
      tutorActivity: "Show that fractions with different denominators can't be compared directly - use yesterday's equivalent-fraction skill to rewrite one (or both) with a matching denominator first, then compare.",
      childPractice: "Circle the bigger fraction (convert first if needed):\n1/2 or 1/3\n2/3 or 3/4\n1/4 or 1/5\n2/5 or 1/2\n3/4 or 5/8\n1/3 or 2/6\n3/5 or 1/2\n2/3 or 5/9\n1/2 or 4/9\n3/8 or 1/2",
      teachingTip: "If converting feels like too many steps at once, let the child estimate using a number line first, then check with the exact method.",
      successCheck: "6 of 10 correct.",
    },
    {
      title: "Adding Fractions with the Same Denominator",
      focusSkill: "Adding like fractions",
      learningObjective: `By the end of the session, ${name} will correctly add two fractions with the same denominator in 7 of 10 examples.`,
      tutorActivity: 'Show that adding fractions with the same denominator just means adding the numerators and keeping the denominator - "the pieces are already the same size, so just count how many you have total." Use a shaded-shape example first.',
      childPractice: "Solve:\n1/4 + 2/4 = __\n2/6 + 3/6 = __\n1/3 + 1/3 = __\n2/5 + 2/5 = __\n3/8 + 4/8 = __\n1/2 + 1/2 = __\n2/9 + 5/9 = __\n1/6 + 4/6 = __\n3/10 + 4/10 = __\n1/5 + 2/5 = __",
      teachingTip: "Watch for the common mistake of also adding the denominators - a quick reminder ('the pieces don't change size') usually fixes it.",
      successCheck: "7 of 10 correct.",
    },
    {
      title: "Week 1 Checkpoint",
      focusSkill: "Mixed fractions review",
      learningObjective: `By the end of the session, ${name} and the tutor will identify which fraction skills (identifying, comparing, equivalence, adding) are still shaky, based on a mixed review.`,
      tutorActivity: "Give a short mixed review covering everything practiced this week. Note which items are answered confidently and which are still difficult - these become the focus for the rest of the plan.",
      childPractice: "Mixed review (8 items): 2 identification, 2 comparison, 2 equivalence, 2 addition, drawn from this week's practice sets.",
      teachingTip: "Note the specific items that were wrong or slow, without correcting them yet - that list is this week's target list.",
      successCheck: "6 of 8 correct, with specific misses noted for extra practice.",
    },
    {
      title: alsoDecimals ? "Fractions as Decimals" : "Fractions in Real Life",
      focusSkill: alsoDecimals ? "Fraction-decimal conversion" : "Real-world fractions",
      learningObjective: alsoDecimals
        ? `By the end of the session, ${name} will correctly convert 4 of 5 simple fractions (halves, quarters, tenths) to their decimal form.`
        : `By the end of the session, ${name} will correctly solve 4 of 5 real-world problems involving fractions (measuring, sharing, cooking).`,
      tutorActivity: alsoDecimals
        ? "Show the connection between a fraction and a decimal using a place-value chart (1/10 = 0.1, 1/4 = 0.25 via 25/100). Start with tenths, since they map most directly."
        : "Present real situations - sharing a pizza among friends, measuring 3/4 cup of an ingredient, cutting a ribbon into fractional lengths - and ask the child to represent each with a fraction before solving.",
      childPractice: alsoDecimals
        ? "Convert to a decimal:\n1/2 = __\n1/4 = __\n3/4 = __\n1/10 = __\n7/10 = __"
        : "Solve:\nA pizza is cut into 8 slices. 3 friends each eat 2 slices. What fraction of the pizza is left?\nA recipe needs 3/4 cup of sugar. If you double the recipe, how much sugar do you need?\nA ribbon is cut into thirds. How much is 2 of the 3 pieces?",
      teachingTip: "Real objects (measuring cups, a paper pizza) make this session concrete instead of purely numerical.",
      successCheck: "4 of 5 correct.",
    },
    {
      title: "Subtracting Fractions with the Same Denominator",
      focusSkill: "Subtracting like fractions",
      learningObjective: `By the end of the session, ${name} will correctly subtract two fractions with the same denominator in 7 of 10 examples.`,
      tutorActivity: "Model subtraction the same way as addition - same denominator, subtract the numerators - using a shaded-then-crossed-out shape for the first example.",
      childPractice: "Solve:\n3/4 - 1/4 = __\n5/6 - 2/6 = __\n7/8 - 3/8 = __\n4/5 - 1/5 = __\n8/9 - 5/9 = __\n2/3 - 1/3 = __\n9/10 - 4/10 = __\n3/6 - 1/6 = __\n6/8 - 2/8 = __\n4/4 - 1/4 = __",
      teachingTip: "If the child mixes up add and subtract steps, have them say the operation out loud before solving each one.",
      successCheck: "7 of 10 correct.",
    },
    {
      title: "Fraction Word Problems",
      focusSkill: "Fraction word problems",
      learningObjective: `By the end of the session, ${name} will correctly solve 4 of 5 fraction word problems, choosing the right operation.`,
      tutorActivity: 'Read each problem together and ask "are we combining amounts, or finding what\'s left?" before choosing addition or subtraction - separating the reading step from the calculating step.',
      childPractice:
        "Solve:\nMia ate 1/4 of a cake and her brother ate 2/4. How much cake did they eat together?\nA board is 7/8 meters long. If 3/8 meters is cut off, how much is left?\nOmar walked 2/5 of the way to school, then 1/5 more. How much has he walked in total?\nA jug is 3/4 full. After pouring out 1/4, how full is it?",
      teachingTip: 'Underline the key phrase that signals the operation ("together" = add, "left" = subtract) before calculating.',
      successCheck: "4 of 5 correct.",
    },
    {
      title: "Mixed Numbers",
      focusSkill: "Mixed numbers",
      learningObjective: `By the end of the session, ${name} will correctly convert between a mixed number and an improper fraction in 6 of 8 examples.`,
      tutorActivity: 'Show a mixed number (e.g. 1 3/4) as whole shapes plus a partial shape, then as one single fraction (7/4) counting all the equal parts together. Work through the "multiply whole by denominator, add numerator" shortcut only after the visual makes sense.',
      childPractice: "Convert to an improper fraction:\n1 1/2 = __\n2 1/3 = __\n1 3/4 = __\n3 1/5 = __\nConvert to a mixed number:\n7/4 = __\n11/3 = __\n9/2 = __\n13/5 = __",
      teachingTip: "Keep at least one visual (shapes) example on the page even once using the numeric shortcut - it's a good self-check.",
      successCheck: "6 of 8 correct.",
    },
    {
      title: "Independent Fraction Practice",
      focusSkill: "Independent mixed practice",
      learningObjective: `By the end of the session, ${name} will independently solve 7 of 10 mixed fraction problems with minimal tutor support.`,
      tutorActivity: "Hand over a mixed problem set (comparing, adding, subtracting, word problems) and step back - help only if asked, or after an attempted, incorrect answer. Review mistakes together afterward.",
      childPractice: "Independent mixed set (10 items) drawn from comparing, adding, subtracting, and word problems practiced so far.",
      teachingTip: "Resist jumping in immediately - a wrong first attempt the child then corrects builds more independence than tutor-led problem solving.",
      successCheck: "7 of 10 correct with minimal support.",
    },
    {
      title: "Mixed Fractions Challenge",
      focusSkill: "Mixed challenge",
      learningObjective: `By the end of the session, ${name} will correctly solve 7 of 10 mixed fraction problems, including at least one multi-step word problem.`,
      tutorActivity: "Give a slightly harder mixed set including one two-step word problem (e.g. combining a fraction addition with a comparison). Discuss the approach before solving, not just the answer after.",
      childPractice: "Mixed challenge (10 items) plus: A recipe uses 1/2 cup flour and 1/4 cup sugar. Is there more flour or sugar, and by how much?",
      teachingTip: "Celebrate accuracy first, speed second - a confident, correct answer matters more than a fast guess.",
      successCheck: "7 of 10 correct.",
    },
    {
      title: "Final Check & Progress Comparison",
      focusSkill: "Final assessment",
      learningObjective: `By the end of the session, ${name} will complete a short mixed fractions assessment and the tutor will compare the result with the original baseline (${baseline}).`,
      tutorActivity: "Give a short, low-pressure mixed assessment covering identifying, comparing, equivalence, and operations on fractions. Compare the result to the starting assessment and note which specific skills have improved.",
      childPractice: "Final check:\n2/3 or 1/2, which is bigger?\n1/4 = __/8\n2/5 + 1/5 = __\n5/6 - 2/6 = __\nA pie is cut into 6 slices; 2 are eaten. What fraction is left?",
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
