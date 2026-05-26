interface Animal {
  id: number;
  name: string;
  species: string;
  breed: string;
  gender: string;
  age: string;
  ageDetail: string;
  size: string;
  status: string;
  statusType: "available" | "urgent";
  location: string;
  images: string[];
  description: string;
  specialNeeds: string | null;
  vaccinated: boolean;
  neutered: boolean;
  dewormed: boolean;
  goodWithKids: boolean;
  goodWithDogs: boolean;
  goodWithCats: boolean;
  tags: string[];
  ong: {
    name: string;
    registeredAt: string;
    avatar: string;
  };
}

async function loadAnimals(): Promise<Animal[]> {
  const res = await fetch("data/animals.json");
  if (!res.ok) throw new Error("Não foi possível carregar os animais.");
  const data = await res.json();
  return data;
}

function getIdFromUrl(): number | null {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) return null;
  const parsed = Number(id);
  return Number.isInteger(parsed) ? parsed : null;
}

function setMainImage(src: string, alt: string) {
  const img = document.getElementById("main-image") as HTMLImageElement;
  img.style.opacity = "0";
  setTimeout(() => {
    img.src = src;
    img.alt = alt;
    img.style.opacity = "1";
  }, 150);
}

function buildGallery(animal: Animal) {
  const thumbsContainer = document.getElementById("gallery-thumbs")!;
  const maxThumbs = 4;
  const showImages = animal.images.slice(0, maxThumbs);
  const extra = animal.images.length - maxThumbs;

  showImages.forEach((src, i) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = `${animal.name} - foto ${i + 1}`;
    img.className = "gallery-thumb" + (i === 0 ? " active" : "");
    img.addEventListener("click", () => {
      setMainImage(src, img.alt);
      thumbsContainer
        .querySelectorAll(".gallery-thumb")
        .forEach((t) => t.classList.remove("active"));
      img.classList.add("active");
    });
    thumbsContainer.appendChild(img);
  });

  if (extra > 0) {
    const more = document.createElement("div");
    more.className = "gallery-thumb-more";
    more.textContent = `+${extra}`;
    thumbsContainer.appendChild(more);
  }
}

function buildStatusBadge(animal: Animal) {
  const badge = document.getElementById("status-badge")!;
  badge.textContent = animal.status;
  badge.className = `status-badge ${animal.statusType}`;
}

function buildTags(animal: Animal) {
  const container = document.getElementById("animal-tags")!;
  animal.tags.forEach((tag) => {
    const span = document.createElement("span");
    span.className =
      "animal-tag" + (tag.toLowerCase() === "urgente" ? " urgent" : "");
    span.textContent = tag;
    container.appendChild(span);
  });
}

function buildHealthList(animal: Animal) {
  const container = document.getElementById("health-list")!;
  const items = [
    { label: "Vacinado", value: animal.vaccinated, icon: "bi-shield-check" },
    { label: "Castrado", value: animal.neutered, icon: "bi-scissors" },
    { label: "Vermifugado", value: animal.dewormed, icon: "bi-capsule" },
  ];
  items.forEach(({ label, value, icon }) => {
    const chip = document.createElement("div");
    chip.className = `health-chip ${value ? "yes" : "no"}`;
    chip.innerHTML = `<i class="bi ${icon}"></i> ${label}`;
    container.appendChild(chip);
  });
}

function buildCompatList(animal: Animal) {
  const container = document.getElementById("compat-list")!;
  const items = [
    { label: "Com crianças", value: animal.goodWithKids, icon: "bi-people" },
    { label: "Com cães", value: animal.goodWithDogs, icon: "bi-egg" },
    { label: "Com gatos", value: animal.goodWithCats, icon: "bi-moon-stars" },
  ];
  items.forEach(({ label, value, icon }) => {
    const chip = document.createElement("div");
    chip.className = `compat-chip ${value ? "yes" : "no"}`;
    chip.innerHTML = `<i class="bi ${icon}"></i> ${value ? "Convive bem" : "Não recomendado"} ${label}`;
    container.appendChild(chip);
  });
}

