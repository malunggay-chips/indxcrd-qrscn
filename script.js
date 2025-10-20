document.getElementById("generateBtn").addEventListener("click", function () {
  const id = document.getElementById("studentId").value.trim();
  const surname = document.getElementById("surname").value.trim();
  const firstname = document.getElementById("firstname").value.trim();
  const subject = document.getElementById("subjectCode").value;
  const section = document.getElementById("section").value;

  if (!id || !surname || !firstname || !subject || !section) {
    alert("All fields including Subject Code and Section must be filled out.");
    return;
  }

  const data = `
  Student ID: ${id}
  Surname: ${surname}
  Firstname: ${firstname}
  Subject: ${subject}
  Section: ${section}
  `;

  const qrContainer = document.getElementById("qrcode");
  qrContainer.innerHTML = ""; // clear old QR code
  new QRCode(qrContainer, {
    text: data.trim(),
    width: 200,
    height: 200,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });
});
