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