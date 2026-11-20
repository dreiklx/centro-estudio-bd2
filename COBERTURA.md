# Matriz de cobertura · Centro de Estudio BD II (Examen 3)

Alcance: Guías #8 a #13 (carpeta `Bases Examen 3/Temas de examen`). Relaciona cada guía con sus temas, subtemas y la sección de la plataforma donde se estudian (ruta `#/tema/<id>`). También se ve dentro de la página en **Cobertura del temario**.

| Documento | Tema | Subtema | Sección en la plataforma | Práctica |
|---|---|---|---|---|
| Guía #8 · Concurrencia | Transacción | Definición | U1 · Transacciones, ACID, savepoints y log (`transacciones`) | 7 preg. · 4 lab. |
| Guía #8 · Concurrencia | Propiedades ACID | Atomicidad, Consistencia, Aislamiento, Durabilidad | U1 · Transacciones, ACID, savepoints y log (`transacciones`) | 7 preg. · 4 lab. |
| Guía #8 · Concurrencia | Comandos | BEGIN TRANSACTION, COMMIT, ROLLBACK, SAVE TRANSACTION, ROLLBACK TRANSACTION nombre | U1 · Transacciones, ACID, savepoints y log (`transacciones`) | 7 preg. · 4 lab. |
| Guía #8 · Concurrencia | Ejemplos | Transferencia con TRY/CATCH; savepoint despues_de_debito con @@TRANCOUNT | U1 · Transacciones, ACID, savepoints y log (`transacciones`) | 7 preg. · 4 lab. |
| Guía #8 · Concurrencia | Log de transacciones (WAL) | Usos y comandos fn_dblog / DBCC LOG | U1 · Transacciones, ACID, savepoints y log (`transacciones`) | 7 preg. · 4 lab. |
| Guía #8 · Concurrencia | Ejercicios 1, 4 y 5 | Venta completa, rollback por stock insuficiente, savepoints | U1 · Transacciones, ACID, savepoints y log (`transacciones`) | 7 preg. · 4 lab. |
| Guía #8 · Concurrencia | Control de concurrencia | Definición | U1 · Problemas de concurrencia y niveles de aislamiento (`aislamiento`) | 8 preg. · 3 lab. |
| Guía #8 · Concurrencia | Problemas comunes | Lectura sucia, no repetible, fantasma (con ejemplos) | U1 · Problemas de concurrencia y niveles de aislamiento (`aislamiento`) | 8 preg. · 3 lab. |
| Guía #8 · Concurrencia | Aislamiento de transacciones | READ UNCOMMITTED, READ COMMITTED (por defecto), REPEATABLE READ, SERIALIZABLE; tabla de qué evita cada uno; SET TRANSACTION ISOLATION LEVEL | U1 · Problemas de concurrencia y niveles de aislamiento (`aislamiento`) | 8 preg. · 3 lab. |
| Guía #8 · Concurrencia | Ejercicios 2 y 3 | Simular lectura no repetible y lectura fantasma | U1 · Problemas de concurrencia y niveles de aislamiento (`aislamiento`) | 8 preg. · 3 lab. |
| Guía #8 · Concurrencia | Log de transacciones (WAL) | Recuperación tras una caída: rehacer lo confirmado y deshacer lo no confirmado | U2 · Fallas, respaldo y modelos de recuperación (`fallas-respaldo`) | 6 preg. · 2 lab. |
| Guía #9 · Planificación de las transacciones | Anomalías de concurrencia | Actualización perdida, lectura sucia, no repetible, fantasma | U1 · Problemas de concurrencia y niveles de aislamiento (`aislamiento`) | 8 preg. · 3 lab. |
| Guía #9 · Planificación de las transacciones | Laboratorio actividades 2, 3 y 4 | READ UNCOMMITTED, READCOMMITTEDLOCK, REPEATABLE READ, SNAPSHOT, ALLOW_SNAPSHOT_ISOLATION | U1 · Problemas de concurrencia y niveles de aislamiento (`aislamiento`) | 8 preg. · 3 lab. |
| Guía #9 · Planificación de las transacciones | Planificación de ejecución | Definición y notación l1(X), e1(X), c1, r1 | U1 · Planificación y serializabilidad (`planificacion`) | 8 preg. |
| Guía #9 · Planificación de las transacciones | Planificación serie y no serie | PA, PB | U1 · Planificación y serializabilidad (`planificacion`) | 8 preg. |
| Guía #9 · Planificación de las transacciones | Planificación serializable | Equivalencia por conflictos; operaciones en conflicto | U1 · Planificación y serializabilidad (`planificacion`) | 8 preg. |
| Guía #9 · Planificación de las transacciones | Grafo de precedencia | Construcción, ciclos, orden topológico; PC, PD, P1, P2 | U1 · Planificación y serializabilidad (`planificacion`) | 8 preg. |
| Guía #9 · Planificación de las transacciones | Equivalencia en vistas | Lecturas iniciales, relación de lectura, escritura final; V1-V4 | U1 · Planificación y serializabilidad (`planificacion`) | 8 preg. |
| Guía #9 · Planificación de las transacciones | Relación entre criterios | Escrituras ciegas (V5) | U1 · Planificación y serializabilidad (`planificacion`) | 8 preg. |
| Guía #9 · Planificación de las transacciones | Ejercicios | 10 planificaciones con grafo de precedencia | U1 · Planificación y serializabilidad (`planificacion`) | 8 preg. |
| Guía #9 · Planificación de las transacciones | Planificación recuperable | Definición y ejemplos recuperable / no recuperable | U1 · Planificaciones recuperables, sin cascada y estrictas (`recuperabilidad`) | 7 preg. |
| Guía #9 · Planificación de las transacciones | Aborto en cascada | Definición | U1 · Planificaciones recuperables, sin cascada y estrictas (`recuperabilidad`) | 7 preg. |
| Guía #9 · Planificación de las transacciones | Sin abortos en cascada | Definición y ejemplo | U1 · Planificaciones recuperables, sin cascada y estrictas (`recuperabilidad`) | 7 preg. |
| Guía #9 · Planificación de las transacciones | Planificación estricta | Definición y relación estricta ⇒ sin cascada ⇒ recuperable | U1 · Planificaciones recuperables, sin cascada y estrictas (`recuperabilidad`) | 7 preg. |
| Guía #9 · Planificación de las transacciones | Ejercicios | Preguntas de recuperabilidad y cascada | U1 · Planificaciones recuperables, sin cascada y estrictas (`recuperabilidad`) | 7 preg. |
| Guía #9 · Planificación de las transacciones | Bloqueos | Recursos y granularidad; compartido S y exclusivo X; matriz de compatibilidad | U1 · Bloqueos, B2F, interbloqueos y laboratorio (`bloqueos`) | 9 preg. · 4 lab. |
| Guía #9 · Planificación de las transacciones | Reglas del modelo de bloqueo | Obtener permiso antes de leer/escribir | U1 · Bloqueos, B2F, interbloqueos y laboratorio (`bloqueos`) | 9 preg. · 4 lab. |
| Guía #9 · Planificación de las transacciones | Bloqueo en dos fases (B2F) | Fase de crecimiento y de contracción; ejemplo T1/T2 | U1 · Bloqueos, B2F, interbloqueos y laboratorio (`bloqueos`) | 9 preg. · 4 lab. |
| Guía #9 · Planificación de las transacciones | Interbloqueo | Espera circular; error 1205 | U1 · Bloqueos, B2F, interbloqueos y laboratorio (`bloqueos`) | 9 preg. · 4 lab. |
| Guía #9 · Planificación de las transacciones | Tiempo límite | SET LOCK_TIMEOUT (15000, -1); error 1222 | U1 · Bloqueos, B2F, interbloqueos y laboratorio (`bloqueos`) | 9 preg. · 4 lab. |
| Guía #9 · Planificación de las transacciones | Ejemplos en SQL Server | UPDLOCK, HOLDLOCK, WAITFOR DELAY | U1 · Bloqueos, B2F, interbloqueos y laboratorio (`bloqueos`) | 9 preg. · 4 lab. |
| Guía #9 · Planificación de las transacciones | Laboratorio | Preparación (@@SPID, @@TRANCOUNT, sys.databases), actividades 1, 5 y 6 (@@ROWCOUNT) | U1 · Bloqueos, B2F, interbloqueos y laboratorio (`bloqueos`) | 9 preg. · 4 lab. |
| Guía #9 · Planificación de las transacciones | Ordenación por marcas de tiempo | TS(T), R_TS(X), W_TS(X) | U1 · Ordenación por marcas de tiempo (`marcas-tiempo`) | 5 preg. |
| Guía #9 · Planificación de las transacciones | Regla de lectura y de escritura | Condiciones de aborto | U1 · Ordenación por marcas de tiempo (`marcas-tiempo`) | 5 preg. |
| Guía #9 · Planificación de las transacciones | Ejemplo | TS(T1)=5, TS(T2)=10 | U1 · Ordenación por marcas de tiempo (`marcas-tiempo`) | 5 preg. |
| Guía #9 · Planificación de las transacciones | Conexiones remotas | Configuration Manager, TCP/IP, puerto 1433, firewall, servidor,puerto, opción remote access | U4 · Conexiones remotas y servidores vinculados (`servidores-vinculados`) | 6 preg. |
| Guía #10 · Respaldo y recuperación | Conceptos | Respaldo (backup) y recuperación (recovery) | U2 · Fallas, respaldo y modelos de recuperación (`fallas-respaldo`) | 6 preg. · 2 lab. |
| Guía #10 · Respaldo y recuperación | Tipos de fallas | De transacción, del sistema, del disco | U2 · Fallas, respaldo y modelos de recuperación (`fallas-respaldo`) | 6 preg. · 2 lab. |
| Guía #10 · Respaldo y recuperación | Modelo de respaldo en SQL Server | Tabla FULL, DIFFERENTIAL, LOG | U2 · Fallas, respaldo y modelos de recuperación (`fallas-respaldo`) | 6 preg. · 2 lab. |
| Guía #10 · Respaldo y recuperación | Modelo de recuperación | sys.databases recovery_model_desc; ALTER DATABASE SET RECOVERY FULL | U2 · Fallas, respaldo y modelos de recuperación (`fallas-respaldo`) | 6 preg. · 2 lab. |
| Guía #10 · Respaldo y recuperación | Respaldo completo | BACKUP DATABASE ... WITH FORMAT, INIT, NAME; FULL implícito | U2 · Comandos BACKUP y RESTORE (`backup-restore`) | 5 preg. · 4 lab. |
| Guía #10 · Respaldo y recuperación | Respaldo diferencial | WITH DIFFERENTIAL; restaurar FULL + DIFFERENTIAL | U2 · Comandos BACKUP y RESTORE (`backup-restore`) | 5 preg. · 4 lab. |
| Guía #10 · Respaldo y recuperación | Respaldo del log | BACKUP LOG ... .trn; FULL o BULK_LOGGED; point-in-time | U2 · Comandos BACKUP y RESTORE (`backup-restore`) | 5 preg. · 4 lab. |
| Guía #10 · Respaldo y recuperación | Dispositivos y restauración | sp_addumpdevice; RESTORE DATABASE ... WITH RECOVERY, REPLACE | U2 · Comandos BACKUP y RESTORE (`backup-restore`) | 5 preg. · 4 lab. |
| Guía #10 · Respaldo y recuperación | Aplicación de los tipos de respaldo | Orden de restauración: FULL + último DIFFERENTIAL + LOG posteriores | U2 · Comandos BACKUP y RESTORE (`backup-restore`) | 5 preg. · 4 lab. |
| Guía #11 · Optimización de consultas | Optimización de consultas | Definición | U3 · Proceso de optimización y árboles de consulta (`optimizacion-proceso`) | 5 preg. |
| Guía #11 · Optimización de consultas | Proceso de optimización | Análisis, reescritura, generación de planes, evaluación del costo, selección | U3 · Proceso de optimización y árboles de consulta (`optimizacion-proceso`) | 5 preg. |
| Guía #11 · Optimización de consultas | Tipos de optimización | Heurística y basada en costos | U3 · Proceso de optimización y árboles de consulta (`optimizacion-proceso`) | 5 preg. |
| Guía #11 · Optimización de consultas | Ejemplo de procesado de consulta | Vinos/Cosechas: 3 opciones en álgebra relacional | U3 · Proceso de optimización y árboles de consulta (`optimizacion-proceso`) | 5 preg. |
| Guía #11 · Optimización de consultas | Estrategias comunes | Índices, evitar funciones en columnas indexadas, evitar SELECT *, EXISTS/JOIN, filtrado temprano, JOIN eficiente, evitar cláusulas innecesarias | U3 · Estrategias, estadísticas y plan de ejecución (`optimizacion-practica`) | 7 preg. · 8 lab. |
| Guía #11 · Optimización de consultas | Ejemplo práctico | YEAR(FechaContratacion) vs BETWEEN | U3 · Estrategias, estadísticas y plan de ejecución (`optimizacion-practica`) | 7 preg. · 8 lab. |
| Guía #11 · Optimización de consultas | Comandos útiles | SET STATISTICS IO/TIME ON, DBCC SHOW_STATISTICS, UPDATE STATISTICS | U3 · Estrategias, estadísticas y plan de ejecución (`optimizacion-practica`) | 7 preg. · 8 lab. |
| Guía #11 · Optimización de consultas | Plan de ejecución | Ctrl + M; Index Scan, Index Seek, Nested Loop, Hash Join | U3 · Estrategias, estadísticas y plan de ejecución (`optimizacion-practica`) | 7 preg. · 8 lab. |
| Guía #11 · Optimización de consultas | Ejercicio práctico | BD_TallerOptimizacion: consulta no optimizada, optimizada, índice idx_fecha, estadísticas, subconsulta vs JOIN | U3 · Estrategias, estadísticas y plan de ejecución (`optimizacion-practica`) | 7 preg. · 8 lab. |
| Guía #12 · Bases de datos distribuidas | Base de Datos Distribuida | Definición | U4 · Bases de datos distribuidas: diseño (`bdd-conceptos`) | 8 preg. |
| Guía #12 · Bases de datos distribuidas | Objetivos | Transparencia (localización, replicación, fragmentación, concurrencia, fallos), escalabilidad, disponibilidad | U4 · Bases de datos distribuidas: diseño (`bdd-conceptos`) | 8 preg. |
| Guía #12 · Bases de datos distribuidas | Arquitectura | Sistemas homogéneos y heterogéneos | U4 · Bases de datos distribuidas: diseño (`bdd-conceptos`) | 8 preg. |
| Guía #12 · Bases de datos distribuidas | Fragmentación | Horizontal, vertical, mixta; ejemplo estudiantes EUI/EUIT | U4 · Bases de datos distribuidas: diseño (`bdd-conceptos`) | 8 preg. |
| Guía #12 · Bases de datos distribuidas | Replicación | Total, parcial, sin replicación | U4 · Bases de datos distribuidas: diseño (`bdd-conceptos`) | 8 preg. |
| Guía #12 · Bases de datos distribuidas | Control de concurrencia distribuido | 2PL y multiversión | U4 · Bases de datos distribuidas: diseño (`bdd-conceptos`) | 8 preg. |
| Guía #12 · Bases de datos distribuidas | Manejo de transacciones | Two-Phase Commit (2PC) | U4 · Bases de datos distribuidas: diseño (`bdd-conceptos`) | 8 preg. |
| Guía #12 · Bases de datos distribuidas | Recuperación ante fallos | Tipos de fallos y técnicas | U4 · Bases de datos distribuidas: diseño (`bdd-conceptos`) | 8 preg. |
| Guía #12 · Bases de datos distribuidas | Ventajas y desventajas | Listas | U4 · Bases de datos distribuidas: diseño (`bdd-conceptos`) | 8 preg. |
| Guía #12 · Bases de datos distribuidas | BD distribuida en SQL Server Express | Requisitos previos | U4 · Conexiones remotas y servidores vinculados (`servidores-vinculados`) | 6 preg. |
| Guía #12 · Bases de datos distribuidas | Pasos | Crear BD locales, sp_addlinkedserver, sp_addlinkedsrvlogin | U4 · Conexiones remotas y servidores vinculados (`servidores-vinculados`) | 6 preg. |
| Guía #12 · Bases de datos distribuidas | Consultas distribuidas | SELECT/INSERT con nombre de 4 partes; JOIN local-remoto | U4 · Conexiones remotas y servidores vinculados (`servidores-vinculados`) | 6 preg. |
| Guía #12 · Bases de datos distribuidas | Ejercicio práctico | Laboratorio lab4 con tres servidores | U4 · Conexiones remotas y servidores vinculados (`servidores-vinculados`) | 6 preg. |
| Guía #13 · MongoDB | MongoDB | Definición y características clave (esquema flexible, escalabilidad horizontal, consultas, alta disponibilidad, índices, _id, Compass) | U5 · MongoDB: características y comparación con SQL Server (`mongo-conceptos`) | 6 preg. |
| Guía #13 · MongoDB | Comparación MongoDB vs SQL Server | Tabla de 14 características | U5 · MongoDB: características y comparación con SQL Server (`mongo-conceptos`) | 6 preg. |
| Guía #13 · MongoDB | MQL | Definición y equivalencia con SELECT/INSERT/UPDATE/DELETE | U5 · MongoDB: características y comparación con SQL Server (`mongo-conceptos`) | 6 preg. |
| Guía #13 · MongoDB | Crear base de datos | use ucr_db | U5 · MQL: insertar, consultar, actualizar y eliminar (`mongo-crud`) | 8 preg. · 27 lab. |
| Guía #13 · MongoDB | Insertar documentos | insertOne, insertMany | U5 · MQL: insertar, consultar, actualizar y eliminar (`mongo-crud`) | 8 preg. · 27 lab. |
| Guía #13 · MongoDB | Consultas (find) | Todos, igualdad, comparaciones $gt $lt $gte $lte $ne | U5 · MQL: insertar, consultar, actualizar y eliminar (`mongo-crud`) | 8 preg. · 27 lab. |
| Guía #13 · MongoDB | Operadores lógicos | AND implícito, $or explícito | U5 · MQL: insertar, consultar, actualizar y eliminar (`mongo-crud`) | 8 preg. · 27 lab. |
| Guía #13 · MongoDB | Actualizar | updateOne con $set | U5 · MQL: insertar, consultar, actualizar y eliminar (`mongo-crud`) | 8 preg. · 27 lab. |
| Guía #13 · MongoDB | Eliminar | deleteOne, deleteMany | U5 · MQL: insertar, consultar, actualizar y eliminar (`mongo-crud`) | 8 preg. · 27 lab. |
| Guía #13 · MongoDB | Archivo de ejercicios de MQL | Colección cursos y ejercicios 1-5 y 9-17 | U5 · MQL: insertar, consultar, actualizar y eliminar (`mongo-crud`) | 8 preg. · 27 lab. |

**Práctica generada (Practicar y Simulacro de examen):** escenarios de concurrencia (G8, G9), grafo de precedencia y recuperabilidad (G9), marcas de tiempo (G9), cadena de restauración (G10), recuperación con el log (G8, G10) y árboles de consulta (G11).
