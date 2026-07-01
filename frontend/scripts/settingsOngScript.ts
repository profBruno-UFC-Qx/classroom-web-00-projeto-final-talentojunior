const API_URL_ONG = 'http://localhost:1337/api'

type Notificacoes = {
  solicitacaoEmail: boolean;
  solicitacaoPush: boolean;
  solicitacaoWhatsapp: boolean;

  statusEmail: boolean;
  statusPush: boolean;
  statusWhatsapp: boolean;

  mensagemEmail: boolean;
  mensagemPush: boolean;
  mensagemWhatsapp: boolean;
};

type ImagemPerfil = {
  id: number;
  url: string;
  name?: string;
};
type OngData = {
  id?: number;
  nome: string;
  cnpj: string;
  nome_responsavel: string;
  telefone: string;
  endereco: string;
  bio: string;
  animais_que_trabalha: string[];
  requesitos_minimos: string;
  preferencias_notificacoes: Notificacoes;
  imagem_perfil?: ImagemPerfil;
};

const ongNameInput = document.getElementById("ong-name") as HTMLInputElement;
const ongCnpjInput = document.getElementById("ong-cnpj") as HTMLInputElement;
const ongResponseNameInput = document.getElementById(
  "ong-response-name",
) as HTMLInputElement;
const ongTellInput = document.getElementById("ong-tell") as HTMLInputElement;
const ongAddressInput = document.getElementById(
  "ong-address",
) as HTMLInputElement;
const ongBioInput = document.getElementById("ong-bio") as HTMLTextAreaElement;

const dogCheckbox = document.getElementById("dog") as HTMLInputElement;
const catCheckbox = document.getElementById("cat") as HTMLInputElement;
const otherCheckbox = document.getElementById("other") as HTMLInputElement;

const minimalRequestInput = document.getElementById(
  "minimal-request-voluntar",
) as HTMLInputElement;

const notifyRequestEmail = document.getElementById(
  "notify-request-email",
) as HTMLInputElement;
const notifyRequestPush = document.getElementById(
  "notify-request-push",
) as HTMLInputElement;
const notifyRequestWhatsapp = document.getElementById(
  "notify-request-whatsapp",
) as HTMLInputElement;

const notifyStatusEmail = document.getElementById(
  "notify-status-email",
) as HTMLInputElement;
const notifyStatusPush = document.getElementById(
  "notify-status-push",
) as HTMLInputElement;
const notifyStatusWhatsapp = document.getElementById(
  "notify-status-whatsapp",
) as HTMLInputElement;

const notifyMessageEmail = document.getElementById(
  "notify-message-email",
) as HTMLInputElement;
const notifyMessagePush = document.getElementById(
  "notify-message-push",
) as HTMLInputElement;
const notifyMessageWhatsapp = document.getElementById(
  "notify-message-whatsapp",
) as HTMLInputElement;

const saveButton = document.getElementById(
  "btn-save-changes",
) as HTMLButtonElement;
const discardButton = document.getElementById(
  "btn-discard-changes",
) as HTMLButtonElement;

const userInfoName = document.querySelector(
  ".user-info p",
) as HTMLParagraphElement;

//  Modal elements
const btnChangeImage = document.getElementById(
  "btn-change-image",
) as HTMLButtonElement;
const ongImageModal = document.getElementById(
  "ong-image-modal",
) as HTMLDivElement;
const btnCloseImageModal = document.getElementById(
  "btn-close-image-modal",
) as HTMLButtonElement;
const btnCancelImageModal = document.getElementById(
  "btn-cancel-image-modal",
) as HTMLButtonElement;
const btnSaveImageModal = document.getElementById(
  "btn-save-image-modal",
) as HTMLButtonElement;
const btnSelectImage = document.getElementById(
  "btn-select-image",
) as HTMLButtonElement;
const ongImageInput = document.getElementById(
  "ong-image-input",
) as HTMLInputElement;
const modalImagePreview = document.getElementById(
  "modal-image-preview",
) as HTMLImageElement;
const selectedImageName = document.getElementById(
  "selected-image-name",
) as HTMLParagraphElement;

const ongLogoPreview = document.getElementById(
  "ong-logo-preview",
) as HTMLImageElement;
const topbarOngAvatar = document.getElementById(
  "topbar-ong-avatar",
) as HTMLImageElement;
let selectedProfileImageFile: File | null = null;

let originalOngData: OngData | null = null;

function getToken(): string | null {
  return localStorage.getItem("token");
}

function getImageUrl(url?: string | null): string {
  if (!url) {
    return "https://static.vecteezy.com/system/resources/previews/008/249/343/non_2x/veterinary-logo-cat-and-dog-logo-design-pet-care-vet-clinic-logo-pet-clinic-vector.jpg";
  }

  if (url.startsWith("http")) return url;

  return `http://localhost:1337${url}`;
}

  // logout 
  const logoutLink = document.querySelector(".sidebar-logout .logout, .nav-link.logout");
  logoutLink?.addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("voluntario");
    localStorage.removeItem("ong");
    window.location.href = "../html/LoginPage.html"; 
  });

