export {};

const API_BASE_URL = "http://localhost:1337/api";

const token = localStorage.getItem("token");
const ongRaw = localStorage.getItem("ong");
if (!token || !ongRaw) {
  window.location.href = "../html/LoginPage.html";
}

// logout
const logoutLink = document.querySelector(
  ".sidebar-logout .logout, .nav-link.logout",
);
logoutLink?.addEventListener("click", (event) => {
  event.preventDefault();
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("voluntario");
  localStorage.removeItem("ong");
  window.location.href = "../html/LoginPage.html";
});

// Types

type StatusSolicitacao = "pendente" | "aprovada" | "recusada" | "finalizada";

interface ImagemFormato {
  url?: string;
}

interface ImagemCapa {
  url?: string;
  formats?: {
    thumbnail?: ImagemFormato;
  };
}

interface Animal {
  id?: number;
  nome?: string;
  especie?: string;
  imagem_capa?: ImagemCapa;
}

interface Voluntario {
  id?: number;
  nome?: string;
  email?: string;
}

interface Solicitacao {
  id: number;
  aprovada: boolean;
  finalizada: boolean;
  createdAt?: string;
  animal?: Animal;
  voluntario?: Voluntario;
  acolhimento_finalizado: boolean;
}

interface SolicitacoesResponse {
  solicitacoes: Solicitacao[];
  total: number;
}

type FiltroTipo = "todas" | StatusSolicitacao;
type AcaoSolicitacao = "aprovar" | "recusar" | "finalizar";

// ---------- Estado ----------

let todasSolicitacoes: Solicitacao[] = [];
let filtroAtual: FiltroTipo = "pendente"; // filtro inicial, igual ao que já vem marcado como ativo no HTML

const cardContainer = document.querySelector<HTMLDivElement>(
  ".animals-card-container",
);
const filterItems = document.querySelectorAll<HTMLElement>(".filter-item");

function getCardContainer(): HTMLDivElement {
  if (!cardContainer) {
    throw new Error("Elemento .animals-card-container não encontrado no DOM.");
  }
  return cardContainer;
}

function getStatusSolicitacao(solicitacao: Solicitacao) {
  if (!solicitacao.finalizada) return "pendente";
  if (solicitacao.aprovada && !solicitacao.acolhimento_finalizado)
    return "aprovada";

  if (solicitacao.aprovada && solicitacao.acolhimento_finalizado)
    return "finalizada";

  return "recusada";
}

function getStatusLabel(status: StatusSolicitacao): string {
  const map: Record<StatusSolicitacao, string> = {
    pendente: "Pendente",
    aprovada: "Aprovada",
    recusada: "Recusada",
    finalizada: "Finalizada",
  };
  return map[status];
}

function formatarData(isoDate?: string): string {
  if (!isoDate) return "-";
  const date = new Date(isoDate);
  return date.toLocaleDateString("pt-BR");
}

function renderBotoes(
  solicitacao: Solicitacao,
  status: StatusSolicitacao,
): string {
  if (status === "pendente") {
    return `
      <div class="request-buttons">
        <button class="accept-button" data-id="${solicitacao.id}">Aprovar</button>
        <button class="recuse-button" data-id="${solicitacao.id}">Recusar</button>
      </div>
    `;
  }

  if (status === "aprovada") {
    return `
      <div class="request-buttons">
        <button class="end-reception-button" data-id="${solicitacao.id}">Finalizar acolhimento</button>
      </div>
    `;
  }

  return `<div class="request-buttons"></div>`;
}

function renderCard(solicitacao: Solicitacao): string {
  const status = getStatusSolicitacao(solicitacao);

  const animal = solicitacao.animal || {};
  const voluntario = solicitacao.voluntario || {};

  const nomeAnimal = animal.nome || "Animal";
  const especieAnimal = animal.especie || "-";

  const imagemCapaUrl = animal.imagem_capa?.url
    ? `http://localhost:1337${animal.imagem_capa.url}`
    : "https://via.placeholder.com/120x120?text=Sem+foto";

  const nomeVoluntario = voluntario.nome || "Voluntário";
  const emailVoluntario = voluntario.email || "-";

  const dataFormatada = formatarData(solicitacao.createdAt);

  return `
    <div class="animal-card" data-status="${status}" data-id="${solicitacao.id}">
      <div class="animal-info">
        <img src="${imagemCapaUrl}" alt="Imagem do animal">
        <div class="animal-info-content">
          <h3>${nomeAnimal}</h3>
          <div class="animal-race">
            <i class="fa fa-paw"></i>
            <p>${especieAnimal}</p>
          </div>
        </div>
      </div>
      <div class="voluntar-info">
        <h3>Voluntário</h3>
        <h4>${nomeVoluntario}</h4>
        <p>${emailVoluntario}</p>
      </div>
      <div class="request-date">
        <h3>Data</h3>
        <h4>${dataFormatada}</h4>
      </div>
      <div class="request-state">
        <h3>Status</h3>
        <h4>${getStatusLabel(status)}</h4>
      </div>
      ${renderBotoes(solicitacao, status)}
    </div>
  `;
}

