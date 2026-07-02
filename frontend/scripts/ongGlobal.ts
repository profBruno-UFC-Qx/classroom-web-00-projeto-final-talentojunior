const DEFAULT_IMAGE =
  "https://static.vecteezy.com/system/resources/previews/008/249/343/non_2x/veterinary-logo-cat-and-dog-logo-design-pet-care-vet-clinic-logo-pet-clinic-vector.jpg";

function getImageUrlOng(url?: string) {
    if (!url) return DEFAULT_IMAGE;

    if (url.startsWith("http")) return url;

    return `http://localhost:1337${url}`;
}

function loadOngHeader() {

    const ong = JSON.parse(localStorage.getItem("ong") || "{}");

    const avatar = document.querySelector(".user-avatar") as HTMLImageElement;
    const name = document.querySelector(".user-info p") as HTMLParagraphElement;

    if (name) {
        name.textContent = ong.nome || "ONG";
    }

    if (avatar) {
        avatar.src = getImageUrlOng(ong.imagem_perfil?.url);
    }
}

document.addEventListener("DOMContentLoaded", loadOngHeader);