function openImageModal() {
  if (!ongImageModal) return;

  selectedProfileImageFile = null;
  selectedImageName.textContent = "Nenhuma imagem selecionada";

  const currentImage =
    ongLogoPreview?.getAttribute("src") ||
    topbarOngAvatar?.getAttribute("src") ||
    getImageUrl(originalOngData?.imagem_perfil?.url);

  if (modalImagePreview && currentImage) {
    modalImagePreview.src = currentImage;
  }

  ongImageModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeImageModal() {
  if (!ongImageModal) return;

  ongImageModal.classList.add("hidden");
  document.body.style.overflow = "";
  selectedProfileImageFile = null;
}

function showFeedback(message: string, type: "success" | "error" = "success") {
  let feedback = document.getElementById("settings-feedback");

  if (!feedback) {
    feedback = document.createElement("div");
    feedback.id = "settings-feedback";
    feedback.className = "settings-feedback";
    document.querySelector(".page-buttons")?.prepend(feedback);
  }

  feedback.textContent = message;
  feedback.className = `settings-feedback ${type}`;

  setTimeout(() => {
    if (feedback) feedback.textContent = "";
  }, 3500);
}

function setLoadingOng(isLoading: boolean) {
  saveButton.disabled = isLoading;
  discardButton.disabled = isLoading;

  if (isLoading) {
    saveButton.innerHTML = `
      <i class="bi bi-arrow-repeat"></i>
      Salvando...
    `;
  } else {
    saveButton.innerHTML = `
      <i class="bi bi-floppy"></i>
      Salvar alterações
    `;
  }
}

function getCheckedEspecies(): string[] {
  const especies: string[] = [];

  if (dogCheckbox.checked) especies.push("dog");
  if (catCheckbox.checked) especies.push("cat");
  if (otherCheckbox.checked) especies.push("other");

  return especies;
}

function fillEspecies(especies: string[]) {
  dogCheckbox.checked = especies.includes("dog");
  catCheckbox.checked = especies.includes("cat");
  otherCheckbox.checked = especies.includes("other");
}

function collectFormData(): OngData {
  return {
    nome: ongNameInput.value.trim(),
    cnpj: ongCnpjInput.value.trim(),
    nome_responsavel: ongResponseNameInput.value.trim(),
    telefone: ongTellInput.value.trim(),
    endereco: ongAddressInput.value.trim(),
    bio: ongBioInput.value.trim(),
    animais_que_trabalha: getCheckedEspecies(),
    requesitos_minimos: minimalRequestInput.value.trim(),
    preferencias_notificacoes: {
      solicitacaoEmail: notifyRequestEmail.checked,
      solicitacaoPush: notifyRequestPush.checked,
      solicitacaoWhatsapp: notifyRequestWhatsapp.checked,

      statusEmail: notifyStatusEmail.checked,
      statusPush: notifyStatusPush.checked,
      statusWhatsapp: notifyStatusWhatsapp.checked,

      mensagemEmail: notifyMessageEmail.checked,
      mensagemPush: notifyMessagePush.checked,
      mensagemWhatsapp: notifyMessageWhatsapp.checked,
    },
  };
}

function fillForm(data: OngData) {
  ongNameInput.value = data.nome || "";
  ongCnpjInput.value = data.cnpj || "";
  ongResponseNameInput.value = data.nome_responsavel || "";
  ongTellInput.value = data.telefone || "";
  ongAddressInput.value = data.endereco || "";
  ongBioInput.value = data.bio || "";
  minimalRequestInput.value = data.requesitos_minimos || "";

  fillEspecies(data.animais_que_trabalha || []);

  notifyRequestEmail.checked =
    data.preferencias_notificacoes?.solicitacaoEmail ?? false;
  notifyRequestPush.checked =
    data.preferencias_notificacoes?.solicitacaoPush ?? false;
  notifyRequestWhatsapp.checked =
    data.preferencias_notificacoes?.solicitacaoWhatsapp ?? false;

  notifyStatusEmail.checked =
    data.preferencias_notificacoes?.statusEmail ?? false;
  notifyStatusPush.checked =
    data.preferencias_notificacoes?.statusPush ?? false;
  notifyStatusWhatsapp.checked =
    data.preferencias_notificacoes?.statusWhatsapp ?? false;

  notifyMessageEmail.checked =
    data.preferencias_notificacoes.mensagemEmail ?? false;
  notifyMessagePush.checked =
    data.preferencias_notificacoes.mensagemPush ?? false;
  notifyMessageWhatsapp.checked =
    data.preferencias_notificacoes.mensagemWhatsapp ?? false;

  if (userInfoName) {
    userInfoName.textContent = data.nome || "ONG";
  }

  const imageUrl = getImageUrl(data.imagem_perfil?.url);

  if (ongLogoPreview) {
    ongLogoPreview.src = imageUrl;
  }

  if (topbarOngAvatar) {
    topbarOngAvatar.src = imageUrl;
  }
}

async function fetchOngMe(): Promise<OngData> {
  const token = getToken();

  if (!token) {
    throw new Error("Usuário não autenticado.");
  }

  const response = await fetch(`${API_URL_ONG}/ong/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Erro ao buscar dados da ONG.");
  }

  return data.ong;
}

async function updateOngMe(payload: OngData): Promise<OngData> {
  const token = getToken();

  if (!token) {
    throw new Error("Usuário não autenticado.");
  }

  const response = await fetch(`${API_URL_ONG}/ong/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Erro ao atualizar dados da ONG.");
  }

  return data.ong;
}

async function loadOngData() {
  try {
    setLoadingOng(true);

    const ong = await fetchOngMe();

    originalOngData = ong;
    fillForm(ong);

    localStorage.setItem("ong", JSON.stringify(ong));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao carregar dados da ONG.";

    showFeedback(message, "error");

    if (message.toLowerCase().includes("não autenticado")) {
      setTimeout(() => {
        window.location.href = "../html/LoginPage.html";
      }, 1200);
    }
  } finally {
    setLoadingOng(false);
  }
}

async function handleSaveChanges() {
  try {
    const formData = collectFormData();

    if (!formData.nome) {
      showFeedback("O nome da ONG é obrigatório.", "error");
      return;
    }

    setLoadingOng(true);

    const updatedOng = await updateOngMe(formData);

    originalOngData = updatedOng;
    fillForm(updatedOng);

    localStorage.setItem("ong", JSON.stringify(updatedOng));

    showFeedback("Dados da ONG atualizados com sucesso!", "success");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao salvar alterações.";

    showFeedback(message, "error");
  } finally {
    setLoadingOng(false);
  }
}

function handleDiscardChanges() {
  if (!originalOngData) return;

  fillForm(originalOngData);
  showFeedback("Alterações descartadas.", "success");
}

async function uploadProfileImage(file: File) {
  const token = getToken();

  if (!token) {
    throw new Error("Usuário não autenticado.");
  }

  const formData = new FormData();
  formData.append("imagem", file);

  const response = await fetch(`${API_URL_ONG}/ong/me/upload-profile-image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Erro ao enviar imagem.");
  }

  return data;
}

saveButton?.addEventListener("click", handleSaveChanges);
discardButton?.addEventListener("click", handleDiscardChanges);

document.addEventListener("DOMContentLoaded", () => {
  loadOngData();
});

btnChangeImage?.addEventListener("click", openImageModal);
btnCloseImageModal?.addEventListener("click", closeImageModal);
btnCancelImageModal?.addEventListener("click", closeImageModal);

btnSelectImage?.addEventListener("click", () => {
  ongImageInput?.click();
});

ongImageInput?.addEventListener("change", (event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
  if (!allowedTypes.includes(file.type)) {
    showFeedback("Selecione uma imagem PNG ou JPG.", "error");
    target.value = "";
    return;
  }

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    showFeedback("A imagem deve ter no máximo 5MB.", "error");
    target.value = "";
    return;
  }

  selectedProfileImageFile = file;
  selectedImageName.textContent = file.name;

  const previewUrl = URL.createObjectURL(file);
  modalImagePreview.src = previewUrl;
});

btnSaveImageModal?.addEventListener("click", async () => {
  try {
    if (!selectedProfileImageFile) {
      showFeedback("Selecione uma imagem antes de salvar.", "error");
      return;
    }

    btnSaveImageModal.disabled = true;
    btnSaveImageModal.innerHTML = `
      <i class="bi bi-arrow-repeat"></i>
      Enviando...
    `;

    const result = await uploadProfileImage(selectedProfileImageFile);

    const imageUrl = getImageUrl(result?.imagem_perfil?.url);

    if (ongLogoPreview) {
      ongLogoPreview.src = imageUrl;
    }

    if (topbarOngAvatar) {
      topbarOngAvatar.src = imageUrl;
    }

    await loadOngData();

    showFeedback("Imagem da ONG atualizada com sucesso!", "success");
    closeImageModal();
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erro ao atualizar imagem da ONG.";

    showFeedback(message, "error");
  } finally {
    btnSaveImageModal.disabled = false;
    btnSaveImageModal.innerHTML = `
      <i class="bi bi-cloud-upload"></i>
      Salvar imagem
    `;
  }
});
