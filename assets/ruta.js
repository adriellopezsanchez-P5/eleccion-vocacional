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
    { n: 0, archivo: 'index.html', corto: 'Inicio' },
    { n: 1, archivo: 'paso1-herrera-montes.html', corto: 'Herrera y Montes', clave: 'hm' },
    { n: 2, archivo: 'paso2-interpretacion.html', corto: 'Interpretación', clave: 'interp' },
    { n: 3, archivo: 'paso3-evapem.html', corto: 'EVAPEM', clave: 'evapem' },
    { n: 4, archivo: 'paso4-optativas.html', corto: 'Optativas', clave: 'optativas' },
    { n: 5, archivo: 'paso5-mi-ruta.html', corto: 'Mi ruta' }
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
      const barra = document.createElement('header');
      barra.className = 'barra';
      barra.innerHTML = `<div class="contenedor">
          <a class="marca" href="index.html">Ruta Vocacional<small>Orientación Educativa · Plantel "Dr. Ángel Ma. Garibay Kintana" · UAEMéx</small></a>
          <div class="alumno">${a ? Ruta.esc(a.nombre) + '<br><small>Grupo ' + Ruta.esc(a.grupo) + '</small>' : '<small>Sin datos del alumno</small>'}</div>
        </div>`;
      const nav = document.createElement('nav');
      nav.className = 'pasos';
      nav.setAttribute('aria-label', 'Pasos de la ruta');
      nav.innerHTML = '<ol>' + PASOS.map(p => {
        const hecho = p.clave && Ruta.completo(p.clave);
        const cls = (p.n === pasoActual ? 'actual ' : '') + (hecho ? 'hecho' : '');
        return `<li><a class="${cls}" href="${p.archivo}" ${p.n === pasoActual ? 'aria-current="step"' : ''}>
          <span class="num">${hecho ? '✓' : (p.n === 0 ? '⌂' : p.n)}</span>${p.corto}</a></li>`;
      }).join('') + '</ol>';
      document.body.prepend(nav);
      document.body.prepend(barra);
      const pie = document.createElement('footer');
      pie.className = 'pie';
      pie.innerHTML = 'Departamento de Orientación Educativa · Plantel "Dr. Ángel Ma. Garibay Kintana" · UAEMéx<br>Tus respuestas se guardan solo en este navegador.';
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
