/* Ruta Vocacional: estado compartido entre los pasos.
   Todo se guarda solo en el navegador del alumno (localStorage). No se envía a ningún servidor. */
(function () {
  const CLAVE = 'rutaVocacional.v1';
  const memoria = {}; // respaldo si el navegador bloquea el almacenamiento

  function leer() {
    try { return JSON.parse(localStorage.getItem(CLAVE)) || {}; }
    catch (e) { return memoria.estado || {}; }
  }
  function escribir(estado) {
    memoria.estado = estado;
    try { localStorage.setItem(CLAVE, JSON.stringify(estado)); } catch (e) { /* modo privado */ }
  }

  const PASOS = [
    { n: 0, archivo: 'index.html', corto: 'Tus datos' },
    { n: 1, archivo: 'paso1-herrera-montes.html', corto: 'Herrera y Montes', clave: 'hm' },
    { n: 2, archivo: 'paso2-interpretacion.html', corto: 'Interpretación', clave: 'interp' },
    { n: 3, archivo: 'paso3-evapem.html', corto: 'EVAPEM', clave: 'evapem' },
    { n: 4, archivo: 'paso4-optativas.html', corto: 'Optativas', clave: 'optativas' },
    { n: 5, archivo: 'paso5-mi-ruta.html', corto: 'Mi reporte' }
  ];

  const Ruta = {
    PASOS,
    estado: leer,
    obtener(clave) { return leer()[clave]; },
    guardar(clave, valor) { const e = leer(); e[clave] = valor; escribir(e); },
    borrarTodo() { try { localStorage.removeItem(CLAVE); } catch (e) {} memoria.estado = {}; },
    completo(clave) { const v = leer()[clave]; return !!(v && v.completado); },
    alumno() { return leer().alumno || null; },

    esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); },
    norm(t) { return String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim(); },
    fecha(iso) { const d = iso ? new Date(iso) : new Date(); return d.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }); },

    /* Encabezado común con la ruta de pasos */
    montarEncabezado(pasoActual) {
      const a = Ruta.alumno();
      const sitio = document.createElement('header');
      sitio.className = 'sitio';
      sitio.innerHTML = `<div class="sitio-in">
          <a class="logo" href="index.html" aria-label="Elección Vocacional, inicio">
            <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true"><path d="M5 23 C 11 23, 10 8, 16 8 S 22 15, 25 7" fill="none" stroke="#2346D8" stroke-width="3.5" stroke-linecap="round"/><circle cx="5" cy="23" r="3.6" fill="#F0B429"/><circle cx="25" cy="7" r="3.6" fill="#0E1B33"/></svg>
            Elección Vocacional</a>
          <nav class="menu" aria-label="Sitio">
            <a href="index.html" ${pasoActual === 0 ? 'aria-current="page"' : ''}>Cómo funciona</a>
            <a href="paso4-optativas.html" ${pasoActual === 4 ? 'aria-current="page"' : ''}>Optativas</a>
            <a href="paso5-mi-ruta.html" ${pasoActual === 5 ? 'aria-current="page"' : ''}>Mi reporte</a>
          </nav>
          <div class="usuario">${a ? '<b>' + Ruta.esc(a.nombre) + '</b>Grupo ' + Ruta.esc(a.grupo) : '<a href="index.html#ficha">Registrar mis datos</a>'}</div>
        </div>`;
      const nav = document.createElement('nav');
      nav.className = 'trayecto';
      nav.setAttribute('aria-label', 'Pasos de la ruta');
      nav.innerHTML = '<ol>' + PASOS.map(p => {
        const hecho = p.n === 0 ? !!a : (p.clave ? Ruta.completo(p.clave) : false);
        const cls = [p.n === pasoActual ? 'actual' : '', hecho ? 'hecho' : ''].join(' ').trim();
        return `<li class="${cls}"><a href="${p.archivo}" ${p.n === pasoActual ? 'aria-current="step"' : ''}>
          <span class="parada">${hecho && p.n !== pasoActual ? '✓' : (p.n === 0 ? '' : p.n)}</span><span class="txt">${p.corto}</span>
          <span class="sr">${hecho ? '(completado)' : ''}</span></a></li>`;
      }).join('') + '</ol>';
      document.body.prepend(nav);
      document.body.prepend(sitio);
      const pie = document.createElement('footer');
      pie.className = 'pie';
      pie.innerHTML = `<div class="contenedor"><div><b>Elección Vocacional</b><br>Departamento de Orientación Educativa, Plantel "Dr. Ángel Ma. Garibay Kintana", UAEMéx</div>
        <div>Tus respuestas se guardan solo en este navegador.</div></div>`;
      document.body.append(pie);
    },

    /* Si falta la ficha del alumno, muestra un aviso con enlace al inicio */
    exigirAlumno(contenedor) {
      if (Ruta.alumno()) return true;
      contenedor.innerHTML = `<div class="tarjeta"><div class="aviso">Antes de continuar registra tus datos en el inicio de la ruta.</div>
        <a class="btn" href="index.html">Ir al inicio</a></div>`;
      return false;
    },

    /* Barras horizontales sin librerías */
    barras(items, opciones = {}) {
      const resaltar = new Set(opciones.resaltar || []);
      return '<div class="barras">' + items.map(it => `
        <div class="barra-fila ${resaltar.has(it.clave) ? 'top' : ''}">
          <span class="nombre">${Ruta.esc(it.nombre)}</span>
          <div class="barra-pista" role="img" aria-label="${Ruta.esc(it.nombre)}: ${it.valor}%"><div class="barra-relleno ${opciones.clase || ''}" style="width:${Math.max(0, Math.min(100, it.valor))}%"></div></div>
          <span class="valor">${it.valor}%</span>
        </div>`).join('') + '</div>';
    },

    /* Ordena categorías y devuelve el top N respetando empates */
    ordenar(pcts, categorias) {
      return categorias.map(([clave, nombre], i) => ({ clave, nombre, valor: pcts[clave] ?? 0, i }))
        .sort((a, b) => b.valor - a.valor || a.i - b.i);
    },

    /* Nivel según el manual */
    nivelInteres(p) { return p >= 75 ? 'Interés profesional' : p >= 50 ? 'Interés subprofesional' : p > 25 ? 'Interés común' : 'Falta de motivación'; },
    nivelAptitud(p) { return p >= 75 ? 'Aptitud desarrollada' : p >= 50 ? 'Aptitud normal' : p > 25 ? 'Aptitud común' : 'Falta de práctica'; }
  };

  window.Ruta = Ruta;
})();
