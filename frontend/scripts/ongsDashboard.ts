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
