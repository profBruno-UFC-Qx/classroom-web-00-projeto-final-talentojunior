const API_URL_ANIMAL = "http://localhost:1337/api";

const modal = document.getElementById("add-animal-modal") as HTMLElement;
const btnOpen = document.querySelector(".btn-new-animal") as HTMLButtonElement;
const btnClose = document.getElementById(
  "close-animal-modal",
) as HTMLButtonElement;
const btnCancel = document.getElementById("cancel-animal") as HTMLButtonElement;
const overlayAnimal = document.querySelector(
  ".animal-modal-overlay",
) as HTMLElement;

btnOpen.addEventListener("click", () => {
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
});

function closeModal() {
  modal.classList.add("hidden");
  document.body.style.overflow = "";
}

btnClose.addEventListener("click", closeModal);
btnCancel.addEventListener("click", closeModal);
overlayAnimal.addEventListener("click", closeModal);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
  }
});

const steps = document.querySelectorAll(".animal-step");
const progress = document.querySelectorAll(".step");

const btnNext = document.getElementById("next-step") as HTMLButtonElement;
const btnPrev = document.getElementById("prev-step") as HTMLButtonElement;
const btnSave = document.getElementById("save-animal") as HTMLButtonElement;

let currentStep = 0;

function updateStep() {
  steps.forEach((step, index) => {
    step.classList.toggle("active", index === currentStep);
  });

  progress.forEach((step, index) => {
    step.classList.toggle("active", index <= currentStep);
  });

  btnPrev.style.display = currentStep === 0 ? "none" : "inline-block";

  if (currentStep === steps.length - 1) {
    btnNext.style.display = "none";
    btnSave.style.display = "inline-block";
    generateSummary();
  } else {
    btnNext.style.display = "inline-block";
    btnSave.style.display = "none";
  }
}

btnNext.addEventListener("click", () => {
  if (currentStep < steps.length - 1) {
    currentStep++;
    updateStep();
  }
});

btnPrev.addEventListener("click", () => {
  if (currentStep > 0) {
    currentStep--;
    updateStep();
  }
});

updateStep();

const capaInput = document.getElementById("imagem_capa") as HTMLInputElement;
const capaPreview = document.getElementById("preview-capa") as HTMLElement;

capaInput.addEventListener("change", () => {
  capaPreview.innerHTML = "";

  if (!capaInput.files?.length) return;

  const file = capaInput.files[0];

  if (file && file instanceof Blob) {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    capaPreview.appendChild(img);
  }
});

const galleryFiles: File[] = [];

const galleryInput = document.getElementById("imagens") as HTMLInputElement;
const galleryPreview = document.getElementById(
  "preview-galeria",
) as HTMLElement;
const galleryCounter = document.getElementById(
  "gallery-counter",
) as HTMLElement | null;

function updateGalleryPreview() {
  galleryPreview.innerHTML = "";

  galleryFiles.forEach((file, index) => {
    const container = document.createElement("div");
    container.className = "gallery-item";
    container.style.position = "relative";
    container.style.display = "inline-block";

    const img = document.createElement("img");
    if (file instanceof Blob) {
      img.src = URL.createObjectURL(file);
    }
    img.style.maxWidth = "150px";
    img.style.maxHeight = "150px";
    img.style.margin = "8px";
    img.style.borderRadius = "8px";
    img.style.border = "2px solid #ddd";

    const btnRemove = document.createElement("button");
    btnRemove.type = "button";
    btnRemove.innerHTML = "✕";
    btnRemove.className = "btn-remove-image";
    btnRemove.style.position = "absolute";
    btnRemove.style.top = "0";
    btnRemove.style.right = "0";
    btnRemove.style.background = "rgba(255, 0, 0, 0.7)";
    btnRemove.style.color = "white";
    btnRemove.style.border = "none";
    btnRemove.style.borderRadius = "50%";
    btnRemove.style.width = "30px";
    btnRemove.style.height = "30px";
    btnRemove.style.cursor = "pointer";
    btnRemove.style.fontSize = "18px";
    btnRemove.style.display = "flex";
    btnRemove.style.alignItems = "center";
    btnRemove.style.justifyContent = "center";

    btnRemove.addEventListener("click", (e) => {
      e.preventDefault();
      galleryFiles.splice(index, 1);
      updateGalleryPreview();
    });

    container.appendChild(img);
    container.appendChild(btnRemove);
    galleryPreview.appendChild(container);
  });

  if (galleryCounter) {
    galleryCounter.textContent = `${galleryFiles.length} imagem(ns) selecionada(s)`;
  }
}

galleryInput.addEventListener("change", () => {
  if (!galleryInput.files?.length) return;

  Array.from(galleryInput.files).forEach((file) => {
    if (file instanceof Blob) {
      galleryFiles.push(file);
    }
  });

  galleryInput.value = "";
  updateGalleryPreview();
});

