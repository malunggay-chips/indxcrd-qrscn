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

// --- Populate dropdowns that match your HTML IDs ---
const subjectEl = document.getElementById('subjectCode'); // matches your HTML
const sectionEl = document.getElementById('section');

function populateSelect(el, items, placeholder) {
  el.innerHTML = '';
  const ph = document.createElement('option');
  ph.value = '';
  ph.textContent = placeholder;
  el.appendChild(ph);
  items.forEach(it => {
    const o = document.createElement('option');
    o.value = it;
    o.textContent = it;
    el.appendChild(o);
  });
}

populateSelect(subjectEl, SUBJECTS, 'Select Subject Code');
populateSelect(sectionEl, SECTIONS, 'Select Section');


// --- helper to read grid values (works with your HTML structure) ---
function readGridValues() {
  const scoreInputs = Array.from(document.querySelectorAll('.score-grid input.score'));
  // scoreInputs order in your HTML: Quiz 5, Recitation 5, Project 5 → total 15
  const quiz = scoreInputs.slice(0,5).map(i=> i.value.trim());
  const recitation = scoreInputs.slice(5,10).map(i=> i.value.trim());
  const project = scoreInputs.slice(10,15).map(i=> i.value.trim());
  const attendance = Array.from(document.querySelectorAll('.score-grid input.att')).map(cb => cb.checked);
  return { quiz, recitation, project, attendance };
}

// clamp scores to 1..20; return "N/A" if blank
function clampScoreText(val) {
  if (val === '' || val == null) return "N/A";
  const n = parseInt(val, 10);
  if (isNaN(n)) return "N/A";
  return Math.max(1, Math.min(20, n)).toString();
}


// --- Generate QR ---
document.getElementById('generateBtn').addEventListener('click', () => {
  const id = document.getElementById('studentId').value.trim();
  const surname = document.getElementById('surname').value.trim();
  const firstname = document.getElementById('firstname').value.trim();
  const subject = document.getElementById('subjectCode').value;
  const section = document.getElementById('section').value;

  // required fields check (only these are required)
  if (!id || !surname || !firstname || !subject || !section) {
    alert("Please fill in Student ID, Surname, Firstname, Subject Code, and Section.");
    return;
  }

  const grid = readGridValues();

  // map scores (allow empty)
  const quizText = grid.quiz.map(v => v === '' ? '-' : clampScoreText(v)).join(' | ');
  const recitText = grid.recitation.map(v => v === '' ? '-' : clampScoreText(v)).join(' | ');
  const projText = grid.project.map(v => v === '' ? '-' : clampScoreText(v)).join(' | ');
  const attText = grid.attendance.map(a => a ? '✓' : '✗').join(' | ');

  const infoLines = [
    `Student ID: ${id}`,
    `Surname: ${surname}`,
    `Firstname: ${firstname}`,
    `Subject: ${subject}`,
    `Section: ${section}`,
    '',
    `Quiz: ${quizText}`,
    `Recitation: ${recitText}`,
    `Project: ${projText}`,
    `Attendance: ${attText}`
  ];

  const info = infoLines.join('\n');

  const qrContainer = document.getElementById('qrcode');

  // clear previous QR reliably
  while (qrContainer.firstChild) qrContainer.removeChild(qrContainer.firstChild);

  // ensure visible background and centering
  qrContainer.style.background = '#ffffff';
  qrContainer.style.padding = '18px';
  qrContainer.style.display = 'flex';
  qrContainer.style.justifyContent = 'center';
  qrContainer.style.alignItems = 'center';

  const size = Math.min(320, Math.max(180, Math.floor(window.innerWidth * 0.45)));

  // generate QR (black on white)
  new QRCode(qrContainer, {
    text: info,
    width: size,
    height: size,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });

  // fallback: if canvas created, ensure white background is underneath
  setTimeout(() => {
    const canvas = qrContainer.querySelector('canvas');
    const img = qrContainer.querySelector('img');

    if (img) {
      img.style.display = 'block';
      img.style.background = '#fff';
      img.style.border = '2px solid #000';
    }

    if (canvas) {
      try {
        const ctx = canvas.getContext('2d');
        // put white background under QR if needed
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } catch (e) {
        // ignore if getContext fails
      }
    }
  }, 100); // small delay to allow async rendering
});


// --- Download logic (works for canvas or img) ---
document.getElementById('downloadBtn').addEventListener('click', () => {
  const qrContainer = document.getElementById('qrcode');
  const canvas = qrContainer.querySelector('canvas');
  const img = qrContainer.querySelector('img');

  if (!canvas && !img) {
    alert('Please generate a QR code first.');
    return;
  }

  let url;
  if (canvas) {
    try {
      url = canvas.toDataURL('image/png');
    } catch (e) {
      // fallback to img
      url = img ? img.src : null;
    }
  } else {
    url = img.src;
  }

  if (!url) {
    alert('Unable to get QR image for download.');
    return;
  }

  const a = document.createElement('a');
  a.href = url;
  a.download = 'student-qr.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});
