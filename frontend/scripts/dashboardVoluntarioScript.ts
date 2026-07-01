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
  type SolicitacaoData,
} from "./voluntarioShared.js";

document.addEventListener("DOMContentLoaded", async () => {
  const token = getToken();
  const voluntarioRaw = localStorage.getItem("voluntario");

  if (!token || !voluntarioRaw) {
    window.location.href = "LoginPage.html";
    return;
  }

  setupLogout();
  setupSidebar();

  const welcomeTitle = document.querySelector(".welcome-section h2");
  const metricValues = document.querySelectorAll<HTMLElement>(".metric-value");
  const animalsUnderCareSection = document.querySelector<HTMLElement>("#animals-under-care");
  const requestsTableBody = document.querySelector<HTMLElement>("#requests-table-body");
  const impactTitle = document.querySelector<HTMLElement>("#impact-title");
  const loadMoreButton = document.querySelector<HTMLButtonElement>(".btn-load-more");

  const metricCards = document.querySelectorAll<HTMLElement>(".metric-card");
  metricCards.forEach((card) => {
    card.addEventListener("mousemove", (event: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
    });
  });

  let todasSolicitacoes: SolicitacaoData[] = [];
  let linhasVisiveis = 5;

  function renderAnimalUnderCare(solicitacoes: SolicitacaoData[]) {
    if (!animalsUnderCareSection) return;

    const emCuidado = solicitacoes.filter(
      (s) => getStatusSolicitacao(s) === "aprovada",
    );

    if (!emCuidado.length) {
      animalsUnderCareSection.innerHTML = `
        <p class="empty-inline">Nenhum animal sob seus cuidados no momento.</p>
      `;
      return;
    }

    animalsUnderCareSection.innerHTML = emCuidado
      .map((solicitacao) => {
        const animal = solicitacao.animal || {};
        const ongNome = animal.ong?.nome || "ONG";
        return `
          <article class="animal-card">
            <div class="animal-card-image">
              <img src="${getAnimalImageUrl(animal)}" alt="Foto do animal ${animal.nome || ""}" />
              <span class="animal-status-badge">Sob Cuidado</span>
            </div>
            <div class="animal-card-body">
              <div class="animal-card-top">
                <div>
                  <h4>${animal.nome || "Animal"}</h4>
                  <p>${formatarEspecie(animal.especie)}</p>
                </div>
                <button class="btn-favorite" type="button" aria-label="Favoritar">
                  <i class="bi bi-heart"></i>
                </button>
              </div>
              <div class="animal-location">
                <i class="bi bi-geo-alt"></i>
                <span>${ongNome}</span>
              </div>
              <a class="btn-atualizar-status" href="SolicitacoesVoluntario.html">
                <i class="bi bi-arrow-repeat"></i>
                Atualizar Status
              </a>
            </div>
          </article>
        `;
      })
      .join("");

    animalsUnderCareSection.querySelectorAll<HTMLButtonElement>(".btn-favorite").forEach((btn) => {
      btn.addEventListener("click", () => {
        btn.classList.toggle("active");
        const icon = btn.querySelector("i");
        icon?.classList.toggle("bi-heart");
        icon?.classList.toggle("bi-heart-fill");
      });
    });
  }

  function renderRequestsTable(solicitacoes: SolicitacaoData[]) {
    if (!requestsTableBody) return;

    if (!solicitacoes.length) {
      requestsTableBody.innerHTML = `
        <tr>
          <td colspan="5">Nenhuma solicitação encontrada.</td>
        </tr>
      `;
      loadMoreButton?.closest(".load-more-wrapper")?.setAttribute("style", "display: none;");
      return;
    }

    const visiveis = solicitacoes.slice(0, linhasVisiveis);

    requestsTableBody.innerHTML = visiveis
      .map((solicitacao) => {
        const animal = solicitacao.animal || {};
        const status = getStatusSolicitacao(solicitacao);
        const badgeClass = getStatusBadgeClass(status);

        return `
          <tr>
            <td>
              <div class="animal-cell">
                <div class="animal-thumb">
                  <img src="${getAnimalImageUrl(animal)}" alt="${animal.nome || "Animal"}" />
                </div>
                <span class="animal-name">${animal.nome || "Animal"}</span>
              </div>
            </td>
            <td>${animal.ong?.nome || "-"}</td>
            <td>${formatarData(solicitacao.createdAt)}</td>
            <td>
              <span class="status-badge ${badgeClass}">
                <span class="status-dot ${badgeClass}"></span>
                ${getStatusLabel(status)}
              </span>
            </td>
            <td>
              <a class="btn-detalhes" href="SolicitacoesVoluntario.html">Ver Detalhes</a>
            </td>
          </tr>
        `;
      })
      .join("");

    const wrapper = loadMoreButton?.closest(".load-more-wrapper") as HTMLElement | null;
    if (wrapper) {
      wrapper.style.display = linhasVisiveis >= solicitacoes.length ? "none" : "";
    }
  }

  function atualizarMetricas(solicitacoes: SolicitacaoData[]) {
    const total = solicitacoes.length;
    const pendentes = solicitacoes.filter((s) => getStatusSolicitacao(s) === "pendente").length;
    const emCuidado = solicitacoes.filter((s) => getStatusSolicitacao(s) === "aprovada").length;
    const finalizadas = solicitacoes.filter((s) => getStatusSolicitacao(s) === "finalizada").length;

    const valores = [total, pendentes, emCuidado, finalizadas];
    metricValues.forEach((el, index) => {
      if (valores[index] !== undefined) el.textContent = String(valores[index]);
    });

    if (impactTitle) {
      impactTitle.textContent =
        finalizadas > 0
          ? `Você já ajudou ${finalizadas} ${finalizadas === 1 ? "animal" : "animais"} a encontrarem um lar temporário.`
          : "Continue acolhendo animais e gere um impacto positivo na sua comunidade.";
    }
  }

  loadMoreButton?.addEventListener("click", () => {
    linhasVisiveis += 5;
    renderRequestsTable(todasSolicitacoes);
  });

  try {
    const voluntario = await fetchVoluntarioMe();
    aplicarPerfilVoluntario(voluntario);

    if (welcomeTitle) {
      welcomeTitle.textContent = `Olá, ${voluntario.nome} 👋`;
    }

    todasSolicitacoes = await fetchMinhasSolicitacoes();
    atualizarMetricas(todasSolicitacoes);
    renderAnimalUnderCare(todasSolicitacoes);
    renderRequestsTable(todasSolicitacoes);
  } catch (error) {
    const voluntario = JSON.parse(voluntarioRaw);
    if (welcomeTitle) welcomeTitle.textContent = `Olá, ${voluntario.nome} 👋`;
    aplicarPerfilVoluntario(voluntario);

    if (animalsUnderCareSection) {
      animalsUnderCareSection.innerHTML = `<p class="empty-inline">Não foi possível carregar seus acolhidos.</p>`;
    }
    if (requestsTableBody) {
      requestsTableBody.innerHTML = `<tr><td colspan="5">Erro ao carregar solicitações.</td></tr>`;
    }
  }
});
