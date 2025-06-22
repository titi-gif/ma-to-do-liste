const utilisateur = localStorage.getItem("connecté");
const taches = JSON.parse(localStorage.getItem("taches_" + utilisateur)) || [];
const calendrier = document.getElementById("calendrier");
const tachesJour = document.getElementById("taches-jour");
const moisAnnee = document.getElementById("mois-annee");

const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

// Créer les jours du mois actuel
function genererCalendrier(mois, annee) {
  calendrier.innerHTML = "";
  moisAnnee.textContent = `${today.toLocaleString('fr-FR', { month: 'long' })} ${annee}`;

  const premierJour = new Date(annee, mois, 1).getDay();
  const nbJours = new Date(annee, mois + 1, 0).getDate();

  for (let i = 0; i < (premierJour === 0 ? 6 : premierJour - 1); i++) {
    const vide = document.createElement("div");
    calendrier.appendChild(vide);
  }

  for (let jour = 1; jour <= nbJours; jour++) {
    const div = document.createElement("div");
    div.className = "day";
    div.textContent = jour;

    div.addEventListener("click", () => afficherTachesDuJour(jour, mois, annee));
    calendrier.appendChild(div);
  }
}

function afficherTachesDuJour(jour, mois, annee) {
  const dateCle = new Date(annee, mois, jour).toISOString().slice(0, 10);
  const tachesCeJour = taches.filter(t => {
    if (!t.date) return false;
    return t.date.startsWith(dateCle);
  });

  if (tachesCeJour.length === 0) {
    tachesJour.innerHTML = `<h3>Tâches du ${jour}/${mois + 1}/${annee}</h3><p>Aucune tâche prévue.</p>`;
    return;
  }

  let html = `<h3>Tâches du ${jour}/${mois + 1}/${annee}</h3><ul>`;
  for (let t of tachesCeJour) {
    const heure = new Date(t.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    html += `<li><strong>${t.texte}</strong> à <em>${heure}</em></li>`;
  }
  html += "</ul>";
  tachesJour.innerHTML = html;
}

genererCalendrier(currentMonth, currentYear);
