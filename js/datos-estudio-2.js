/* Contenido de estudio · Unidades 6 a 10 */
(function () {
  var C = EH.C, TB = EH.TB, BOX = EH.BOX, K = EH.K, D = EH.D, tema = ESTUDIO.tema;

  /* ============================ UNIDAD 6 ============================ */
  tema({
    id: 'fallas-respaldo', u: 'u6', titulo: 'Fallas, respaldo y modelos de recuperación', min: 6,
    resumen: 'Backup vs recovery, tipos de fallas, respaldos FULL, DIFFERENTIAL y LOG, y el modelo de recuperación.',
    fuentes: ['G10', 'PR'],
    cubre: [['G10', 'Conceptos', 'Respaldo (backup) y recuperación (recovery)'], ['G8', 'Log de transacciones (WAL)', 'Recuperación tras una caída: rehacer lo confirmado y deshacer lo no confirmado'], ['G10', 'Tipos de fallas', 'De transacción, del sistema, del disco'], ['G10', 'Modelo de respaldo en SQL Server', 'Tabla FULL, DIFFERENTIAL, LOG'], ['G10', 'Modelo de recuperación', 'sys.databases recovery_model_desc; ALTER DATABASE SET RECOVERY FULL'], ['PR', '6.1 · 6.3 · 6.4', 'Conceptos de recuperación; recuperación de múltiples BD; copia de seguridad ante fallos catastróficos'], ['PR', '6.2', 'Algoritmos: actualización diferida, inmediata, páginas sombra y ARIES (solo nombrados en el programa)']],
    html: function () {
      return K([['Respaldo (backup)', 'Copia de seguridad de la BD en un momento determinado. Permite restaurar ante fallas físicas o lógicas.'], ['Recuperación (recovery)', 'Proceso de llevar la BD a un estado <b>coherente</b> después de una falla, usando los <b>archivos de respaldo</b> y los <b>logs de transacciones</b>.']]) +
        '<h2>Tipos de fallas</h2>' +
        TB(['Falla', 'Causa'], [['De transacción', 'La transacción se aborta por errores lógicos o violación de restricciones'], ['Del sistema', 'Caída del servidor, reinicio inesperado'], ['Del disco', 'Pérdida de datos por errores en el almacenamiento físico']]) +
        '<h2>Tipos de respaldo en SQL Server</h2>' +
        TB(['Tipo', 'Qué guarda', '¿Requiere FULL previo?', 'Tamaño', 'Uso típico'], [
          ['<b>FULL</b>', 'Toda la BD', 'No', 'Grande', 'Base para las restauraciones'],
          ['<b>DIFFERENTIAL</b>', 'Cambios desde el <b>último FULL</b>', 'Sí', 'Medio', 'Respaldos frecuentes y rápidos'],
          ['<b>LOG</b>', 'Cambios desde el <b>último respaldo de LOG</b>', 'Sí (y modelo FULL)', 'Pequeño', 'Recuperación punto a punto']
        ]) +
        BOX('warn', '<b>Confusión frecuente</b>El diferencial se mide desde el último <b>FULL</b> (no desde el último diferencial). Para restaurar: último FULL + último DIFFERENTIAL.') +
        '<h2>Modelo de recuperación</h2>' +
        C("-- ¿Qué modelo usa la base?\nSELECT name, recovery_model_desc\nFROM sys.databases\nWHERE name = 'MiBaseDeDatos';\n\n-- Cambiarlo\nALTER DATABASE MiBaseDeDatos SET RECOVERY FULL;") +
        '<p>Para respaldar el log, la base debe estar en modelo <b>FULL</b> o <b>BULK_LOGGED</b>.</p>' +
        '<h2>Recuperación tras una caída usando el log</h2>' +
        '<p>El log WAL (Guía #8) guarda cada cambio <b>antes</b> de aplicarlo: qué transacción escribió, qué dato, el <b>valor anterior</b> y el <b>valor nuevo</b>, además de los COMMIT. Tras una falla del sistema, el motor lo recorre y decide transacción por transacción:</p>' +
        TB(['Situación en el log al momento de la caída', 'Acción', 'Por qué'], [
          ['La transacción tiene <b>COMMIT</b> registrado', '<b>REHACER</b> (redo): volver a aplicar sus valores nuevos', 'Durabilidad: lo confirmado debe permanecer aunque no hubiera llegado al disco'],
          ['La transacción <b>no</b> tiene COMMIT (estaba activa o hizo ROLLBACK)', '<b>DESHACER</b> (undo): restaurar sus valores anteriores', 'Atomicidad: no puede quedar a medias']
        ]) +
        '<h3>Ejemplo</h3>' +
        C("Inicio: A = 100, B = 50\n<T1, A, 100 → 80>\n<T2, B, 50 → 70>\n<T1 COMMIT>\n<T2, B, 70 → 90>\n*** CAÍDA ***", 'txt') +
        '<p>T1 tiene COMMIT → se rehace: <b>A = 80</b>. T2 no tiene COMMIT → se deshacen sus dos escrituras, de la última a la primera: B vuelve a 70 y luego a <b>50</b>.</p>' +
        BOX('tip', '<b>Regla rápida</b>Valor final de un dato = el de la <b>última escritura confirmada</b>; si ninguna transacción confirmada lo escribió, vuelve a su valor inicial.') +
        BOX('info', '<b>Lo que nombra el programa (6.2)</b>Algoritmos de recuperación por actualización diferida, actualización inmediata, páginas sombra y ARIES. Las guías no los desarrollan; la idea de rehacer lo confirmado y deshacer lo no confirmado es la que aplica el log WAL de la Guía #8.');
    }
  });

  tema({
    id: 'backup-restore', u: 'u6', titulo: 'Comandos BACKUP y RESTORE', min: 5,
    resumen: 'BACKUP DATABASE (FORMAT, INIT, DIFFERENTIAL), BACKUP LOG, sp_addumpdevice y RESTORE.',
    fuentes: ['G10', 'INV'],
    cubre: [['G10', 'Respaldo completo', 'BACKUP DATABASE ... WITH FORMAT, INIT, NAME; FULL implícito'], ['G10', 'Respaldo diferencial', 'WITH DIFFERENTIAL; restaurar FULL + DIFFERENTIAL'], ['G10', 'Respaldo del log', 'BACKUP LOG ... .trn; FULL o BULK_LOGGED; point-in-time'], ['G10', 'Dispositivos y restauración', 'sp_addumpdevice; RESTORE DATABASE ... WITH RECOVERY, REPLACE'], ['G10', 'Aplicación de los tipos de respaldo', 'Orden de restauración: FULL + último DIFFERENTIAL + LOG posteriores']],
    html: function () {
      return '<h2>1. Completo (FULL)</h2>' +
        C("BACKUP DATABASE MiBaseDeDatos\nTO DISK = 'C:\\Respaldo\\MiBaseDeDatos_FULL.bak'\nWITH FORMAT, INIT, NAME = 'Respaldo completo';") +
        TB(['Opción', 'Efecto'], [['(sin tipo)', 'FULL es <b>implícito</b> si no se especifica el tipo'], ['<code>FORMAT</code>', 'Crea un nuevo conjunto de medios y deja inutilizables los respaldos anteriores del destino'], ['<code>INIT</code>', 'Sobrescribe los conjuntos de respaldo existentes y conserva el encabezado del medio. Con FORMAT, agregar INIT es redundante'], ['<code>NAME</code>', 'Nombre descriptivo del respaldo']]) +
        '<h2>2. Diferencial</h2>' +
        C("BACKUP DATABASE MiBaseDeDatos\nTO DISK = 'C:\\Respaldo\\MiBaseDeDatos_DIFF.bak'\nWITH DIFFERENTIAL, NAME = 'Respaldo diferencial';") +
        '<h2>3. Log de transacciones</h2>' +
        C("BACKUP LOG MiBaseDeDatos\nTO DISK = 'C:\\Respaldo\\MiBaseDeDatos_LOG.trn'\nWITH INIT, NAME = 'Respaldo del log de transacciones';") +
        '<p>Requiere modelo FULL o BULK_LOGGED y permite la recuperación <b>punto a punto</b> (point-in-time). Note la extensión <code>.trn</code> frente a <code>.bak</code>.</p>' +
        '<h2>Dispositivo de respaldo y restauración</h2>' +
        C("EXEC sp_addumpdevice 'disk', 'RESPALDO', 'C:\\BD\\RESPALDO.BAK';\n\nRESTORE DATABASE BARES\nFROM DISK = 'C:\\RESPALDO\\BARES_FULL.BAK'\nWITH RECOVERY, REPLACE;") +
        TB(['Opción', 'Efecto'], [['<code>RECOVERY</code>', 'Deja la base operativa al terminar la restauración'], ['<code>REPLACE</code>', 'Permite sobrescribir una base existente']]) +
        '<h2>Restaurar una cadena de respaldos</h2>' +
        '<p>Aplicando las reglas de la guía (el diferencial contiene los cambios desde el último FULL; cada LOG, los cambios desde el LOG anterior), para recuperar lo más reciente posible se restaura en este orden:</p>' +
        D(['1. Último FULL', '2. Último DIFFERENTIAL posterior a ese FULL', '3. Todos los LOG posteriores a ese diferencial, en orden']) +
        '<h3>Ejemplo</h3>' +
        TB(['Programa de respaldos', 'Falla'], [['FULL el domingo 00:00 · DIFFERENTIAL de lunes a sábado 00:00 · LOG a las 06:00, 12:00 y 18:00', 'Miércoles 15:00']]) +
        '<p>Se necesitan: FULL del domingo → DIFFERENTIAL del miércoles 00:00 → LOG del miércoles 06:00 → LOG del miércoles 12:00. Los diferenciales del lunes y martes sobran (el del miércoles ya los incluye) y también los LOG anteriores a ese diferencial. Se pierde lo hecho después de las 12:00.</p>' +
        BOX('warn', '<b>Errores frecuentes</b>Restaurar todos los diferenciales (solo hace falta el último) · omitir un LOG intermedio (la cadena de logs debe estar completa) · olvidar que sin el FULL ningún otro respaldo sirve.') +
        BOX('tip', '<b>Verifique sus respaldos</b>Las investigaciones recomiendan restaurar la copia en una instancia de prueba y comprobar que el esquema y los registros esperados estén disponibles.');
    }
  });

  /* ============================ UNIDAD 7 ============================ */
  tema({
    id: 'optimizacion-proceso', u: 'u7', titulo: 'Proceso de optimización y árboles de consulta', min: 6,
    resumen: 'Cinco pasos del optimizador, heurística vs costos y el ejemplo de vinos y cosechas.',
    fuentes: ['G11', 'PR'],
    cubre: [['G11', 'Optimización de consultas', 'Definición'], ['G11', 'Proceso de optimización', 'Análisis, reescritura, generación de planes, evaluación del costo, selección'], ['G11', 'Tipos de optimización', 'Heurística y basada en costos'], ['G11', 'Ejemplo de procesado de consulta', 'Vinos/Cosechas: 3 opciones en álgebra relacional'], ['PR', '7.1 · 7.2 · 7.3 · 7.4', 'Árbol de consultas y heurísticas; plan de ejecución; costos; optimización semántica']],
    html: function () {
      return '<p>La <b>optimización de consultas</b> es el proceso por el cual el SGBD elige la estrategia más eficiente para ejecutar una consulta, reduciendo tiempo de respuesta y uso de CPU, disco y memoria.</p>' +
        '<h2>Los cinco pasos</h2>' +
        D(['1. Análisis sintáctico y semántico', '2. Reescritura', '3. Generación de planes', '4. Evaluación del costo', '5. Selección del plan']) +
        TB(['Paso', 'Qué hace'], [['Análisis', 'Verifica que la consulta sea válida y comprensible'], ['Reescritura', 'La transforma en una forma equivalente más eficiente'], ['Generación de planes', 'Produce estrategias posibles (con o sin índices, tipos de JOIN…)'], ['Evaluación del costo', 'Estima CPU, accesos a disco y memoria de cada plan'], ['Selección', 'Elige el plan de <b>menor costo estimado</b>']]) +
        '<h2>Heurística vs costos</h2>' +
        K([['Optimización heurística', 'Reglas generales: “aplicar primero las condiciones de selección”, “reducir filas lo antes posible”.'], ['Optimización basada en costos', 'Estima el costo de cada plan con <b>estadísticas</b>: cardinalidad, selectividad, número de bloques.']]) +
        '<h2>Ejemplo: vinos y cosechas</h2>' +
        '<p>Estadísticas: Vinos = 500 tuplas; Cosechas = 1 200; Cosechas con cantidad &gt; 100 = 100.</p>' +
        C('SELECT V.vnombre\nFROM Vinos AS V, Cosechas AS C\nWHERE V.vid = C.vid AND C.cantidad > 100;') +
        '<p>El primer paso es traducirla a <b>álgebra relacional</b>. Tres árboles posibles:</p>' +
        TB(['Opción', 'Orden', 'Tamaño intermedio', 'Valoración'], [['1', 'Join → selección → proyección', 'El join produce <b>1 200</b> tuplas', 'Aceptable'], ['2', '<b>Selección → join → proyección</b>', 'La selección deja <b>100</b>; el join produce 100', '<b>La mejor</b>: filtra antes de unir'], ['3', 'Producto cartesiano → selección → proyección', '500 × 1 200 = <b>600 000</b> tuplas', 'La peor']]) +
        BOX('tip', '<b>Regla heurística en acción</b>La opción 2 aplica primero la selección y reduce filas lo antes posible: misma respuesta (100 tuplas) con mucho menos trabajo.');
    }
  });

  tema({
    id: 'optimizacion-practica', u: 'u7', titulo: 'Estrategias, estadísticas y plan de ejecución', min: 7,
    resumen: 'Siete estrategias para optimizar, SET STATISTICS, DBCC SHOW_STATISTICS y el plan de ejecución en SSMS.',
    fuentes: ['G11'],
    cubre: [['G11', 'Estrategias comunes', 'Índices, evitar funciones en columnas indexadas, evitar SELECT *, EXISTS/JOIN, filtrado temprano, JOIN eficiente, evitar cláusulas innecesarias'], ['G11', 'Ejemplo práctico', 'YEAR(FechaContratacion) vs BETWEEN'], ['G11', 'Comandos útiles', 'SET STATISTICS IO/TIME ON, DBCC SHOW_STATISTICS, UPDATE STATISTICS'], ['G11', 'Plan de ejecución', 'Ctrl + M; Index Scan, Index Seek, Nested Loop, Hash Join'], ['G11', 'Ejercicio práctico', 'BD_TallerOptimizacion: consulta no optimizada, optimizada, índice idx_fecha, estadísticas, subconsulta vs JOIN']],
    html: function () {
      return '<h2>Siete estrategias</h2>' +
        TB(['#', 'Estrategia', 'Detalle'], [
          ['1', 'Uso adecuado de índices', 'En columnas de WHERE, JOIN y ORDER BY; compuestos si se filtra por varias'],
          ['2', 'Evitar funciones en columnas indexadas', '<code>YEAR(fecha) = 2024</code> impide usar el índice; mejor <code>fecha BETWEEN \'2024-01-01\' AND \'2024-12-31\'</code>'],
          ['3', 'Evitar <code>SELECT *</code>', 'Seleccionar solo las columnas necesarias'],
          ['4', 'Normalización de condiciones', '<code>EXISTS</code> en lugar de <code>IN</code> para subconsultas con muchas filas; JOIN en lugar de subconsultas correlacionadas'],
          ['5', 'Filtrado temprano', 'Aplicar WHERE antes de JOIN o agregaciones'],
          ['6', 'Uso eficiente de JOIN', 'Primero las tablas con menos registros; índices en FK y PK'],
          ['7', 'Evitar cláusulas innecesarias', 'Quitar DISTINCT si sobra; reducir ORDER BY, GROUP BY o UNION excesivos']
        ]) +
        '<h2>Ejemplo práctico</h2>' +
        C("-- Problema: la función YEAR() sobre la columna impide usar índices\nSELECT * FROM Empleados WHERE YEAR(FechaContratacion) = 2024;\n\n-- Optimizada: SQL Server puede usar un índice sobre FechaContratacion\nSELECT * FROM Empleados\nWHERE FechaContratacion BETWEEN '2024-01-01' AND '2024-12-31';") +
        '<h2>Comandos de medición</h2>' +
        TB(['Comando', 'Muestra'], [['<code>SET STATISTICS IO ON</code>', 'Cuántas lecturas (lógicas) realiza la consulta'], ['<code>SET STATISTICS TIME ON</code>', 'Tiempo de CPU y de ejecución'], ['<code>DBCC SHOW_STATISTICS(\'Empleados\', \'idx_fecha\')</code>', 'Detalles del índice y su distribución (histograma)'], ['<code>UPDATE STATISTICS Empleados</code>', 'Actualiza las estadísticas para mejorar la predicción del optimizador']]) +
        '<h2>Plan de ejecución en SSMS</h2>' +
        '<p>Antes de ejecutar, active <b>“Incluir plan de ejecución real”</b> (<b>Ctrl + M</b>). El gráfico muestra los operadores usados, el <b>costo relativo</b> de cada parte y si se usan índices.</p>' +
        K([['Index Scan', 'Recorre el índice completo.'], ['Index Seek', 'Va directo a las filas buscadas usando el índice: lo deseable en filtros selectivos.'], ['Nested Loop / Hash Join', 'Algoritmos que el motor usa para resolver un JOIN.']]) +
        '<h2>Taller de la guía</h2>' +
        C("CREATE INDEX idx_fecha ON Empleados(fecha_contratacion);\n\n-- Subconsulta (menos eficiente)\nSELECT nombre FROM Empleados\nWHERE departamento_id IN (SELECT id FROM Departamentos WHERE activo = 1);\n\n-- Equivalente con JOIN\nSELECT E.nombre\nFROM Empleados E\nJOIN Departamentos D ON E.departamento_id = D.id\nWHERE D.activo = 1;") +
        BOX('info', '<b>Qué observar</b>Después de crear <code>idx_fecha</code>, la consulta con BETWEEN debería usar <b>Index Seek</b>. Compare lecturas lógicas, tiempo de CPU y tiempo total entre versiones.');
    }
  });

  /* ============================ UNIDAD 8 ============================ */
  tema({
    id: 'bdd-conceptos', u: 'u8', titulo: 'Bases de datos distribuidas: diseño', min: 8,
    resumen: 'Objetivos y transparencias, tipos, fragmentación (con ejemplos), replicación, 2PL, 2PC y fallos.',
    fuentes: ['G12', 'PR'],
    cubre: [['G12', 'Base de Datos Distribuida', 'Definición'], ['G12', 'Objetivos', 'Transparencia (localización, replicación, fragmentación, concurrencia, fallos), escalabilidad, disponibilidad'], ['G12', 'Arquitectura', 'Sistemas homogéneos y heterogéneos'], ['G12', 'Fragmentación', 'Horizontal, vertical, mixta; ejemplo estudiantes EUI/EUIT'], ['G12', 'Replicación', 'Total, parcial, sin replicación'], ['G12', 'Control de concurrencia distribuido', '2PL y multiversión'], ['G12', 'Manejo de transacciones', 'Two-Phase Commit (2PC)'], ['G12', 'Recuperación ante fallos', 'Tipos de fallos y técnicas'], ['G12', 'Ventajas y desventajas', 'Listas'], ['PR', '8.1 · 8.2 · 8.3 · 8.4', 'Arquitectura y diseño; tipos; consultas y concurrencia; recuperación']],
    html: function () {
      return '<p>Una <b>BD distribuida (BDD)</b> es un conjunto de bases de datos <b>físicamente distribuidas</b> en distintos nodos pero <b>lógicamente integradas</b>: para el usuario se comportan como una sola.</p>' +
        '<h2>Objetivos</h2>' +
        TB(['Transparencia de…', 'El usuario…'], [['Localización', 'no necesita saber dónde están los datos'], ['Replicación', 'no se preocupa por cuántas copias hay'], ['Fragmentación', 'desconoce cómo se dividieron los datos'], ['Concurrencia', 'accede junto a otros sin conflictos'], ['Fallos', 've que el sistema sigue ante fallos parciales']]) +
        '<p>Además: <b>escalabilidad</b> (crecer agregando nodos) y <b>disponibilidad y confiabilidad</b> (funciona aunque un nodo falle).</p>' +
        K([['Homogénea', 'Todos los nodos usan el mismo SGBD y sistema operativo.'], ['Heterogénea', 'Los nodos pueden usar distintos SGBD, esquemas y plataformas.']]) +
        '<h2>Fragmentación</h2>' +
        TB(['Tipo', 'Divide', 'Ejemplo de la guía (estudiantes de la U)'], [
          ['<b>Horizontal</b>', 'Las <b>filas</b> entre nodos (selección σ)', 'σ<sub>Escuela=\'EUI\'</sub>(T) y σ<sub>Escuela=\'EUIT\'</sub>(T): cada escuela guarda a sus estudiantes'],
          ['<b>Vertical</b>', 'Las <b>columnas</b> entre nodos (proyección Π)', 'De la tabla R del Rectorado: Π<sub>Escuela, Ubicación</sub>(R) para Infraestructura y Π<sub>Escuela, Número_alumnos</sub>(R) para Ordenación Académica'],
          ['<b>Mixta</b>', 'Combinación de ambas', 'Sobre el fragmento horizontal EUI: Π<sub>DNI, Escuela, Nombre, Beca</sub> para Secretaría y Π<sub>DNI, Escuela, Nombre, Nota</sub> para Jefatura de estudios']
        ]) +
        BOX('tip', '<b>Otro ejemplo de la guía</b>La tabla Clientes puede dividirse <b>horizontalmente por país</b> o <b>verticalmente</b> separando datos personales de datos financieros.') +
        BOX('warn', '<b>Confusión frecuente</b>Horizontal = <b>filas</b> (σ, selección). Vertical = <b>columnas</b> (Π, proyección); cada fragmento vertical conserva la clave para reconstruir.') +
        '<h2>Replicación</h2>' +
        TB(['Tipo', 'Significa'], [['Total', 'Cada nodo tiene una copia completa'], ['Parcial', 'Solo ciertas partes se replican'], ['Sin replicación', 'Cada dato está en un solo nodo']]) +
        '<h2>Concurrencia y transacciones distribuidas</h2>' +
        '<ul><li><b>Bloqueo distribuido</b> con protocolos como <b>2PL</b> (Two-Phase Locking).</li><li><b>Multiversión</b> para evitar conflictos entre lecturas y escrituras simultáneas.</li><li>Para mantener ACID se usa <b>Two-Phase Commit (2PC)</b>:</li></ul>' +
        D(['Fase 1: Preparar', 'Fase 2: Confirmar o deshacer']) +
        BOX('warn', '<b>No confundir</b><b>2PL</b> (bloqueo en dos fases) controla la concurrencia; <b>2PC</b> (commit en dos fases) coordina la confirmación entre nodos.') +
        '<h2>Fallos y recuperación</h2>' +
        TB(['Tipos de fallo', 'Técnicas'], [['De nodo · de red · de software · de disco', 'Logs distribuidos · protocolos de recuperación · replicación redundante']]) +
        TB(['Ventajas', 'Desventajas'], [['Mayor disponibilidad y confiabilidad<br>Rendimiento por localización de datos<br>Escalabilidad<br>Balanceo de carga', 'Mayor complejidad de diseño e implementación<br>Costos de comunicación entre nodos<br>Dificultad para garantizar integridad y consistencia<br>Recuperación ante fallos más complicada']]);
    }
  });

  tema({
    id: 'servidores-vinculados', u: 'u8', titulo: 'Conexiones remotas y servidores vinculados', min: 7,
    resumen: 'Habilitar TCP/IP y el puerto 1433, sp_addlinkedserver, sp_addlinkedsrvlogin y nombres de cuatro partes.',
    fuentes: ['G12', 'G9', 'PR'],
    cubre: [['G9', 'Conexiones remotas', 'Configuration Manager, TCP/IP, puerto 1433, firewall, servidor,puerto, opción remote access'], ['G12', 'BD distribuida en SQL Server Express', 'Requisitos previos'], ['G12', 'Pasos', 'Crear BD locales, sp_addlinkedserver, sp_addlinkedsrvlogin'], ['G12', 'Consultas distribuidas', 'SELECT/INSERT con nombre de 4 partes; JOIN local-remoto'], ['G12', 'Ejercicio práctico', 'Laboratorio lab4 con tres servidores'], ['PR', '8.5', 'Configuración y uso de BD en red mediante SQL y T-SQL']],
    html: function () {
      return '<h2>Conexiones remotas (Guía #9)</h2>' +
        '<ol><li>En <b>SQL Server Configuration Manager</b>, identificar la instancia y habilitar <b>TCP/IP</b>.</li><li>Configurar o identificar el puerto. La instancia predeterminada suele usar <b>TCP 1433</b>; las instancias con nombre pueden usar puertos dinámicos.</li><li>Reiniciar el servicio del motor si cambió el protocolo o puerto.</li><li>Autorizar en el <b>firewall</b> únicamente el puerto real, en el perfil y alcance necesarios.</li><li>Conectarse con <code>servidor,puerto</code>; configurar cifrado y confianza del certificado.</li></ol>' +
        BOX('info', '<b>Detalle</b>La casilla “Permitir conexiones remotas” de las propiedades del servidor corresponde a la opción histórica <b>remote access</b> (comunicación entre servidores).') +
        '<h2>Requisitos en SQL Server Express (Guía #12)</h2>' +
        '<ol><li>Dos o más instancias de SQL Server Express (pueden estar en máquinas distintas).</li><li>Protocolo <b>TCP/IP</b> activo en Configuration Manager.</li><li>Acceso remoto permitido.</li><li><b>Autenticación mixta</b> (SQL Server y Windows).</li></ol>' +
        '<h2>Paso 1 · Bases locales</h2>' +
        C('CREATE DATABASE TiendaSucursal1;\nGO\nUSE TiendaSucursal1;\nCREATE TABLE Productos (\n    ID INT PRIMARY KEY,\n    Nombre VARCHAR(100),\n    Precio DECIMAL(10,2)\n);') +
        '<h2>Paso 2 · Servidor vinculado</h2>' +
        C("EXEC sp_addlinkedserver\n    @server     = 'Sucursal2',            -- nombre lógico\n    @srvproduct = '',\n    @provider   = 'MSOLEDBSQL',\n    @datasrc    = '192.168.42.213,1433',  -- o 'NombreDelServidor\\SQLEXPRESS'\n    @provstr    = 'Encrypt=Mandatory;TrustServerCertificate=Yes';") +
        BOX('tip', '<b>Antes de vincular</b>Compruebe que el nombre responda en la red (ping), que el firewall esté abierto y que el puerto 1433 esté activo.') +
        '<h2>Paso 3 · Credenciales para el vínculo</h2>' +
        C("EXEC sp_addlinkedsrvlogin\n    @rmtsrvname  = 'Sucursal2',\n    @useself     = 'false',\n    @rmtuser     = 'usuario_sql',\n    @rmtpassword = 'tu_clave';") +
        '<h2>Paso 4 · Consultas distribuidas</h2>' +
        '<p>Se usa el <b>nombre de cuatro partes</b>: <code>servidor.base.esquema.tabla</code>.</p>' +
        C("SELECT * FROM Sucursal2.TiendaSucursal2.dbo.Productos;\n\nINSERT INTO Sucursal2.TiendaSucursal2.dbo.Productos (ID, Nombre, Precio)\nVALUES (101, 'Producto remoto', 250.00);\n\nSELECT * FROM [ServidorRemoto].[trabajos].[dbo].[Personas];") +
        '<h2>Paso 5 · JOIN entre sucursales</h2>' +
        C('SELECT A.ID, A.Nombre, B.Precio\nFROM TiendaSucursal1.dbo.Productos A\nJOIN Sucursal2.TiendaSucursal2.dbo.Productos B ON A.ID = B.ID;') +
        BOX('info', '<b>Laboratorio lab4</b>En grupos de 2 o 3, cada servidor tiene una tabla distinta (Productos con Fabricante, Fabricantes, Productos con Existencias). Se crean los servidores vinculados en las tres computadoras y se consultan artículos y fabricantes remotos, combinando datos locales y remotos.');
    }
  });

  /* ============================ UNIDAD 9 ============================ */
  tema({
    id: 'mongo-conceptos', u: 'u9', titulo: 'MongoDB: características y comparación con SQL Server', min: 6,
    resumen: 'Documentos JSON/BSON, colecciones, _id, Compass y la tabla MongoDB vs SQL Server.',
    fuentes: ['G13', 'G1'],
    cubre: [['G13', 'MongoDB', 'Definición y características clave (esquema flexible, escalabilidad horizontal, consultas, alta disponibilidad, índices, _id, Compass)'], ['G13', 'Comparación MongoDB vs SQL Server', 'Tabla de 14 características'], ['G13', 'MQL', 'Definición y equivalencia con SELECT/INSERT/UPDATE/DELETE']],
    html: function () {
      return '<p><b>MongoDB</b> es una base de datos <b>NoSQL</b> que guarda la información en <b>documentos</b> tipo JSON, agrupados en <b>colecciones</b>.</p>' +
        K([['Estructura flexible', 'Sin esquema fijo: documentos distintos en la misma colección.'], ['Escalabilidad horizontal', 'Se distribuye en múltiples servidores.'], ['Consultas potentes', 'Búsquedas avanzadas, agregaciones y operaciones geoespaciales.'], ['Alta disponibilidad', 'Réplicas para tolerancia a fallos.'], ['Índices', 'Mejoran la velocidad de búsqueda.'], ['_id', 'Identificador único de cada documento en la colección.'], ['Compass', 'Entorno gráfico predeterminado; se instala con el servidor de MongoDB.']]) +
        '<h2>MongoDB vs SQL Server</h2>' +
        TB(['Característica', 'MongoDB', 'SQL Server'], [
          ['Modelo de datos', 'NoSQL (documentos BSON/JSON)', 'Relacional (tablas con filas y columnas)'],
          ['Estructura', 'Documentos en colecciones', 'Tablas con esquema estricto'],
          ['Esquema', 'Flexible', 'Rígido (tipos y relaciones definidos)'],
          ['Consultas', 'Basadas en JSON (find, aggregate)', 'SQL (SELECT, JOIN, GROUP BY…)'],
          ['Transacciones', 'Desde v4.0, con restricciones', 'Soporte completo'],
          ['Índices', 'Sí: compuestos, geoespaciales…', 'Sí: primarios, únicos…'],
          ['Relaciones', 'Manuales o embebidas (referencias o subdocumentos)', 'Llaves foráneas y normalización'],
          ['Almacenamiento', 'BSON (Binary JSON)', 'Archivos MDF/LDF'],
          ['Lenguaje', 'MongoDB Query Language (MQL)', 'T-SQL'],
          ['Seguridad', 'Autenticación, roles, integración con LDAP', 'Autenticación, roles, cifrado, auditorías'],
          ['Herramientas gráficas', 'MongoDB Compass, Atlas', 'SSMS'],
          ['Procedimientos almacenados', 'No nativos (lógica en la app)', 'Soportados'],
          ['Casos ideales', 'Big Data, apps web/móviles, contenido flexible', 'ERP, banca, contabilidad, OLTP/OLAP']
        ]) +
        '<h2>Documento con subdocumento</h2>' +
        C('{\n  "nombre": "Matemática I",\n  "profesor": "Marta",\n  "cantidad_estudiantes": 30,\n  "aula": {\n    "numero": "A101",\n    "ubicacion": "Edificio A"\n  }\n}', 'mongo') +
        '<p><code>aula</code> es un <b>subdocumento</b> (relación embebida). <b>MQL</b> es el lenguaje con estructura JSON para consultar, insertar, actualizar y eliminar: el equivalente a SELECT, INSERT, UPDATE y DELETE.</p>';
    }
  });

  tema({
    id: 'mongo-crud', u: 'u9', titulo: 'MQL: insertar, consultar, actualizar y eliminar', min: 9,
    resumen: 'use, insertOne/insertMany, find con $gt $lt $gte $lte $ne, AND implícito, $or, updateOne con $set y deleteOne/deleteMany.',
    fuentes: ['G13'],
    cubre: [['G13', 'Crear base de datos', 'use ucr_db'], ['G13', 'Insertar documentos', 'insertOne, insertMany'], ['G13', 'Consultas (find)', 'Todos, igualdad, comparaciones $gt $lt $gte $lte $ne'], ['G13', 'Operadores lógicos', 'AND implícito, $or explícito'], ['G13', 'Actualizar', 'updateOne con $set'], ['G13', 'Eliminar', 'deleteOne, deleteMany'], ['G13', 'Archivo de ejercicios de MQL', 'Colección cursos y ejercicios 1-5 y 9-17']],
    html: function () {
      return '<h2>1. Seleccionar (o crear) la base</h2>' + C('use ucr_db', 'mongo') +
        '<p>Si la base no existe, se crea al insertar el primer documento.</p>' +
        '<h2>2. Insertar</h2>' +
        C('db.estudiantes.insertOne({\n  nombre: "Johan",\n  carne: "C564564",\n  edad: 25\n})\n\ndb.estudiantes.insertMany([\n  { nombre: "Jeferson", carne: "C564566", edad: 25 },\n  { nombre: "Dilana",   carne: "C789123", edad: 22 }\n])', 'mongo') +
        BOX('warn', '<b>Error frecuente</b><code>insertMany</code> recibe un <b>arreglo</b> <code>[ … ]</code> de documentos; <code>insertOne</code> recibe <b>un</b> documento <code>{ … }</code>.') +
        '<h2>3. Consultar con find</h2>' +
        C('db.estudiantes.find()                     // todos\ndb.estudiantes.find({ nombre: "Ariel" })  // igualdad', 'mongo') +
        TB(['Operador', 'Significado', 'Ejemplo'], [['<code>$gt</code>', 'mayor que', '<code>{ edad: { $gt: 25 } }</code>'], ['<code>$lt</code>', 'menor que', '<code>{ edad: { $lt: 40 } }</code>'], ['<code>$gte</code>', 'mayor o igual', '<code>{ edad: { $gte: 30 } }</code>'], ['<code>$lte</code>', 'menor o igual', '<code>{ edad: { $lte: 30 } }</code>'], ['<code>$ne</code>', 'diferente', '<code>{ nombre: { $ne: "Luis" } }</code>']]) +
        '<h2>4. Combinar condiciones</h2>' +
        C('// AND implícito: varias condiciones en el mismo filtro\ndb.estudiantes.find({ carne: "C789123", edad: 22 })\n\n// OR explícito: arreglo de condiciones\ndb.estudiantes.find({ $or: [ { carne: "C789123" }, { edad: { $lt: 22 } } ] })\n\n// Dos operadores sobre el mismo campo (rango): > 20 y < 35\ndb.cursos.find({ cantidad_estudiantes: { $gt: 20, $lt: 35 } })', 'mongo') +
        '<h3>Campos de subdocumentos</h3><p>Para filtrar dentro de <code>aula</code> se usa <b>notación de punto</b> entre comillas:</p>' +
        C('db.cursos.find({ "aula.numero": "A101" })\ndb.cursos.find({ "aula.ubicacion": { $ne: "Edificio B" } })', 'mongo') +
        '<h2>5. Actualizar</h2>' +
        C('db.estudiantes.updateOne(\n  { nombre: "Dilana" },     // filtro: a quién\n  { $set: { edad: 27 } }    // cambio: qué campo y nuevo valor\n)', 'mongo') +
        BOX('warn', '<b>Error frecuente</b>Olvidar <code>$set</code>. El segundo argumento indica el cambio con el operador <code>$set</code>; <code>updateOne</code> modifica el <b>primer</b> documento que cumpla el filtro.') +
        '<h2>6. Eliminar</h2>' +
        C('db.estudiantes.deleteOne({ nombre: "Abigail" })  // el primero que cumpla\ndb.estudiantes.deleteMany({ edad: 25 })          // todos los que cumplan', 'mongo') +
        '<h2>Colección de ejercicios: cursos</h2>' +
        TB(['nombre', 'profesor', 'cantidad_estudiantes', 'aula.numero', 'aula.ubicacion'], [['Matemática I', 'Marta', '30', 'A101', 'Edificio A'], ['Física II', 'Carlos', '25', 'B202', 'Edificio B'], ['Biología', 'Ana', '35', 'C303', 'Edificio C'], ['Química', 'Luis', '20', 'A101', 'Edificio A']]) +
        TB(['SQL', 'MQL'], [['<code>SELECT * FROM cursos</code>', '<code>db.cursos.find()</code>'], ["<code>WHERE profesor = 'Marta'</code>", '<code>find({ profesor: "Marta" })</code>'], ['<code>INSERT</code>', '<code>insertOne / insertMany</code>'], ['<code>UPDATE … SET</code>', '<code>updateOne(filtro, { $set: … })</code>'], ['<code>DELETE</code>', '<code>deleteOne / deleteMany</code>']]);
    }
  });

  /* ============================ UNIDAD 10 ============================ */
  tema({
    id: 'inv-fundamentos', u: 'u10', titulo: 'Fundamentos comunes de acceso a datos', min: 6,
    resumen: 'SGBD y ORM, CRUD, relaciones 1:N, 1:1 y N:M, migraciones, conexiones, consultas eficientes y problema N+1.',
    fuentes: ['INV'],
    cubre: [['INV', '1. Fundamentos comunes', 'SGBD y ORM, CRUD, validación vs integridad'], ['INV', '1. Fundamentos comunes', 'Modelos y relaciones 1:N, 1:1, N:M'], ['INV', '1. Fundamentos comunes', 'Migraciones y conexiones (pool, secretos, consultas parametrizadas)'], ['INV', '1. Fundamentos comunes', 'Consultas eficientes y problema N+1'], ['INV', '1. Fundamentos comunes', 'Cómo se ejecuta una operación de datos; restricciones e índices en el modelo']],
    html: function () {
      return K([['SGBD', 'Almacena datos, ejecuta consultas y aplica restricciones.'], ['ORM', 'Traduce operaciones sobre objetos o modelos a consultas al SGBD.'], ['CRUD', 'Crear, leer, actualizar y eliminar.']]) +
        '<p>La <b>aplicación</b> valida entradas y aplica reglas de negocio; la <b>base</b> refuerza la integridad con claves, restricciones y transacciones.</p>' +
        '<h2>Relaciones</h2>' +
        TB(['Tipo', 'Cómo se implementa', 'Ejemplo'], [['1:N', 'La clave foránea va en el lado <b>N</b>', 'Producto → Categoría'], ['1:1', 'Se exige <b>unicidad</b> en el vínculo', '—'], ['N:M', '<b>Tabla intermedia</b>, que puede guardar datos propios', 'DetallePedido (cantidad, precio unitario)']]) +
        '<h2>Migraciones y conexiones</h2>' +
        '<ul><li><b>Migraciones</b>: versionan cambios de esquema (columna, restricción, índice). Se generan o escriben, se revisan y se aplican <b>en orden</b>. Cambiar el modelo en el código exige aplicar la migración a la base.</li><li><b>Conexiones</b>: configurar controlador, motor, servidor, base y credenciales. <b>Secretos fuera del código</b>, <b>consultas parametrizadas</b> y reutilización de conexiones. Un <b>pool</b> administra conexiones reutilizables. Separar el acceso a datos de la lógica HTTP.</li></ul>' +
        '<h2>Consultas eficientes y N+1</h2>' +
        '<p>Filtrar en el motor, seleccionar solo los campos necesarios, indexar según las consultas frecuentes y <b>paginar con orden estable</b>. Los índices aceleran lecturas pero cuestan en escrituras; mida con datos representativos.</p>' +
        BOX('warn', '<b>Problema N+1</b>Se listan N registros y luego se hace <b>una consulta más por cada uno</b> para leer una relación. Listar 10 clientes y consultar por separado los pedidos de cada uno = <b>11 consultas</b>. Solución: <b>carga anticipada</b> (una consulta conjunta o pocas por lote).') +
        '<h2>Recorrido de una operación</h2>' + D(['Ruta (recibe datos)', 'Servicio (reglas de negocio)', 'ORM (prepara operaciones)', 'Motor (restricciones y cambios)', 'Respuesta HTTP']) +
        '<p>Esta separación permite localizar si un error viene de la solicitud, de una regla o de la base. <b>NOT NULL</b> exige un valor; <b>UNIQUE</b> evita duplicados (p. ej. matrícula única por estudiante y curso); un índice sobre el cliente ayuda a consultar sus pedidos.</p>';
    }
  });

  tema({
    id: 'inv-transacciones', u: 'u10', titulo: 'Transacciones en aplicaciones y casos de estudio', min: 7,
    resumen: 'ACID en apps, actualización perdida, control optimista y pesimista, y los cinco casos de las investigaciones.',
    fuentes: ['INV'],
    cubre: [['INV', '2. Transacciones y concurrencia', 'ACID, COMMIT/ROLLBACK, actualización perdida, tres fenómenos'], ['INV', '2. Transacciones y concurrencia', 'Control optimista y pesimista'], ['INV', '4. Casos de aplicación', 'Inventario EF Core (RowVersion), matrícula Django, pedidos Spring Boot, facturación Laravel, API Express + Prisma (paginación)']],
    html: function () {
      return '<p>Las investigaciones aplican ACID a aplicaciones: si un pedido tiene <b>encabezado y detalles</b>, se guardan juntos en una transacción cuando su validez depende de ello.</p>' +
        '<h2>Actualización perdida: tres soluciones</h2>' +
        TB(['Estrategia', 'Cómo funciona'], [['<b>Optimista</b>', 'Al guardar, verifica que la <b>versión</b> del registro (token) siga siendo la leída. Si cambió, se relee y se decide si la operación sigue siendo válida'], ['<b>Pesimista</b>', 'Protege la fila con un <b>bloqueo</b> durante la operación (puede generar esperas o interbloqueos)'], ['<b>Actualización atómica condicionada</b>', 'Un UPDATE que resta solo si hay saldo disponible']]) +
        BOX('tip', '<b>Buenas prácticas</b>Mantener la transacción <b>breve</b> y tomar los recursos en un <b>orden consistente</b>. Una transacción por sí sola puede ser insuficiente según el aislamiento y la forma de leer y escribir.') +
        '<h2>Casos de estudio</h2>' +
        TB(['Caso', 'Lo que se demostró'], [
          ['Inventario · EF Core', 'Transferir 4 unidades con dos guardados en una transacción: el error intermedio hizo rollback y A conservó sus 10 unidades; con éxito quedaron 6 y 14. Dos vendedores leen 6; uno vende 3 y otro 2: si el segundo guarda 4 a partir de su lectura, borra la primera venta. Con <b>RowVersion</b>, EF Core lanza <b>DbUpdateConcurrencyException</b>; se relee, se validan las 3 restantes y se guarda 1'],
          ['Matrícula · Django', 'Verifica duplicados y cupos dentro de <b>atomic</b>; una restricción única (estudiante, curso) refuerza la regla. Para cupos simultáneos, una operación condicionada al cupo. <b>select_related</b> bajó 4 matrículas de 9 consultas a 1. QuerySet es perezoso (se evalúa al consumirse). <b>aggregate</b> = resumen global; <b>annotate</b> = cálculo por fila'],
          ['Pedidos · Spring Boot', 'Cliente tiene muchos pedidos; Pedido y Producto se unen por DetallePedido. El servicio <b>@Transactional</b> guarda pedido y detalles juntos (se probó la reversión). Se detectó <b>N+1</b> y se resolvió con <b>JOIN FETCH</b>'],
          ['Facturación · Laravel', '<b>DB::transaction</b> con <b>lockForUpdate</b> para validar y descontar existencias. Si falta stock, se revierte todo. Montos con <b>DECIMAL</b>. Si se reintenta tras un deadlock, los efectos externos (correos) van <b>después del commit</b>'],
          ['API · Express + Prisma', 'FK en Publicación (usuarios y publicaciones). Paginación por <b>desplazamiento</b> (skip/take) para saltar a una página; por <b>cursor</b> para recorridos secuenciales de listas grandes. Siempre orden estable y tamaño máximo']
        ]);
    }
  });

  tema({
    id: 'inv-frameworks', u: 'u10', titulo: 'Acceso a datos con los cinco frameworks', min: 7,
    resumen: 'EF Core, Django, Spring Boot, Laravel y Express + Prisma: modelado, consultas, transacciones y migraciones.',
    fuentes: ['INV'],
    cubre: [['INV', '3. Acceso a datos con los cinco frameworks', 'Repaso comparativo: modelado, consultas, transacciones y carga relacionada'], ['INV', '3. Migraciones y configuración', 'Comandos y configuración por framework']],
    html: function () {
      return TB(['Tecnología', 'Modelado y consultas', 'Transacciones y carga relacionada'], [
        ['<b>.NET · EF Core</b>', 'DbContext y DbSet; entidades con claves y navegación. LINQ: Where, Select, ToList. <b>AsNoTracking</b> para lecturas sin seguimiento', '<b>SaveChanges</b> agrupa cambios; <b>BeginTransaction</b> abarca varios guardados; <b>Include</b> carga relaciones'],
        ['<b>Django</b>', 'Model, ForeignKey, OneToOneField, ManyToManyField. QuerySet: filter, exclude, order_by. <b>Q</b> combina condiciones; <b>F</b> referencia campos', '<b>transaction.atomic</b>; <b>select_related</b> usa JOIN (relación de valor único); <b>prefetch_related</b> hace consultas separadas y combina en Python'],
        ['<b>Spring Boot</b>', '<b>JPA</b> define el estándar, <b>Hibernate</b> lo implementa, <b>Spring Data JPA</b> aporta repositorios (JpaRepository). JDBC conecta al motor', '<b>@Transactional</b> en el servicio; <b>JOIN FETCH</b> trae la entidad con su relación'],
        ['<b>Laravel</b>', '<b>Eloquent</b> (Active Record); <b>PDO</b> es la capa de acceso de PHP. Relaciones hasMany, belongsTo, hasOne, belongsToMany', '<b>DB::transaction</b>; <b>with</b> carga anticipada; <b>lockForUpdate</b> protege filas'],
        ['<b>Express + Prisma</b>', 'Express gestiona rutas HTTP. Prisma: esquema declarativo, cliente tipado, migraciones. where filtra, select proyecta, orderBy ordena', '<b>$transaction</b> agrupa operaciones; escrituras anidadas guardan relacionados de forma atómica']
      ]) +
        '<h2>Migraciones y configuración</h2>' +
        TB(['Framework', 'Comandos y configuración'], [
          ['EF Core', '<code>dotnet ef migrations add</code> y <code>dotnet ef database update</code>; proveedor y conexión en el DbContext'],
          ['Django', '<code>DATABASES</code> en settings.py; <code>makemigrations</code> genera, <code>migrate</code> aplica; <code>CONN_MAX_AGE</code> reutiliza conexiones'],
          ['Laravel', 'config/database.php y variables de entorno para secretos; <code>php artisan migrate</code>; <code>up</code> define el cambio y <code>down</code> su reversión'],
          ['Prisma', '<code>prisma migrate dev</code> (desarrollo) y <code>prisma migrate deploy</code> (otros entornos); reutilizar Prisma Client entre solicitudes'],
          ['Spring Boot', 'DataSource con URL, usuario y controlador; <code>@Entity</code> y <code>@Id</code>; métodos derivados del repositorio y <code>@Query</code>']
        ]) +
        BOX('tip', '<b>Equivalencias útiles</b>Carga anticipada: Include (EF) · select_related/prefetch_related (Django) · JOIN FETCH (Spring) · with (Laravel). Transacción: BeginTransaction · atomic · @Transactional · DB::transaction · $transaction.');
    }
  });

  tema({
    id: 'inv-proteccion', u: 'u10', titulo: 'Protección de datos en SQL Server', min: 6,
    resumen: 'Roles, seguridad por filas (RLS), enmascaramiento dinámico (DDM), cifrado de columna y auditoría.',
    fuentes: ['INV'],
    cubre: [['INV', '5. Protección de datos en SQL Server', 'Roles y mínimo privilegio, RLS, DDM, cifrado de columna, auditoría'], ['INV', '5. Protección de datos', 'Autenticación vs autorización; rotación de claves; SQL Server Audit; MongoDB'], ['INV', '5. Pruebas de acceso', 'Predicado de filtrado vs predicado de bloqueo']],
    html: function () {
      return TB(['Mecanismo', 'Qué controla', 'Ejemplo del caso universitario'], [
        ['Roles y mínimo privilegio', 'Permisos de lectura, escritura o ejecución por función', 'RRHH ejecuta un procedimiento autorizado para consultar salarios'],
        ['<b>Seguridad por fila (RLS)</b>', '<b>Predicados de filtrado</b> deciden qué filas se ven; <b>predicados de bloqueo</b> impiden escrituras que violen la política', 'Cada docente accede a las notas de sus cursos'],
        ['<b>Enmascaramiento dinámico (DDM)</b>', 'Cambia la <b>presentación</b> según el permiso; el valor almacenado queda intacto', 'Cédulas parcialmente ocultas en un listado'],
        ['Cifrado de columna', 'Protege el contenido con una clave; el descifrado se controla por permisos', 'Salario cifrado con clave simétrica <b>AES-256</b> protegida por un <b>certificado</b>'],
        ['Auditoría', 'Registra acciones y permite rastrear cambios', 'Un trigger guardó nota anterior, nota nueva y usuario al cambiar 85 por 88']
      ]) +
        K([['Autenticación', 'Comprueba la identidad.'], ['Autorización', 'Determina qué puede hacer esa identidad (roles, GRANT, DENY, REVOKE).']]) +
        '<ul><li>Respaldar el <b>certificado y la clave privada</b>. Rotar una clave = preparar la nueva, volver a cifrar y retirar la anterior de forma controlada (mejora pendiente del grupo).</li><li>Una bitácora <b>dentro de la misma base</b> puede quedar expuesta a cuentas con amplios permisos: se propone <b>SQL Server Audit</b> con resultados fuera de la base.</li><li>MongoDB también usa roles y contempla <b>cifrado de campos del lado del cliente</b>.</li></ul>' +
        BOX('info', '<b>Pruebas de acceso</b>El docente vio 2 de 4 matrículas. Al modificar una nota ajena, la fila quedó fuera del conjunto accesible y <b>ninguna fila cambió</b> (filtrado). Al mover una matrícula visible a un curso ajeno, el <b>predicado de bloqueo</b> rechazó la escritura.');
    }
  });

  tema({
    id: 'inv-contenedores', u: 'u10', titulo: 'Bases de datos en contenedores', min: 5,
    resumen: 'Imagen, contenedor y VM; volúmenes y bind mounts; redes, mapeo de puertos y respaldos.',
    fuentes: ['INV'],
    cubre: [['INV', '6. Bases de datos en contenedores', 'Imagen, contenedor y máquina virtual'], ['INV', '6. Contenedores', 'Persistencia: volumen nombrado y bind mount'], ['INV', '6. Contenedores', 'Red bridge y mapeo de puertos 15433:1433'], ['INV', '6. Contenedores', 'Operación, respaldo (BACKUP/RESTORE, mysqldump, mongodump/mongorestore) y ciclo de vida']],
    html: function () {
      return TB(['Concepto', 'Qué es'], [['Imagen', 'Empaqueta el motor y sus dependencias: entorno reproducible'], ['Contenedor', 'Instancia con procesos aislados que <b>comparte el kernel</b> del anfitrión; inicia rápido'], ['Máquina virtual', 'Ejecuta su <b>propio sistema operativo invitado</b>']]) +
        '<h2>Persistencia</h2>' +
        K([['Volumen nombrado', 'Administrado por Docker; se puede reutilizar al crear otro contenedor.'], ['Bind mount', 'Vinculado a un directorio del host.']]) +
        BOX('warn', '<b>Importante</b>Al eliminar el contenedor se pierde su <b>capa de escritura</b>. La imagen contiene el software; el <b>volumen</b> conserva el estado de la base.') +
        '<h2>Red y puertos</h2>' +
        '<p><b>Bridge</b> comunica contenedores en una red virtual. En el mapeo <code>15433:1433</code>, el cliente externo usa el puerto <b>15433 del host</b> y SQL Server escucha en el <b>1433 del contenedor</b>. Dentro de una red compartida, las aplicaciones usan el <b>nombre del servicio</b> y el puerto interno.</p>' +
        '<h2>Respaldo</h2>' +
        TB(['Motor', 'Herramienta'], [['SQL Server', 'BACKUP / RESTORE'], ['MySQL', 'mysqldump'], ['MongoDB', 'mongodump / mongorestore']]) +
        TB(['Elemento', 'Función', 'Ejemplo'], [['Imagen', 'Entorno reproducible del motor', 'Otro contenedor con la misma versión de SQL Server'], ['Volumen', 'Conserva los archivos fuera de la capa de escritura', 'Conectarlo a un contenedor de reemplazo'], ['Respaldo', 'Copia recuperable', 'Restaurar en otro entorno y comprobar que se puede consultar']]);
    }
  });

  tema({
    id: 'inv-nosql', u: 'u10', titulo: 'Modelos NoSQL y almacenamiento combinado', min: 6,
    resumen: 'Documentos, clave-valor, familias de columnas, grafos y relacional en una tienda; escalado y consistencia eventual.',
    fuentes: ['INV'],
    cubre: [['INV', '7. Modelos NoSQL', 'MongoDB, Redis, Cassandra, Neo4j y MySQL en la tienda'], ['INV', '7. Diseño', 'Diseño por acceso, escalado vertical/horizontal, partición y replicación, consistencia eventual'], ['INV', '7. Varios motores', 'Fuente oficial vs datos derivados; reintento sin duplicar']],
    html: function () {
      return TB(['Modelo', 'Organiza los datos', 'Uso en la tienda'], [
        ['Documentos · <b>MongoDB</b>', 'Colecciones de documentos BSON con estructuras anidadas', 'Catálogo con atributos distintos por categoría'],
        ['Clave-valor · <b>Redis</b>', 'Acceso directo por clave; valores como listas o hashes', 'Carrito por identificador de usuario o sesión'],
        ['Familias de columnas · <b>Cassandra</b>', 'Particiona filas según claves diseñadas para los patrones de acceso', 'Historial de compras por cliente o periodo'],
        ['Grafos · <b>Neo4j</b>', 'Nodos y relaciones con propiedades', 'Recomendaciones: cliente → producto → otros clientes → otros productos'],
        ['Relacional · <b>MySQL</b>', 'Tablas, claves, restricciones y transacciones', 'Pedidos, pagos e inventario: los <b>datos oficiales</b>']
      ]) +
        '<h2>Ideas de diseño</h2>' +
        '<ul><li><b>Diseño por acceso</b>: elegir el modelo según la consulta principal (recorrer relaciones → grafo; clave conocida → clave-valor; atributos variables → documentos).</li><li><b>Escalar verticalmente</b> = más recursos a un servidor; <b>horizontalmente</b> = repartir carga entre nodos. La <b>partición</b> reparte datos; la <b>replicación</b> conserva copias.</li><li>Historial y recomendaciones toleran <b>consistencia eventual</b> si el negocio admite retrasos.</li></ul>' +
        BOX('info', '<b>Varios motores</b>Laravel coordina el acceso. Una transacción local confirma solo en su conexión: si se confirma el pedido y falla la actualización de recomendaciones, se conserva el pedido oficial y se reintenta lo derivado <b>sin duplicarlo</b>, usando una <b>clave única del pedido</b>.');
    }
  });

  tema({
    id: 'inv-redis', u: 'u10', titulo: 'Caché de aplicaciones web con Redis', min: 4,
    resumen: 'Cache aside, TTL, invalidación y tasa de aciertos.',
    fuentes: ['INV'],
    cubre: [['INV', '8. Caché con Redis', 'Finalidad, cache aside, TTL, invalidación'], ['INV', '8. Caché con Redis', 'Tasa de aciertos y latencia (120 ms vs 2-5 ms)']],
    html: function () {
      return '<p>Una <b>caché</b> guarda copias temporales de datos frecuentes para responder más rápido y reducir lecturas al SGBD. La base principal conserva el dato oficial (precio); Redis devuelve la copia cuando está disponible. Redis trabaja principalmente <b>en memoria</b> y admite persistencia opcional.</p>' +
        '<h2>Cache aside</h2>' + D(['Consultar Redis', 'Hit: devolver copia', 'Miss: leer SGBD, devolver y guardar copia con TTL']) +
        TB(['Situación', 'Qué hace la aplicación'], [['Primera consulta', 'Busca la clave en Redis; si falta, lee el SGBD y guarda una copia'], ['Consulta posterior (hit)', 'Recupera la copia desde Redis'], ['Cambio de precio confirmado', '<b>Invalida</b> la clave; la próxima lectura trae el precio nuevo del SGBD']]) +
        K([['TTL', 'Cuánto tiempo puede vivir una clave.'], ['Invalidación explícita', 'Elimina o actualiza la copia cuando cambia la fuente.']]) +
        '<h2>Medición</h2><p><b>Tasa de aciertos = hits ÷ (hits + misses) × 100</b>. Con 80 hits y 20 misses → <b>80 %</b>. El grupo midió 120 ms promedio directo al SGBD y 2 a 5 ms desde Redis.</p>' +
        BOX('tip', '<b>¿Cuándo conviene?</b>Un catálogo leído muchas veces entre cambios se beneficia del TTL y la invalidación. Si cada solicitud busca un producto distinto, Redis tendrá pocas oportunidades de servir una copia.');
    }
  });

  tema({
    id: 'inv-semantica', u: 'u10', titulo: 'Bases de datos y búsqueda semántica', min: 5,
    resumen: 'Embeddings, pgvector, distancia coseno, HNSW, búsqueda híbrida y métricas precisión@k y recall.',
    fuentes: ['INV'],
    cubre: [['INV', '9. Búsqueda semántica', 'Embedding y flujo del caso de reglamentos UCR'], ['INV', '9. Búsqueda semántica', 'Distancia coseno (<=>) y HNSW'], ['INV', '9. Búsqueda semántica', 'Búsqueda textual, semántica e híbrida; precisión@k y recall']],
    html: function () {
      return '<p>Un <b>embedding</b> es un vector numérico, generado por un modelo, que representa el contenido. Textos de significado parecido tienen vectores cercanos aunque usen palabras distintas. Use el <b>mismo modelo</b> para documentos y preguntas.</p>' +
        '<h2>Caso: reglamentos UCR</h2>' + D(['Dividir PDF por artículo', 'Guardar reglamento, número y vigencia', 'Embeddings de 384 dimensiones', 'PostgreSQL + pgvector', '5 artículos más cercanos']) +
        K([['Distancia coseno', 'Compara la orientación de los vectores. En pgvector el operador <code>&lt;=&gt;</code> la devuelve: <b>menor valor = más cercano</b>.'], ['HNSW', 'Índice que acelera la búsqueda <b>aproximada</b> de vecinos explorando solo una parte; a cambio puede omitir algunos cercanos.']]) +
        TB(['Búsqueda', 'Útil para'], [['Textual', 'Identificadores como «Artículo 3»'], ['Semántica', 'Preguntas como «¿Qué pasa si pierdo un curso varias veces?» aunque el texto diga «matrícula por tercera vez»'], ['Híbrida', 'Combina ambas señales']]) +
        '<p>Los filtros por reglamento y vigencia limitan el conjunto pertinente.</p>' +
        '<h2>Evaluación</h2><p><b>Precisión@k</b>: fracción de los k resultados que es relevante (3 de 5 → <b>60 %</b>). <b>Recall</b>: proporción de los relevantes disponibles que se recuperó. Se puede comparar la búsqueda aproximada con la exacta para medir latencia y vecinos recuperados.</p>';
    }
  });

  tema({
    id: 'inv-procesos', u: 'u10', titulo: 'Integración de datos y minería de procesos', min: 5,
    resumen: 'Registro de eventos, preparación de datos, descubrimiento, conformidad, mejora, DFG y calidad del modelo.',
    fuentes: ['INV'],
    cubre: [['INV', '10. Minería de procesos', 'Registro de eventos y preparación (CDC, JOIN, UNION ALL, LAG/LEAD)'], ['INV', '10. Minería de procesos', 'Descubrimiento, conformidad, mejora; DFG y variantes; Alpha e Inductive Miner'], ['INV', '10. Minería de procesos', 'Calidad: ajuste, precisión, generalización, simplicidad; ejemplo pedidos 25-27']],
    html: function () {
      return '<p>Un <b>registro de eventos</b> describe actividades ocurridas en casos. Campos mínimos: <b>identificador del caso, actividad y marca de tiempo</b> (puede añadir recurso, área o costo). Ej.: pedido 25, «Enviado», 10:30, Bodega.</p>' +
        '<h2>Preparación</h2><ul><li>Extraer de historiales, tablas temporales, triggers o <b>CDC</b>.</li><li>Correlacionar cada evento con su caso, traducir estados técnicos a actividades, normalizar fechas.</li><li>Revisar duplicados, eventos sin caso y actividades fuera de orden.</li><li><b>JOIN</b> vincula registros, <b>UNION ALL</b> reúne tipos de eventos, <b>LAG</b>/<b>LEAD</b> calculan intervalos por caso.</li></ul>' +
        TB(['Análisis', 'Objetivo'], [['Descubrimiento', 'Reconstruir el proceso observado'], ['Conformidad', 'Comparar con el esperado: pasos omitidos o fuera de orden'], ['Mejora', 'Usar tiempos o recursos para hallar cuellos de botella']]) +
        K([['DFG', 'Grafo de relaciones directas: nodo = actividad; flecha = una actividad siguió inmediatamente a otra. Muestra frecuencia o duración media.'], ['Variante', 'Secuencia completa, como Recibido → Aprobado → Enviado.'], ['Alpha / Inductive Miner', 'Producen modelos más formales.']]) +
        TB(['Calidad', 'Mide'], [['Ajuste', 'Cuánto del comportamiento observado reproduce el modelo'], ['Precisión', 'Si admite demasiado comportamiento ajeno al registro'], ['Generalización', 'Si representa casos plausibles más allá de la muestra'], ['Simplicidad', 'Facilidad de interpretarlo']]) +
        TB(['Caso', 'Secuencia', 'Detecta'], [['Pedido 25', 'Recibido → Aprobado → Enviado', 'Variante que respeta el orden previsto'], ['Pedido 26', 'Recibido → Enviado', 'Aprobación ausente: contrastar con el historial de origen'], ['Pedido 27', 'Recibido → Aprobado → Aprobado → Enviado', 'Aprobación repetida: reproceso o dato duplicado']]);
    }
  });
})();
