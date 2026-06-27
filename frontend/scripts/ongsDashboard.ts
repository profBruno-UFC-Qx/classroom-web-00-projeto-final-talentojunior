export {}; // mantém o arquivo como módulo isolado

// --- proteção de rota + dados da ONG ---

const token = localStorage.getItem("token");
const ongRaw = localStorage.getItem("ong");

if (!token || !ongRaw) {
  window.location.href = "../LoginPage.html"; // ajuste o caminho relativo conforme sua estrutura de pastas
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
