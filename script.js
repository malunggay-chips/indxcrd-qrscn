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

document.addEventListener("DOMContentLoaded", () => {
  // ✅ Get elements safely once DOM is ready
  const idField = document.getElementById("studentId");
  const lnameField = document.getElementById("lastName");
  const fnameField = document.getElementById("firstName");
  const subjectSelect = document.getElementById("subjectCode");
  const sectionSelect = document.getElementById("section");
  const generateBtn = document.getElementById("generateBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const qrContainer = document.getElementById("qrcode");

  if (!idField || !lnameField || !fnameField || !subjectSelect || !sectionSelect) {
    console.error("❌ Required form fields are missing from HTML.");
    return;
  }

  // ✅ Populate dropdowns
  SUBJECTS.forEach(sub => {
    const opt = document.createElement("option");
    opt.value = sub;
    opt.textContent = sub;
    subjectSelect.appendChild(opt);
  });

  SECTIONS.forEach(sec => {
    const opt = document.createElement("option");
    opt.value = sec;
    opt.textContent = sec;
    sectionSelect.appendChild(opt);
  });

  // ✅ Generate QR Code
  generateBtn.addEventListener("click", () => {
    const id = idField.value.trim();
    const lname = lnameField.value.trim();
    const fname = fnameField.value.trim();
    const subject = subjectSelect.value;
    const section = sectionSelect.value;

    // Only these are required
    if (!id || !lname || !fname || !subject || !section) {
      alert("Please fill out Student ID, Last Name, First Name, Subject Code, and Section.");
      return;
    }

    // Optional scores + attendance
    const scores = Array.from(document.querySelectorAll(".score")).map(inp => inp.value);
    const attendance = Array.from(document.querySelectorAll(".att")).map(cb => (cb.checked ? "✔" : "✖"));

    const info = `
Student ID: ${id}
Name: ${lname}, ${fname}
Subject: ${subject}
Section: ${section}
Quizzes: ${scores.slice(0, 5).join(", ")}
Recitations: ${scores.slice(5, 10).join(", ")}
Projects: ${scores.slice(10, 15).join(", ")}
Attendance: ${attendance.join(", ")}
    `.trim();

    // ✅ Clear and show QR visibly
    qrContainer.innerHTML = "";
    qrContainer.style.display = "flex";
    qrContainer.style.justifyContent = "center";
    qrContainer.style.alignItems = "center";
    qrContainer.style.padding = "20px";
    qrContainer.style.background = "#ffffff";
    qrContainer.style.border = "3px solid #000";
    qrContainer.style.borderRadius = "8px";
    qrContainer.style.minHeight = "260px";
    qrContainer.style.visibility = "visible";
    qrContainer.style.opacity = "1";

    const qrCode = new QRCode(qrContainer, {
      text: info,
      width: 220,
      height: 220,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });

    // Wait a bit to ensure image renders before enabling download
    setTimeout(() => (downloadBtn.disabled = false), 500);
  });

  // ✅ Download QR Code as image
  downloadBtn.addEventListener("click", () => {
    const qrImg = qrContainer.querySelector("img") || qrContainer.querySelector("canvas");
    if (!qrImg) {
      alert("Please generate a QR code first.");
      return;
    }

    const link = document.createElement("a");
    link.download = "qr_code.png";
    link.href = qrImg.src || qrImg.toDataURL("image/png");
    link.click();
  });
});
