const passwordInput = document.getElementById("password") as HTMLInputElement;
  
  const togglePasswordButton = document.getElementById("toggle-pw") as HTMLButtonElement;
  
  const toggleIcon =
    togglePasswordButton.querySelector("span");
  
  togglePasswordButton.addEventListener("click", () => {
    const isPassword =
      passwordInput.type === "password";
  
    passwordInput.type = isPassword
      ? "text"
      : "password";
  
    if (toggleIcon) {
      toggleIcon.textContent = isPassword
        ? ""
        : "";
    }
  });

  // --- lógica de login ---

const API_URL = "http://localhost:1337/api";

const loginForm = document.getElementById("login-form") as HTMLFormElement;
const emailInput = document.getElementById("email") as HTMLInputElement;
const errorBox = document.getElementById("error-box") as HTMLDivElement;
const submitButton = document.getElementById("submit-btn") as HTMLButtonElement;

function showError(message: string) {
  const span = errorBox.querySelector("span:last-child");
  if (span) span.textContent = message;
  errorBox.style.display = "flex";
}

function hideError() {
  errorBox.style.display = "none";
}

function setLoading(isLoading: boolean) {
  submitButton.disabled = isLoading;
  submitButton.textContent = isLoading ? "Entrando..." : "Entrar";
}

async function login(identifier: string, password: string) {
  const response = await fetch(`${API_URL}/auth/local`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "E-mail ou senha incorretos.");
  }

  return data;
}

// depois de logar, descobre se é voluntário ou ONG
async function descobrirPerfil(jwt: string): Promise<{ tipo: "voluntario" | "ong"; dados: any } | null> {
  const headers = { Authorization: `Bearer ${jwt}` };

  const respVoluntario = await fetch(`${API_URL}/voluntarios/me`, { headers });
  if (respVoluntario.ok) {
    const data = await respVoluntario.json();
    return { tipo: "voluntario", dados: data.voluntario };
  }

  const respOng = await fetch(`${API_URL}/ong/me`, { headers });
  if (respOng.ok) {
    const data = await respOng.json();
    return { tipo: "ong", dados: data.ong };
  }

  return null;
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  hideError();

  const identifier = emailInput.value.trim();
  const password = passwordInput.value;

  if (!identifier || !password) {
    showError("Preencha e-mail e senha.");
    return;
  }

  try {
    setLoading(true);

    const result = await login(identifier, password);
    localStorage.setItem("token", result.jwt);
    localStorage.setItem("user", JSON.stringify(result.user));

    const perfil = await descobrirPerfil(result.jwt);

    if (!perfil) {
      showError("Não foi possível identificar o tipo de conta.");
      return;
    }

    localStorage.setItem(perfil.tipo, JSON.stringify(perfil.dados));

    window.location.href =
      perfil.tipo === "voluntario" ? "DashboardVoluntario.html" : "../ongs/dashboard.html";
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Não foi possível fazer login.";
    showError(message);
  } finally {
    setLoading(false);
  }
});


export {};