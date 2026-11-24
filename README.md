# Elección Vocacional

Departamento de Orientación Educativa, Plantel "Dr. Ángel Ma. Garibay Kintana", UAEMéx

Esta ruta reúne en un solo sitio, y en orden, los instrumentos de orientación vocacional. Cada paso alimenta al siguiente y al final se genera un reporte integrado listo para imprimir.

| Paso | Archivo | Qué hace |
|---|---|---|
| Tus datos | `index.html` | Ficha del alumno (se captura una sola vez) y mapa de la ruta con el avance |
| 1 | `herrera-montes.html` | Cuestionario de Intereses y Aptitudes (120 reactivos) con guardado automático |
| 2 | `interpretacion.html` | Cruce con la Tabla de Combinaciones y la Tabla de Aptitudes del manual. Recibe los porcentajes del paso 1 o permite capturar un test en papel |
| 3 | `chaside.html` | Test CHASIDE: 98 preguntas de sí o no, calificadas con el cuadro de áreas del formato |
| 4 | `holland.html` | Test de Intereses Profesionales de Holland: partes A a D y código de tres letras |
| 5 | `evapem.html` | Perfil EVAPEM IV: 10 rasgos comparados con 80 opciones educativas |
| 6 | `optativas.html` | Catálogos de optativas de 5.º y 6.º, con sugerencias que combinan los resultados de todos los tests |
| 7 | `reporte.html` | Reporte final integrado con espacio de reflexión y firmas |

## Cómo publicarla
1. Sube el contenido de esta carpeta a la raíz de un repositorio.
2. En GitHub: **Settings → Pages → Branch: `main` / carpeta `/ (root)`**.
3. La ruta queda en `https://<usuario>.github.io/<repositorio>/`.

No necesita servidor ni base de datos. No depende de servicios externos: las gráficas se dibujan con CSS y las fuentes (Bricolage Grotesque y Source Sans 3, licencia SIL OFL) están incluidas en `assets/fuentes/`.

## Diseño
Toda la ruta usa una sola hoja de estilos, `assets/estilos.css`. Los colores se definen al inicio, en `:root`: azul tinta `#0E1B33`, cobalto `#2346D8`, ámbar `#F0B429` y gris niebla `#F3F5F8`. Si los cambias ahí, cambia todo el sitio.

## Privacidad
Las respuestas se guardan solo en el navegador del alumno (`localStorage`) y no se envían a ningún lado. En el inicio hay un botón para borrar los datos; conviene usarlo en computadoras compartidas.

## Dónde editar el contenido
Todo el contenido está en `assets/datos.js`:
- `preguntasInt`, `preguntasApt`: los 60 + 60 reactivos. La columna de cada reactivo se obtiene con `(número − 1) mod 10`, igual que en la hoja de respuestas del manual.
- `comb`: Tabla de Combinaciones de intereses (31 combinaciones, tal como vienen en el manual).
- `aptOpc`: Tabla de Aptitudes con Opciones Educativas.
- `evapem`: perfil de rasgos de las 80 opciones educativas.

CHASIDE y Holland están en `assets/datos-tests.js`: preguntas, claves de calificación, descripciones y carreras de ejemplo.
- `opt5`, `opt6`: catálogos de optativas.
- `areas`: áreas de conocimiento con sus carreras y los paquetes de optativas de 5.º (`opt5`) y 6.º (`opt6`, `opt6comp`).

Consulta `CAMBIOS.md` para ver qué se corrigió respecto a los repositorios anteriores.

## Agregar o reordenar pasos
El orden de la ruta está en `assets/ruta.js` (lista `PASOS`). La numeración, la línea de estaciones y los botones "Continuar" se calculan solos a partir de esa lista.

## Modo de revisión
En el pie de cualquier página está el enlace **Acceso de revisión**. Con el usuario y la contraseña del orientador(a) aparece una barra para:
- **Llenar este paso** con respuestas de prueba.
- **Llenar toda la ruta**, que recorre los 7 pasos sola y termina en el reporte.
- **Borrar datos de prueba** y **Salir**.

El modo dura hasta cerrar el navegador. Los datos de prueba reemplazan lo guardado en ese navegador, así que no lo uses en el equipo de un alumno.

Como el sitio es estático, la contraseña solo evita que un alumno entre por accidente; no protege información, porque este modo no da acceso a datos de nadie. Para cambiarla, abre la consola del navegador en el sitio y ejecuta:

```js
crypto.subtle.digest('SHA-256', new TextEncoder().encode('usuario:NuevaContraseña')).then(b => console.log([...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('')))
```

Copia el resultado en la constante `HUELLA` de `assets/revision.js`. El usuario se escribe en minúsculas.
