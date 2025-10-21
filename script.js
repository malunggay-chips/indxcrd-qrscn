// ======= Configurable dropdown values =======
const SUBJECTS = [
  "OLCC03_Python",
  "OLWS1_HTML",
  "OLCPPROG2_JAVA",
  "OLSOFAPP_Office Applicatikon Software",
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

function populateSelect(id, items) {
  const sel = document.getElementById(id);
  sel.innerHTML = '<option value="">Select ' + (id === 'subjectCode' ? 'Subject Code' : 'Section') + '</option>';
  items.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item;
    opt.textContent = item;
    sel.appendChild(opt);
  });
}
populateSelect('subjectCode', SUBJECTS);
populateSelect('section', SECTIONS);

// Collect grid values
function getGridValues() {
  const scoreInputs = Array.from(document.querySelectorAll('.score-grid input.score'));
  const attendanceInputs = Array.from(document.querySelectorAll('.score-grid input.att'));

  // Allow blank; show "-" if empty
  return {
    quiz: scoreInputs.slice(0,5).map(i => i.value.trim() || '-'),
    recitation: scoreInputs.slice(5,10).map(i => i.value.trim() || '-'),
    project: scoreInputs.slice(10,15).map(i => i.value.trim() || '-'),
    attendance: attendanceInputs.map(i => (i.checked ? '✓' : '✗'))
  };
}

// QR Generation
document.getElementById('generateBtn').addEventListener('click', () => {
  const id = document.getElementById('studentId').value.trim();
  const surname = document.getElementById('surname').value.trim();
  const firstname = document.getElementById('firstname').value.trim();
  const subject = document.getElementById('subjectCode').value;
  const section = document.getElementById('section').value;

  // ✅ Only required fields
  if (!id || !surname || !firstname || !subject || !section) {
    alert("Please fill in Student ID, Last Name, First Name, Subject Code, and Section.");
    return;
  }

  const grid = getGridValues();

  const info = `
Student ID: ${id}
Surname: ${surname}
Firstname: ${firstname}
Subject: ${subject}
Section: ${section}

Scores (optional):
Quiz: ${grid.quiz.join(' | ')}
Recitation: ${grid.recitation.join(' | ')}
Project: ${grid.project.join(' | ')}
Attendance: ${grid.attendance.join(' | ')}
`;

  const qrContainer = document.getElementById('qrcode');
  
  // ✅ Properly clear the previous QR Code DOM
  while (qrContainer.firstChild) {
    qrContainer.removeChild(qrContainer.firstChild);
  }

  const size = Math.min(280, Math.max(180, Math.floor(window.innerWidth * 0.45)));

  // ✅ Center QR code generation
  new QRCode(qrContainer, {
    text: info.trim(),
    width: size,
    height: size,
    colorDark: "#000000",   // Black squares
    colorLight: "#ffffff",  // White background
    correctLevel: QRCode.CorrectLevel.H
  });

  // ✅ Ensure visibility
  qrContainer.style.background = "#fff";

  // Smooth scroll into view on mobile
  qrContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// Download button
document.getElementById('downloadBtn').addEventListener('click', () => {
  const qrContainer = document.getElementById('qrcode');
  const canvas = qrContainer.querySelector('canvas');
  const img = qrContainer.querySelector('img');

  if (!canvas && !img) {
    alert("Generate a QR code first.");
    return;
  }

  // ✅ If canvas exists, convert it to PNG
  let url;
  if (canvas) {
    url = canvas.toDataURL("image/png");
  } else if (img && img.src) {
    url = img.src;
  }

  const a = document.createElement('a');
  a.href = url;
  a.download = "student-qr.png";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});
