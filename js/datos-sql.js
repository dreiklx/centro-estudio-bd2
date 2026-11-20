/* =====================================================================
   LABORATORIO SQL · bases de práctica y ejercicios
   Solo temas prácticos del examen: concurrencia, respaldo,
   recuperación y optimización de consultas.
   Bases: 'taller' (BD_TallerOptimizacion, Guía #11) y 'libro' (Guía #9).
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
    { id: 'G', titulo: 'Concurrencia y transacciones', tema: 'transacciones' },
    { id: 'H', titulo: 'Respaldo y recuperación', tema: 'backup-restore' },
    { id: 'I', titulo: 'Optimización de consultas', tema: 'optimizacion-practica' }
  ];

  var E = [];
  function ej(o) { E.push(o); }

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

  ej({ g: 'G', n: 5, tema: 'bloqueos', titulo: 'Tiempo límite de espera', tipo: 'estructura', nivel: 1,
    enunciado: 'Configure la sesión para que una instrucción espere <b>como máximo 15 segundos</b> por un bloqueo (Guía #9).',
    pista: 'SET LOCK_TIMEOUT recibe milisegundos.',
    solucion: 'SET LOCK_TIMEOUT 15000;',
    checks: [['^SET LOCK_TIMEOUT 15000$', 'Use SET LOCK_TIMEOUT 15000 (milisegundos)']],
    explicacion: '15000 ms = 15 s. Con -1 no hay límite. Si se agota, SQL Server devuelve el error 1222.' });
  ej({ g: 'G', n: 6, tema: 'bloqueos', titulo: 'Reservar una fila con UPDLOCK y HOLDLOCK', tipo: 'estructura', nivel: 2,
    enunciado: 'Como la sesión A de la Guía #9: abra una transacción, seleccione la fila con <b>ID = 1</b> de <code>dbo.Test</code> con intención de actualizar y protección serializable, espere <b>10 segundos</b> y confirme.',
    pista: "WITH (UPDLOCK, HOLDLOCK) y WAITFOR DELAY '00:00:10'",
    solucion: "BEGIN TRAN;\nSELECT * FROM dbo.Test WITH (UPDLOCK, HOLDLOCK)\nWHERE ID = 1;\nWAITFOR DELAY '00:00:10';\nCOMMIT;",
    checks: [['^BEGIN TRAN(SACTION)?', 'Empiece con BEGIN TRAN'], ['FROM TEST WITH\\((UPDLOCK,HOLDLOCK|HOLDLOCK,UPDLOCK)\\)', 'Use FROM dbo.Test WITH (UPDLOCK, HOLDLOCK)'], ['WHERE ID=1', 'Falta WHERE ID = 1'], ["WAITFOR DELAY '00:00:10'", "Falta WAITFOR DELAY '00:00:10'"], ['COMMIT( TRAN(SACTION)?)?$', 'Termine con COMMIT']],
    explicacion: 'UPDLOCK pide bloqueos de actualización y HOLDLOCK mantiene semántica SERIALIZABLE: un UPDATE de otra sesión debe esperar.' });
  ej({ g: 'G', n: 7, tema: 'aislamiento', titulo: 'Leer sin confirmar', tipo: 'estructura', nivel: 2,
    enunciado: 'Como la sesión B de la actividad 2 (Guía #9): cambie al nivel que permite <b>lecturas sucias</b> y consulte <code>Disponibles</code> del libro <b>1</b> en <code>dbo.Libro</code>.',
    pista: 'Nivel menos estricto + SELECT … WHERE LibroID = 1',
    solucion: 'SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;\nSELECT Disponibles FROM dbo.Libro WHERE LibroID = 1;',
    checks: [['SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED', 'Use SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED'], ['SELECT DISPONIBLES FROM LIBRO WHERE LIBROID=1', 'Falta SELECT Disponibles FROM dbo.Libro WHERE LibroID = 1'], ['UNCOMMITTED.*SELECT', 'El nivel se fija antes de la consulta']],
    explicacion: 'Con READ UNCOMMITTED, B ve el 2 que A no ha confirmado; tras el ROLLBACK de A vuelve a ver 10.' });
  ej({ g: 'G', n: 8, tema: 'aislamiento', titulo: 'Habilitar y usar SNAPSHOT', tipo: 'estructura', nivel: 3,
    enunciado: 'Habilite el aislamiento por instantánea en la base <b>LabConcurrenciaG9</b> y luego, en la sesión, establezca el nivel <b>SNAPSHOT</b> e inicie una transacción.',
    pista: 'ALTER DATABASE … SET ALLOW_SNAPSHOT_ISOLATION ON; SET TRANSACTION ISOLATION LEVEL SNAPSHOT; BEGIN TRAN;',
    solucion: 'ALTER DATABASE LabConcurrenciaG9 SET ALLOW_SNAPSHOT_ISOLATION ON;\nSET TRANSACTION ISOLATION LEVEL SNAPSHOT;\nBEGIN TRAN;',
    checks: [['ALTER DATABASE LABCONCURRENCIAG9 SET ALLOW_SNAPSHOT_ISOLATION ON', 'Falta ALTER DATABASE LabConcurrenciaG9 SET ALLOW_SNAPSHOT_ISOLATION ON'], ['SET TRANSACTION ISOLATION LEVEL SNAPSHOT', 'Falta SET TRANSACTION ISOLATION LEVEL SNAPSHOT'], ['SNAPSHOT BEGIN TRAN(SACTION)?', 'Después del nivel, BEGIN TRAN']],
    explicacion: 'Dentro de la transacción se lee la versión confirmada al inicio, aunque otra sesión cambie el dato.' });
  ej({ g: 'G', n: 9, tema: 'transacciones', titulo: 'Rollback por stock insuficiente', tipo: 'estructura', nivel: 3,
    enunciado: "Guía #8, ejercicio 4: en una transacción, lea el stock del producto 1 en <code>@stock_actual</code>. Si es <b>al menos 10</b>, réstele 10 y confirme; si no, imprima <code>'Stock insuficiente'</code> y revierta. (Tabla Productos: id_producto, stock.)",
    pista: 'BEGIN TRANSACTION; DECLARE …; SELECT @stock_actual = stock …; IF @stock_actual >= 10 BEGIN … COMMIT; END ELSE BEGIN … ROLLBACK; END',
    solucion: "BEGIN TRANSACTION;\nDECLARE @stock_actual INT;\nSELECT @stock_actual = stock FROM Productos WHERE id_producto = 1;\nIF @stock_actual >= 10\nBEGIN\n    UPDATE Productos SET stock = stock - 10 WHERE id_producto = 1;\n    COMMIT;\nEND\nELSE\nBEGIN\n    PRINT 'Stock insuficiente';\n    ROLLBACK;\nEND",
    checks: [['BEGIN TRAN(SACTION)?', 'Falta BEGIN TRANSACTION'], ['DECLARE @STOCK_ACTUAL INT', 'Declare @stock_actual INT'], ['SELECT @STOCK_ACTUAL=STOCK FROM PRODUCTOS WHERE ID_PRODUCTO=1', 'Lea el stock: SELECT @stock_actual = stock FROM Productos WHERE id_producto = 1'], ['IF @STOCK_ACTUAL>=10', 'Falta IF @stock_actual >= 10'], ['STOCK=STOCK-10 WHERE ID_PRODUCTO=1.*COMMIT', 'Si alcanza: UPDATE … stock - 10 y COMMIT'], ["ELSE .*PRINT 'STOCK INSUFICIENTE'.*ROLLBACK", "Si no alcanza: PRINT 'Stock insuficiente' y ROLLBACK"]],
    explicacion: 'Cada camino del IF termina la transacción: COMMIT si hay stock, ROLLBACK si no.' });
  ej({ g: 'G', n: 10, tema: 'bloqueos', titulo: 'Limpieza tras un interbloqueo', tipo: 'estructura', nivel: 2,
    enunciado: 'Después del error <b>1205</b> de la actividad 5 (Guía #9), revierta la transacción <b>solo si sigue abierta</b> y restablezca LOCK_TIMEOUT a 15 segundos y el aislamiento a READ COMMITTED.',
    pista: 'IF @@TRANCOUNT > 0 ROLLBACK; …',
    solucion: 'IF @@TRANCOUNT > 0 ROLLBACK;\nSET LOCK_TIMEOUT 15000;\nSET TRANSACTION ISOLATION LEVEL READ COMMITTED;',
    checks: [['IF @@TRANCOUNT>0 ROLLBACK', 'Falta IF @@TRANCOUNT > 0 ROLLBACK'], ['SET LOCK_TIMEOUT 15000', 'Falta SET LOCK_TIMEOUT 15000'], ['SET TRANSACTION ISOLATION LEVEL READ COMMITTED', 'Falta SET TRANSACTION ISOLATION LEVEL READ COMMITTED']],
    explicacion: '@@TRANCOUNT indica cuántas transacciones hay abiertas; así no se intenta revertir algo que ya terminó.' });

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

  ej({ g: 'H', n: 7, tema: 'transacciones', titulo: 'Consultar el log de transacciones', tipo: 'estructura', nivel: 1,
    enunciado: 'Muestre <b>todos los detalles</b> del log de transacciones de la base actual con la función que presenta la Guía #8.',
    pista: 'SELECT * FROM ::fn_dblog(NULL, NULL)',
    solucion: 'SELECT * FROM ::fn_dblog(NULL, NULL);',
    checks: [['^SELECT \\* FROM (::)?FN_DBLOG\\(NULL,NULL\\)$', 'Use SELECT * FROM ::fn_dblog(NULL, NULL)']],
    explicacion: 'Para ver detalles mínimos existe el comando DBCC LOG(nombre_base, 0). El log permite rehacer lo confirmado y deshacer lo no confirmado.' });

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

  // numeración global y nivel por defecto
  E.forEach(function (e, i) { e.id = 'sql-' + e.g + e.n; e.idx = i; if (!e.nivel) e.nivel = 2; });
  window.LAB_SQL = { BASES: BASES, GRUPOS: GRUPOS, EJERCICIOS: E };
})();
