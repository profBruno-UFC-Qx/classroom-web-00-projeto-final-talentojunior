export { }; // mantém o arquivo como módulo isolado, evita colisão de nomes com outras páginas

document.addEventListener("DOMContentLoaded", () => {
  // --- proteção de rota + dados do usuário ---

  function porteParaEnum(texto: string): string {
    if (texto.startsWith("Pequeno")) return "pequeno";
    if (texto.startsWith("Médio")) return "medio";
    if (texto.startsWith("Grande")) return "grande";
    return "gigante";
  }

  const token = localStorage.getItem("token");
  const voluntarioRaw = localStorage.getItem("voluntario");

  if (!token || !voluntarioRaw) {
    window.location.href = "LoginPage.html"; 
    return;
  }

  const voluntario = JSON.parse(voluntarioRaw) as {
    id: number;
    nome: string;
    email: string;
    cidade: string;
    descricao: string;
    aceita_cachorro: boolean;
    aceita_gato: boolean;
    porte_maximo: string;
  };

  // --- popular dados no form ---
  const nomeInput = document.getElementById("nome") as HTMLInputElement;
  const cidadeInput = document.getElementById("cidade") as HTMLInputElement;
  const bioInput = document.getElementById("bio") as HTMLTextAreaElement;
  const porteSelect = document.getElementById("porte") as HTMLSelectElement;
  const caesCheckbox = document.querySelector(".species-card:nth-child(1) input") as HTMLInputElement;
  const gatosCheckbox = document.querySelector(".species-card:nth-child(2) input") as HTMLInputElement;
  const userSectionSpan = document.querySelector(".user-section span");

  nomeInput.value = voluntario.nome;
  cidadeInput.value = voluntario.cidade;
  bioInput.value = voluntario.descricao || "";
  porteSelect.value =
  voluntario.porte_maximo === "pequeno" ? "Pequeno (até 10kg)" :
  voluntario.porte_maximo === "medio" ? "Médio (até 20kg)" :
  voluntario.porte_maximo === "grande" ? "Grande (até 40kg)" :"Gigante (acima de 40kg)";
  caesCheckbox.checked = voluntario.aceita_cachorro ?? false;
  gatosCheckbox.checked = voluntario.aceita_gato ?? false;
  caesCheckbox.closest(".species-card")?.classList.toggle("active", caesCheckbox.checked);
  gatosCheckbox.closest(".species-card")?.classList.toggle("active", gatosCheckbox.checked);
  if (userSectionSpan) userSectionSpan.textContent = voluntario.nome;

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

  const menuButton = document.querySelector<HTMLButtonElement>(".btn-menu");
  const sidebarOverlay = document.getElementById("sidebar-overlay");
  const sidebarLinks = document.querySelectorAll<HTMLAnchorElement>(".sidebar .nav-link");
  const speciesCards = document.querySelectorAll<HTMLLabelElement>(".species-card");
  const settingsForm = document.querySelector<HTMLFormElement>(".settings-form");
  const submitButton = document.querySelector<HTMLButtonElement>(".btn-submit");

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
    if (document.body.classList.contains("sidebar-open")) closeSidebar();
    else openSidebar();
  });

  sidebarOverlay?.addEventListener("click", closeSidebar);
  sidebarLinks.forEach((link) => link.addEventListener("click", closeSidebar));

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) closeSidebar();
  });

  speciesCards.forEach((card) => {
    const checkbox = card.querySelector<HTMLInputElement>("input[type='checkbox']");
    checkbox?.addEventListener("change", () => {
      card.classList.toggle("active", checkbox.checked);
    });
    if (checkbox?.checked) card.classList.add("active");
  });

  settingsForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!submitButton) return;

    const originalContent = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="bi bi-arrow-repeat spin"></i> Salvando...';

    try {
      const response = await fetch("http://localhost:1337/api/voluntarios/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: nomeInput.value.trim(),
          cidade: cidadeInput.value.trim(),
          descricao: bioInput.value.trim(),
          aceita_cachorro: caesCheckbox.checked,
          aceita_gato: gatosCheckbox.checked,
          porte_maximo: porteParaEnum(porteSelect.value),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error?.message || "Erro ao salvar.");
      }

      localStorage.setItem("voluntario", JSON.stringify(data.voluntario));
      if (userSectionSpan) userSectionSpan.textContent = data.voluntario.nome;

      submitButton.classList.add("success");
      submitButton.innerHTML = '<i class="bi bi-check-lg"></i> Salvo com Sucesso!';

      setTimeout(() => {
        submitButton.classList.remove("success");
        submitButton.innerHTML = originalContent;
        submitButton.disabled = false;
      }, 2000);
    } catch (error) {
      submitButton.innerHTML = originalContent;
      submitButton.disabled = false;
      alert(error instanceof Error ? error.message : "Erro ao salvar.");
    }
  });
});