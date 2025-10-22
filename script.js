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

  // Populate dropdowns
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

  // Generate QR
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

    // Optional scores + attendance
    const scores = Array.from(document.querySelectorAll(".score")).map(inp => inp.value || "-");
    const attendance = Array.from(document.querySelectorAll(".att")).map(cb => (cb.checked ? "✔" : "✖"));

    // ✅ Readable formatted text for QR
    const info = `
📘 INDEX QR CODE DATA
--------------------------
🆔 Student ID: ${id}
👤 Name: ${lname}, ${fname}
📚 Subject: ${subject}
🏫 Section: ${section}

🧮 Scores
Quiz: ${scores.slice(0, 5).join(", ")}
Recitation: ${scores.slice(5, 10).join(", ")}
Project: ${scores.slice(10, 15).join(", ")}

📅 Attendance: ${attendance.join(" ")}
--------------------------
(Generated via Index QR Code Generator)
    `.trim();

    // Clear old QR and make container visible
    qrContainer.innerHTML = "";
    qrContainer.style.display = "flex";
    qrContainer.style.justifyContent = "center";
    qrContainer.style.alignItems = "center";
    qrContainer.style.padding = "20px";
    qrContainer.style.background = "#fff";
    qrContainer.style.border = "3px solid #000";
    qrContainer.style.borderRadius = "8px";
    qrContainer.style.visibility = "visible";

    try {
      new QRCode(qrContainer, {
        text: info,
        width: 250,
        height: 250,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.L // less strict so longer readable text fits
      });
      setTimeout(() => (downloadBtn.disabled = false), 500);
    } catch (e) {
      console.error("QR Generation error:", e);
      alert("⚠️ QR Code data too long. Try shortening some fields.");
    }
  });

  // Download QR
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