function generateSummary() {
  const summary = document.getElementById("animal-summary") as HTMLElement;

  const nome = (document.getElementById("nome") as HTMLInputElement).value;
  const especie = (document.getElementById("especie") as HTMLSelectElement)
    .value;
  const idade = (document.getElementById("idade") as HTMLInputElement).value;
  const porte = (document.getElementById("porte") as HTMLSelectElement).value;
  const localizacao = (
    document.getElementById("localizacao") as HTMLInputElement
  ).value;
  const sobre = (document.getElementById("sobre") as HTMLTextAreaElement).value;
  const disponivel = (document.getElementById("disponivel") as HTMLInputElement)
    .checked;

  summary.innerHTML = `
    <h3>${nome || "-"}</h3>
    <p><strong>Espécie:</strong> ${especie}</p>
    <p><strong>Idade:</strong> ${idade}</p>
    <p><strong>Porte:</strong> ${porte}</p>
    <p><strong>Localização:</strong> ${localizacao}</p>
    <p><strong>Disponível:</strong> ${disponivel ? "Sim" : "Não"}</p>
    <hr>
    <p>${sobre}</p>
    <hr>
    <p><strong>Imagem de capa:</strong> ${capaInput.files?.length ?? 0}</p>
    <p><strong>Imagens na galeria:</strong> ${galleryFiles.length}</p>
  `;
}

function obterCaracteristicas(): string[] {
  const lista: string[] = [];

  document
    .querySelectorAll('[data-step="4"] input[type="checkbox"]')
    .forEach((checkbox) => {
      const input = checkbox as HTMLInputElement;
      if (input.checked) {
        lista.push(input.value);
      }
    });

  return lista;
}

function obterNecessidades(): string[] {
  const lista: string[] = [];

  document
    .querySelectorAll('[data-step="5"] input[type="checkbox"]')
    .forEach((checkbox) => {
      const input = checkbox as HTMLInputElement;
      if (input.checked) {
        const label = input.parentElement?.textContent?.trim() || "";
        lista.push(label);
      }
    });

  return lista;
}

const form = document.getElementById("animal-form") as HTMLFormElement;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Usuário não autenticado. Faça login para continuar.");
    return;
  }

  const nome = (document.getElementById("nome") as HTMLInputElement).value;
  if (!nome.trim()) {
    alert("Por favor, preencha o nome do animal.");
    return;
  }

  const formData = new FormData();

  formData.append("nome", nome);
  formData.append(
    "especie",
    (document.getElementById("especie") as HTMLSelectElement).value,
  );
  formData.append(
    "idade",
    (document.getElementById("idade") as HTMLInputElement).value,
  );
  formData.append(
    "porte",
    (document.getElementById("porte") as HTMLSelectElement).value,
  );
  formData.append(
    "sobre",
    (document.getElementById("sobre") as HTMLTextAreaElement).value,
  );
  formData.append(
    "localizacao",
    (document.getElementById("localizacao") as HTMLInputElement).value,
  );
  formData.append(
    "status_do_animal",
    (document.getElementById("status_do_animal") as HTMLSelectElement).value,
  );
  formData.append(
    "disponivel",
    String((document.getElementById("disponivel") as HTMLInputElement).checked),
  );

  formData.append(
    "caracteristicas_do_animal",
    JSON.stringify(obterCaracteristicas()),
  );
  formData.append("caracteristicas_gerais", JSON.stringify([]));
  formData.append(
    "necessidades_especiais",
    JSON.stringify(obterNecessidades()),
  );

  if (capaInput.files?.length && capaInput.files[0] instanceof Blob) {
    formData.append("imagem_capa", capaInput.files[0]);
  }

  galleryFiles.forEach((file) => {
    if (file instanceof Blob) {
      formData.append("imagens", file);
    }
  });

  btnSave.disabled = true;
  btnSave.textContent = "Enviando...";

  try {
    const response = await fetch(`${API_URL_ANIMAL}/animals/me`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro da API:", data);
      alert(data.error?.message ?? data.message ?? "Erro ao cadastrar animal.");
      return;
    }

    alert("Animal cadastrado com sucesso!");

    // Reset do formulário
    form.reset();
    galleryFiles.length = 0;
    galleryPreview.innerHTML = "";
    capaPreview.innerHTML = "";
    currentStep = 0;
    updateStep();
    closeModal();
  } catch (err) {
    console.error("Erro ao conectar:", err);
    alert("Erro ao conectar ao servidor. Verifique sua conexão.");
  } finally {
    btnSave.disabled = false;
    btnSave.textContent = "Salvar Animal";
  }
});