function atualizarContadorPendentes(): void {
  const pendentesCount = todasSolicitacoes.filter(
    (s) => getStatusSolicitacao(s) === "pendente",
  ).length;

  const pendentesFilterEl = document.querySelector<HTMLElement>(
    ".filter-item .request-size",
  );
  if (pendentesFilterEl) {
    pendentesFilterEl.textContent = String(pendentesCount);
  }
}

function renderListaFiltrada(): void {
  const container = getCardContainer();

  let listaFiltrada = todasSolicitacoes;

  if (filtroAtual !== "todas") {
    listaFiltrada = todasSolicitacoes.filter(
      (s) => getStatusSolicitacao(s) === filtroAtual,
    );
  }

  if (listaFiltrada.length === 0) {
    container.innerHTML = `<p class="empty-state">Nenhuma solicitação encontrada para este filtro.</p>`;
    return;
  }

  container.innerHTML = listaFiltrada.map(renderCard).join("");
}

// Api calls
async function buscarSolicitacoes(): Promise<void> {
  const container = getCardContainer();

  try {
    container.innerHTML = `<p class="loading-state">Carregando solicitações...</p>`;

    const response = await fetch(`${API_BASE_URL}/solicitacoes/todas`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      window.location.href = "../html/LoginPage.html";
      return;
    }

    if (!response.ok) {
      throw new Error("Erro ao buscar solicitações.");
    }

    const data: SolicitacoesResponse = await response.json();
    todasSolicitacoes = data.solicitacoes || [];

    atualizarContadorPendentes();
    renderListaFiltrada();
  } catch (err) {
    console.error("Erro ao buscar solicitações:", err);
    container.innerHTML = `<p class="error-state">Não foi possível carregar as solicitações. Tente novamente.</p>`;
  }
}

async function atualizarSolicitacao(
  id: number,
  acao: AcaoSolicitacao,
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/solicitacoes/${id}/${acao}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao ${acao} solicitação.`);
    }

    const index = todasSolicitacoes.findIndex((s) => s.id === id);

    if (index !== -1) {
      const solicitacao = todasSolicitacoes[index];
      if (!solicitacao) return;

      if (acao === "aprovar") {
        solicitacao.aprovada = true;
        solicitacao.finalizada = true;
      }

      if (acao === "recusar") {
        solicitacao.aprovada = false;
        solicitacao.finalizada = true;
      }

      if (acao === "finalizar") {
        solicitacao.acolhimento_finalizado = true;
      }

      todasSolicitacoes[index] = solicitacao;
    }

    atualizarContadorPendentes();
    renderListaFiltrada();
  } catch (err) {
    console.error(`Erro ao ${acao} solicitação:`, err);
    alert("Não foi possível concluir a ação. Tente novamente.");
  }
}

// Events

function configurarEventosCards(): void {
  const container = getCardContainer();

  container.addEventListener("click", (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    const acceptBtn = target.closest<HTMLButtonElement>(".accept-button");
    const recuseBtn = target.closest<HTMLButtonElement>(".recuse-button");
    const endBtn = target.closest<HTMLButtonElement>(".end-reception-button");

    if (acceptBtn?.dataset.id) {
      atualizarSolicitacao(Number(acceptBtn.dataset.id), "aprovar");
      return;
    }

    if (recuseBtn?.dataset.id) {
      atualizarSolicitacao(Number(recuseBtn.dataset.id), "recusar");
      return;
    }

    if (endBtn) {
      atualizarSolicitacao(Number(endBtn.dataset.id), "finalizar");
      return;
    }
  });
}

function configurarFiltros(): void {
  const filtroMap: Record<string, FiltroTipo> = {
    Todas: "todas",
    Pendentes: "pendente",
    Aprovadas: "aprovada",
    Recusadas: "recusada",
    Finalizadas: "finalizada",
  };

  filterItems.forEach((item) => {
    item.addEventListener("click", () => {
      filterItems.forEach((el) => el.classList.remove("filter-item-active"));
      item.classList.add("filter-item-active");

      const textoFiltro = item.textContent.replace(/[0-9]/g, "").trim();

      filtroAtual = filtroMap[textoFiltro] ?? "todas";

      renderListaFiltrada();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  configurarFiltros();
  configurarEventosCards();
  buscarSolicitacoes();
});
