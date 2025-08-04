let mode = null;

function setupStaffPage() {
    // Tilføj klikfunktioner til eksisterende kort
const stored = localStorage.getItem("newPerson");
if (stored) {
    const data = JSON.parse(stored);
    const card = document.createElement('div');
    card.className = 'staff-card';
    card.innerHTML = `
        <div class="avatar-placeholder"></div>
        <div class="staff-name">${data.name}</div>
        <div class="staff-role">${data.role}</div>
        <div class="staff-language">${data.language}</div>
    `;
    card.addEventListener('click', () => handleCardClick(card));
    document.querySelector('.staff-grid').appendChild(card);
    localStorage.removeItem("newPerson");
}

  document.querySelectorAll('.staff-card').forEach(card => {
    card.addEventListener('click', () => handleCardClick(card));
  });

    document.querySelector('.btn:nth-child(1)').addEventListener('click', () => {
        window.location.href = "/person";
    }) ;

  document.querySelector('.btn:nth-child(2)').addEventListener('click', () => {
    mode = "edit";
    alert("Vælg en person at redigere");
  });

  document.querySelector('.btn:nth-child(3)').addEventListener('click', () => {
    mode = "delete";
    alert("Vælg en person at slette");
  });
}

function handleCardClick(card) {
  if (mode === "edit") {
    const name = encodeURIComponent(card.querySelector('.staff-name').textContent);
    const role = encodeURIComponent(card.querySelector('.staff-role').textContent);
    const language = encodeURIComponent(card.querySelector('.staff-language').textContent);
    // Gå til person
    window.location.href = `/person?name=${name}&role=${role}&language=${language}`;
  } else if (mode === "delete") {
    if (confirm("Vil du slette denne person?")) {
      card.remove();
    }
  }
  mode = null;
}


document.addEventListener('DOMContentLoaded', setupStaffPage);
