// ======= Configurable dropdown values =======
const SUBJECTS = [
  "OLCC03_Python",
  "OLWS1_HTML",
  "OLCPPROG2_Java",
  "OLSDF04_Java",
  "OLSIA1_Architecture",
  "OLSP2_WebDev"
];

const SECTIONS = [
  "LFAU311N010",
  "LFAU312N005",
  "LFAU313N007"
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

  return {
    quiz: scoreInputs.slice(0,5).map(i => i.value.trim() || '-'),
    recitation: scoreInputs.slice(5,10).map(i => i.value.trim() || '-'),
    project: scoreInputs.slice(10,15).map(i => i.value.trim() || '-'),
    attendance: attendanceInputs.map(i => (i.checked ? '✓' : '✗'))
  };
}

// QR Generation
let lastQRCode = null;
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
  qrContainer.innerHTML = "";
  const size = Math.min(280, Math.max(160, Math.floor(window.innerWidth * 0.45)));

  lastQRCode = new QRCode(qrContainer, {
    text: info.trim(),
    width: size,
    height: size,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });
});

// Download button
document.getElementById('downloadBtn').addEventListener('click', () => {
  const qrContainer = document.getElementById('qrcode');
  const img = qrContainer.querySelector('img') || qrContainer.querySelector('canvas');
  if (!img) {
    alert("Generate a QR code first.");
    return;
  }
  const url = img.src || img.toDataURL("image/png");
  const a = document.createElement('a');
  a.href = url;
  a.download = "student-qr.png";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});
