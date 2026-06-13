document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll<HTMLButtonElement>(".filter-chip");
  const requestCards = document.querySelectorAll<HTMLElement>(".request-card");
  const emptyState = document.getElementById("empty-state");
  const requestsList = document.querySelector<HTMLElement>(".requests-list");

  // Aplica filtros nas solicitações
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
