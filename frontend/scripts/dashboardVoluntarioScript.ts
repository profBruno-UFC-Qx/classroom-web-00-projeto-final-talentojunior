document.addEventListener("DOMContentLoaded", () => {
  const metricCards = document.querySelectorAll<HTMLElement>(".metric-card");
  const menuButton = document.querySelector<HTMLButtonElement>(".btn-menu");
  const sidebarOverlay = document.getElementById("sidebar-overlay");
  const sidebarLinks = document.querySelectorAll<HTMLAnchorElement>(".sidebar .nav-link");

  function openSidebar() {
    document.body.classList.add("sidebar-open");
    sidebarOverlay?.classList.add("visible");
    sidebarOverlay?.setAttribute("aria-hidden", "false");
    menuButton?.setAttribute("aria-expanded", "true");
  }

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

  metricCards.forEach((card) => {
    card.addEventListener("mousemove", (event: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });

  const favoriteButton = document.querySelector<HTMLButtonElement>(".btn-favorite");

  favoriteButton?.addEventListener("click", () => {
    favoriteButton.classList.toggle("active");
    const icon = favoriteButton.querySelector("i");
    if (icon) {
      icon.classList.toggle("bi-heart");
      icon.classList.toggle("bi-heart-fill");
    }
  });

  const loadMoreButton = document.querySelector<HTMLButtonElement>(".btn-load-more");

  loadMoreButton?.addEventListener("click", () => {
    const label = loadMoreButton.childNodes[0];
    if (label) {
      label.textContent = " Carregando...";
    }
    loadMoreButton.disabled = true;
  });
});
