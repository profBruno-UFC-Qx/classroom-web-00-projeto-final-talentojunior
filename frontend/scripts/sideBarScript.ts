const toggleBtn = document.querySelector(
  ".btn-toggle-sidebar",
) as HTMLButtonElement | null;
const sidebar = document.querySelector(".sidebar") as HTMLElement | null;
const overlay = document.querySelector(".sidebar-overlay") as HTMLElement | null;

if (toggleBtn && sidebar && overlay) {
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
}