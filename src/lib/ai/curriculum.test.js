import { describe, it, expect } from "vitest";
import { generateLearningReport } from "./index.js";
import { generate as generateMock } from "./providers/mockProvider.js";
import { validateReport } from "./validate.js";
import { resolveCurriculum } from "./curriculum/index.js";

// Deterministic fixtures. The mock provider has no randomness (the only
// timing element - an artificial UX delay - is skipped in test mode, see
// providers/mockProvider.js), so the same input always produces the same
// output; these tests assert on that output directly rather than snapshots,
// so a real content regression fails loudly and specifically.

const EMMA = {
  child: { name: "Emma", age: 8, grade: "3", subject: "Mathematics" },
  assessment: {
    strengths: "Addition and subtraction are strong.",
    weaknesses: "Multiplication tables, especially 6-9, and multiplication word problems.",
    topicsAssessed: "Addition, Subtraction, Multiplication, Word problems",
    results: "Addition 9/10, Subtraction 9/10, Multiplication 6/10, Word problems 5/10",
    observations: "Benefits from visual examples and short exercises.",
    additionalNotes: "",
  },
};

const LIAM = {
  child: { name: "Liam", age: 10, grade: "5", subject: "English" },
  assessment: {
    strengths: "Liam has a strong vocabulary and enjoys reading on his own.",
    weaknesses: "Reading comprehension, especially making inferences and identifying the main idea of longer passages.",
    topicsAssessed: "Main idea, Inference, Vocabulary, Fluency",
    results: "Fluency 9/10, Vocabulary 8/10, Main idea 5/10, Inference 4/10",
    observations: "Reads fluently but struggles to explain what a passage was really about.",
    additionalNotes: "",
  },
};

const NOOR = {
  child: { name: "Noor", age: 11, grade: "6", subject: "Mathematics" },
  assessment: {
    strengths: "Confident with whole number operations.",
    weaknesses: "Fractions and decimals, especially converting between the two.",
    topicsAssessed: "Fractions, Decimals, Percentages",
    results: "Fractions 4/10, Decimals 5/10, Percentages 7/10",
    observations: "Mixes up numerator and denominator when converting.",
    additionalNotes: "",
  },
};

const AVA = {
  child: { name: "Ava", age: 9, grade: "4", subject: "English" },
  assessment: {
    strengths: "Reads at grade level and enjoys writing short stories.",
    weaknesses: "Vocabulary, especially using context clues to figure out unfamiliar words.",
    topicsAssessed: "Vocabulary, Spelling, Grammar",
    results: "Vocabulary 4/10, Spelling 7/10, Grammar 8/10",
    observations: "Skips over unfamiliar words instead of guessing their meaning.",
    additionalNotes: "",
  },
};

const SAM = {
  child: { name: "Sam", age: 10, grade: "5", subject: "Science" },
  assessment: {
    strengths: "Curious and asks good questions during lessons.",
    weaknesses: "Understanding the scientific method, especially forming hypotheses and reading experiment results.",
    topicsAssessed: "Scientific method, Data tables, Graphs",
    results: "Scientific method 4/10, Data tables 5/10, Graphs 6/10",
    observations: "Can run an experiment but struggles to explain why it was set up that way.",
    additionalNotes: "",
  },
};

function expectValid(report) {
  const { valid, problems } = validateReport(report);
  expect(problems).toEqual([]);
  expect(valid).toBe(true);
}

function expectDayHasSubstance(day) {
  // Titles are allowed to be short and specific ("Synonyms", "x8 and x9") -
  // the real vagueness test is the instructions/practice fields, which
  // should always be a real sentence, and never the exact placeholder
  // phrases the brief calls out by name.
  for (const field of ["learningObjective", "tutorActivity", "childPractice", "teachingTip", "successCheck"]) {
    expect(day[field].length).toBeGreaterThanOrEqual(10);
  }
  const forbidden = /^practice (the|multiplication)\.?$|^review the topic\.?$|^complete some exercises\.?$/i;
  expect(day.tutorActivity).not.toMatch(forbidden);
  expect(day.childPractice).not.toMatch(forbidden);
}

