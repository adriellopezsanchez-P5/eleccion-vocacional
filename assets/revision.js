/* Modo de revisión para el orientador(a).
   Permite llenar automáticamente cada paso con datos de prueba para revisar la ruta.
   Importante: es un sitio estático; esta contraseña solo evita que un alumno entre por accidente.
   No protege información, porque el modo de revisión no da acceso a datos de nadie. */
(function () {
  // SHA-256 de "usuario:contraseña". Para cambiarla, consulta el README.
  const HUELLA = '05c5cd81b41af07a7a250d35474beeecf7926c4ef7b8f47291d41332b8dd2f2f';
  const K_ACTIVO = 'ev.revision', K_AUTO = 'ev.revision.auto', K_PASO = 'ev.revision.paso';
  const ses = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} },
    del(k) { try { sessionStorage.removeItem(k); } catch (e) {} }
  };
  async function sha256(t) {
    const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t));
    return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
  }

  const DEMO = { nombre: 'ALUMNO DE PRUEBA (REVISIÓN)', cuenta: '1234567', grupo: 'Revisión', semestre: '5', docente: 'Adriel López Sánchez', edad: '17', sexo: 'Prefiero no decir' };

  const Revision = {
    activo() { return ses.get(K_ACTIVO) === '1'; },

    montar(archivo) {
      const pie = document.querySelector('.pie .contenedor');
      if (pie && !Revision.activo()) {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'enlace-revision'; b.textContent = 'Acceso de revisión';
        b.onclick = Revision.dialogo; pie.appendChild(b);
      }
      if (!Revision.activo()) return;
      Revision.barra(archivo);
      // Recorrido automático por toda la ruta
      if (ses.get(K_AUTO) === '1') setTimeout(() => Revision.llenarYSeguir(archivo), 350);
      else if (ses.get(K_PASO) === '1') { ses.del(K_PASO); setTimeout(() => Revision.llenar(archivo), 200); }
    },

    dialogo() {
      let d = document.getElementById('dlg-revision');
      if (!d) {
        d = document.createElement('dialog'); d.id = 'dlg-revision'; d.className = 'dialogo';
        d.innerHTML = `<form method="dialog" id="f-rev">
          <h2>Acceso de revisión</h2>
          <p class="sub">Para el orientador(a): permite llenar cada paso con datos de prueba.</p>
          <div class="campo"><label for="rev-u">Usuario</label><input id="rev-u" autocomplete="username" required></div>
          <div class="campo"><label for="rev-p">Contraseña</label><input id="rev-p" type="password" autocomplete="current-password" required></div>
          <p class="aviso alerta oculto" id="rev-err" role="alert"></p>
          <div class="acciones"><button class="btn" type="submit">Entrar</button><button class="btn sec" type="button" id="rev-cancelar">Cancelar</button></div>
        </form>`;
        document.body.appendChild(d);
        d.querySelector('#rev-cancelar').onclick = () => d.close();
        d.querySelector('#f-rev').addEventListener('submit', async e => {
          e.preventDefault();
          const err = d.querySelector('#rev-err');
          if (!window.crypto || !crypto.subtle) { err.textContent = 'Abre el sitio desde su dirección web (https) para usar el modo de revisión.'; err.classList.remove('oculto'); return; }
          const h = await sha256(d.querySelector('#rev-u').value.trim().toLowerCase() + ':' + d.querySelector('#rev-p').value);
          if (h !== HUELLA) { err.textContent = 'Usuario o contraseña incorrectos.'; err.classList.remove('oculto'); return; }
          ses.set(K_ACTIVO, '1'); d.close(); location.reload();
        });
      }
      d.showModal(); d.querySelector('#rev-u').focus();
    },

    barra(archivo) {
      const b = document.createElement('div');
      b.className = 'barra-revision no-imprimir';
      b.setAttribute('role', 'region'); b.setAttribute('aria-label', 'Modo de revisión');
      b.innerHTML = `<div class="contenedor">
        <span><b>Modo de revisión</b> Los datos de prueba reemplazan lo guardado en este navegador.</span>
        <div class="botones">
          ${archivo === 'reporte.html' || archivo === 'index.html' ? '' : '<button type="button" class="btn oro" data-r="paso">Llenar este paso</button>'}
          <button type="button" class="btn" data-r="ruta">Llenar toda la ruta</button>
          <button type="button" class="btn sec" data-r="borrar">Borrar datos de prueba</button>
          <button type="button" class="btn sec" data-r="salir">Salir</button>
        </div></div>`;
      document.body.appendChild(b);
      document.body.classList.add('con-revision');
      b.addEventListener('click', e => {
        const a = e.target.dataset.r; if (!a) return;
        if (a === 'paso') Revision.llenar(archivo);
        if (a === 'ruta') { Ruta.borrarTodo(); Ruta.guardar('alumno', DEMO); ses.set(K_AUTO, '1'); location.href = Ruta.PASOS[1].archivo; }
        if (a === 'borrar') { if (confirm('Se borrarán todos los datos guardados en este navegador.')) { Ruta.borrarTodo(); location.href = 'index.html'; } }
        if (a === 'salir') { ses.del(K_ACTIVO); ses.del(K_AUTO); location.reload(); }
      });
    },

    llenar(archivo) {
      if (!Ruta.alumno()) { Ruta.guardar('alumno', DEMO); ses.set(K_PASO, '1'); location.reload(); return; }
      if (typeof window.autollenar === 'function') window.autollenar();
    },

    llenarYSeguir(archivo) {
      if (archivo === 'reporte.html') { if (window.autollenar) window.autollenar(); ses.del(K_AUTO); return; }
      if (typeof window.autollenar === 'function') window.autollenar();
      const sig = Ruta.siguiente(archivo);
      setTimeout(() => { location.href = sig.archivo; }, 450);
    }
  };
  window.Revision = Revision;
})();
