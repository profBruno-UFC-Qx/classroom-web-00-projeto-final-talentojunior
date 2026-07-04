import {
  API_URL,
  aplicarPerfilVoluntario,
  fetchAnimaisDisponiveis,
  fetchVoluntarioMe,
  formatarEspecie,
  formatarPorte,
  getAnimalImageUrl,
  getToken,
  getUrgenciaAnimal,
  setupLogout,
  setupSidebar,
  tempoRelativo,
  type AnimalData,
} from "./voluntarioShared.js";

document.addEventListener("DOMContentLoaded", async () => {
  const token = getToken();
  if (!token) {
    window.location.href = "LoginPage.html";
    return;
  }

  setupLogout();
  setupSidebar();

  const urgencyButtons = document.querySelectorAll<HTMLButtonElement>(".urgency-btn");
  const speciesSelect = document.querySelector<HTMLSelectElement>("#filter-species");
  const sizeSelect = document.querySelector<HTMLSelectElement>("#filter-size");
  const clearFiltersButton = document.querySelector<HTMLButtonElement>(".btn-clear-filters");
  const resetButton = document.querySelector<HTMLButtonElement>(".btn-reset");
  const opportunitiesGrid = document.getElementById("opportunities-list");
  const emptyState = document.getElementById("empty-state");
  const loadMoreButton = document.querySelector<HTMLButtonElement>(".btn-load-more");
  const searchInput = document.querySelector<HTMLInputElement>(".search-box input");

  let todosAnimais: AnimalData[] = [];
  let currentUrgency = "todas";
  let visiveis = 6;

  function renderBadges(animal: AnimalData): string {
    const urgencia = getUrgenciaAnimal(animal.createdAt);
    const badges: string[] = [];

    if (urgencia === "urgente") {
      badges.push(`
        <span class="badge urgent">
          <i class="bi bi-exclamation-lg"></i>
          URGENTE
        </span>
      `);
    }

    if (urgencia === "nova") {
      badges.push(`<span class="badge new">Nova</span>`);
    }

    const tempo = tempoRelativo(animal.createdAt);
    if (tempo) {
      badges.push(`<span class="badge time">${tempo}</span>`);
    }

    return badges.join("");
  }

  function renderCard(animal: AnimalData): string {
    const urgencia = getUrgenciaAnimal(animal.createdAt);
    const especie = (animal.especie || "").toLowerCase();
    const porte = (animal.porte || "").toLowerCase();
    const especieIcon = especie === "gato" ? "bi-emoji-heart-eyes" : "bi-emoji-smile";
    const local = [animal.ong?.nome, animal.localizacao].filter(Boolean).join(" • ");

    return `
      <article
        class="opportunity-card"
        data-urgency="${urgencia}"
        data-species="${especie}"
        data-size="${porte}"
        data-name="${(animal.nome || "").toLowerCase()}"
        data-ong="${(animal.ong?.nome || "").toLowerCase()}"
      >
        <div class="opportunity-card-image">
          <img src="${getAnimalImageUrl(animal)}" alt="${animal.nome || "Animal"}" />
          <div class="opportunity-badges">${renderBadges(animal)}</div>
        </div>
        <div class="opportunity-card-body">
          <div class="opportunity-card-top">
            <h3>${animal.nome || "Animal"}</h3>
            <span class="size-badge">${formatarPorte(animal.porte)}</span>
          </div>
          <div class="opportunity-location">
            <i class="bi bi-geo-alt"></i>
            <span>${local || "-"}</span>
          </div>
          <p class="opportunity-description">${animal.sobre || "Este animal precisa de um lar temporário."}</p>
          <div class="opportunity-card-footer">
            <div class="species-tag">
              <i class="bi ${especieIcon}"></i>
              <span>${formatarEspecie(animal.especie)}</span>
            </div>
            <button class="btn-details btn-solicitar-oportunidade" type="button" data-id="${animal.id}">
              Solicitar Acolhida
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function applyFilters() {
    if (!opportunitiesGrid) return;

    const species = speciesSelect?.value ?? "all";
    const size = sizeSelect?.value ?? "all";
    const search = (searchInput?.value || "").trim().toLowerCase();
    const cards = opportunitiesGrid.querySelectorAll<HTMLElement>(".opportunity-card");

    let matchingCount = 0;
    let shownCount = 0;

    cards.forEach((card) => {
      const cardSpecies = card.dataset.species ?? "";
      const cardSize = card.dataset.size ?? "";
      const cardUrgency = card.dataset.urgency ?? "";
      const cardName = card.dataset.name ?? "";
      const cardOng = card.dataset.ong ?? "";

      const matchesUrgency = currentUrgency === "todas" || cardUrgency === currentUrgency;
      const matchesSpecies = species === "all" || cardSpecies === species;
      const matchesSize = size === "all" || cardSize === size;
      const matchesSearch = !search || cardName.includes(search) || cardOng.includes(search);
      const passes = matchesUrgency && matchesSpecies && matchesSize && matchesSearch;

      if (passes) {
        matchingCount++;
        if (shownCount < visiveis) {
          card.style.display = "";
          shownCount++;
        } else {
          card.style.display = "none";
        }
      } else {
        card.style.display = "none";
      }
    });

    if (emptyState) {
      emptyState.classList.toggle("visible", matchingCount === 0);
      opportunitiesGrid.style.display = matchingCount === 0 ? "none" : "";
    }

    const wrapper = loadMoreButton?.closest(".load-more-wrapper") as HTMLElement | null;
    if (wrapper) {
      wrapper.style.display = matchingCount > visiveis ? "" : "none";
    }
  }

  function resetFilters() {
    currentUrgency = "todas";
    visiveis = 6;
    urgencyButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.urgency === "todas");
    });
    if (speciesSelect) speciesSelect.value = "all";
    if (sizeSelect) sizeSelect.value = "all";
    if (searchInput) searchInput.value = "";
    renderGrid();
  }

  async function solicitarAnimal(animalId: number, btn: HTMLButtonElement) {
    btn.disabled = true;
    btn.textContent = "Enviando...";

    try {
      const response = await fetch(`${API_URL}/solicitacoes/solicitar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ animalId }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data?.error?.message || "Erro ao solicitar acolhida.");
        btn.disabled = false;
        btn.textContent = "Solicitar Acolhida";
        return;
      }

      btn.textContent = "Solicitado!";
      alert("Solicitação enviada com sucesso!");
    } catch {
      alert("Erro ao conectar ao servidor.");
      btn.disabled = false;
      btn.textContent = "Solicitar Acolhida";
    }
  }

  function renderGrid() {
    if (!opportunitiesGrid) return;

    if (!todosAnimais.length) {
      opportunitiesGrid.innerHTML = "";
      emptyState?.classList.add("visible");
      loadMoreButton?.closest(".load-more-wrapper")?.classList.add("hidden");
      return;
    }

    opportunitiesGrid.innerHTML = todosAnimais.map(renderCard).join("");
    emptyState?.classList.remove("visible");

    opportunitiesGrid.querySelectorAll<HTMLButtonElement>(".btn-solicitar-oportunidade").forEach((btn) => {
      btn.addEventListener("click", () => {
        const animalId = Number(btn.dataset.id);
        if (animalId) solicitarAnimal(animalId, btn);
      });
    });

    applyFilters();
  }

  urgencyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      urgencyButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      currentUrgency = button.dataset.urgency ?? "todas";
      visiveis = 6;
      applyFilters();
    });
  });

  speciesSelect?.addEventListener("change", () => {
    visiveis = 6;
    applyFilters();
  });
  sizeSelect?.addEventListener("change", () => {
    visiveis = 6;
    applyFilters();
  });
  searchInput?.addEventListener("input", applyFilters);
  clearFiltersButton?.addEventListener("click", resetFilters);
  resetButton?.addEventListener("click", resetFilters);

  loadMoreButton?.addEventListener("click", () => {
    visiveis += 6;
    applyFilters();
    loadMoreButton.disabled = false;
    const label = loadMoreButton.childNodes[0];
    if (label) label.textContent = " Carregar mais animais ";
  });

  try {
    const voluntario = await fetchVoluntarioMe();
    aplicarPerfilVoluntario(voluntario);
    todosAnimais = await fetchAnimaisDisponiveis();
    renderGrid();
  } catch {
    const voluntarioRaw = localStorage.getItem("voluntario");
    if (voluntarioRaw) aplicarPerfilVoluntario(JSON.parse(voluntarioRaw));
    if (opportunitiesGrid) {
      opportunitiesGrid.innerHTML = `<p class="empty-inline">Erro ao carregar oportunidades.</p>`;
    }
  }
});
