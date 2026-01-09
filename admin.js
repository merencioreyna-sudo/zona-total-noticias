document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('news-form');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const data = {
        titulo: document.getElementById('titulo').value,
        resumen: document.getElementById('resumen').value,
        contenido: document.getElementById('contenido').value,
        categoria: document.getElementById('categoria').value,
        imagen_url: document.getElementById('imagen_url').value,
        autor: document.getElementById('autor').value,
        fuente: document.getElementById('fuente').value,
        destacada: document.getElementById('destacada').value
      };

      fetch(
        'https://script.google.com/macros/s/AKfycbyckBnsCwNUMVo2qfaUhiS7zWRsx7k1TnnHLdwU8g_DIrK4Pqo9DTlZWERLi-dq6Wy0/exec',
        {
          method: 'POST',
          mode: 'no-cors',
          body: JSON.stringify(data)
        }
      );

      alert('✅ Noticia publicada correctamente');
      form.reset();
    });
  }

  /* =========================
     LOGIN
  ========================= */
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');

  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      const user = document.getElementById('username').value;
      const pass = document.getElementById('password').value;

      if (user === 'admin' && pass === 'admin123') {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
        document.getElementById('login-error').style.display = 'none';
      } else {
        document.getElementById('login-error').style.display = 'block';
      }
    });
  }

  /* =========================
     LOGOUT (FIX FINAL)
  ========================= */
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      document.getElementById('admin-panel').style.display = 'none';
      document.getElementById('login-section').style.display = 'block';

      // Limpieza básica
      document.getElementById('username').value = '';
      document.getElementById('password').value = '';
      document.getElementById('login-error').style.display = 'none';
    });
  }
});
