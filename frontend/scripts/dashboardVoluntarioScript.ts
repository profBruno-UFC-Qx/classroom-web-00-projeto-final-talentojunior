document.addEventListener("DOMContentLoaded", () => {
  const metricCards = document.querySelectorAll<HTMLElement>(".metric-card");

  // Gambiarra
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