describe("case 1: Grade 3 mathematics / multiplication (Emma)", () => {
  it("routes to the Mathematics / Multiplication tables curriculum and produces a valid, specific plan", async () => {
    const report = await generateMock(EMMA);
    expectValid(report);
    expect(resolveCurriculum(EMMA)).toEqual({ subject: "Mathematics", topic: "Multiplication tables" });
    expect(report.planDays).toHaveLength(14);
    report.planDays.forEach(expectDayHasSubstance);

    expect(report.planDays[0].title).toBe("Multiplication as Equal Groups");
    expect(report.planDays[0].childPractice).toMatch(/\d+ groups of \d+/);
    // The baseline in Day 14 must come from Multiplication's own score
    // (6/10), not another subskill's score (Addition's 9/10) - a real bug
    // found and fixed while building this engine.
    expect(report.planDays[13].learningObjective).toContain("6 of 10");
    expect(report.learningGaps.join(" ")).not.toMatch(/practice with addition\.|practice with subtraction\./i);
  });
});

describe("case 2: Reading comprehension (Liam)", () => {
  it("routes to the Reading / Reading comprehension curriculum and produces a valid, specific plan", async () => {
    const report = await generateMock(LIAM);
    expectValid(report);
    expect(resolveCurriculum(LIAM)).toEqual({ subject: "Reading", topic: "Reading comprehension" });
    report.planDays.forEach(expectDayHasSubstance);

    expect(report.planDays[0].title).toBe("Finding the Main Idea");
    // Baseline must be Main idea's score (5/10), matched by keyword overlap
    // with the weaknesses text, not whichever score happens to appear first
    // in the results string (here, Fluency's 9/10).
    expect(report.planDays[13].learningObjective).toContain("5 of 10");
    expect(report.learningGaps.join(" ")).not.toMatch(/practice with vocabulary\.|practice with fluency\./i);
  });
});

describe("case 3: Fractions (Noor)", () => {
  it("routes to the Mathematics / Fractions curriculum, adapts Day 8 for the paired decimals weakness, and stays valid", async () => {
    const report = await generateMock(NOOR);
    expectValid(report);
    expect(resolveCurriculum(NOOR)).toEqual({ subject: "Mathematics", topic: "Fractions" });
    report.planDays.forEach(expectDayHasSubstance);

    expect(report.planDays[0].title).toBe("What Is a Fraction?");
    expect(report.planDays[7].title).toBe("Fractions as Decimals");
    expect(report.planDays[13].learningObjective).toContain("4 of 10");
  });
});

describe("case 4: English vocabulary (Ava)", () => {
  it("routes to the English Language / Vocabulary curriculum and produces a valid, specific plan", async () => {
    const report = await generateMock(AVA);
    expectValid(report);
    expect(resolveCurriculum(AVA)).toEqual({ subject: "English Language", topic: "Vocabulary" });
    report.planDays.forEach(expectDayHasSubstance);

    expect(report.planDays[0].title).toBe("Context Clues Basics");
    expect(report.planDays[13].learningObjective).toContain("4 of 10");
  });
});

describe("case 5: Science (Sam)", () => {
  it("routes to the Science / Scientific method curriculum and produces a valid, specific plan", async () => {
    const report = await generateMock(SAM);
    expectValid(report);
    expect(resolveCurriculum(SAM)).toEqual({ subject: "Science", topic: "Scientific method and inquiry skills" });
    report.planDays.forEach(expectDayHasSubstance);

    expect(report.planDays[0].title).toBe("Questions Science Can Test");
    expect(report.planDays[13].learningObjective).toContain("4 of 10");
  });
});

describe("case 6: two children with different weaknesses produce different plans", () => {
  it("Emma (multiplication) and Sam (science) get different subjects, topics, and day-by-day content", async () => {
    const emma = await generateMock(EMMA);
    const sam = await generateMock(SAM);

    expect(resolveCurriculum(EMMA).subject).not.toBe(resolveCurriculum(SAM).subject);
    expect(emma.planDays[0].title).not.toBe(sam.planDays[0].title);
    expect(JSON.stringify(emma.planDays)).not.toBe(JSON.stringify(sam.planDays));
    expect(emma.priorityGoal).not.toBe(sam.priorityGoal);
  });

  it("two different math weaknesses (multiplication vs. fractions) still produce distinct plans", async () => {
    const emma = await generateMock(EMMA);
    const noor = await generateMock(NOOR);
    expect(resolveCurriculum(EMMA).topic).not.toBe(resolveCurriculum(NOOR).topic);
    expect(JSON.stringify(emma.planDays)).not.toBe(JSON.stringify(noor.planDays));
  });
});

