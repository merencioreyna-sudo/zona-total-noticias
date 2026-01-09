const API_URL = "https://script.google.com/macros/s/AKfycbwzWyaApVPMsqjx1gFXdXwtSnYBeJXexsxdpp1WcDqDXrF4lsrJ61LKnuSmtMdhLGqh/exec";

/* =========================
   UTILIDAD: MENÚ ACTIVO
========================= */
function marcarCategoriaActiva(categoria) {
  const links = document.querySelectorAll(".main-nav a");
  links.forEach(link => {
    link.classList.remove("active");
    if (categoria && link.href.includes(`cat=${categoria}`)) {
      link.classList.add("active");
    }
  });

  if (!categoria) {
    const portada = document.querySelector('.main-nav a[href="index.html"]');
    if (portada) portada.classList.add("active");
  }
}

/* =========================
   GUARDAR CATEGORÍA
========================= */
document.addEventListener("click", e => {
  const link = e.target.closest("a");
  if (!link) return;

  if (link.href && link.href.includes("cat=")) {
    const url = new URL(link.href);
    const cat = url.searchParams.get("cat");
    if (cat) localStorage.setItem("categoriaActiva", cat);
  }

  if (link.classList.contains("btn-read")) {
    const params = new URLSearchParams(link.href.split("?")[1]);
    const cat = params.get("cat");
    if (cat) localStorage.setItem("categoriaActiva", cat);
  }
});

/* =========================
   APLICAR CATEGORÍA AL CARGAR
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const catURL = params.get("cat");

  const esPortada =
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/" ||
    window.location.pathname === "";

  if (esPortada && !catURL) {
    marcarCategoriaActiva(null);
  } else {
    marcarCategoriaActiva(catURL || localStorage.getItem("categoriaActiva"));
  }
});

/* =========================
   LOADER NOTICIA
========================= */
function showNewsLoader() {
  if (document.getElementById("news-loader")) return;

  const loader = document.createElement("div");
  loader.id = "news-loader";
  loader.innerHTML = `
    <div class="news-loader-content">
      <svg viewBox="0 0 24 24" class="news-loader-icon">
        <rect x="3" y="2" width="18" height="20" rx="2"></rect>
        <line x1="7" y1="6" x2="17" y2="6"></line>
        <line x1="7" y1="10" x2="17" y2="10"></line>
        <line x1="7" y1="14" x2="13" y2="14"></line>
      </svg>
      <p>Cargando noticia…</p>
    </div>
  `;

  const style = document.createElement("style");
  style.innerHTML = `
    #news-loader {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.65);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999;
      backdrop-filter: blur(2px);
    }
    .news-loader-content {
      text-align: center;
      color: #ff3b3b;
      font-size: 1.1rem;
    }
    .news-loader-icon {
      width: 64px;
      height: 64px;
      stroke: #ff3b3b;
      fill: none;
      stroke-width: 1.5;
      margin-bottom: 12px;
      animation: spin 1.1s linear infinite;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(loader);
}

function hideNewsLoader() {
  const loader = document.getElementById("news-loader");
  if (loader) loader.remove();
}

/* =========================
   PORTADA / CATEGORÍAS
========================= */
document.addEventListener("DOMContentLoaded", () => {
  fetch(API_URL)
    .then(r => r.json())
    .then(noticias => {
      document.querySelectorAll(".loading-msg").forEach(e => e.remove());
      if (!Array.isArray(noticias)) return;

      const params = new URLSearchParams(window.location.search);
      const categoriaActiva = params.get("cat");

      const hero = document.getElementById("noticia-principal");
      const grid = document.getElementById("noticias-secundarias");

      if (categoriaActiva) {
        if (hero) hero.style.display = "none";
        grid.innerHTML = "";

        const filtradas = noticias.filter(n =>
          n.categoria &&
          n.categoria.trim().toLowerCase() === categoriaActiva.trim().toLowerCase()
        );

        if (filtradas.length === 0) return;

        grid.innerHTML = filtradas.map(n => {
          const img = n.imagen_url ? n.imagen_url.split(",")[0].trim() : "";
          const esDestacada = String(n.destacada).toLowerCase() === "true";
          return `
            <article class="card">
              ${esDestacada ? '<span class="badge-destacada">🔥 DESTACADA</span>' : ''}
              <img src="${img}" alt="${n.titulo}" loading="lazy">
              <div class="card-content">
                <h3>${n.titulo}</h3>
                <div class="card-footer">
                  <a href="noticia.html?id=${n.id}&cat=${categoriaActiva}" class="btn-read">Leer más</a>
                  <span class="category-tag">${n.categoria}</span>
                </div>
              </div>
            </article>
          `;
        }).join("");
        return;
      }

      if (noticias.length < 4) return;

      const p = noticias[0];
      const heroImg = p.imagen_url ? p.imagen_url.split(",")[0].trim() : "";
      const heroDestacada = String(p.destacada).toLowerCase() === "true";

      hero.innerHTML = `
        <article class="hero-card">
          ${heroDestacada ? '<span class="badge-destacada">🔥 DESTACADA</span>' : ''}
          <img src="${heroImg}" alt="${p.titulo}">
          <div class="hero-content">
            <h2>${p.titulo}</h2>
            <p>${p.resumen}</p>
            <div class="hero-footer">
              <a href="noticia.html?id=${p.id}&cat=${p.categoria}" class="btn-read">Leer más</a>
              <span class="category-tag">${p.categoria}</span>
            </div>
          </div>
        </article>
      `;

      grid.innerHTML = noticias.slice(1, 4).map(n => {
        const img = n.imagen_url ? n.imagen_url.split(",")[0].trim() : "";
        const esDestacada = String(n.destacada).toLowerCase() === "true";
        return `
          <article class="card">
            ${esDestacada ? '<span class="badge-destacada">🔥 DESTACADA</span>' : ''}
            <img src="${img}" alt="${n.titulo}" loading="lazy">
            <div class="card-content">
              <h3>${n.titulo}</h3>
              <div class="card-footer">
                <a href="noticia.html?id=${n.id}&cat=${n.categoria}" class="btn-read">Leer más</a>
                <span class="category-tag">${n.categoria}</span>
              </div>
            </div>
          </article>
        `;
      }).join("");
    })
    .catch(err => console.error(err));
});

/* =========================
   NOTICIA COMPLETA
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const title = document.getElementById("news-title");
  const meta = document.getElementById("news-meta");
  const gallery = document.getElementById("news-gallery");
  const content = document.getElementById("news-content");

  if (!title || !gallery || !content) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) return;

  showNewsLoader();

  fetch(API_URL)
    .then(r => r.json())
    .then(noticias => {
      const n = noticias.find(x => String(x.id) === String(id));
      if (!n) return;

      title.textContent = n.titulo;

      if (meta) {
        meta.innerHTML = `
  <span class="meta-tag">🗓️ ${n.fecha || ''}</span>
  <span class="meta-tag">✍️ ${n.autor || ''}</span>
  <span class="meta-tag">📰 ${n.fuente || ''}</span>
`;

      }

      gallery.innerHTML = "";
      if (n.imagen_url) {
        n.imagen_url.split(",").forEach(url => {
          const img = document.createElement("img");
          img.src = url.trim();
          img.alt = n.titulo;
          gallery.appendChild(img);
        });
      }

      content.innerHTML = `<p>${n.contenido}</p>`;
    })
    .catch(err => console.error(err))
    .finally(() => hideNewsLoader());
});
