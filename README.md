# Centro de Estudio · IF0010 Bases de Datos II

Plataforma web de estudio que complementa al videojuego **Servidor Nocturno**. Es una página HTML independiente (HTML, CSS y JavaScript, sin frameworks).

- **Estudiar:** 44 temas en 10 unidades, tomados de las Guías #1 a #13, el programa del curso y el resumen de las investigaciones finales.
- **Practicar:** 275 preguntas: selección única, verdadero o falso, aplicación numérica y comprensión. Cada una tiene dificultad y explicación.
- **Ejercicios prácticos generados:** concurrencia, grafo de precedencia, recuperabilidad, marcas de tiempo, cadena de respaldos, recuperación con el log y árboles de consulta. Se crean nuevos cada vez y se corrigen solos.
- **Simulacro de examen:** de 10 a 20 preguntas teóricas más 10 ejercicios prácticos (concurrencia, planificación, respaldo, recuperación, optimización de consultas y MongoDB), con nota al entregar.
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
js/datos-preguntas.js preguntas (o[0] = correcta; la app reparte posiciones A-D)
js/datos-sql.js       bases de práctica y ejercicios SQL
js/datos-mongo.js     colecciones y ejercicios MongoDB
js/motor-sql.js       traducción T-SQL, ejecución y calificación
js/motor-mongo.js     intérprete MQL y calificación
js/practico.js        generadores de ejercicios prácticos
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
