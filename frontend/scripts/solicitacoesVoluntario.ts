document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll<HTMLButtonElement>(".filter-chip");
  const requestCards = document.querySelectorAll<HTMLElement>(".request-card");
  const emptyState = document.getElementById("empty-state");
  const requestsList = document.querySelector<HTMLElement>(".requests-list");
  const menuButton = document.querySelector<HTMLButtonElement>(".btn-menu");
  const sidebarOverlay = document.getElementById("sidebar-overlay");
  const sidebarLinks = document.querySelectorAll<HTMLAnchorElement>(".sidebar .nav-link");


    // --- logout ---
    const logoutLink = document.querySelector(".sidebar-logout .logout, .nav-link.logout");
    logoutLink?.addEventListener("click", (event) => {
      event.preventDefault();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("voluntario");
      localStorage.removeItem("ong");
      window.location.href = "../html/LoginPage.html"; 
    });

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

  // Modal status
  const modal = document.getElementById("statusModal");
  const openBtn = document.getElementById("openStatusModal");

  const closeBtn = document.getElementById("closeModal");
  const cancelBtn = document.getElementById("cancelModal");

  openBtn?.addEventListener("click", () => {
    modal?.classList.add("active");
  });

  closeBtn?.addEventListener("click", () => {
    modal?.classList.remove("active");
  });

  cancelBtn?.addEventListener("click", () => {
    modal?.classList.remove("active");
  });

  modal?.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });

  const radios = document.querySelectorAll(
    'input[name="symptoms"]'
  );

  const symptomsContainer =
    document.getElementById(
      "symptomsDescriptionContainer"
    );

  radios.forEach((radio) => {
    radio.addEventListener("change", () => {
      const selected =
        document.querySelector(
          'input[name="symptoms"]:checked'
        ) as HTMLInputElement;

      if (
        selected.value === "mild" ||
        selected.value === "severe"
      ) {
        symptomsContainer?.classList.remove("hidden");
      } else {
        symptomsContainer?.classList.add("hidden");
      }
    });
  });
});
