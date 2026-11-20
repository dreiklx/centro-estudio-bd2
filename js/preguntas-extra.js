/* =====================================================================
   BANCO ADICIONAL DE PREGUNTAS (solo Practicar y Simulacro)
   Escenarios distintos a los ejemplos de las guías, sobre lo que se
   enseña en Estudiar (Guías #8 a #13). Se agregan al final de cada tema.
   Formato igual a datos-preguntas.js: en 'mc', o[0] es la correcta.
   ===================================================================== */
(function () {
  var X = {};
  function Q(t, l) { X[t] = l; }

  Q('transacciones', [
    { t: 'mc', d: 1, q: 'Un retiro descuenta el saldo pero falla antes de registrar el movimiento, y el sistema deja ambas cosas sin efecto. ¿Qué propiedad se cumplió?', o: ['Atomicidad', 'Durabilidad', 'Aislamiento', 'Consistencia'], e: 'Atomicidad: o se hacen todas las operaciones de la transacción o ninguna.' },
    { t: 'mc', d: 1, q: 'Se confirma una venta y segundos después se va la luz. Al reiniciar, la venta sigue registrada. ¿Qué propiedad lo garantiza?', o: ['Durabilidad', 'Atomicidad', 'Aislamiento', 'Consistencia'], e: 'Durabilidad: lo confirmado permanece aunque haya fallos (gracias al log).' },
    { t: 'mc', d: 1, q: 'Dos cajeros trabajan al mismo tiempo y ninguno ve los cambios a medio hacer del otro. ¿Qué propiedad describe esto?', o: ['Aislamiento', 'Atomicidad', 'Durabilidad', 'Consistencia'], e: 'Aislamiento: las transacciones no interfieren entre sí.' },
    { t: 'mc', d: 2, q: 'Una transacción terminaría dejando Disponibles = −1, lo que viola un CHECK, y se rechaza. ¿Qué propiedad protege el motor?', o: ['Consistencia', 'Durabilidad', 'Aislamiento', 'Atomicidad'], e: 'Consistencia: la base pasa de un estado válido a otro válido.' },
    { t: 'mc', d: 1, q: '¿Qué instrucción guarda de forma definitiva los cambios de la transacción?', o: ['COMMIT', 'ROLLBACK', 'SAVE TRANSACTION', 'BEGIN TRANSACTION'], e: 'COMMIT confirma; ROLLBACK revierte; SAVE TRANSACTION crea un punto intermedio.' },
    { t: 'mc', d: 2, q: 'BEGIN TRAN; UPDATE A; SAVE TRANSACTION p1; UPDATE B; ROLLBACK TRANSACTION p1; COMMIT. ¿Qué cambios quedan?', o: ['Solo el de A', 'Solo el de B', 'Los de A y B', 'Ninguno'], e: 'El ROLLBACK al savepoint p1 deshace lo posterior (B); el COMMIT confirma A.' },
    { t: 'vf', d: 2, q: 'ROLLBACK TRANSACTION a un savepoint termina la transacción completa.', a: false, e: 'Solo revierte hasta el savepoint; luego hay que hacer COMMIT o ROLLBACK.' },
    { t: 'vf', d: 1, q: 'Si @@TRANCOUNT vale 0, no hay transacciones abiertas en la sesión.', a: true, e: '@@TRANCOUNT cuenta las transacciones abiertas.' },
    { t: 'mc', d: 2, q: 'En el patrón TRY…CATCH de la Guía #8, ¿dónde va el ROLLBACK?', o: ['Dentro del bloque BEGIN CATCH', 'Dentro del TRY, antes del COMMIT', 'Después de END CATCH, siempre', 'Antes de BEGIN TRANSACTION'], e: 'Si algo falla en el TRY, el control pasa al CATCH, que revierte.' },
    { t: 'mc', d: 2, q: 'Según WAL, ¿cuándo se registran los cambios en el log?', o: ['Antes de aplicarlos físicamente', 'Solo después del COMMIT', 'Solo cuando ocurre un error', 'Una vez al día con el respaldo'], e: 'Write-Ahead Logging: primero el log, luego los datos.' },
    { t: 'vf', d: 1, q: 'El log de transacciones contribuye a garantizar la durabilidad.', a: true, e: 'Permite rehacer lo confirmado tras una falla.' },
    { t: 'mc', d: 2, q: '¿Qué muestra DBCC LOG(ejemplo, 0)?', o: ['Detalles mínimos del log', 'Todos los detalles del log', 'Las estadísticas de un índice', 'El modelo de recuperación'], e: '::fn_dblog(NULL, NULL) muestra todos los detalles; DBCC LOG(…, 0), los mínimos.' },
    { t: 'mc', d: 3, q: 'Una transferencia ejecuta dos UPDATE sin BEGIN TRANSACTION; el segundo falla. ¿Qué ocurre?', o: ['El primer UPDATE queda aplicado', 'Ninguno de los dos se aplica', 'Los dos se aplican igualmente', 'El motor deshace el primero solo'], e: 'Sin transacción explícita cada instrucción se confirma sola: se pierde la atomicidad.' },
    { t: 'vf', d: 1, q: 'Una transacción puede agrupar instrucciones INSERT, UPDATE y DELETE.', a: true, e: 'Es una unidad lógica de una o más operaciones.' }
  ]);

  Q('aislamiento', [
    { t: 'mc', d: 2, q: 'Un reporte debe leer dos veces el mismo saldo y obtener igual valor, pero no le importan filas nuevas. ¿Nivel mínimo?', o: ['REPEATABLE READ', 'READ COMMITTED', 'SERIALIZABLE', 'READ UNCOMMITTED'], e: 'REPEATABLE READ evita la lectura no repetible; la fantasma no le importa.' },
    { t: 'mc', d: 2, q: 'Entre dos consultas iguales de la misma transacción no deben aparecer filas nuevas. ¿Qué nivel se necesita?', o: ['SERIALIZABLE', 'REPEATABLE READ', 'READ COMMITTED', 'READ UNCOMMITTED'], e: 'Solo SERIALIZABLE evita la lectura fantasma.' },
    { t: 'mc', d: 1, q: 'Un tablero de monitoreo acepta leer datos sin confirmar a cambio de no esperar bloqueos. ¿Qué nivel usaría?', o: ['READ UNCOMMITTED', 'READ COMMITTED', 'REPEATABLE READ', 'SERIALIZABLE'], e: 'READ UNCOMMITTED permite lecturas sucias.' },
    { t: 'mc', d: 1, q: '¿Qué anomalía evita READ COMMITTED?', o: ['La lectura sucia', 'La lectura no repetible', 'La lectura fantasma', 'Las tres anomalías'], e: 'Solo lee datos confirmados; sigue permitiendo no repetible y fantasma.' },
    { t: 'mc', d: 2, q: 'T1 cuenta 3 pedidos del cliente 8; T2 inserta un pedido de ese cliente y confirma; T1 vuelve a contar y obtiene 4. ¿Qué anomalía es?', o: ['Lectura fantasma', 'Lectura sucia', 'Lectura no repetible', 'Actualización perdida'], e: 'Cambió el conjunto de filas que cumple la condición.' },
    { t: 'mc', d: 2, q: 'T1 lee el precio 500; T2 lo cambia a 550 y confirma; T1 vuelve a leer 550 en la misma transacción. ¿Qué anomalía es?', o: ['Lectura no repetible', 'Lectura fantasma', 'Lectura sucia', 'Actualización perdida'], e: 'La misma fila leída dos veces cambió de valor (ambos confirmados).' },
    { t: 'mc', d: 2, q: 'T2 lee stock = 3, escrito por T1 sin confirmar; luego T1 revierte y el stock vuelve a 7. ¿Qué anomalía sufrió T2?', o: ['Lectura sucia', 'Lectura no repetible', 'Lectura fantasma', 'Actualización perdida'], e: 'Leyó un valor que nunca llegó a confirmarse.' },
    { t: 'mc', d: 2, q: 'Stock = 20. A y B leen 20; A vende 5 y guarda 15; B vende 4 y guarda 16. ¿Qué anomalía ocurrió?', o: ['Actualización perdida', 'Lectura fantasma', 'Lectura sucia', 'Lectura no repetible'], e: 'B sobrescribió la venta de A; lo correcto era 11.' },
    { t: 'vf', d: 1, q: 'SERIALIZABLE evita la lectura sucia, la no repetible y la fantasma.', a: true, e: 'Es el nivel más estricto.' },
    { t: 'vf', d: 1, q: 'READ UNCOMMITTED es el nivel de aislamiento por defecto de SQL Server.', a: false, e: 'El nivel por defecto es READ COMMITTED.' },
    { t: 'mc', d: 2, q: '¿Qué hay que ejecutar en la base antes de poder usar el nivel SNAPSHOT?', o: ['ALTER DATABASE … SET ALLOW_SNAPSHOT_ISOLATION ON', 'SET LOCK_TIMEOUT -1 en cada sesión', 'SET TRANSACTION ISOLATION LEVEL SERIALIZABLE', 'DBCC LOG con el nombre de la base'], e: 'Así se habilita el aislamiento por instantánea (Guía #9).' },
    { t: 'mc', d: 3, q: 'En SNAPSHOT, ¿qué versión de los datos lee una transacción?', o: ['La confirmada al inicio de la transacción', 'La última escrita, aunque no esté confirmada', 'La que tenía la tabla cuando se creó', 'La que dejó el último respaldo FULL'], e: 'Lee una instantánea; tras su COMMIT, una consulta nueva ve el valor actual.' },
    { t: 'mc', d: 3, q: 'A tiene un cambio sin confirmar. B, en READ COMMITTED con WITH (READCOMMITTEDLOCK), consulta la fila. ¿Qué pasa?', o: ['B espera a que A confirme o revierta', 'B lee el valor sin confirmar', 'B recibe de inmediato el error 1205', 'B lee la versión de la instantánea'], e: 'Con lectura basada en bloqueos, B no puede leer el dato bloqueado por A.' },
    { t: 'vf', d: 2, q: 'Una lectura no repetible implica haber leído datos sin confirmar.', a: false, e: 'Ambas lecturas son de datos confirmados; lo que cambia es el valor entre ellas.' }
  ]);

  Q('planificacion', [
    { t: 'mc', d: 1, q: '¿Cuál par de operaciones está en conflicto?', o: ['e2(Y) y l3(Y)', 'l1(X) y l3(X)', 'e1(X) y e1(Y)', 'l2(Z) y e3(X)'], e: 'Distintas transacciones, mismo dato y al menos una escritura.' },
    { t: 'mc', d: 1, q: 'En la secuencia l2(X); e1(X), ¿qué arista se agrega al grafo?', o: ['T2 → T1', 'T1 → T2', 'Ninguna arista', 'T1 → T1'], e: 'La operación de T2 va primero y está en conflicto con la escritura de T1.' },
    { t: 'mc', d: 1, q: 'Si e3(Z) ocurre antes que l1(Z), ¿qué arista se agrega?', o: ['T3 → T1', 'T1 → T3', 'Ninguna arista', 'T3 → T3'], e: 'Escritura–lectura sobre el mismo dato: la flecha va de la primera a la segunda.' },
    { t: 'mc', d: 3, q: 'Plan: e1(X); l2(X); e2(Y); l1(Y). ¿Es serializable por conflictos?', o: ['No: T1 → T2 por X y T2 → T1 por Y forman un ciclo', 'Sí, con orden serie T1, T2', 'Sí, con orden serie T2, T1', 'Sí: no hay operaciones en conflicto entre ellas'], e: 'Las dos aristas en sentidos opuestos crean un ciclo.' },
    { t: 'mc', d: 2, q: 'Plan: l1(X); l2(Y); e1(X); e2(Y). ¿Qué concluye?', o: ['Es serializable: no hay conflictos entre T1 y T2', 'No es serializable: hay un ciclo', 'Solo es serializable si se ejecuta en el orden T2, T1', 'No se puede analizar sin los COMMIT'], e: 'Cada transacción usa un dato distinto: el grafo no tiene aristas.' },
    { t: 'mc', d: 2, q: 'El grafo tiene las aristas T2 → T1 y T1 → T3, sin ciclos. ¿Cuál es el orden serie equivalente?', o: ['T2, T1, T3', 'T1, T2, T3', 'T3, T1, T2', 'T1, T3, T2'], e: 'Ordenación topológica: cada flecha indica quién va antes.' },
    { t: 'vf', d: 1, q: 'Una planificación serie siempre es serializable.', a: true, e: 'Es equivalente a sí misma, que es un plan serie.' },
    { t: 'vf', d: 1, q: 'Dos escrituras de transacciones distintas sobre datos diferentes están en conflicto.', a: false, e: 'El conflicto exige el mismo dato.' },
    { t: 'mc', d: 2, q: 'Sobre una planificación no serie, ¿qué se puede afirmar sin analizarla?', o: ['Puede o no ser serializable', 'Nunca es serializable', 'Siempre es serializable', 'Siempre es recuperable'], e: 'La guía indica que intercalar no basta para decidir.' },
    { t: 'mc', d: 2, q: '¿Qué es una escritura ciega?', o: ['Escribir un dato sin haberlo leído antes en esa transacción', 'Escribir un dato que otra transacción tiene bloqueado con X', 'Escribir sin haber hecho BEGIN TRANSACTION', 'Escribir un dato y revertirlo con ROLLBACK'], e: 'Es donde difieren la serializabilidad por conflictos y por vistas.' },
    { t: 'mc', d: 2, q: 'En la equivalencia de vistas, ¿qué exige la condición de “escritura final”?', o: ['Que la misma transacción haga la última escritura de cada dato', 'Que todas las transacciones terminen con COMMIT', 'Que la última operación de todo el plan sea una escritura', 'Que ninguna transacción escriba dos veces'], e: 'Así el valor final de cada dato lo determina la misma transacción.' },
    { t: 'vf', d: 2, q: 'Dos planes equivalentes por conflictos conservan el orden de cada par de operaciones en conflicto.', a: true, e: 'Es la definición de la Guía #9.' },
    { t: 'mc', d: 3, q: 'Plan: l1(A); e2(A); e1(A). ¿Qué aristas hay?', o: ['T1 → T2 y T2 → T1: hay un ciclo', 'Solo T1 → T2', 'Solo T2 → T1', 'Ninguna arista: no hay conflictos'], e: 'l1(A) antes de e2(A) da T1 → T2; e2(A) antes de e1(A) da T2 → T1.' },
    { t: 'mc', d: 1, q: '¿Cuántos nodos tiene el grafo de precedencia de un plan con T1, T2, T3 y T4?', o: ['4', '3', '6', '8'], e: 'Un nodo por transacción.' }
  ]);

  Q('recuperabilidad', [
    { t: 'mc', d: 2, q: 'e2(Y); l1(Y); c2; c1. ¿Qué propiedad cumple?', o: ['Recuperable, pero no sin cascada', 'Estricta', 'No recuperable', 'Sin cascada, pero no recuperable'], e: 'T1 confirma después de T2, pero leyó Y antes del COMMIT de T2.' },
    { t: 'mc', d: 2, q: 'e2(Y); l1(Y); c1; c2. ¿Es recuperable?', o: ['No: T1 confirma antes que T2', 'Sí: ambas confirman', 'Sí: es estricta', 'Sí, siempre que T2 no aborte'], e: 'Quien lee debe confirmar después de quien escribió.' },
    { t: 'mc', d: 1, q: 'e1(X); c1; l2(X); c2. ¿Qué tipo de planificación es?', o: ['Estricta', 'No recuperable', 'Con aborto en cascada', 'Con lectura sucia'], e: 'T2 lee X después del COMMIT de T1.' },
    { t: 'mc', d: 3, q: 'e1(X); e2(X); c1; c2. ¿Qué propiedades cumple?', o: ['Recuperable y sin cascada, pero no estricta', 'Estricta, sin cascada y además recuperable', 'No recuperable', 'Ninguna de las tres'], e: 'T2 sobrescribe X mientras T1 sigue activa: no es estricta; nadie lee datos sucios.' },
    { t: 'vf', d: 1, q: 'Una planificación sin abortos en cascada impide las lecturas sucias.', a: true, e: 'Solo se leen datos ya confirmados.' },
    { t: 'vf', d: 2, q: 'Si T3 lee de T2 y T2 lee de T1, el aborto de T1 puede obligar a abortar a T2 y a T3.', a: true, e: 'Es un aborto en cascada.' },
    { t: 'mc', d: 2, q: 'e1(X); l2(X); l3(X); r1. ¿Quiénes deben abortar además de T1?', o: ['T2 y T3', 'Solo T2', 'Solo T3', 'Ninguna'], e: 'Ambas leyeron X escrito por T1 sin confirmar.' },
    { t: 'mc', d: 2, q: 'e1(X); l2(Y); r1. ¿Quién más debe abortar?', o: ['Ninguna: T2 no leyó datos de T1', 'T2, porque comparte el plan', 'T2, porque leyó antes del r1', 'Todas las transacciones activas'], e: 'Solo depende quien lee lo escrito por la transacción abortada.' },
    { t: 'mc', d: 1, q: '¿Qué propiedad garantiza que nunca se confirme algo que dependía de un cambio revertido?', o: ['Recuperabilidad', 'Serializabilidad', 'Aislamiento', 'Durabilidad'], e: 'Tj solo confirma después de que Ti confirme.' },
    { t: 'mc', d: 1, q: '¿Cuál de estas propiedades es la más restrictiva?', o: ['Estricta', 'Recuperable', 'Sin abortos en cascada', 'Serie no estricta'], e: 'Estricta ⇒ sin cascada ⇒ recuperable.' },
    { t: 'vf', d: 2, q: 'Toda planificación sin abortos en cascada es estricta.', a: false, e: 'Las implicaciones inversas no se cumplen.' },
    { t: 'mc', d: 2, q: 'e1(X); l2(X); c2; c1. ¿Qué tipo de planificación es?', o: ['No recuperable', 'Recuperable', 'Estricta', 'Sin abortos en cascada'], e: 'T2 confirmó antes que T1, de quien leyó.' }
  ]);

  Q('bloqueos', [
    { t: 'mc', d: 1, q: 'T1 tiene un bloqueo S sobre una fila y T2 pide X sobre la misma fila. ¿Qué ocurre?', o: ['T2 espera', 'Se concede de inmediato', 'T1 se aborta', 'Se convierte en S'], e: 'X es incompatible con S.' },
    { t: 'mc', d: 1, q: 'T1 tiene X sobre un recurso y T2 pide X sobre el mismo. ¿Qué ocurre?', o: ['T2 espera', 'Se concede', 'Ambas escriben a la vez', 'T1 libera X'], e: 'X es incompatible con X.' },
    { t: 'mc', d: 2, q: 'En la fase de crecimiento del B2F, una transacción puede…', o: ['Adquirir bloqueos y convertirlos a modos más fuertes', 'Liberar bloqueos y luego adquirir otros nuevos', 'Liberar todos sus bloqueos', 'Reducir el modo de sus bloqueos'], e: 'En crecimiento no se libera nada.' },
    { t: 'mc', d: 2, q: 'Una transacción libera un bloqueo y después solicita uno nuevo. ¿Qué ocurre según B2F?', o: ['Viola el protocolo de dos fases', 'Sigue en fase de crecimiento', 'Es correcto si usa bloqueos S', 'Es correcto si confirma al final'], e: 'Tras liberar ya está en contracción: no puede adquirir.' },
    { t: 'mc', d: 1, q: '¿Qué indica el error 1222 en SQL Server?', o: ['Se agotó el tiempo de espera por un bloqueo', 'La sesión fue víctima de un interbloqueo', 'Se violó una restricción CHECK', 'No existe la tabla consultada'], e: 'Ocurre al superar LOCK_TIMEOUT.' },
    { t: 'mc', d: 1, q: '¿Qué indica el error 1205?', o: ['La transacción fue elegida víctima de un interbloqueo', 'Se agotó el LOCK_TIMEOUT', 'Falta un índice en la tabla', 'La base de datos está configurada en modo SNAPSHOT'], e: 'SQL Server detecta el ciclo y elige una víctima.' },
    { t: 'mc', d: 1, q: '¿Qué significa SET LOCK_TIMEOUT -1?', o: ['Esperar sin límite', 'No esperar nunca', 'Esperar 1 segundo', 'Desactivar los bloqueos'], e: '-1 indica que no se impone límite.' },
    { t: 'mc', d: 1, q: '¿Cuánto espera una instrucción con SET LOCK_TIMEOUT 5000?', o: ['5 segundos', '5000 segundos', '5 minutos', '0,5 segundos'], e: 'El valor está en milisegundos.' },
    { t: 'vf', d: 2, q: 'Si todas las transacciones siguen el bloqueo en dos fases, el plan es serializable por conflictos.', a: true, e: 'Así lo indica la Guía #9.' },
    { t: 'mc', d: 2, q: 'Tras el UPDATE condicionado de la actividad 6, ¿qué informa @@ROWCOUNT?', o: ['Cuántas filas modificó: 1 si reservó y 0 si no', 'Cuántas transacciones hay abiertas en la sesión', 'El número de la sesión actual', 'El saldo que quedó disponible'], e: 'Permite avisar al usuario si el préstamo se reservó.' },
    { t: 'vf', d: 2, q: 'Una lectura basada en versiones puede consultar una versión confirmada anterior sin pedir un bloqueo S.', a: true, e: 'Por eso no espera al bloqueo X de otra transacción.' },
    { t: 'mc', d: 3, q: 'Disponibles = 2. Tres sesiones ejecutan UPDATE … SET Disponibles = Disponibles − 1 WHERE LibroID = 1 AND Disponibles >= 1. ¿Cuántas reservas tienen éxito?', o: ['2', '3', '1', '0'], e: 'La tercera no encuentra filas porque Disponibles ya es 0.' },
    { t: 'mc', d: 2, q: '¿Qué recursos puede bloquear SQL Server según la guía?', o: ['Claves, filas, páginas y tablas', 'Solo filas individuales', 'Solo tablas completas', 'Solo bases de datos completas'], e: 'La granularidad depende del plan y la configuración.' },
    { t: 'vf', d: 1, q: 'Que B espere hasta que A haga COMMIT es un interbloqueo.', a: false, e: 'No hay espera circular: es una espera normal.' }
  ]);

  Q('marcas-tiempo', [
    { t: 'mc', d: 2, q: 'TS(T1) = 3 y TS(T2) = 7. T2 lee X (R_TS(X) = 7). Luego T1 intenta escribir X. ¿Qué ocurre?', o: ['T1 se aborta', 'Se permite y W_TS(X) = 3', 'Se permite y W_TS(X) = 7', 'T1 espera a T2'], e: 'TS(T1) = 3 < R_TS(X) = 7: una de marca mayor ya leyó X.' },
    { t: 'mc', d: 2, q: 'TS(T) = 12 y W_TS(X) = 9. T lee X. ¿Qué ocurre?', o: ['Se permite y R_TS(X) = max(R_TS(X), 12)', 'T se aborta', 'Se permite y W_TS(X) = 12', 'T queda en espera hasta que la otra confirme'], e: '12 no es menor que 9: la lectura es válida.' },
    { t: 'mc', d: 1, q: 'TS(T) = 4 y W_TS(X) = 6. T intenta leer X. ¿Qué ocurre?', o: ['T se aborta', 'Se permite la lectura', 'R_TS(X) pasa a 4', 'W_TS(X) pasa a 4'], e: '4 < 6: X ya fue escrito por una transacción de marca mayor.' },
    { t: 'mc', d: 2, q: 'TS(T) = 15, R_TS(X) = 10 y W_TS(X) = 12. T escribe X. ¿Resultado?', o: ['Se permite y W_TS(X) = 15', 'T se aborta por R_TS', 'T se aborta por W_TS', 'Se permite y R_TS(X) = 15'], e: '15 no es menor que 10 ni que 12.' },
    { t: 'mc', d: 3, q: 'R_TS(X) = 8 y W_TS(X) = 2. Una transacción con TS = 5 lee X. ¿Cómo queda R_TS(X)?', o: ['Sigue en 8', 'Pasa a 5', 'Pasa a 2', 'La transacción se aborta'], e: 'Se permite (5 ≥ 2) y R_TS = max(8, 5) = 8.' },
    { t: 'vf', d: 1, q: 'Una lectura permitida nunca modifica W_TS(X).', a: true, e: 'Las lecturas actualizan R_TS; las escrituras, W_TS.' },
    { t: 'vf', d: 2, q: 'En el protocolo básico, la transacción con la marca menor nunca se aborta.', a: false, e: 'Precisamente se aborta la que llega tarde respecto de una de marca mayor.' },
    { t: 'mc', d: 1, q: '¿Cuándo recibe una transacción su marca TS?', o: ['Al iniciarse', 'Al hacer COMMIT', 'Al leer su primer dato', 'Al abortar'], e: 'TS(T) se asigna al iniciar la transacción.' },
    { t: 'mc', d: 1, q: '¿Qué guarda W_TS(X)?', o: ['La mayor marca de una transacción que escribió X', 'La menor marca que leyó X', 'La cantidad total de escrituras hechas sobre X', 'La hora del último COMMIT'], e: 'R_TS guarda la mayor marca que leyó X.' },
    { t: 'mc', d: 3, q: 'TS(T) = 10, R_TS(X) = 10 y W_TS(X) = 10. T escribe X. ¿Qué ocurre?', o: ['Se permite: 10 no es menor que 10', 'T se aborta por R_TS', 'T se aborta por W_TS', 'T espera a la otra transacción'], e: 'Las reglas abortan solo si TS(T) es estrictamente menor.' }
  ]);

  Q('fallas-respaldo', [
    { t: 'mc', d: 1, q: 'Una transacción intenta insertar un precio negativo, viola un CHECK y aborta. ¿Qué tipo de falla es?', o: ['Falla de transacción', 'Falla del sistema', 'Falla del disco', 'Falla de red'], e: 'Errores lógicos o violaciones de restricciones.' },
    { t: 'mc', d: 1, q: 'Se daña físicamente el disco donde están los archivos de la base. ¿Qué tipo de falla es?', o: ['Falla del disco', 'Falla del sistema', 'Falla de transacción', 'Falla lógica'], e: 'Pérdida de datos por errores del almacenamiento físico.' },
    { t: 'mc', d: 1, q: 'Un corte eléctrico reinicia el servidor sin dañar el disco. ¿Qué tipo de falla es?', o: ['Falla del sistema', 'Falla del disco', 'Falla de transacción', 'Falla de respaldo'], e: 'Caída del servidor o reinicio inesperado.' },
    { t: 'mc', d: 1, q: '¿Cuál de los tres tipos de respaldo suele ser el más pequeño?', o: ['LOG', 'FULL', 'DIFFERENTIAL', 'Todos ocupan igual'], e: 'Solo contiene los cambios desde el último respaldo de log.' },
    { t: 'mc', d: 1, q: '¿Qué tipo de respaldo no requiere ningún respaldo previo?', o: ['FULL', 'DIFFERENTIAL', 'LOG', 'Ninguno'], e: 'DIFFERENTIAL y LOG parten de un FULL.' },
    { t: 'mc', d: 2, q: 'Tras una caída, el log muestra a T1 con COMMIT y a T2 sin COMMIT. ¿Qué hace la recuperación?', o: ['Rehace T1 y deshace T2', 'Deshace T1 y rehace T2', 'Rehace ambas', 'Deshace ambas'], e: 'Durabilidad para lo confirmado; atomicidad para lo que no.' },
    { t: 'mc', d: 2, q: 'Inicio A = 50. Log: <T1, A, 50 → 70>, <T1 COMMIT>, <T2, A, 70 → 90>, caída. ¿Valor final de A?', o: ['70', '90', '50', '110'], e: 'Se rehace T1 (70) y se deshace T2, que vuelve a 70.' },
    { t: 'mc', d: 2, q: 'Inicio B = 10. Log: <T3, B, 10 → 25>, caída. ¿Valor final de B?', o: ['10', '25', '0', '35'], e: 'T3 no tiene COMMIT: se deshace con el valor anterior.' },
    { t: 'vf', d: 1, q: 'Para deshacer una transacción se usa el valor anterior registrado en el log.', a: true, e: 'El log guarda valor anterior y valor nuevo.' },
    { t: 'vf', d: 1, q: 'Tras una caída, una transacción con COMMIT en el log se deshace.', a: false, e: 'Se rehace: lo confirmado debe permanecer.' },
    { t: 'mc', d: 2, q: '¿Qué modelos de recuperación permiten respaldar el log?', o: ['FULL o BULK_LOGGED', 'Solo SIMPLE', 'SIMPLE o FULL', 'Cualquier modelo'], e: 'Requisito de la Guía #10.' },
    { t: 'mc', d: 1, q: '¿Qué cambia ALTER DATABASE Ventas SET RECOVERY FULL?', o: ['El modelo de recuperación de Ventas', 'El tipo del próximo respaldo que se haga', 'La ruta de los archivos .bak', 'El nivel de aislamiento'], e: 'Se consulta en sys.databases.recovery_model_desc.' }
  ]);

  Q('backup-restore', [
    { t: 'mc', d: 2, q: 'FULL el domingo y DIFFERENTIAL el lunes y el martes, sin respaldos de log. Falla el miércoles a las 10:00. ¿Qué se restaura?', o: ['FULL del domingo + DIFF del martes', 'FULL + DIFF del lunes + DIFF del martes', 'Solo el DIFF del martes', 'Solo el FULL del domingo'], e: 'El último diferencial ya contiene todo lo cambiado desde el FULL.' },
    { t: 'mc', d: 2, q: 'Hay un FULL el domingo y respaldos LOG cada 4 horas, sin diferenciales. ¿Qué se restaura tras una falla?', o: ['El FULL y todos los LOG en orden', 'El FULL y solo el último LOG', 'Solo el último LOG', 'Solo el FULL'], e: 'Cada LOG contiene los cambios desde el anterior: la cadena debe estar completa.' },
    { t: 'mc', d: 1, q: '¿Qué extensión usa la guía para el respaldo del log?', o: ['.trn', '.bak', '.ldf', '.mdf'], e: 'FULL y DIFF usan .bak en los ejemplos.' },
    { t: 'mc', d: 1, q: '¿Qué hace WITH RECOVERY al restaurar?', o: ['Deja la base operativa al terminar', 'Sobrescribe la base existente', 'Comprime el respaldo restaurado', 'Restaura solo el log de transacciones'], e: 'REPLACE es la opción que permite sobrescribir.' },
    { t: 'mc', d: 1, q: 'Al restaurar sobre una base que ya existe, ¿qué opción lo permite?', o: ['REPLACE', 'FORMAT', 'INIT', 'DIFFERENTIAL'], e: 'RESTORE … WITH RECOVERY, REPLACE.' },
    { t: 'vf', d: 2, q: 'Para restaurar con diferenciales hay que aplicar todos los diferenciales de la semana.', a: false, e: 'Basta el último diferencial posterior al FULL.' },
    { t: 'vf', d: 2, q: 'INIT sobrescribe los conjuntos de respaldo existentes y conserva el encabezado del medio.', a: true, e: 'FORMAT, en cambio, crea un nuevo conjunto de medios.' },
    { t: 'mc', d: 1, q: '¿Qué instrucción respalda solo los cambios desde el último FULL?', o: ['BACKUP DATABASE … WITH DIFFERENTIAL', 'BACKUP LOG … WITH INIT', 'BACKUP DATABASE … WITH FORMAT', 'RESTORE DATABASE … WITH RECOVERY'], e: 'El diferencial se mide desde el último FULL.' },
    { t: 'mc', d: 3, q: 'En una cadena FULL → LOG 06:00 → LOG 12:00 → LOG 18:00 se perdió el LOG de las 12:00. ¿Qué pasa con el de las 18:00?', o: ['No se puede aplicar: la cadena quedó incompleta', 'Se aplica igual sin problemas', 'Reemplaza al LOG que falta', 'Se convierte automáticamente en un respaldo FULL'], e: 'Los LOG se aplican en orden y sin huecos.' },
    { t: 'mc', d: 1, q: '¿Qué respaldo se restaura siempre primero?', o: ['El FULL', 'El último LOG', 'El último DIFFERENTIAL', 'Cualquiera de ellos'], e: 'Es la base de todas las restauraciones.' }
  ]);

  Q('optimizacion-proceso', [
    { t: 'mc', d: 1, q: '¿Qué paso transforma la consulta en otra equivalente pero más eficiente?', o: ['Reescritura', 'Análisis sintáctico', 'Evaluación del costo', 'Selección del plan'], e: 'Paso 2 del proceso de la Guía #11.' },
    { t: 'mc', d: 1, q: '¿En qué paso se estiman CPU, accesos a disco y memoria de cada plan?', o: ['Evaluación del costo', 'Reescritura', 'Análisis semántico', 'Generación de planes'], e: 'Luego se elige el de menor costo.' },
    { t: 'mc', d: 1, q: '¿Cuál es el primer paso del proceso de optimización?', o: ['Análisis sintáctico y semántico', 'Selección del plan óptimo', 'Evaluación del costo', 'Generación de planes'], e: 'Primero se verifica que la consulta sea válida.' },
    { t: 'mc', d: 2, q: 'Clientes tiene 300 tuplas y Pedidos 5 000. ¿Cuántas tuplas produce su producto cartesiano?', o: ['1 500 000', '5 300', '5 000', '300'], e: '300 × 5 000.' },
    { t: 'mc', d: 2, q: 'Cada uno de los 5 000 pedidos pertenece a un solo cliente. ¿Cuántas tuplas produce el join Clientes–Pedidos antes de filtrar?', o: ['5 000', '1 500 000', '300', '5 300'], e: 'Cada pedido se une con exactamente un cliente.' },
    { t: 'mc', d: 2, q: 'Solo 40 pedidos están pendientes. Si se selecciona primero y luego se une, ¿cuántas tuplas intermedias hay?', o: ['40', '5 000', '300', '1 500 000'], e: 'Filtrar antes reduce las filas que entran al join.' },
    { t: 'vf', d: 1, q: 'La optimización basada en costos aplica reglas fijas sin usar estadísticas.', a: false, e: 'Usa estadísticas; la heurística es la de reglas generales.' },
    { t: 'mc', d: 2, q: 'En el árbol de la consulta de vinos, ¿qué hace la operación project vnombre?', o: ['Deja solo la columna vnombre', 'Filtra las cosechas mayores a 100', 'Une Vinos con Cosechas', 'Ordena el resultado por nombre'], e: 'La proyección elige columnas; la selección elige filas.' },
    { t: 'vf', d: 1, q: 'El optimizador elige el plan con menor costo estimado.', a: true, e: 'Paso 5 del proceso.' },
    { t: 'mc', d: 2, q: 'Cardinalidad, selectividad y número de bloques son…', o: ['Estadísticas de la optimización basada en costos', 'Reglas generales de la optimización heurística', 'Tipos de índices de SQL Server', 'Operadores del plan de ejecución'], e: 'Sirven para estimar el costo de cada plan.' }
  ]);

  Q('optimizacion-practica', [
    { t: 'mc', d: 2, q: '¿Cómo se mejora WHERE MONTH(fecha) = 5 AND YEAR(fecha) = 2023?', o: ["WHERE fecha BETWEEN '2023-05-01' AND '2023-05-31'", "WHERE MONTH(fecha) BETWEEN 5 AND 5", "WHERE YEAR(fecha) = 2023 OR MONTH(fecha) = 5", "WHERE CAST(fecha AS DATE) = '2023-05'"], e: 'Sin funciones sobre la columna, el índice puede usarse.' },
    { t: 'mc', d: 1, q: '¿Qué diferencia a Index Seek de Index Scan?', o: ['Seek va directo a las filas; Scan recorre todo el índice', 'Seek recorre todo; Scan va directo a las filas', 'Seek solo existe en tablas sin índice', 'No hay diferencia en rendimiento'], e: 'Seek es lo deseable para filtros selectivos.' },
    { t: 'mc', d: 1, q: '¿Qué comando muestra el histograma de distribución de un índice?', o: ['DBCC SHOW_STATISTICS', 'SET STATISTICS IO ON', 'UPDATE STATISTICS', 'sp_helpindex'], e: "DBCC SHOW_STATISTICS('tabla', 'índice')." },
    { t: 'mc', d: 1, q: '¿Qué opción muestra el tiempo de CPU de cada consulta?', o: ['SET STATISTICS TIME ON', 'SET STATISTICS IO ON', 'DBCC SHOW_STATISTICS', 'SET LOCK_TIMEOUT 0'], e: 'IO muestra lecturas; TIME, CPU y tiempo total.' },
    { t: 'mc', d: 2, q: 'Según la Guía #11, una subconsulta correlacionada conviene reemplazarla por…', o: ['Un JOIN', 'Un DISTINCT', 'Un ORDER BY', 'Un UNION'], e: 'JOIN en lugar de subconsultas correlacionadas cuando sea posible.' },
    { t: 'vf', d: 1, q: 'Conviene tener índices en las columnas FOREIGN KEY y PRIMARY KEY usadas en los JOIN.', a: true, e: 'Estrategia 6 de la guía.' },
    { t: 'vf', d: 1, q: 'Agregar DISTINCT siempre mejora el rendimiento de una consulta.', a: false, e: 'La guía recomienda quitarlo si no es necesario.' },
    { t: 'mc', d: 1, q: '¿Qué significa “filtrado temprano”?', o: ['Aplicar el WHERE antes de JOIN o agregaciones', 'Ordenar los datos del disco antes de leerlos', 'Crear índices antes de la consulta', 'Usar TOP para cortar resultados'], e: 'Reduce filas lo antes posible.' },
    { t: 'mc', d: 2, q: '¿Cómo recomienda la guía ordenar las tablas en los JOIN?', o: ['Primero las que tienen menos registros', 'Primero las que tienen más registros', 'Alfabéticamente por nombre', 'El orden nunca influye'], e: 'Estrategia 6: uso eficiente de JOIN.' },
    { t: 'mc', d: 1, q: '¿Qué hace Ctrl + M en SSMS antes de ejecutar una consulta?', o: ['Incluye el plan de ejecución real', 'Actualiza las estadísticas', 'Crea un índice sugerido', 'Muestra las lecturas lógicas'], e: 'Luego se ve el gráfico del plan.' },
    { t: 'vf', d: 1, q: 'SELECT * puede leer columnas que la consulta no necesita.', a: true, e: 'Por eso se recomienda seleccionar solo lo necesario.' },
    { t: 'mc', d: 2, q: 'Tras muchos cambios en una tabla, el optimizador estima mal las filas. ¿Qué conviene ejecutar?', o: ['UPDATE STATISTICS sobre la tabla', 'SET STATISTICS TIME ON', 'DROP INDEX de todos los índices', 'SET LOCK_TIMEOUT -1'], e: 'Las estadísticas actualizadas mejoran la predicción.' }
  ]);

  Q('bdd-conceptos', [
    { t: 'mc', d: 1, q: 'Las sucursales de San José y Limón guardan cada una sus propias ventas, con las mismas columnas. ¿Qué fragmentación es?', o: ['Horizontal', 'Vertical', 'Mixta', 'Replicación total'], e: 'Se reparten filas según un criterio.' },
    { t: 'mc', d: 1, q: 'Un nodo guarda salario y cuenta bancaria de los empleados y otro guarda nombre y teléfono. ¿Qué fragmentación es?', o: ['Vertical', 'Horizontal', 'Mixta', 'Sin fragmentar'], e: 'Se reparten columnas.' },
    { t: 'mc', d: 1, q: 'Cada nodo tiene una copia completa de la base. ¿Qué tipo de replicación es?', o: ['Total', 'Parcial', 'Sin replicación', 'Horizontal'], e: 'Parcial: solo algunas partes se replican.' },
    { t: 'mc', d: 2, q: 'Un nodo cae y el sistema sigue respondiendo sin que el usuario lo note. ¿Qué transparencia se cumple?', o: ['De fallos', 'De localización', 'De fragmentación', 'De replicación'], e: 'El sistema continúa ante fallos parciales.' },
    { t: 'mc', d: 1, q: 'Un usuario consulta un dato sin saber en qué nodo está. ¿Qué transparencia es?', o: ['De localización', 'De concurrencia', 'De fallos', 'De replicación'], e: 'No necesita saber dónde están los datos.' },
    { t: 'mc', d: 1, q: '¿Cuál es la primera fase del 2PC?', o: ['Preparar', 'Confirmar', 'Deshacer', 'Bloquear'], e: 'Fase 1: preparar; fase 2: confirmar o deshacer.' },
    { t: 'mc', d: 1, q: 'Todos los nodos usan SQL Server sobre el mismo sistema operativo. ¿Qué tipo de BDD es?', o: ['Homogénea', 'Heterogénea', 'Centralizada', 'Replicada'], e: 'Heterogénea: SGBD o plataformas distintas.' },
    { t: 'vf', d: 2, q: 'En la fragmentación vertical cada fragmento conserva la clave para poder reconstruir la tabla.', a: true, e: 'Por eso los fragmentos del ejemplo incluyen la columna identificadora.' },
    { t: 'vf', d: 1, q: '2PL es el protocolo de confirmación en dos fases.', a: false, e: '2PL es bloqueo en dos fases; la confirmación en dos fases es 2PC.' },
    { t: 'mc', d: 1, q: '¿Cuál es una desventaja de las BDD según la guía?', o: ['Costos de comunicación entre nodos', 'Menor disponibilidad que una BD central', 'Imposibilidad de escalar', 'No admiten consultas SQL'], e: 'También complejidad y dificultad para la consistencia.' },
    { t: 'mc', d: 2, q: '¿Qué técnica de recuperación ante fallos menciona la guía para las BDD?', o: ['Logs distribuidos', 'Índices compuestos', 'Fragmentación vertical', 'Enmascaramiento de datos'], e: 'Además: protocolos de recuperación y replicación redundante.' },
    { t: 'mc', d: 2, q: 'Se toma el fragmento horizontal de una escuela y luego se proyectan algunas columnas. ¿Qué fragmentación resulta?', o: ['Mixta', 'Horizontal', 'Vertical', 'Replicada'], e: 'Combina ambas, como en el ejemplo de Secretaría y Jefatura.' }
  ]);

  Q('servidores-vinculados', [
    { t: 'mc', d: 2, q: "¿Qué indica @useself = 'false' en sp_addlinkedsrvlogin?", o: ['Que se usarán las credenciales remotas indicadas', 'Que se usarán las credenciales del usuario local', 'Que no se requiere ninguna autenticación', 'Que el servidor remoto queda deshabilitado'], e: 'Luego se indican @rmtuser y @rmtpassword.' },
    { t: 'mc', d: 1, q: 'En [ServidorRemoto].[trabajos].[dbo].[Personas], ¿qué es dbo?', o: ['El esquema', 'La base de datos', 'El servidor', 'La tabla'], e: 'servidor.base.esquema.tabla.' },
    { t: 'mc', d: 1, q: '¿Dónde se habilita el protocolo TCP/IP de la instancia?', o: ['SQL Server Configuration Manager', 'El Explorador de objetos de SSMS', 'El archivo .mdf de la base', 'El procedimiento sp_helpindex'], e: 'Primer paso para las conexiones remotas.' },
    { t: 'mc', d: 1, q: '¿Qué proveedor usa la guía en sp_addlinkedserver?', o: ['MSOLEDBSQL', 'ODBC32', 'MongoDB API', 'JDBC'], e: "@provider = 'MSOLEDBSQL'." },
    { t: 'vf', d: 1, q: 'Las instancias con nombre pueden usar puertos dinámicos.', a: true, e: 'La predeterminada suele usar TCP 1433.' },
    { t: 'mc', d: 2, q: '¿Cómo se inserta una fila en la tabla Productos de TiendaSucursal2 del servidor vinculado Sucursal2?', o: ['INSERT INTO Sucursal2.TiendaSucursal2.dbo.Productos …', 'INSERT INTO Productos@Sucursal2 …', 'INSERT INTO TiendaSucursal2.Sucursal2.Productos …', 'INSERT REMOTE Sucursal2 Productos …'], e: 'Se usa el nombre de cuatro partes.' },
    { t: 'mc', d: 1, q: '¿Qué formato indica servidor y puerto al conectarse?', o: ['servidor,puerto', 'servidor:puerto', 'puerto@servidor', 'servidor/puerto'], e: 'Por ejemplo 192.168.42.213,1433.' },
    { t: 'vf', d: 1, q: 'sp_addlinkedsrvlogin crea la base de datos en el servidor remoto.', a: false, e: 'Configura las credenciales del vínculo.' },
    { t: 'mc', d: 2, q: '¿Qué valor va en @datasrc?', o: ['La dirección o nombre del servidor remoto', 'El nombre lógico del vínculo', 'El usuario remoto', 'La tabla remota que se va a consultar después'], e: '@server es el nombre lógico.' },
    { t: 'mc', d: 2, q: 'Después de cambiar el protocolo o el puerto de la instancia, ¿qué suele ser necesario?', o: ['Reiniciar el servicio del motor', 'Restaurar el último respaldo FULL', 'Crear de nuevo todos los índices', 'Cambiar el modelo de recuperación'], e: 'Paso 3 de las conexiones remotas.' }
  ]);

  Q('mongo-conceptos', [
    { t: 'mc', d: 1, q: '¿Qué equivale en MongoDB a una tabla de SQL Server?', o: ['Colección', 'Documento', 'Campo', 'Índice'], e: 'Las colecciones agrupan documentos.' },
    { t: 'mc', d: 1, q: '¿Qué equivale en MongoDB a una fila?', o: ['Documento', 'Colección', 'Base de datos', 'Subconsulta'], e: 'Cada documento es un registro JSON/BSON.' },
    { t: 'mc', d: 1, q: '¿Cómo se llama el lenguaje de consultas de MongoDB?', o: ['MQL', 'T-SQL', 'CQL', 'PL/SQL'], e: 'MongoDB Query Language.' },
    { t: 'mc', d: 2, q: 'Según la tabla de la Guía #13, ¿cómo maneja MongoDB las transacciones?', o: ['Desde la versión 4.0, con restricciones', 'No las admite en ninguna versión', 'Con soporte completo igual que SQL Server', 'Solo mediante procedimientos almacenados'], e: 'SQL Server tiene soporte completo.' },
    { t: 'vf', d: 1, q: 'MongoDB almacena los documentos en formato BSON.', a: true, e: 'Binary JSON.' },
    { t: 'mc', d: 2, q: 'El campo aula del curso contiene numero y ubicacion. ¿Qué tipo de relación es?', o: ['Embebida: un subdocumento', 'Una llave foránea', 'Una tabla intermedia', 'Una referencia a otra colección'], e: 'Relaciones manuales o embebidas.' },
    { t: 'mc', d: 1, q: '¿Cuál es un caso de uso ideal de MongoDB según la tabla?', o: ['Apps web y móviles con contenido flexible', 'Sistemas contables con esquema rígido', 'ERP con normalización estricta', 'Banca con procedimientos almacenados'], e: 'SQL Server se recomienda para ERP, banca y contabilidad.' },
    { t: 'vf', d: 1, q: 'Dos documentos de la misma colección pueden tener campos distintos.', a: true, e: 'El esquema es flexible.' },
    { t: 'mc', d: 2, q: '¿Qué mecanismos de seguridad atribuye la tabla a MongoDB?', o: ['Autenticación, roles e integración con LDAP', 'Solo cifrado TDE', 'Ninguno: depende de la aplicación', 'Auditoría avanzada y roles fijos de servidor'], e: 'SQL Server: autenticación, roles, cifrado y auditorías.' },
    { t: 'mc', d: 1, q: '¿Cómo escala MongoDB según la guía?', o: ['Horizontalmente, en varios servidores', 'Solo verticalmente, en un servidor', 'No permite escalar', 'Solo con particiones de disco'], e: 'Escalabilidad horizontal.' }
  ]);

  Q('mongo-crud', [
    { t: 'mc', d: 1, q: '¿Qué filtro devuelve productos con precio menor o igual a 1000?', o: ['{ precio: { $lte: 1000 } }', '{ precio: { $lt: 1000 } }', '{ precio: { $gte: 1000 } }', '{ precio: { $ne: 1000 } }'], e: '$lte = menor o igual.' },
    { t: 'mc', d: 1, q: '¿Qué filtro devuelve libros cuyo autor no es "Ana"?', o: ['{ autor: { $ne: "Ana" } }', '{ autor: { $lt: "Ana" } }', '{ autor: "Ana" }', '{ $or: [ { autor: "Ana" } ] }'], e: '$ne = diferente.' },
    { t: 'mc', d: 2, q: '¿Qué filtro devuelve empleados de más de 30 años del departamento "TI"?', o: ['{ edad: { $gt: 30 }, departamento: "TI" }', '{ $or: [ { edad: { $gt: 30 } }, { departamento: "TI" } ] }', '{ edad: { $gte: 30 }, departamento: "TI" }', '{ edad: 30, departamento: { $ne: "TI" } }'], e: 'Dos condiciones en el mismo filtro = AND implícito; “más de” es $gt.' },
    { t: 'mc', d: 2, q: '¿Qué filtro devuelve productos con precio menor a 50 o con stock igual a 0?', o: ['{ $or: [ { precio: { $lt: 50 } }, { stock: 0 } ] }', '{ precio: { $lt: 50 }, stock: 0 }', '{ $or: { precio: { $lt: 50 }, stock: 0 } }', '{ $or: [ { precio: { $lte: 50 } }, { stock: { $ne: 0 } } ] }'], e: '$or recibe un arreglo de condiciones.' },
    { t: 'mc', d: 2, q: 'Los clientes tienen un subdocumento direccion con el campo ciudad. ¿Cómo se buscan los de "Limón"?', o: ['{ "direccion.ciudad": "Limón" }', '{ direccion: "Limón" }', '{ ciudad: "Limón" }', '{ direccion.ciudad: "Limón" }'], e: 'Notación de punto entre comillas.' },
    { t: 'mc', d: 1, q: '¿Cómo se cambia a 40 el stock del producto "Arroz"?', o: ['db.productos.updateOne({ nombre: "Arroz" }, { $set: { stock: 40 } })', 'db.productos.updateOne({ stock: 40 }, { $set: { nombre: "Arroz" } })', 'db.productos.insertOne({ nombre: "Arroz", stock: 40 })', 'db.productos.find({ nombre: "Arroz", stock: 40 })'], e: 'Primero el filtro, después el cambio con $set.' },
    { t: 'mc', d: 1, q: '¿Cómo se eliminan todos los productos con stock 0?', o: ['db.productos.deleteMany({ stock: 0 })', 'db.productos.deleteOne({ stock: 0 })', 'db.productos.updateOne({ stock: 0 }, { $set: {} })', 'db.productos.find({ stock: 0 })'], e: 'deleteOne borraría solo el primero.' },
    { t: 'mc', d: 1, q: '¿Qué método agrega un único documento a una colección?', o: ['insertOne', 'insertMany', 'updateOne', 'find'], e: 'insertMany recibe un arreglo de documentos.' },
    { t: 'mc', d: 2, q: '¿Qué devuelve db.clientes.find({ edad: { $gte: 18, $lte: 25 } })?', o: ['Clientes de 18 a 25 años, ambos incluidos', 'Clientes de 19 a 24 años', 'Clientes menores de 18 o mayores de 25', 'Clientes de exactamente 18 o 25 años'], e: '$gte y $lte incluyen los extremos.' },
    { t: 'mc', d: 1, q: '¿Qué hace db.ventas.find()?', o: ['Devuelve todos los documentos de ventas', 'Devuelve solo el primer documento', 'Elimina la colección ventas', 'Crea la colección ventas'], e: 'Sin filtro equivale a SELECT * FROM ventas.' },
    { t: 'vf', d: 2, q: 'El filtro { $or: { a: 1 } } es válido.', a: false, e: '$or necesita un arreglo: { $or: [ { a: 1 }, … ] }.' },
    { t: 'vf', d: 1, q: 'insertMany recibe un arreglo de documentos.', a: true, e: 'insertMany([ { … }, { … } ]).' },
    { t: 'mc', d: 2, q: 'Hay 5 documentos con edades 20, 22, 25, 25 y 30. ¿Cuántos elimina deleteOne({ edad: 25 })?', o: ['1', '2', '0', '5'], e: 'deleteOne elimina solo el primero que cumpla.' },
    { t: 'mc', d: 2, q: 'Con los mismos 5 documentos, ¿cuántos elimina deleteMany({ edad: 25 })?', o: ['2', '1', '3', '5'], e: 'Elimina todos los que cumplen el filtro.' }
  ]);

  // Se agregan al final de cada tema (no cambian los identificadores existentes)
  Object.keys(X).forEach(function (k) { window.PREGUNTAS[k] = (window.PREGUNTAS[k] || []).concat(X[k]); });
})();
