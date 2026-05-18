"use strict";
const menuBtn = document.getElementById('menu-btn');
const navMenu = document.getElementById('nav-mobile-menu');
menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
});
const links = document.querySelectorAll('.nav-link-item a');
links.forEach(link => {
    link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });
});
const buttons = document.querySelectorAll('.nav-button');
buttons.forEach(button => {
    button.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });
});
//# sourceMappingURL=homeScript.js.map