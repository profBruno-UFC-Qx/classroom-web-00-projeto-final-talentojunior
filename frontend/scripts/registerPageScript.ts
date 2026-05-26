const protetorButton = document.getElementById(
    "btn-protetor"
  ) as HTMLButtonElement;
  
  const ongButton = document.getElementById(
    "btn-ong"
  ) as HTMLButtonElement;
  
  const instructionText = document.getElementById(
    "dynamic-instruction"
  ) as HTMLParagraphElement;
  
  const labelName = document.getElementById(
    "label-name"
  ) as HTMLLabelElement;
  
  const submitButton = document.querySelector(
    ".submit-btn"
  ) as HTMLButtonElement;
  
  const formContent = document.querySelector(
    ".form-content"
  ) as HTMLDivElement;
  
  let currentRole = "protetor";
  
  function animateForm(direction: "left" | "right") {
  
    formContent.classList.remove(
      "slide-out-left",
      "slide-out-right",
      "slide-in-left",
      "slide-in-right"
    );
  
    formContent.classList.add(
      direction === "left"
        ? "slide-out-left"
        : "slide-out-right"
    );
  
    setTimeout(() => {
  
      if (currentRole === "protetor") {
  
        instructionText.textContent =
          "Cadastre-se para acolher animais temporariamente e ajudar a desafogar os abrigos.";
  
        labelName.textContent = "Nome Completo";
  
        submitButton.textContent = "Criar Conta";
  
        submitButton.innerHTML = `
          Criar Conta
          <span class="bi bi-arrow-right"></span>
        `;
  
        submitButton.classList.remove("ong-btn");
  
      } else {
  
        instructionText.textContent =
          "Cadastre sua ONG ou abrigo para encontrar voluntários e ampliar o impacto da sua causa.";
  
        labelName.textContent = "Nome da ONG / Abrigo";
  
        submitButton.innerHTML = `
          Cadastrar ONG
          <span class="bi bi-arrow-right"></span>
        `;
  
        submitButton.classList.add("ong-btn");
      }
  
      formContent.classList.remove(
        "slide-out-left",
        "slide-out-right"
      );
  
      formContent.classList.add(
        direction === "left"
          ? "slide-in-right"
          : "slide-in-left"
      );
  
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
  
          formContent.style.transform = "translateX(0)";
          formContent.style.opacity = "1";
  
        });
      });
  
    }, 250);
  
    setTimeout(() => {
  
      formContent.classList.remove(
        "slide-in-left",
        "slide-in-right"
      );
  
    }, 500);
  }
  
  protetorButton.addEventListener("click", () => {
  
    if (currentRole === "protetor") return;
  
    currentRole = "protetor";
  
    protetorButton.classList.add("active");
    ongButton.classList.remove("active");
  
    animateForm("right");
  });
  
  ongButton.addEventListener("click", () => {
  
    if (currentRole === "ong") return;
  
    currentRole = "ong";
  
    ongButton.classList.add("active");
    protetorButton.classList.remove("active");
  
    animateForm("left");
  });