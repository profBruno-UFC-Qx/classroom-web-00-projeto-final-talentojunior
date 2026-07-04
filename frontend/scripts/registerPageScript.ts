const protetorButton = document.getElementById("btn-protetor") as HTMLButtonElement;
const ongButton = document.getElementById("btn-ong") as HTMLButtonElement;

const instructionText = document.getElementById("dynamic-instruction") as HTMLParagraphElement;
const labelName = document.getElementById("label-name") as HTMLLabelElement;
const submitButton = document.querySelector(".submit-btn") as HTMLButtonElement;
const formContent = document.querySelector(".form-content") as HTMLDivElement;

const registerForm = document.getElementById("register-form") as HTMLFormElement;
const nomeInput = document.getElementById("nome") as HTMLInputElement;
const emailInput = document.getElementById("email") as HTMLInputElement;
const senhaInput = document.getElementById("senha") as HTMLInputElement;
const confirmacaoSenhaInput = document.getElementById("confirmacaoSenha") as HTMLInputElement;
const termosInput = document.getElementById("termos") as HTMLInputElement;
const registerMessage = document.getElementById("register-message") as HTMLParagraphElement;
const cidadeInput = document.getElementById("cidade") as HTMLInputElement;
const cidadeField = document.getElementById("cidade-field") as HTMLDivElement;
const cnpjInput = document.getElementById("cnpj") as HTMLInputElement;
const cnpjField = document.getElementById("cnpj-field") as HTMLDivElement;



let currentRole: "protetor" | "ong" = "protetor";

if (currentRole === "protetor") {
  cidadeField.style.display = "block";
  cidadeInput.required = true;
  cnpjField.style.display = "none";
  cnpjInput.required = false;
  cnpjInput.value = "";
} else {
  cidadeField.style.display = "none";
  cidadeInput.required = false;
  cnpjField.style.display = "block";
  cnpjInput.required = true;
}

// URL base da API do Strapi
const API_URL = "http://localhost:1337/api";

function showMessage(message: string, type: "success" | "error" = "error") {
  registerMessage.textContent = message;
  registerMessage.className = `register-message ${type}`;
}

function clearMessage() {
  registerMessage.textContent = "";
  registerMessage.className = "register-message";
}

function setLoading(isLoading: boolean) {
  submitButton.disabled = isLoading;

  if (isLoading) {
    submitButton.innerHTML = `Enviando... <span class="bi bi-arrow-repeat"></span>`;
  } else {
    if (currentRole === "ong") {
      submitButton.innerHTML = `Cadastrar ONG <span class="bi bi-arrow-right"></span>`;
    } else {
      submitButton.innerHTML = `Criar Conta <span class="bi bi-arrow-right"></span>`;
    }
  }
}

function animateForm(direction: "left" | "right") {
  formContent.classList.remove(
    "slide-out-left",
    "slide-out-right",
    "slide-in-left",
    "slide-in-right"
  );

  formContent.classList.add(
    direction === "left" ? "slide-out-left" : "slide-out-right"
  );

  setTimeout(() => {
    if (currentRole === "protetor") {
      instructionText.textContent =
        "Cadastre-se para acolher animais temporariamente e ajudar a desafogar os abrigos.";
      labelName.textContent = "Nome Completo";
      submitButton.innerHTML = `Criar Conta <span class="bi bi-arrow-right"></span>`;
      submitButton.classList.remove("ong-btn");
      nomeInput.placeholder = "Como devemos te chamar?";
      cidadeField.style.display = "block";
      cidadeInput.required = true;
      cnpjField.style.display = "none";
      cnpjInput.required = false;
      cnpjInput.value = "";
    } else {
      instructionText.textContent =
        "Cadastre sua ONG ou abrigo para encontrar voluntários e ampliar o impacto da sua causa.";
      labelName.textContent = "Nome da ONG / Abrigo";
      submitButton.innerHTML = `Cadastrar ONG <span class="bi bi-arrow-right"></span>`;
      submitButton.classList.add("ong-btn");
      nomeInput.placeholder = "Nome da sua ONG ou abrigo";
      cidadeField.style.display = "none";
      cidadeInput.required = false;
      cidadeInput.value = "";
      cnpjField.style.display = "block";
      cnpjInput.required = true;
    }

    formContent.classList.remove("slide-out-left", "slide-out-right");

    formContent.classList.add(
      direction === "left" ? "slide-in-right" : "slide-in-left"
    );

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        formContent.style.transform = "translateX(0)";
        formContent.style.opacity = "1";
      });
    });
  }, 250);

  setTimeout(() => {
    formContent.classList.remove("slide-in-left", "slide-in-right");
  }, 500);
}

