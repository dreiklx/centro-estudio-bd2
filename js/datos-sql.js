/* =====================================================================
   LABORATORIO SQL · bases de práctica y ejercicios
   Bases: 'super' (modelo Supermercado de la Guía #1), 'taller'
   (BD_TallerOptimizacion de la Guía #11) y 'libro' (Guía #9).
   Tipos de ejercicio:
     consulta   → se ejecuta y se compara el resultado con la solución
     modifica   → se ejecuta y se compara el estado de las tablas
     estructura → T-SQL que el simulador no ejecuta (DDL/DCL/procedural):
                  se verifica la estructura de la instrucción
   ===================================================================== */
(function () {
  function hoy() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  var BASES = {
    super: {
      nombre: 'SUPERMERCADO',
      esquema: [
        ['CATEGORIAS', ['ID_CATEGORIA*', 'DESCRIPCION']],
        ['PROVEEDORES', ['ID_PROVEEDOR*', 'NOMBRE', 'DIRECCION', 'TELEFONO']],
        ['PRODUCTOS', ['ID_PRODUCTO*', 'DESCRIPCION', 'PRECIO', 'ID_CATEGORIA', 'ID_PROVEEDOR']],
        ['CLIENTES', ['ID_CLIENTE*', 'NOMBRE', 'DIRECCION', 'TELEFONO']],
        ['FACTURAS', ['ID_FACTURA*', 'FECHA', 'ID_CLIENTE']],
        ['VENTAS', ['ID_VENTA*', 'ID_FACTURA', 'ID_PRODUCTO', 'CANTIDAD']]
      ],
      sql: function () {
        var h = hoy();
        return [
          'CREATE TABLE CATEGORIAS (ID_CATEGORIA INTEGER PRIMARY KEY, DESCRIPCION TEXT COLLATE NOCASE);',
          'CREATE TABLE PROVEEDORES (ID_PROVEEDOR INTEGER PRIMARY KEY, NOMBRE TEXT COLLATE NOCASE, DIRECCION TEXT COLLATE NOCASE, TELEFONO TEXT);',
          'CREATE TABLE PRODUCTOS (ID_PRODUCTO INTEGER PRIMARY KEY, DESCRIPCION TEXT COLLATE NOCASE, PRECIO DECIMAL(10,2), ID_CATEGORIA INT REFERENCES CATEGORIAS(ID_CATEGORIA), ID_PROVEEDOR INT REFERENCES PROVEEDORES(ID_PROVEEDOR));',
          'CREATE TABLE CLIENTES (ID_CLIENTE INTEGER PRIMARY KEY, NOMBRE TEXT COLLATE NOCASE, DIRECCION TEXT COLLATE NOCASE, TELEFONO TEXT);',
          'CREATE TABLE FACTURAS (ID_FACTURA INTEGER PRIMARY KEY, FECHA DATE, ID_CLIENTE INT REFERENCES CLIENTES(ID_CLIENTE));',
          'CREATE TABLE VENTAS (ID_VENTA INTEGER PRIMARY KEY, ID_FACTURA INT REFERENCES FACTURAS(ID_FACTURA), ID_PRODUCTO INT REFERENCES PRODUCTOS(ID_PRODUCTO), CANTIDAD INT);',
          "INSERT INTO CATEGORIAS VALUES (1,'Lácteos'),(2,'Bebidas'),(3,'Limpieza'),(4,'Abarrotes');",
          "INSERT INTO PROVEEDORES VALUES (1,'Distribuidora Central','Guápiles','2710-1000'),(2,'Lácteos del Valle','Turrialba','2556-2000'),(3,'Bebidas del Caribe','Limón','2758-3000');",
          "INSERT INTO PRODUCTOS VALUES (1,'Leche entera 1L',950,1,2),(2,'Queso turrialba 500g',3200,1,2),(3,'Yogurt natural',750,1,2),(4,'Refresco cola 2L',1450,2,3),(5,'Agua 600ml',600,2,3),(6,'Jugo de naranja 1L',1200,2,3),(7,'Detergente 1kg',2800,3,1),(8,'Jabón de baño',450,3,1),(9,'Arroz 2kg',2100,4,1),(10,'Frijoles 900g',1350,4,1),(11,'Café 500g',3900,4,1),(12,'Cloro 1L',980,3,1);",
          "INSERT INTO CLIENTES VALUES (1,'Ana Mora','Guápiles','8888-1111'),(2,'Carlos Rojas','Limón','8888-2222'),(3,'María Vargas','Siquirres','8888-3333'),(4,'Pedro Solís','Turrialba','8888-4444'),(5,'Laura Jiménez','Guápiles','8888-5555');",
          "INSERT INTO FACTURAS VALUES (1,'2026-09-10',1),(2,'2026-09-15',2),(3,'2026-10-01',1),(4,'2026-10-20',3),(5,'" + h + "',4),(6,'" + h + "',2),(7,'2024-06-15',3);",
          'INSERT INTO VENTAS VALUES (1,1,1,2),(2,1,9,1),(3,1,4,3),(4,2,5,6),(5,2,11,1),(6,3,1,4),(7,3,2,1),(8,4,7,1),(9,4,1,1),(10,5,6,2),(11,5,4,1),(12,6,3,5),(13,7,10,2),(14,7,1,3);'
        ].join('\n');
      }
    },
    taller: {
      nombre: 'BD_TallerOptimizacion',
      esquema: [
        ['Departamentos', ['id*', 'nombre', 'activo']],
        ['Empleados', ['id*', 'nombre', 'fecha_contratacion', 'departamento_id', 'salario']]
      ],
      sql: function () {
        var s = 'CREATE TABLE Departamentos (id INTEGER PRIMARY KEY, nombre TEXT COLLATE NOCASE, activo BIT);\n' +
          'CREATE TABLE Empleados (id INTEGER PRIMARY KEY, nombre TEXT COLLATE NOCASE, fecha_contratacion DATE, departamento_id INT REFERENCES Departamentos(id), salario DECIMAL(10,2));\n' +
          "INSERT INTO Departamentos VALUES (1,'TI',1),(2,'RH',1),(3,'Ventas',1),(4,'Finanzas',0),(5,'Legal',1),(6,'Marketing',1),(7,'Soporte',0),(8,'Operaciones',1),(9,'Producción',1),(10,'Logística',1);\n";
        // 300 empleados con un generador determinista (las respuestas son reproducibles)
        var x = 12345, filas = [];
        function r() { x = (x * 1103515245 + 12345) % 2147483648; return x / 2147483648; }
        var base = Date.UTC(2018, 0, 1);
        for (var i = 1; i <= 300; i++) {
          var f = new Date(base + Math.floor(r() * 3000) * 86400000).toISOString().slice(0, 10);
          filas.push("('Empleado_" + i + "','" + f + "'," + (1 + Math.floor(r() * 10)) + ',' + (1000 + Math.round(r() * 900000) / 100) + ')');
        }
        return s + 'INSERT INTO Empleados (nombre, fecha_contratacion, departamento_id, salario) VALUES ' + filas.join(',') + ';';
      }
    },
    libro: {
      nombre: 'LabConcurrenciaG9',
      esquema: [['Libro', ['LibroID*', 'Titulo', 'Disponibles (CHECK ≥ 0)']]],
      sql: function () {
        return "CREATE TABLE Libro (LibroID INTEGER PRIMARY KEY, Titulo TEXT, Disponibles INT NOT NULL CHECK (Disponibles >= 0));\nINSERT INTO Libro VALUES (1,'Bases de datos',1),(2,'Programacion',8);";
      }
    }
  };

  var GRUPOS = [
    { id: 'A', titulo: 'Consultas básicas', tema: 'sql-consultas' },
    { id: 'B', titulo: 'JOIN, agregados y subconsultas', tema: 'sql-join' },
    { id: 'C', titulo: 'Modificar datos y tablas', tema: 'sql-dml' },
    { id: 'D', titulo: 'Índices', tema: 'indices-tipos' },
    { id: 'E', titulo: 'Seguridad y vistas', tema: 'permisos-sql' },
    { id: 'F', titulo: 'Programación T-SQL', tema: 'variables-control' },
    { id: 'G', titulo: 'Transacciones y concurrencia', tema: 'transacciones' },
    { id: 'H', titulo: 'Respaldo y recuperación', tema: 'backup-restore' },
    { id: 'I', titulo: 'Optimización', tema: 'optimizacion-practica' },
    { id: 'J', titulo: 'BD distribuidas', tema: 'servidores-vinculados' }
  ];

  var E = [];
  function ej(o) { E.push(o); }

  /* ---------------- A · Consultas básicas ---------------- */
  ej({ g: 'A', n: 1, tema: 'sql-consultas', titulo: 'Todos los productos', tipo: 'consulta', db: 'super',
    enunciado: 'Muestre <b>todos</b> los productos registrados (todas las columnas).',
    pista: 'Use el asterisco para indicar todas las columnas.',
    solucion: 'SELECT * FROM PRODUCTOS;',
    explicacion: '<code>SELECT *</code> devuelve todas las columnas; sin WHERE se obtienen las 12 filas.' });
  ej({ g: 'A', n: 2, tema: 'sql-consultas', titulo: 'Productos de la categoría 1', tipo: 'consulta', db: 'super',
    enunciado: 'Muestre todos los productos que pertenecen a la <b>categoría 1</b> (Guía #1, punto 4).',
    pista: 'Filtre con WHERE sobre la columna ID_CATEGORIA.',
    solucion: 'SELECT * FROM PRODUCTOS WHERE ID_CATEGORIA = 1;',
    explicacion: 'La condición <code>ID_CATEGORIA = 1</code> deja los 3 productos lácteos.' });
  ej({ g: 'A', n: 3, tema: 'sql-consultas', titulo: 'Productos de menos de 1000', tipo: 'consulta', db: 'super',
    enunciado: 'Muestre todos los productos que valen <b>menos de 1000</b> (Guía #1, punto 5).',
    pista: 'Operador de comparación sobre PRECIO.',
    solucion: 'SELECT * FROM PRODUCTOS WHERE PRECIO < 1000;',
    explicacion: '<code>&lt;</code> es estricto: un producto de exactamente 1000 no aparecería.' });
  ej({ g: 'A', n: 4, tema: 'sql-consultas', titulo: 'Precios de mayor a menor', tipo: 'consulta', db: 'super', ordenado: true,
    enunciado: 'Muestre la <b>DESCRIPCION</b> y el <b>PRECIO</b> de todos los productos, ordenados del precio <b>mayor al menor</b>.',
    pista: 'ORDER BY con la palabra que indica orden descendente.',
    solucion: 'SELECT DESCRIPCION, PRECIO FROM PRODUCTOS ORDER BY PRECIO DESC;',
    explicacion: 'Aquí el orden importa: se compara también la secuencia de filas. <code>DESC</code> = descendente.' });
  ej({ g: 'A', n: 5, tema: 'sql-consultas', titulo: 'Clientes de Guápiles', tipo: 'consulta', db: 'super',
    enunciado: "Muestre el <b>NOMBRE</b> y el <b>TELEFONO</b> de los clientes cuya DIRECCION es <b>'Guápiles'</b>.",
    pista: 'Los textos van entre comillas simples.',
    solucion: "SELECT NOMBRE, TELEFONO FROM CLIENTES WHERE DIRECCION = 'Guápiles';",
    explicacion: 'Ana Mora y Laura Jiménez viven en Guápiles.' });
  ej({ g: 'A', n: 6, tema: 'sql-consultas', titulo: 'Bebidas de 1000 o más', tipo: 'consulta', db: 'super',
    enunciado: 'Muestre todos los productos de la <b>categoría 2</b> cuyo precio sea <b>mayor o igual a 1000</b>.',
    pista: 'Dos condiciones que deben cumplirse a la vez: AND.',
    solucion: 'SELECT * FROM PRODUCTOS WHERE ID_CATEGORIA = 2 AND PRECIO >= 1000;',
    explicacion: 'Con AND se cumplen ambas: refresco (1450) y jugo (1200).' });
  ej({ g: 'A', n: 7, tema: 'sql-consultas', titulo: 'Categorías 1 o 3', tipo: 'consulta', db: 'super',
    enunciado: 'Muestre la <b>DESCRIPCION</b> de los productos de la categoría <b>1 o 3</b>.',
    pista: 'Puede usar OR o el operador IN con una lista.',
    solucion: 'SELECT DESCRIPCION FROM PRODUCTOS WHERE ID_CATEGORIA IN (1, 3);',
    explicacion: '<code>IN (1, 3)</code> equivale a <code>ID_CATEGORIA = 1 OR ID_CATEGORIA = 3</code>; ambas se aceptan.' });
  ej({ g: 'A', n: 8, tema: 'sql-consultas', titulo: 'Facturas de septiembre de 2026', tipo: 'consulta', db: 'super',
    enunciado: "Muestre todas las facturas con FECHA entre el <b>'2026-09-01'</b> y el <b>'2026-09-30'</b>, inclusive.",
    pista: 'BETWEEN … AND … incluye los extremos.',
    solucion: "SELECT * FROM FACTURAS WHERE FECHA BETWEEN '2026-09-01' AND '2026-09-30';",
    explicacion: 'Las facturas 1 y 2 son de septiembre. También se acepta <code>FECHA &gt;= … AND FECHA &lt;= …</code>.' });

  /* ---------------- B · JOIN y agregados ---------------- */
  ej({ g: 'B', n: 1, tema: 'sql-join', titulo: 'Compras del cliente 1', tipo: 'consulta', db: 'super',
    enunciado: 'Muestre las facturas compradas por el <b>cliente 1</b> incluyendo el nombre de los productos (Guía #1, punto 6). Columnas: <b>ID_FACTURA, FECHA, DESCRIPCION</b> (del producto).',
    pista: 'Una FACTURAS con VENTAS por ID_FACTURA y VENTAS con PRODUCTOS por ID_PRODUCTO.',
    solucion: 'SELECT F.ID_FACTURA, F.FECHA, P.DESCRIPCION\nFROM FACTURAS F\nJOIN VENTAS V ON V.ID_FACTURA = F.ID_FACTURA\nJOIN PRODUCTOS P ON P.ID_PRODUCTO = V.ID_PRODUCTO\nWHERE F.ID_CLIENTE = 1;',
    explicacion: 'Se necesitan dos JOIN: la factura no guarda los productos; VENTAS es la tabla de detalle.' });
  ej({ g: 'B', n: 2, tema: 'sql-join', titulo: 'Producto y su categoría', tipo: 'consulta', db: 'super',
    enunciado: 'Muestre la descripción de cada <b>producto</b> junto a la descripción de su <b>categoría</b> (2 columnas).',
    pista: 'Ambas tablas tienen DESCRIPCION: use alias para distinguirlas.',
    solucion: 'SELECT P.DESCRIPCION, C.DESCRIPCION\nFROM PRODUCTOS P\nJOIN CATEGORIAS C ON C.ID_CATEGORIA = P.ID_CATEGORIA;',
    explicacion: 'Los alias P y C resuelven la ambigüedad de la columna DESCRIPCION.' });
  ej({ g: 'B', n: 3, tema: 'sql-join', titulo: 'Contar productos', tipo: 'consulta', db: 'super',
    enunciado: 'Muestre <b>cuántos productos</b> hay registrados (una sola columna).',
    pista: 'Función de agregado que cuenta filas.',
    solucion: 'SELECT COUNT(*) AS CANTIDAD FROM PRODUCTOS;',
    explicacion: '<code>COUNT(*)</code> devuelve 12. El alias de la columna no afecta la evaluación.' });
  ej({ g: 'B', n: 4, tema: 'sql-join', titulo: 'Total de la factura 1', tipo: 'consulta', db: 'super',
    enunciado: 'Calcule el <b>total de la factura 1</b>: la suma del precio de cada producto multiplicado por su cantidad (Guía #6, ejercicio 2).',
    pista: 'SUM(precio × cantidad) uniendo VENTAS con PRODUCTOS y filtrando ID_FACTURA = 1.',
    solucion: 'SELECT SUM(P.PRECIO * V.CANTIDAD) AS TOTAL\nFROM VENTAS V\nJOIN PRODUCTOS P ON P.ID_PRODUCTO = V.ID_PRODUCTO\nWHERE V.ID_FACTURA = 1;',
    explicacion: '2 × 950 + 1 × 2100 + 3 × 1450 = 8 350.' });
  ej({ g: 'B', n: 5, tema: 'sql-join', titulo: 'Facturas por cliente', tipo: 'consulta', db: 'super',
    enunciado: 'Muestre el <b>ID_CLIENTE</b> y la <b>cantidad de facturas</b> de cada cliente que tenga facturas.',
    pista: 'COUNT(*) con GROUP BY ID_CLIENTE.',
    solucion: 'SELECT ID_CLIENTE, COUNT(*) AS CANTIDAD\nFROM FACTURAS\nGROUP BY ID_CLIENTE;',
    explicacion: 'Es la versión orientada a conjuntos del ejercicio de cursores “clientes con más compras” (Guía #6).' });
  ej({ g: 'B', n: 6, tema: 'sql-join', titulo: 'Top 3 más vendidos', tipo: 'consulta', db: 'super', ordenado: true,
    enunciado: 'Muestre la <b>DESCRIPCION</b> y el <b>total de unidades vendidas</b> de los <b>3 productos más vendidos</b>, de mayor a menor (Guía #5, ejercicio 9).',
    pista: 'SUM(CANTIDAD) agrupando por producto, ORDER BY descendente y TOP 3.',
    solucion: 'SELECT TOP 3 P.DESCRIPCION, SUM(V.CANTIDAD) AS VENDIDOS\nFROM VENTAS V\nJOIN PRODUCTOS P ON P.ID_PRODUCTO = V.ID_PRODUCTO\nGROUP BY P.DESCRIPCION\nORDER BY VENDIDOS DESC;',
    explicacion: 'Leche (10), Agua (6) y Yogurt (5). Sin ORDER BY, TOP no garantiza cuáles devuelve.' });
  ej({ g: 'B', n: 7, tema: 'sql-join', titulo: 'Clientes sin compras', tipo: 'consulta', db: 'super',
    enunciado: 'Muestre el <b>NOMBRE</b> de los clientes que <b>no tienen facturas</b> (Guía #6, ejercicio de cursores 3, resuelto con una consulta).',
    pista: 'NOT IN con una subconsulta sobre FACTURAS.',
    solucion: 'SELECT NOMBRE FROM CLIENTES\nWHERE ID_CLIENTE NOT IN (SELECT ID_CLIENTE FROM FACTURAS);',
    explicacion: 'Laura Jiménez no tiene facturas. También es válido un NOT EXISTS o un LEFT JOIN … WHERE F.ID_FACTURA IS NULL.' });
  ej({ g: 'B', n: 8, tema: 'sql-join', titulo: 'Productos de la categoría Bebidas', tipo: 'consulta', db: 'super',
    enunciado: "Muestre la <b>DESCRIPCION</b> de los productos cuya categoría se llama <b>'Bebidas'</b>, sin escribir el número de la categoría.",
    pista: 'Subconsulta con IN, o un JOIN con CATEGORIAS.',
    solucion: "SELECT DESCRIPCION FROM PRODUCTOS\nWHERE ID_CATEGORIA IN (SELECT ID_CATEGORIA FROM CATEGORIAS WHERE DESCRIPCION = 'Bebidas');",
    explicacion: 'La Guía #11 compara justamente la versión con IN y la versión con JOIN: ambas dan el mismo resultado.' });
  ej({ g: 'B', n: 9, tema: 'sql-join', titulo: 'Historial de compras del cliente 2', tipo: 'consulta', db: 'super',
    enunciado: 'Muestre el detalle de las compras del <b>cliente 2</b>: <b>ID_FACTURA, FECHA, DESCRIPCION, CANTIDAD</b> (Guía #5, ejercicio 8).',
    pista: 'Igual que el ejercicio B1, agregando CANTIDAD y cambiando el cliente.',
    solucion: 'SELECT F.ID_FACTURA, F.FECHA, P.DESCRIPCION, V.CANTIDAD\nFROM FACTURAS F\nJOIN VENTAS V ON V.ID_FACTURA = F.ID_FACTURA\nJOIN PRODUCTOS P ON P.ID_PRODUCTO = V.ID_PRODUCTO\nWHERE F.ID_CLIENTE = 2;',
    explicacion: 'Dos facturas: la 2 (agua y café) y la de hoy (yogurt).' });
  ej({ g: 'B', n: 10, tema: 'sql-join', titulo: 'Ventas por mes de 2026', tipo: 'consulta', db: 'super',
    enunciado: 'Muestre el <b>número de mes</b> y el <b>total vendido</b> (precio × cantidad) de cada mes del año <b>2026</b> (Guía #5, ejercicio 10).',
    pista: 'MONTH(FECHA) en el SELECT y en el GROUP BY; YEAR(FECHA) = 2026 en el WHERE.',
    solucion: 'SELECT MONTH(F.FECHA) AS MES, SUM(P.PRECIO * V.CANTIDAD) AS TOTAL\nFROM FACTURAS F\nJOIN VENTAS V ON V.ID_FACTURA = F.ID_FACTURA\nJOIN PRODUCTOS P ON P.ID_PRODUCTO = V.ID_PRODUCTO\nWHERE YEAR(F.FECHA) = 2026\nGROUP BY MONTH(F.FECHA);',
    explicacion: 'Se combinan JOIN, funciones de fecha, WHERE y GROUP BY. Las facturas de hoy cuentan en el mes actual.' });
  ej({ g: 'B', n: 11, tema: 'sql-join', titulo: 'Facturas con más de 60 días', tipo: 'consulta', db: 'super',
    enunciado: 'Muestre todas las facturas con <b>más de 60 días</b> de antigüedad respecto a hoy (base del ejercicio 4 de la Guía #6).',
    pista: 'DATEDIFF(DAY, FECHA, GETDATE()) > 60',
    solucion: 'SELECT * FROM FACTURAS WHERE DATEDIFF(DAY, FECHA, GETDATE()) > 60;',
    explicacion: 'DATEDIFF(DAY, a, b) cuenta los días de a hasta b. El resultado depende de la fecha de hoy y la solución se calcula en vivo.' });

  /* ---------------- C · Modificar datos y tablas ---------------- */
  ej({ g: 'C', n: 1, tema: 'sql-dml', titulo: 'Insertar un cliente', tipo: 'modifica', db: 'super', tablas: ['CLIENTES'],
    enunciado: "Inserte el cliente <b>6</b>, <b>'Sofía Brenes'</b>, dirección <b>'Limón'</b>, teléfono <b>'8888-6666'</b>.",
    pista: 'INSERT INTO tabla (columnas) VALUES (valores).',
    solucion: "INSERT INTO CLIENTES (ID_CLIENTE, NOMBRE, DIRECCION, TELEFONO)\nVALUES (6, 'Sofía Brenes', 'Limón', '8888-6666');",
    explicacion: 'Se compara el contenido final de CLIENTES. Escribir la lista de columnas es opcional si se dan todos los valores en orden.' });
  ej({ g: 'C', n: 2, tema: 'sql-dml', titulo: 'Aumentar 10% los precios', tipo: 'modifica', db: 'super', tablas: ['PRODUCTOS'],
    enunciado: 'Aumente un <b>10 %</b> el precio de <b>todos</b> los productos (Guía #1, punto 7).',
    pista: 'UPDATE … SET PRECIO = PRECIO * …',
    solucion: 'UPDATE PRODUCTOS SET PRECIO = PRECIO * 1.10;',
    explicacion: 'Multiplicar por 1.10 equivale a sumar el 10 %. También se acepta <code>PRECIO + PRECIO * 0.10</code>.' });
  ej({ g: 'C', n: 3, tema: 'sql-dml', titulo: 'Aumento por categoría', tipo: 'modifica', db: 'super', tablas: ['PRODUCTOS'],
    enunciado: 'Aumente un <b>5 %</b> el precio solo de los productos de la <b>categoría 2</b> (Guía #6, ejercicio 3).',
    pista: 'Igual que el anterior, pero con WHERE.',
    solucion: 'UPDATE PRODUCTOS SET PRECIO = PRECIO * 1.05 WHERE ID_CATEGORIA = 2;',
    explicacion: 'Sin el WHERE se modificarían todos los productos.' });
  ej({ g: 'C', n: 4, tema: 'sql-dml', titulo: 'Eliminar las facturas de hoy', tipo: 'modifica', db: 'super', tablas: ['FACTURAS', 'VENTAS'], nivel: 3,
    enunciado: 'Elimine las facturas con <b>fecha de hoy</b> (Guía #1, punto 8). Recuerde que VENTAS tiene una clave foránea hacia FACTURAS: elimine primero las ventas de esas facturas.',
    pista: 'Dos DELETE. El primero borra de VENTAS las filas cuyo ID_FACTURA esté en las facturas de hoy; la fecha de hoy es CAST(GETDATE() AS DATE).',
    solucion: 'DELETE FROM VENTAS\nWHERE ID_FACTURA IN (SELECT ID_FACTURA FROM FACTURAS WHERE FECHA = CAST(GETDATE() AS DATE));\nDELETE FROM FACTURAS WHERE FECHA = CAST(GETDATE() AS DATE);',
    explicacion: 'Si se borra primero FACTURAS, el motor rechaza la operación por la clave foránea (integridad referencial).' });
  ej({ g: 'C', n: 5, tema: 'sql-dml', titulo: 'Agregar la columna STOCK', tipo: 'modifica', db: 'super', tablas: ['PRODUCTOS'],
    enunciado: 'Agregue a PRODUCTOS la columna <b>STOCK</b> de tipo entero, <b>obligatoria</b> y con valor por defecto <b>0</b> (Guía #7, ejercicio 1).',
    pista: 'ALTER TABLE … ADD columna tipo NOT NULL DEFAULT valor',
    solucion: 'ALTER TABLE PRODUCTOS ADD STOCK INT NOT NULL DEFAULT 0;',
    explicacion: 'Las filas existentes reciben el valor por defecto 0.' });
  ej({ g: 'C', n: 6, tema: 'sql-dml', titulo: 'Tabla AuditoriaFacturas', tipo: 'estructura', nivel: 2,
    enunciado: 'Escriba el <b>CREATE TABLE AuditoriaFacturas</b> de la Guía #7: <code>id_auditoria</code> entero autoincremental (IDENTITY(1,1)) y clave primaria, <code>id_factura</code> INT, <code>id_cliente</code> INT, <code>fecha_factura</code> DATE y <code>fecha_registro</code> DATETIME.',
    pista: 'id_auditoria INT IDENTITY(1,1) PRIMARY KEY, y luego las demás columnas separadas por comas.',
    solucion: 'CREATE TABLE AuditoriaFacturas (\n    id_auditoria INT IDENTITY(1,1) PRIMARY KEY,\n    id_factura INT,\n    id_cliente INT,\n    fecha_factura DATE,\n    fecha_registro DATETIME\n);',
    checks: [
      ['^CREATE TABLE AUDITORIAFACTURAS\\(', 'Debe empezar con CREATE TABLE AuditoriaFacturas ('],
      ['ID_AUDITORIA INT (IDENTITY(\\(1,1\\))? PRIMARY KEY|PRIMARY KEY IDENTITY(\\(1,1\\))?)', 'id_auditoria debe ser INT con IDENTITY(1,1) y PRIMARY KEY'],
      ['ID_FACTURA INT', 'Falta la columna id_factura INT'],
      ['ID_CLIENTE INT', 'Falta la columna id_cliente INT'],
      ['FECHA_FACTURA DATE', 'Falta la columna fecha_factura DATE'],
      ['FECHA_REGISTRO DATETIME', 'Falta la columna fecha_registro DATETIME']
    ],
    explicacion: 'IDENTITY(1,1) genera el número automáticamente: empieza en 1 y aumenta de 1 en 1.' });

  /* ---------------- D · Índices ---------------- */
  ej({ g: 'D', n: 1, tema: 'indices-tipos', titulo: 'Índice no agrupado por nombre', tipo: 'estructura',
    enunciado: 'Cree un índice <b>no agrupado</b> llamado <code>idx_clientes_nombre</code> sobre la columna NOMBRE de CLIENTES (Guía #3, ejercicio 3b).',
    pista: 'CREATE NONCLUSTERED INDEX nombre ON tabla (columna)',
    solucion: 'CREATE NONCLUSTERED INDEX idx_clientes_nombre ON CLIENTES (NOMBRE);',
    checks: [['^CREATE (NONCLUSTERED )?INDEX IDX_CLIENTES_NOMBRE ', 'Use CREATE NONCLUSTERED INDEX idx_clientes_nombre (CREATE INDEX también crea uno no agrupado)'], ['ON CLIENTES\\(NOMBRE( ASC)?\\)', 'El índice debe ir ON CLIENTES (NOMBRE)']],
    prohibido: [['(^| )CLUSTERED INDEX', 'Se pidió un índice NO agrupado; CLUSTERED reordenaría físicamente la tabla']],
    explicacion: 'Puede haber varios índices no agrupados; contienen punteros a las filas.' });
  ej({ g: 'D', n: 2, tema: 'indices-tipos', titulo: 'Índice compuesto', tipo: 'estructura',
    enunciado: 'Cree el índice <code>idx_clientes_nombre_dir</code> sobre las columnas <b>NOMBRE</b> y <b>DIRECCION</b> de CLIENTES, en ese orden.',
    pista: 'Un índice compuesto lista varias columnas entre paréntesis.',
    solucion: 'CREATE INDEX idx_clientes_nombre_dir ON CLIENTES (NOMBRE, DIRECCION);',
    checks: [['^CREATE (NONCLUSTERED )?INDEX IDX_CLIENTES_NOMBRE_DIR ', 'Use CREATE INDEX idx_clientes_nombre_dir'], ['ON CLIENTES\\(NOMBRE( ASC)?,DIRECCION( ASC)?\\)', 'Las columnas deben ser (NOMBRE, DIRECCION) en ese orden']],
    explicacion: 'El orden de las columnas en un índice compuesto importa: favorece filtros por NOMBRE, o por NOMBRE y DIRECCION.' });
  ej({ g: 'D', n: 3, tema: 'indices-tipos', titulo: 'Índice único en teléfono', tipo: 'estructura',
    enunciado: 'Cree el índice <b>único</b> <code>idx_clientes_tel</code> sobre TELEFONO de CLIENTES para evitar números duplicados.',
    pista: 'CREATE UNIQUE INDEX …',
    solucion: 'CREATE UNIQUE INDEX idx_clientes_tel ON CLIENTES (TELEFONO);',
    checks: [['^CREATE UNIQUE (NONCLUSTERED )?INDEX IDX_CLIENTES_TEL ', 'Use CREATE UNIQUE INDEX idx_clientes_tel'], ['ON CLIENTES\\(TELEFONO( ASC)?\\)', 'El índice debe ir ON CLIENTES (TELEFONO)']],
    explicacion: 'Un índice único garantiza que no se repitan valores; puede ser clustered o non-clustered.' });
  ej({ g: 'D', n: 4, tema: 'indices-tipos', titulo: 'Ver los índices', tipo: 'estructura', nivel: 1,
    enunciado: 'Muestre los índices creados en la tabla <b>CLIENTES</b>.',
    pista: 'Procedimiento del sistema sp_help…',
    solucion: 'sp_helpindex CLIENTES;',
    checks: [['^(EXEC(UTE)? )?SP_HELPINDEX \'?CLIENTES\'?$', 'Use sp_helpindex CLIENTES (con o sin EXEC)']],
    explicacion: 'sp_helpindex lista nombre, descripción y columnas de cada índice.' });
  ej({ g: 'D', n: 5, tema: 'indices-tipos', titulo: 'Eliminar un índice', tipo: 'estructura', nivel: 1,
    enunciado: 'Elimine el índice <code>idx_clientes_tel</code> de la tabla CLIENTES.',
    pista: 'DROP INDEX nombre ON tabla',
    solucion: 'DROP INDEX idx_clientes_tel ON CLIENTES;',
    checks: [['^DROP INDEX (IDX_CLIENTES_TEL ON CLIENTES|CLIENTES\\.IDX_CLIENTES_TEL)$', 'Use DROP INDEX idx_clientes_tel ON CLIENTES']],
    explicacion: 'SQL Server también acepta la forma antigua DROP INDEX CLIENTES.idx_clientes_tel.' });
  ej({ g: 'D', n: 6, tema: 'indices-tipos', titulo: 'Fragmentación alta', tipo: 'estructura', nivel: 2,
    enunciado: 'El índice <code>idx_clientes_nombre</code> tiene <b>fragmentación alta</b>. Escriba la instrucción adecuada para corregirlo.',
    pista: 'Con fragmentación alta no basta con reorganizar.',
    solucion: 'ALTER INDEX idx_clientes_nombre ON CLIENTES REBUILD;',
    checks: [['^ALTER INDEX IDX_CLIENTES_NOMBRE ON CLIENTES ', 'Use ALTER INDEX idx_clientes_nombre ON CLIENTES …'], ['REBUILD$', 'Con fragmentación alta corresponde REBUILD (reconstruir)']],
    explicacion: 'REORGANIZE es para fragmentación baja; REBUILD reconstruye el índice completo.' });

  /* ---------------- E · Seguridad y vistas ---------------- */
  ej({ g: 'E', n: 1, tema: 'permisos-sql', titulo: 'Crear el login cajero', tipo: 'estructura',
    enunciado: "Cree el login <b>cajero</b> con autenticación de SQL Server, contraseña <code>'Clave2026*'</code> y base por defecto <b>SUPERMERCADO</b>.",
    pista: "CREATE LOGIN … WITH PASSWORD = '…', DEFAULT_DATABASE = …",
    solucion: "CREATE LOGIN cajero WITH PASSWORD = 'Clave2026*', DEFAULT_DATABASE = SUPERMERCADO;",
    checks: [['^CREATE LOGIN CAJERO WITH PASSWORD=\'', "Use CREATE LOGIN cajero WITH PASSWORD = '…'"], ['DEFAULT_DATABASE=SUPERMERCADO', 'Falta DEFAULT_DATABASE = SUPERMERCADO']],
    prohibido: [['FROM WINDOWS', 'FROM WINDOWS es para autenticación de Windows; aquí se pidió autenticación de SQL Server']],
    explicacion: 'Puede agregar MUST_CHANGE y CHECK_EXPIRATION = ON como en la guía; no son obligatorios en este ejercicio.' });
  ej({ g: 'E', n: 2, tema: 'permisos-sql', titulo: 'Usuario para el login', tipo: 'estructura', nivel: 1,
    enunciado: 'Cree en la base el usuario <b>usuario1</b> asociado al login <b>cajero</b>.',
    pista: 'CREATE USER … FOR LOGIN …',
    solucion: 'CREATE USER usuario1 FOR LOGIN cajero;',
    checks: [['^CREATE USER USUARIO1 (FOR|FROM) LOGIN CAJERO$', 'Use CREATE USER usuario1 FOR LOGIN cajero']],
    explicacion: 'El login da acceso al servidor; el usuario, a una base concreta.' });
  ej({ g: 'E', n: 3, tema: 'permisos-sql', titulo: 'Otorgar consulta e inserción', tipo: 'estructura',
    enunciado: 'Otorgue a <b>usuario1</b> los permisos <b>SELECT</b> e <b>INSERT</b> sobre la tabla <b>PRODUCTOS</b>.',
    pista: 'GRANT permiso1, permiso2 ON tabla TO usuario',
    solucion: 'GRANT SELECT, INSERT ON dbo.PRODUCTOS TO usuario1;',
    checks: [['^GRANT (SELECT,INSERT|INSERT,SELECT) ON (OBJECT::)?PRODUCTOS TO USUARIO1$', 'Use GRANT SELECT, INSERT ON PRODUCTOS TO usuario1 (el orden de los permisos no importa)']],
    explicacion: 'El prefijo dbo. es opcional en este ejercicio.' });
  ej({ g: 'E', n: 4, tema: 'permisos-sql', titulo: 'Prohibir eliminar', tipo: 'estructura', nivel: 2,
    enunciado: 'Impida explícitamente que <b>usuario1</b> pueda <b>eliminar</b> filas de PRODUCTOS, <b>aunque</b> pertenezca a un rol que sí lo permita.',
    pista: 'No es REVOKE: hace falta la instrucción que prevalece sobre los roles.',
    solucion: 'DENY DELETE ON dbo.PRODUCTOS TO usuario1;',
    checks: [['^DENY DELETE ON (OBJECT::)?PRODUCTOS TO USUARIO1$', 'Use DENY DELETE ON PRODUCTOS TO usuario1']],
    prohibido: [['^REVOKE', 'REVOKE solo quita un permiso otorgado; el rol seguiría dándolo. Se necesita DENY']],
    explicacion: 'DENY prevalece incluso si el usuario recibe el permiso por un rol.' });
  ej({ g: 'E', n: 5, tema: 'permisos-sql', titulo: 'Rol de consulta', tipo: 'estructura', nivel: 3,
    enunciado: 'En tres instrucciones: (1) cree el rol <b>rol_consulta</b>, (2) otórguele <b>SELECT</b> sobre PRODUCTOS y (3) agregue a <b>usuario1</b> como miembro.',
    pista: 'CREATE ROLE · GRANT … TO rol · ALTER ROLE … ADD MEMBER …',
    solucion: 'CREATE ROLE rol_consulta;\nGRANT SELECT ON dbo.PRODUCTOS TO rol_consulta;\nALTER ROLE rol_consulta ADD MEMBER usuario1;',
    checks: [['CREATE ROLE ROL_CONSULTA', 'Falta CREATE ROLE rol_consulta'], ['GRANT SELECT ON (OBJECT::)?PRODUCTOS TO ROL_CONSULTA', 'Falta GRANT SELECT ON PRODUCTOS TO rol_consulta'], ['ALTER ROLE ROL_CONSULTA ADD MEMBER USUARIO1', 'Falta ALTER ROLE rol_consulta ADD MEMBER usuario1']],
    explicacion: 'Un rol agrupa permisos para asignarlos a varios usuarios a la vez.' });
  ej({ g: 'E', n: 6, tema: 'control-acceso', titulo: 'Vista de productos básicos', tipo: 'modifica', db: 'super', nivel: 2,
    verifica: 'SELECT * FROM vista_productos',
    enunciado: 'Cree la vista <b>vista_productos</b> que muestre solo <b>ID_PRODUCTO, DESCRIPCION y PRECIO</b> de los productos con precio <b>menor a 2000</b> (vistas como mecanismo de seguridad, Guía #4).',
    pista: 'CREATE VIEW nombre AS SELECT …',
    solucion: 'CREATE VIEW vista_productos AS\nSELECT ID_PRODUCTO, DESCRIPCION, PRECIO\nFROM PRODUCTOS\nWHERE PRECIO < 2000;',
    explicacion: 'Se consulta la vista creada y se compara con la esperada. La vista oculta proveedor y categoría, y los productos caros.' });

  /* ---------------- F · Programación T-SQL ---------------- */
  ej({ g: 'F', n: 1, tema: 'variables-control', titulo: 'Variable e IF…ELSE', tipo: 'estructura', nivel: 1,
    enunciado: "Declare la variable <code>@Precio</code> DECIMAL(10,2) con valor <b>1500</b>. Si es mayor que 1000 imprima <code>'Caro'</code>; si no, <code>'Económico'</code>.",
    pista: 'DECLARE @Precio DECIMAL(10,2) = 1500; IF … PRINT …; ELSE PRINT …;',
    solucion: "DECLARE @Precio DECIMAL(10,2) = 1500;\nIF @Precio > 1000\n    PRINT 'Caro';\nELSE\n    PRINT 'Económico';",
    checks: [['DECLARE @PRECIO DECIMAL\\(10,2\\)', 'Declare @Precio DECIMAL(10,2)'], ['(DECLARE @PRECIO DECIMAL\\(10,2\\)=1500|SET @PRECIO=1500)', 'Asigne el valor 1500 (en el DECLARE o con SET)'], ['IF @PRECIO>1000', 'Falta la condición IF @Precio > 1000'], ["PRINT 'CARO'", "Falta PRINT 'Caro'"], ["ELSE (BEGIN )?PRINT 'ECONOMICO'", "Falta ELSE PRINT 'Económico'"]],
    explicacion: 'Variables locales con @; IF…ELSE para decidir.' });
  ej({ g: 'F', n: 2, tema: 'variables-control', titulo: 'Ciclo WHILE', tipo: 'estructura', nivel: 2,
    enunciado: 'Con un ciclo <b>WHILE</b> y la variable <code>@i</code>, imprima los números del <b>1 al 5</b>.',
    pista: 'DECLARE @i INT = 1; WHILE @i <= 5 BEGIN … SET @i = @i + 1; END',
    solucion: 'DECLARE @i INT = 1;\nWHILE @i <= 5\nBEGIN\n    PRINT @i;\n    SET @i = @i + 1;\nEND;',
    checks: [['DECLARE @I INT', 'Declare @i INT'], ['(DECLARE @I INT=1|SET @I=1)', 'Inicie @i en 1'], ['WHILE @I(<=5|<6)', 'Use WHILE @i <= 5'], ['BEGIN', 'El cuerpo del ciclo va entre BEGIN y END'], ['PRINT', 'Falta el PRINT'], ['SET @I=@I\\+1|SET @I\\+=1', 'Falta incrementar: SET @i = @i + 1'], ['END', 'Falta END']],
    explicacion: 'Sin el incremento el ciclo sería infinito.' });
  ej({ g: 'F', n: 3, tema: 'excepciones', titulo: 'Capturar un error', tipo: 'estructura', nivel: 2,
    enunciado: "Dentro de un bloque TRY divida <b>10 / 0</b> y en el CATCH imprima <code>'Error: '</code> concatenado con el mensaje del error.",
    pista: 'BEGIN TRY … END TRY BEGIN CATCH PRINT … + ERROR_MESSAGE(); END CATCH',
    solucion: "BEGIN TRY\n    DECLARE @r INT;\n    SET @r = 10 / 0;\nEND TRY\nBEGIN CATCH\n    PRINT 'Error: ' + ERROR_MESSAGE();\nEND CATCH;",
    checks: [['BEGIN TRY', 'Falta BEGIN TRY'], ['10/0', 'Falta la división 10 / 0 dentro del TRY'], ['END TRY BEGIN CATCH', 'Después de END TRY debe ir BEGIN CATCH'], ['ERROR_MESSAGE\\(\\)', 'Use ERROR_MESSAGE() para obtener el mensaje'], ['END CATCH', 'Falta END CATCH']],
    explicacion: 'La división entre cero genera un error que el CATCH captura.' });
  ej({ g: 'F', n: 4, tema: 'funciones', titulo: 'Función fn_Descuento', tipo: 'estructura', nivel: 2,
    enunciado: 'Cree la función escalar <b>fn_Descuento(@precio DECIMAL(10,2), @descuento DECIMAL(5,2))</b> que devuelva el precio con el descuento (porcentaje) aplicado, como DECIMAL(10,2) (Guía #5, ejercicio 3).',
    pista: 'RETURNS DECIMAL(10,2) AS BEGIN RETURN @precio - @precio * @descuento / 100; END',
    solucion: 'CREATE FUNCTION fn_Descuento (@precio DECIMAL(10,2), @descuento DECIMAL(5,2))\nRETURNS DECIMAL(10,2) AS\nBEGIN\n    RETURN @precio - (@precio * @descuento / 100);\nEND;',
    checks: [['CREATE FUNCTION FN_DESCUENTO\\(@PRECIO DECIMAL\\(10,2\\),@DESCUENTO DECIMAL\\(5,2\\)\\)', 'Encabezado: CREATE FUNCTION fn_Descuento (@precio DECIMAL(10,2), @descuento DECIMAL(5,2))'], ['RETURNS DECIMAL\\(10,2\\)', 'Falta RETURNS DECIMAL(10,2)'], ['BEGIN', 'El cuerpo va entre BEGIN y END'], ['RETURN ', 'Falta RETURN con el cálculo'], ['@DESCUENTO/100|/100', 'El descuento es un porcentaje: divida entre 100'], ['END', 'Falta END']],
    explicacion: 'Una función escalar devuelve un solo valor; también es válido <code>@precio * (1 - @descuento / 100)</code>.' });
  ej({ g: 'F', n: 5, tema: 'funciones', titulo: 'Función de tabla en línea', tipo: 'estructura', nivel: 2,
    enunciado: 'Cree la función de tabla <b>en línea</b> <b>fn_ProductosMayoresA(@precio DECIMAL(10,2))</b> que devuelva todos los PRODUCTOS con precio mayor al indicado (Guía #5, ejercicio 7).',
    pista: 'RETURNS TABLE AS RETURN SELECT … (sin BEGIN…END)',
    solucion: 'CREATE FUNCTION fn_ProductosMayoresA (@precio DECIMAL(10,2))\nRETURNS TABLE AS\nRETURN SELECT * FROM PRODUCTOS WHERE PRECIO > @precio;',
    checks: [['CREATE FUNCTION FN_PRODUCTOSMAYORESA\\(@PRECIO DECIMAL\\(10,2\\)\\)', 'Encabezado: CREATE FUNCTION fn_ProductosMayoresA (@precio DECIMAL(10,2))'], ['RETURNS TABLE AS', 'Una función en línea usa RETURNS TABLE AS'], ['RETURN ?\\(? ?SELECT ','Falta RETURN SELECT …'], ['FROM PRODUCTOS', 'Debe consultar PRODUCTOS'], ['PRECIO>@PRECIO', 'Falta la condición PRECIO > @precio']],
    prohibido: [['RETURNS @', 'Eso declara una función de valores múltiples; se pidió una en línea']],
    explicacion: 'Se usa en el FROM: <code>SELECT * FROM fn_ProductosMayoresA(2000)</code>.' });
  ej({ g: 'F', n: 6, tema: 'procedimientos', titulo: 'Procedimiento con parámetros', tipo: 'estructura', nivel: 2,
    enunciado: 'Cree el procedimiento <b>ActualizarPrecioCategoria</b> que reciba <code>@id_categoria INT</code> y <code>@porcentaje DECIMAL(5,2)</code> y aumente en ese porcentaje el PRECIO de los PRODUCTOS de esa categoría (Guía #6, ejercicio 3).',
    pista: 'CREATE PROCEDURE nombre @p1 tipo, @p2 tipo AS BEGIN UPDATE … END',
    solucion: 'CREATE PROCEDURE ActualizarPrecioCategoria @id_categoria INT, @porcentaje DECIMAL(5,2)\nAS\nBEGIN\n    UPDATE PRODUCTOS\n    SET PRECIO = PRECIO * (1 + @porcentaje / 100)\n    WHERE ID_CATEGORIA = @id_categoria;\nEND;',
    checks: [['CREATE (PROCEDURE|PROC) ACTUALIZARPRECIOCATEGORIA', 'Use CREATE PROCEDURE ActualizarPrecioCategoria'], ['@ID_CATEGORIA INT', 'Falta el parámetro @id_categoria INT'], ['@PORCENTAJE DECIMAL\\(5,2\\)', 'Falta el parámetro @porcentaje DECIMAL(5,2)'], ['AS', 'Falta AS'], ['UPDATE PRODUCTOS SET PRECIO=', 'Falta UPDATE PRODUCTOS SET PRECIO = …'], ['@PORCENTAJE/100', 'El porcentaje se divide entre 100'], ['WHERE ID_CATEGORIA=@ID_CATEGORIA', 'Falta WHERE ID_CATEGORIA = @id_categoria']],
    explicacion: 'Se ejecutaría con <code>EXEC ActualizarPrecioCategoria @id_categoria = 2, @porcentaje = 10;</code>' });
  ej({ g: 'F', n: 7, tema: 'procedimientos', titulo: 'Parámetro de salida', tipo: 'estructura', nivel: 3,
    enunciado: 'Cree <b>ContarClientes</b> con el parámetro de salida <code>@Cantidad INT</code> que reciba la cantidad de CLIENTES. Luego declare <code>@Total</code>, ejecute el procedimiento recibiendo el valor e imprímalo.',
    pista: 'OUTPUT va en la definición del parámetro y también en el EXEC.',
    solucion: 'CREATE PROCEDURE ContarClientes @Cantidad INT OUTPUT\nAS\nBEGIN\n    SELECT @Cantidad = COUNT(*) FROM CLIENTES;\nEND;\n\nDECLARE @Total INT;\nEXEC ContarClientes @Cantidad = @Total OUTPUT;\nPRINT @Total;',
    checks: [['CREATE (PROCEDURE|PROC) CONTARCLIENTES @CANTIDAD INT (OUTPUT|OUT)', 'Defina @Cantidad INT OUTPUT'], ['SELECT @CANTIDAD=COUNT\\(\\*\\) FROM CLIENTES', 'Asigne SELECT @Cantidad = COUNT(*) FROM CLIENTES'], ['DECLARE @TOTAL INT', 'Declare @Total INT'], ['EXEC(UTE)? CONTARCLIENTES (@CANTIDAD=)?@TOTAL (OUTPUT|OUT)', 'En el EXEC también va OUTPUT: EXEC ContarClientes @Cantidad = @Total OUTPUT'], ['PRINT @TOTAL', 'Falta PRINT @Total']],
    explicacion: 'Olvidar OUTPUT en la llamada deja @Total en NULL.' });
  ej({ g: 'F', n: 8, tema: 'cursores', titulo: 'Recorrer clientes con un cursor', tipo: 'estructura', nivel: 3,
    enunciado: "Con un cursor llamado <b>cur</b>, recorra los NOMBRE de CLIENTES e imprima <code>'Cliente: '</code> + nombre para cada uno. Incluya los 6 pasos: declarar, abrir, primer FETCH, WHILE, cerrar y liberar.",
    pista: 'WHILE @@FETCH_STATUS = 0 y un segundo FETCH NEXT dentro del ciclo.',
    solucion: "DECLARE @Nombre NVARCHAR(100);\nDECLARE cur CURSOR FOR SELECT NOMBRE FROM CLIENTES;\nOPEN cur;\nFETCH NEXT FROM cur INTO @Nombre;\nWHILE @@FETCH_STATUS = 0\nBEGIN\n    PRINT 'Cliente: ' + @Nombre;\n    FETCH NEXT FROM cur INTO @Nombre;\nEND;\nCLOSE cur;\nDEALLOCATE cur;",
    checks: [['DECLARE CUR CURSOR FOR SELECT NOMBRE FROM CLIENTES', 'Declare: DECLARE cur CURSOR FOR SELECT NOMBRE FROM CLIENTES'], ['OPEN CUR', 'Falta OPEN cur'], ['FETCH NEXT FROM CUR INTO @\\w+', 'Falta FETCH NEXT FROM cur INTO @variable'], ['WHILE @@FETCH_STATUS=0', 'Falta WHILE @@FETCH_STATUS = 0'], ['FETCH NEXT FROM CUR INTO @\\w+.*FETCH NEXT FROM CUR INTO @\\w+', 'Dentro del WHILE debe haber otro FETCH NEXT (si no, el ciclo es infinito)'], ['CLOSE CUR', 'Falta CLOSE cur'], ['DEALLOCATE CUR', 'Falta DEALLOCATE cur']],
    explicacion: 'Orden: DECLARE → OPEN → FETCH → WHILE (con FETCH) → CLOSE → DEALLOCATE.' });
  ej({ g: 'F', n: 9, tema: 'triggers', titulo: 'Trigger de auditoría', tipo: 'estructura', nivel: 3,
    enunciado: 'Cree el trigger <b>trg_AuditoriaFacturas</b> que, <b>después de insertar</b> en Facturas, guarde en AuditoriaFacturas(id_factura, id_cliente, fecha_factura, fecha_registro) los datos insertados y la fecha/hora actual (Guía #7, ejercicio 3). Use las columnas id_factura, id_cliente y fecha de Facturas.',
    pista: 'AFTER INSERT; INSERT INTO AuditoriaFacturas (…) SELECT …, GETDATE() FROM inserted',
    solucion: 'CREATE TRIGGER trg_AuditoriaFacturas ON Facturas AFTER INSERT\nAS\nBEGIN\n    INSERT INTO AuditoriaFacturas (id_factura, id_cliente, fecha_factura, fecha_registro)\n    SELECT id_factura, id_cliente, fecha, GETDATE() FROM inserted;\nEND;',
    checks: [['CREATE TRIGGER TRG_AUDITORIAFACTURAS ON FACTURAS (AFTER|FOR) INSERT', 'Encabezado: CREATE TRIGGER trg_AuditoriaFacturas ON Facturas AFTER INSERT'], ['INSERT INTO AUDITORIAFACTURAS', 'Falta INSERT INTO AuditoriaFacturas'], ['SELECT .*GETDATE\\(\\).* FROM INSERTED', 'Tome los datos con SELECT … GETDATE() FROM inserted (orientado a conjuntos)']],
    explicacion: 'Usar SELECT … FROM inserted funciona aunque se inserten varias facturas en una sola instrucción.' });
  ej({ g: 'F', n: 10, tema: 'triggers', titulo: 'Borrado lógico', tipo: 'estructura', nivel: 3,
    enunciado: "Cree el trigger <b>trg_borrado_logico</b> que, <b>en lugar de</b> eliminar productos, cambie su columna estado a <code>'inactivo'</code> (Guía #7, ejercicio 5). La clave de Productos es id_producto.",
    pista: 'INSTEAD OF DELETE; UPDATE … WHERE id_producto IN (SELECT id_producto FROM deleted)',
    solucion: "CREATE TRIGGER trg_borrado_logico ON Productos\nINSTEAD OF DELETE\nAS\nBEGIN\n    UPDATE Productos SET estado = 'inactivo'\n    WHERE id_producto IN (SELECT id_producto FROM deleted);\nEND;",
    checks: [['CREATE TRIGGER TRG_BORRADO_LOGICO ON PRODUCTOS INSTEAD OF DELETE', 'Encabezado: CREATE TRIGGER trg_borrado_logico ON Productos INSTEAD OF DELETE'], ["UPDATE PRODUCTOS SET ESTADO='INACTIVO'", "Falta UPDATE Productos SET estado = 'inactivo'"], ['DELETED', 'Use la tabla DELETED para saber qué productos se intentó borrar']],
    prohibido: [['AFTER DELETE', 'AFTER DELETE se ejecuta cuando la fila ya se borró; se necesita INSTEAD OF']],
    explicacion: 'INSTEAD OF reemplaza el DELETE: la fila no se borra, solo se marca.' });

  /* ---------------- G · Transacciones y concurrencia ---------------- */
  ej({ g: 'G', n: 1, tema: 'transacciones', titulo: 'Transferencia segura', tipo: 'estructura', nivel: 2,
    enunciado: 'Transfiera <b>100</b> de la cuenta 1 a la cuenta 2 (tabla cuentas, columnas id y saldo) dentro de una transacción con <b>TRY…CATCH</b>: si algo falla, revierta e imprima el error.',
    pista: 'BEGIN TRY BEGIN TRANSACTION; dos UPDATE; COMMIT; END TRY BEGIN CATCH ROLLBACK; … END CATCH',
    solucion: "BEGIN TRY\n    BEGIN TRANSACTION;\n    UPDATE cuentas SET saldo = saldo - 100 WHERE id = 1;\n    UPDATE cuentas SET saldo = saldo + 100 WHERE id = 2;\n    COMMIT;\nEND TRY\nBEGIN CATCH\n    ROLLBACK;\n    PRINT 'Error: ' + ERROR_MESSAGE();\nEND CATCH;",
    checks: [['BEGIN TRY', 'Falta BEGIN TRY'], ['BEGIN TRAN(SACTION)?', 'Falta BEGIN TRANSACTION'], ['UPDATE CUENTAS SET SALDO=SALDO-100 WHERE ID=1', 'Falta el débito: saldo - 100 en la cuenta 1'], ['UPDATE CUENTAS SET SALDO=SALDO\\+100 WHERE ID=2', 'Falta el crédito: saldo + 100 en la cuenta 2'], ['COMMIT.*END TRY', 'El COMMIT va dentro del TRY'], ['BEGIN CATCH.*ROLLBACK', 'En el CATCH debe ir ROLLBACK'], ['END CATCH', 'Falta END CATCH']],
    explicacion: 'Atomicidad: o se hacen las dos actualizaciones o ninguna.' });
  ej({ g: 'G', n: 2, tema: 'aislamiento', titulo: 'Evitar la lectura no repetible', tipo: 'estructura', nivel: 2,
    enunciado: 'Escriba la instrucción que establece el nivel de aislamiento <b>menos estricto</b> que evita la <b>lectura no repetible</b>.',
    pista: 'Revise la tabla de niveles de aislamiento de la Guía #8.',
    solucion: 'SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;',
    checks: [['^SET TRANSACTION ISOLATION LEVEL ', 'Use SET TRANSACTION ISOLATION LEVEL …'], ['REPEATABLE READ$', 'El menos estricto que evita la lectura no repetible es REPEATABLE READ']],
    prohibido: [['SERIALIZABLE$', 'SERIALIZABLE también la evita, pero no es el menos estricto'], ['READ (UN)?COMMITTED$', 'Ese nivel permite la lectura no repetible']],
    explicacion: 'REPEATABLE READ evita sucia y no repetible; la fantasma solo la evita SERIALIZABLE.' });
  ej({ g: 'G', n: 3, tema: 'transacciones', titulo: 'Punto de guardado', tipo: 'estructura', nivel: 3,
    enunciado: 'En una transacción: reste 2 al stock del producto 1, cree el savepoint <b>paso1</b>, reste 5 al stock del producto 2, <b>revierta solo hasta paso1</b> y confirme. (Tabla Productos: id_producto, stock.)',
    pista: 'SAVE TRANSACTION paso1; … ROLLBACK TRANSACTION paso1; COMMIT;',
    solucion: 'BEGIN TRANSACTION;\nUPDATE Productos SET stock = stock - 2 WHERE id_producto = 1;\nSAVE TRANSACTION paso1;\nUPDATE Productos SET stock = stock - 5 WHERE id_producto = 2;\nROLLBACK TRANSACTION paso1;\nCOMMIT;',
    checks: [['^BEGIN TRAN(SACTION)?', 'Empiece con BEGIN TRANSACTION'], ['STOCK=STOCK-2 WHERE ID_PRODUCTO=1.*SAVE TRAN(SACTION)? PASO1', 'Primero el UPDATE del producto 1 y después SAVE TRANSACTION paso1'], ['SAVE TRAN(SACTION)? PASO1.*STOCK=STOCK-5 WHERE ID_PRODUCTO=2', 'Después del savepoint, el UPDATE del producto 2'], ['ROLLBACK TRAN(SACTION)? PASO1', 'Revierta con ROLLBACK TRANSACTION paso1'], ['ROLLBACK TRAN(SACTION)? PASO1.*COMMIT', 'Termine con COMMIT después del ROLLBACK parcial']],
    explicacion: 'Se conserva el cambio del producto 1; el del producto 2 se pierde.' });
  ej({ g: 'G', n: 4, tema: 'bloqueos', titulo: 'Préstamo sin saldo negativo', tipo: 'modifica', db: 'libro', tablas: ['Libro'], veces: 2, nivel: 4,
    enunciado: 'El libro 1 tiene <b>Disponibles = 1</b>. Escriba <b>un único UPDATE</b> que reste una unidad <b>solo si hay al menos una disponible</b> (Guía #9, actividad 6). Para comprobarlo, el simulador ejecutará su instrucción <b>dos veces</b>, como si A y B pidieran el libro: solo una reserva debe tener efecto y el saldo final debe ser 0.',
    pista: 'La condición de saldo va en el WHERE, junto con LibroID = 1.',
    solucion: 'UPDATE Libro SET Disponibles = Disponibles - 1\nWHERE LibroID = 1 AND Disponibles >= 1;',
    explicacion: 'La segunda ejecución no encuentra filas (Disponibles ya es 0) y @@ROWCOUNT valdría 0. Sin la condición, el CHECK rechazaría el negativo con un error, pero no se informaría bien al usuario.' });

  /* ---------------- H · Respaldo y recuperación ---------------- */
  ej({ g: 'H', n: 1, tema: 'fallas-respaldo', titulo: 'Consultar el modelo de recuperación', tipo: 'estructura', nivel: 1,
    enunciado: "Consulte el <b>nombre</b> y el <b>modelo de recuperación</b> de la base <b>'MiBaseDeDatos'</b>.",
    pista: 'La vista del sistema sys.databases tiene recovery_model_desc.',
    solucion: "SELECT name, recovery_model_desc\nFROM sys.databases\nWHERE name = 'MiBaseDeDatos';",
    checks: [['SELECT .*RECOVERY_MODEL_DESC', 'Seleccione la columna recovery_model_desc'], ['FROM SYS\\.DATABASES', 'Consulte FROM sys.databases'], ["WHERE NAME='MIBASEDEDATOS'", "Filtre WHERE name = 'MiBaseDeDatos'"]],
    explicacion: 'Los modelos posibles incluyen FULL, BULK_LOGGED y SIMPLE.' });
  ej({ g: 'H', n: 2, tema: 'fallas-respaldo', titulo: 'Cambiar a modelo FULL', tipo: 'estructura', nivel: 1,
    enunciado: 'Cambie el modelo de recuperación de <b>MiBaseDeDatos</b> a <b>FULL</b>.',
    pista: 'ALTER DATABASE … SET RECOVERY …',
    solucion: 'ALTER DATABASE MiBaseDeDatos SET RECOVERY FULL;',
    checks: [['^ALTER DATABASE MIBASEDEDATOS SET RECOVERY FULL$', 'Use ALTER DATABASE MiBaseDeDatos SET RECOVERY FULL']],
    explicacion: 'El modelo FULL es requisito para respaldar el log.' });
  ej({ g: 'H', n: 3, tema: 'backup-restore', titulo: 'Respaldo completo', tipo: 'estructura', nivel: 2,
    enunciado: "Haga un respaldo <b>completo</b> de <b>MiBaseDeDatos</b> en <code>'C:\\Respaldo\\MiBaseDeDatos_FULL.bak'</code> con las opciones <b>FORMAT</b> e <b>INIT</b> y el nombre <code>'Respaldo completo'</code>.",
    pista: "BACKUP DATABASE … TO DISK = '…' WITH FORMAT, INIT, NAME = '…'",
    solucion: "BACKUP DATABASE MiBaseDeDatos\nTO DISK = 'C:\\Respaldo\\MiBaseDeDatos_FULL.bak'\nWITH FORMAT, INIT, NAME = 'Respaldo completo';",
    checks: [['^BACKUP DATABASE MIBASEDEDATOS TO DISK=', 'Use BACKUP DATABASE MiBaseDeDatos TO DISK = …'], ["DISK='C:\\\\RESPALDO\\\\MIBASEDEDATOS_FULL\\.BAK'", 'Revise la ruta del archivo .bak'], ['WITH .*FORMAT', 'Falta FORMAT'], ['WITH .*INIT', 'Falta INIT'], ["NAME='RESPALDO COMPLETO'", "Falta NAME = 'Respaldo completo'"]],
    prohibido: [['DIFFERENTIAL', 'Se pidió un respaldo completo, no diferencial']],
    explicacion: 'FULL es implícito; FORMAT crea un nuevo conjunto de medios.' });
  ej({ g: 'H', n: 4, tema: 'backup-restore', titulo: 'Respaldo diferencial', tipo: 'estructura', nivel: 2,
    enunciado: "Haga un respaldo <b>diferencial</b> de MiBaseDeDatos en <code>'C:\\Respaldo\\MiBaseDeDatos_DIFF.bak'</code>.",
    pista: 'BACKUP DATABASE … WITH DIFFERENTIAL',
    solucion: "BACKUP DATABASE MiBaseDeDatos\nTO DISK = 'C:\\Respaldo\\MiBaseDeDatos_DIFF.bak'\nWITH DIFFERENTIAL, NAME = 'Respaldo diferencial';",
    checks: [['^BACKUP DATABASE MIBASEDEDATOS TO DISK=', 'Use BACKUP DATABASE MiBaseDeDatos TO DISK = …'], ['_DIFF\\.BAK', 'Revise la ruta del archivo _DIFF.bak'], ['WITH (.*,)?DIFFERENTIAL', 'Falta WITH DIFFERENTIAL']],
    explicacion: 'Guarda los cambios desde el último FULL; NAME es opcional.' });
  ej({ g: 'H', n: 5, tema: 'backup-restore', titulo: 'Respaldo del log', tipo: 'estructura', nivel: 2,
    enunciado: "Respalde el <b>log de transacciones</b> de MiBaseDeDatos en <code>'C:\\Respaldo\\MiBaseDeDatos_LOG.trn'</code> con <b>INIT</b>.",
    pista: 'No es BACKUP DATABASE: es BACKUP LOG.',
    solucion: "BACKUP LOG MiBaseDeDatos\nTO DISK = 'C:\\Respaldo\\MiBaseDeDatos_LOG.trn'\nWITH INIT, NAME = 'Respaldo del log de transacciones';",
    checks: [['^BACKUP LOG MIBASEDEDATOS TO DISK=', 'Use BACKUP LOG MiBaseDeDatos TO DISK = …'], ['_LOG\\.TRN', 'El respaldo del log usa el archivo _LOG.trn'], ['WITH (.*,)?INIT', 'Falta WITH INIT']],
    explicacion: 'Requiere modelo FULL o BULK_LOGGED y permite recuperar punto a punto.' });
  ej({ g: 'H', n: 6, tema: 'backup-restore', titulo: 'Restaurar la base BARES', tipo: 'estructura', nivel: 2,
    enunciado: "Restaure la base <b>BARES</b> desde <code>'C:\\RESPALDO\\BARES_FULL.BAK'</code>, dejándola operativa y <b>sobrescribiendo</b> la existente.",
    pista: 'RESTORE DATABASE … FROM DISK = … WITH …, …',
    solucion: "RESTORE DATABASE BARES\nFROM DISK = 'C:\\RESPALDO\\BARES_FULL.BAK'\nWITH RECOVERY, REPLACE;",
    checks: [['^RESTORE DATABASE BARES FROM DISK=', 'Use RESTORE DATABASE BARES FROM DISK = …'], ['BARES_FULL\\.BAK', 'Revise la ruta del archivo'], ['WITH .*RECOVERY', 'RECOVERY deja la base operativa'], ['WITH .*REPLACE', 'REPLACE permite sobrescribir la base existente']],
    explicacion: 'El orden de RECOVERY y REPLACE no importa.' });

  /* ---------------- I · Optimización ---------------- */
  ej({ g: 'I', n: 1, tema: 'optimizacion-practica', titulo: 'Quitar la función de la columna', tipo: 'consulta', db: 'taller', nivel: 2,
    enunciado: 'Esta consulta no puede usar índices: <code>SELECT * FROM Empleados WHERE YEAR(fecha_contratacion) = 2020</code>. Reescríbala <b>sin aplicar funciones a la columna</b>, obteniendo el mismo resultado (Guía #11).',
    pista: "Use un rango de fechas con BETWEEN.",
    solucion: "SELECT * FROM Empleados\nWHERE fecha_contratacion BETWEEN '2020-01-01' AND '2020-12-31';",
    prohibido: [['(YEAR|MONTH|DATEPART|CONVERT|CAST)\\( ?FECHA_CONTRATACION', 'Todavía aplica una función sobre fecha_contratacion: así el índice no se puede usar']],
    explicacion: 'Con el rango, SQL Server puede hacer Index Seek sobre un índice en fecha_contratacion.' });
  ej({ g: 'I', n: 2, tema: 'optimizacion-practica', titulo: 'Subconsulta a JOIN', tipo: 'consulta', db: 'taller', nivel: 3,
    enunciado: 'Reescriba con <b>JOIN</b> (sin subconsulta) esta consulta de la Guía #11: <code>SELECT nombre FROM Empleados WHERE departamento_id IN (SELECT id FROM Departamentos WHERE activo = 1)</code>.',
    pista: 'JOIN Departamentos D ON E.departamento_id = D.id WHERE D.activo = 1',
    solucion: 'SELECT E.nombre\nFROM Empleados E\nJOIN Departamentos D ON E.departamento_id = D.id\nWHERE D.activo = 1;',
    requerido: [['JOIN', 'Se pidió resolverlo con JOIN']],
    prohibido: [['IN\\(SELECT|IN \\(SELECT', 'Todavía usa la subconsulta IN (SELECT …)']],
    explicacion: 'Ambas versiones dan el mismo resultado; se comparan sus planes de ejecución.' });
  ej({ g: 'I', n: 3, tema: 'optimizacion-practica', titulo: 'Índice para la fecha', tipo: 'estructura', nivel: 1,
    enunciado: 'Cree el índice <b>idx_fecha</b> sobre la columna <b>fecha_contratacion</b> de Empleados.',
    pista: 'CREATE INDEX nombre ON tabla(columna)',
    solucion: 'CREATE INDEX idx_fecha ON Empleados(fecha_contratacion);',
    checks: [['^CREATE (NONCLUSTERED )?INDEX IDX_FECHA ON EMPLEADOS\\(FECHA_CONTRATACION( ASC)?\\)$', 'Use CREATE INDEX idx_fecha ON Empleados(fecha_contratacion)']],
    explicacion: 'Después, la consulta con BETWEEN debería usar Index Seek.' });
  ej({ g: 'I', n: 4, tema: 'optimizacion-practica', titulo: 'Medir lecturas y tiempo', tipo: 'estructura', nivel: 1,
    enunciado: 'Active las opciones que muestran las <b>lecturas</b> y el <b>tiempo de CPU y ejecución</b> de cada consulta.',
    pista: 'Dos instrucciones SET STATISTICS …',
    solucion: 'SET STATISTICS IO ON;\nSET STATISTICS TIME ON;',
    checks: [['SET STATISTICS IO ON', 'Falta SET STATISTICS IO ON'], ['SET STATISTICS TIME ON', 'Falta SET STATISTICS TIME ON']],
    explicacion: 'Verá lecturas lógicas, tiempo de CPU y tiempo total.' });
  ej({ g: 'I', n: 5, tema: 'optimizacion-practica', titulo: 'Estadísticas del índice', tipo: 'estructura', nivel: 2,
    enunciado: 'Muestre las estadísticas (histograma) del índice <b>idx_fecha</b> de Empleados y luego <b>actualice</b> las estadísticas de la tabla.',
    pista: "DBCC SHOW_STATISTICS('tabla', 'índice') y UPDATE STATISTICS tabla",
    solucion: "DBCC SHOW_STATISTICS('Empleados', 'idx_fecha');\nUPDATE STATISTICS Empleados;",
    checks: [["DBCC SHOW_STATISTICS\\('?EMPLEADOS'?,'?IDX_FECHA'?\\)", "Use DBCC SHOW_STATISTICS('Empleados', 'idx_fecha')"], ['UPDATE STATISTICS EMPLEADOS', 'Falta UPDATE STATISTICS Empleados']],
    explicacion: 'Estadísticas actualizadas mejoran las estimaciones del optimizador basado en costos.' });

  ej({ g: 'I', n: 6, tema: 'optimizacion-practica', titulo: 'IN a EXISTS', tipo: 'consulta', db: 'taller', nivel: 3,
    enunciado: 'La Guía #11 recomienda <b>EXISTS en lugar de IN</b> para subconsultas con muchas filas. Reescriba con EXISTS: <code>SELECT nombre FROM Empleados WHERE departamento_id IN (SELECT id FROM Departamentos WHERE activo = 1)</code>.',
    pista: 'WHERE EXISTS (SELECT 1 FROM Departamentos D WHERE D.id = E.departamento_id AND D.activo = 1)',
    solucion: 'SELECT E.nombre\nFROM Empleados E\nWHERE EXISTS (SELECT 1 FROM Departamentos D\n              WHERE D.id = E.departamento_id AND D.activo = 1);',
    requerido: [['EXISTS', 'Se pidió usar EXISTS']],
    prohibido: [['IN ?\\(SELECT', 'Todavía usa IN (SELECT …)']],
    explicacion: 'EXISTS se detiene en cuanto encuentra una fila que cumple; la subconsulta se relaciona con la fila externa por E.departamento_id.' });
  ej({ g: 'I', n: 7, tema: 'optimizacion-practica', titulo: 'Mes completo sin funciones', tipo: 'consulta', db: 'taller', nivel: 2,
    enunciado: 'Reescriba sin funciones sobre la columna: <code>SELECT * FROM Empleados WHERE YEAR(fecha_contratacion) = 2022 AND MONTH(fecha_contratacion) = 11</code>.',
    pista: "Noviembre de 2022 completo: BETWEEN '2022-11-01' AND '2022-11-30'.",
    solucion: "SELECT * FROM Empleados\nWHERE fecha_contratacion BETWEEN '2022-11-01' AND '2022-11-30';",
    prohibido: [['(YEAR|MONTH|DATEPART|CONVERT|CAST)\\( ?FECHA_CONTRATACION', 'Todavía aplica una función sobre fecha_contratacion']],
    explicacion: 'Mismo resultado, pero ahora el optimizador puede usar un índice sobre fecha_contratacion.' });
  ej({ g: 'I', n: 8, tema: 'optimizacion-practica', titulo: 'Solo las columnas necesarias', tipo: 'consulta', db: 'taller', nivel: 2,
    enunciado: 'Muestre <b>nombre</b> y <b>salario</b> de los empleados contratados en <b>2021</b>, aplicando dos estrategias de la Guía #11: <b>sin SELECT *</b> y <b>sin funciones</b> sobre la columna de fecha.',
    pista: "SELECT nombre, salario … WHERE fecha_contratacion BETWEEN '2021-01-01' AND '2021-12-31'",
    solucion: "SELECT nombre, salario FROM Empleados\nWHERE fecha_contratacion BETWEEN '2021-01-01' AND '2021-12-31';",
    prohibido: [['SELECT \\*', 'Evite SELECT *: seleccione solo las columnas necesarias'], ['(YEAR|MONTH|DATEPART|CONVERT|CAST)\\( ?FECHA_CONTRATACION', 'Todavía aplica una función sobre fecha_contratacion']],
    explicacion: 'Menos columnas = menos datos leídos y transferidos; el rango permite usar índices.' });

  /* ---------------- J · BD distribuidas ---------------- */
  ej({ g: 'J', n: 1, tema: 'servidores-vinculados', titulo: 'Crear el servidor vinculado', tipo: 'estructura', nivel: 2,
    enunciado: "Cree el servidor vinculado <b>Sucursal2</b> con proveedor <b>MSOLEDBSQL</b>, producto vacío y origen de datos <code>'192.168.42.213,1433'</code>.",
    pista: "EXEC sp_addlinkedserver @server = '…', @srvproduct = '', @provider = '…', @datasrc = '…'",
    solucion: "EXEC sp_addlinkedserver\n    @server = 'Sucursal2',\n    @srvproduct = '',\n    @provider = 'MSOLEDBSQL',\n    @datasrc = '192.168.42.213,1433';",
    checks: [['^EXEC(UTE)? (MASTER\\.)?SP_ADDLINKEDSERVER', 'Use EXEC sp_addlinkedserver'], ["@SERVER='SUCURSAL2'", "Falta @server = 'Sucursal2'"], ["@SRVPRODUCT=''", "Falta @srvproduct = ''"], ["@PROVIDER='MSOLEDBSQL'", "Falta @provider = 'MSOLEDBSQL'"], ["@DATASRC='192\\.168\\.42\\.213,1433'", "Falta @datasrc = '192.168.42.213,1433'"]],
    explicacion: '@server es el nombre lógico con el que se escribirán las consultas.' });
  ej({ g: 'J', n: 2, tema: 'servidores-vinculados', titulo: 'Credenciales del vínculo', tipo: 'estructura', nivel: 2,
    enunciado: "Configure el inicio de sesión remoto para <b>Sucursal2</b> sin usar las credenciales propias, con usuario <code>'remoto'</code> y contraseña <code>'1234'</code>.",
    pista: "EXEC sp_addlinkedsrvlogin @rmtsrvname = …, @useself = 'false', @rmtuser = …, @rmtpassword = …",
    solucion: "EXEC sp_addlinkedsrvlogin\n    @rmtsrvname = 'Sucursal2',\n    @useself = 'false',\n    @rmtuser = 'remoto',\n    @rmtpassword = '1234';",
    checks: [['^EXEC(UTE)? (MASTER\\.)?SP_ADDLINKEDSRVLOGIN', 'Use EXEC sp_addlinkedsrvlogin'], ["@RMTSRVNAME='SUCURSAL2'", "Falta @rmtsrvname = 'Sucursal2'"], ["@USESELF='?FALSE'?", "Falta @useself = 'false'"], ["@RMTUSER='REMOTO'", "Falta @rmtuser = 'remoto'"], ["@RMTPASSWORD='1234'", "Falta @rmtpassword = '1234'"]],
    explicacion: "@useself = 'false' indica que se usarán las credenciales remotas indicadas." });
  ej({ g: 'J', n: 3, tema: 'servidores-vinculados', titulo: 'Consulta remota', tipo: 'estructura', nivel: 2,
    enunciado: 'Consulte todas las filas de la tabla <b>Productos</b> (esquema dbo) de la base <b>TiendaSucursal2</b> en el servidor vinculado <b>Sucursal2</b>.',
    pista: 'Nombre de cuatro partes: servidor.base.esquema.tabla',
    solucion: 'SELECT * FROM Sucursal2.TiendaSucursal2.dbo.Productos;',
    keepDbo: true,
    checks: [['^SELECT \\* FROM SUCURSAL2\\.TIENDASUCURSAL2\\.DBO\\.PRODUCTOS$', 'Use SELECT * FROM Sucursal2.TiendaSucursal2.dbo.Productos (cuatro partes)']],
    explicacion: 'Los corchetes son opcionales: [Sucursal2].[TiendaSucursal2].[dbo].[Productos].' });
  ej({ g: 'J', n: 4, tema: 'servidores-vinculados', titulo: 'JOIN entre sucursales', tipo: 'estructura', nivel: 3,
    enunciado: 'Muestre <b>A.ID, A.Nombre y B.Precio</b> uniendo <code>TiendaSucursal1.dbo.Productos</code> (alias A, local) con <code>Sucursal2.TiendaSucursal2.dbo.Productos</code> (alias B, remota) por ID.',
    pista: 'SELECT … FROM local A JOIN remoto B ON A.ID = B.ID',
    solucion: 'SELECT A.ID, A.Nombre, B.Precio\nFROM TiendaSucursal1.dbo.Productos A\nJOIN Sucursal2.TiendaSucursal2.dbo.Productos B ON A.ID = B.ID;',
    keepDbo: true,
    checks: [['^SELECT A\\.ID,A\\.NOMBRE,B\\.PRECIO ', 'Seleccione A.ID, A.Nombre, B.Precio'], ['FROM TIENDASUCURSAL1\\.DBO\\.PRODUCTOS (AS )?A ', 'La tabla local es TiendaSucursal1.dbo.Productos con alias A'], ['(INNER )?JOIN SUCURSAL2\\.TIENDASUCURSAL2\\.DBO\\.PRODUCTOS (AS )?B ', 'La remota es Sucursal2.TiendaSucursal2.dbo.Productos con alias B'], ['ON (A\\.ID=B\\.ID|B\\.ID=A\\.ID)$', 'La condición es ON A.ID = B.ID']],
    explicacion: 'Un JOIN distribuido combina datos locales y remotos en una sola consulta.' });

  // numeración global y nivel por defecto
  E.forEach(function (e, i) { e.id = 'sql-' + e.g + e.n; e.idx = i; if (!e.nivel) e.nivel = (e.g === 'A' ? 1 : (e.tipo === 'consulta' || e.tipo === 'modifica') ? 2 : 2); });
  window.LAB_SQL = { BASES: BASES, GRUPOS: GRUPOS, EJERCICIOS: E };
})();
