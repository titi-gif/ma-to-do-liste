let compteurTache = 0;

window.onload = function () {
  const utilisateur = localStorage.getItem("connecté");
  const taches = JSON.parse(localStorage.getItem("taches_" + utilisateur)) || [];

  for (let tache of taches) {
    if (!tache.faite) {
      afficherTache(tache.texte, tache.date);
    }
  }

  verifierTachesPretes();
  setInterval(verifierTachesPretes, 30000); // Vérifie toutes les 30s
};

function sauvegarderTaches() {
  const ul = document.getElementById("liste-taches");
  const items = ul.getElementsByTagName("li");
  const taches = [];

  for (let li of items) {
    const span = li.querySelector("span");
    const texte = span.childNodes[0].textContent;
    const dateSpan = span.querySelector("small");
    const dateValue = dateSpan ? dateSpan.getAttribute("data-date") : null;
    const bouton = li.querySelector("button");
    const estFaite = bouton.disabled;
    if (!estFaite) {
      taches.push({ texte, date: dateValue, faite: false });
    }
  }

  const utilisateur = localStorage.getItem("connecté");
  localStorage.setItem("taches_" + utilisateur, JSON.stringify(taches));
}

document.getElementById("icone-calendrier").addEventListener("click", () => {
  const dateInput = document.getElementById("date-tache");
  dateInput.style.display = dateInput.style.display === "none" ? "inline-block" : "none";
});

function ajouterTache() {
  const input = document.getElementById("nouvelle-tache");
  const texte = input.value.trim();
  const dateInput = document.getElementById("date-tache");
  const dateValue = dateInput.value;

  if (texte === "") return;

  afficherTache(texte, dateValue);
  sauvegarderTaches();
  input.value = "";
  dateInput.value = "";
  dateInput.style.display = "none";
}

function afficherTache(texte, dateValue) {
  const li = document.createElement("li");
  const span = document.createElement("span");

  function majAffichage() {
    span.innerHTML = texte;
    if (dateValue) {
      if (dateValue) {
        const dateObj = new Date(dateValue);
        const dateLocale = new Date(dateObj.getTime() + dateObj.getTimezoneOffset() * 60000);
      
        const dateSpan = document.createElement("small");
        dateSpan.textContent = ` (Prévu : ${dateObj.toLocaleString()})`;
        dateSpan.setAttribute("data-date", dateValue);
        dateSpan.style.marginLeft = "10px";
        dateSpan.style.fontSize = "0.8em";
        dateSpan.style.color = "#666";
        span.appendChild(dateSpan);
      }
    }
  }

  majAffichage();

  const couleurs = ["#f28b82", "#aecbfa", "#ccff90", "#d7aefb", "#fff475"];
  li.style.backgroundColor = couleurs[compteurTache % couleurs.length];
  compteurTache++;

  const boutonValider = document.createElement("button");
  boutonValider.textContent = "Valider";

  const boutonModifier = document.createElement("button");
  boutonModifier.textContent = "Modifier";

  let timeout = null;
  const boutonAnnuler = document.createElement("button");
  boutonAnnuler.textContent = "Annuler";
  boutonAnnuler.style.display = "none";

  boutonValider.onclick = function () {
    span.style.textDecoration = "line-through";
    boutonValider.disabled = true;
    boutonAnnuler.style.display = "inline-block";

    timeout = setTimeout(() => {
      li.remove();
      sauvegarderTaches();
    }, 10000);
  };

  boutonAnnuler.onclick = function () {
    clearTimeout(timeout);
    boutonAnnuler.style.display = "none";
    boutonValider.disabled = false;
    span.style.textDecoration = "none";
  };

  boutonModifier.onclick = function () {
    const nouveauTexte = prompt("Modifier la tâche :", texte);
    const nouvelleDate = prompt("Modifier la date (YYYY-MM-DDTHH:MM) :", dateValue || "");

    if (nouveauTexte) {
      texte = nouveauTexte;
      dateValue = nouvelleDate || "";
      majAffichage();
      sauvegarderTaches();
    }
  };

  li.appendChild(span);
  li.appendChild(boutonValider);
  li.appendChild(boutonModifier);
  li.appendChild(boutonAnnuler);

  document.getElementById("liste-taches").appendChild(li);
}

function verifierTachesPretes() {
  const ul = document.getElementById("liste-taches");
  const items = ul.getElementsByTagName("li");

  for (let li of items) {
    const span = li.querySelector("span");
    const dateSpan = span.querySelector("small");

    if (dateSpan) {
      const dateTexte = dateSpan.getAttribute("data-date");
      if (!dateTexte) continue;

      const date = new Date(dateTexte);
      const maintenant = new Date();

      if (date <= maintenant) {
        const nomTache = span.childNodes[0].textContent;
        const newsItems = document.querySelectorAll("#news-list li");
        const dejaPresente = Array.from(newsItems).some(n => n.textContent.includes(nomTache));

        if (!dejaPresente) {
          const liNews = document.createElement("li");
          liNews.textContent = `${nomTache} est prête à être réalisée ✅`;
          document.getElementById("news-list").appendChild(liNews);
        }
      }
    }
  }
}

function deconnexion() {
  localStorage.removeItem("connecté");
  window.location.href = "index.html";
}

// Connexion
function connexion() {
  const pseudo = document.getElementById("pseudo").value.trim();
  const mdp = document.getElementById("motdepasse").value.trim();

  const comptes = JSON.parse(localStorage.getItem("comptes")) || {};

  if (comptes[pseudo] && comptes[pseudo] === mdp) {
    localStorage.setItem("connecté", pseudo);
    window.location.href = "taches.html";
  } else {
    alert("Identifiants incorrects");
  }
}

// Création de compte
function creerCompte() {
  const pseudo = document.getElementById("nouveauPseudo").value.trim();
  const mdp = document.getElementById("nouveauMDP").value.trim();

  if (!pseudo || !mdp) return alert("Tous les champs sont obligatoires");

  let comptes = JSON.parse(localStorage.getItem("comptes")) || {};

  if (comptes[pseudo]) return alert("Ce pseudo existe déjà");

  comptes[pseudo] = mdp;
  localStorage.setItem("comptes", JSON.stringify(comptes));
  alert("Compte créé ! Vous pouvez vous connecter.");
  window.location.href = "index.html";
}
