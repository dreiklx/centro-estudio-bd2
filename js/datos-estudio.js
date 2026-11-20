/* =====================================================================
   CONTENIDO DE ESTUDIO · IF0010 Bases de Datos II
   Fuente de verdad: Guías de trabajo #1 a #13, Programa del curso y
   "Resumen de las investigaciones" (11 investigaciones finales).
   Cada tema declara sus fuentes y la lista "cubre" alimenta la matriz
   de cobertura (documento, tema, subtema).
   ===================================================================== */
(function () {
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  // Bloque de código (lang: sql | mongo | txt)
  function C(code, lang) { return '<pre class="code" data-lang="' + (lang || 'sql') + '"><code>' + esc(code.replace(/^\n/, '').replace(/\s+$/, '')) + '</code></pre>'; }
  // Tabla: cabeceras y filas (HTML permitido en celdas)
  function TB(h, rows) {
    return '<div class="tabla-wrap"><table class="t"><thead><tr>' + h.map(function (x) { return '<th>' + x + '</th>'; }).join('') +
      '</tr></thead><tbody>' + rows.map(function (r) { return '<tr>' + r.map(function (x) { return '<td>' + x + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
  }
  function BOX(tipo, html) { return '<div class="box ' + tipo + '">' + html + '</div>'; }
  // Tarjetas de conceptos clave: [[titulo, texto], ...]
  function K(items) { return '<div class="clave">' + items.map(function (i) { return '<div><b>' + i[0] + '</b><p>' + i[1] + '</p></div>'; }).join('') + '</div>'; }
  // Diagrama lineal sencillo: ['A','B','C']
  function D(nodos) { return '<div class="diagrama">' + nodos.map(function (n) { return '<span class="nodo">' + n + '</span>'; }).join('<span class="flecha" aria-hidden="true">→</span>') + '</div>'; }
  window.EH = { esc: esc, C: C, TB: TB, BOX: BOX, K: K, D: D };

  var FUENTES = {
    PR: 'Programa del curso IF0010 (II-2026)',
    G1: 'Guía #1 · Introducción a la administración de BD',
    G2: 'Guía #2 · Organización física de archivos',
    G3: 'Guía #3 · Índices',
    G4: 'Guía #4 · Seguridad de los datos',
    G5: 'Guía #5 · Técnicas de programación en SQL',
    G6: 'Guía #6 · Procedimientos almacenados',
    G7: 'Guía #7 · Triggers',
    G8: 'Guía #8 · Concurrencia',
    G9: 'Guía #9 · Planificación de las transacciones',
    G10: 'Guía #10 · Respaldo y recuperación',
    G11: 'Guía #11 · Optimización de consultas',
    G12: 'Guía #12 · Bases de datos distribuidas',
    G13: 'Guía #13 · MongoDB',
    INV: 'Resumen de las investigaciones finales'
  };
  var CORTO = { PR: 'Programa', G1: 'Guía #1', G2: 'Guía #2', G3: 'Guía #3', G4: 'Guía #4', G5: 'Guía #5', G6: 'Guía #6', G7: 'Guía #7', G8: 'Guía #8', G9: 'Guía #9', G10: 'Guía #10', G11: 'Guía #11', G12: 'Guía #12', G13: 'Guía #13', INV: 'Investigaciones' };

  var UNIDADES = [
    { id: 'u1', n: 1, titulo: 'Administración de BD y repaso de SQL', desc: 'El DBA, sus herramientas y el SQL que usan todas las guías.' },
    { id: 'u2', n: 2, titulo: 'Almacenamiento e índices', desc: 'Medios, RAID, organización de archivos, factor de bloqueo e índices.' },
    { id: 'u3', n: 3, titulo: 'Seguridad de la base de datos', desc: 'Tríada CIA, control de acceso, cifrado, PKI, permisos y roles.' },
    { id: 'u4', n: 4, titulo: 'Programación en T-SQL', desc: 'Variables, estructuras de control, excepciones y funciones.' },
    { id: 'u5', n: 5, titulo: 'Procedimientos, triggers y transacciones', desc: 'Procedimientos almacenados, cursores, triggers, ACID, concurrencia y planificación.' },
    { id: 'u6', n: 6, titulo: 'Respaldo y recuperación', desc: 'Tipos de fallas, modelos de recuperación, BACKUP y RESTORE.' },
    { id: 'u7', n: 7, titulo: 'Optimización de consultas', desc: 'Proceso de optimización, heurísticas, costos y planes de ejecución.' },
    { id: 'u8', n: 8, titulo: 'Bases de datos distribuidas', desc: 'Fragmentación, replicación, 2PC y servidores vinculados.' },
    { id: 'u9', n: 9, titulo: 'NoSQL y MongoDB', desc: 'Modelo de documentos y el lenguaje MQL.' },
    { id: 'u10', n: 10, titulo: 'Investigaciones finales', desc: 'Contenido del resumen de las 11 investigaciones del curso.' }
  ];

  var T = [];
  function tema(o) { T.push(o); }

  /* ============================ UNIDAD 1 ============================ */
  tema({
    id: 'dba', u: 'u1', titulo: 'El administrador de bases de datos (DBA)', min: 4,
    resumen: 'Quién es el DBA y cuáles son sus 15 funciones según la guía.',
    fuentes: ['G1', 'PR'],
    cubre: [['G1', 'Administrador de Bases de Datos (DBA)', 'Definición del DBA'], ['G1', 'Funciones del DBA', 'Las 15 funciones'], ['PR', '1. Introducción a la administración de BD', '1.1 Enfoque de la administración de datos · 1.2 El DBA · 1.3 Responsabilidades']],
    html: function () {
      return '<h2>¿Qué es un DBA?</h2>' +
        '<p>El <b>Administrador de Bases de Datos (DBA)</b> es el profesional encargado de la <b>gestión, mantenimiento, optimización y seguridad</b> de las bases de datos de una organización.</p>' +
        BOX('info', '<b>Su objetivo</b>Garantizar la <b>disponibilidad</b>, la <b>integridad</b> y el <b>rendimiento</b> de los datos.') +
        '<h2>Funciones del DBA</h2><p>La guía enumera 15 funciones. Agruparlas por área ayuda a recordarlas:</p>' +
        TB(['Área', 'Funciones'], [
          ['Diseño', '1. Definir la estructura lógica y física de la BD.<br>2. Modelar datos (UML o diagramas entidad-relación).'],
          ['Instalación y operación', '3. Instalar y configurar el DBMS.<br>4. Garantizar el correcto funcionamiento de la BD.<br>5. Aplicar actualizaciones y parches de seguridad.'],
          ['Seguridad', '6. Definir roles y permisos de usuarios.<br>7. Implementar medidas como cifrado y autenticación.'],
          ['Rendimiento', '8. Monitorear la eficiencia de las consultas SQL.<br>9. Usar indexación, particionamiento y caché.'],
          ['Respaldo y recuperación', '10. Implementar respaldos periódicos.<br>11. Configurar planes de recuperación ante desastres.'],
          ['Monitoreo y soporte', '12. Usar herramientas para supervisar el estado de la BD.<br>13. Automatizar tareas repetitivas con scripts.<br>14. Diagnosticar y resolver problemas de desempeño o corrupción.<br>15. Brindar soporte a desarrolladores y usuarios finales.']
        ]) +
        BOX('tip', '<b>Para recordar</b>El programa del curso pide <i>describir las funciones y responsabilidades del DBA y las herramientas que utiliza</i>. Las herramientas están en el siguiente tema.');
    }
  });

  tema({
    id: 'herramientas', u: 'u1', titulo: 'Herramientas del DBA y SGBD SQL / NoSQL', min: 6,
    resumen: 'DBMS, herramientas de administración, respaldo y scripting; comparación de motores SQL y NoSQL.',
    fuentes: ['G1'],
    cubre: [['G1', 'Herramientas utilizadas por un DBA', 'DBMS SQL y NoSQL'], ['G1', 'Herramientas utilizadas por un DBA', 'Administración y monitoreo (OEM, pgAdmin, SSMS, Workbench)'], ['G1', 'Herramientas utilizadas por un DBA', 'Copia de seguridad (pgBackRest, RMAN, mysqldump)'], ['G1', 'Herramientas utilizadas por un DBA', 'Lenguajes y scripting'], ['G1', 'Características de los DBMS SQL', 'Tabla comparativa MySQL, PostgreSQL, MariaDB, SQL Server, Oracle'], ['G1', 'Características de los DBMS NoSQL', 'Tabla comparativa MongoDB, Cassandra, Redis, DynamoDB, Cosmos DB']],
    html: function () {
      return '<h2>Cuatro grupos de herramientas</h2>' +
        TB(['Grupo', 'Ejemplos'], [
          ['1. Sistemas de gestión (DBMS)', '<b>SQL:</b> MySQL, PostgreSQL, MariaDB, Microsoft SQL Server, Oracle Database.<br><b>NoSQL:</b> MongoDB, Cassandra, Redis, Firebase, CouchDB.'],
          ['2. Administración y monitoreo', 'Oracle Enterprise Manager (Oracle) · pgAdmin (PostgreSQL) · SQL Server Management Studio, SSMS (SQL Server) · MySQL Workbench (MySQL).'],
          ['3. Copia de seguridad y recuperación', 'pgBackRest (PostgreSQL) · RMAN, Recovery Manager (Oracle) · mysqldump (MySQL/MariaDB).'],
          ['4. Lenguajes y scripting', 'SQL y PL/SQL para consultas y procedimientos · Python, Bash y PowerShell para automatizar.']
        ]) +
        '<h2>DBMS de tipo SQL</h2>' +
        TB(['Característica', 'MySQL', 'PostgreSQL', 'MariaDB', 'SQL Server', 'Oracle'], [
          ['Licencia', 'GPL (open source)', 'PostgreSQL License (open source)', 'GPL (open source)', 'Propietaria (gratis: Express)', 'Propietaria (gratis: XE)'],
          ['Escalabilidad', 'Media', 'Alta', 'Media', 'Alta', 'Muy alta'],
          ['Seguridad', 'Media (SSL, roles)', 'Alta (roles avanzados, cifrado)', 'Media (SSL, roles)', 'Alta (cifrado TDE, auditoría)', 'Muy alta (TDE, auditoría, RBAC)'],
          ['Facilidad de uso', 'Alta', 'Media', 'Alta', 'Media (requiere T-SQL)', 'Baja (complejo pero potente)'],
          ['Consultas complejas', 'Medio', 'Alto', 'Medio', 'Alto', 'Muy alto'],
          ['Usos comunes', 'Web, blogs, sistemas pequeños', 'Analíticos, geoespaciales, empresariales', 'Como MySQL, más rendimiento en escritura', 'Empresas, aplicaciones transaccionales', 'Grandes empresas, bancos, misión crítica']
        ]) +
        K([['MySQL / MariaDB', 'Ideales para aplicaciones web y startups por su facilidad de uso y rendimiento en lectura.'], ['PostgreSQL', 'Más robusto para sistemas analíticos, geoespaciales y empresariales que exigen integridad y seguridad.'], ['SQL Server', 'Excelente para empresas en entornos Windows que se integran con herramientas de Microsoft.'], ['Oracle', 'El SGBD más potente y escalable: grandes empresas, bancos, misión crítica.']]) +
        '<h2>DBMS de tipo NoSQL</h2>' +
        TB(['Motor', 'Modelo de datos', 'Licencia', 'Lenguaje / acceso', 'Destaca en'], [
          ['MongoDB', 'Documentos (JSON/BSON)', 'Open source (SSPL)', 'MongoDB Query Language (MQL)', 'Apps web y análisis con estructuras flexibles'],
          ['Cassandra', 'Clave-columna', 'Apache 2.0', 'CQL (similar a SQL)', 'Big Data, alta disponibilidad, entornos distribuidos'],
          ['Redis', 'Clave-valor', 'BSD', 'Comandos clave-valor', 'En memoria, extremadamente rápido: cachés y sesiones'],
          ['Amazon DynamoDB', 'Clave-valor y documentos', 'Propietaria (AWS)', 'API RESTful y AWS SDK; seguridad con IAM', 'Nube con alta demanda, escala automática'],
          ['Azure Cosmos DB', 'Documentos, clave-valor, columnar, grafo', 'Propietaria (Microsoft)', 'SQL, API de MongoDB, Gremlin (grafos); Azure AD', 'Aplicaciones empresariales globales en la nube']
        ]) +
        BOX('warn', '<b>Confusión frecuente</b>Redis es <b>clave-valor en memoria</b> (caché); Cassandra es <b>clave-columna</b> para Big Data. No los intercambie.');
    }
  });

  tema({
    id: 'sql-consultas', u: 'u1', titulo: 'Repaso SQL: consultas SELECT sobre el Supermercado', min: 7,
    resumen: 'El modelo Supermercado de la Guía #1 y las consultas SELECT con WHERE, IN, BETWEEN y ORDER BY.',
    fuentes: ['G1', 'G11'],
    cubre: [['G1', 'Ejercicio en clase', 'Esquema relacional del Supermercado (tipos, claves, relaciones)'], ['G1', 'Ejercicio en clase', 'Consultas: productos de la categoría 1 y productos de menos de 1000'], ['G11', 'Estrategias de optimización', 'BETWEEN para rangos de fechas']],
    html: function () {
      return '<p>La Guía #1 parte de lo aprendido en Fundamentos de Bases de Datos: crear la BD de un <b>Supermercado</b> en MySQL Workbench y en SQL Server Management Studio, insertar datos y consultarlos. Este es el modelo que usa el <b>Laboratorio SQL</b>.</p>' +
        '<h2>El modelo Supermercado</h2>' +
        TB(['Tabla', 'Columnas (PK subrayada)', 'Relación'], [
          ['CLIENTES', '<u>ID_CLIENTE</u>, NOMBRE, DIRECCION, TELEFONO', 'Un cliente tiene muchas facturas'],
          ['FACTURAS', '<u>ID_FACTURA</u>, FECHA, ID_CLIENTE (FK)', 'Una factura tiene muchas ventas'],
          ['VENTAS', '<u>ID_VENTA</u>, ID_FACTURA (FK), ID_PRODUCTO (FK), CANTIDAD', 'Detalle: qué producto y cuánto'],
          ['PRODUCTOS', '<u>ID_PRODUCTO</u>, DESCRIPCION, PRECIO, ID_CATEGORIA (FK), ID_PROVEEDOR (FK)', 'Pertenece a una categoría y un proveedor'],
          ['CATEGORIAS', '<u>ID_CATEGORIA</u>, DESCRIPCION', 'Una categoría agrupa muchos productos'],
          ['PROVEEDORES', '<u>ID_PROVEEDOR</u>, NOMBRE, DIRECCION, TELEFONO', 'Un proveedor surte muchos productos']
        ]) +
        D(['CLIENTES', 'FACTURAS', 'VENTAS', 'PRODUCTOS']) +
        '<h2>Estructura de un SELECT</h2>' +
        C('SELECT columnas        -- qué columnas mostrar (* = todas)\nFROM tabla             -- de dónde\nWHERE condición        -- qué filas (opcional)\nORDER BY columna DESC; -- en qué orden (opcional)') +
        '<h3>Ejemplos de la Guía #1</h3>' +
        C('-- Todos los productos que pertenecen a la categoría 1\nSELECT * FROM PRODUCTOS WHERE ID_CATEGORIA = 1;\n\n-- Todos los productos que valen menos de 1000\nSELECT * FROM PRODUCTOS WHERE PRECIO < 1000;') +
        '<h2>Operadores para filtrar</h2>' +
        TB(['Operador', 'Significado', 'Ejemplo'], [
          ['<code>=</code> <code>&lt;&gt;</code>', 'Igual / distinto', '<code>ID_CATEGORIA &lt;&gt; 2</code>'],
          ['<code>&lt;</code> <code>&gt;</code> <code>&lt;=</code> <code>&gt;=</code>', 'Comparaciones', '<code>PRECIO &gt;= 1000</code>'],
          ['<code>AND</code> / <code>OR</code>', 'Ambas condiciones / al menos una', '<code>ID_CATEGORIA = 2 AND PRECIO &gt; 1000</code>'],
          ['<code>IN (…)</code>', 'Pertenece a una lista', '<code>ID_CATEGORIA IN (1, 3)</code>'],
          ['<code>BETWEEN a AND b</code>', 'Rango inclusivo', "<code>FECHA BETWEEN '2026-09-01' AND '2026-09-30'</code>"]
        ]) +
        '<h2>Ordenar resultados</h2>' +
        C('SELECT DESCRIPCION, PRECIO\nFROM PRODUCTOS\nORDER BY PRECIO DESC;   -- DESC: mayor a menor; ASC (por defecto): menor a mayor') +
        BOX('info', '<b>Textos y fechas</b>Van entre comillas simples: <code>\'Guápiles\'</code>, <code>\'2026-09-15\'</code>. En SQL Server el prefijo <code>N\'…\'</code> indica texto Unicode.') +
        BOX('tip', '<b>Punto y coma</b>El <code>;</code> final es opcional en SQL Server y en este Centro de Estudio no afecta la calificación.');
    }
  });

  tema({
    id: 'sql-join', u: 'u1', titulo: 'Repaso SQL: JOIN, agregados, TOP y subconsultas', min: 8,
    resumen: 'Unir tablas, contar y sumar con GROUP BY, ranking con TOP, subconsultas y funciones de fecha.',
    fuentes: ['G1', 'G5', 'G6', 'G11'],
    cubre: [['G1', 'Ejercicio en clase', 'Facturas del cliente 1 con el nombre de los productos (JOIN)'], ['G6', 'Ejercicios', 'Total de factura (SUM precio × cantidad), facturas por cliente, clientes sin compras'], ['G5', 'Ejercicios de funciones de tabla', 'Ranking de productos más vendidos (TOP) y ventas por mes'], ['G11', 'Estrategias de optimización', 'Subconsulta IN frente a JOIN; EXISTS'], ['G6', 'Ejercicios', 'Eliminar facturas con más de N días (DATEDIFF)']],
    html: function () {
      return '<h2>JOIN: combinar tablas</h2><p>Un <b>JOIN</b> une filas de dos tablas cuando se cumple una condición, normalmente <b>clave foránea = clave primaria</b>.</p>' +
        C('-- Facturas del cliente 1 con el nombre de los productos comprados (Guía #1)\nSELECT F.ID_FACTURA, F.FECHA, P.DESCRIPCION\nFROM FACTURAS F\nJOIN VENTAS V    ON V.ID_FACTURA  = F.ID_FACTURA\nJOIN PRODUCTOS P ON P.ID_PRODUCTO = V.ID_PRODUCTO\nWHERE F.ID_CLIENTE = 1;') +
        BOX('info', '<b>Alias</b><code>FACTURAS F</code> le da el nombre corto <code>F</code> a la tabla. Así se escribe <code>F.FECHA</code> y se evita la ambigüedad cuando dos tablas tienen columnas con el mismo nombre (por ejemplo, <code>DESCRIPCION</code> en PRODUCTOS y CATEGORIAS).') +
        '<h2>Funciones de agregado y GROUP BY</h2>' +
        TB(['Función', 'Devuelve'], [['<code>COUNT(*)</code>', 'Cantidad de filas'], ['<code>SUM(expr)</code>', 'Suma'], ['<code>AS nombre</code>', 'Pone nombre a la columna calculada']]) +
        C('-- Total de la factura 1: precio × cantidad (Guía #6, ejercicio 2)\nSELECT SUM(P.PRECIO * V.CANTIDAD) AS TOTAL\nFROM VENTAS V\nJOIN PRODUCTOS P ON P.ID_PRODUCTO = V.ID_PRODUCTO\nWHERE V.ID_FACTURA = 1;\n\n-- Cantidad de facturas por cliente\nSELECT ID_CLIENTE, COUNT(*) AS CANTIDAD\nFROM FACTURAS\nGROUP BY ID_CLIENTE;') +
        BOX('warn', '<b>Error frecuente</b>Toda columna del SELECT que no esté dentro de una función de agregado debe aparecer en el <code>GROUP BY</code>.') +
        '<h2>TOP: los primeros N</h2>' +
        C('-- Ranking: los 3 productos más vendidos (Guía #5, ejercicio 9)\nSELECT TOP 3 P.DESCRIPCION, SUM(V.CANTIDAD) AS VENDIDOS\nFROM VENTAS V\nJOIN PRODUCTOS P ON P.ID_PRODUCTO = V.ID_PRODUCTO\nGROUP BY P.DESCRIPCION\nORDER BY VENDIDOS DESC;') +
        '<p><code>TOP</code> es propio de SQL Server: sin <code>ORDER BY</code> no garantiza cuáles filas devuelve.</p>' +
        '<h2>Subconsultas</h2>' +
        C('-- Clientes sin compras: su ID no aparece en FACTURAS (Guía #6)\nSELECT NOMBRE\nFROM CLIENTES\nWHERE ID_CLIENTE NOT IN (SELECT ID_CLIENTE FROM FACTURAS);\n\n-- Productos de la categoría llamada \'Bebidas\'\nSELECT DESCRIPCION\nFROM PRODUCTOS\nWHERE ID_CATEGORIA IN (SELECT ID_CATEGORIA FROM CATEGORIAS WHERE DESCRIPCION = \'Bebidas\');') +
        '<p>La Guía #11 recomienda <b>JOIN en lugar de subconsultas correlacionadas</b> cuando sea posible, y <b>EXISTS en lugar de IN</b> para subconsultas con muchas filas.</p>' +
        '<h2>Funciones de fecha de SQL Server</h2>' +
        TB(['Función', 'Uso', 'Ejemplo'], [
          ['<code>GETDATE()</code>', 'Fecha y hora actuales', '<code>CAST(GETDATE() AS DATE)</code> → solo la fecha de hoy'],
          ['<code>YEAR(f)</code>, <code>MONTH(f)</code>', 'Año / mes de una fecha', '<code>GROUP BY MONTH(FECHA)</code>'],
          ['<code>DATEDIFF(DAY, a, b)</code>', 'Días entre dos fechas', '<code>DATEDIFF(DAY, FECHA, GETDATE()) &gt; 30</code>']
        ]) +
        C('-- Total vendido por mes en 2026 (Guía #5, ejercicio 10)\nSELECT MONTH(F.FECHA) AS MES, SUM(P.PRECIO * V.CANTIDAD) AS TOTAL\nFROM FACTURAS F\nJOIN VENTAS V    ON V.ID_FACTURA = F.ID_FACTURA\nJOIN PRODUCTOS P ON P.ID_PRODUCTO = V.ID_PRODUCTO\nWHERE YEAR(F.FECHA) = 2026\nGROUP BY MONTH(F.FECHA);');
    }
  });

  tema({
    id: 'sql-dml', u: 'u1', titulo: 'Repaso SQL: INSERT, UPDATE, DELETE y tablas', min: 7,
    resumen: 'Modificar datos y definir tablas: tipos, claves, IDENTITY, CHECK, DEFAULT y ALTER TABLE.',
    fuentes: ['G1', 'G6', 'G7', 'G11', 'G4'],
    cubre: [['G1', 'Ejercicio en clase', 'Insertar datos, aumentar 10 % el precio, eliminar facturas de hoy'], ['G1', 'Ejercicio en clase', 'Tipos de datos, campos clave y relaciones (CREATE TABLE)'], ['G7', 'Ejercicio en clase', 'ALTER TABLE ... ADD stock / total / estado; tabla con IDENTITY'], ['G11', 'Ejercicio práctico', 'CREATE DATABASE, USE, GO, FOREIGN KEY'], ['G6', 'Ejercicios', 'Actualizar precio por categoría en un porcentaje']],
    html: function () {
      return '<h2>INSERT: agregar filas</h2>' +
        C("INSERT INTO CLIENTES (ID_CLIENTE, NOMBRE, DIRECCION, TELEFONO)\nVALUES (6, 'Sofía Brenes', 'Limón', '8888-6666');") +
        '<h2>UPDATE: modificar filas</h2>' +
        C('-- Aumente un 10% el precio de los productos (Guía #1)\nUPDATE PRODUCTOS SET PRECIO = PRECIO * 1.10;\n\n-- Solo los de la categoría 2, un 5% (Guía #6, ejercicio 3)\nUPDATE PRODUCTOS SET PRECIO = PRECIO * 1.05 WHERE ID_CATEGORIA = 2;') +
        BOX('warn', '<b>Cuidado</b>Un <code>UPDATE</code> o <code>DELETE</code> <b>sin WHERE</b> afecta <b>todas</b> las filas de la tabla.') +
        '<h2>DELETE: eliminar filas</h2>' +
        C('-- Elimine las facturas con fecha de hoy (Guía #1).\n-- Primero sus ventas (hijas), después las facturas (padres):\nDELETE FROM VENTAS\nWHERE ID_FACTURA IN (SELECT ID_FACTURA FROM FACTURAS WHERE FECHA = CAST(GETDATE() AS DATE));\nDELETE FROM FACTURAS WHERE FECHA = CAST(GETDATE() AS DATE);') +
        BOX('info', '<b>¿Por qué ese orden?</b>VENTAS tiene una clave foránea hacia FACTURAS. Si se borra primero la factura, el motor rechaza la operación porque dejaría ventas apuntando a una factura inexistente (integridad referencial).') +
        '<h2>Crear tablas</h2>' +
        C("CREATE DATABASE BD_TallerOptimizacion;\nGO\nUSE BD_TallerOptimizacion;\n\nCREATE TABLE Departamentos (\n    id INT PRIMARY KEY,\n    nombre VARCHAR(100),\n    activo BIT\n);\nCREATE TABLE Empleados (\n    id INT PRIMARY KEY IDENTITY,           -- número automático\n    nombre VARCHAR(100),\n    fecha_contratacion DATE,\n    departamento_id INT,\n    salario DECIMAL(10,2),\n    FOREIGN KEY (departamento_id) REFERENCES Departamentos(id)\n);") +
        TB(['Elemento', 'Significado'], [
          ['<code>INT</code>, <code>DECIMAL(10,2)</code>, <code>VARCHAR(100)</code>, <code>DATE</code>, <code>DATETIME</code>, <code>BIT</code>', 'Tipos: entero, decimal con 2 decimales, texto, fecha, fecha-hora, 0/1'],
          ['<code>PRIMARY KEY</code>', 'Identifica cada fila (única y no nula)'],
          ['<code>IDENTITY(1,1)</code>', 'Valor automático: empieza en 1 y aumenta de 1 en 1'],
          ['<code>FOREIGN KEY … REFERENCES</code>', 'Vincula con la PK de otra tabla'],
          ['<code>NOT NULL</code>, <code>DEFAULT</code>, <code>CHECK</code>', 'Obligatorio, valor por omisión, regla de validación (p. ej. <code>CHECK (Precio &gt; 0)</code>)'],
          ['<code>GO</code>', 'Separador de lotes en SSMS (no es una instrucción SQL)']
        ]) +
        '<h2>ALTER TABLE: cambiar una tabla existente</h2>' +
        C("-- Guía #7: columnas nuevas para los ejercicios de triggers\nALTER TABLE Productos ADD stock INT NOT NULL DEFAULT 0;\nALTER TABLE Facturas  ADD total DECIMAL(10,2) NULL;\nALTER TABLE Productos ADD estado VARCHAR(20) DEFAULT 'activo';");
    }
  });

  /* ============================ UNIDAD 2 ============================ */
  tema({
    id: 'medios', u: 'u2', titulo: 'Medios y arquitecturas de almacenamiento', min: 5,
    resumen: 'Organización física, HDD, SSD, cinta, óptico; DAS, NAS, SAN, nube y almacenamiento distribuido.',
    fuentes: ['G2', 'PR'],
    cubre: [['G2', 'Organización física de archivos', 'Definición'], ['G2', 'Medios físicos', 'HDD, SSD, cintas magnéticas, CD/DVD'], ['G2', 'Otras arquitecturas', 'NAS, SAN, nube, almacenamiento distribuido'], ['G2', 'Tabla comparativa', 'DAS vs NAS vs SAN'], ['PR', '2.1', 'Almacenamiento primario, secundario y terciario']],
    html: function () {
      return '<p>La <b>organización física de archivos</b> describe cómo se guardan los datos en los dispositivos (estructura y ubicación física en memoria o disco). Afecta la eficiencia del <b>acceso</b>, la <b>manipulación</b> y la <b>gestión</b> de los archivos.</p>' +
        '<h2>Medios físicos</h2>' +
        TB(['Medio', 'Cómo funciona', 'Ventaja', 'Desventaja / uso'], [
          ['Disco duro (HDD)', 'Platos magnéticos giratorios', 'Económico; el más común para almacenamiento masivo', 'Más lento que otros medios'],
          ['Estado sólido (SSD)', 'Memoria flash, sin partes giratorias', 'Más rápido que el HDD', 'Más caro por la misma capacidad'],
          ['Cinta magnética', 'Acceso secuencial', 'Muy bajo costo', 'Lenta; para largo plazo y copias de seguridad'],
          ['Ópticos (CD/DVD)', 'Lectura láser', '—', 'Poco comunes: pequeña escala o distribuir software']
        ]) +
        BOX('info', '<b>Jerarquía del programa (2.1)</b>Almacenamiento <b>primario</b> (memoria principal, RAM), <b>secundario</b> (discos HDD/SSD) y <b>terciario</b> (cintas y ópticos para archivo y respaldo).') +
        '<h2>Arquitecturas de almacenamiento</h2>' +
        K([['NAS', 'Servidores de archivos accesibles por la red; varios dispositivos acceden a los datos de forma centralizada.'], ['SAN', 'Acceso por redes de alta velocidad; adecuado para alto rendimiento: bases de datos y grandes centros de datos.'], ['Nube', 'Servidores remotos accesibles por internet; alta escalabilidad y acceso desde cualquier lugar.'], ['Distribuido', 'Los datos se dividen entre varios servidores; mantiene disponibilidad y redundancia (lo usan las BD distribuidas).']]) +
        TB(['', 'DAS', 'NAS', 'SAN'], [
          ['Definición', 'Conectado directamente a un servidor físico', 'Conectado a una red, accesible por IP', 'Alto rendimiento en una red dedicada'],
          ['Acceso', 'Solo desde el servidor al que está conectado', 'Por la red local (LAN), protocolo IP', 'Red de almacenamiento dedicada (Fibre Channel)'],
          ['Uso común', 'Servidores individuales, BD locales', 'Compartir archivos y carpetas', 'Entornos empresariales de alto rendimiento'],
          ['Costo', 'Bajo', 'Moderado', 'Alto'],
          ['Alta disponibilidad', 'Baja', 'Moderada', 'Alta (redundancia y conmutación por error)']
        ]);
    }
  });

  tema({
    id: 'raid', u: 'u2', titulo: 'RAID', min: 6,
    resumen: 'Niveles 0, 1, 5, 6 y 10: cómo funcionan, discos mínimos, capacidad y tolerancia a fallos.',
    fuentes: ['G2', 'PR'],
    cubre: [['G2', 'RAID', 'Definición'], ['G2', 'Niveles de RAID', 'RAID 0, 1, 5, 6, 10 (ventajas, desventajas, recomendado)'], ['G2', 'Otros niveles', 'RAID 2, 3, 4, 50, 60'], ['G2', 'Ejercicios', 'Capacidad utilizable, rendimiento y elección de RAID'], ['PR', '2.4', 'Paralelización del acceso a discos usando RAID']],
    html: function () {
      return '<p><b>RAID</b> (Redundant Array of Independent Disks) combina varios discos físicos en <b>una unidad lógica</b> para mejorar <b>rendimiento</b>, <b>redundancia</b> y <b>fiabilidad</b>.</p>' +
        '<h2>Niveles principales</h2>' +
        TB(['Nivel', 'Técnica', 'Mín. discos', 'Capacidad útil (n discos de C)', 'Soporta fallas', 'Recomendado para'], [
          ['RAID 0', 'Striping: reparte datos entre discos', '2', 'n × C (100 %)', '0: si falla uno, se pierde todo', 'Rendimiento crucial, datos no críticos (temporales)'],
          ['RAID 1', 'Mirroring: copia en espejo', '2', 'La de un solo disco (50 % con 2 discos)', '1 (el espejo conserva los datos)', 'Alta disponibilidad, no se puede perder datos'],
          ['RAID 5', 'Striping con paridad distribuida', '3', '(n − 1) × C', '1 disco', 'Equilibrio rendimiento / redundancia'],
          ['RAID 6', 'Striping con paridad doble', '4', '(n − 2) × C', '2 discos simultáneos', 'Alta disponibilidad tolerando escritura más lenta'],
          ['RAID 10 (1+0)', 'Espejo de varios stripings', '4', 'n × C ÷ 2', 'Al menos 1 (uno por espejo)', 'Alto rendimiento y alta disponibilidad']
        ]) +
        K([['RAID 0', 'Mejor lectura y escritura; usa toda la capacidad, pero sin protección.'], ['RAID 1', 'Puede mejorar la lectura; no mejora la escritura.'], ['RAID 5', 'Buena lectura; escritura más lenta por calcular la paridad. Si fallan 2 discos, se pierde todo.'], ['RAID 6', 'Mejor protección que RAID 5; escritura más lenta por la paridad adicional.'], ['RAID 10', 'Buen rendimiento en lectura y escritura; requiere el doble de discos que RAID 5.']]) +
        '<h2>Ejemplo resuelto (Guía #2, ejercicio 1)</h2><p>Un servidor tiene <b>6 discos de 2 TB</b>. Capacidad utilizable:</p>' +
        TB(['Nivel', 'Cálculo', 'Resultado'], [['RAID 0', '6 × 2', '<b>12 TB</b>'], ['RAID 1', 'Espejo: se guarda todo dos veces → 12 ÷ 2', '<b>6 TB</b>'], ['RAID 5', '(6 − 1) × 2', '<b>10 TB</b>'], ['RAID 10', '12 ÷ 2', '<b>6 TB</b>']]) +
        BOX('info', '<b>Otros niveles</b>RAID 2, 3 y 4 (paridad por bits o bloques) fueron reemplazados por RAID 5 y 6. <b>RAID 50</b> = RAID 5 + RAID 0; <b>RAID 60</b> = RAID 6 + RAID 0.') +
        BOX('tip', '<b>Elegir RAID (Guía #2, ejercicio 5)</b>Servidor temporal, prioridad rendimiento → RAID 0 · Servidor pequeño que tolere 1 falla → RAID 1 · 10 discos con capacidad, rendimiento y 1 falla → RAID 5 · BD crítica, alto rendimiento y redundancia sin importar costo → RAID 10 · Tolerar 2 fallas simultáneas → RAID 6.');
    }
  });

  tema({
    id: 'memoria-organizacion', u: 'u2', titulo: 'Memoria intermedia, páginas y organización de registros', min: 6,
    resumen: 'Buffer en RAM, montículo, secuencial y hashing; páginas de 8 KB y archivos de SQL Server.',
    fuentes: ['G2', 'PR'],
    cubre: [['G2', 'Memoria intermedia', 'Páginas de datos en RAM, reemplazo de páginas, beneficios'], ['G2', 'Organización de registros', 'Montículo (Heap), Secuencial (clustered), Hashing (non-clustered)'], ['G2', 'Páginas de datos', 'Página de 8 KB; tipos: datos, índices, asignación, log'], ['G2', 'Bloques de almacenamiento', 'Definición'], ['G2', 'SQL Server', '.mdf, .ndf, .ldf, filegroups, FILEGROWTH, en memoria'], ['G2', 'Ejercicio 8', 'Heap vs organización secuencial'], ['PR', '2.2 · 2.3', 'Colocación de registros; archivos ordenados y no ordenados']],
    html: function () {
      return '<h2>Memoria intermedia (buffer)</h2>' +
        '<p>Los SGBD guardan los datos en disco, pero trabajan con ellos en <b>memoria principal (RAM)</b>. La <b>memoria intermedia</b> es la región de RAM donde se colocan las <b>páginas de datos</b> traídas del disco.</p>' +
        D(['Disco', 'Página de datos', 'Memoria intermedia (RAM)', 'Procesamiento']) +
        '<p>Cuando se llena y hay que cargar otra página, el SGBD decide cuál expulsar mediante <b>estrategias de reemplazo de páginas</b>.</p>' +
        BOX('tip', '<b>Beneficios</b>Menos accesos a disco y consultas más rápidas al mantener datos e índices en memoria.') +
        '<h2>Organización de registros en archivos</h2>' +
        TB(['Organización', 'Cómo guarda', 'Consecuencia'], [
          ['Montículo (Heap)', 'Sin índice clúster: registros <b>no ordenados</b>, se insertan donde haya espacio', 'Inserciones rápidas; ciertas operaciones (búsquedas, reportes ordenados) rinden peor'],
          ['Secuencial (Clustered Index)', 'Registros físicamente ordenados según la clave del índice clúster', 'Favorece búsquedas y reportes ordenados; la tabla se reorganiza para mantener el orden'],
          ['Hashing (Non-clustered Index)', 'Índices no clúster como mecanismo de búsqueda', 'Búsqueda eficiente sin reordenar los datos']
        ]) +
        BOX('info', '<b>Guía #2, ejercicio 8</b>Con 5 000 inserciones diarias, búsquedas por código y reportes ordenados: el <b>montículo</b> favorece las inserciones; la organización <b>secuencial</b> favorece búsquedas y reportes ordenados, pero puede requerir <b>reorganización</b> al insertar o eliminar.') +
        '<h2>Páginas y bloques en SQL Server</h2>' +
        '<p>La <b>página</b> es la unidad básica de almacenamiento en SQL Server: tamaño fijo de <b>8 KB</b>. Un <b>bloque</b> es una unidad de almacenamiento en memoria que contiene páginas.</p>' +
        TB(['Tipo de página', 'Guarda'], [['Datos', 'Filas de las tablas'], ['Índices', 'Estructuras de índices'], ['Asignación', 'Control de qué páginas pertenecen a cada tabla e índice'], ['Registro de transacciones', 'Cambios antes de ser confirmados en disco']]) +
        '<h2>Archivos de una base de SQL Server</h2>' +
        TB(['Archivo', 'Función'], [['<code>.mdf</code>', 'Archivo de datos primario'], ['<code>.ndf</code>', 'Archivos de datos secundarios'], ['<code>.ldf</code>', 'Archivo de log (registro de transacciones)']]) +
        '<ul><li>Los datos se pueden distribuir en <b>filegroups</b>.</li><li><b>FILEGROWTH</b> configura el crecimiento automático.</li><li>Soporta almacenamiento <b>en memoria</b> para mejorar el rendimiento.</li></ul>';
    }
  });

  tema({
    id: 'factor-bloqueo', u: 'u2', titulo: 'Factor de bloqueo y cálculo de bloques', min: 7,
    resumen: 'Cuántos registros caben en un bloque, cuántos bloques ocupa un archivo y cuánto espacio se desperdicia.',
    fuentes: ['G2'],
    cubre: [['G2', 'Factor de bloqueo', 'Fórmula y ejemplo 8192 / 200 = 40'], ['G2', 'Ejercicios 3, 4, 6 y 7', 'Factor de bloque, número de bloques, espacio desperdiciado, organización no extendida']],
    html: function () {
      return '<p>El <b>factor de bloqueo (BF)</b> es la cantidad de registros que caben en un bloque o página. Como no se guardan fracciones de registro (<b>organización no extendida</b>), se redondea hacia abajo.</p>' +
        TB(['Cálculo', 'Fórmula'], [
          ['Factor de bloqueo', 'BF = ⌊ tamaño del bloque ÷ tamaño del registro ⌋'],
          ['Número de bloques', 'b = ⌈ número de registros ÷ BF ⌉ (hacia arriba: el último bloque puede quedar incompleto)'],
          ['Espacio desperdiciado por bloque', 'tamaño del bloque − BF × tamaño del registro'],
          ['Registros en el último bloque', 'registros − (b − 1) × BF']
        ]) +
        '<h2>Ejemplo de la guía</h2><p>Página de 8 KB = 8 192 bytes; registro de 200 bytes → 8192 ÷ 200 = 40,96 → <b>BF = 40 registros por bloque</b>.</p>' +
        '<h2>Ejemplo resuelto paso a paso</h2><p>Guía #2, ejercicio 3: 50 000 registros PRODUCTO; campos de 40 + 12 + 60 + 8 + 4 + 8 bytes más <b>1 byte</b> marcador de borrado; bloque de 512 bytes.</p>' +
        '<ol><li>Tamaño del registro: 40 + 12 + 60 + 8 + 4 + 8 + 1 = <b>133 bytes</b>.</li><li>BF = ⌊512 ÷ 133⌋ = ⌊3,85⌋ = <b>3 registros por bloque</b>.</li><li>Bloques = ⌈50 000 ÷ 3⌉ = <b>16 667 bloques</b>.</li><li>Desperdicio por bloque = 512 − 3 × 133 = <b>113 bytes</b>.</li></ol>' +
        BOX('warn', '<b>Errores frecuentes</b>Olvidar el byte del marcador de borrado cuando el enunciado lo menciona · redondear el BF hacia arriba (no caben fracciones) · redondear los bloques hacia abajo (sobrarían registros sin bloque).') +
        BOX('info', '<b>¿Un bloque más grande siempre aprovecha mejor el espacio?</b>No. El desperdicio depende del residuo de la división: hay que calcularlo para cada tamaño (Guía #2, ejercicio 7).');
    }
  });

  tema({
    id: 'indices-tipos', u: 'u2', titulo: 'Índices en SQL Server: tipos y comandos', min: 7,
    resumen: 'Clustered, non-clustered, único y compuesto; ver, eliminar, reorganizar y reconstruir índices.',
    fuentes: ['G3', 'PR'],
    cubre: [['G3', 'Índices en SQL Server', 'Definición'], ['G3', 'Tipos de índices', 'Clustered, Non-Clustered, Único, Compuesto (ventajas y desventajas)'], ['G3', 'Comandos', 'sp_helpindex, DROP INDEX, ALTER INDEX REORGANIZE / REBUILD'], ['G3', 'Ejercicio 3', 'Índices sobre name, phone, (name, address), único en phone'], ['PR', '2.5.1', 'Índices ordenados de un solo nivel (primarios, secundarios, únicos)']],
    html: function () {
      return '<p>Un <b>índice</b> mejora el rendimiento de las consultas porque permite encontrar filas sin recorrer toda la tabla, como el índice de un libro.</p>' +
        '<h2>Tipos de índices</h2>' +
        TB(['Tipo', 'Características', 'Ventaja', 'Desventaja'], [
          ['<b>Clustered</b> (agrupado)', 'Ordena <b>físicamente</b> los datos según el índice. <b>Solo uno por tabla.</b> La clave primaria se implementa por defecto como clustered.', 'Acceso rápido a rangos; menos páginas leídas', 'Inserciones, actualizaciones y eliminaciones más costosas (hay que reorganizar)'],
          ['<b>Non-clustered</b> (no agrupado)', 'Orden distinto al de la tabla; <b>puede haber varios</b>; contiene <b>punteros</b> a las filas', 'Acelera búsquedas en columnas fuera del clustered', 'Ocupa espacio; encarece las escrituras'],
          ['<b>Único</b>', 'Valores no repetidos en una o varias columnas; puede ser clustered o non-clustered', 'Evita duplicados', '—'],
          ['<b>Compuesto</b>', 'Abarca varias columnas', 'Consultas que filtran u ordenan por varias columnas', '—']
        ]) +
        C('CREATE CLUSTERED INDEX    idx_cliente_nombre ON Clientes (Nombre);\nCREATE NONCLUSTERED INDEX idx_cliente_email  ON Clientes (Email);\nCREATE UNIQUE INDEX       idx_cliente_dni    ON Clientes (DNI);\nCREATE INDEX              idx_pedidos_fecha_cliente ON Pedidos (FechaPedido, ClienteID);') +
        BOX('info', '<b>Dato útil</b><code>CREATE INDEX</code> sin indicar tipo crea un índice <b>non-clustered</b> en SQL Server.') +
        '<h2>Administrar índices</h2>' +
        C('sp_helpindex Clientes;                              -- ver los índices de una tabla\nDROP INDEX idx_cliente_email ON Clientes;           -- eliminar\nALTER INDEX idx_cliente_nombre ON Clientes REORGANIZE; -- fragmentación baja\nALTER INDEX idx_cliente_nombre ON Clientes REBUILD;    -- fragmentación alta') +
        BOX('tip', '<b>REORGANIZE vs REBUILD</b>Si un índice está fragmentado, <b>reorganizarlo</b> mejora el rendimiento. Si la fragmentación es <b>alta</b>, conviene <b>reconstruirlo</b>.') +
        '<h2>¿Cuándo crear índices?</h2>' +
        TB(['Conviene', 'Evitar'], [
          ['Consultas con muchas búsquedas (WHERE)<br>Consultas frecuentes sobre las mismas columnas<br>Columnas usadas en JOIN, ORDER BY y GROUP BY', 'Tablas pequeñas<br>Muchas inserciones o actualizaciones (los índices las ralentizan)<br>Columnas con muchos valores repetidos (baja cardinalidad)']
        ]);
    }
  });

  tema({
    id: 'indices-multinivel', u: 'u2', titulo: 'Índices multinivel, árboles B y cálculo de accesos', min: 8,
    resumen: 'Estructura jerárquica, B-Tree con nodos raíz/intermedios/hoja y accesos con búsqueda binaria.',
    fuentes: ['G3', 'PR'],
    cubre: [['G3', 'Índice multinivel', 'Estructura y ventajas'], ['G3', 'Índices B-Tree', 'O(log n), nodo raíz, intermedios y hoja'], ['G3', 'Ejercicio 1 y 2', 'Accesos con búsqueda binaria sin índice y con índice primario'], ['PR', '2.5.2 · 2.5.3 · 2.5.4', 'Multinivel, árboles B y B+, índices en múltiples claves']],
    html: function () {
      return '<h2>Índice multinivel</h2>' +
        '<p>Estructura <b>jerárquica</b>: el primer nivel es un índice primario sobre los registros; el segundo nivel es un índice <b>sobre el primer nivel</b>, y se agregan niveles según el tamaño de los datos.</p>' +
        K([['Menos accesos a disco', 'Se revisan menos registros en cada búsqueda.'], ['Grandes volúmenes', 'Útil cuando el índice no cabe completo en memoria.'], ['Escalabilidad', 'Se agregan niveles al crecer la tabla.']]) +
        '<h2>Árbol B (B-Tree)</h2>' +
        '<p>Es la estructura más usada por SQL Server, MySQL y PostgreSQL para indexar. Es un árbol <b>balanceado</b>: búsqueda, inserción y eliminación en tiempo logarítmico <b>O(log n)</b>, sin degradarse al crecer los datos.</p>' +
        TB(['Nodo', 'Contenido'], [['Raíz', 'Punto de entrada; punteros a los nodos intermedios'], ['Intermedios', 'Claves de búsqueda y punteros a nodos hijos'], ['Hoja', 'Valores indexados o punteros a las filas; <b>enlazados entre sí</b> para recorridos ordenados']]) +
        BOX('info', '<b>Índice en múltiples claves</b>Es el índice <b>compuesto</b> del tema anterior: una sola estructura sobre varias columnas, p. ej. <code>(FechaPedido, ClienteID)</code>.') +
        '<h2>Cálculo de accesos (Guía #3, ejercicio 1)</h2>' +
        '<p>Tabla <b>ordenada</b> por el campo clave: 30 000 registros de 100 bytes, bloques de 1 024 bytes.</p>' +
        TB(['Paso', 'Sin índice', 'Con índice primario'], [
          ['1', 'Registros por bloque = ⌊1024 ÷ 100⌋ = 10', 'Entrada de índice = 9 bytes (campo) + 6 bytes (puntero) = 15 bytes'],
          ['2', 'Bloques de datos = 30 000 ÷ 10 = 3 000', 'Entradas por bloque = ⌊1024 ÷ 15⌋ = 68'],
          ['3', 'Búsqueda binaria = ⌈log₂ 3 000⌉ = <b>12 accesos</b>', 'Bloques de índice = ⌈3 000 ÷ 68⌉ = 45'],
          ['4', '', 'Búsqueda binaria en el índice = ⌈log₂ 45⌉ = 6, + 1 acceso al bloque de datos = <b>7 accesos</b>']
        ]) +
        '<p>El índice es <b>primario</b> porque se define sobre el <b>campo de ordenación</b> (clave) de un archivo ordenado; tiene una entrada por <b>bloque</b> de datos. Se ahorra algo más del 40 % de accesos.</p>' +
        BOX('tip', '<b>Truco para log₂</b>Busque la potencia de 2 que alcanza o supera el número: 2¹¹ = 2 048 &lt; 3 000 ≤ 4 096 = 2¹² → 12. Para 45: 32 &lt; 45 ≤ 64 = 2⁶ → 6.');
    }
  });

  /* ============================ UNIDAD 3 ============================ */
  tema({
    id: 'cia-amenazas', u: 'u3', titulo: 'Tríada CIA, amenazas y problemas de seguridad', min: 6,
    resumen: 'Confidencialidad, integridad y disponibilidad con sus mecanismos; amenazas internas, externas y físicas.',
    fuentes: ['G4', 'PR'],
    cubre: [['G4', 'Tríada CIA', 'Confidencialidad, integridad, disponibilidad y sus mecanismos'], ['G4', 'Amenazas', 'Internas, externas y físicas'], ['G4', 'Problemas de seguridad', 'Acceso no autorizado, fuga, falta de auditoría, permisos incorrectos, credenciales débiles'], ['PR', '3.1', 'Tipos de seguridad y amenazas']],
    html: function () {
      return '<p>La <b>tríada CIA</b> (Confidentiality, Integrity, Availability) define los tres objetivos que toda base de datos debe proteger.</p>' +
        TB(['Objetivo', 'Garantiza que…', 'Mecanismos'], [
          ['<b>Confidencialidad</b>', 'Solo personas, sistemas o procesos <b>autorizados</b> conozcan la información (salarios, contraseñas, datos bancarios…)', 'Usuario y contraseña · MFA · roles y permisos · <b>vistas</b> para ocultar columnas/filas · cifrado de datos y de comunicaciones · principio de <b>mínimo privilegio</b>'],
          ['<b>Integridad</b>', 'Los datos sean <b>correctos, completos y consistentes</b>, sin cambios no autorizados', 'Restricciones (<code>CHECK (Precio &gt; 0)</code>) · claves primarias y foráneas · permisos (SELECT sin UPDATE) · transacciones · auditoría · copias de seguridad'],
          ['<b>Disponibilidad</b>', 'Los datos estén <b>accesibles</b> para los autorizados cuando se necesiten', 'Copias de seguridad · RAID · replicación · servidores redundantes · clústeres de alta disponibilidad · UPS · monitoreo · planes de recuperación ante desastres · mantenimiento preventivo']
        ]) +
        BOX('warn', '<b>Confusión frecuente</b>Impedir que alguien <i>lea</i> un dato es confidencialidad; impedir que lo <i>modifique indebidamente</i> es integridad. Las copias de seguridad aparecen en integridad y disponibilidad.') +
        '<h2>Amenazas</h2>' +
        TB(['Tipo', 'Origen', 'Ejemplos'], [
          ['Internas', 'Usuarios con acceso legítimo', 'Robo por usuarios privilegiados · modificación maliciosa · errores humanos en permisos o eliminación accidental'],
          ['Externas', 'Actores fuera de la organización', '<b>Inyección SQL</b> · fuerza bruta para obtener credenciales · malware y ransomware'],
          ['Físicas', 'Factores no tecnológicos', 'Fallas de hardware/software · incendios o inundaciones · robo de servidores o discos']
        ]) +
        '<h2>Problemas de seguridad</h2>' +
        '<ul><li><b>Acceso no autorizado</b>: usuarios sin permisos acceden a información sensible.</li><li><b>Fuga de datos</b>: datos confidenciales expuestos por vulnerabilidades.</li><li><b>Falta de auditoría y monitoreo</b>: difícil detectar accesos sospechosos.</li><li><b>Configuración incorrecta de permisos</b>: roles mal diseñados dan accesos innecesarios.</li><li><b>Credenciales débiles</b>: contraseñas fáciles de adivinar.</li></ul>';
    }
  });

  tema({
    id: 'control-acceso', u: 'u3', titulo: 'Control de acceso, seguridad multinivel y vistas', min: 7,
    resumen: 'Login, usuario, rol y sa; control global, DAC y MAC; niveles MLS, Bell-LaPadula y vistas.',
    fuentes: ['G4', 'PR'],
    cubre: [['G4', 'Logins, usuarios y roles', 'Login vs usuario; rol; usuario root/sa'], ['G4', 'Tipos de control de acceso', 'Global, DAC, MAC'], ['G4', 'Seguridad multinivel (MLS)', 'Niveles de clasificación 1 a 4'], ['G4', 'Modelo Bell-LaPadula', 'No Read Up y No Write Down'], ['G4', 'Vistas como mecanismo de seguridad', 'CREATE VIEW'], ['PR', '3.2 · 3.4', 'Control de acceso por cuentas, roles y grupos; seguridad multinivel']],
    html: function () {
      return '<h2>Login, usuario y rol</h2>' +
        K([['Login', 'Credenciales de acceso al <b>servidor</b> de base de datos.'], ['Usuario', 'Cuenta <b>dentro de una base de datos</b>, asociada a un login.'], ['Rol', 'Grupo de permisos que se asigna a varios usuarios.'], ['root / sa', 'Superusuario con control total: crea y elimina BD, usuarios y permisos. Se recomienda <b>no usarlo</b> para tareas diarias.']]) +
        '<h2>Tipos de control de acceso</h2>' +
        TB(['Modelo', 'Quién decide', 'Características'], [
          ['Global', 'El sistema', 'Nivel de sistema o BD completa; roles administrativos como DBA'],
          ['<b>DAC</b> (discrecional)', 'El <b>propietario</b> de los datos', 'Permisos asignados a usuarios o roles. El más común en MySQL, PostgreSQL y SQL Server'],
          ['<b>MAC</b> (obligatorio)', '<b>Políticas centrales</b>', 'Etiquetas de seguridad y clasificación de datos; entornos militares o de alta seguridad']
        ]) +
        '<h2>Seguridad multinivel (MLS)</h2>' +
        '<p>Controla el acceso según el <b>nivel de clasificación</b> del dato y el <b>nivel de autorización</b> del usuario: nadie debe acceder a información de nivel superior al autorizado.</p>' +
        TB(['Nivel', 'Clasificación'], [['4', 'Alto secreto'], ['3', 'Secreto'], ['2', 'Confidencial'], ['1', 'Público']]) +
        '<h2>Modelo Bell-LaPadula</h2><p>Protege la <b>confidencialidad</b>. Dos principios:</p>' +
        TB(['Principio', 'Regla', 'Ejemplo de la guía'], [
          ['<b>No Read Up</b>', 'No leer información de un nivel <b>superior</b> a la autorización', 'Carlos (Confidencial, 2) intenta leer información Secreta (3) → <b>rechazado</b>'],
          ['<b>No Write Down</b>', 'No escribir información de un nivel alto en un nivel <b>inferior</b>', 'Ana (Secreto, 3) intenta guardar información secreta en un documento Público (1) → <b>no permitido</b> (fuga hacia abajo)']
        ]) +
        '<h2>Vistas como mecanismo de seguridad</h2>' +
        '<p>Una <b>vista</b> es una tabla virtual basada en una consulta: <b>no almacena datos</b>, muestra los de una o varias tablas. Permite dar acceso solo a ciertas columnas o filas.</p>' +
        C("CREATE VIEW vista_empleados AS\nSELECT id, nombre, departamento\nFROM empleados\nWHERE estado = 'Activo';");
    }
  });

  tema({
    id: 'cifrado-pki', u: 'u3', titulo: 'Cifrado, PKI y certificados digitales', min: 6,
    resumen: 'Cifrado en reposo y en tránsito, simétrico (AES), asimétrico (RSA, ECC), PKI y certificados.',
    fuentes: ['G4', 'PR'],
    cubre: [['G4', 'Cifrado de datos', 'Texto en claro, clave, texto cifrado, descifrado'], ['G4', 'Cifrado en reposo y en tránsito', 'TLS'], ['G4', 'Cifrado simétrico', 'AES 128/192/256, ventajas, problema de distribución de clave'], ['G4', 'Cifrado asimétrico', 'Clave pública y privada, RSA, ECC'], ['G4', 'PKI y certificado digital', 'Definición y contenido'], ['PR', '3.5', 'Cifrado e infraestructuras de clave pública (PKI)']],
    html: function () {
      return '<p>El <b>cifrado</b> transforma texto en claro en texto cifrado mediante un <b>algoritmo criptográfico</b> y una o más <b>claves</b>. Con el descifrado y la clave correspondiente se recupera el original. Objetivo principal: <b>confidencialidad</b>, aunque un intruso obtenga los datos.</p>' +
        D(['Texto en claro + clave', 'Cifrado', 'Texto cifrado']) +
        '<h2>¿Dónde se cifra?</h2>' +
        TB(['', 'Protege los datos…', 'Ejemplos'], [['<b>En reposo</b> (Data at Rest)', 'mientras están <b>almacenados</b>', 'Archivos de BD, discos, columnas específicas, copias de seguridad, archivos en servidores'], ['<b>En tránsito</b> (Data in Transit)', 'mientras <b>viajan por la red</b>', 'Protocolo <b>TLS</b> (Transport Layer Security)']]) +
        '<h2>Simétrico vs asimétrico</h2>' +
        TB(['', 'Simétrico', 'Asimétrico (clave pública)'], [
          ['Claves', 'Una <b>misma clave secreta</b> compartida para cifrar y descifrar', 'Un <b>par</b> relacionado: clave pública (se distribuye) y privada (se protege)'],
          ['Algoritmos', '<b>AES</b> con claves de 128, 192 o 256 bits', '<b>RSA</b>, <b>ECC</b> (curvas elípticas)'],
          ['Ventajas', 'Rápido, pocos recursos, apto para grandes volúmenes, archivos y discos', 'La clave privada nunca se envía'],
          ['Problema', 'La <b>distribución de la clave</b>', '¿Cómo saber de quién es realmente una clave pública? → PKI']
        ]) +
        BOX('tip', '<b>Regla para confidencialidad</b>Si Ana quiere enviar un dato confidencial a Carlos, lo cifra con la <b>clave pública de Carlos</b>; Carlos lo descifra con su <b>clave privada</b>.') +
        '<h2>PKI y certificados</h2>' +
        '<p>Una <b>PKI</b> (Public Key Infrastructure) es el conjunto de tecnologías, entidades, políticas y procedimientos para <b>crear, administrar, distribuir, validar y revocar certificados digitales</b> y gestionar las claves asociadas.</p>' +
        '<p>Un <b>certificado digital</b> vincula una <b>identidad</b> con una <b>clave pública</b>. Contiene: identidad del propietario, clave pública, entidad emisora, periodo de validez, número de serie, algoritmos utilizados y la firma digital de la entidad emisora.</p>';
    }
  });

  tema({
    id: 'permisos-sql', u: 'u3', titulo: 'Logins, usuarios, permisos y roles en SQL Server', min: 8,
    resumen: 'CREATE LOGIN/USER, GRANT, REVOKE, DENY, roles personalizados y roles fijos de servidor y de base.',
    fuentes: ['G4', 'PR'],
    cubre: [['G4', 'Ejercicio en clase', 'CREATE LOGIN (SQL Server y Windows), DROP LOGIN'], ['G4', 'Usuarios', 'CREATE USER ... FOR LOGIN, DROP USER'], ['G4', 'Otorgamiento y revocación', 'GRANT, REVOKE, DENY'], ['G4', 'Roles', 'CREATE ROLE, ALTER ROLE ADD/DROP MEMBER, DROP ROLE'], ['G4', 'Roles de SQL Server', 'Roles fijos de servidor, public, roles fijos de base de datos'], ['G4', 'Ejercicio', 'Asignar roles a Ana, Carlos, María y Pedro con mínimo privilegio'], ['PR', '3.3', 'Otorgamiento o revocación de privilegios']],
    html: function () {
      return '<h2>1. Logins</h2>' +
        C("-- Autenticación de SQL Server\nCREATE LOGIN cajero WITH PASSWORD = 'ContraseñaSegura' MUST_CHANGE,\n    CHECK_EXPIRATION = ON, DEFAULT_DATABASE = SUPERMERCADO;\n\n-- Autenticación de Windows (Active Directory)\nCREATE LOGIN [DOMINIO\\usuario1] FROM WINDOWS;\n\nDROP LOGIN cajero;") +
        TB(['Opción', 'Significado'], [['<code>MUST_CHANGE</code>', 'Obliga a cambiar la contraseña en el primer inicio'], ['<code>CHECK_EXPIRATION = ON</code>', 'Aplica la política de vencimiento de contraseñas'], ['<code>DEFAULT_DATABASE</code>', 'Base de datos que se abre al conectarse']]) +
        BOX('warn', '<b>Antes de eliminar un login</b>elimine los usuarios asociados en las bases de datos. Y no se puede eliminar un usuario con privilegios activos.') +
        '<h2>2. Usuarios</h2>' +
        C('CREATE USER usuario1 FOR LOGIN cajero;\nDROP USER usuario1;') +
        '<h2>3. Privilegios</h2>' +
        C('GRANT SELECT, INSERT, UPDATE ON dbo.Producto TO usuario1;  -- otorgar\nREVOKE INSERT, UPDATE ON dbo.Producto FROM usuario1;        -- quitar lo otorgado\nDENY DELETE ON dbo.Producto TO usuario1;                    -- prohibir explícitamente') +
        TB(['Instrucción', 'Efecto'], [['<code>GRANT</code>', 'Otorga permisos (SELECT consultar, INSERT agregar, UPDATE modificar…)'], ['<code>REVOKE</code>', 'Elimina permisos específicos <b>sin afectar</b> otros privilegios'], ['<code>DENY</code>', 'Prohíbe la acción <b>aunque el usuario pertenezca a un rol</b> que tenga ese permiso']]) +
        BOX('warn', '<b>Confusión frecuente</b><code>REVOKE</code> quita un permiso otorgado; el usuario aún podría recibirlo por un rol. <code>DENY</code> lo bloquea incluso si un rol se lo da.') +
        '<h2>4. Roles personalizados</h2>' +
        C('CREATE ROLE rol_consulta;\nGRANT SELECT ON dbo.Producto TO rol_consulta;\nALTER ROLE rol_consulta ADD MEMBER usuario1;\nALTER ROLE rol_consulta DROP MEMBER usuario1;\nDROP ROLE rol_consulta;') +
        '<h2>5. Roles fijos de SQL Server</h2>' +
        TB(['Nivel servidor', 'Permite'], [['<code>sysadmin</code>', 'Administración total, sin restricciones'], ['<code>serveradmin</code>', 'Configuración del servidor (sin acceso a BD)'], ['<code>setupadmin</code>', 'Configurar servidores, sin acceso a BD'], ['<code>processadmin</code>', 'Gestionar procesos y terminar sesiones'], ['<code>securityadmin</code>', 'Administrar logins y roles de servidor'], ['<code>dbcreator</code>', 'Crear y eliminar bases de datos'], ['<code>diskadmin</code>', 'Gestionar discos y archivos'], ['<code>bulkadmin</code>', 'Importación masiva'], ['<code>public</code>', 'Todos pertenecen; sin permisos específicos, sirve para permisos comunes']]) +
        TB(['Nivel base de datos', 'Permite'], [['<code>db_owner</code>', 'Control total de la BD'], ['<code>db_securityadmin</code>', 'Permisos y roles dentro de la BD'], ['<code>db_accessadmin</code>', 'Gestionar el acceso (crear y eliminar usuarios)'], ['<code>db_backupoperator</code>', 'Hacer copias de seguridad'], ['<code>db_ddladmin</code>', 'Crear, alterar y eliminar objetos'], ['<code>db_datawriter</code>', 'Insertar, actualizar y eliminar en todas las tablas'], ['<code>db_datareader</code>', 'Leer todas las tablas'], ['<code>db_denydatawriter</code>', 'Prohíbe escribir'], ['<code>db_denydatareader</code>', 'Prohíbe leer']]) +
        BOX('tip', '<b>Ejercicio de la guía (mínimo privilegio)</b>Ana administra logins y seguridad del servidor → <code>securityadmin</code> · Carlos crea bases de datos → <code>dbcreator</code> · María solo consulta SUPERMERCADO → <code>db_datareader</code> · Pedro consulta, inserta y modifica en todas las tablas → <code>db_datareader</code> + <code>db_datawriter</code>.');
    }
  });

  /* ============================ UNIDAD 4 ============================ */
  tema({
    id: 'variables-control', u: 'u4', titulo: 'Variables y estructuras de control', min: 6,
    resumen: 'Variables locales (@) y globales (@@), IF…ELSE, WHILE, BREAK y CONTINUE en T-SQL.',
    fuentes: ['G5', 'PR'],
    cubre: [['G5', 'Variables locales', 'DECLARE, SET, PRINT'], ['G5', 'Variables globales', '@@VERSION'], ['G5', 'Estructuras de control', 'IF ... ELSE, WHILE, BREAK y CONTINUE'], ['PR', '4.1 · 4.2 · 4.3', 'SQL y T-SQL; variables locales y globales; estructuras de control']],
    html: function () {
      return '<p>T-SQL (Transact-SQL) es el lenguaje de SQL Server que añade programación al SQL: variables, condiciones, ciclos y manejo de errores. En Oracle su equivalente es PL/SQL.</p>' +
        '<h2>Variables</h2>' +
        TB(['Tipo', 'Prefijo', 'Alcance'], [['Local', '<code>@</code>', 'Solo dentro del bloque donde se declaró'], ['Global', '<code>@@</code>', 'Cualquier contexto de SQL Server; información del sistema (configuración, estado, usuario…)']]) +
        C("DECLARE @Nombre VARCHAR(50);\nSET @Nombre = 'Juan Pérez';\nPRINT @Nombre;\n\nPRINT 'Versión de SQL Server: ' + @@VERSION;") +
        '<h2>IF … ELSE</h2>' +
        C("DECLARE @Edad INT = 20;\nIF @Edad >= 18\n    PRINT 'Eres mayor de edad';\nELSE\n    PRINT 'Eres menor de edad';") +
        '<h2>WHILE</h2>' +
        C("DECLARE @Contador INT = 1;\nWHILE @Contador <= 5\nBEGIN\n    PRINT 'Iteración número: ' + CAST(@Contador AS NVARCHAR);\n    SET @Contador = @Contador + 1;\nEND;") +
        BOX('info', '<b>BEGIN … END</b>agrupa varias instrucciones como un bloque. <code>CAST(@Contador AS NVARCHAR)</code> convierte el número a texto para poder concatenarlo con <code>+</code>.') +
        '<h2>BREAK y CONTINUE</h2>' +
        C("DECLARE @Numero INT = 0;\nWHILE @Numero < 10\nBEGIN\n    SET @Numero = @Numero + 1;\n    IF @Numero = 5\n        CONTINUE;  -- salta el resto de esta iteración\n    PRINT 'Número: ' + CAST(@Numero AS NVARCHAR);\n    IF @Numero = 8\n        BREAK;     -- termina el ciclo\nEND;") +
        BOX('tip', '<b>Salida</b>Imprime 1, 2, 3, 4, 6, 7 y 8: el 5 se salta por <code>CONTINUE</code> y el ciclo termina en 8 por <code>BREAK</code>.');
    }
  });

  tema({
    id: 'excepciones', u: 'u4', titulo: 'Manejo de excepciones: TRY…CATCH', min: 3,
    resumen: 'Capturar errores con BEGIN TRY / BEGIN CATCH y ERROR_MESSAGE().',
    fuentes: ['G5', 'G8', 'PR'],
    cubre: [['G5', 'Manejo de excepciones', 'BEGIN TRY / BEGIN CATCH, ERROR_MESSAGE()'], ['PR', '4.4', 'Manejo de excepciones']],
    html: function () {
      return '<p>Si una instrucción dentro de <code>BEGIN TRY</code> produce un error, la ejecución salta al bloque <code>BEGIN CATCH</code>, donde se puede informar o revertir.</p>' +
        C("BEGIN TRY\n    DECLARE @Resultado INT;\n    SET @Resultado = 10 / 0;   -- genera un error\nEND TRY\nBEGIN CATCH\n    PRINT 'Error detectado: ' + ERROR_MESSAGE();\nEND CATCH;") +
        K([['ERROR_MESSAGE()', 'Devuelve el texto del error ocurrido (solo tiene sentido dentro del CATCH).'], ['Uso típico', 'Junto con transacciones: si algo falla en el TRY, el CATCH hace ROLLBACK (Unidad 5).']]) +
        BOX('warn', '<b>Error frecuente</b>Escribir el CATCH antes del TRY o sin <code>END CATCH</code>. El orden es siempre <code>BEGIN TRY … END TRY BEGIN CATCH … END CATCH</code>.');
    }
  });

  tema({
    id: 'funciones', u: 'u4', titulo: 'Funciones escalares y de tabla', min: 7,
    resumen: 'Funciones que devuelven un valor o una tabla (en línea y de valores múltiples).',
    fuentes: ['G5', 'PR'],
    cubre: [['G5', 'Funciones escalares', 'CREATE FUNCTION ... RETURNS INT; no pueden INSERT/UPDATE/DELETE'], ['G5', 'Funciones de tabla en línea', 'RETURNS TABLE AS RETURN SELECT'], ['G5', 'Funciones de tabla con valores múltiples', 'RETURNS @tabla TABLE (...)'], ['G5', 'Ejercicios en clase', 'fn_NombreCategoria, fn_CalcularTotalIVA, fn_Descuento, fn_CalcularEdad, fn_ProductoEnStock, fn_ClientesPorCategoria, fn_ProductosMayoresA, fn_HistorialCompras, fn_RankingProductos, fn_VentasPorMes'], ['PR', '4.5', 'Programación y uso de funciones (escalares y de tabla)']],
    html: function () {
      return '<h2>Función escalar</h2><p>Devuelve <b>un solo valor</b> de un tipo específico. Sirve para cálculos sobre un valor. <b>No puede</b> ejecutar INSERT, UPDATE ni DELETE.</p>' +
        C('CREATE FUNCTION SumarNumeros (@Num1 INT, @Num2 INT)\nRETURNS INT AS\nBEGIN\n    RETURN @Num1 + @Num2;\nEND;\n\nSELECT dbo.SumarNumeros(5, 10) AS Resultado;') +
        BOX('info', '<b>Nota</b>La guía muestra <code>SELECT SumarNumeros(5, 10)</code>; en SQL Server una función escalar se invoca con el esquema: <code>dbo.SumarNumeros(5, 10)</code>.') +
        '<h2>Funciones de tabla</h2><p>Devuelven un <b>conjunto de resultados</b> y se usan en el <code>FROM</code>.</p>' +
        TB(['Tipo', 'Características'], [['<b>En línea</b>', 'Una sola consulta SELECT. Sin variables ni bloque BEGIN…END. <code>RETURNS TABLE AS RETURN SELECT…</code>'], ['<b>Valores múltiples</b>', 'Lógica más compleja y varios pasos. Declara la tabla de retorno: <code>RETURNS @Ventas TABLE (…)</code>, la llena y termina con <code>RETURN;</code>']]) +
        C("-- En línea\nCREATE FUNCTION fn_ObtenerClientesPorCiudad (@Ciudad VARCHAR(50))\nRETURNS TABLE AS\nRETURN SELECT ClienteID, Nombre FROM Clientes WHERE Ciudad = @Ciudad;\n\nSELECT * FROM fn_ObtenerClientesPorCiudad('Madrid');\n\n-- Valores múltiples\nCREATE FUNCTION fn_ObtenerVentasPorFecha (@Fecha DATE)\nRETURNS @Ventas TABLE (VentaID INT, Monto DECIMAL(10, 2))\nAS\nBEGIN\n    INSERT INTO @Ventas (VentaID, Monto)\n    SELECT VentaID, Monto FROM Ventas WHERE Fecha = @Fecha;\n    RETURN;\nEND;") +
        '<h2>Ejercicios de la Guía #5</h2>' +
        TB(['Escalares', 'De tabla'], [['fn_NombreCategoria(@id_categoria)<br>fn_CalcularTotalIVA(@precio, @cantidad, @iva)<br>fn_Descuento(@precio, @descuento)<br>fn_CalcularEdad(@fechaNacimiento)<br>fn_ProductoEnStock(@id_producto, @cantidad) → 1 o 0', 'fn_ClientesPorCategoria(@id_categoria)<br>fn_ProductosMayoresA(@precio)<br>fn_HistorialCompras(@id_cliente)<br>fn_RankingProductos(@top)<br>fn_VentasPorMes(@anio)']]) +
        C('-- Ejemplo resuelto: precio con descuento (porcentaje)\nCREATE FUNCTION fn_Descuento (@precio DECIMAL(10,2), @descuento DECIMAL(5,2))\nRETURNS DECIMAL(10,2) AS\nBEGIN\n    RETURN @precio - (@precio * @descuento / 100);\nEND;');
    }
  });

  /* ============================ UNIDAD 5 ============================ */
  tema({
    id: 'procedimientos', u: 'u5', titulo: 'Procedimientos almacenados', min: 6,
    resumen: 'Ventajas, parámetros de entrada y salida, EXEC, ALTER y DROP PROCEDURE.',
    fuentes: ['G6', 'PR'],
    cubre: [['G6', 'Procedimientos almacenados', 'Definición y 5 ventajas'], ['G6', 'Creación', 'Sin parámetros, con parámetro de entrada, con parámetro de salida (OUTPUT)'], ['G6', 'Modificación y eliminación', 'ALTER PROCEDURE, DROP PROCEDURE'], ['G6', 'Ejercicios en clase', 'Insertar cliente, total de factura, actualizar precios por categoría, eliminar facturas antiguas, productos por cliente'], ['PR', '5.5', 'Procedimientos almacenados: parámetros de entrada y salida, manejo de transacciones']],
    html: function () {
      return '<p>Un <b>procedimiento almacenado</b> (stored procedure) es un conjunto de instrucciones SQL guardado en la base de datos que se ejecuta cuando se necesita. Encapsula lógica de negocio en el servidor.</p>' +
        K([['Reutilización', 'Se ejecuta muchas veces sin reescribir la lógica.'], ['Rendimiento', 'SQL Server lo compila y optimiza.'], ['Seguridad', 'Se dan permisos sobre el procedimiento sin exponer las tablas.'], ['Menos tráfico de red', 'Se envía solo la llamada, no muchas instrucciones.'], ['Transacciones', 'Agrupa varias operaciones en una sola transacción.']]) +
        '<h2>Sin parámetros</h2>' +
        C('CREATE PROCEDURE ListarClientes\nAS BEGIN\n    SELECT * FROM Clientes\nEND\n\nEXEC ListarClientes;') +
        '<h2>Con parámetro de entrada</h2>' +
        C('CREATE PROCEDURE BuscarCliente @ID INT\nAS BEGIN\n    SELECT * FROM Clientes WHERE ClienteID = @ID\nEND\n\nEXEC BuscarCliente @ID = 5;') +
        '<h2>Con parámetro de salida</h2>' +
        C('CREATE PROCEDURE ContarClientes @Cantidad INT OUTPUT\nAS BEGIN\n    SELECT @Cantidad = COUNT(*) FROM Clientes\nEND\n\nDECLARE @TotalClientes INT;\nEXEC ContarClientes @Cantidad = @TotalClientes OUTPUT;\nPRINT @TotalClientes;') +
        BOX('warn', '<b>Error frecuente</b>Olvidar <code>OUTPUT</code> en la llamada <code>EXEC</code>: la palabra va tanto en la definición del parámetro como al ejecutar.') +
        '<h2>Modificar y eliminar</h2>' +
        C('ALTER PROCEDURE ListarClientes\nAS\nBEGIN\n    SELECT ClienteID, Nombre FROM Clientes\nEND\n\nDROP PROCEDURE ListarClientes;') +
        '<h2>Ejercicio resuelto (Guía #6, ejercicio 3)</h2>' +
        C('CREATE PROCEDURE ActualizarPrecioCategoria @id_categoria INT, @porcentaje DECIMAL(5,2)\nAS\nBEGIN\n    UPDATE Productos\n    SET precio = precio * (1 + @porcentaje / 100)\n    WHERE id_categoria = @id_categoria;\nEND;\n\nEXEC ActualizarPrecioCategoria @id_categoria = 2, @porcentaje = 10;');
    }
  });

  tema({
    id: 'cursores', u: 'u5', titulo: 'Cursores', min: 6,
    resumen: 'Recorrer un resultado fila por fila: DECLARE, OPEN, FETCH, @@FETCH_STATUS, CLOSE y DEALLOCATE.',
    fuentes: ['G6', 'PR'],
    cubre: [['G6', 'Cursores', 'Definición, características y advertencia de rendimiento'], ['G6', 'Pasos para usar un cursor', 'Declarar, abrir, FETCH NEXT, cerrar, liberar'], ['G6', 'Estados del cursor', '@@FETCH_STATUS 0, -1, -2'], ['G6', 'Cursores en procedimientos', 'ListarClientesConCursor'], ['G6', 'Ejercicios de cursores', 'Clientes con más compras, actualizar stock, clientes sin compras, facturas con montos incorrectos'], ['PR', '5.6', 'Programación y uso de cursores']],
    html: function () {
      return '<p>Un <b>cursor</b> recorre <b>fila por fila</b> el resultado de una consulta para operar sobre cada fila. Útil cuando la operación no se resuelve bien con instrucciones orientadas a conjuntos.</p>' +
        BOX('warn', '<b>Advertencia</b>Los cursores pueden afectar el rendimiento porque procesan fila por fila en lugar de en bloque.') +
        '<h2>Los pasos</h2>' +
        D(['DECLARE', 'OPEN', 'FETCH NEXT', 'WHILE @@FETCH_STATUS = 0', 'CLOSE', 'DEALLOCATE']) +
        C("DECLARE @Nombre NVARCHAR(100);\n-- 1. Declarar el cursor\nDECLARE CursorClientes CURSOR FOR\nSELECT Nombre FROM Clientes;\n-- 2. Abrir\nOPEN CursorClientes;\n-- 3. Primera fila\nFETCH NEXT FROM CursorClientes INTO @Nombre;\n-- 4. Recorrer\nWHILE @@FETCH_STATUS = 0\nBEGIN\n    PRINT 'Cliente: ' + @Nombre;\n    FETCH NEXT FROM CursorClientes INTO @Nombre;  -- siguiente fila\nEND;\n-- 5. Cerrar\nCLOSE CursorClientes;\n-- 6. Liberar memoria\nDEALLOCATE CursorClientes;") +
        '<h2>@@FETCH_STATUS</h2>' +
        TB(['Valor', 'Significado (según la guía)'], [['<code>0</code>', 'Operación exitosa: se obtuvo una fila'], ['<code>-1</code>', 'Error al obtener la fila'], ['<code>-2</code>', 'No hay más filas disponibles']]) +
        BOX('warn', '<b>Error frecuente</b>Olvidar el segundo <code>FETCH NEXT</code> dentro del WHILE: el ciclo nunca avanza (ciclo infinito). Y olvidar <code>CLOSE</code> / <code>DEALLOCATE</code> deja recursos ocupados.') +
        '<h2>Cursor dentro de un procedimiento</h2>' +
        C("CREATE PROCEDURE ListarClientesConCursor\nAS\nBEGIN\n    DECLARE @Nombre NVARCHAR(100);\n    DECLARE CursorClientes CURSOR FOR SELECT Nombre FROM Clientes;\n    OPEN CursorClientes;\n    FETCH NEXT FROM CursorClientes INTO @Nombre;\n    WHILE @@FETCH_STATUS = 0\n    BEGIN\n        PRINT 'Cliente: ' + @Nombre;\n        FETCH NEXT FROM CursorClientes INTO @Nombre;\n    END;\n    CLOSE CursorClientes;\n    DEALLOCATE CursorClientes;\nEND;\n\nEXEC ListarClientesConCursor;");
    }
  });

  tema({
    id: 'triggers', u: 'u5', titulo: 'Triggers (disparadores)', min: 7,
    resumen: 'DML (AFTER, INSTEAD OF) y DDL; tablas INSERTED y DELETED; ejemplos de auditoría y validación.',
    fuentes: ['G7', 'PR'],
    cubre: [['G7', 'Trigger', 'Definición y usos'], ['G7', 'Tipos de triggers', 'DML (AFTER, INSTEAD OF) y DDL'], ['G7', 'Sintaxis', 'CREATE TRIGGER ... AFTER / INSTEAD OF'], ['G7', 'Tablas INSERTED y DELETED', 'Contenido según INSERT, DELETE, UPDATE; una ejecución por instrucción'], ['G7', 'Ejemplo y consideraciones', 'trg_Auditoria; no usar para lógica compleja'], ['G7', 'Ejercicio en clase', 'trg_validar_stock (INSTEAD OF INSERT, THROW), AuditoriaFacturas, total de factura, borrado lógico, descuento a Bebidas'], ['PR', '5.7', 'Triggers (AFTER, BEFORE, INSTEAD OF)']],
    html: function () {
      return '<p>Un <b>trigger</b> es un objeto que se ejecuta <b>automáticamente</b> cuando ocurre un evento en una tabla o vista. Sirve para validaciones, auditorías y mantener datos relacionados.</p>' +
        TB(['Tipo', 'Se dispara con', 'Subtipos / uso'], [['<b>DML</b>', 'INSERT, UPDATE, DELETE', '<b>AFTER</b>: después de realizada la acción · <b>INSTEAD OF</b>: <b>en lugar de</b> la acción'], ['<b>DDL</b>', 'CREATE, ALTER, DROP…', 'Comúnmente para auditoría']]) +
        BOX('info', '<b>¿Y BEFORE?</b>El programa menciona triggers BEFORE (existen en otros SGBD como MySQL u Oracle). SQL Server no tiene BEFORE: para actuar antes de la operación se usa <b>INSTEAD OF</b>, como en el ejercicio de validar stock.') +
        C('CREATE TRIGGER nombre_trigger ON nombre_tabla AFTER INSERT, UPDATE, DELETE\nAS BEGIN\n    -- código que se ejecuta después\nEND;\n\nCREATE TRIGGER nombre_trigger ON nombre_tabla INSTEAD OF DELETE\nAS BEGIN\n    -- código que se ejecuta en lugar del DELETE\nEND;') +
        '<h2>Tablas INSERTED y DELETED</h2>' +
        TB(['Operación', 'INSERTED', 'DELETED'], [['INSERT', 'Datos nuevos', '—'], ['DELETE', '—', 'Datos eliminados'], ['UPDATE', 'Datos nuevos', 'Datos anteriores']]) +
        BOX('warn', '<b>Importante</b>El trigger se ejecuta <b>una vez por instrucción</b>, y INSERTED/DELETED pueden tener <b>varias filas</b>. Diseñe con operaciones orientadas a conjuntos; no suponga que siempre es una sola fila.') +
        '<h2>Ejemplo: auditoría</h2>' +
        C('CREATE TRIGGER trg_Auditoria ON Empleados AFTER UPDATE\nAS BEGIN\n    INSERT INTO Auditoria (IdEmpleado, FechaCambio, DatosAnteriores)\n    SELECT d.IdEmpleado, GETDATE(), d.Nombre\n    FROM DELETED d;\nEND;') +
        '<h2>Ejemplo: validar stock (Guía #7, ejercicio 2)</h2>' +
        C("CREATE TRIGGER trg_validar_stock\nON DetalleFactura\nINSTEAD OF INSERT\nAS\nBEGIN\n    DECLARE @id_producto INT, @cantidad INT, @stock_actual INT;\n    SELECT @id_producto = id_producto, @cantidad = cantidad FROM inserted;\n    SELECT @stock_actual = stock FROM Productos WHERE id_producto = @id_producto;\n    IF @stock_actual < @cantidad\n    BEGIN\n        THROW 50001, 'No hay suficiente stock para el producto.', 1;\n        ROLLBACK TRANSACTION;\n        RETURN;\n    END\n    INSERT INTO DetalleFactura(id_factura, id_producto, cantidad)\n    SELECT id_factura, id_producto, cantidad FROM inserted;\nEND;") +
        '<p><code>THROW</code> lanza un error con número, mensaje y estado, y cancela la operación. Si el stock alcanza, el trigger hace él mismo el INSERT (porque INSTEAD OF reemplazó al original).</p>' +
        '<h2>Ejemplo: borrado lógico (ejercicio 5)</h2>' +
        C("CREATE TRIGGER trg_borrado_logico ON Productos\nINSTEAD OF DELETE\nAS\nBEGIN\n    UPDATE Productos SET estado = 'inactivo'\n    WHERE id_producto IN (SELECT id_producto FROM DELETED);\nEND;") +
        BOX('tip', '<b>Consideraciones de la guía</b>No usar triggers para lógica de negocio compleja; mal diseñados afectan el rendimiento.');
    }
  });

  tema({
    id: 'transacciones', u: 'u5', titulo: 'Transacciones, ACID, savepoints y log', min: 7,
    resumen: 'Qué es una transacción, propiedades ACID, BEGIN/COMMIT/ROLLBACK, SAVE TRANSACTION y el log WAL.',
    fuentes: ['G8', 'INV', 'PR'],
    cubre: [['G8', 'Transacción', 'Definición'], ['G8', 'Propiedades ACID', 'Atomicidad, Consistencia, Aislamiento, Durabilidad'], ['G8', 'Comandos', 'BEGIN TRANSACTION, COMMIT, ROLLBACK, SAVE TRANSACTION, ROLLBACK TRANSACTION nombre'], ['G8', 'Ejemplos', 'Transferencia con TRY/CATCH; savepoint despues_de_debito con @@TRANCOUNT'], ['G8', 'Log de transacciones (WAL)', 'Usos y comandos fn_dblog / DBCC LOG'], ['G8', 'Ejercicios 1, 4 y 5', 'Venta completa, rollback por stock insuficiente, savepoints'], ['PR', '5.1 · 5.2', 'Transacciones: concepto, ACID; gestión de transacciones']],
    html: function () {
      return '<p>Una <b>transacción</b> es una unidad lógica de trabajo con una o más operaciones (INSERT, UPDATE, DELETE) que deben ejecutarse <b>completamente o no ejecutarse</b>.</p>' +
        TB(['Propiedad', 'Significa'], [['<b>A</b>tomicidad', 'Todas las operaciones se completan o ninguna se ejecuta'], ['<b>C</b>onsistencia', 'La BD pasa de un estado válido a otro válido'], ['A<b>I</b>slamiento', 'Las transacciones no interfieren entre sí'], ['<b>D</b>urabilidad', 'Una vez confirmados, los cambios permanecen aunque haya fallos']]) +
        TB(['Comando', 'Acción'], [['<code>BEGIN TRANSACTION</code>', 'Inicia una transacción'], ['<code>COMMIT</code>', 'Guarda los cambios'], ['<code>ROLLBACK</code>', 'Revierte todo desde el inicio'], ['<code>SAVE TRANSACTION nombre</code>', 'Crea un punto intermedio (savepoint)'], ['<code>ROLLBACK TRANSACTION nombre</code>', 'Revierte solo hasta ese savepoint']]) +
        '<h2>Ejemplo: transferencia segura</h2>' +
        '<p>El bloque <code>BEGIN TRY … END TRY</code> ejecuta las operaciones; si alguna produce un error, la ejecución salta a <code>BEGIN CATCH … END CATCH</code>, donde se revierte con ROLLBACK. <code>ERROR_MESSAGE()</code> devuelve el texto del error.</p>' +
        C("BEGIN TRY\n    BEGIN TRANSACTION;\n    UPDATE cuentas SET saldo = saldo - 100 WHERE id = 1;\n    UPDATE cuentas SET saldo = saldo + 100 WHERE id = 2;\n    COMMIT;\nEND TRY\nBEGIN CATCH\n    ROLLBACK;\n    PRINT 'Error: ' + ERROR_MESSAGE();\nEND CATCH") +
        '<h2>Savepoints</h2>' +
        C("BEGIN TRANSACTION;\nUPDATE Productos SET stock = stock - 2 WHERE id_producto = 1;\nSAVE TRANSACTION paso1;\nUPDATE Productos SET stock = stock - 5 WHERE id_producto = 2;\nSAVE TRANSACTION paso2;\nUPDATE Productos SET stock = stock - 100 WHERE id_producto = 3;  -- error simulado\nROLLBACK TRANSACTION paso2;   -- revierte solo lo posterior a paso2\nCOMMIT;") +
        BOX('tip', '<b>Reflexión de la guía (ejercicio 5)</b>Se conservan las actualizaciones de los productos 1 y 2; se pierde la del producto 3. Un ROLLBACK a un savepoint <b>no termina</b> la transacción: hay que hacer COMMIT (o ROLLBACK total) después.') +
        BOX('info', '<b>@@TRANCOUNT</b>indica cuántas transacciones hay abiertas. El ejemplo de la guía usa <code>IF @@TRANCOUNT &gt; 0</code> en el CATCH antes de revertir al savepoint <code>despues_de_debito</code> y confirmar el débito.') +
        '<h2>Log de transacciones (WAL)</h2>' +
        '<p>El <b>log de transacciones</b> (Write-Ahead Logging) registra todas las operaciones que afectan datos <b>antes</b> de aplicarlas físicamente.</p>' +
        '<ul><li>Recuperación ante fallos (por ejemplo, tras un apagón).</li><li>Rehacer o deshacer operaciones (COMMIT / ROLLBACK).</li><li>Garantiza la <b>durabilidad</b> (parte de ACID). Si hubo un fallo antes del COMMIT, el log puede revertir el cambio.</li></ul>' +
        C("SELECT * FROM ::fn_dblog(NULL, NULL);  -- todos los detalles (función)\nDBCC LOG(ejemplo, 0);                   -- detalles mínimos (comando)");
    }
  });

  tema({
    id: 'aislamiento', u: 'u5', titulo: 'Problemas de concurrencia y niveles de aislamiento', min: 8,
    resumen: 'Actualización perdida, lectura sucia, no repetible y fantasma; READ UNCOMMITTED a SERIALIZABLE y SNAPSHOT.',
    fuentes: ['G8', 'G9', 'INV', 'PR'],
    cubre: [['G8', 'Control de concurrencia', 'Definición'], ['G8', 'Problemas comunes', 'Lectura sucia, no repetible, fantasma (con ejemplos)'], ['G9', 'Anomalías de concurrencia', 'Actualización perdida, lectura sucia, no repetible, fantasma'], ['G8', 'Aislamiento de transacciones', 'READ UNCOMMITTED, READ COMMITTED (por defecto), REPEATABLE READ, SERIALIZABLE; tabla de qué evita cada uno; SET TRANSACTION ISOLATION LEVEL'], ['G8', 'Ejercicios 2 y 3', 'Simular lectura no repetible y lectura fantasma'], ['G9', 'Laboratorio actividades 2, 3 y 4', 'READ UNCOMMITTED, READCOMMITTEDLOCK, REPEATABLE READ, SNAPSHOT, ALLOW_SNAPSHOT_ISOLATION'], ['PR', '5.1 · 5.2', 'Concurrencia y sus problemas; protocolos de aislamiento']],
    html: function () {
      return '<p>El <b>control de concurrencia</b> asegura la integridad y consistencia cuando varias transacciones se ejecutan al mismo tiempo. Sin él aparecen estas anomalías:</p>' +
        TB(['Anomalía', 'Qué pasa', 'Ejemplo de las guías'], [
          ['<b>Actualización perdida</b>', 'Dos transacciones leen el mismo valor y una sobrescribe el cambio de la otra', 'X = 10. T1 resta 1 y guarda 9; T2, que también leyó 10, resta 2 y guarda 8. Resultado 8; lo correcto era 10 − 1 − 2 = <b>7</b>'],
          ['<b>Lectura sucia</b>', 'Se lee un dato que otra transacción <b>aún no confirma</b>; si esta hace ROLLBACK, lo leído era inválido', 'T1 escribe X = 2 sin COMMIT; T2 lee 2; T1 hace ROLLBACK y X vuelve a 10'],
          ['<b>Lectura no repetible</b>', 'La misma transacción lee <b>el mismo dato</b> dos veces y obtiene valores distintos porque otra lo modificó y confirmó', 'T1 lee 10; T2 escribe 6 y confirma; T1 vuelve a leer y obtiene 6'],
          ['<b>Lectura fantasma</b>', 'La misma consulta con la misma condición devuelve <b>filas nuevas</b> insertadas por otra transacción', 'WHERE Disponibles &gt; 0 devuelve 1 fila; T2 inserta el Libro 2 y confirma; la segunda consulta devuelve 2']
        ]) +
        BOX('warn', '<b>No repetible vs fantasma</b>No repetible: <b>cambia el valor</b> de una fila ya leída. Fantasma: <b>cambia el conjunto de filas</b> que cumple la condición.') +
        '<h2>Niveles de aislamiento</h2>' +
        TB(['Nivel', 'Descripción', 'Lectura sucia', 'No repetible', 'Fantasma'], [
          ['READ UNCOMMITTED', 'Puede leer datos no confirmados', 'Puede ocurrir', 'Puede ocurrir', 'Puede ocurrir'],
          ['READ COMMITTED', 'Solo lee confirmados. <b>Por defecto en SQL Server</b>', '<b>Evita</b>', 'Puede ocurrir', 'Puede ocurrir'],
          ['REPEATABLE READ', 'Las lecturas repetidas de los mismos datos son iguales', '<b>Evita</b>', '<b>Evita</b>', 'Puede ocurrir'],
          ['SERIALIZABLE', 'El más estricto: como si fueran secuenciales', '<b>Evita</b>', '<b>Evita</b>', '<b>Evita</b>']
        ]) +
        C('SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;') +
        '<h2>SNAPSHOT (Guía #9, actividad 4)</h2>' +
        '<p>Con <code>ALTER DATABASE … SET ALLOW_SNAPSHOT_ISOLATION ON</code>, una transacción en nivel <b>SNAPSHOT</b> lee una <b>instantánea</b>: la versión confirmada al inicio de la transacción. Aunque otra sesión cambie el valor a 4, dentro de la instantánea se sigue leyendo 10; después del COMMIT, una nueva consulta ve 4.</p>' +
        C('ALTER DATABASE LabConcurrenciaG9 SET ALLOW_SNAPSHOT_ISOLATION ON;\n\nSET TRANSACTION ISOLATION LEVEL SNAPSHOT;\nBEGIN TRAN;\nSELECT Disponibles FROM dbo.Libro WHERE LibroID = 1;  -- 10, aunque B ya escribió 4\nCOMMIT;') +
        BOX('info', '<b>Laboratorio de la Guía #9</b>Actividad 2: con READ UNCOMMITTED, B lee 2 y luego 10 (lectura sucia). Con READ COMMITTED y <code>WITH (READCOMMITTEDLOCK)</code>, B espera hasta el ROLLBACK de A. Actividad 3: con READ COMMITTED, A lee 10 y luego 6 (ambos confirmados: no repetible); con REPEATABLE READ, B debe esperar.');
    }
  });

  tema({
    id: 'planificacion', u: 'u5', titulo: 'Planificación y serializabilidad', min: 9,
    resumen: 'Notación l/e/c/r, planes serie y no serie, conflictos, grafo de precedencia y equivalencia de vistas.',
    fuentes: ['G9', 'PR'],
    cubre: [['G9', 'Planificación de ejecución', 'Definición y notación l1(X), e1(X), c1, r1'], ['G9', 'Planificación serie y no serie', 'PA, PB'], ['G9', 'Planificación serializable', 'Equivalencia por conflictos; operaciones en conflicto'], ['G9', 'Grafo de precedencia', 'Construcción, ciclos, orden topológico; PC, PD, P1, P2'], ['G9', 'Equivalencia en vistas', 'Lecturas iniciales, relación de lectura, escritura final; V1-V4'], ['G9', 'Relación entre criterios', 'Escrituras ciegas (V5)'], ['G9', 'Ejercicios', '10 planificaciones con grafo de precedencia'], ['PR', '5.3', 'Planificación basada en serialización']],
    html: function () {
      return '<p>Una <b>planificación</b> es una secuencia de operaciones de varias transacciones que <b>conserva el orden interno</b> de cada una. El control de concurrencia coordina la ejecución según el aislamiento establecido.</p>' +
        TB(['Símbolo', 'Significado'], [['<code>l1(X)</code>', 'T1 lee X'], ['<code>e1(X)</code>', 'T1 escribe X'], ['<code>c1</code>', 'T1 confirma (COMMIT)'], ['<code>r1</code>', 'T1 aborta (ROLLBACK)']]) +
        '<h2>Serie, no serie y serializable</h2>' +
        K([['Serie', 'Todas las operaciones de una transacción se ejecutan antes de que empiece la siguiente (p. ej. T1 → T2). Conserva la consistencia, pero limita la concurrencia.'], ['No serie', 'Las operaciones se intercalan. Esto, por sí solo, no dice si el plan es serializable o recuperable.'], ['Serializable', 'Equivalente a <b>alguna</b> ejecución serie de las mismas transacciones. Criterios: por <b>conflictos</b> y por <b>vistas</b>.']]) +
        '<h2>Operaciones en conflicto</h2>' +
        '<p>Dos operaciones están en conflicto si: <b>(1)</b> son de transacciones distintas, <b>(2)</b> acceden al mismo dato y <b>(3)</b> al menos una escribe. Combinaciones: lectura–escritura, escritura–lectura y escritura–escritura. <b>Dos lecturas no</b> están en conflicto, ni operaciones sobre datos diferentes.</p>' +
        '<h2>Grafo de precedencia</h2>' +
        '<ol><li>Un nodo por transacción.</li><li>Arista <b>Ti → Tj</b> si una operación de Ti precede a otra de Tj con la que está en conflicto.</li><li>Si hay <b>ciclo</b>: <b>no</b> es serializable por conflictos.</li><li>Sin ciclo: un <b>orden topológico</b> da el orden serie equivalente.</li></ol>' +
        '<h3>Ejemplos de la guía</h3>' +
        TB(['Plan', 'Aristas', 'Conclusión'], [
          ['P1: l3(X); e3(X); l1(X); e1(Y); l2(Y); e2(Z); c3; c1; c2', 'T3 → T1 por X (e3(X) antes de l1(X)) · T1 → T2 por Y (e1(Y) antes de l2(Y))', 'Sin ciclos · orden serie <b>T3, T1, T2</b> · serializable'],
          ['P2: l1(X); e1(X); l2(X); e2(Y); l3(Y); e3(Z); l1(Z); c1; c2; c3', 'T1 → T2 por X · T2 → T3 por Y · T3 → T1 por Z (e3(Z) antes de l1(Z))', 'Ciclo T1 → T2 → T3 → T1 · <b>no</b> serializable por conflictos']
        ]) +
        BOX('tip', '<b>Método rápido</b>Para cada dato, recorra sus operaciones en orden y por cada par (de distintas transacciones, con al menos una escritura) trace una flecha de la primera a la segunda.') +
        '<h2>Equivalencia en vistas</h2><p>Dos planes con las mismas operaciones son equivalentes en vistas si conservan:</p>' +
        '<ul><li><b>Lecturas iniciales</b>: si una lectura obtiene el valor inicial en un plan, también en el otro.</li><li><b>Relación de lectura</b>: si Ti lee lo escrito por Tj, lo lee de esa misma escritura en el otro plan.</li><li><b>Escritura final</b>: la misma transacción hace la última escritura de cada dato.</li></ul>' +
        TB(['Ejemplo', 'Resultado'], [['V1: l3(A); e3(A); l4(A); e4(A); l3(B); e3(B); l4(B); e4(B)<br>V2: l3(A); e3(A); l3(B); e3(B); l4(A); e4(A); l4(B); e4(B)', '<b>Equivalentes</b> en vistas'], ['V3: l1(X); l2(X); e1(X); e2(X)<br>V4: l1(X); e1(X); l2(X); e2(X)', '<b>No</b> equivalentes: en V3 T2 lee el valor inicial; en V4 lee lo que escribió T1']]) +
        BOX('info', '<b>Relación entre criterios</b>Todo plan serializable por conflictos es serializable en vistas, pero no al revés. La diferencia aparece con <b>escrituras ciegas</b> (escribir sin leer antes), p. ej. V5: e1(X); e2(X); e1(X).');
    }
  });

  tema({
    id: 'recuperabilidad', u: 'u5', titulo: 'Planificaciones recuperables, sin cascada y estrictas', min: 6,
    resumen: 'Recuperabilidad, abortos en cascada, planificación sin cascadas y estricta, y cómo se relacionan.',
    fuentes: ['G9', 'PR'],
    cubre: [['G9', 'Planificación recuperable', 'Definición y ejemplos recuperable / no recuperable'], ['G9', 'Aborto en cascada', 'Definición'], ['G9', 'Sin abortos en cascada', 'Definición y ejemplo'], ['G9', 'Planificación estricta', 'Definición y relación estricta ⇒ sin cascada ⇒ recuperable'], ['G9', 'Ejercicios', 'Preguntas de recuperabilidad y cascada'], ['PR', '5.3', 'Planificación basada en recuperabilidad']],
    html: function () {
      return '<h2>Recuperable</h2>' +
        '<p>Si Tj lee un valor escrito por Ti, <b>Tj solo puede confirmar después de que Ti confirme</b>. Así nunca se confirma algo que depende de cambios que luego se revierten.</p>' +
        TB(['Plan', 'Por qué'], [['<code>e1(X); l2(X); c1; c2</code>', '<b>Recuperable</b>: T2 leyó de T1 y confirma después de T1'], ['<code>e1(X); l2(X); c2; r1</code>', '<b>No recuperable</b>: T2 confirmó usando un dato de T1, y T1 abortó']]) +
        '<h2>Aborto en cascada</h2>' +
        '<p>Una transacción aborta y obliga a deshacer otras que leyeron sus datos <b>no confirmados</b>. Si T2 lee de T1 y T3 lee de T2, el aborto de T1 puede obligar a abortar T2 y T3.</p>' +
        '<h2>Sin abortos en cascada</h2>' +
        '<p>Solo se leen datos escritos por otras transacciones <b>después de su confirmación</b>. Al impedir las lecturas sucias se evita la cadena de dependencias. Ejemplo: <code>e1(X); c1; l2(X); e2(Y); c2</code>.</p>' +
        '<h2>Estricta</h2>' +
        '<p>Si una transacción escribe X, <b>ninguna otra puede leer ni sobrescribir X</b> mientras la primera siga activa: debe esperar su COMMIT o ROLLBACK. Protege de lecturas y escrituras sucias y facilita la recuperación.</p>' +
        D(['Estricta', 'Sin abortos en cascada', 'Recuperable']) +
        BOX('warn', '<b>Las implicaciones inversas no se cumplen</b>Una planificación recuperable puede permitir lecturas sucias (por eso puede tener cascadas), y una sin cascadas no necesariamente es estricta.') +
        BOX('tip', '<b>Compartir planificación ≠ depender</b>Que dos transacciones aparezcan en el mismo plan no las hace dependientes: solo hay dependencia si una <b>lee</b> datos que la otra escribió sin confirmar. En <code>e1(X); e2(Y); l3(Y); r1; c2; c3</code>, el aborto de T1 no obliga a abortar a T2 ni a T3.');
    }
  });

  tema({
    id: 'bloqueos', u: 'u5', titulo: 'Bloqueos, B2F, interbloqueos y laboratorio', min: 9,
    resumen: 'Bloqueos S y X, bloqueo en dos fases, deadlock, LOCK_TIMEOUT, UPDLOCK/HOLDLOCK y actualización segura.',
    fuentes: ['G9', 'INV', 'PR'],
    cubre: [['G9', 'Bloqueos', 'Recursos y granularidad; compartido S y exclusivo X; matriz de compatibilidad'], ['G9', 'Reglas del modelo de bloqueo', 'Obtener permiso antes de leer/escribir'], ['G9', 'Bloqueo en dos fases (B2F)', 'Fase de crecimiento y de contracción; ejemplo T1/T2'], ['G9', 'Interbloqueo', 'Espera circular; error 1205'], ['G9', 'Tiempo límite', 'SET LOCK_TIMEOUT (15000, -1); error 1222'], ['G9', 'Ejemplos en SQL Server', 'UPDLOCK, HOLDLOCK, WAITFOR DELAY'], ['G9', 'Laboratorio', 'Preparación (@@SPID, @@TRANCOUNT, sys.databases), actividades 1, 5 y 6 (@@ROWCOUNT)'], ['PR', '5.4', 'Técnicas de control de concurrencia (bloqueos)']],
    html: function () {
      return '<p>Un <b>bloqueo</b> reserva el acceso a un recurso según un <b>modo</b>. En SQL Server los recursos pueden ser claves, filas, páginas, tablas y otros; el plan de ejecución y la configuración influyen en la granularidad.</p>' +
        BOX('warn', '<b>Ojo</b>Tener clave primaria <b>no garantiza</b> que toda operación bloquee solamente una fila.') +
        '<h2>Modos S y X</h2>' +
        K([['Compartido (S)', 'Para lecturas basadas en bloqueos. Compatible con otros S sobre el mismo recurso.'], ['Exclusivo (X)', 'Protege modificaciones. Incompatible con S y X de otras transacciones.']]) +
        TB(['Bloqueo existente', 'Solicitud S', 'Solicitud X'], [['S', 'Compatible', 'Espera'], ['X', 'Espera', 'Espera']]) +
        '<p><b>Reglas:</b> antes de leer se obtiene el permiso necesario; antes de escribir, uno compatible con escritura. Si no se concede, la transacción espera o se produce un error. Solo se liberan recursos que se poseen. Las lecturas por <b>versiones</b> pueden ver una versión confirmada anterior sin pedir S.</p>' +
        '<h2>Bloqueo en dos fases (B2F)</h2>' +
        TB(['Fase', 'Se permite', 'No se permite'], [['<b>Crecimiento</b>', 'Adquirir bloqueos y convertirlos a modos más fuertes', 'Liberar'], ['<b>Contracción</b>', 'Liberar bloqueos o reducir su modo', 'Adquirir nuevos']]) +
        '<p>Si todas las transacciones siguen B2F, el plan es <b>serializable por conflictos</b>.</p>' +
        TB(['Paso', 'T1', 'T2'], [['1', 'Obtiene S(X) y lee 100', ''], ['2', 'Convierte S(X) a X(X)', ''], ['3', 'Escribe X = 110', 'Solicita X(X) y <b>espera</b>'], ['4', 'COMMIT y libera', 'Obtiene X(X)'], ['5', '', 'Lee 110 y escribe 90'], ['6', '', 'COMMIT y libera']]) +
        '<p>Mantener X hasta confirmar impide que T2 lea un valor no confirmado.</p>' +
        '<h2>Interbloqueo y tiempo límite</h2>' +
        K([['Deadlock', 'T1 retiene A y espera B; T2 retiene B y espera A: <b>espera circular</b>. SQL Server elige una víctima y da el error <b>1205</b>.'], ['SET LOCK_TIMEOUT', 'Cuánto espera una instrucción por un bloqueo: <code>15000</code> = 15 s; <code>-1</code> = sin límite. Si se agota: error <b>1222</b>.']]) +
        BOX('info', '<b>Esperar no es interbloqueo</b>En la actividad 1, B espera a que A haga COMMIT y luego continúa (ve 7). No hay ciclo: solo una espera.') +
        '<h2>En SQL Server</h2>' +
        C("BEGIN TRAN;\nSELECT * FROM dbo.Test WITH (UPDLOCK, HOLDLOCK) WHERE ID = 1;\nWAITFOR DELAY '00:00:10';   -- mantiene la protección 10 s\nCOMMIT;") +
        TB(['Elemento', 'Función'], [['<code>UPDLOCK</code>', 'Solicita bloqueos de actualización'], ['<code>HOLDLOCK</code>', 'Aplica semántica SERIALIZABLE a la tabla en esa transacción'], ['<code>WAITFOR DELAY</code>', 'Pausa la ejecución'], ['<code>@@SPID</code>, <code>@@TRANCOUNT</code>, <code>@@SERVERNAME</code>, <code>DB_NAME()</code>', 'Identifican sesión, transacciones abiertas, servidor y base']]) +
        '<h2>Actualización segura (actividad 6)</h2>' +
        C('UPDATE dbo.Libro\nSET Disponibles = Disponibles - 1\nWHERE LibroID = 1 AND Disponibles >= 1;\nSELECT @@ROWCOUNT AS Reservado;   -- 1 = se reservó, 0 = no había') +
        BOX('tip', '<b>¿Por qué así?</b>Leer el saldo y luego guardar un valor calculado en la aplicación puede <b>perder actualizaciones</b>. Un único UPDATE condicionado decide y resta de forma atómica. El CHECK evita el negativo, pero no reemplaza informar al usuario. Si el préstamo además requiere un INSERT en otra tabla, ambas operaciones van en <b>una sola transacción</b>.');
    }
  });

  tema({
    id: 'marcas-tiempo', u: 'u5', titulo: 'Ordenación por marcas de tiempo', min: 5,
    resumen: 'TS(T), R_TS(X) y W_TS(X); reglas de lectura y escritura del protocolo básico.',
    fuentes: ['G9', 'PR'],
    cubre: [['G9', 'Ordenación por marcas de tiempo', 'TS(T), R_TS(X), W_TS(X)'], ['G9', 'Regla de lectura y de escritura', 'Condiciones de aborto'], ['G9', 'Ejemplo', 'TS(T1)=5, TS(T2)=10'], ['PR', '5.4', 'Técnicas de control de concurrencia (marcas de tiempo, multiversión, validación)']],
    html: function () {
      return '<p>Modelo teórico que ordena las operaciones con <b>marcas de tiempo</b>. Cada transacción recibe <b>TS(T)</b> al iniciar (contador creciente o reloj con desempate). Para cada dato X se guardan:</p>' +
        K([['R_TS(X)', 'La mayor marca de una transacción que <b>leyó</b> X.'], ['W_TS(X)', 'La mayor marca de una transacción que <b>escribió</b> X.']]) +
        TB(['Operación', 'Se aborta T si…', 'Si no, se permite y…'], [['T lee X', 'TS(T) &lt; W_TS(X): una transacción de marca mayor ya escribió X', 'R_TS(X) = max(R_TS(X), TS(T))'], ['T escribe X', 'TS(T) &lt; R_TS(X) <b>o</b> TS(T) &lt; W_TS(X): una de marca mayor ya leyó o escribió X', 'W_TS(X) = TS(T)']]) +
        '<h2>Ejemplo de la guía</h2>' +
        TB(['Paso', 'Operación', 'Resultado'], [['Inicial', 'TS(T1) = 5; TS(T2) = 10', 'R_TS(X) = 0; W_TS(X) = 0'], ['1', 'T2 escribe X', '10 ≥ 0 en ambas comprobaciones → W_TS(X) = 10'], ['2', 'T1 intenta leer X', '5 &lt; 10 → <b>se aborta T1</b>']]) +
        BOX('info', '<b>Clave</b>El problema no es que T2 sea “futura”, sino que tiene marca mayor y ya hizo una escritura incompatible con el orden de T1. Una transacción abortada puede reiniciarse con una <b>nueva marca</b>.');
    }
  });

  window.ESTUDIO = { FUENTES: FUENTES, CORTO: CORTO, UNIDADES: UNIDADES, TEMAS: T, tema: tema };
})();
