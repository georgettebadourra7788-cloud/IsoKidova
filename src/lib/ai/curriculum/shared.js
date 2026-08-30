// Shared helpers for hand-authored and generic curricula: age-appropriate
// session length (spec: ages 6-8 get 5-15 minutes, ages 9-12 get 10-20
// minutes) and the difficulty progression used across every 14-day plan
// (foundation -> guided practice -> checkpoint -> application ->
// independent/challenge -> final review).

export function estimatedTimeFor(age, phase) {
  const light = phase === "checkpoint" || phase === "final";
  if (age != null && age <= 8) return light ? "10-15 minutes" : "15 minutes";
  if (age != null && age >= 9) return light ? "15-20 minutes" : "20 minutes";
  return light ? "10-15 minutes" : "15 minutes";
}

// Maps a day number (1-14) to both its phase name (used to pick tone/
// structure) and its difficulty label.
export function phaseFor(dayNumber) {
  if (dayNumber === 7) return { phase: "checkpoint", difficulty: "Review" };
  if (dayNumber === 14) return { phase: "final", difficulty: "Review" };
  if (dayNumber <= 3) return { phase: "foundation", difficulty: "Easy" };
  if (dayNumber <= 6) return { phase: "guided", difficulty: "Medium" };
  if (dayNumber <= 10) return { phase: "application", difficulty: "Medium" };
  return { phase: "independent", difficulty: "Challenging" };
}

export function firstName(child) {
  return (child?.name || "the child").split(" ")[0];
}
