# Centro de Estudio · IF0010 Bases de Datos II

Plataforma web de estudio que complementa al videojuego **Servidor Nocturno**. Es una página HTML independiente (HTML, CSS y JavaScript, sin frameworks).

- **Alcance: Examen 3 (Guías #8 a #13).** `js/examen3.js` deja visibles solo esos temas en toda la plataforma.
- **Estudiar:** 14 temas en 5 unidades: transacciones y concurrencia, planificación, respaldo y recuperación, optimización, BD distribuidas y MongoDB.
- **Practicar:** solo temas del Examen 3 (Guías #8 a #13): 95 preguntas de selección única, verdadero o falso, aplicación y comprensión, más los ejercicios prácticos generados. Cada una tiene dificultad y explicación.
- **Ejercicios prácticos generados:** concurrencia, grafo de precedencia, recuperabilidad, marcas de tiempo, cadena de respaldos, recuperación con el log y árboles de consulta. Se crean nuevos cada vez y se corrigen solos.
- **Variedad en Practicar y Simulacro:** banco ampliado (263 preguntas del Examen 3, `js/preguntas-extra.js`) y preguntas generadas con valores al azar (`js/teoria-gen.js`). Cada intento muestra primero las preguntas menos vistas y baraja las opciones.
- **Simulacro de examen:** de 10 a 20 preguntas teóricas más 10 ejercicios prácticos (concurrencia, planificación, respaldo, recuperación, optimización de consultas y MongoDB), con nota al entregar.
- **Examen de prueba (MV):** las 80 preguntas del examen de prueba de Mediación Virtual en 4 bloques de 20 que mezclan temas (más uno aleatorio), cada uno con parte práctica (2 de planificación y 5 de escribir código SQL y MongoDB). Sin tiempo. (`js/examen-mv.js`)
- **Laboratorio SQL:** 25 ejercicios, solo de los temas prácticos del examen: concurrencia y transacciones, respaldo y recuperación, y optimización de consultas. Las consultas se ejecutan en SQLite (sql.js) adaptando la sintaxis de SQL Server; las instrucciones de administración se revisan por su estructura.
- **Laboratorio MongoDB:** 27 ejercicios con un intérprete MQL propio. Se compara el resultado o la colección final.
- **Mi progreso:** se guarda en el navegador (`localStorage`).
- **Cobertura del temario:** matriz documento, tema, subtema y sección (también en `COBERTURA.md`).

El punto y coma final, las mayúsculas, los acentos y los espacios no afectan la calificación.

## Estructura

```
index.html            página principal
css/estilo.css        estilos
js/datos-estudio*.js  contenido de estudio y matriz de cobertura
js/examen3.js         filtra la plataforma a las Guías #8 a #13
js/datos-preguntas.js preguntas (o[0] = correcta; la app reparte posiciones A-D)
js/datos-sql.js       bases de práctica y ejercicios SQL
js/datos-mongo.js     colecciones y ejercicios MongoDB
js/motor-sql.js       traducción T-SQL, ejecución y calificación
js/motor-mongo.js     intérprete MQL y calificación
js/practico.js        generadores de ejercicios prácticos
js/preguntas-extra.js banco adicional de preguntas (Practicar y Simulacro)
js/teoria-gen.js      preguntas teóricas generadas al azar
js/app.js             rutas, vistas, buscador y progreso
vendor/               sql.js 1.10.3 (SQLite en WebAssembly)
```

## Probar en local

El simulador SQL carga un archivo `.wasm`, así que hay que servir la carpeta por HTTP:

```
python -m http.server 8000
```

y abrir `http://localhost:8000`.

## ¿Por qué un repositorio aparte?

El service worker del juego (`sw.js`) responde cualquier navegación dentro de `/servidor-nocturno/` con el `index.html` del juego. Si esta página estuviera en una subcarpeta del juego, quien ya hubiera abierto el juego vería el juego en lugar del Centro de Estudio. Publicada en su propio repositorio, funciona de forma independiente y el juego no se modifica.
