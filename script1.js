// ----- Configuration: add subject & section options here -----
// To add more subject codes or sections, edit the arrays below.
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
// ------------------------------------------------------------

/* Populate dropdowns */
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

/* Helpers to query grid cells */
function getGridValues() {
  // Scores are in order Quiz(5), Recitation(5), Project(5)
  const scoreInputs = Array.from(document.querySelectorAll('.score-grid input.score'));
  const attendanceInputs = Array.from(document.querySelectorAll('.score-grid input.att'));

  // Organize into rows: each row has 5 cells
  const rows = {
    quiz: scoreInputs.slice(0,5).map(i => i.value.trim()),
    recitation: scoreInputs.slice(5,10).map(i => i.value.trim()),
    project: scoreInputs.slice(10,15).map(i => i.value.trim()),
    attendance: attendanceInputs.map(i => i.checked)
  };

  return rows;
}

/* QR generation */
let lastQRCode = null;

document.getElementById('generateBtn').addEventListener('click', () => {
  const id = document.getElementById('studentId').value.trim();
  const surname = document.getElementById('surname').value.trim();
  const firstname = document.getElementById('firstname').value.trim();
  const subject = document.getElementById('subjectCode').value;
  const section = document.getElementById('section').value;

  // Required fields validation
  if (!id || !surname || !firstname || !subject || !section) {
    alert("All fields including Subject Code and Section must be filled out.");
    return;
  }

  const grid = getGridValues();

  // Build a clean readable text to embed in QR.
  // This will display nicely in phone camera scan results.
  const lines = [];
  lines.push(`Student ID: ${id}`);
  lines.push(`Surname: ${surname}`);
  lines.push(`Firstname: ${firstname}`);
  lines.push(`Subject: ${subject}`);
  lines.push(`Section: ${section}`);
  lines.push('');
  lines.push('Scores (columns 1→5):');
  lines.push(`Quiz: ${grid.quiz.map(v => v === '' ? '-' : v).join(' | ')}`);
  lines.push(`Recitation: ${grid.recitation.map(v => v === '' ? '-' : v).join(' | ')}`);
  lines.push(`Project: ${grid.project.map(v => v === '' ? '-' : v).join(' | ')}`);
  lines.push(`Attendance: ${grid.attendance.map(v => v ? '✓' : '✗').join(' | ')}`);

  const textToEncode = lines.join('\n');

  // Clear old QR and create new
  const container = document.getElementById('qrcode');
  container.innerHTML = '';

  // Create QR code (responsive size)
  const size = Math.min(280, Math.max(160, Math.floor(window.innerWidth * 0.45)));
  lastQRCode = new QRCode(container, {
    text: textToEncode,
    width: size,
    height: size,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });

  // Show the raw text as accessible fallback (optional)
  const pre = document.createElement('pre');
  pre.style.fontSize = '12px';
  pre.style.marginTop = '10px';
  pre.style.whiteSpace = 'pre-wrap';
  pre.style.textAlign = 'left';
  pre.textContent = textToEncode;
  container.appendChild(pre);
});

/* Download QR as PNG */
document.getElementById('downloadBtn').addEventListener('click', () => {
  const container = document.getElementById('qrcode');
  const img = container.querySelector('img') || container.querySelector('canvas');

  if (!img) {
    alert('Please generate the QR code first.');
    return;
  }

  // If an <img> (older qrcodejs) -> it has src; if canvas -> toDataURL
  if (img.tagName.toLowerCase() === 'img') {
    const url = img.src;
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student-qr.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
  } else {
    // canvas
    const url = img.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student-qr.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
});

/* Ensure QR resizes if device rotates */
window.addEventListener('resize', () => {
  // keep the QR; not automatically regenerate since that would re-encode same data
  // (you can press Generate again if you want an appropriately sized image)
});
