export {};

const API_URL_ANIMALS = "http://localhost:1337/api";
const token = localStorage.getItem("token");
const ongRaw = localStorage.getItem("ong");

if (!token || !ongRaw) {
  window.location.href = "../html/LoginPage.html";
}

function getImageUrlAnimal(url?: string) {
  if (!url) {
    return "https://via.placeholder.com/60x60?text=Sem+Foto";
  }

  if (url.startsWith("http")) {
    return url;
  }

  return `http://localhost:1337${url}`;
}

const tbody = document.getElementById(
  "animals-table-body",
) as HTMLTableSectionElement | null;
const searchInput = document.querySelector(
  ".search-input",
) as HTMLInputElement | null;
const filterButtons = document.querySelectorAll(".btn-filter");
const statusSelect = document.getElementById(
  "status",
) as HTMLSelectElement | null;

let todosOsAnimais: any[] = [];
let especieSelecionada: string = "Todos";

function getStatusClass(status: string) {
  switch (status) {
    case "Disponível":
      return "animal-state-available";
    case "Em lar temporário":
      return "animal-state-in-home";
    case "Adotado":
      return "animal-state-adopted";
    default:
      return "animal-state-available";
  }
}

function renderizarTabela(animaisParaExibir: any[]) {
  if (!tbody) return;

  if (!animaisParaExibir.length) {
    tbody.innerHTML = `
        <tr>
            <td colspan="6" style="text-align: center;">
                Nenhum animal correspondente aos filtros foi encontrado.
            </td>
        </tr>
    `;
    return;
  }

  tbody.innerHTML = "";

  animaisParaExibir.forEach((animal) => {
    const tr = document.createElement("tr");
    const imagem = getImageUrlAnimal(animal.imagem_capa?.url);

    tr.innerHTML = `
        <td data-label="Foto + Nome">
            <div class="animal-apresentation">
                <img src="${imagem}" alt="${animal.nome}">
                <h3>${animal.nome}</h3>
            </div>
        </td>
        <td data-label="Espécie">
            ${animal.especie ?? "-"}
        </td>
        <td data-label="Idade">
            ${animal.idade ?? "-"} anos
        </td>
        <td data-label="Porte">
            ${animal.porte ?? "-"}
        </td>
        <td data-label="Status">
            <span class="animal-state ${getStatusClass(animal.status_do_animal)}">
                ${animal.status_do_animal}
            </span>
        </td>
        <td data-label="Solicitações">
            <span class="solicitations">
                ${animal.totalSolicitacoes ?? 0}
            </span>
        </td>
    `;
    tbody.appendChild(tr);
  });
}

function aplicarFiltros() {
  const buscaNome = searchInput?.value.toLowerCase().trim() ?? "";
  const statusSelecionado = statusSelect?.value ?? "all";

  const animaisFiltrados = todosOsAnimais.filter((animal) => {
    const nomeBate = animal.nome?.toLowerCase().includes(buscaNome);
    let especieBate = true;
    if (especieSelecionada === "Cães") {
      especieBate =
        animal.especie?.toLowerCase() === "cachorro" ||
        animal.especie?.toLowerCase() === "cão";
    } else if (especieSelecionada === "Gatos") {
      especieBate = animal.especie?.toLowerCase() === "gato";
    }

    let statusBate = true;
    if (statusSelecionado !== "all") {
      if (statusSelecionado === "available")
        statusBate = animal.status_do_animal === "Disponível";
      if (statusSelecionado === "urgent")
        statusBate = animal.status_do_animal === "Em lar temporário";
      if (statusSelecionado === "adopted")
        statusBate = animal.status_do_animal === "Adotado";
    }

    return nomeBate && especieBate && statusBate;
  });

  renderizarTabela(animaisFiltrados);
}

function configurarEventosDeFiltro() {
  searchInput?.addEventListener("input", () => {
    aplicarFiltros();
  });
  statusSelect?.addEventListener("change", () => {
    aplicarFiltros();
  });
  filterButtons.forEach((botao) => {
    botao.addEventListener("click", (e) => {
      filterButtons.forEach((b) => b.classList.remove("active"));

      const target = e.currentTarget as HTMLButtonElement;
      target.classList.add("active");

      especieSelecionada = target.innerText.trim();
      aplicarFiltros();
    });
  });
}

async function carregarAnimaisDaOng() {
  if (!tbody) return;

  tbody.innerHTML = `
        <tr>
            <td colspan="6">Carregando animais...</td>
        </tr>
    `;

  try {
    const response = await fetch(`${API_URL_ANIMALS}/animals/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      tbody.innerHTML = `
                <tr>
                    <td colspan="6">
                        ${data?.error?.message ?? "Erro ao carregar animais."}
                    </td>
                </tr>
            `;
      return;
    }

    todosOsAnimais = data.animals as any[];

    aplicarFiltros();
  } catch (error) {
    console.log(error);
    tbody.innerHTML = `
            <tr>
                <td colspan="6">
                    Erro ao conectar ao servidor.
                </td>
            </tr>
        `;
  }
}
document.addEventListener("DOMContentLoaded", () => {
  carregarAnimaisDaOng();
  configurarEventosDeFiltro();
});
