document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector<HTMLButtonElement>(".btn-menu");
  const sidebarOverlay = document.getElementById("sidebar-overlay");
  const sidebarLinks = document.querySelectorAll<HTMLAnchorElement>(".sidebar .nav-link");
  const urgencyButtons = document.querySelectorAll<HTMLButtonElement>(".urgency-btn");
  const speciesSelect = document.querySelector<HTMLSelectElement>("#filter-species");
  const sizeSelect = document.querySelector<HTMLSelectElement>("#filter-size");
  const clearFiltersButton = document.querySelector<HTMLButtonElement>(".btn-clear-filters");
  const resetButton = document.querySelector<HTMLButtonElement>(".btn-reset");
  const opportunityCards = document.querySelectorAll<HTMLElement>(".opportunity-card");
  const opportunitiesGrid = document.getElementById("opportunities-list");
  const emptyState = document.getElementById("empty-state");
  const loadMoreButton = document.querySelector<HTMLButtonElement>(".btn-load-more");

  // Seta a urgência padrão
  let currentUrgency = "todas";

  // Menu hamburguer
  function openSidebar() {
    document.body.classList.add("sidebar-open");
    sidebarOverlay?.classList.add("visible");
    sidebarOverlay?.setAttribute("aria-hidden", "false");
    menuButton?.setAttribute("aria-expanded", "true");
  }

  // Fecha menu hamburguer
  function closeSidebar() {
    document.body.classList.remove("sidebar-open");
    sidebarOverlay?.classList.remove("visible");
    sidebarOverlay?.setAttribute("aria-hidden", "true");
    menuButton?.setAttribute("aria-expanded", "false");
  }

  menuButton?.addEventListener("click", () => {
    if (document.body.classList.contains("sidebar-open")) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  sidebarOverlay?.addEventListener("click", closeSidebar);

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", closeSidebar);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeSidebar();
    }
  });

  // Aplica filtros nas oportunidades
  function applyFilters() {
    const species = speciesSelect?.value ?? "all";
    const size = sizeSelect?.value ?? "all";
    let visibleCount = 0;

    opportunityCards.forEach((card) => {
      const cardSpecies = card.dataset.species ?? "";
      const cardSize = card.dataset.size ?? "";
      const cardUrgency = card.dataset.urgency ?? "";

      const matchesUrgency =
        currentUrgency === "todas" || cardUrgency === currentUrgency;
      const matchesSpecies = species === "all" || cardSpecies === species;
      const matchesSize = size === "all" || cardSize === size;

      const isVisible = matchesUrgency && matchesSpecies && matchesSize;
      card.style.display = isVisible ? "" : "none";
      if (isVisible) visibleCount++;
    });

    if (emptyState && opportunitiesGrid) {
      emptyState.classList.toggle("visible", visibleCount === 0);
      opportunitiesGrid.style.display = visibleCount === 0 ? "none" : "";
    }
  }

  // Limpa os filtros
  function resetFilters() {
    currentUrgency = "todas";
    urgencyButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.urgency === "todas");
    });
    if (speciesSelect) speciesSelect.value = "all";
    if (sizeSelect) sizeSelect.value = "all";
    applyFilters();
  }

  urgencyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      urgencyButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      currentUrgency = button.dataset.urgency ?? "todas";
      applyFilters();
    });
  });

  speciesSelect?.addEventListener("change", applyFilters);
  sizeSelect?.addEventListener("change", applyFilters);
  clearFiltersButton?.addEventListener("click", resetFilters);
  resetButton?.addEventListener("click", resetFilters);

  // Animação de carregando mais animais
  loadMoreButton?.addEventListener("click", () => {
    loadMoreButton.disabled = true;
    const label = loadMoreButton.childNodes[0];
    if (label) {
      label.textContent = " Carregando...";
    }
  });
});
