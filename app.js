const analyzeBtn = document.getElementById("analyzeBtn");
const creatorInput = document.getElementById("creatorInput");
const result = document.getElementById("result");

const inputSummary = document.getElementById("inputSummary");
const detectedType = document.getElementById("detectedType");
const cleanedInput = document.getElementById("cleanedInput");

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

function cleanYoutubeInput(input) {
  function extractYouTubeDetails(parsed) {
  const value = parsed.cleaned;
  const type = parsed.type;

  let details = {
    type,
    handle: null,
    videoId: null,
    channelId: null
  };

  if (type === "Handle") {
    details.handle = value.replace("@", "");
  }

  if (type === "Video URL") {
    const match = value.match(/v=([^&]+)/) || value.match(/youtu\.be\/([^?]+)/);
    if (match) {
      details.videoId = match[1];
    }
  }

  if (type === "Channel URL") {
    const parts = value.split("channel/");
    if (parts[1]) {
      details.channelId = parts[1];
    }
  }

  return details;
}
  const raw = input.trim();

  if (!raw) {
    return {
      original: raw,
      cleaned: "",
      type: "Empty"
    };
  }

  let cleaned = raw;

  // Remove URL query strings and fragments
  cleaned = cleaned.split("?")[0].split("#")[0].trim();

  const lower = cleaned.toLowerCase();

  // Detect video URL
  if (
    lower.includes("youtube.com/watch") ||
    lower.includes("youtu.be/")
  ) {
    return {
      original: raw,
      cleaned,
      type: "Video URL"
    };
  }

  // Detect handle
  if (lower.includes("youtube.com/@")) {
    const handlePart = cleaned.split("@")[1] || "";
    return {
      original: raw,
      cleaned: handlePart ? "@" + handlePart.replace(/\/+$/, "") : cleaned,
      type: "Handle"
    };
  }

  // Detect channel URL
  if (lower.includes("youtube.com/channel/")) {
    return {
      original: raw,
      cleaned: cleaned.replace(/\/+$/, ""),
      type: "Channel URL"
    };
  }

  // Detect custom/c URL
  if (
    lower.includes("youtube.com/c/") ||
    lower.includes("youtube.com/user/")
  ) {
    return {
      original: raw,
      cleaned: cleaned.replace(/\/+$/, ""),
      type: "Legacy Channel URL"
    };
  }

  // Detect plain @handle input
  if (raw.startsWith("@")) {
    return {
      original: raw,
      cleaned: raw,
      type: "Handle"
    };
  }

  // Detect likely URL
  if (raw.includes("http://") || raw.includes("https://") || raw.includes("www.")) {
    return {
      original: raw,
      cleaned,
      type: "General URL"
    };
  }

  // Fallback
  return {
    original: raw,
    cleaned: raw,
    type: "Creator Name"
  };
}

function getMockAnalysis(input, inputType) {
  const hash = simpleHash((input + "|" + inputType).trim().toLowerCase());

  const consistency = 45 + (hash % 41);
  const hypeRisk = 20 + ((hash >> 2) % 61);
  const studyWorthiness = Math.max(
    20,
    Math.min(95, Math.round((consistency * 0.6) + ((100 - hypeRisk) * 0.4)))
  );

  const finalScore = Math.max(
    1,
    Math.min(
      100,
      Math.round(
        (consistency * 0.45) +
        ((100 - hypeRisk) * 0.25) +
        (studyWorthiness * 0.30)
      )
    )
  );

  let verdict = "Mixed";
  let reason = "Some good signals, but there are enough red flags to be careful.";
  let notes = [
    `Input type detected as ${inputType}.`,
    "Scoring is still using a mock engine for now.",
    "Next step is replacing this with real YouTube data."
  ];

  if (finalScore >= 75) {
    verdict = "Worth Studying";
    reason = "This creator shows stronger visible signals than most.";
    notes = [
      `Input type detected as ${inputType}.`,
      "Content appears more consistent over time.",
      "Lower hype pressure than average.",
      "More likely to be teaching a repeatable model."
    ];
  } else if (finalScore >= 55) {
    verdict = "Proceed Carefully";
    reason = "There may be value here, but do not blindly trust income claims.";
    notes = [
      `Input type detected as ${inputType}.`,
      "Some consistency is present, but not enough to fully trust.",
      "Possible mix of real strategy and attention-grabbing hype.",
      "Good candidate for manual review before following."
    ];
  } else {
    verdict = "Hype Risk";
    reason = "This looks more like marketing energy than solid, repeatable signal.";
    notes = [
      `Input type detected as ${inputType}.`,
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

  const parsed = cleanYoutubeInput(input);
  const ytDetails = extractYouTubeDetails(parsed);
const analysis = getMockAnalysis(parsed.cleaned, parsed.type);

  detectedType.textContent = parsed.type;
  cleanedInput.textContent = parsed.cleaned || "None";

let extra = "";

if (ytDetails.handle) extra += ` | Handle: ${ytDetails.handle}`;
if (ytDetails.videoId) extra += ` | Video ID: ${ytDetails.videoId}`;
if (ytDetails.channelId) extra += ` | Channel ID: ${ytDetails.channelId}`;

cleanedInput.textContent += extra;
  inputSummary.classList.remove("hidden");

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
