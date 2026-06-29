export {}; 

const token = localStorage.getItem("token");
const ongRaw = localStorage.getItem("ong");

if (!token || !ongRaw) {
  window.location.href = "../LoginPage.html";
} else {
  const ong = JSON.parse(ongRaw) as {
    id: number;
    nome: string;
    cnpj: string;
    nome_responsavel: string;
    telefone: string;
    endereco: string;
    bio: string;
  };


async function carregarAnimaisDaOng() {
  const animalsGrid = document.querySelector(".animals-grid") as HTMLElement | null;
  if (!animalsGrid) return;

  animalsGrid.innerHTML = "<p>Carregando animais...</p>";

  try {
    const response = await fetch("http://localhost:1337/api/animals/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (!response.ok) {
      animalsGrid.innerHTML = `<p>${data?.error?.message || "Erro ao carregar animais."}</p>`;
      return;
    }

    const animals = data.animals as any[];

    // atualiza os cards de estatística com dados reais
    const statsValues = document.querySelectorAll(".stats-value");
    if (statsValues[0]) statsValues[0].textContent = String(animals.length);
    if (statsValues[1]) {
      statsValues[1].textContent = String(animals.filter((a) => a.disponivel).length);
    }

    if (!animals.length) {
      animalsGrid.innerHTML = "<p>Você ainda não cadastrou nenhum animal.</p>";
      return;
    }

    animalsGrid.innerHTML = "";

    animals.forEach((animal) => {
      const card = document.createElement("div");
      card.className = "animal-card";

      const imagemUrl = animal.imagem_capa?.url
        ? `http://localhost:1337${animal.imagem_capa.url}`
        : "";

      card.innerHTML = `
        <div class="animal-image-wrapper">
          <div class="animal-state-indicator">
            <span>${animal.disponivel ? "Disponível" : "Indisponível"}</span>
          </div>
          ${imagemUrl ? `<img src="${imagemUrl}" alt="Foto de ${animal.nome}" />` : ""}
        </div>
        <div class="animal-card-content">
          <div class="animals-info">
            <div class="animals-info-content">
              <h3>${animal.nome}</h3>
              <div class="animal-age">
                <i class="bi bi-calendar-fill"></i>
                <span>${animal.idade ?? "-"} anos</span>
              </div>
            </div>
            <div class="animal-actions">
              <button class="btn-edit" type="button" aria-label="Editar" data-id="${animal.id}">
                <i class="bi bi-pencil-fill"></i>
              </button>
              <button class="btn-delete" type="button" aria-label="Excluir" data-id="${animal.id}">
                <i class="bi bi-trash-fill"></i>
              </button>
            </div>
          </div>
        </div>
      `;

      animalsGrid.appendChild(card);
    });

    // exclusão real, usando o endpoint que já existe
    animalsGrid.querySelectorAll<HTMLButtonElement>(".btn-delete").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        if (!confirm("Tem certeza que deseja excluir este animal?")) return;

        try {
          const delResponse = await fetch(`http://localhost:1337/api/animals/${id}/me`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!delResponse.ok) {
            const delData = await delResponse.json();
            alert(delData?.error?.message || "Erro ao excluir.");
            return;
          }

          carregarAnimaisDaOng(); // recarrega a lista
        } catch {
          alert("Erro ao conectar ao servidor.");
        }
      });
    });
  } catch (err) {
    animalsGrid.innerHTML = "<p>Erro ao conectar ao servidor.</p>";
  }
}

carregarAnimaisDaOng();

