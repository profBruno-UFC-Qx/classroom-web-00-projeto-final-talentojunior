interface Animal {
  id: number;
  name: string;
  species: string;
  location: string;
  images: string[];
}

async function loadHomeAnimals(): Promise<Animal[]> {
  const res = await fetch("data/animals.json");
  if (!res.ok) throw new Error("Não foi possível carregar os animais.");
  return res.json();
}

function createAnimalCard(animal: Animal): HTMLAnchorElement {
  const card = document.createElement("a");
  card.className = "animal-card";
  card.href = `details.html?id=${animal.id}`;
  card.innerHTML = `
    <img class="animal-image" src="${animal.images[0]}" alt="Foto de ${animal.name}, disponível para acolhimento." />
    <div class="animal-info">
      <h3 class="animal-name">${animal.name}</h3>
      <p class="animal-race">${animal.species}</p>
    </div>
    <div class="animal-location">
      <i class="bi bi-geo-alt"></i>
      <span>${animal.location}</span>
    </div>
  `;
  return card;
}

async function initAnimals() {
  const track = document.querySelector(".animals-track") as HTMLElement;
  if (!track) return;

  try {
    const animals = await loadHomeAnimals();
    track.innerHTML = "";
    animals.forEach((animal) => {
      track.appendChild(createAnimalCard(animal));
    });
  } catch (err) {
    console.error(err);
    track.innerHTML =
      '<p class="error-message">Não foi possível carregar os animais.</p>';
  }
}

// Create a carrousel effect for the ONG cards
const API_URL_HOME = "http://localhost:1337";

interface Ong {
  id: number;
  nome: string;
  imagem_perfil: {
    url: string;
  } | null;
}
async function loadOngs(): Promise<Ong[]> {
  const response = await fetch(`${API_URL_HOME}/api/ongs`);

  if (!response.ok) {
    throw new Error("Erro ao carregar ONGs.");
  }

  const data = await response.json();

  return data.ongs;
}

function createOngCard(ong: Ong): HTMLDivElement {
  const card = document.createElement("div");

  card.className = "ong-card";

  const image = ong.imagem_perfil?.url
    ? `${API_URL_HOME}${ong.imagem_perfil.url}`
    : "assets/logo-example.png";

  card.innerHTML = `
      <img
          class="ong-logo"
          src="${image}"
          alt="${ong.nome}">
  `;

  return card;
}
async function initOngs() {
  const track = document.querySelector(".ongs-track") as HTMLDivElement;

  if (!track) return;

  try {
    const ongs = await loadOngs();

    track.innerHTML = "";

    ongs.forEach((ong) => {
      track.appendChild(createOngCard(ong));
    });
  } catch (err) {
    console.error(err);

    track.innerHTML = "<p>Não foi possível carregar as ONGs.</p>";
  }
}

function initCarrouselOngs() {
  const list = document.querySelector(".ongs-list") as HTMLElement;
  const track = document.querySelector(".ongs-track") as HTMLElement;

  const originalCards = Array.from(track.children) as HTMLElement[];
  const gap = 22;

  function getOriginalWidth() {
    return originalCards.reduce((acc, card) => acc + card.offsetWidth + gap, 0);
  }

  function setup() {
    track.querySelectorAll(".ong-card-clone").forEach((el) => el.remove());
    track.classList.remove("animating");
    track.style.removeProperty("--scroll-distance");
    track.style.removeProperty("animation-duration");

    const trackWidth = getOriginalWidth();
    const containerWidth = list.offsetWidth;

    if (trackWidth <= containerWidth) {
      list.style.justifyContent = "center";
      return;
    }

    list.style.justifyContent = "flex-start";
    originalCards.forEach((card) => {
      const clone = card.cloneNode(true) as HTMLElement;
      clone.classList.add("ong-card-clone");
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });

    const speed = 60;
    const duration = trackWidth / speed;

    track.style.setProperty("--scroll-distance", `-${trackWidth}px`);
    track.style.setProperty("animation-duration", `${duration}s`);
    track.classList.add("animating");
  }

  setup();

  let resizeTimer: ReturnType<typeof setTimeout>;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setup, 150);
  });
}

// Create a carrousel effect for the animals show case
function initCarrouselAnimals() {
  const list = document.querySelector(".animal-cards") as HTMLElement;
  const track = document.querySelector(".animals-track") as HTMLElement;

  const originalCards = Array.from(track.children) as HTMLElement[];
  const gap = 22;

  function getOriginalWidth() {
    return originalCards.reduce((acc, card) => acc + card.offsetWidth + gap, 0);
  }

  function setup() {
    track.querySelectorAll(".animal-card-clone").forEach((el) => el.remove());
    track.classList.remove("animating");
    track.style.removeProperty("--scroll-distance");
    track.style.removeProperty("animation-duration");

    const trackWidth = getOriginalWidth();
    const containerWidth = list.offsetWidth;

    if (trackWidth <= containerWidth) {
      list.style.justifyContent = "center";
      return;
    }

    list.style.justifyContent = "flex-start";
    originalCards.forEach((card) => {
      const clone = card.cloneNode(true) as HTMLElement;
      clone.classList.add("animal-card-clone");
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });

    const speed = 60;
    const duration = trackWidth / speed;

    track.style.setProperty("--scroll-distance", `-${trackWidth}px`);
    track.style.setProperty("animation-duration", `${duration}s`);
    track.classList.add("animating");
  }

  setup();

  let resizeTimer: ReturnType<typeof setTimeout>;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setup, 150);
  });
}

initOngs().then(initCarrouselOngs);
initAnimals().then(initCarrouselAnimals);
