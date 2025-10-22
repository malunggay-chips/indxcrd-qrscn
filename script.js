// ======= Configurable dropdown values =======
const SUBJECTS = [
  "OLCC03_Python",
  "OLWS1_HTML",
  "OLCPPROG2_JAVA",
  "OLSOFAPP_Office Application Software",
  "OLSDF04_Java",
  "OLIM2_Database",
  "OLSP2_",
  "OLSIA1_Architecture",
  "OLSA01_Integrative",
  "OLIPT2_"
];

const SECTIONS = [
  "LFAU211N009",
  "LFAU211A004",
  "LFAU11M001",
  "LFAU11M010",
  "LFAU111M012",
  "LFAU111M009",
  "LFAU311N010",
  "LFAU411A075",
  "LFAU311E078"
];
// ============================================

const subjectEl = document.getElementById("subjectCode");
const sectionEl = document.getElementById("section");

function populateSelect(el, items, placeholder) {
  el.innerHTML = "";
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = placeholder;
  el.appendChild(defaultOption);

  items.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item;
    opt.textContent = item;
    el.appendChild(opt);
  });
}

populateSelect(subjectEl, SUBJECTS, "Select Subject Code");
populateSelect(sectionEl, SECTIONS, "Select Section");

function readGridValues() {
  const scores = Array.from(document.querySelectorAll(".score-grid input.score"));
  const quiz = scores.slice(0, 5).map(i => i.value.trim());
  const recitation = scores.slice(5, 10).map(i => i.value.trim());
  const project = scores.slice(10, 15).map(i => i.value.trim());
  const attendance = Array.from(document.querySelectorAll(".score-grid input.att")).map(a => a.checked);
  return { quiz, recitation, project, attendance };
}

function clampScore(val) {
  if (val === "" || isNaN(val)) return "-";
  const n = Math.min(20, Math.max(1, parseInt(val, 10)));
  return n;
}

document.getElementById("generateBtn").addEventListener("click", () => {
  const id = document.getElementById("studentId").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const firstName = document.getElementById("firstName").value.trim();
  const subject = document.getElementById("subjectCode").value;
  const section = document.getElementById("section").value;

  if (!id || !lastName || !firstName || !subject || !section) {
    alert("Please fill in all required fields before generating QR code.");
    return;
  }

  const grid = readGridValues();
  const quizText = grid.quiz.map(clampScore).join(" | ");
  const recitText = grid.recitation.map(clampScore).join(" | ");
  const projText = grid.project.map(clampScore).join(" | ");
  const attText = grid.attendance.map(a => (a ? "✓" : "✗")).join(" | ");

  const info = `
Student ID: ${id}
Last Name: ${lastName}
First Name: ${firstName}
Subject: ${subject}
Section: ${section}

Quiz: ${quizText}
Recitation: ${recitText}
Project: ${projText}
Attendance: ${attText}
  `;

  // Clear any previous QR
  qrContainer.innerHTML = "";
  qrContainer.style.display = "flex";
  qrContainer.style.justifyContent = "center";
  qrContainer.style.alignItems = "center";
  qrContainer.style.padding = "20px";
  qrContainer.style.background = "#ffffff";
  qrContainer.style.border = "3px solid #000";  // ✅ makes it visible
  qrContainer.style.borderRadius = "8px";       // smooth edges
  qrContainer.style.minHeight = "260px";        // ensures visible space

  // ✅ Generate new visible QR code
  new QRCode(qrContainer, {
    text: info.trim(),
    width: 220,
    height: 220,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });
});

document.getElementById("downloadBtn").addEventListener("click", () => {
  const qrContainer = document.getElementById("qrcode");
  const canvas = qrContainer.querySelector("canvas");
  const img = qrContainer.querySelector("img");
  if (!canvas && !img) {
    alert("Please generate a QR code first!");
    return;
  }

  const dataURL = canvas ? canvas.toDataURL("image/png") : img.src;
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "student-qr.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});