async function carregarSolicitacoesPendentes() {
  const listContainer = document.querySelector(".animals-request-list") as HTMLElement | null;
  if (!listContainer) return;

  listContainer.innerHTML = "<p>Carregando...</p>";

  try {
    const response = await fetch("http://localhost:1337/api/solicitacoes/pendentes", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (!response.ok) {
      listContainer.innerHTML = `<p>${data?.error?.message || "Erro ao carregar solicitações."}</p>`;
      return;
    }

    const solicitacoes = data.solicitacoes as any[];

    // atualiza o card de estatística "Solicitações Pendentes"
    const statsValues = document.querySelectorAll(".stats-value");
    if (statsValues[2]) statsValues[2].textContent = String(solicitacoes.length);

    if (!solicitacoes.length) {
      listContainer.innerHTML = "<p>Nenhuma solicitação pendente.</p>";
      return;
    }

    listContainer.innerHTML = "";

    solicitacoes.forEach((sol) => {
      const animal = sol.animal;
      const voluntario = sol.voluntario;

      const imagemUrl = animal?.imagem_capa?.url
        ? `http://localhost:1337${animal.imagem_capa.url}`
        : "";

      const card = document.createElement("div");
      card.className = "request-animal-card";

      card.innerHTML = `
        <div class="request-animal-info">
          ${imagemUrl ? `<img src="${imagemUrl}" alt="Foto de ${animal?.nome}" class="request-aniaml-image">` : ""}
          <div class="request-animal-info-content">
            <h4>${animal?.nome ?? "Animal removido"}</h4>
            <p>Candidato: ${voluntario?.nome ?? "-"}</p>
          </div>
        </div>
        <div class="request-animal-actions">
          <button class="btn-approve" type="button" data-id="${sol.id}">Aprovar</button>
          <button class="btn-reject" type="button" data-id="${sol.id}">Recusar</button>
        </div>
      `;

      listContainer.appendChild(card);
    });

    listContainer.querySelectorAll<HTMLButtonElement>(".btn-approve").forEach((btn) => {
      btn.addEventListener("click", () => responderSolicitacao(btn.dataset.id!, "aprovar"));
    });

    listContainer.querySelectorAll<HTMLButtonElement>(".btn-reject").forEach((btn) => {
      btn.addEventListener("click", () => responderSolicitacao(btn.dataset.id!, "recusar"));
    });
  } catch (err) {
    listContainer.innerHTML = "<p>Erro ao conectar ao servidor.</p>";
  }
}

async function responderSolicitacao(id: string, acao: "aprovar" | "recusar") {
  try {
    const response = await fetch(`http://localhost:1337/api/solicitacoes/${id}/${acao}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const data = await response.json();
      alert(data?.error?.message || "Erro ao responder solicitação.");
      return;
    }

    carregarSolicitacoesPendentes();
    carregarAnimaisDaOng(); // atualiza disponibilidade do animal também
  } catch {
    alert("Erro ao conectar ao servidor.");
  }
}

carregarSolicitacoesPendentes();

  const welcomeTitle = document.querySelector(".welcome-section h2");
  if (welcomeTitle) {
    welcomeTitle.textContent = `Olá, ${ong.nome} 👋`;
  }

  const userInfoParagraph = document.querySelector(".user-info p");
  if (userInfoParagraph) {
    userInfoParagraph.textContent = ong.nome;
  }

  const logoutLink = document.querySelector(".sidebar-logout .logout");
  logoutLink?.addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("ong");
    localStorage.removeItem("voluntario");
    window.location.href = "../html/LoginPage.html";// ajuste o caminho relativo conforme sua estrutura de pastas
  });
}

// Animals Requests Sidebar Toggle
const toggleRequestsBtn = document.querySelector(
  ".btn-toggle-requests",
) as HTMLButtonElement;
const requestsSidebar = document.querySelector(
  ".animals-request-side-bar",
) as HTMLElement;
const requestsOverlay = document.querySelector(
  ".animals-requests-overlay",
) as HTMLElement;
const closeRequestsBtn = document.querySelector(
  ".btn-close-requests",
) as HTMLButtonElement;

if (toggleRequestsBtn) {
  toggleRequestsBtn.addEventListener("click", () => {
    requestsSidebar.classList.toggle("active");
    requestsOverlay.classList.toggle("active");
  });
}

if (closeRequestsBtn) {
  closeRequestsBtn.addEventListener("click", () => {
    requestsSidebar.classList.remove("active");
    requestsOverlay.classList.remove("active");
  });
}

if (requestsOverlay) {
  requestsOverlay.addEventListener("click", () => {
    requestsSidebar.classList.remove("active");
    requestsOverlay.classList.remove("active");
  });
}
