# Cambios respecto a los repositorios anteriores

Esta ruta une `cuestionario-vocacional-herrera-y-montes-actualizado`, `interpretacion-de-HM`, `perfil-vocacional-evapem`, `Explorador-de-Optativas-y-Carreras` y el catálogo de 6.º de `programa_SOE_5to_CBU2024`.

## Paso 1 · Cuestionario Herrera y Montes
Se revisaron los 120 reactivos contra el *Manual para la interpretación del perfil vocacional de intereses y aptitudes Herrera y Montes* (2012). Cinco reactivos se corrigieron:

| Sección | # | Antes | Ahora | Motivo |
|---|---|---|---|---|
| Intereses | 12 | …coordinator de un equipo… | …coordinador de un equipo… | Errata |
| Intereses | 35 | Ser un miembro activo y participativo en una comunidad estudiantil. | Ser miembro activo de una agrupación musical (banda, coro, orquesta o ensamble). | Suma a la columna Musical |
| Intereses | 50 | Atender y rescatar animales en un refugio o clínica veterinaria. | Atender animales en un rancho, granja o santuario durante las vacaciones. | Suma a Aire Libre; el manual dice "en un rancho" |
| Aptitudes | 54 | Colaborar investigando para un proyecto documental, ensayo académico o libro. | Colaborar en la elaboración de un libro, revista o proyecto sobre el arte en la arquitectura. | Suma a Artístico Plástica |
| Aptitudes | 59 | Motivar a tus compañeros de equipo para que cumplan con sus tareas. | Guiar a las personas para que obtengan resultados prácticos y concretos. | Se recupera el reactivo del manual (columna MC) |

Además:
- Se guarda el avance después de cada respuesta y se puede continuar tras recargar la página.
- Se puede contestar con el teclado (teclas 0 a 4).
- Se eliminaron las ventanas emergentes (`alert`).
- No se pueden ver los resultados si queda alguna pregunta sin contestar.
- Los niveles de interés y de aptitud se interpretan con los rangos del manual.

## Paso 2 · Interpretación
- Recibe los porcentajes del paso 1 de forma automática; ya no se copian a mano. Se conserva la captura manual para quien contestó el test en papel.
- Las tablas se tomaron **directamente del documento de interpretación**. La versión anterior tenía 45 combinaciones, varias con contenido distinto del manual; el manual trae 31.
- Si la combinación del alumno no está en la tabla, se avisa y se usa la combinación más cercana entre sus intereses más altos.
- Se corrigió la separación de carreras. Antes salían pegadas, como "Educación. Medicina", "Economía. Ingeniería Industrial" o "…Sustentable Lenguas".
- Se eliminaron las carreras repetidas y se unificaron los nombres. Por ejemplo, "Ing. Mecatrónica", "Ingeniería Mecatrónica" y "Mecatrónica" quedaron como "Ingeniería en Mecatrónica". No se agregó ni se quitó ninguna carrera.
- Se reparó la fila 8–7, que estaba partida en dos en el documento ("Ingeniería en Sistemas" / "Energéticos Sustentable").
- Empates: el interés más alto ya no se puede descartar; solo se elige entre los que empatan. El reporte no aparece hasta resolver los empates.
- Se agregó la sección "Aparecen en ambas tablas", con las carreras donde coinciden interés y aptitud.

## Paso 3 · EVAPEM
- **Fórmula de afinidad corregida.** Antes era `coincidencias ÷ rasgos que pide la carrera`, con lo que una ingeniería (33 rasgos) no podía pasar del 30 % e Historia (13 rasgos) llegaba al 77 %. Ahora es `coincidencias ÷ mín(10, rasgos que pide la carrera)`, así que todas las carreras pueden llegar al 100 %.
- Ya no se pueden marcar más de 10 rasgos, y los resultados aparecen solo con 10 exactos.
- Se marcan con ◆ las carreras que tienen el mismo perfil en EVAPEM, para explicar por qué empatan.
- Se corrigieron erratas: Biotecnología, Relaciones Económicas Internacionales, Administración Pública, Sistemas y Comunicaciones, Producción Industrial.
- La gráfica de pastel se cambió por barras ordenadas.

## Paso 4 · Optativas
- Incluye los dos catálogos: 5.º semestre (del Explorador) y 6.º semestre (de la Misión Especial del SOE 5.º). El catálogo se elige solo según el semestre del alumno.
- Sugiere las áreas y las optativas que más coinciden con las carreras que salieron en los pasos 2 y 3.
- El buscador solo busca en los nombres de las carreras; antes también encontraba palabras en los textos explicativos.
- **Por validar:** los paquetes de optativas de 6.º por área son una propuesta nueva. Se encuentran en `assets/datos.js` → `areas[].opt6`.

## General
- Nuevo diseño de sitio web, igual en todas las páginas: menú superior, línea de la ruta con las 5 estaciones (se llena conforme el alumno avanza) y pie de página.
- Las fuentes vienen incluidas en el repositorio, así que no dependen de Google Fonts.
- Ya no se usa Tailwind CDN ni Chart.js, para que las páginas no fallen si esos servicios cambian.
- Se hicieron ajustes de accesibilidad: foco visible, botones accesibles con teclado y textos para lectores de pantalla.
