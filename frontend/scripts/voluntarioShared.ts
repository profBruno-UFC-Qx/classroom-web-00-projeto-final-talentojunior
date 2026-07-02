export const API_URL = "http://localhost:1337/api";

export type StatusSolicitacao = "pendente" | "aprovada" | "recusada" | "finalizada";

export type ImagemPerfil = {
  id: number;
  url: string;
  name?: string;
};

export type VoluntarioData = {
  id: number;
  nome: string;
  email: string;
  cidade: string;
  descricao?: string;
  imagem_perfil?: ImagemPerfil | null;
};

export type AnimalData = {
  id?: number;
  nome?: string;
  especie?: string;
  porte?: string;
  sobre?: string;
  localizacao?: string;
  createdAt?: string;
  imagem_capa?: { url?: string };
  ong?: { nome?: string };
};

export type SolicitacaoData = {
  id: number;
  aprovada: boolean;
  finalizada: boolean;
  acolhimento_finalizado: boolean;
  createdAt?: string;
  animal?: AnimalData;
};

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function getImageUrl(url?: string | null): string {
  if (!url) return "../assets/usuario_perfil.png";
  if (url.startsWith("http")) return url;
  return `${API_URL.replace("/api", "")}${url}`;
}

export function getAnimalImageUrl(animal?: AnimalData): string {
  const url = animal?.imagem_capa?.url;
  if (!url) return "../assets/dog-1.png";
  if (url.startsWith("http")) return url;
  return `${API_URL.replace("/api", "")}${url}`;
}

export function getStatusSolicitacao(solicitacao: SolicitacaoData): StatusSolicitacao {
  if (!solicitacao.finalizada) return "pendente";
  if (solicitacao.aprovada && !solicitacao.acolhimento_finalizado) return "aprovada";
  if (solicitacao.aprovada && solicitacao.acolhimento_finalizado) return "finalizada";
  return "recusada";
}

export function statusParaFiltro(status: StatusSolicitacao): string {
  const map: Record<StatusSolicitacao, string> = {
    pendente: "pendentes",
    aprovada: "aprovadas",
    recusada: "recusadas",
    finalizada: "finalizadas",
  };
  return map[status];
}

export function getStatusLabel(status: StatusSolicitacao): string {
  const map: Record<StatusSolicitacao, string> = {
    pendente: "Pendente",
    aprovada: "Aprovado",
    recusada: "Recusado",
    finalizada: "Finalizado",
  };
  return map[status];
}

export function getStatusBadgeClass(status: StatusSolicitacao): string {
  const map: Record<StatusSolicitacao, string> = {
    pendente: "pending",
    aprovada: "approved",
    recusada: "rejected",
    finalizada: "finished",
  };
  return map[status];
}

export function formatarData(isoDate?: string, long = false): string {
  if (!isoDate) return "-";
  const date = new Date(isoDate);
  if (long) {
    return date.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
  }
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatarEspecie(especie?: string): string {
  if (!especie) return "-";
  const map: Record<string, string> = {
    cachorro: "Cachorro",
    gato: "Gato",
    dog: "Cachorro",
    cat: "Gato",
  };
  return map[especie.toLowerCase()] || especie;
}

export function formatarPorte(porte?: string): string {
  if (!porte) return "-";
  const map: Record<string, string> = {
    pequeno: "Pequeno",
    medio: "Médio",
    grande: "Grande",
    gigante: "Gigante",
  };
  return map[porte.toLowerCase()] || porte;
}

export function getUrgenciaAnimal(createdAt?: string): "nova" | "urgente" | "normal" {
  if (!createdAt) return "normal";
  const diffDays = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays <= 5) return "nova";
  if (diffDays >= 10) return "urgente";
  return "normal";
}

export function tempoRelativo(createdAt?: string): string {
  if (!createdAt) return "";
  const diffDays = Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "Hoje";
  if (diffDays === 1) return "1 dia atrás";
  return `${diffDays} dias atrás`;
}

export async function fetchVoluntarioMe(): Promise<VoluntarioData> {
  const token = getToken();
  if (!token) throw new Error("Usuário não autenticado.");

  const response = await fetch(`${API_URL}/voluntarios/me`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || "Erro ao buscar dados do voluntário.");
  }

  return data.voluntario;
}

export async function fetchMinhasSolicitacoes(): Promise<SolicitacaoData[]> {
  const token = getToken();
  if (!token) throw new Error("Usuário não autenticado.");

  const response = await fetch(`${API_URL}/solicitacoes/minhas`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || "Erro ao buscar solicitações.");
  }

  return data.solicitacoes || [];
}

export async function fetchAnimaisDisponiveis(): Promise<AnimalData[]> {
  const token = getToken();
  if (!token) throw new Error("Usuário não autenticado.");

  const response = await fetch(`${API_URL}/animals/disponiveis`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || "Erro ao buscar oportunidades.");
  }

  return data.animals || [];
}

export function aplicarPerfilVoluntario(voluntario: VoluntarioData): void {
  const avatar = document.querySelector<HTMLImageElement>(".user-avatar");
  const imageUrl = getImageUrl(voluntario.imagem_perfil?.url);
  if (avatar) avatar.src = imageUrl;

  const userInfoParagraphs = document.querySelectorAll(".user-info p");
  if (userInfoParagraphs[0]) userInfoParagraphs[0].textContent = voluntario.nome;
  if (userInfoParagraphs[1]) userInfoParagraphs[1].textContent = voluntario.cidade;

  const userSectionSpan = document.querySelector(".user-section span");
  if (userSectionSpan) userSectionSpan.textContent = voluntario.nome;

  localStorage.setItem("voluntario", JSON.stringify(voluntario));
}

export function setupLogout(): void {
  const logoutLink = document.querySelector(".sidebar-logout .logout, .nav-link.logout");
  logoutLink?.addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("voluntario");
    localStorage.removeItem("ong");
    window.location.href = "LoginPage.html";
  });
}

export function setupSidebar(): void {
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
    if (document.body.classList.contains("sidebar-open")) closeSidebar();
    else openSidebar();
  });

  sidebarOverlay?.addEventListener("click", closeSidebar);
  sidebarLinks.forEach((link) => link.addEventListener("click", closeSidebar));

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) closeSidebar();
  });
}
