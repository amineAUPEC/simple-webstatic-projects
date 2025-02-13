let currentPage = 0;
let identifiers = [];
let iframeContainer = document.getElementById('iframe-container');

// Générer les identifiants à 6 chiffres
for (let i = 0; i < 300; i++) {
  identifiers.push(String(i + 1).padStart(6, '0'));
}

// Afficher les 50 premières pages
displayPages(currentPage);

// Fonction pour afficher les pages
function displayPages(pageNumber) {
  let start = pageNumber * 50;
  let end = start + 50;
  let html = '';

  for (let i = start; i < end; i++) {
    if (i >= identifiers.length) break;
    let identifier = identifiers[i];
    html += `<iframe src="https://cerebrascoder.com/p/${identifier}" width="200" height="200" frameborder="0"></iframe>`;
  }

  iframeContainer.innerHTML = html;
}

// Bouton "Next"
document.getElementById('next-button').addEventListener('click', function() {
  currentPage++;
  displayPages(currentPage);
});

// Bouton "Previous"
document.getElementById('previous-button').addEventListener('click', function() {
  if (currentPage > 0) {
    currentPage--;
    displayPages(currentPage);
  }
});