describe("Priority Learning Gaps are populated, scored, and ranked from real assessment data", () => {
  it("Emma, Liam, and Noor each get a non-empty, distinct, correctly-scored gap list", async () => {
    const emma = await generateMock(EMMA);
    const liam = await generateMock(LIAM);
    const noor = await generateMock(NOOR);

    for (const report of [emma, liam, noor]) {
      expect(report.learningGaps.length).toBeGreaterThan(0);
      report.learningGaps.forEach((gap) => expect(gap.length).toBeGreaterThan(10));
    }

    // Never hardcoded to Emma's values - each child's gaps name their own
    // specific weak skills, not just the subject, with their own scores.
    expect(emma.learningGaps.join(" ")).toMatch(/multiplication.*6 out of 10|word problems.*5 out of 10/i);
    expect(liam.learningGaps.join(" ")).toMatch(/main idea.*5 out of 10/i);
    expect(noor.learningGaps.join(" ")).toMatch(/fractions.*4 out of 10/i);

    expect(emma.learningGaps).not.toEqual(liam.learningGaps);
    expect(liam.learningGaps).not.toEqual(noor.learningGaps);
    expect(emma.learningGaps).not.toEqual(noor.learningGaps);
  });

  it("ranks Emma's gaps worst-score-first: Word problems (5/10) before Multiplication (6/10)", async () => {
    const emma = await generateMock(EMMA);
    const wordProblemsIndex = emma.learningGaps.findIndex((g) => /word problems/i.test(g));
    const multiplicationIndex = emma.learningGaps.findIndex((g) => /multiplication/i.test(g));
    expect(wordProblemsIndex).toBeGreaterThanOrEqual(0);
    expect(multiplicationIndex).toBeGreaterThanOrEqual(0);
    expect(wordProblemsIndex).toBeLessThan(multiplicationIndex);
  });

  it("ranks Noor's gaps worst-score-first: Fractions (4/10), Decimals (5/10), Percentages (7/10)", async () => {
    const noor = await generateMock(NOOR);
    const fractionsIndex = noor.learningGaps.findIndex((g) => /fractions/i.test(g));
    const decimalsIndex = noor.learningGaps.findIndex((g) => /decimals/i.test(g));
    const percentagesIndex = noor.learningGaps.findIndex((g) => /percentages/i.test(g));
    expect(fractionsIndex).toBeGreaterThanOrEqual(0);
    expect(decimalsIndex).toBeGreaterThanOrEqual(0);
    expect(percentagesIndex).toBeGreaterThanOrEqual(0);
    expect(fractionsIndex).toBeLessThan(decimalsIndex);
    expect(decimalsIndex).toBeLessThan(percentagesIndex);
  });

  it("does not produce a vague duplicate gap when a weakness sentence just restates already-scored topics", async () => {
    // Emma's weaknesses sentence ("Multiplication tables, ... and
    // multiplication word problems") names the same two skills that
    // topicsAssessed + results already score individually - it should not
    // also appear as its own separate, unscored, redundant gap line.
    const emma = await generateMock(EMMA);
    expect(emma.learningGaps).toHaveLength(2);
  });
});

describe("case 7: age-appropriate differences", () => {
  it("a younger child gets shorter session times than an older child for the same weakness", async () => {
    const young = { child: { ...EMMA.child, age: 7 }, assessment: EMMA.assessment };
    const older = { child: { ...EMMA.child, age: 12 }, assessment: EMMA.assessment };

    const [youngReport, olderReport] = await Promise.all([generateMock(young), generateMock(older)]);
    expectValid(youngReport);
    expectValid(olderReport);

    // Day 1 (foundation, non-review) - shared.js's estimatedTimeFor gives
    // ages <=8 a shorter session than ages >=9.
    expect(youngReport.planDays[0].estimatedTime).toBe("15 minutes");
    expect(olderReport.planDays[0].estimatedTime).toBe("20 minutes");
  });
});

describe("the public provider interface (generateLearningReport)", () => {
  it("returns a validated report through the same boundary a future real provider would use", async () => {
    const { data, providerId, error } = await generateLearningReport(EMMA);
    expect(error).toBeNull();
    expect(providerId).toBe("mock");
    expectValid(data);
  });

  it("every hand-authored curriculum plus the generic fallback passes validation end to end", async () => {
    const genericCase = {
      child: { name: "Theo", age: 9, grade: "4", subject: "Music" },
      assessment: {
        strengths: "Keeps a steady beat and enjoys performing.",
        weaknesses: "Reading sheet music, especially note names on the staff.",
        topicsAssessed: "Note reading, Rhythm, Dynamics",
        results: "Note reading 4/10, Rhythm 7/10, Dynamics 8/10",
        observations: "",
        additionalNotes: "",
      },
    };
    for (const testCase of [EMMA, LIAM, NOOR, AVA, SAM, genericCase]) {
      const { data, error } = await generateLearningReport(testCase);
      expect(error).toBeNull();
      expectValid(data);
    }
  });
});
