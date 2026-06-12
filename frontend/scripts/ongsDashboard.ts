const toggleBtn = document.querySelector(
  ".btn-toggle-sidebar",
) as HTMLButtonElement;
const sidebar = document.querySelector(".sidebar") as HTMLElement;
const overlay = document.querySelector(".sidebar-overlay") as HTMLElement;

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");
});

overlay.addEventListener("click", () => {
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
});

const sidebarLinks = document.querySelectorAll(".sidebar-nav a");
sidebarLinks.forEach((link) => {
  link.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  });
});
