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
  const idField = document.getElementById("studentId");
  const lnameField = document.getElementById("lastName");
  const fnameField = document.getElementById("firstName");
  const subjectSelect = document.getElementById("subjectCode");
  const sectionSelect = document.getElementById("section");
  const generateBtn = document.getElementById("generateBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const qrContainer = document.getElementById("qrcode");

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

  generateBtn.addEventListener("click", () => {
    const id = idField.value.trim();
    const lname = lnameField.value.trim();
    const fname = fnameField.value.trim();
    const subject = subjectSelect.value;
    const section = sectionSelect.value;

    if (!id || !lname || !fname || !subject || !section) {
      alert("Please fill out Student ID, Last Name, First Name, Subject Code, and Section.");
      return;
    }

    const scores = Array.from(document.querySelectorAll(".score")).map(inp => inp.value || "-");
    const attendance = Array.from(document.querySelectorAll(".att")).map(cb => (cb.checked ? "Present" : "Absent"));

    // ✅ Create readable format (decoded when scanned)
    const info = `
Student ID: ${id}
Name: ${lname}, ${fname}
Subject: ${subject}
Section: ${section}
Quizzes: ${scores.slice(0,5).join(", ")}
Recitations: ${scores.slice(5,10).join(", ")}
Projects: ${scores.slice(10,15).join(", ")}
Attendance: ${attendance.join(", ")}
`.trim();

    // ✅ Clear and re-render
    qrContainer.innerHTML = "";
    qrContainer.style.display = "flex";
    qrContainer.style.justifyContent = "center";
    qrContainer.style.alignItems = "center";
    qrContainer.style.background = "#fff";
    qrContainer.style.border = "3px solid #000";
    qrContainer.style.borderRadius = "8px";
    qrContainer.style.padding = "20px";

    try {
      new QRCode(qrContainer, {
        text: info,
        width: 260,
        height: 260,
        colorDark: "#000",
        colorLight: "#fff",
        correctLevel: QRCode.CorrectLevel.M
      });
      downloadBtn.disabled = false;
    } catch (err) {
      alert("⚠️ QR Code data too long — please shorten names slightly.");
      console.error(err);
    }
  });

  downloadBtn.addEventListener("click", () => {
    const qrImg = qrContainer.querySelector("img");
    const qrCanvas = qrContainer.querySelector("canvas");
    if (!qrImg && !qrCanvas) {
      alert("Please generate a QR code first.");
      return;
    }
    const link = document.createElement("a");
    link.download = "qr_code.png";
    link.href = qrImg ? qrImg.src : qrCanvas.toDataURL("image/png");
    link.click();
  });
});
