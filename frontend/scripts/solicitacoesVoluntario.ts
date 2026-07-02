import {
  aplicarPerfilVoluntario,
  fetchMinhasSolicitacoes,
  fetchVoluntarioMe,
  formatarData,
  formatarEspecie,
  getAnimalImageUrl,
  getStatusBadgeClass,
  getStatusLabel,
  getStatusSolicitacao,
  getToken,
  setupLogout,
  setupSidebar,
  statusParaFiltro,
  type SolicitacaoData,
} from "./voluntarioShared.js";

document.addEventListener("DOMContentLoaded", async () => {
  const token = getToken();
  if (!token) {
    window.location.href = "LoginPage.html";
    return;
  }

  setupLogout();
  setupSidebar();

  const filterButtons = document.querySelectorAll<HTMLButtonElement>(".filter-chip");
  const emptyState = document.getElementById("empty-state");
  const requestsList = document.querySelector<HTMLElement>(".requests-list");
  const modal = document.getElementById("statusModal");
  const closeBtn = document.getElementById("closeModal");
  const cancelBtn = document.getElementById("cancelModal");
  const modalAnimalImg = document.getElementById("modal-animal-img") as HTMLImageElement | null;
  const modalAnimalName = document.getElementById("modal-animal-name");
  const modalAnimalSpecies = document.getElementById("modal-animal-species");
  const modalAnimalOng = document.getElementById("modal-animal-ong");
  const modalStatusBadge = document.getElementById("modal-status-badge");

  let todasSolicitacoes: SolicitacaoData[] = [];
  let filtroAtual = "todas";

  function renderCard(solicitacao: SolicitacaoData): string {
    const animal = solicitacao.animal || {};
    const status = getStatusSolicitacao(solicitacao);
    const filtro = statusParaFiltro(status);
    const badgeClass = getStatusBadgeClass(status);

    let actionButton = "";
    if (status === "aprovada") {
      actionButton = `<button class="btn-card primary btn-open-status" type="button" data-id="${solicitacao.id}">Atualizar Status</button>`;
    } else if (status === "pendente") {
      actionButton = `<button class="btn-card outline" type="button" disabled>Aguardando resposta da ONG</button>`;
    } else if (status === "finalizada") {
      actionButton = `<button class="btn-card secondary" type="button" disabled>Ver Animal</button>`;
    } else {
      actionButton = `<button class="btn-card outline" type="button" disabled>Solicitação recusada</button>`;
    }

    return `
      <article class="request-card" data-status="${filtro}" data-id="${solicitacao.id}">
        <div class="request-card-header">
          <div class="request-card-image">
            <img src="${getAnimalImageUrl(animal)}" alt="${animal.nome || "Animal"}" />
          </div>
          <div class="request-card-heading">
            <div class="request-animal">
              <h3>${animal.nome || "Animal"}</h3>
              <p>${formatarEspecie(animal.especie)}</p>
            </div>
            <div class="request-status">
              <span class="status-badge ${badgeClass}">
                <span class="status-dot"></span>
                ${getStatusLabel(status)}
              </span>
            </div>
          </div>
        </div>
        <div class="request-card-details">
          <div>
            <p class="request-field-label">Instituição</p>
            <p class="request-field-value">${animal.ong?.nome || "-"}</p>
          </div>
          <div>
            <p class="request-field-label">Data do Pedido</p>
            <p class="request-field-value">${formatarData(solicitacao.createdAt, true)}</p>
          </div>
        </div>
        ${actionButton}
      </article>
    `;
  }

  function applyFilter(filter: string) {
    if (!requestsList) return;

    const cards = requestsList.querySelectorAll<HTMLElement>(".request-card");
    let visibleCount = 0;

    cards.forEach((card) => {
      const status = card.dataset.status;
      const isVisible = filter === "todas" || status === filter;
      card.style.display = isVisible ? "" : "none";
      if (isVisible) visibleCount++;
    });

    if (emptyState) {
      emptyState.classList.toggle("visible", visibleCount === 0);
      requestsList.style.display = visibleCount === 0 ? "none" : "";
    }
  }

  function renderLista() {
    if (!requestsList) return;

    if (!todasSolicitacoes.length) {
      requestsList.innerHTML = "";
      emptyState?.classList.add("visible");
      return;
    }

    requestsList.innerHTML = todasSolicitacoes.map(renderCard).join("");
    emptyState?.classList.remove("visible");
    applyFilter(filtroAtual);

    requestsList.querySelectorAll<HTMLElement>(".request-card").forEach((card) => {
      card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-2px)";
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0)";
      });
    });

    requestsList.querySelectorAll<HTMLButtonElement>(".btn-open-status").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.id);
        const solicitacao = todasSolicitacoes.find((s) => s.id === id);
        if (!solicitacao) return;

        const animal = solicitacao.animal || {};
        const status = getStatusSolicitacao(solicitacao);
        const badgeClass = getStatusBadgeClass(status);

        if (modalAnimalImg) modalAnimalImg.src = getAnimalImageUrl(animal);
        if (modalAnimalName) modalAnimalName.textContent = animal.nome || "Animal";
        if (modalAnimalSpecies) {
          modalAnimalSpecies.innerHTML = `<i class="bi bi-heart"></i> ${formatarEspecie(animal.especie)}`;
        }
        if (modalAnimalOng) {
          modalAnimalOng.innerHTML = `<i class="bi bi-house"></i> ${animal.ong?.nome || "-"}`;
        }
        if (modalStatusBadge) {
          modalStatusBadge.className = `status-badge ${badgeClass}`;
          modalStatusBadge.innerHTML = `<span class="status-dot"></span> Sob Cuidado`;
        }

        modal?.classList.add("active");
      });
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      filtroAtual = button.dataset.filter ?? "todas";
      applyFilter(filtroAtual);
    });
  });

  closeBtn?.addEventListener("click", () => modal?.classList.remove("active"));
  cancelBtn?.addEventListener("click", () => modal?.classList.remove("active"));
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("active");
  });

  const radios = document.querySelectorAll('input[name="symptoms"]');
  const symptomsContainer = document.getElementById("symptomsDescriptionContainer");
  radios.forEach((radio) => {
    radio.addEventListener("change", () => {
      const selected = document.querySelector('input[name="symptoms"]:checked') as HTMLInputElement;
      if (selected.value === "mild" || selected.value === "severe") {
        symptomsContainer?.classList.remove("hidden");
      } else {
        symptomsContainer?.classList.add("hidden");
      }
    });
  });

  document.getElementById("statusUpdateForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Atualização de status registrada localmente. Em breve será sincronizada com a ONG.");
    modal?.classList.remove("active");
  });

  try {
    const voluntario = await fetchVoluntarioMe();
    aplicarPerfilVoluntario(voluntario);
    todasSolicitacoes = await fetchMinhasSolicitacoes();
    renderLista();
  } catch {
    const voluntarioRaw = localStorage.getItem("voluntario");
    if (voluntarioRaw) aplicarPerfilVoluntario(JSON.parse(voluntarioRaw));
    if (requestsList) {
      requestsList.innerHTML = `<p class="empty-inline">Erro ao carregar solicitações.</p>`;
    }
  }
});
