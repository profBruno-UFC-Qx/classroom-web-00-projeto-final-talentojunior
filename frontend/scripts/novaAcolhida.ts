export {};

const API_URL = "http://localhost:1337/api";

document.addEventListener("DOMContentLoaded", () => {
  const btnOpen = document.querySelector(".btn-nova-acolhida") as HTMLButtonElement | null;
  const modal = document.getElementById("nova-acolhida-modal") as HTMLElement | null;
  const btnClose = document.getElementById("close-acolhida-modal") as HTMLButtonElement | null;
  const overlay = modal?.querySelector(".acolhida-modal-overlay") as HTMLElement | null;
  const listContainer = document.getElementById("animais-disponiveis-list") as HTMLElement | null;

  if (!btnOpen || !modal || !listContainer) return;

  function closeModal() {
    modal!.classList.add("hidden");
    document.body.style.overflow = "";
  }

  function openModal() {
    modal!.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    carregarAnimaisDisponiveis();
  }

  btnOpen.addEventListener("click", openModal);
  btnClose?.addEventListener("click", closeModal);
  overlay?.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  async function carregarAnimaisDisponiveis() {
    listContainer!.innerHTML = "<p>Carregando...</p>";

    const token = localStorage.getItem("token");
    if (!token) {
      listContainer!.innerHTML = "<p>Você precisa estar logado.</p>";
      return;
    }

    try {
      const response = await fetch(`${API_URL}/animals/disponiveis`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok) {
        listContainer!.innerHTML = `<p>${data?.error?.message || "Erro ao carregar animais."}</p>`;
        return;
      }

      if (!data.animals.length) {
        listContainer!.innerHTML = "<p>Nenhum animal disponível no momento.</p>";
        return;
      }

      listContainer!.innerHTML = "";

      data.animals.forEach((animal: any) => {
        const card = document.createElement("div");
        card.className = "acolhida-animal-card";

        const imagemUrl = animal.imagem_capa?.url
          ? `http://localhost:1337${animal.imagem_capa.url}`
          : "../assets/placeholder-animal.png"; 

        card.innerHTML = `
          <img src="${imagemUrl}" alt="${animal.nome}" />
          <div class="acolhida-animal-info">
            <h4>${animal.nome}</h4>
            <p>${animal.especie || ""} • ${animal.porte || ""}</p>
            <p class="acolhida-animal-ong">${animal.ong?.nome || ""}</p>
            <button class="btn-solicitar" data-id="${animal.id}">Solicitar</button>
          </div>
        `;

        listContainer!.appendChild(card);
      });

      listContainer!.querySelectorAll<HTMLButtonElement>(".btn-solicitar").forEach((btn) => {
        btn.addEventListener("click", () => solicitarAnimal(btn));
      });
    } catch (err) {
      listContainer!.innerHTML = "<p>Erro ao conectar ao servidor.</p>";
    }
  }

  async function solicitarAnimal(btn: HTMLButtonElement) {
    const animalId = btn.dataset.id;
    const token = localStorage.getItem("token");

    btn.disabled = true;
    btn.textContent = "Enviando...";

    try {
      const response = await fetch(`${API_URL}/solicitacoes/solicitar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ animalId: Number(animalId) }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data?.error?.message || "Erro ao solicitar acolhida.");
        btn.disabled = false;
        btn.textContent = "Solicitar";
        return;
      }

      btn.textContent = "Solicitado!";
      alert("Solicitação enviada com sucesso!");
    } catch (err) {
      alert("Erro ao conectar ao servidor.");
      btn.disabled = false;
      btn.textContent = "Solicitar";
    }
  }
});