protetorButton.addEventListener("click", () => {
  if (currentRole === "protetor") return;

  currentRole = "protetor";
  protetorButton.classList.add("active");
  ongButton.classList.remove("active");

  clearMessage();
  animateForm("right");
});

ongButton.addEventListener("click", () => {
  if (currentRole === "ong") return;

  currentRole = "ong";
  ongButton.classList.add("active");
  protetorButton.classList.remove("active");

  clearMessage();
  animateForm("left");
});

async function registerOng() {
  const payload = {
    nome: nomeInput.value.trim(),
    email: emailInput.value.trim(),
    senha: senhaInput.value,
    confirmacaoSenha: confirmacaoSenhaInput.value,
    cnpj: cnpjInput.value.trim(),
  };

  const response = await fetch(`${API_URL}/ong/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Erro ao cadastrar ONG.");
  }

  
  return data;
}

async function registerProtetor() {
  const payload = {
    nome: nomeInput.value.trim(),
    email: emailInput.value.trim(),
    senha: senhaInput.value,
    confirmacaoSenha: confirmacaoSenhaInput.value,
    cidade: cidadeInput.value.trim(),
  };

  const response = await fetch(`${API_URL}/voluntarios/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Erro ao cadastrar voluntário.");
  }

  return data;
}

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearMessage();

  const nome = nomeInput.value.trim();
  const email = emailInput.value.trim();
  const senha = senhaInput.value;
  const confirmacaoSenha = confirmacaoSenhaInput.value;
  const cidade = cidadeInput.value.trim();

  if (!nome || !email || !senha || !confirmacaoSenha) {
    showMessage("Preencha todos os campos.");
    return;
  }

  if (!termosInput.checked) {
    showMessage("Você precisa aceitar os termos de uso.");
    return;
  }

  if (senha !== confirmacaoSenha) {
    showMessage("A senha e a confirmação de senha não coincidem.");
    return;
  }

  if (currentRole === "protetor" && !cidade) {
    showMessage("Informe sua cidade.");
    return;
  }

  try {
    setLoading(true);

    let result: any;

    if (currentRole === "ong") {
      result = await registerOng();
    } else {
      result = await registerProtetor();
    }

    // salva autenticação no navegador

    localStorage.removeItem("voluntario");
    localStorage.removeItem("ong");

    if (result.jwt) {
      localStorage.setItem("token", result.jwt);
    }

    if (result.user) {
      localStorage.setItem("user", JSON.stringify(result.user));
    }

    if (result.ong) {
      localStorage.setItem("ong", JSON.stringify(result.ong));
    }

    if (result.voluntario) {
      localStorage.setItem("voluntario", JSON.stringify(result.voluntario));
    }

    showMessage("Cadastro realizado com sucesso!", "success");

    // redireciona depois de um pequeno delay
    setTimeout(() => {
      if (currentRole === "ong") {
        window.location.href = "../ongs/dashboard.html"; 
      } else {
        window.location.href = "DashboardVoluntario.html"; 
      }
    }, 1200);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Não foi possível concluir o cadastro.";

    showMessage(message, "error");
  } finally {
    setLoading(false);
  }
});