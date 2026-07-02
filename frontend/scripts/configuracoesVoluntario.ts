export { };

const API_URL = "http://localhost:1337/api";

type ImagemPerfil = {
  id: number;
  url: string;
  name?: string;
};

type VoluntarioData = {
  id: number;
  nome: string;
  email: string;
  cidade: string;
  descricao: string;
  aceita_cachorro: boolean;
  aceita_gato: boolean;
  porte_maximo: string;
  imagem_perfil: ImagemPerfil | null;
  possui_animais: boolean;
  notificacoes_email: boolean;
  notificacoes_push: boolean;
  notificacoes_whatsapp: boolean;
};

function porteParaEnum(texto: string): string {
  if (texto.startsWith("Pequeno")) return "pequeno";
  if (texto.startsWith("Médio")) return "medio";
  if (texto.startsWith("Grande")) return "grande";
  return "gigante";
}

function getToken(): string | null {
  return localStorage.getItem("token");
}

function getImageUrl(url?: string | null): string {
  if (!url) return "../assets/usuario_perfil.png";
  if (url.startsWith("http")) return url;
  return `http://localhost:1337${url}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const token = getToken();

  if (!token) {
    window.location.href = "LoginPage.html";
    return;
  }

  const nomeInput = document.getElementById("nome") as HTMLInputElement;
  const cidadeInput = document.getElementById("cidade") as HTMLInputElement;
  const bioInput = document.getElementById("bio") as HTMLTextAreaElement;
  const porteSelect = document.getElementById("porte") as HTMLSelectElement;
  const caesCheckbox = document.querySelector(".species-card:nth-child(1) input") as HTMLInputElement;
  const gatosCheckbox = document.querySelector(".species-card:nth-child(2) input") as HTMLInputElement;
  const userSectionSpan = document.querySelector(".user-section span");
  const avatarImg = document.querySelector(".avatar-wrapper img") as HTMLImageElement | null;
  const topbarAvatar = document.querySelector(".user-avatar") as HTMLImageElement | null;

  const menuButton = document.querySelector<HTMLButtonElement>(".btn-menu");
  const sidebarOverlay = document.getElementById("sidebar-overlay");
  const sidebarLinks = document.querySelectorAll<HTMLAnchorElement>(".sidebar .nav-link");
  const speciesCards = document.querySelectorAll<HTMLLabelElement>(".species-card");
  const settingsForm = document.querySelector<HTMLFormElement>(".settings-form");
  const submitButton = document.querySelector<HTMLButtonElement>(".btn-submit");
  
  const possuiAnimais = document.querySelector(
    ".toggle-label input",
  ) as HTMLInputElement;

  const notificacoes = document.querySelectorAll(".notification-item input");

  const emailNotif = notificacoes[0] as HTMLInputElement;
  const pushNotif = notificacoes[1] as HTMLInputElement;
  const whatsappNotif = notificacoes[2] as HTMLInputElement;

  const imageModal = document.getElementById("voluntario-image-modal") as HTMLElement;
  const modalOverlay = imageModal.querySelector(".image-modal-backdrop") as HTMLElement;
  const btnOpenModal = document.querySelector(".btn-avatar-edit") as HTMLButtonElement | null;
  const btnCloseModal = document.getElementById("btn-close-image-modal") as HTMLButtonElement;
  const btnCancelModal = document.getElementById("btn-cancel-image-modal") as HTMLButtonElement;
  const btnSaveModal = document.getElementById("btn-save-image-modal") as HTMLButtonElement;
  const btnSelectImage = document.getElementById("btn-select-image") as HTMLButtonElement;
  const imageInput = document.getElementById("voluntario-image-input") as HTMLInputElement;
  const modalPreview = document.getElementById("modal-image-preview") as HTMLImageElement;
  const selectedImageName = document.getElementById("selected-image-name") as HTMLParagraphElement;

  
  let selectedFile: File | null = null;
  let originalVoluntarioData: VoluntarioData | null = null;

  function fillForm(data: VoluntarioData) {
    nomeInput.value = data.nome;
    cidadeInput.value = data.cidade;
    bioInput.value = data.descricao || "";
    porteSelect.value =
      data.porte_maximo === "pequeno" ? "Pequeno (até 10kg)" :
        data.porte_maximo === "medio" ? "Médio (até 20kg)" :
          data.porte_maximo === "grande" ? "Grande (até 40kg)" : "Gigante (acima de 40kg)";
    caesCheckbox.checked = data.aceita_cachorro ?? false;
    gatosCheckbox.checked = data.aceita_gato ?? false;
    caesCheckbox.closest(".species-card")?.classList.toggle("active", caesCheckbox.checked);
    gatosCheckbox.closest(".species-card")?.classList.toggle("active", gatosCheckbox.checked);
    possuiAnimais.checked = data.possui_animais;
    emailNotif.checked = data.notificacoes_email;
    pushNotif.checked = data.notificacoes_push;
    whatsappNotif.checked = data.notificacoes_whatsapp;
    
    if (userSectionSpan) userSectionSpan.textContent = data.nome;

    const imageUrl = getImageUrl(data.imagem_perfil?.url);
    if (avatarImg) avatarImg.src = imageUrl;
    if (topbarAvatar) topbarAvatar.src = imageUrl;
  }

  async function fetchVoluntarioMe(): Promise<VoluntarioData> {
    const authToken = getToken();

    if (!authToken) {
      throw new Error("Usuário não autenticado.");
    }

    const response = await fetch(`${API_URL}/voluntarios/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message || "Erro ao buscar dados do voluntário.");
    }

    return data.voluntario;
  }

  async function loadVoluntarioData() {
    try {
      const voluntario = await fetchVoluntarioMe();
      originalVoluntarioData = voluntario;
      fillForm(voluntario);
      localStorage.setItem("voluntario", JSON.stringify(voluntario));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao carregar dados.";

      if (message.toLowerCase().includes("não autenticado")) {
        window.location.href = "LoginPage.html";
        return;
      }

      const voluntarioRaw = localStorage.getItem("voluntario");
      if (voluntarioRaw) {
        const voluntario = JSON.parse(voluntarioRaw) as VoluntarioData;
        originalVoluntarioData = voluntario;
        fillForm(voluntario);
      } else {
        alert(message);
      }
    }
  }

  async function uploadProfileImage(file: File) {
    const authToken = getToken();

    if (!authToken) {
      throw new Error("Usuário não autenticado.");
    }

    const formData = new FormData();
    formData.append("imagem", file);

    const response = await fetch(`${API_URL}/voluntarios/me/upload-profile-image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message || "Erro ao enviar imagem.");
    }

    return data;
  }

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

  function openImageModal() {
    selectedFile = null;
    selectedImageName.textContent = "Nenhuma imagem selecionada";
    modalPreview.src = avatarImg?.src || getImageUrl(originalVoluntarioData?.imagem_perfil?.url);
    imageModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeImageModal() {
    imageModal.classList.add("hidden");
    document.body.style.overflow = "";
    selectedFile = null;
    imageInput.value = "";
  }

  const logoutLink = document.querySelector(".sidebar-logout .logout, .nav-link.logout");
  logoutLink?.addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("voluntario");
    localStorage.removeItem("ong");
    window.location.href = "../html/LoginPage.html";
  });

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
      const response = await fetch(`${API_URL}/voluntarios/me`, {
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
          possui_animais: possuiAnimais.checked,
          notificacoes_email: emailNotif.checked,
          notificacoes_push: pushNotif.checked,
          notificacoes_whatsapp: whatsappNotif.checked,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error?.message || "Erro ao salvar.");
      }

      originalVoluntarioData = data.voluntario;
      fillForm(data.voluntario);
      localStorage.setItem("voluntario", JSON.stringify(data.voluntario));

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

  btnOpenModal?.addEventListener("click", openImageModal);
  btnCloseModal.addEventListener("click", closeImageModal);
  btnCancelModal.addEventListener("click", closeImageModal);
  modalOverlay.addEventListener("click", closeImageModal);

  btnSelectImage.addEventListener("click", () => imageInput.click());

  imageInput.addEventListener("change", () => {
    const file = imageInput.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      alert("Selecione uma imagem PNG ou JPG.");
      imageInput.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("A imagem deve ter no máximo 5MB.");
      imageInput.value = "";
      return;
    }

    selectedFile = file;
    selectedImageName.textContent = file.name;
    modalPreview.src = URL.createObjectURL(file);
  });

  btnSaveModal.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!selectedFile) {
      alert("Selecione uma imagem antes de salvar.");
      return;
    }

    const originalBtnContent = btnSaveModal.innerHTML;
    btnSaveModal.disabled = true;
    btnSaveModal.innerHTML = '<i class="bi bi-arrow-repeat"></i> Enviando...';

    try {
      const result = await uploadProfileImage(selectedFile);
      const imageUrl = getImageUrl(result?.imagem_perfil?.url);

      if (avatarImg) avatarImg.src = imageUrl;
      if (topbarAvatar) topbarAvatar.src = imageUrl;

      await loadVoluntarioData();

      closeImageModal();
      alert("Foto de perfil atualizada com sucesso!");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro ao atualizar imagem de perfil.");
    } finally {
      btnSaveModal.disabled = false;
      btnSaveModal.innerHTML = originalBtnContent;
    }
  });

  loadVoluntarioData();
});