function buildOngCard(animal: Animal) {
  const container = document.getElementById("ong-card")!;
  container.innerHTML = `
    <img class="ong-avatar" src="${animal.ong.avatar}" alt="${animal.ong.name}" />
    <div class="ong-info">
      <span class="ong-name">${animal.ong.name}</span>
      <span class="ong-registered">Registrada em: ${animal.ong.registeredAt}</span>
    </div>
    <a href="#" class="ong-profile-link">Ver Perfil</a>
  `;
}

function buildOtherAnimals(animals: Animal[], currentId: number) {
  const grid = document.getElementById("other-animals-grid")!;
  const others = animals.filter((a) => a.id !== currentId).slice(0, 3);

  others.forEach((a) => {
    const card = document.createElement("a");
    card.href = `details.html?id=${a.id}`;
    card.className = "other-card";
    card.innerHTML = `
      <div class="other-card-img-wrap">
        <img class="other-card-img" src="${a.images[0]}" alt="${a.name}" />
        <span class="other-card-tag ${a.statusType}">${a.status}</span>
        <div class="other-card-fav"><i class="bi bi-heart"></i></div>
      </div>
      <div class="other-card-body">
        <div class="other-card-name-row">
          <span class="other-card-name">${a.name}</span>
        </div>
        <p class="other-card-meta">${a.gender} • ${a.age} • ${a.species === "Cachorro" ? "Porte " + a.size.split(" ")[0] : a.species}</p>
        <div class="other-card-footer">
          <span class="other-card-location"><i class="bi bi-geo-alt"></i> ${a.location}</span>
          <span class="other-card-cta">Saiba mais</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderAnimal(animal: Animal, allAnimals: Animal[]) {
  if (!animal.images[0]) return;

  // Breadcrumb
  document.getElementById("breadcrumb-name")!.textContent = animal.name;
  document.title = `Adote Lar — ${animal.name}`;

  // Gallery
  const mainImg = document.getElementById("main-image") as HTMLImageElement;
  mainImg.src = animal.images[0];
  mainImg.alt = `Foto de ${animal.name}`;
  buildGallery(animal);
  buildStatusBadge(animal);

  // Name & meta
  document.getElementById("animal-name")!.textContent = animal.name;
  document.getElementById("animal-meta")!.innerHTML = `
    ${animal.breed}
    <span class="dot"></span>
    ${animal.gender}
    <span class="dot"></span>
    ${animal.age}
  `;

  // Tags
  buildTags(animal);

  // Info grid
  document.getElementById("info-size")!.textContent = animal.size;
  document.getElementById("info-age")!.textContent = animal.ageDetail;
  document.getElementById("info-location")!.textContent = animal.location;
  document.getElementById("info-species")!.textContent = animal.species;

  // About
  document.getElementById("about-title")!.textContent =
    `Sobre ${animal.name.startsWith("a") || animal.name.startsWith("e") || animal.name.startsWith("i") ? "a" : "o"} ${animal.name}`;
  document.getElementById("animal-description")!.textContent =
    animal.description;

  // Special Needs
  if (animal.specialNeeds) {
    const snBox = document.getElementById("special-needs")!;
    snBox.style.display = "flex";
    document.getElementById("special-needs-text")!.textContent =
      animal.specialNeeds;
  }

  // Health & Compat
  buildHealthList(animal);
  buildCompatList(animal);

  // ONG
  buildOngCard(animal);

  // Others
  buildOtherAnimals(allAnimals, animal.id);
}

async function init() {
  const id = getIdFromUrl();
  const main = document.getElementById("animal-main")!;
  const notFound = document.getElementById("not-found")!;

  if (!id) {
    window.location.href = "index.html";
    return;
  }

  try {
    const animals = await loadAnimals();
    const animal = animals.find((a) => a.id === id);

    if (!animal) {
      main.style.display = "none";
      notFound.style.display = "flex";
      return;
    }

    renderAnimal(animal, animals);
  } catch (err) {
    console.error(err);
    main.style.display = "none";
    notFound.style.display = "flex";
  }
}

init();
