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

// Animals Requests Sidebar Toggle
const toggleRequestsBtn = document.querySelector(
  ".btn-toggle-requests",
) as HTMLButtonElement;
const requestsSidebar = document.querySelector(
  ".animals-request-side-bar",
) as HTMLElement;
const requestsOverlay = document.querySelector(
  ".animals-requests-overlay",
) as HTMLElement;
const closeRequestsBtn = document.querySelector(
  ".btn-close-requests",
) as HTMLButtonElement;

if (toggleRequestsBtn) {
  toggleRequestsBtn.addEventListener("click", () => {
    requestsSidebar.classList.toggle("active");
    requestsOverlay.classList.toggle("active");
  });
}

if (closeRequestsBtn) {
  closeRequestsBtn.addEventListener("click", () => {
    requestsSidebar.classList.remove("active");
    requestsOverlay.classList.remove("active");
  });
}

if (requestsOverlay) {
  requestsOverlay.addEventListener("click", () => {
    requestsSidebar.classList.remove("active");
    requestsOverlay.classList.remove("active");
  });
}
