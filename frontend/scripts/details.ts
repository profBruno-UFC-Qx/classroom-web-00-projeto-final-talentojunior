const API_URL_DETAILS = "http://localhost:1337";

interface Animal {
  id: number;
  nome: string;
  especie: string;
  idade: number;
  porte: string;
  localizacao: string;
  sobre: string;
  disponivel: boolean;
  status_do_animal: string;

  caracteristicas_do_animal: string[];
  caracteristicas_gerais: string[];
  necessidades_especiais: string[];

  imagem_capa?: {
    url: string;
  };

  imagens?: {
    url: string;
  }[];

  ong?: {
    nome: string;
    imagem_perfil?: {
      url: string;
    };
    createdAt?: string;
  };
}

async function loadAnimal(id: number): Promise<Animal> {
  const response = await fetch(
    `${API_URL_DETAILS}/api/animals/disponiveis/${id}`,
  );

  if (!response.ok) {
    throw new Error("Animal não encontrado.");
  }

  const data = await response.json();

  return data.animal;
}
async function loadAnimals(): Promise<Animal[]> {
  const response = await fetch(`${API_URL_DETAILS}/api/animals/disponiveis`);

  if (!response.ok) {
    throw new Error();
  }

  const data = await response.json();

  return data.animals;
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
  const thumbsContainer = document.getElementById(
    "gallery-thumbs",
  ) as HTMLElement;

  thumbsContainer.innerHTML = "";

  if (!animal.imagens || animal.imagens.length === 0) {
    return;
  }

  const maxThumbs = 4;
  const showImages = animal.imagens.slice(0, maxThumbs);
  const extra = animal.imagens.length - maxThumbs;

  showImages.forEach((imagem, index) => {
    const img = document.createElement("img");

    img.src = `${API_URL_DETAILS}${imagem.url}`;
    img.alt = `${animal.nome} - Foto ${index + 1}`;
    img.className = `gallery-thumb${index === 0 ? " active" : ""}`;

    img.addEventListener("click", () => {
      setMainImage(
        `${API_URL_DETAILS}${imagem.url}`,
        `${animal.nome} - Foto ${index + 1}`,
      );

      thumbsContainer
        .querySelectorAll(".gallery-thumb")
        .forEach((thumb) => thumb.classList.remove("active"));

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
  const badge = document.getElementById("status-badge") as HTMLElement;

  badge.textContent = animal.status_do_animal;

  badge.className = "status-badge";

  switch (animal.status_do_animal.toLowerCase()) {
    case "disponível":
      badge.classList.add("available");
      break;

    case "reservado":
      badge.classList.add("reserved");
      break;

    case "adotado":
      badge.classList.add("adopted");
      break;

    case "em tratamento":
      badge.classList.add("treatment");
      break;

    default:
      badge.classList.add("default");
      break;
  }
}

function buildTags(animal: Animal) {
  const container = document.getElementById("animal-tags") as HTMLElement;

  container.innerHTML = "";

  if (
    !animal.caracteristicas_do_animal ||
    animal.caracteristicas_do_animal.length === 0
  ) {
    return;
  }

  animal.caracteristicas_do_animal.forEach((tag) => {
    const span = document.createElement("span");
    span.className = "animal-tag";
    span.textContent = tag;

    container.appendChild(span);
  });
}

function buildHealthList(animal: Animal) {
  const container = document.getElementById("health-list") as HTMLElement;

  container.innerHTML = "";

  const caracteristicas = animal.caracteristicas_do_animal ?? [];

  const items = [
    {
      label: "Vacinado",
      value: caracteristicas.includes("Vacinado"),
      icon: "bi-shield-check",
    },
    {
      label: "Castrado",
      value: caracteristicas.includes("Castrado"),
      icon: "bi-scissors",
    },
    {
      label: "Vermifugado",
      value: caracteristicas.includes("Vermifugado"),
      icon: "bi-capsule",
    },
  ];

  items.forEach(({ label, value, icon }) => {
    const chip = document.createElement("div");

    chip.className = `health-chip ${value ? "yes" : "no"}`;

    chip.innerHTML = `
      <i class="bi ${icon}"></i>
      ${label}
    `;

    container.appendChild(chip);
  });
}

function buildOngCard(animal: Animal) {
  const container = document.getElementById("ong-card") as HTMLElement;

  if (!animal.ong) {
    container.innerHTML = "";
    return;
  }

  const avatar = animal.ong.imagem_perfil?.url
    ? `${API_URL_DETAILS}${animal.ong.imagem_perfil.url}`
    : "assets/logo-example.png";

  const dataRegistro = animal.ong.createdAt
    ? new Date(animal.ong.createdAt).toLocaleDateString("pt-BR")
    : "-";

  container.innerHTML = `
    <img
      class="ong-avatar"
      src="${avatar}"
      alt="${animal.ong.nome}"
    />

    <div class="ong-info">
      <span class="ong-name">${animal.ong.nome}</span>
      <span class="ong-registered">
        Registrada em: ${dataRegistro}
      </span>
    </div>

    <a href="#" class="ong-profile-link">
      Ver Perfil
    </a>
  `;
}

function buildOtherAnimals(animals: Animal[], currentId: number) {
  const grid = document.getElementById("other-animals-grid") as HTMLElement;

  grid.innerHTML = "";

  const others = animals
    .filter((animal) => animal.id !== currentId)
    .slice(0, 3);

  others.forEach((animal) => {
    const card = document.createElement("a");

    card.href = `details.html?id=${animal.id}`;
    card.className = "other-card";

    const imagem = animal.imagem_capa?.url
      ? `${API_URL_DETAILS}${animal.imagem_capa.url}`
      : "assets/no-image.png";

    card.innerHTML = `
      <div class="other-card-img-wrap">
        <img
          class="other-card-img"
          src="${imagem}"
          alt="${animal.nome}"
        />

        <span class="other-card-tag">
          ${animal.status_do_animal}
        </span>
      </div>

      <div class="other-card-body">
        <div class="other-card-name-row">
          <span class="other-card-name">
            ${animal.nome}
          </span>
        </div>

        <p class="other-card-meta">
          ${animal.especie} • ${animal.idade} ano(s) • Porte ${animal.porte}
        </p>

        <div class="other-card-footer">
          <span class="other-card-location">
            <i class="bi bi-geo-alt"></i>
            ${animal.localizacao}
          </span>

          <span class="other-card-cta">
            Saiba mais
          </span>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

function renderAnimal(animal: Animal, allAnimals: Animal[]) {
  const imagemPrincipal = animal.imagem_capa?.url
    ? `${API_URL_DETAILS}${animal.imagem_capa.url}`
    : "assets/no-image.png";

  document.getElementById("breadcrumb-name")!.textContent = animal.nome;
  document.title = `Adote Lar — ${animal.nome}`;

  const mainImg = document.getElementById("main-image") as HTMLImageElement;
  mainImg.src = imagemPrincipal;
  mainImg.alt = animal.nome;

  buildGallery(animal);

  buildStatusBadge(animal);

  document.getElementById("animal-name")!.textContent = animal.nome;

  document.getElementById("animal-meta")!.innerHTML = `
    ${animal.especie}
    <span class="dot"></span>
    ${animal.idade} ano(s)
    <span class="dot"></span>
    Porte ${animal.porte}
  `;

  buildTags(animal);

  document.getElementById("info-size")!.textContent = animal.porte;

  document.getElementById("info-age")!.textContent = `${animal.idade} ano(s)`;

  document.getElementById("info-location")!.textContent = animal.localizacao;

  document.getElementById("info-species")!.textContent = animal.especie;

  // Sobre
  document.getElementById("about-title")!.textContent = `Sobre ${animal.nome}`;

  document.getElementById("animal-description")!.textContent =
    animal.sobre || "Nenhuma descrição cadastrada.";

  // Necessidades especiais
  const specialNeedsBox = document.getElementById(
    "special-needs",
  ) as HTMLElement;
  const specialNeedsText = document.getElementById(
    "special-needs-text",
  ) as HTMLElement;

  if (
    animal.necessidades_especiais &&
    animal.necessidades_especiais.length > 0
  ) {
    specialNeedsBox.style.display = "flex";
    specialNeedsText.textContent = animal.necessidades_especiais.join(", ");
  } else {
    specialNeedsBox.style.display = "none";
  }

  // Saúde
  buildHealthList(animal);

  // ONG
  buildOngCard(animal);

  // Outros animais
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
