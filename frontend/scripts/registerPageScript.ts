const btnProtetor = document.getElementById("btn-protetor") as HTMLButtonElement;
const btnOng = document.getElementById("btn-ong") as HTMLButtonElement;
const dynamicInstruction = document.getElementById("dynamic-instruction") as HTMLParagraphElement;
const labelName = document.getElementById("label-name") as HTMLLabelElement;
const registerForm = document.querySelector(".register-form") as HTMLFormElement;

// ─── Field configs ────────────────────────────────────────────────────────────

const protectorFields = `
  <div class="input-group">
    <label id="label-name">Nome Completo</label>
    <div class="input-wrapper">
      <span class="material-symbols-outlined">person</span>
      <input type="text" placeholder="Como devemos te chamar?" required />
    </div>
  </div>

  <div class="input-group">
    <label>E-mail</label>
    <div class="input-wrapper">
      <span class="material-symbols-outlined">mail</span>
      <input type="email" placeholder="exemplo@email.com" required />
    </div>
  </div>

  <div class="input-group">
    <label>Telefone</label>
    <div class="input-wrapper">
      <span class="material-symbols-outlined">phone</span>
      <input type="tel" placeholder="(00) 00000-0000" required />
    </div>
  </div>

  <div class="input-group">
    <label>Cidade / Estado</label>
    <div class="input-wrapper">
      <span class="material-symbols-outlined">location_on</span>
      <input type="text" placeholder="Ex: Fortaleza, CE" required />
    </div>
  </div>

  <div class="password-grid">
    <div class="input-group">
      <label>Senha</label>
      <div class="input-wrapper">
        <span class="material-symbols-outlined">lock</span>
        <input type="password" placeholder="********" required />
      </div>
    </div>
    <div class="input-group">
      <label>Confirmar Senha</label>
      <div class="input-wrapper">
        <span class="material-symbols-outlined">lock_reset</span>
        <input type="password" placeholder="********" required />
      </div>
    </div>
  </div>

  <div class="terms">
    <input type="checkbox" required />
    <p>
      Eu concordo com os <a href="#">Termos de Uso</a> e a
      <a href="#">Política de Privacidade</a>.
    </p>
  </div>

  <button type="submit" class="submit-btn">
    Criar Conta
    <span class="material-symbols-outlined">arrow_forward</span>
  </button>
`;

const ongFields = `
  <div class="input-group">
    <label>Nome da ONG / Abrigo</label>
    <div class="input-wrapper">
      <span class="material-symbols-outlined">corporate_fare</span>
      <input type="text" placeholder="Nome da organização" required />
    </div>
  </div>

  <div class="input-group">
    <label>CNPJ</label>
    <div class="input-wrapper">
      <span class="material-symbols-outlined">badge</span>
      <input type="text" placeholder="00.000.000/0000-00" required />
    </div>
  </div>

  <div class="input-group">
    <label>E-mail institucional</label>
    <div class="input-wrapper">
      <span class="material-symbols-outlined">mail</span>
      <input type="email" placeholder="contato@ong.org.br" required />
    </div>
  </div>

  <div class="input-group">
    <label>Telefone / WhatsApp</label>
    <div class="input-wrapper">
      <span class="material-symbols-outlined">phone</span>
      <input type="tel" placeholder="(00) 00000-0000" required />
    </div>
  </div>

  <div class="input-group">
    <label>Cidade / Estado</label>
    <div class="input-wrapper">
      <span class="material-symbols-outlined">location_on</span>
      <input type="text" placeholder="Ex: Fortaleza, CE" required />
    </div>
  </div>

  <div class="password-grid">
    <div class="input-group">
      <label>Senha</label>
      <div class="input-wrapper">
        <span class="material-symbols-outlined">lock</span>
        <input type="password" placeholder="********" required />
      </div>
    </div>
    <div class="input-group">
      <label>Confirmar Senha</label>
      <div class="input-wrapper">
        <span class="material-symbols-outlined">lock_reset</span>
        <input type="password" placeholder="********" required />
      </div>
    </div>
  </div>

  <div class="terms">
    <input type="checkbox" required />
    <p>
      Eu concordo com os <a href="#">Termos de Uso</a> e a
      <a href="#">Política de Privacidade</a>.
    </p>
  </div>

  <button type="submit" class="submit-btn ong-btn">
    Cadastrar Organização
    <span class="material-symbols-outlined">arrow_forward</span>
  </button>
`;

// ─── Instruction texts ─────────────────────────────────────────────────────────

const instructions: Record<"protetor" | "ong", string> = {
  protetor:
    "Cadastre-se para acolher animais temporariamente e ajudar a desafogar os abrigos.",
  ong: "Cadastre sua ONG ou abrigo para divulgar animais e gerenciar seus voluntários de forma simples.",
};

// ─── Current role state ────────────────────────────────────────────────────────

type Role = "protetor" | "ong";
let currentRole: Role = "protetor";

// ─── Switch logic ──────────────────────────────────────────────────────────────

function switchRole(newRole: Role): void {
  if (newRole === currentRole) return;

  const direction = newRole === "ong" ? 1 : -1; // 1 = slide left, -1 = slide right

  // Slide out current form
  registerForm.style.transition = "transform 0.35s ease, opacity 0.35s ease";
  registerForm.style.transform = `translateX(${-direction * 60}px)`;
  registerForm.style.opacity = "0";

  setTimeout(() => {
    // Swap content
    registerForm.innerHTML = newRole === "protetor" ? protectorFields : ongFields;

    // Update instruction
    dynamicInstruction.textContent = instructions[newRole];

    // Active button styles
    btnProtetor.classList.toggle("active", newRole === "protetor");
    btnOng.classList.toggle("active", newRole === "ong");

    // ONG submit button variant
    if (newRole === "ong") {
      registerForm.querySelector(".submit-btn")?.classList.add("ong-btn");
    }

    currentRole = newRole;

    // Slide in from opposite side
    registerForm.style.transition = "none";
    registerForm.style.transform = `translateX(${direction * 60}px)`;
    registerForm.style.opacity = "0";

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        registerForm.style.transition = "transform 0.35s ease, opacity 0.35s ease";
        registerForm.style.transform = "translateX(0)";
        registerForm.style.opacity = "1";
      });
    });
  }, 320);
}

// ─── Event listeners ───────────────────────────────────────────────────────────

btnProtetor.addEventListener("click", () => switchRole("protetor"));
btnOng.addEventListener("click", () => switchRole("ong"));