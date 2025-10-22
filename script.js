// ==========================
// QR Generator – Final Fixed Version
// ==========================

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

// Populate dropdowns dynamically
const subjectDropdown = document.getElementById('subject');
const sectionDropdown = document.getElementById('section');

SUBJECTS.forEach(sub => {
  const opt = document.createElement("option");
  opt.value = sub;
  opt.textContent = sub;
  subjectDropdown.appendChild(opt);
});

SECTIONS.forEach(sec => {
  const opt = document.createElement("option");
  opt.value = sec;
  opt.textContent = sec;
  sectionDropdown.appendChild(opt);
});

// Generate QR button logic
document.getElementById('generateBtn').addEventListener('click', () => {
  const id = document.getElementById('studentId').value.trim();
  const lname = document.getElementById('lastName').value.trim();
  const fname = document.getElementById('firstName').value.trim();
  const subj = document.getElementById('subject').value;
  const section = document.getElementById('section').value;

  // Optional fields
  const quiz = document.getElementById('quiz').value.trim();
  const recitation = document.getElementById('recitation').value.trim();
  const project = document.getElementById('project').value.trim();
  const attendance = document.getElementById('attendance').checked ? "Present" : "Absent";

  // ✅ Required field check
  if (!id || !lname || !fname || !subj || !section) {
    alert("Please fill in all required fields: Student ID, Last Name, First Name, Subject, and Section.");
    return;
  }

  // ✅ Limit score inputs between 1–20 points
  const clampScore = (val) => {
    const num = parseInt(val);
    if (isNaN(num)) return "N/A";
    return Math.max(1, Math.min(20, num));
  };

  const quizScore = quiz ? clampScore(quiz) : "N/A";
  const recitScore = recitation ? clampScore(recitation) : "N/A";
  const projScore = project ? clampScore(project) : "N/A";

  // Build info string for QR
  const info = `
Student ID: ${id}
Name: ${lname}, ${fname}
Subject: ${subj}
Section: ${section}
Quiz: ${quizScore}
Recitation: ${recitScore}
Project: ${projScore}
Attendance: ${attendance}
  `.trim();

  // === Generate QR ===
  const qrContainer = document.getElementById('qrcode');

  // Clear previous QR properly
  while (qrContainer.firstChild) qrContainer.removeChild(qrContainer.firstChild);

  // Force visible white background + centered layout
  qrContainer.style.background = "#ffffff";
  qrContainer.style.padding = "20px";
  qrContainer.style.border = "3px solid #000";
  qrContainer.style.display = "flex";
  qrContainer.style.justifyContent = "center";
  qrContainer.style.alignItems = "center";

  const size = 240;

  // ✅ Force QRCode.js to render visible black on white
  const qr = new QRCode(qrContainer, {
    text: info,
    width: size,
    height: size,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });

  // ✅ Fallback fix — ensure visibility (handles async rendering)
  setTimeout(() => {
    const img = qrContainer.querySelector("img");
    const canvas = qrContainer.querySelector("canvas");

    if (img) {
      img.style.display = "block";
      img.style.background = "#fff";
      img.style.border = "2px solid #000";
    }

    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.globalCompositeOperation = "destination-over";
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, 300);
});

// Download button logic
document.getElementById('downloadBtn').addEventListener('click', () => {
  const qrContainer = document.getElementById('qrcode');
  const canvas = qrContainer.querySelector('canvas');
  const img = qrContainer.querySelector('img');

  if (!canvas && !img) {
    alert("Please generate a QR code first!");
    return;
  }

  let url;
  if (canvas) {
    url = canvas.toDataURL("image/png");
  } else {
    url = img.src;
  }

  const a = document.createElement('a');
  a.href = url;
  a.download = "student-qr.png";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});
