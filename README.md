# Elección Vocacional

Departamento de Orientación Educativa, Plantel "Dr. Ángel Ma. Garibay Kintana", UAEMéx

Esta ruta reúne en un solo sitio, y en orden, los cuatro instrumentos de orientación vocacional. Cada paso alimenta al siguiente y al final se genera un reporte integrado listo para imprimir.

| Paso | Archivo | Qué hace |
|---|---|---|
| Inicio | `index.html` | Ficha del alumno (se captura una sola vez) y mapa de la ruta con el avance |
| 1 | `paso1-herrera-montes.html` | Cuestionario de Intereses y Aptitudes (120 reactivos) con guardado automático |
| 2 | `paso2-interpretacion.html` | Cruce con la Tabla de Combinaciones y la Tabla de Aptitudes del manual. Recibe los porcentajes del paso 1 o permite capturarlos de un test en papel |
| 3 | `paso3-evapem.html` | Perfil EVAPEM IV: 10 rasgos comparados con 80 opciones educativas |
| 4 | `paso4-optativas.html` | Catálogos de optativas de 5.º y 6.º semestre, con sugerencias según los pasos 2 y 3 |
| 5 | `paso5-mi-ruta.html` | Reporte final integrado con espacio de reflexión y firmas |

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
- `opt5`, `opt6`: catálogos de optativas.
- `areas`: áreas de conocimiento con sus carreras y los paquetes de optativas de 5.º (`opt5`) y 6.º (`opt6`, `opt6comp`).

Consulta `CAMBIOS.md` para ver qué se corrigió respecto a los repositorios anteriores.
