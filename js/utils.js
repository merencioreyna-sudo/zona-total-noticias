// js/utils.js

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) return;

  const noticias = JSON.parse(localStorage.getItem("noticias"));
  if (!noticias) return;

  const noticia = noticias.find(n => n.id == id);
  if (!noticia) return;

  const title = document.getElementById("news-title");
  const summary = document.getElementById("news-summary");
  const content = document.getElementById("news-content");
  const image = document.getElementById("news-image");
  const date = document.getElementById("news-date");
  const author = document.getElementById("news-author");
  const source = document.getElementById("news-source");

  if (title) title.textContent = noticia.titulo;
  if (summary) summary.textContent = noticia.resumen;
  if (content) content.innerHTML = `<p>${noticia.contenido}</p>`;

  if (image && noticia.imagen_url) {
    image.src = noticia.imagen_url;
    image.alt = noticia.titulo;
    image.style.display = "block";
  }

  if (date) date.textContent = noticia.fecha;
  if (author) author.textContent = noticia.autor;
  if (source) source.textContent = noticia.fuente;
});
