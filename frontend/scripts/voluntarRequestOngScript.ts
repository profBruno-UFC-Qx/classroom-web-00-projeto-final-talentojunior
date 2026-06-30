export {};

const token = localStorage.getItem("token");
const ongRaw = localStorage.getItem("ong");

if (!token || !ongRaw) {
  window.location.href = "../html/LoginPage.html";
}