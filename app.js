const analyzeBtn = document.getElementById("analyzeBtn");
const creatorInput = document.getElementById("creatorInput");
const result = document.getElementById("result");

const scoreValue = document.getElementById("scoreValue");
const verdictText = document.getElementById("verdictText");
const verdictReason = document.getElementById("verdictReason");
const consistencyValue = document.getElementById("consistencyValue");
const hypeValue = document.getElementById("hypeValue");
const studyValue = document.getElementById("studyValue");
const notesList = document.getElementById("notesList");

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getMockAnalysis(input) {
  const hash = simpleHash(input.trim().toLowerCase());

  const consistency = 45 + (hash % 41); // 45-85
  const hypeRisk = 20 + ((hash >> 2) % 61); // 20-80
  const studyWorthiness = Math.max(
    20,
    Math.min(95, Math.round((consistency * 0.6) + ((100 - hypeRisk) * 0.4)))
  );

  const finalScore = Math.max(
    1,
    Math.min(
      100,
      Math.round((consistency * 0.45) + ((100 - hypeRisk) * 0.25) + (studyWorthiness * 0.30))
    )
  );

  let verdict = "Mixed";
  let reason = "Some good signals, but there are enough red flags to be careful.";
  let notes = [];

  if (finalScore >= 75) {
    verdict = "Worth Studying";
    reason = "This creator shows stronger visible signals than most.";
    notes = [
      "Content appears more consistent over time.",
      "Lower hype pressure than average.",
      "More likely to be teaching a repeatable model."
    ];
  } else if (finalScore >= 55) {
    verdict = "Proceed Carefully";
    reason = "There may be value here, but do not blindly trust income claims.";
    notes = [
      "Some consistency is present, but not enough to fully trust.",
      "Possible mix of real strategy and attention-grabbing hype.",
      "Good candidate for manual review before following."
    ];
  } else {
    verdict = "Hype Risk";
    reason = "This looks more like marketing energy than solid, repeatable signal.";
    notes = [
      "Higher chance of inflated claims or weak evidence.",
      "Would not treat this creator as a primary teacher.",
      "Use only for ideas, not truth."
    ];
  }

  return {
    finalScore,
    consistency,
    hypeRisk,
    studyWorthiness,
    verdict,
    reason,
    notes
  };
}

analyzeBtn.addEventListener("click", () => {
  const input = creatorInput.value.trim();

  if (!input) {
    alert("Paste a creator name, channel, handle, or link first.");
    return;
  }

  const analysis = getMockAnalysis(input);

  scoreValue.textContent = analysis.finalScore;
  verdictText.textContent = analysis.verdict;
  verdictReason.textContent = analysis.reason;
  consistencyValue.textContent = analysis.consistency;
  hypeValue.textContent = analysis.hypeRisk;
  studyValue.textContent = analysis.studyWorthiness;

  notesList.innerHTML = "";
  analysis.notes.forEach((note) => {
    const li = document.createElement("li");
    li.textContent = note;
    notesList.appendChild(li);
  });

  result.classList.remove("hidden");
});
