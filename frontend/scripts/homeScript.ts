const menuBtn = document.getElementById("menu-btn") as HTMLButtonElement;
const navMenu = document.getElementById("nav-mobile-menu") as HTMLElement;

menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("active");
  navMenu.classList.toggle("active");
  document.body.classList.toggle("no-scroll");
});

const links = document.querySelectorAll(".nav-link-item a");

links.forEach((link) => {
  link.addEventListener("click", () => {
    menuBtn.classList.remove("active");
    navMenu.classList.remove("active");
    document.body.classList.remove("no-scroll");
  });
});

const buttons = document.querySelectorAll(".nav-button");
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    menuBtn.classList.remove("active");
    navMenu.classList.remove("active");
    document.body.classList.remove("no-scroll");
  });
});

// Create a carrousel effect for the ONG cards
function initCarrouselOngs() {
  const list = document.querySelector(".ongs-list") as HTMLElement;
  const track = document.querySelector(".ongs-track") as HTMLElement;

  const originalCards = Array.from(track.children) as HTMLElement[];
  const gap = 22;

  function getOriginalWidth() {
    return originalCards.reduce((acc, card) => acc + card.offsetWidth + gap, 0);
  }

  function setup() {
    // Remove a existing clones
    track.querySelectorAll(".ong-card-clone").forEach((el) => el.remove());
    track.classList.remove("animating");
    track.style.removeProperty("--scroll-distance");
    track.style.removeProperty("animation-duration");

    const trackWidth = getOriginalWidth();
    const containerWidth = list.offsetWidth;

    if (trackWidth <= containerWidth) {
      list.style.justifyContent = "center";
      return;
    }

    list.style.justifyContent = "flex-start";
    
    originalCards.forEach((card) => {
      const clone = card.cloneNode(true) as HTMLElement;
      clone.classList.add("ong-card-clone");
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });

    const speed = 60; // pixels per second
    const duration = trackWidth / speed;

    track.style.setProperty("--scroll-distance", `-${trackWidth}px`);
    track.style.setProperty("animation-duration", `${duration}s`);
    track.classList.add("animating");
  }

  setup();

  let resizeTimer: ReturnType<typeof setTimeout>;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setup, 150);
  });
}

initCarrouselOngs();
