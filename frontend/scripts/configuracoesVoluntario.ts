document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector<HTMLButtonElement>(".btn-menu");
  const sidebarOverlay = document.getElementById("sidebar-overlay");
  const sidebarLinks = document.querySelectorAll<HTMLAnchorElement>(".sidebar .nav-link");
  const speciesCards = document.querySelectorAll<HTMLLabelElement>(".species-card");
  const settingsForm = document.querySelector<HTMLFormElement>(".settings-form");
  const submitButton = document.querySelector<HTMLButtonElement>(".btn-submit");

  // Menu hambuguer
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

  speciesCards.forEach((card) => {
    const checkbox = card.querySelector<HTMLInputElement>("input[type='checkbox']");

    checkbox?.addEventListener("change", () => {
      card.classList.toggle("active", checkbox.checked);
    });

    if (checkbox?.checked) {
      card.classList.add("active");
    }
  });

  // Ilusão para parecer que está enviado os dados do formulário
  settingsForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!submitButton) return;

    const originalContent = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML =
      '<i class="bi bi-arrow-repeat spin"></i> Salvando...';

    setTimeout(() => {
      submitButton.classList.add("success");
      submitButton.innerHTML =
        '<i class="bi bi-check-lg"></i> Salvo com Sucesso!';

      setTimeout(() => {
        submitButton.classList.remove("success");
        submitButton.innerHTML = originalContent;
        submitButton.disabled = false;
      }, 2000);
    }, 1000);
  });
});
