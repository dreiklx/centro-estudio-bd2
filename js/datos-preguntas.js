/* =====================================================================
   PREGUNTAS DE PRÁCTICA
   Cada pregunta evalúa contenido enseñado en el tema indicado.
   Autoría: en 'mc' la opción o[0] es la correcta; la aplicación
   reparte la posición correcta de forma equilibrada entre A, B, C y D.
   Tipos: mc (selección única), vf (verdadero/falso), num (aplicación
   numérica), abierta (comprensión con respuesta modelo).
   d: 1 básico · 2 intermedio · 3 desafío
   ===================================================================== */
(function () {
  var P = {};
  function Q(tema, lista) { P[tema] = lista; }

  /* ---------- U1 ---------- */
  Q('dba', [
    { t: 'mc', d: 1, q: '¿Cuál es el objetivo central del DBA según la Guía #1?', o: ['Garantizar disponibilidad, integridad y rendimiento de los datos', 'Diseñar la interfaz gráfica de las aplicaciones', 'Programar la lógica de negocio y las pantallas de cada sistema', 'Administrar la red y los equipos de los usuarios'], e: 'La guía define al DBA como responsable de gestión, mantenimiento, optimización y seguridad, para garantizar disponibilidad, integridad y rendimiento.' },
    { t: 'mc', d: 1, q: '“Usar técnicas como indexación, particionamiento y caché” corresponde al área de…', o: ['Rendimiento', 'Seguridad', 'Respaldo y recuperación', 'Modelado de datos'], e: 'Las funciones 8 y 9 (monitorear consultas; indexación, particionamiento y caché) buscan el rendimiento.' },
    { t: 'vf', d: 1, q: 'Brindar soporte a desarrolladores y usuarios finales es una de las funciones del DBA.', a: true, e: 'Es la función 15 de la lista de la guía.' },
    { t: 'vf', d: 2, q: 'Configurar planes de recuperación ante desastres es tarea del desarrollador, no del DBA.', a: false, e: 'La función 11 del DBA es configurar planes de recuperación ante desastres.' },
    { t: 'abierta', d: 2, q: 'Mencione dos funciones del DBA relacionadas con la seguridad.', r: 'Definir roles y permisos de usuarios; implementar medidas como cifrado de datos y autenticación (también aplicar parches de seguridad).', e: 'Funciones 5, 6 y 7 de la guía.' }
  ]);
  Q('herramientas', [
    { t: 'mc', d: 1, q: '¿Qué herramienta de administración corresponde a PostgreSQL?', o: ['pgAdmin', 'SSMS', 'RMAN', 'MySQL Workbench'], e: 'pgAdmin es para PostgreSQL; SSMS es de SQL Server; RMAN es respaldo de Oracle; Workbench es de MySQL.' },
    { t: 'mc', d: 1, q: '¿Cuál herramienta es de copia de seguridad para MySQL/MariaDB?', o: ['mysqldump', 'pgBackRest', 'Oracle Enterprise Manager', 'pgAdmin'], e: 'mysqldump respalda MySQL/MariaDB; pgBackRest es de PostgreSQL.' },
    { t: 'mc', d: 2, q: '¿Qué motor NoSQL usa el modelo clave-columna y CQL?', o: ['Cassandra', 'Redis', 'MongoDB', 'DynamoDB'], e: 'Cassandra: clave-columna, CQL (similar a SQL), optimizado para Big Data.' },
    { t: 'mc', d: 2, q: 'Según la tabla de la Guía #1, ¿qué motor SQL tiene facilidad de uso “Baja (complejo pero potente)”?', o: ['Oracle Database', 'MySQL', 'MariaDB', 'PostgreSQL'], e: 'Oracle es el más potente y escalable, pero de facilidad de uso baja.' },
    { t: 'vf', d: 1, q: 'Redis destaca por ser un almacenamiento en memoria, ideal para cachés y sesiones de usuario.', a: true, e: 'Así lo describe la tabla NoSQL de la Guía #1.' },
    { t: 'vf', d: 2, q: 'Azure Cosmos DB solo admite el modelo de documentos.', a: false, e: 'Cosmos DB es multimodelo: documentos, clave-valor, columnar y grafo (con SQL, API de MongoDB y Gremlin).' },
    { t: 'mc', d: 2, q: 'La versión gratuita de Microsoft SQL Server mencionada en la guía es…', o: ['Express', 'XE', 'Community', 'Developer Cloud'], e: 'SQL Server: propietaria con versión gratuita Express. Oracle tiene la versión gratuita XE.' }
  ]);
  Q('sql-consultas', [
    { t: 'mc', d: 1, q: 'En el modelo Supermercado, ¿qué tabla relaciona una factura con los productos vendidos?', o: ['VENTAS', 'CATEGORIAS', 'PROVEEDORES', 'CLIENTES'], e: 'VENTAS contiene ID_FACTURA, ID_PRODUCTO y CANTIDAD.' },
    { t: 'mc', d: 1, q: '¿Qué consulta muestra los productos que valen menos de 1000?', o: ['SELECT * FROM PRODUCTOS WHERE PRECIO < 1000', 'SELECT * FROM PRODUCTOS ORDER BY PRECIO < 1000', 'SELECT PRECIO < 1000 FROM PRODUCTOS', 'SELECT * WHERE PRECIO < 1000 FROM PRODUCTOS'], e: 'La condición va en WHERE, después de FROM.' },
    { t: 'mc', d: 2, q: '¿Qué hace ORDER BY PRECIO DESC?', o: ['Ordena del precio mayor al menor', 'Ordena del precio menor al mayor', 'Filtra los precios descendentes', 'Agrupa los productos por precio'], e: 'DESC = descendente (mayor a menor). Sin indicar, el orden es ASC.' },
    { t: 'vf', d: 1, q: "BETWEEN '2026-09-01' AND '2026-09-30' incluye ambos extremos del rango.", a: true, e: 'BETWEEN es inclusivo.' },
    { t: 'mc', d: 2, q: '¿Cuál condición equivale a ID_CATEGORIA = 1 OR ID_CATEGORIA = 3?', o: ['ID_CATEGORIA IN (1, 3)', 'ID_CATEGORIA BETWEEN 1 AND 3', 'ID_CATEGORIA = (1, 3)', 'ID_CATEGORIA IN 1 AND 3'], e: 'IN (1, 3) pertenece a la lista. BETWEEN 1 AND 3 incluiría también el 2.' },
    { t: 'vf', d: 1, q: 'En SQL Server, omitir el punto y coma final hace que una consulta SELECT falle.', a: false, e: 'El ; final es opcional en SQL Server.' }
  ]);
  Q('sql-join', [
    { t: 'mc', d: 1, q: 'En un JOIN entre FACTURAS y VENTAS, ¿qué condición se usa normalmente?', o: ['V.ID_FACTURA = F.ID_FACTURA', 'V.ID_VENTA = F.ID_FACTURA', 'V.CANTIDAD = F.ID_FACTURA', 'V.ID_PRODUCTO = F.ID_CLIENTE'], e: 'Se une la clave foránea (VENTAS.ID_FACTURA) con la clave primaria (FACTURAS.ID_FACTURA).' },
    { t: 'mc', d: 2, q: '¿Qué expresión calcula el total de una factura?', o: ['SUM(P.PRECIO * V.CANTIDAD)', 'COUNT(P.PRECIO * V.CANTIDAD)', 'SUM(P.PRECIO) * COUNT(*)', 'SUM(V.CANTIDAD) + SUM(P.PRECIO)'], e: 'Total = suma de precio × cantidad de cada línea (Guía #6, ejercicio 2).' },
    { t: 'mc', d: 2, q: 'SELECT ID_CLIENTE, COUNT(*) FROM FACTURAS … ¿qué cláusula falta para contar por cliente?', o: ['GROUP BY ID_CLIENTE', 'ORDER BY ID_CLIENTE', 'WHERE ID_CLIENTE', 'TOP ID_CLIENTE'], e: 'Toda columna no agregada del SELECT debe ir en GROUP BY.' },
    { t: 'vf', d: 2, q: 'TOP 3 sin ORDER BY garantiza devolver los 3 productos más vendidos.', a: false, e: 'Sin ORDER BY, TOP no garantiza cuáles filas devuelve.' },
    { t: 'mc', d: 2, q: '¿Qué consulta obtiene los clientes que no tienen facturas?', o: ['WHERE ID_CLIENTE NOT IN (SELECT ID_CLIENTE FROM FACTURAS)', 'WHERE ID_CLIENTE IN (SELECT ID_CLIENTE FROM FACTURAS)', 'WHERE ID_CLIENTE <> ID_FACTURA', 'WHERE COUNT(ID_FACTURA) = 0'], e: 'NOT IN deja solo los clientes cuyo ID no aparece en FACTURAS.' },
    { t: 'mc', d: 2, q: '¿Qué devuelve DATEDIFF(DAY, FECHA, GETDATE())?', o: ['Los días transcurridos desde FECHA hasta hoy', 'La fecha de hoy sin la hora', 'El día del mes de FECHA', 'La cantidad de días que faltan desde hoy hasta FECHA'], e: 'DATEDIFF(DAY, a, b) = días de a hasta b.' },
    { t: 'vf', d: 3, q: 'La Guía #11 recomienda usar JOIN en lugar de subconsultas correlacionadas cuando sea posible.', a: true, e: 'Estrategia 4: normalización de condiciones.' }
  ]);
  Q('sql-dml', [
    { t: 'mc', d: 1, q: '¿Qué instrucción aumenta un 10 % el precio de todos los productos?', o: ['UPDATE PRODUCTOS SET PRECIO = PRECIO * 1.10', 'UPDATE PRODUCTOS SET PRECIO = 10%', 'ALTER TABLE PRODUCTOS SET PRECIO * 1.10', 'INSERT INTO PRODUCTOS (PRECIO) VALUES (PRECIO * 1.10)'], e: 'UPDATE … SET modifica datos; multiplicar por 1.10 suma el 10 %.' },
    { t: 'vf', d: 1, q: 'Un DELETE sin WHERE elimina todas las filas de la tabla.', a: true, e: 'Sin WHERE la operación afecta a todas las filas.' },
    { t: 'mc', d: 2, q: 'Para eliminar las facturas de hoy, ¿por qué se borran antes sus VENTAS?', o: ['Porque VENTAS tiene una clave foránea hacia FACTURAS', 'Porque VENTAS es la tabla más grande', 'Porque DELETE solo funciona en tablas sin clave primaria', 'Porque FACTURAS no permite la cláusula WHERE'], e: 'Integridad referencial: no pueden quedar ventas apuntando a una factura inexistente.' },
    { t: 'mc', d: 2, q: '¿Qué hace IDENTITY(1,1) en una columna?', o: ['Genera un valor automático que empieza en 1 y aumenta de 1 en 1', 'Obliga a que la columna valga 1 en todas las filas de la tabla', 'Crea un índice único en la columna', 'Define la columna como clave foránea'], e: 'IDENTITY(semilla, incremento).' },
    { t: 'mc', d: 2, q: '¿Cuál instrucción agrega una columna stock a Productos?', o: ['ALTER TABLE Productos ADD stock INT NOT NULL DEFAULT 0', 'UPDATE Productos ADD stock INT NOT NULL DEFAULT 0', 'CREATE TABLE Productos ADD stock INT NOT NULL DEFAULT 0', 'INSERT INTO Productos (stock) VALUES (0)'], e: 'ALTER TABLE … ADD modifica la estructura (Guía #7).' },
    { t: 'vf', d: 2, q: 'GO es una instrucción SQL que confirma la transacción actual.', a: false, e: 'GO es un separador de lotes de SSMS; no es SQL ni hace COMMIT.' }
  ]);

  /* ---------- U2 ---------- */
  Q('medios', [
    { t: 'mc', d: 1, q: '¿Qué medio se usa principalmente para almacenamiento a largo plazo y copias de seguridad por su bajo costo?', o: ['Cinta magnética', 'SSD', 'Memoria RAM', 'Disco óptico Blu-ray'], e: 'Las cintas son baratas pero de acceso secuencial lento.' },
    { t: 'mc', d: 1, q: '¿Qué ventaja tiene un SSD frente a un HDD?', o: ['Es más rápido', 'Es más barato por la misma capacidad', 'Usa platos magnéticos', 'Tiene acceso secuencial'], e: 'El SSD usa memoria flash: más rápido, pero más caro por capacidad.' },
    { t: 'mc', d: 2, q: '¿Qué arquitectura usa una red dedicada Fibre Channel y ofrece conmutación por error?', o: ['SAN', 'NAS', 'DAS', 'Almacenamiento en la nube'], e: 'SAN: alto rendimiento, red dedicada, alta disponibilidad, costo alto.' },
    { t: 'vf', d: 1, q: 'Un almacenamiento DAS solo es accesible desde el servidor al que está conectado.', a: true, e: 'DAS = Direct Attached Storage.' },
    { t: 'mc', d: 2, q: 'Un NAS se accede…', o: ['A través de la red local por protocolo IP', 'Solo desde un servidor físico conectado por cable', 'Mediante una red Fibre Channel dedicada', 'Únicamente desde internet en la nube'], e: 'NAS = Network Attached Storage, por la LAN con IP.' },
    { t: 'vf', d: 2, q: 'El almacenamiento distribuido divide los datos entre varios servidores para mantener disponibilidad y redundancia.', a: true, e: 'Es el que usan las bases de datos distribuidas.' }
  ]);
  Q('raid', [
    { t: 'mc', d: 1, q: '¿Qué nivel de RAID no ofrece ninguna redundancia?', o: ['RAID 0', 'RAID 1', 'RAID 5', 'RAID 6'], e: 'RAID 0 (striping) mejora el rendimiento, pero si falla un disco se pierde todo.' },
    { t: 'num', d: 2, q: 'Un servidor tiene 6 discos de 2 TB en RAID 5. ¿Cuál es la capacidad utilizable en TB?', a: 10, tol: 0, u: 'TB', e: 'RAID 5 pierde el equivalente a un disco por la paridad: (6 − 1) × 2 = 10 TB.' },
    { t: 'num', d: 2, q: 'Con los mismos 6 discos de 2 TB en RAID 10, ¿cuántos TB útiles quedan?', a: 6, tol: 0, u: 'TB', e: 'RAID 10 usa espejo: la mitad de 12 TB = 6 TB.' },
    { t: 'mc', d: 2, q: '¿Cuál es el mínimo de discos para RAID 6?', o: ['4', '2', '3', '6'], e: 'RAID 6 usa paridad doble y requiere al menos 4 discos.' },
    { t: 'mc', d: 2, q: 'Un servidor de archivos debe tolerar la falla simultánea de dos discos. ¿Qué RAID conviene?', o: ['RAID 6', 'RAID 5', 'RAID 1', 'RAID 0'], e: 'RAID 6 soporta dos discos fallidos; RAID 5 solo uno.' },
    { t: 'mc', d: 3, q: 'BD crítica: alto rendimiento y redundancia; el costo de discos no es problema. ¿Qué RAID?', o: ['RAID 10', 'RAID 5', 'RAID 0', 'RAID 6'], e: 'RAID 10 combina espejo y striping: buen rendimiento en lectura y escritura con redundancia, a cambio de usar el doble de discos.' },
    { t: 'vf', d: 2, q: 'En RAID 5 la escritura es más lenta porque hay que calcular y escribir la paridad.', a: true, e: 'Desventaja de RAID 5 según la guía.' },
    { t: 'vf', d: 2, q: 'RAID 50 combina RAID 5 con RAID 1.', a: false, e: 'RAID 50 = RAID 5 + RAID 0. RAID 60 = RAID 6 + RAID 0.' }
  ]);
  Q('memoria-organizacion', [
    { t: 'mc', d: 1, q: '¿Qué tamaño fijo tiene una página de datos en SQL Server?', o: ['8 KB', '4 KB', '16 KB', '512 bytes'], e: 'La página es la unidad básica de almacenamiento de SQL Server: 8 KB.' },
    { t: 'mc', d: 1, q: '¿Qué organización guarda los registros sin orden, donde haya espacio?', o: ['Montículo (Heap)', 'Secuencial (Clustered)', 'Hashing (Non-clustered)', 'Árbol B'], e: 'El heap no tiene índice clúster.' },
    { t: 'mc', d: 2, q: '¿Qué archivo de SQL Server guarda el log de transacciones?', o: ['.ldf', '.mdf', '.ndf', '.bak'], e: '.mdf primario, .ndf secundarios, .ldf log.' },
    { t: 'mc', d: 2, q: 'Con muchas inserciones diarias, ¿qué organización las favorece más?', o: ['Montículo (Heap)', 'Secuencial ordenada', 'Ninguna: ambas son iguales', 'Secuencial con reorganización diaria'], e: 'En el heap se inserta donde haya espacio, sin mantener orden.' },
    { t: 'vf', d: 2, q: 'La memoria intermedia reduce los accesos a disco porque mantiene páginas de datos e índices en RAM.', a: true, e: 'Ese es su beneficio principal.' },
    { t: 'mc', d: 2, q: '¿Qué tipo de página guarda los cambios antes de confirmarlos en disco?', o: ['Página de registro de transacciones', 'Página de asignación de páginas a tablas', 'Página de índices', 'Página de datos'], e: 'Las páginas de registro de transacciones guardan cambios antes de ser confirmados.' },
    { t: 'vf', d: 1, q: 'FILEGROWTH configura el crecimiento automático de los archivos en SQL Server.', a: true, e: 'Según la Guía #2.' }
  ]);
  Q('factor-bloqueo', [
    { t: 'num', d: 1, q: 'Bloque de 8 192 bytes y registros de 200 bytes. ¿Cuál es el factor de bloqueo?', a: 40, tol: 0, u: 'registros por bloque', e: '⌊8192 ÷ 200⌋ = ⌊40,96⌋ = 40.' },
    { t: 'num', d: 2, q: 'Registros PRODUCTO de 133 bytes (incluye el byte de borrado) y bloques de 512 bytes. ¿Factor de bloqueo?', a: 3, tol: 0, u: 'registros por bloque', e: '⌊512 ÷ 133⌋ = 3.' },
    { t: 'num', d: 2, q: 'Con ese factor de 3, ¿cuántos bloques necesitan 50 000 registros?', a: 16667, tol: 0, u: 'bloques', e: '⌈50 000 ÷ 3⌉ = 16 667 (redondeo hacia arriba).' },
    { t: 'num', d: 2, q: 'Con bloques de 512 bytes y registros de 133 bytes, ¿cuántos bytes se desperdician en cada bloque completo?', a: 113, tol: 0, u: 'bytes', e: '512 − 3 × 133 = 113 bytes.' },
    { t: 'num', d: 3, q: 'Registro EMPLEADO: 25 + 25 + 9 + 35 + 10 + 8 bytes; bloque de 1 024 bytes. ¿Factor de bloqueo?', a: 9, tol: 0, u: 'registros por bloque', e: 'Registro = 112 bytes; ⌊1024 ÷ 112⌋ = 9.' },
    { t: 'num', d: 3, q: 'Registro CLIENTE de 202 bytes y bloques de 2 048 bytes. ¿Cuántos bytes se desperdician en cada bloque completo?', a: 28, tol: 0, u: 'bytes', e: 'BF = ⌊2048 ÷ 202⌋ = 10; desperdicio = 2048 − 10 × 202 = 28 bytes.' },
    { t: 'num', d: 3, q: '100 000 registros de 250 bytes en bloques de 4 096 bytes. ¿Cuántos bloques se necesitan?', a: 6250, tol: 0, u: 'bloques', e: 'BF = ⌊4096 ÷ 250⌋ = 16; bloques = ⌈100 000 ÷ 16⌉ = 6 250.' },
    { t: 'vf', d: 2, q: 'El número de bloques se redondea hacia abajo porque no se guardan fracciones de registro.', a: false, e: 'Lo que se redondea hacia abajo es el factor de bloqueo. El número de bloques se redondea hacia arriba.' }
  ]);
  Q('indices-tipos', [
    { t: 'mc', d: 1, q: '¿Cuántos índices clustered puede tener una tabla?', o: ['Solo uno', 'Hasta dos', 'Uno por columna', 'Ilimitados'], e: 'El clustered ordena físicamente los datos; solo puede haber un orden físico.' },
    { t: 'mc', d: 1, q: '¿Qué tipo de índice garantiza que no haya valores repetidos?', o: ['Único', 'Compuesto', 'Non-clustered', 'Multinivel'], e: 'CREATE UNIQUE INDEX evita duplicados.' },
    { t: 'mc', d: 2, q: 'La fragmentación de un índice es alta. ¿Qué conviene?', o: ['ALTER INDEX … REBUILD', 'ALTER INDEX … REORGANIZE', 'sp_helpindex', 'DROP TABLE'], e: 'Con fragmentación alta conviene reconstruir (REBUILD); con baja, reorganizar.' },
    { t: 'mc', d: 2, q: '¿Qué comando muestra los índices de la tabla Clientes?', o: ['sp_helpindex Clientes', 'SHOW INDEX Clientes', 'SELECT INDEX FROM Clientes', 'ALTER INDEX Clientes SHOW'], e: 'sp_helpindex es el procedimiento del sistema que lista los índices.' },
    { t: 'vf', d: 2, q: 'Por defecto, la clave primaria se implementa como índice clustered.', a: true, e: 'Así lo indica la Guía #3.' },
    { t: 'mc', d: 2, q: '¿En cuál caso se recomienda EVITAR un índice?', o: ['Columna con muchos valores repetidos', 'Columna usada en JOIN', 'Columna usada en ORDER BY', 'Columna filtrada en WHERE con frecuencia'], e: 'Baja cardinalidad: el índice ayuda poco. También tablas pequeñas o muchas escrituras.' },
    { t: 'vf', d: 2, q: 'Un índice non-clustered contiene punteros a las filas reales de la tabla.', a: true, e: 'Por eso los datos pueden estar en otro orden.' }
  ]);
  Q('indices-multinivel', [
    { t: 'mc', d: 1, q: 'En un árbol B, ¿qué nodos están enlazados entre sí para recorridos ordenados?', o: ['Los nodos hoja', 'El nodo raíz', 'Los nodos intermedios', 'Ninguno'], e: 'Las hojas están enlazadas para recorrer en orden.' },
    { t: 'mc', d: 1, q: '¿Qué complejidad tienen búsqueda, inserción y eliminación en un árbol B?', o: ['O(log n)', 'O(n)', 'O(n²)', 'O(1)'], e: 'Es un árbol balanceado: tiempo logarítmico.' },
    { t: 'num', d: 2, q: '30 000 registros de 100 bytes, bloques de 1 024 bytes, archivo ordenado. ¿Accesos con búsqueda binaria sin índice?', a: 12, tol: 0, u: 'accesos', e: '10 registros por bloque → 3 000 bloques → ⌈log₂ 3000⌉ = 12.' },
    { t: 'num', d: 3, q: 'Mismo archivo con índice primario (entradas de 15 bytes). ¿Total de accesos?', a: 7, tol: 0, u: 'accesos', e: '68 entradas por bloque → 45 bloques de índice → ⌈log₂ 45⌉ = 6, + 1 acceso a datos = 7.' },
    { t: 'num', d: 3, q: '50 000 registros de 120 bytes, bloques de 2 048 bytes, ordenado. ¿Accesos con búsqueda binaria sin índice?', a: 12, tol: 0, u: 'accesos', e: 'BF = ⌊2048 ÷ 120⌋ = 17; bloques = ⌈50 000 ÷ 17⌉ = 2 942; ⌈log₂ 2942⌉ = 12 (2¹¹ = 2048 < 2942 ≤ 4096).' },
    { t: 'vf', d: 2, q: 'En un índice multinivel, el segundo nivel es un índice sobre el primer nivel.', a: true, e: 'Así se reduce el número de accesos.' },
    { t: 'mc', d: 2, q: '¿Por qué el índice del ejercicio 1 es primario?', o: ['Se define sobre el campo de ordenación (clave) de un archivo ordenado', 'Porque es el primer índice que se crea en la tabla', 'Porque contiene todos los campos de cada registro del archivo', 'Porque usa punteros a cada registro individual'], e: 'El índice primario se define sobre el campo clave por el que está ordenado el archivo.' }
  ]);

  /* ---------- U3 ---------- */
  Q('cia-amenazas', [
    { t: 'mc', d: 1, q: 'Usar vistas para ocultar columnas sensibles protege principalmente la…', o: ['Confidencialidad', 'Disponibilidad', 'Integridad', 'Durabilidad'], e: 'Las vistas limitan lo que se puede conocer: confidencialidad.' },
    { t: 'mc', d: 1, q: 'Una restricción CHECK (Precio > 0) protege la…', o: ['Integridad', 'Confidencialidad', 'Disponibilidad', 'Autenticación'], e: 'Mantiene los datos correctos y consistentes.' },
    { t: 'mc', d: 2, q: 'Un UPS y los clústeres de alta disponibilidad apoyan la…', o: ['Disponibilidad', 'Confidencialidad', 'Integridad', 'Autorización'], e: 'Mantienen los datos accesibles cuando se necesitan.' },
    { t: 'mc', d: 2, q: 'La inyección SQL es una amenaza…', o: ['Externa', 'Interna', 'Física', 'De disponibilidad física'], e: 'Proviene de actores fuera de la organización.' },
    { t: 'mc', d: 2, q: 'Un empleado borra datos por error al configurar permisos. ¿Qué tipo de amenaza es?', o: ['Interna', 'Externa', 'Física', 'Ransomware'], e: 'Los errores humanos de usuarios con acceso legítimo son amenazas internas.' },
    { t: 'vf', d: 2, q: 'Las copias de seguridad aparecen como mecanismo tanto de integridad como de disponibilidad.', a: true, e: 'Recuperan datos modificados incorrectamente y mantienen el servicio.' },
    { t: 'abierta', d: 2, q: 'Explique la diferencia entre confidencialidad e integridad con un ejemplo de salarios.', r: 'Confidencialidad: que solo el personal autorizado pueda VER los salarios. Integridad: que nadie pueda MODIFICAR un salario indebidamente (p. ej., un usuario con SELECT pero sin UPDATE).', e: 'Impedir conocer vs impedir alterar.' }
  ]);
  Q('control-acceso', [
    { t: 'mc', d: 1, q: '¿Qué diferencia hay entre login y usuario en SQL Server?', o: ['El login accede al servidor; el usuario existe dentro de una BD y se asocia a un login', 'El usuario accede al servidor y el login es la cuenta que existe dentro de una BD', 'Son sinónimos en SQL Server', 'El login es un rol y el usuario es un permiso'], e: 'Login = credenciales del servidor; usuario = cuenta en una base.' },
    { t: 'mc', d: 2, q: 'En el modelo DAC, ¿quién decide los accesos?', o: ['El propietario de los datos', 'Una política central con etiquetas', 'El sistema operativo', 'Siempre el usuario sa'], e: 'Discrecional: el propietario. MAC usa políticas centrales.' },
    { t: 'mc', d: 2, q: 'Carlos (Confidencial, 2) intenta leer un dato Secreto (3). Según Bell-LaPadula…', o: ['Se rechaza por No Read Up', 'Se permite porque solo está leyendo', 'Se rechaza por No Write Down', 'Se permite si el dato tiene vista'], e: 'No se lee hacia arriba.' },
    { t: 'mc', d: 3, q: 'Ana (Secreto) quiere copiar información secreta a un documento Público. ¿Qué principio lo impide?', o: ['No Write Down', 'No Read Up', 'Mínimo privilegio', 'Control global'], e: 'No escribir hacia abajo: evitaría una fuga a un nivel inferior.' },
    { t: 'vf', d: 1, q: 'Una vista almacena físicamente una copia de los datos de la tabla.', a: false, e: 'Es una tabla virtual basada en una consulta; no almacena datos.' },
    { t: 'vf', d: 2, q: 'MAC es común en entornos militares o de alta seguridad.', a: true, e: 'Se basa en etiquetas y clasificación de datos.' },
    { t: 'mc', d: 1, q: '¿Cuál es el nivel 2 de la clasificación MLS de la guía?', o: ['Confidencial', 'Secreto', 'Público', 'Alto secreto'], e: '4 Alto secreto, 3 Secreto, 2 Confidencial, 1 Público.' }
  ]);
  Q('cifrado-pki', [
    { t: 'mc', d: 1, q: '¿Qué protocolo protege los datos en tránsito?', o: ['TLS', 'AES', 'RSA', 'PKI'], e: 'TLS establece canales protegidos en la red.' },
    { t: 'mc', d: 1, q: '¿Cuál es el principal problema del cifrado simétrico?', o: ['La distribución de la clave', 'Que es muy lento', 'Que necesita dos claves', 'Que no sirve para grandes volúmenes'], e: 'Ambas partes necesitan la misma clave secreta.' },
    { t: 'mc', d: 2, q: 'Ana envía un dato confidencial a Carlos con cifrado asimétrico. ¿Con qué clave lo cifra?', o: ['Con la clave pública de Carlos', 'Con la clave privada de Ana', 'Con la clave privada de Carlos', 'Con la clave pública de Ana'], e: 'Se cifra con la pública del destinatario y él descifra con su privada.' },
    { t: 'mc', d: 2, q: '¿Qué tamaños de clave admite AES?', o: ['128, 192 o 256 bits', '64, 128 o 512 bits', 'Solo 2048 bits', '56 o 112 bits'], e: 'AES: 128, 192 o 256 bits.' },
    { t: 'vf', d: 2, q: 'Un certificado digital vincula una identidad con una clave pública.', a: true, e: 'Definición de la Guía #4.' },
    { t: 'vf', d: 2, q: 'RSA y ECC son algoritmos de cifrado simétrico.', a: false, e: 'Son asimétricos (clave pública). AES es simétrico.' },
    { t: 'mc', d: 2, q: 'Cifrar las copias de seguridad es un ejemplo de cifrado…', o: ['En reposo', 'En tránsito', 'Asimétrico obligatorio', 'De comunicaciones'], e: 'Protege datos almacenados.' }
  ]);
  Q('permisos-sql', [
    { t: 'mc', d: 1, q: '¿Qué instrucción crea un usuario de base asociado al login cajero?', o: ['CREATE USER usuario1 FOR LOGIN cajero', 'CREATE LOGIN usuario1 FOR USER cajero', 'GRANT LOGIN cajero TO usuario1', 'ALTER USER cajero ADD usuario1'], e: 'CREATE USER … FOR LOGIN …' },
    { t: 'mc', d: 2, q: 'Un usuario pertenece a un rol con DELETE. ¿Qué impide que borre aunque el rol lo permita?', o: ['DENY DELETE', 'REVOKE DELETE', 'DROP ROLE', 'GRANT SELECT'], e: 'DENY prevalece sobre los permisos recibidos por roles.' },
    { t: 'mc', d: 2, q: '¿Qué rol de servidor permite crear y eliminar bases de datos?', o: ['dbcreator', 'securityadmin', 'diskadmin', 'db_owner'], e: 'dbcreator. db_owner es un rol de base, no de servidor.' },
    { t: 'mc', d: 2, q: 'María solo debe consultar todas las tablas de SUPERMERCADO. Rol mínimo:', o: ['db_datareader', 'db_datawriter', 'db_owner', 'sysadmin'], e: 'Mínimo privilegio: solo lectura.' },
    { t: 'mc', d: 3, q: 'Pedro consulta, inserta y modifica en todas las tablas. ¿Qué roles de base le asigna?', o: ['db_datareader y db_datawriter', 'Solo db_datawriter', 'db_owner', 'db_ddladmin y db_datareader'], e: 'Leer = db_datareader; insertar/modificar = db_datawriter. db_owner daría más de lo necesario.' },
    { t: 'mc', d: 2, q: '¿Qué instrucción agrega usuario1 al rol rol_consulta?', o: ['ALTER ROLE rol_consulta ADD MEMBER usuario1', 'GRANT rol_consulta TO usuario1 MEMBER', 'CREATE ROLE rol_consulta FOR usuario1', 'ALTER USER usuario1 ADD ROLE rol_consulta'], e: 'ALTER ROLE … ADD MEMBER …' },
    { t: 'vf', d: 2, q: 'MUST_CHANGE obliga a cambiar la contraseña en el primer inicio de sesión.', a: true, e: 'Opción de CREATE LOGIN.' },
    { t: 'vf', d: 1, q: 'Se puede eliminar un login aunque tenga usuarios asociados en las bases de datos.', a: false, e: 'La guía indica eliminar primero los usuarios asociados.' }
  ]);

  /* ---------- U4 ---------- */
  Q('variables-control', [
    { t: 'mc', d: 1, q: '¿Con qué prefijo comienzan las variables globales en SQL Server?', o: ['@@', '@', '#', '$'], e: 'Locales con @, globales con @@ (p. ej. @@VERSION).' },
    { t: 'mc', d: 2, q: 'En el ejemplo de BREAK y CONTINUE, ¿qué números se imprimen?', o: ['1, 2, 3, 4, 6, 7 y 8', '1 a 10', '1, 2, 3, 4, 5, 6, 7 y 8', '5 y 8'], e: 'CONTINUE salta el 5 y BREAK termina en 8.' },
    { t: 'mc', d: 2, q: '¿Para qué se usa CAST(@Contador AS NVARCHAR) en el WHILE de la guía?', o: ['Para concatenar el número con texto en PRINT', 'Para declarar la variable', 'Para incrementar el contador en cada iteración del ciclo', 'Para terminar el ciclo'], e: 'El + con texto requiere convertir el número a texto.' },
    { t: 'vf', d: 1, q: 'Una variable local existe solo dentro del bloque donde fue declarada.', a: true, e: 'Definición de la Guía #5.' },
    { t: 'vf', d: 2, q: 'Dentro de un WHILE, CONTINUE termina el ciclo por completo.', a: false, e: 'CONTINUE salta a la siguiente iteración; BREAK termina el ciclo.' },
    { t: 'mc', d: 2, q: '¿Qué agrupa varias instrucciones como un solo bloque dentro de un IF o WHILE?', o: ['BEGIN … END', 'TRY … CATCH', 'DECLARE … SET', 'GO … GO'], e: 'BEGIN … END delimita el bloque.' }
  ]);
  Q('excepciones', [
    { t: 'mc', d: 1, q: '¿Qué función devuelve el texto del error dentro de un CATCH?', o: ['ERROR_MESSAGE()', '@@ERROR_TEXT', 'GET_ERROR()', 'PRINT_ERROR()'], e: 'ERROR_MESSAGE() devuelve el mensaje del error capturado.' },
    { t: 'mc', d: 2, q: '¿Qué ocurre con SET @Resultado = 10 / 0 dentro de BEGIN TRY?', o: ['Se produce un error y la ejecución pasa al CATCH', 'El resultado es 0 y continúa', 'El resultado queda en NULL y la ejecución continúa sin error', 'Se cierra la conexión'], e: 'La división entre cero genera un error que captura el CATCH.' },
    { t: 'vf', d: 1, q: 'El bloque BEGIN CATCH se escribe antes del BEGIN TRY.', a: false, e: 'Primero TRY, luego CATCH.' },
    { t: 'abierta', d: 2, q: '¿Por qué TRY…CATCH es útil junto con las transacciones?', r: 'Porque si una operación falla dentro del TRY, el CATCH puede hacer ROLLBACK y revertir todo, manteniendo la atomicidad.', e: 'Ver el ejemplo de transferencia de la Guía #8.' }
  ]);
  Q('funciones', [
    { t: 'mc', d: 1, q: '¿Qué devuelve una función escalar?', o: ['Un solo valor', 'Una tabla', 'Un cursor', 'Varias tablas'], e: 'Escalar = un valor de un tipo específico.' },
    { t: 'mc', d: 2, q: '¿Qué tipo de función se define con RETURNS TABLE AS RETURN SELECT…, sin BEGIN…END?', o: ['De tabla en línea', 'Escalar', 'De tabla con valores múltiples', 'Procedimiento almacenado'], e: 'La función en línea es una sola consulta SELECT.' },
    { t: 'mc', d: 2, q: 'RETURNS @Ventas TABLE (VentaID INT, Monto DECIMAL(10,2)) indica una función…', o: ['De tabla con valores múltiples', 'De tabla en línea con una sola consulta', 'Escalar', 'Trigger'], e: 'Declara la tabla de retorno, la llena y termina con RETURN.' },
    { t: 'vf', d: 2, q: 'Una función escalar puede ejecutar INSERT, UPDATE o DELETE.', a: false, e: 'La guía indica que no puede.' },
    { t: 'mc', d: 2, q: '¿Dónde se usa una función de tabla en una consulta?', o: ['En el FROM, como si fuera una tabla', 'Solo en el WHERE', 'Solo con EXEC, igual que un procedimiento almacenado', 'En el GROUP BY'], e: 'SELECT * FROM fn_ObtenerClientesPorCiudad(\'Madrid\').' },
    { t: 'abierta', d: 3, q: 'Escriba el cuerpo (RETURN) de fn_CalcularTotalIVA(@precio, @cantidad, @iva) si @iva es un porcentaje.', r: 'RETURN @precio * @cantidad * (1 + @iva / 100);', e: 'Total = precio × cantidad, más el porcentaje de IVA.' }
  ]);

  /* ---------- U5 ---------- */
  Q('procedimientos', [
    { t: 'mc', d: 1, q: '¿Cómo se ejecuta el procedimiento ListarClientes?', o: ['EXEC ListarClientes', 'SELECT ListarClientes()', 'CALL FUNCTION ListarClientes', 'RUN ListarClientes'], e: 'Los procedimientos se ejecutan con EXEC.' },
    { t: 'mc', d: 2, q: '¿Qué ventaja de seguridad tienen los procedimientos almacenados?', o: ['Se dan permisos sobre el procedimiento sin exponer las tablas', 'Cifran automáticamente los datos de las tablas que consultan', 'Impiden cualquier error de ejecución dentro de la base de datos', 'Eliminan la necesidad de logins'], e: 'Ventaja 3 de la Guía #6.' },
    { t: 'mc', d: 2, q: 'Para recibir un valor de vuelta del procedimiento, el parámetro se declara con…', o: ['OUTPUT', 'RETURNS', 'INTO', 'RESULT'], e: '@Cantidad INT OUTPUT, y también OUTPUT en el EXEC.' },
    { t: 'vf', d: 2, q: 'En la llamada a un procedimiento con parámetro de salida también se escribe OUTPUT.', a: true, e: 'EXEC ContarClientes @Cantidad = @TotalClientes OUTPUT;' },
    { t: 'mc', d: 2, q: '¿Qué instrucción cambia la definición de un procedimiento existente?', o: ['ALTER PROCEDURE', 'UPDATE PROCEDURE', 'MODIFY PROCEDURE', 'CREATE OR UPDATE PROCEDURE'], e: 'ALTER PROCEDURE; para eliminar, DROP PROCEDURE.' },
    { t: 'vf', d: 1, q: 'Un procedimiento almacenado reduce el tráfico de red porque solo se envía la llamada.', a: true, e: 'Ventaja 4 de la guía.' }
  ]);
  Q('cursores', [
    { t: 'mc', d: 1, q: '¿Cuál es el orden correcto de uso de un cursor?', o: ['DECLARE, OPEN, FETCH, CLOSE, DEALLOCATE', 'OPEN, DECLARE, FETCH, DEALLOCATE, CLOSE', 'DECLARE, FETCH, OPEN, CLOSE, DEALLOCATE', 'FETCH, OPEN, DECLARE, CLOSE, DEALLOCATE'], e: 'Declarar, abrir, recorrer, cerrar y liberar.' },
    { t: 'mc', d: 2, q: 'Según la guía, ¿qué indica @@FETCH_STATUS = -2?', o: ['No hay más filas disponibles', 'La fila se obtuvo con éxito', 'Error al obtener la fila', 'El cursor no fue declarado'], e: '0 éxito, -1 error, -2 no hay más filas.' },
    { t: 'mc', d: 2, q: '¿Qué pasa si olvida el FETCH NEXT dentro del WHILE?', o: ['El ciclo no avanza y se vuelve infinito', 'El cursor se cierra solo', 'Se recorren las filas al revés', 'SQL Server lo agrega automáticamente'], e: '@@FETCH_STATUS nunca cambia.' },
    { t: 'vf', d: 2, q: 'Los cursores suelen rendir mejor que las operaciones orientadas a conjuntos.', a: false, e: 'La guía advierte que procesar fila por fila puede afectar el rendimiento.' },
    { t: 'mc', d: 2, q: '¿Qué hace DEALLOCATE?', o: ['Libera el cursor y su memoria', 'Lee la siguiente fila', 'Cierra la conexión', 'Elimina la tabla recorrida'], e: 'Paso final: liberar recursos.' }
  ]);
  Q('triggers', [
    { t: 'mc', d: 1, q: 'Un trigger que se ejecuta en respuesta a CREATE, ALTER o DROP es de tipo…', o: ['DDL', 'DML', 'INSTEAD OF', 'AFTER INSERT'], e: 'DDL = definición de datos; se usan para auditoría.' },
    { t: 'mc', d: 2, q: 'En un UPDATE, ¿qué contiene la tabla DELETED?', o: ['Los datos anteriores', 'Los datos nuevos', 'Nada', 'Las filas eliminadas de otras tablas'], e: 'UPDATE: INSERTED = nuevos; DELETED = anteriores.' },
    { t: 'mc', d: 2, q: 'Para cambiar el estado a “inactivo” en lugar de borrar un producto se usa un trigger…', o: ['INSTEAD OF DELETE', 'AFTER DELETE', 'AFTER INSERT', 'DDL'], e: 'INSTEAD OF reemplaza la acción original.' },
    { t: 'vf', d: 2, q: 'En SQL Server, un trigger se ejecuta una vez por cada fila afectada.', a: false, e: 'Se ejecuta una vez por instrucción; INSERTED/DELETED pueden tener varias filas.' },
    { t: 'mc', d: 3, q: 'En trg_validar_stock (INSTEAD OF INSERT), si hay stock suficiente, ¿quién inserta el detalle?', o: ['El propio trigger, con INSERT … SELECT FROM inserted', 'SQL Server lo inserta automáticamente después', 'Nadie: INSTEAD OF cancela siempre la inserción', 'Un trigger AFTER INSERT adicional'], e: 'INSTEAD OF sustituyó el INSERT original, así que el trigger debe hacerlo.' },
    { t: 'vf', d: 2, q: 'SQL Server no tiene triggers BEFORE; para actuar antes se usa INSTEAD OF.', a: true, e: 'BEFORE existe en otros SGBD (mencionado en el programa).' },
    { t: 'mc', d: 2, q: 'En una inserción, ¿qué tabla especial tiene los datos nuevos?', o: ['INSERTED', 'DELETED', 'UPDATED', 'NEW'], e: 'INSERT: INSERTED con los datos nuevos; DELETED vacía.' }
  ]);
  Q('transacciones', [
    { t: 'mc', d: 1, q: '“Todas las operaciones se completan o ninguna se ejecuta” describe la…', o: ['Atomicidad', 'Consistencia', 'Aislamiento', 'Durabilidad'], e: 'A de ACID.' },
    { t: 'mc', d: 1, q: '“Una vez confirmados, los cambios permanecen aunque haya fallos” describe la…', o: ['Durabilidad', 'Atomicidad', 'Aislamiento', 'Consistencia'], e: 'D de ACID; el log WAL la garantiza.' },
    { t: 'mc', d: 2, q: '¿Qué hace ROLLBACK TRANSACTION paso2?', o: ['Revierte solo lo hecho después del savepoint paso2', 'Revierte toda la transacción', 'Confirma hasta paso2', 'Elimina el savepoint paso2 sin revertir ningún cambio realizado'], e: 'Revierte hasta el punto intermedio; luego hay que hacer COMMIT o ROLLBACK.' },
    { t: 'mc', d: 3, q: 'En el ejercicio 5 de la Guía #8, ¿qué actualizaciones se conservan tras ROLLBACK TRANSACTION paso2 y COMMIT?', o: ['Las de los productos 1 y 2', 'Solo la del producto 1', 'Las de los productos 1, 2 y 3', 'Ninguna'], e: 'Se revierte solo lo posterior a paso2 (producto 3).' },
    { t: 'mc', d: 2, q: '¿Qué indica @@TRANCOUNT?', o: ['Cuántas transacciones hay abiertas', 'Cuántas filas cambió la última instrucción', 'El número de la sesión', 'El nivel de aislamiento'], e: 'Por eso se usa IF @@TRANCOUNT > 0 antes de revertir.' },
    { t: 'vf', d: 2, q: 'El log WAL registra las operaciones antes de aplicarlas físicamente a los datos.', a: true, e: 'Write-Ahead Logging.' },
    { t: 'mc', d: 2, q: '¿Qué comando muestra todos los detalles del log de transacciones según la guía?', o: ['SELECT * FROM ::fn_dblog(NULL, NULL)', "DBCC SHOW_STATISTICS('cuentas', 'idx_log')", 'sp_helpindex', 'BACKUP LOG'], e: 'fn_dblog (función) muestra todos los detalles; DBCC LOG(ejemplo, 0), los mínimos.' }
  ]);
  Q('aislamiento', [
    { t: 'mc', d: 1, q: 'T2 lee un valor que T1 modificó pero aún no confirma; luego T1 hace ROLLBACK. Es una…', o: ['Lectura sucia', 'Lectura fantasma', 'Lectura no repetible', 'Actualización perdida'], e: 'Se leyó un dato no confirmado que fue revertido.' },
    { t: 'mc', d: 2, q: 'Una consulta con WHERE Disponibles > 0 devuelve 1 fila y, al repetirla, 2 por un INSERT confirmado. Es una…', o: ['Lectura fantasma', 'Lectura sucia', 'Lectura no repetible', 'Actualización perdida'], e: 'Cambió el conjunto de filas que cumple la condición.' },
    { t: 'num', d: 2, q: 'X = 10. T1 resta 1 y T2 resta 2, ambas a partir del valor leído 10, y T2 guarda último. ¿Qué valor queda en X?', a: 8, tol: 0, u: '', e: 'T2 sobrescribe con 10 − 2 = 8 y se pierde el descuento de T1 (lo correcto sería 7): actualización perdida.' },
    { t: 'mc', d: 2, q: '¿Cuál es el nivel de aislamiento por defecto en SQL Server?', o: ['READ COMMITTED', 'READ UNCOMMITTED', 'REPEATABLE READ', 'SERIALIZABLE'], e: 'Según la Guía #8.' },
    { t: 'mc', d: 2, q: '¿Cuál es el nivel menos estricto que evita la lectura no repetible?', o: ['REPEATABLE READ', 'READ COMMITTED', 'READ UNCOMMITTED', 'SNAPSHOT no existe'], e: 'REPEATABLE READ evita sucia y no repetible; la fantasma solo la evita SERIALIZABLE.' },
    { t: 'vf', d: 2, q: 'REPEATABLE READ evita las lecturas fantasma.', a: false, e: 'Solo SERIALIZABLE las evita (tabla de la Guía #8).' },
    { t: 'mc', d: 3, q: 'Con SNAPSHOT, A lee 10; B cambia a 4 y confirma; A vuelve a leer dentro de la misma transacción. ¿Qué obtiene A?', o: ['10', '4', 'Un error', 'NULL'], e: 'SNAPSHOT lee la versión confirmada al inicio de la transacción. Tras el COMMIT, una nueva consulta vería 4.' },
    { t: 'abierta', d: 2, q: 'Diferencie la lectura no repetible de la lectura fantasma.', r: 'No repetible: la misma fila leída dos veces cambia de valor. Fantasma: la misma consulta devuelve un conjunto distinto de filas (aparecen filas nuevas).', e: 'Valor de una fila vs conjunto de filas.' }
  ]);
  Q('planificacion', [
    { t: 'mc', d: 1, q: 'En la notación de la guía, e2(Y) significa…', o: ['T2 escribe Y', 'T2 lee Y', 'T2 confirma Y', 'Y espera a T2'], e: 'l = lee, e = escribe, c = commit, r = rollback.' },
    { t: 'mc', d: 2, q: '¿Cuál par NO está en conflicto?', o: ['l1(X) y l2(X)', 'l1(X) y e2(X)', 'e1(X) y l2(X)', 'e1(X) y e2(X)'], e: 'Dos lecturas no están en conflicto.' },
    { t: 'mc', d: 2, q: 'Si el grafo de precedencia tiene un ciclo, el plan…', o: ['No es serializable por conflictos', 'Es serializable por conflictos', 'Es un plan serie', 'Es recuperable'], e: 'Regla 3 de la construcción del grafo.' },
    { t: 'mc', d: 3, q: 'Plan: l1(X); l2(X); e1(X); e2(X). ¿Qué aristas hay?', o: ['T1 → T2 y T2 → T1 (ciclo)', 'Solo T1 → T2, sin ciclo', 'Solo T2 → T1', 'Ninguna: no hay conflictos'], e: 'l1(X) antes de e2(X) da T1 → T2; l2(X) antes de e1(X) da T2 → T1; e1 antes de e2 da T1 → T2. Hay ciclo.' },
    { t: 'mc', d: 3, q: 'P1: l3(X); e3(X); l1(X); e1(Y); l2(Y); e2(Z); c3; c1; c2. ¿Orden serie equivalente?', o: ['T3, T1, T2', 'T1, T2, T3', 'T2, T1, T3', 'No es serializable'], e: 'T3 → T1 por X y T1 → T2 por Y; sin ciclos.' },
    { t: 'vf', d: 2, q: 'Todo plan serializable en vistas es también serializable por conflictos.', a: false, e: 'Es al revés: conflictos ⇒ vistas. La diferencia aparece con escrituras ciegas.' },
    { t: 'mc', d: 3, q: 'l1(X); e1(X); l2(Y); e2(Y); l1(Z); e1(Z). ¿Es serializable por conflictos?', o: ['Sí: no hay operaciones en conflicto', 'No: hay un ciclo T1 → T2 → T1', 'No: hay escrituras ciegas', 'Sí, pero solo en el orden T2, T1'], e: 'Cada transacción usa datos distintos: no hay aristas; cualquier orden serie es equivalente.' },
    { t: 'mc', d: 2, q: '¿Cuál condición NO forma parte de la equivalencia en vistas?', o: ['Que tengan igual cantidad de COMMIT seguidos', 'Que se conserven las lecturas de valores iniciales', 'Relación de lectura', 'Escritura final'], e: 'Las tres condiciones son lecturas iniciales, relación de lectura y escritura final.' }
  ]);
  Q('recuperabilidad', [
    { t: 'mc', d: 1, q: 'e1(X); l2(X); c2; r1. Esta planificación es…', o: ['No recuperable', 'Estricta', 'Sin abortos en cascada', 'Recuperable'], e: 'T2 confirmó usando un dato de T1, que luego abortó.' },
    { t: 'mc', d: 2, q: 'e1(X); l2(X); c1; c2. ¿Qué propiedad cumple?', o: ['Recuperable, aunque permite lectura sucia', 'Estricta', 'No recuperable', 'Sin abortos en cascada, porque T2 confirma al final'], e: 'T2 confirma después de T1; pero leyó X antes del commit de T1.' },
    { t: 'mc', d: 2, q: 'e1(X); l2(X); e2(Y); l3(Y); e3(Z); r1. ¿Qué transacciones deben abortar?', o: ['T2 y T3', 'Solo T2', 'Solo T3', 'Ninguna además de T1'], e: 'T2 leyó de T1 y T3 leyó de T2: aborto en cascada.' },
    { t: 'vf', d: 2, q: 'Una planificación estricta también es sin abortos en cascada y recuperable.', a: true, e: 'Estricta ⇒ sin cascada ⇒ recuperable.' },
    { t: 'mc', d: 3, q: 'e1(X); e2(Y); l3(Y); r1; c2; c3. ¿El aborto de T1 obliga a abortar T2 o T3?', o: ['No: ninguna leyó datos de T1', 'Sí, a las dos porque comparten el plan', 'Solo a T3', 'Solo a T2'], e: 'Compartir la planificación no es depender. T3 leyó de T2, no de T1.' },
    { t: 'mc', d: 2, q: 'e1(X); c1; l2(X); e2(Y); c2 es…', o: ['Sin abortos en cascada: T2 lee X ya confirmado', 'No recuperable', 'Con lectura sucia', 'Con aborto en cascada si T1 llegara a hacer ROLLBACK'], e: 'T2 lee X después de c1.' },
    { t: 'vf', d: 3, q: 'Toda planificación recuperable es también sin abortos en cascada.', a: false, e: 'Las implicaciones inversas no se cumplen: una recuperable puede permitir lecturas sucias.' }
  ]);
  Q('bloqueos', [
    { t: 'mc', d: 1, q: 'T1 tiene un bloqueo S sobre un recurso y T2 solicita otro S. ¿Qué ocurre?', o: ['Se concede: S es compatible con S', 'T2 espera', 'Se produce un interbloqueo entre ambas', 'T1 se aborta'], e: 'Solo S–S es compatible en la matriz.' },
    { t: 'mc', d: 1, q: 'T1 tiene X y T2 solicita S sobre el mismo recurso. ¿Qué ocurre?', o: ['T2 espera', 'Se concede', 'T1 libera X automáticamente', 'Se convierte a S'], e: 'X es incompatible con S y con X.' },
    { t: 'mc', d: 2, q: 'En el bloqueo en dos fases, durante la fase de contracción…', o: ['Se liberan bloqueos y no se adquieren nuevos', 'Se adquieren bloqueos sin liberar', 'Se adquieren y liberan bloqueos libremente, sin orden', 'Se convierten todos a X'], e: 'Crecimiento: adquirir; contracción: liberar.' },
    { t: 'mc', d: 2, q: 'T1 retiene A y espera B; T2 retiene B y espera A. Esto es…', o: ['Un interbloqueo (deadlock)', 'Una lectura fantasma', 'Una espera normal por bloqueo', 'Una planificación serie'], e: 'Espera circular. SQL Server elige una víctima (error 1205).' },
    { t: 'mc', d: 2, q: '¿Qué significa SET LOCK_TIMEOUT 15000?', o: ['Esperar como máximo 15 segundos por un bloqueo', 'Esperar 15 000 segundos', 'Bloquear la tabla completa durante 15 segundos', 'No imponer límite de espera'], e: 'Está en milisegundos; -1 indica sin límite. Al agotarse: error 1222.' },
    { t: 'mc', d: 3, q: '¿Cuál UPDATE evita disponibilidad negativa en un solo paso?', o: ['UPDATE dbo.Libro SET Disponibles = Disponibles - 1 WHERE LibroID = 1 AND Disponibles >= 1', 'UPDATE dbo.Libro SET Disponibles = Disponibles - 1 WHERE LibroID = 1', 'UPDATE dbo.Libro SET Disponibles = Disponibles - 1 WHERE LibroID >= 1 AND Disponibles >= 1', 'UPDATE dbo.Libro SET Disponibles = @saldo - 1 WHERE LibroID = 1'], e: 'La condición y la resta ocurren en la misma instrucción; @@ROWCOUNT dice si se reservó.' },
    { t: 'vf', d: 2, q: 'Tener clave primaria garantiza que toda operación bloquee solamente una fila.', a: false, e: 'La guía advierte que no lo garantiza.' },
    { t: 'vf', d: 2, q: 'En la actividad 1, la espera de B mientras A no confirma no es un interbloqueo.', a: true, e: 'No hay espera circular: B continúa cuando A confirma.' },
    { t: 'mc', d: 2, q: '¿Qué hace HOLDLOCK en una consulta?', o: ['Aplica semántica SERIALIZABLE a esa tabla en la transacción', 'Libera todos los bloqueos apenas termina cada instrucción SELECT', 'Lee datos no confirmados', 'Cancela la transacción tras un tiempo'], e: 'UPDLOCK pide bloqueos de actualización; HOLDLOCK mantiene semántica serializable.' }
  ]);
  Q('marcas-tiempo', [
    { t: 'mc', d: 2, q: 'TS(T1) = 5 y W_TS(X) = 10. T1 intenta leer X. ¿Qué ocurre?', o: ['T1 se aborta', 'Se permite y R_TS(X) = 5', 'Se permite y W_TS(X) = 5', 'T1 espera a T2'], e: 'TS(T) < W_TS(X): una transacción de marca mayor ya escribió X.' },
    { t: 'mc', d: 2, q: 'Si una lectura se permite, R_TS(X) se actualiza a…', o: ['max(R_TS(X), TS(T))', 'min(R_TS(X), TS(T))', '0', 'W_TS(X)'], e: 'Guarda la mayor marca que haya leído X.' },
    { t: 'mc', d: 3, q: 'TS(T) = 7, R_TS(X) = 9, W_TS(X) = 3. T quiere escribir X. Resultado:', o: ['Se aborta T porque TS(T) < R_TS(X)', 'Se permite y W_TS(X) = 7', 'Se permite y W_TS(X) = 9', 'Se aborta porque TS(T) < W_TS(X)'], e: 'Una transacción de marca mayor (9) ya leyó X; la escritura tardía violaría el orden.' },
    { t: 'vf', d: 2, q: 'Una transacción abortada por marcas de tiempo puede reiniciarse con una nueva marca.', a: true, e: 'Según la política del sistema.' },
    { t: 'num', d: 3, q: 'TS(T) = 12, R_TS(X) = 10, W_TS(X) = 8. T escribe X. ¿Nuevo valor de W_TS(X)?', a: 12, tol: 0, u: '', e: '12 ≥ 10 y 12 ≥ 8: se permite y W_TS(X) = TS(T) = 12.' }
  ]);

  /* ---------- U6 ---------- */
  Q('fallas-respaldo', [
    { t: 'mc', d: 1, q: 'Una caída del servidor por un reinicio inesperado es una falla…', o: ['Del sistema', 'De transacción', 'Del disco', 'Lógica de aplicación'], e: 'Tipos: de transacción, del sistema y del disco.' },
    { t: 'mc', d: 2, q: 'El respaldo DIFFERENTIAL guarda los cambios desde…', o: ['El último respaldo FULL', 'El último respaldo DIFFERENTIAL', 'El último respaldo de LOG', 'La creación de la base'], e: 'Por eso se restaura el último FULL + el último DIFFERENTIAL.' },
    { t: 'mc', d: 2, q: '¿Qué respaldo permite la recuperación punto a punto (point-in-time)?', o: ['LOG', 'FULL', 'DIFFERENTIAL', 'Ninguno'], e: 'El respaldo del log de transacciones.' },
    { t: 'mc', d: 2, q: '¿Qué consulta muestra el modelo de recuperación de una base?', o: ['SELECT name, recovery_model_desc FROM sys.databases', 'SELECT recovery_model_desc FROM ::fn_dblog(NULL, NULL)', 'EXEC sp_helpindex', 'DBCC SHOW_STATISTICS'], e: 'La vista sys.databases tiene recovery_model_desc.' },
    { t: 'vf', d: 2, q: 'Para respaldar el log, la base debe usar el modelo FULL o BULK_LOGGED.', a: true, e: 'Requisito de la Guía #10.' },
    { t: 'vf', d: 1, q: 'La recuperación usa los archivos de respaldo y los logs de transacciones.', a: true, e: 'Definición de recovery.' }
  ]);
  Q('backup-restore', [
    { t: 'mc', d: 1, q: '¿Qué opción convierte un BACKUP DATABASE en diferencial?', o: ['WITH DIFFERENTIAL', 'WITH LOG', 'WITH FORMAT', 'WITH RECOVERY'], e: 'BACKUP DATABASE … WITH DIFFERENTIAL.' },
    { t: 'mc', d: 2, q: '¿Qué hace FORMAT en BACKUP DATABASE?', o: ['Crea un nuevo conjunto de medios e inutiliza los respaldos anteriores del destino', 'Comprime el respaldo para que ocupe menos espacio en el disco o cinta de destino', 'Verifica el respaldo al terminar', 'Restaura la base al formato original'], e: 'Con FORMAT, agregar INIT es redundante.' },
    { t: 'mc', d: 2, q: 'En RESTORE DATABASE … WITH RECOVERY, REPLACE, ¿qué permite REPLACE?', o: ['Sobrescribir una base existente', 'Dejar la base en modo de solo lectura', 'Restaurar solo el log', 'Cambiar el modelo de recuperación'], e: 'RECOVERY deja la base operativa; REPLACE permite sobrescribir.' },
    { t: 'vf', d: 2, q: 'Si no se especifica el tipo en BACKUP DATABASE, se hace un respaldo FULL.', a: true, e: 'FULL es implícito.' },
    { t: 'mc', d: 2, q: '¿Qué procedimiento agrega un dispositivo de copias de seguridad?', o: ['sp_addumpdevice', 'sp_addlinkedserver', 'sp_helpindex', 'sp_addlinkedsrvlogin'], e: "EXEC sp_addumpdevice 'disk', 'RESPALDO', 'C:\\BD\\RESPALDO.BAK'." }
  ]);

  /* ---------- U7 ---------- */
  Q('optimizacion-proceso', [
    { t: 'mc', d: 1, q: '¿Cuál es el último paso del proceso de optimización?', o: ['Selección del plan de menor costo estimado', 'Análisis sintáctico y semántico de la consulta', 'Reescritura de la consulta', 'Generación de planes'], e: 'Análisis → reescritura → generación → evaluación → selección.' },
    { t: 'mc', d: 2, q: '“Aplicar primero las condiciones de selección” es una regla de la optimización…', o: ['Heurística', 'Basada en costos', 'Semántica de índices', 'Distribuida'], e: 'La basada en costos usa estadísticas.' },
    { t: 'mc', d: 2, q: 'En el ejemplo de vinos y cosechas, ¿cuál opción es la más eficiente?', o: ['Selección, join, proyección', 'Join, selección, proyección', 'Producto cartesiano, selección, proyección', 'Las tres cuestan lo mismo'], e: 'Filtrar primero deja 100 tuplas antes de unir.' },
    { t: 'num', d: 2, q: 'Vinos tiene 500 tuplas y Cosechas 1 200. ¿Cuántas tuplas produce el producto cartesiano?', a: 600000, tol: 0, u: 'tuplas', e: '500 × 1 200 = 600 000.' },
    { t: 'vf', d: 2, q: 'La optimización basada en costos usa estadísticas como cardinalidad, selectividad y número de bloques.', a: true, e: 'Según la Guía #11.' }
  ]);
  Q('optimizacion-practica', [
    { t: 'mc', d: 1, q: '¿Por qué WHERE YEAR(fecha) = 2024 es menos eficiente?', o: ['La función sobre la columna impide usar el índice', 'YEAR no existe en SQL Server', 'Devuelve resultados incorrectos', 'Obliga a agrupar los resultados con GROUP BY por año'], e: 'Mejor: fecha BETWEEN \'2024-01-01\' AND \'2024-12-31\'.' },
    { t: 'mc', d: 2, q: '¿Qué comando muestra cuántas lecturas realiza una consulta?', o: ['SET STATISTICS IO ON', 'SET STATISTICS TIME ON', 'UPDATE STATISTICS', 'DBCC LOG'], e: 'IO = lecturas; TIME = CPU y ejecución.' },
    { t: 'mc', d: 2, q: '¿Qué atajo de SSMS incluye el plan de ejecución real?', o: ['Ctrl + M', 'Ctrl + E', 'F5', 'Ctrl + L'], e: 'Ctrl + M antes de ejecutar.' },
    { t: 'mc', d: 2, q: 'Tras crear idx_fecha, la consulta con BETWEEN debería usar…', o: ['Index Seek', 'Table Scan obligatorio', 'Hash Join', 'Producto cartesiano'], e: 'Seek va directo a las filas buscadas.' },
    { t: 'vf', d: 2, q: 'La Guía #11 recomienda EXISTS en lugar de IN para subconsultas con muchas filas.', a: true, e: 'Estrategia 4.' },
    { t: 'mc', d: 2, q: '¿Qué hace UPDATE STATISTICS Empleados?', o: ['Actualiza las estadísticas para mejorar las estimaciones del optimizador', 'Modifica los datos de la tabla', 'Reconstruye todos los índices de la tabla para eliminar su fragmentación', 'Muestra el plan de ejecución'], e: 'Luego se puede observar el histograma con DBCC SHOW_STATISTICS.' },
    { t: 'vf', d: 1, q: 'Usar SELECT * es una buena práctica de optimización.', a: false, e: 'Se recomienda seleccionar solo las columnas necesarias.' }
  ]);

  /* ---------- U8 ---------- */
  Q('bdd-conceptos', [
    { t: 'mc', d: 1, q: 'Dividir las filas de Clientes por país entre nodos es fragmentación…', o: ['Horizontal', 'Vertical', 'Mixta', 'Replicada'], e: 'Horizontal = filas (selección).' },
    { t: 'mc', d: 1, q: 'Separar datos personales de financieros en nodos distintos es fragmentación…', o: ['Vertical', 'Horizontal', 'Total', 'Parcial'], e: 'Vertical = columnas (proyección).' },
    { t: 'mc', d: 2, q: '¿Qué protocolo coordina la confirmación de una transacción entre nodos?', o: ['Two-Phase Commit (2PC)', 'Two-Phase Locking (2PL)', 'Marcas de tiempo', 'Cache aside'], e: '2PC: preparar y luego confirmar o deshacer.' },
    { t: 'mc', d: 2, q: '“El usuario no necesita saber dónde están los datos” es transparencia de…', o: ['Localización', 'Replicación', 'Fragmentación', 'Fallos'], e: 'Objetivos de transparencia de la Guía #12.' },
    { t: 'mc', d: 2, q: 'Una BDD cuyos nodos usan distintos SGBD es…', o: ['Heterogénea', 'Homogénea', 'Centralizada', 'Replicada total'], e: 'Homogénea: mismo SGBD y SO en todos los nodos.' },
    { t: 'mc', d: 3, q: 'Π DNI, Escuela, Nombre, Beca aplicado al fragmento σ Escuela = \'EUI\' es fragmentación…', o: ['Mixta', 'Horizontal', 'Vertical pura', 'Sin fragmentar'], e: 'Proyección sobre un fragmento horizontal previo.' },
    { t: 'vf', d: 2, q: 'Los costos de comunicación entre nodos son una desventaja de las BDD.', a: true, e: 'Lista de desventajas de la guía.' },
    { t: 'vf', d: 2, q: 'En la replicación parcial, cada nodo tiene una copia completa de la base.', a: false, e: 'Eso es replicación total.' }
  ]);
  Q('servidores-vinculados', [
    { t: 'mc', d: 1, q: '¿Qué procedimiento crea un servidor vinculado?', o: ['sp_addlinkedserver', 'sp_addlinkedsrvlogin', 'sp_addumpdevice', 'sp_helpindex'], e: 'sp_addlinkedsrvlogin configura las credenciales del vínculo.' },
    { t: 'mc', d: 1, q: '¿Qué puerto TCP usa normalmente la instancia predeterminada de SQL Server?', o: ['1433', '3306', '27017', '8080'], e: '1433; las instancias con nombre pueden usar puertos dinámicos.' },
    { t: 'mc', d: 2, q: 'En Sucursal2.TiendaSucursal2.dbo.Productos, ¿qué es TiendaSucursal2?', o: ['La base de datos', 'El servidor vinculado', 'El esquema', 'La tabla'], e: 'servidor.base.esquema.tabla.' },
    { t: 'mc', d: 2, q: '¿Qué tipo de autenticación se requiere habilitar según la guía?', o: ['Mixta (SQL Server y Windows)', 'Solo Windows', 'Solo certificados digitales de la PKI', 'Ninguna'], e: 'Requisito previo 4 de la Guía #12.' },
    { t: 'vf', d: 2, q: 'Se puede hacer JOIN entre una tabla local y una tabla de un servidor vinculado.', a: true, e: 'Paso 5: unir datos entre sucursales.' },
    { t: 'vf', d: 2, q: 'Para conexiones remotas conviene abrir en el firewall todos los puertos del servidor.', a: false, e: 'Solo el puerto real, en el perfil y alcance necesarios.' }
  ]);

  /* ---------- U9 ---------- */
  Q('mongo-conceptos', [
    { t: 'mc', d: 1, q: '¿En qué formato almacena MongoDB los documentos?', o: ['BSON (Binary JSON)', 'Archivos MDF/LDF', 'CSV', 'XML'], e: 'MDF/LDF son de SQL Server.' },
    { t: 'mc', d: 1, q: '¿Qué campo identifica de forma única cada documento?', o: ['_id', 'id_documento', 'PRIMARY KEY', 'carne'], e: 'Cada documento tiene un _id único en su colección.' },
    { t: 'mc', d: 2, q: '¿Cómo maneja MongoDB las relaciones según la tabla comparativa?', o: ['Manuales o embebidas (referencias o subdocumentos)', 'Con llaves foráneas y normalización', 'Con procedimientos almacenados que validan las referencias', 'No permite relacionar datos'], e: 'SQL Server usa llaves foráneas.' },
    { t: 'vf', d: 2, q: 'MongoDB soporta procedimientos almacenados nativos igual que SQL Server.', a: false, e: 'No nativos: la lógica va en la aplicación.' },
    { t: 'mc', d: 2, q: '¿Qué herramienta gráfica se instala por defecto con MongoDB?', o: ['Compass', 'SSMS', 'pgAdmin', 'Workbench'], e: 'Compass es el entorno predeterminado.' },
    { t: 'vf', d: 1, q: 'MongoDB no necesita un esquema fijo.', a: true, e: 'Estructura flexible.' }
  ]);
  Q('mongo-crud', [
    { t: 'mc', d: 1, q: '¿Qué operador significa “mayor o igual”?', o: ['$gte', '$gt', '$lte', '$ne'], e: '$gt mayor, $gte mayor o igual, $lt menor, $lte menor o igual, $ne diferente.' },
    { t: 'mc', d: 1, q: '¿Qué método inserta varios documentos a la vez?', o: ['insertMany', 'insertOne', 'insertAll', 'addMany'], e: 'insertMany recibe un arreglo.' },
    { t: 'mc', d: 2, q: '¿Qué hace db.estudiantes.find({ carne: "C789123", edad: 22 })?', o: ['Busca documentos que cumplan ambas condiciones', 'Busca documentos que cumplan cualquiera', 'Inserta un documento', 'Actualiza la edad a 22'], e: 'Varias condiciones en el mismo filtro = AND implícito.' },
    { t: 'mc', d: 2, q: '¿Cuál consulta busca cursos impartidos por Ana o por Carlos?', o: ['db.cursos.find({ $or: [ { profesor: "Ana" }, { profesor: "Carlos" } ] })', 'db.cursos.find({ profesor: "Ana", profesor: "Carlos" })', 'db.cursos.find({ profesor: { $ne: "Ana" }, profesor: { $ne: "Carlos" } })', 'db.cursos.find({ $or: { profesor: "Ana" } })'], e: '$or recibe un arreglo de condiciones.' },
    { t: 'mc', d: 2, q: '¿Cómo se filtra por el número de aula dentro del subdocumento aula?', o: ['{ "aula.numero": "A101" }', '{ aula: "A101" }', '{ numero: "A101" }', '{ aula[numero]: "A101" }'], e: 'Notación de punto entre comillas.' },
    { t: 'mc', d: 2, q: '¿Qué falta en db.estudiantes.updateOne({ nombre: "Dilana" }, { edad: 27 }) según la guía?', o: ['El operador $set', 'El operador $or', 'Un arreglo [ ]', 'El método find'], e: 'La forma de la guía es { $set: { edad: 27 } }.' },
    { t: 'vf', d: 2, q: 'deleteOne elimina todos los documentos que cumplen el filtro.', a: false, e: 'Elimina el primero; deleteMany elimina todos.' },
    { t: 'mc', d: 3, q: '¿Cuál filtro selecciona cursos con más de 20 y menos de 35 estudiantes?', o: ['{ cantidad_estudiantes: { $gt: 20, $lt: 35 } }', '{ cantidad_estudiantes: { $gte: 20, $lte: 35 } }', '{ $or: [ { cantidad_estudiantes: { $gt: 20 } }, { cantidad_estudiantes: { $lt: 35 } } ] }', '{ cantidad_estudiantes: { $ne: 20, $ne: 35 } }'], e: '“Más de” y “menos de” son estrictos ($gt, $lt) y ambos deben cumplirse.' }
  ]);

  /* ---------- U10 ---------- */
  Q('inv-fundamentos', [
    { t: 'mc', d: 1, q: 'En una relación 1:N, ¿dónde va la clave foránea?', o: ['En el lado N', 'En el lado 1', 'En una tabla intermedia', 'En ambas tablas'], e: 'Ej.: Producto (N) guarda la FK hacia Categoría (1).' },
    { t: 'mc', d: 2, q: 'Listar 10 clientes y luego consultar por separado los pedidos de cada uno produce…', o: ['11 consultas: problema N+1', '10 consultas en total', '1 consulta con JOIN', '2 consultas por lote'], e: 'La carga anticipada lo resuelve.' },
    { t: 'mc', d: 2, q: '¿Qué administra un pool?', o: ['Conexiones reutilizables', 'Migraciones pendientes', 'Copias de seguridad', 'Índices compuestos'], e: 'Definición del resumen de investigaciones.' },
    { t: 'vf', d: 2, q: 'Una relación N:M se implementa con una tabla intermedia que puede guardar datos propios, como cantidad y precio unitario.', a: true, e: 'Ej.: DetallePedido.' },
    { t: 'vf', d: 1, q: 'Las credenciales de la base deben escribirse directamente en el código fuente.', a: false, e: 'Se recomienda mantener los secretos fuera del código.' }
  ]);
  Q('inv-transacciones', [
    { t: 'mc', d: 2, q: 'El control optimista detecta conflictos…', o: ['Al guardar, comparando la versión del registro con la leída', 'Bloqueando la fila desde que se lee hasta que termina la operación', 'Impidiendo cualquier lectura concurrente', 'Usando solo READ UNCOMMITTED'], e: 'El pesimista es el que bloquea la fila.' },
    { t: 'mc', d: 2, q: 'En el caso EF Core, ¿qué excepción lanza el sistema con RowVersion?', o: ['DbUpdateConcurrencyException', 'DeadlockException', 'SqlTimeoutException', 'ConstraintViolationException'], e: 'Luego el sistema relee y valida.' },
    { t: 'mc', d: 2, q: 'En Django, select_related llevó 4 matrículas de 9 consultas a…', o: ['1', '4', '5', '9'], e: 'Usa JOIN para relaciones de valor único.' },
    { t: 'mc', d: 3, q: 'En Laravel, si la transacción se reintenta tras un deadlock, ¿cuándo se envían los correos?', o: ['Después del commit', 'Antes de iniciar la transacción', 'Dentro de lockForUpdate', 'Nunca se deben enviar'], e: 'Así no se envían correos de operaciones revertidas.' },
    { t: 'mc', d: 2, q: '¿Qué paginación conviene para recorridos secuenciales de listas grandes?', o: ['Por cursor', 'Por desplazamiento (skip/take)', 'Sin orden', 'Aleatoria'], e: 'skip/take facilita saltar a una página concreta.' },
    { t: 'vf', d: 2, q: 'En Django, aggregate calcula un valor por fila y annotate un resumen global.', a: false, e: 'Es al revés: aggregate = resumen global; annotate = cálculo por fila.' }
  ]);
  Q('inv-frameworks', [
    { t: 'mc', d: 1, q: '¿Qué framework usa @Transactional y JOIN FETCH?', o: ['Spring Boot', 'Django', 'Laravel', 'EF Core'], e: 'JPA/Hibernate con Spring Data JPA.' },
    { t: 'mc', d: 2, q: '¿Qué comando aplica las migraciones en Laravel?', o: ['php artisan migrate', 'dotnet ef database update', 'prisma migrate deploy', 'python manage.py makemigrations'], e: 'Laravel: php artisan migrate.' },
    { t: 'mc', d: 2, q: 'En EF Core, ¿qué sirve para lecturas que no requieren seguimiento de cambios?', o: ['AsNoTracking', 'Include', 'SaveChanges', 'BeginTransaction'], e: 'Include carga relaciones; SaveChanges guarda.' },
    { t: 'mc', d: 2, q: 'En Django, ¿qué hace prefetch_related?', o: ['Hace consultas separadas y combina los resultados en Python', 'Usa un JOIN para traer la relación en una sola consulta', 'Bloquea las filas leídas hasta que termina la transacción', 'Genera una migración'], e: 'select_related es el que usa JOIN.' },
    { t: 'vf', d: 2, q: 'Hibernate define el estándar JPA y Spring Data JPA lo implementa.', a: false, e: 'JPA define el estándar, Hibernate lo implementa y Spring Data JPA aporta repositorios.' },
    { t: 'mc', d: 2, q: 'En Laravel, ¿qué permite proteger filas durante una transacción?', o: ['lockForUpdate', 'with', 'hasMany', 'belongsTo'], e: 'with hace carga anticipada; hasMany/belongsTo son relaciones.' }
  ]);
  Q('inv-proteccion', [
    { t: 'mc', d: 2, q: '¿Qué mecanismo cambia la presentación de un dato sin modificar el valor almacenado?', o: ['Enmascaramiento dinámico (DDM)', 'Seguridad por fila (RLS)', 'Cifrado de columna', 'Auditoría'], e: 'Ej.: cédulas parcialmente ocultas.' },
    { t: 'mc', d: 2, q: '¿Qué mecanismo permite que cada docente vea solo las notas de sus cursos?', o: ['Seguridad por fila (RLS)', 'Enmascaramiento dinámico', 'Cifrado AES-256', 'Rol sysadmin'], e: 'Predicados de filtrado determinan las filas visibles.' },
    { t: 'mc', d: 3, q: 'Mover una matrícula visible a un curso ajeno fue rechazado por…', o: ['Un predicado de bloqueo', 'Un predicado de filtrado', 'El enmascaramiento', 'Un deadlock'], e: 'El de filtrado decide qué filas se encuentran; el de bloqueo valida lo que se intenta guardar.' },
    { t: 'vf', d: 2, q: 'Autenticación determina qué puede hacer una identidad; autorización comprueba quién es.', a: false, e: 'Es al revés.' },
    { t: 'mc', d: 2, q: '¿Qué se propone para que la bitácora no quede expuesta dentro de la misma base?', o: ['SQL Server Audit con resultados fuera de la base', 'Guardarla en una vista dentro de la misma base de datos', 'Cifrarla con DDM', 'Usar un cursor'], e: 'Limitación identificada en el artículo.' }
  ]);
  Q('inv-contenedores', [
    { t: 'mc', d: 1, q: 'En el mapeo 15433:1433, ¿qué puerto usa el cliente externo?', o: ['15433 del host', '1433 del host', '15433 del contenedor', '1433 de la red bridge'], e: 'SQL Server escucha en el 1433 del contenedor.' },
    { t: 'mc', d: 2, q: '¿Qué conserva el estado de la base al reemplazar el contenedor?', o: ['El volumen', 'La imagen', 'La capa de escritura del contenedor', 'La red bridge'], e: 'La imagen contiene el software; el volumen, los datos.' },
    { t: 'mc', d: 2, q: '¿Qué herramienta respalda MongoDB?', o: ['mongodump / mongorestore', 'mysqldump', 'BACKUP DATABASE … TO DISK', 'RMAN'], e: 'SQL Server usa BACKUP/RESTORE; MySQL, mysqldump.' },
    { t: 'vf', d: 2, q: 'Un contenedor ejecuta su propio sistema operativo invitado, igual que una máquina virtual.', a: false, e: 'El contenedor comparte el kernel del anfitrión; la VM tiene SO invitado.' }
  ]);
  Q('inv-nosql', [
    { t: 'mc', d: 1, q: '¿Qué modelo se propone para el carrito por usuario o sesión?', o: ['Clave-valor (Redis)', 'Grafos (Neo4j)', 'Documentos (MongoDB)', 'Familias de columnas (Cassandra)'], e: 'Acceso directo por una clave conocida.' },
    { t: 'mc', d: 2, q: '¿Qué motor guarda pedidos, pagos e inventario como datos oficiales?', o: ['Relacional (MySQL)', 'Redis', 'Neo4j', 'Cassandra'], e: 'Requieren reglas, importes, estados y relaciones.' },
    { t: 'mc', d: 2, q: 'Recomendar productos recorriendo cliente → producto → otros clientes conviene en…', o: ['Un grafo (Neo4j)', 'Clave-valor', 'Familias de columnas', 'Un archivo de log'], e: 'El grafo modela los recorridos.' },
    { t: 'vf', d: 2, q: 'Escalar horizontalmente es agregar más recursos a un solo servidor.', a: false, e: 'Eso es escalar verticalmente; horizontal reparte entre nodos.' }
  ]);
  Q('inv-redis', [
    { t: 'num', d: 1, q: 'Con 80 hits y 20 misses, ¿cuál es la tasa de aciertos en %?', a: 80, tol: 0, u: '%', e: '80 ÷ (80 + 20) × 100 = 80 %.' },
    { t: 'num', d: 2, q: 'Con 45 hits y 15 misses, ¿cuál es la tasa de aciertos en %?', a: 75, tol: 0, u: '%', e: '45 ÷ 60 × 100 = 75 %.' },
    { t: 'mc', d: 2, q: 'En cache aside, ante un miss la aplicación…', o: ['Lee el SGBD, devuelve el resultado y guarda una copia con TTL', 'Devuelve un error al usuario y espera a que alguien llene Redis', 'Espera a que Redis se llene', 'Borra la clave del SGBD'], e: 'Con hit devuelve la copia de Redis.' },
    { t: 'mc', d: 2, q: 'Después de confirmar un precio nuevo en la base, ¿qué se hace con la clave en Redis?', o: ['Se invalida (elimina) la clave', 'Se deja hasta que expire sola', 'Se bloquea con lockForUpdate', 'Se copia a otra clave'], e: 'La próxima consulta repuebla Redis con el precio nuevo.' }
  ]);
  Q('inv-semantica', [
    { t: 'mc', d: 1, q: 'En pgvector, ¿qué operador devuelve la distancia coseno?', o: ['<=>', '<->', '==', '~'], e: 'Valores menores indican mayor cercanía.' },
    { t: 'num', d: 2, q: 'Si 3 de los 5 artículos devueltos son pertinentes, ¿cuál es la precisión@5 en %?', a: 60, tol: 0, u: '%', e: '3 ÷ 5 = 60 %.' },
    { t: 'mc', d: 2, q: '¿Qué hace HNSW?', o: ['Acelera la búsqueda aproximada de vecinos', 'Garantiza encontrar siempre todos los vecinos exactos', 'Genera los embeddings', 'Divide los PDF por artículo'], e: 'A cambio, puede omitir algunos resultados cercanos.' },
    { t: 'vf', d: 2, q: 'Se debe usar el mismo modelo de embeddings para los documentos y para las preguntas.', a: true, e: 'Recomendación del resumen.' }
  ]);
  Q('inv-procesos', [
    { t: 'mc', d: 1, q: '¿Cuáles son los campos mínimos de un registro de eventos?', o: ['Caso, actividad y marca de tiempo', 'Usuario, contraseña, rol y fecha de acceso', 'Recurso, costo y área', 'Tabla, columna y tipo'], e: 'Recurso, área o costo son opcionales.' },
    { t: 'mc', d: 2, q: 'Comparar el proceso observado con el esperado para detectar pasos omitidos es…', o: ['Conformidad', 'Descubrimiento', 'Mejora', 'Generalización'], e: 'Descubrimiento reconstruye; mejora busca cuellos de botella.' },
    { t: 'mc', d: 2, q: 'El pedido 26 (Recibido → Enviado) permite detectar…', o: ['Una aprobación ausente', 'Una aprobación repetida', 'Una variante correcta', 'Un deadlock'], e: 'El 27 tiene la aprobación repetida.' },
    { t: 'mc', d: 2, q: '¿Qué funciones SQL ayudan a calcular intervalos por caso?', o: ['LAG y LEAD', 'COUNT y SUM', 'GRANT y DENY', 'BEGIN y COMMIT'], e: 'JOIN vincula y UNION ALL reúne tipos de eventos.' },
    { t: 'vf', d: 2, q: 'La precisión de un modelo mide si admite demasiado comportamiento ajeno al registro.', a: true, e: 'Ajuste, precisión, generalización y simplicidad.' }
  ]);

  window.PREGUNTAS = P;
})();
