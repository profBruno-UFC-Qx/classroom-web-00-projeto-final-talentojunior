document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll<HTMLButtonElement>(".filter-chip");
  const requestCards = document.querySelectorAll<HTMLElement>(".request-card");
  const emptyState = document.getElementById("empty-state");
  const requestsList = document.querySelector<HTMLElement>(".requests-list");
  const menuButton = document.querySelector<HTMLButtonElement>(".btn-menu");
  const sidebarOverlay = document.getElementById("sidebar-overlay");
  const sidebarLinks = document.querySelectorAll<HTMLAnchorElement>(".sidebar .nav-link");

  // Menu hamburguer
  function openSidebar() {
    document.body.classList.add("sidebar-open");
    sidebarOverlay?.classList.add("visible");
    sidebarOverlay?.setAttribute("aria-hidden", "false");
    menuButton?.setAttribute("aria-expanded", "true");
  }

  // Fechar menu hamburguer
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

  // Aplica filtro
  function applyFilter(filter: string) {
    let visibleCount = 0;

    requestCards.forEach((card) => {
      const status = card.dataset.status;
      const isVisible = filter === "todas" || status === filter;
      card.style.display = isVisible ? "" : "none";
      if (isVisible) visibleCount++;
    });

    if (emptyState && requestsList) {
      emptyState.classList.toggle("visible", visibleCount === 0);
      requestsList.style.display = visibleCount === 0 ? "none" : "";
    }
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      applyFilter(button.dataset.filter ?? "todas");
    });
  });

  requestCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-2px)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0)";
    });
  });
});
