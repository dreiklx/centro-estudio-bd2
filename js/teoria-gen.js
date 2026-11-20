/* =====================================================================
   PREGUNTAS TEÓRICAS GENERADAS (solo Practicar y Simulacro)
   Plantillas con valores al azar: cada vez salen escenarios nuevos.
   Devuelven preguntas 'mc' con o[0] correcta, igual que el banco fijo.
   ===================================================================== */
(function () {
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function ent(r, a, b) { return a + Math.floor(r() * (b - a + 1)); }
  function el(r, a) { return a[Math.floor(r() * a.length)]; }
  function mez(r, a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function unicos(lista) { var v = []; lista.forEach(function (x) { if (v.indexOf(x) < 0) v.push(x); }); return v; }
  function opciones(correcta, otras) { var o = [correcta].concat(unicos(otras).filter(function (x) { return x !== correcta; })); return o.slice(0, 4); }

  var ENT = [['el saldo de la cuenta 4', 'saldo'], ['el stock del producto 12', 'stock'], ['el cupo del curso 3', 'cupo'], ['las entradas disponibles del concierto', 'entradas'], ['los asientos libres del vuelo 81', 'asientos']];

  var G = {};
  G.aislamiento = function (r) {
    var e = el(r, ENT), a = ent(r, 10, 60), b = a - ent(r, 1, 9), tipo = ent(r, 0, 3), modoNivel = r() < 0.45 && tipo < 3, txt, anom, nivel;
    if (tipo === 0) { txt = 'T1 cambia ' + e[0] + ' de ' + a + ' a ' + b + ' sin confirmar; T2 lee ' + b + '; después T1 hace ROLLBACK.'; anom = 'Lectura sucia'; nivel = 'READ COMMITTED'; }
    else if (tipo === 1) { txt = 'T1 lee ' + e[0] + ' (' + a + '); T2 lo cambia a ' + b + ' y confirma; T1 vuelve a leerlo y obtiene ' + b + '.'; anom = 'Lectura no repetible'; nivel = 'REPEATABLE READ'; }
    else if (tipo === 2) { var n = ent(r, 2, 9); txt = 'T1 cuenta las reservas del día 15 y obtiene ' + n + '; T2 inserta una reserva para ese día y confirma; T1 cuenta otra vez y obtiene ' + (n + 1) + '.'; anom = 'Lectura fantasma'; nivel = 'SERIALIZABLE'; }
    else { var x = ent(r, 1, 5), y = ent(r, 1, 5); txt = 'T1 y T2 leen ' + e[0] + ' (' + a + '). T1 resta ' + x + ' y guarda ' + (a - x) + '; T2 resta ' + y + ' a su lectura y guarda ' + (a - y) + '.'; anom = 'Actualización perdida'; }
    if (modoNivel) return { q: txt + ' ¿Cuál es el nivel de aislamiento menos estricto que evita esta anomalía?', o: opciones(nivel, ['READ UNCOMMITTED', 'READ COMMITTED', 'REPEATABLE READ', 'SERIALIZABLE']), e: anom + ': la evita ' + nivel + ' (tabla de la Guía #8).', d: 2 };
    return { q: txt + ' ¿Qué anomalía ocurrió?', o: opciones(anom, ['Lectura sucia', 'Lectura no repetible', 'Lectura fantasma', 'Actualización perdida']), e: 'Es una ' + anom.toLowerCase() + '.', d: 2 };
  };
  G.planificacion = function (r) {
    var ts = mez(r, [1, 2, 3]), a = ts[0], b = ts[1], datos = ['X', 'Y', 'Z'];
    var o1 = el(r, ['l', 'e']), o2 = el(r, ['l', 'e']), x1 = el(r, datos), x2 = r() < 0.7 ? x1 : el(r, datos);
    var s1 = o1 + a + '(' + x1 + ')', s2 = o2 + b + '(' + x2 + ')';
    var conflicto = x1 === x2 && (o1 === 'e' || o2 === 'e');
    var corr = conflicto ? 'Sí: arista T' + a + ' → T' + b : (x1 !== x2 ? 'No: acceden a datos distintos' : 'No: las dos son lecturas');
    return { q: 'En una planificación aparece ' + s1 + ' y, más adelante, ' + s2 + '. ¿Están en conflicto?', o: opciones(corr, ['Sí: arista T' + a + ' → T' + b, 'Sí: arista T' + b + ' → T' + a, 'No: las dos son lecturas', 'No: acceden a datos distintos']), e: 'Conflicto = transacciones distintas, mismo dato y al menos una escritura; la arista va de la primera operación a la segunda.', d: 1 };
  };
  G['marcas-tiempo'] = function (r) {
    var T = ent(r, 2, 20), R = ent(r, 0, 20), W = ent(r, 0, 20), op = r() < 0.5 ? 'leer' : 'escribir', corr, e;
    if (op === 'leer') { if (T < W) { corr = 'Se aborta T'; e = 'TS(T) = ' + T + ' < W_TS(X) = ' + W + '.'; } else { corr = 'Se permite y R_TS(X) = ' + Math.max(R, T); e = 'Lectura válida; R_TS = max(' + R + ', ' + T + ').'; } }
    else { if (T < R || T < W) { corr = 'Se aborta T'; e = 'TS(T) = ' + T + ' es menor que ' + (T < R ? 'R_TS(X) = ' + R : 'W_TS(X) = ' + W) + '.'; } else { corr = 'Se permite y W_TS(X) = ' + T; e = 'Escritura válida; W_TS = TS(T).'; } }
    return { q: 'TS(T) = ' + T + ', R_TS(X) = ' + R + ' y W_TS(X) = ' + W + '. T quiere ' + op + ' X. ¿Qué ocurre según el protocolo básico?', o: opciones(corr, ['Se aborta T', 'Se permite y R_TS(X) = ' + Math.max(R, T), 'Se permite y W_TS(X) = ' + T, 'Se permite y R_TS(X) = ' + T, 'Se permite sin cambiar las marcas']), e: e, d: 2 };
  };
  G.transacciones = function (r) {
    var s = ent(r, 30, 90), a = ent(r, 2, 9), b = ent(r, 2, 9), c = ent(r, 10, 20);
    var modo = ent(r, 0, 1);
    if (modo === 0) return { q: 'Stock = ' + s + '. BEGIN TRAN; resta ' + a + '; SAVE TRANSACTION p1; resta ' + b + '; ROLLBACK TRANSACTION p1; COMMIT. ¿Stock final?', o: opciones(String(s - a), [String(s - a - b), String(s), String(s - b)]), e: 'Se revierte solo lo posterior a p1 (la resta de ' + b + ').', d: 2 };
    return { q: 'Stock = ' + s + '. BEGIN TRAN; resta ' + a + '; SAVE TRANSACTION p1; resta ' + b + '; SAVE TRANSACTION p2; resta ' + c + '; ROLLBACK TRANSACTION p2; COMMIT. ¿Stock final?', o: opciones(String(s - a - b), [String(s - a - b - c), String(s - a), String(s)]), e: 'ROLLBACK a p2 deshace solo la resta de ' + c + '.', d: 2 };
  };
  G.bloqueos = function (r) {
    var modo = ent(r, 0, 1);
    if (modo === 0) {
      var ex = el(r, ['S', 'X']), pide = el(r, ['S', 'X']), comp = ex === 'S' && pide === 'S';
      return { q: 'T1 tiene un bloqueo ' + ex + ' sobre una fila y T2 solicita un bloqueo ' + pide + ' sobre la misma fila. ¿Qué ocurre?', o: opciones(comp ? 'Se concede: son compatibles' : 'T2 espera', ['Se concede: son compatibles', 'T2 espera', 'Se produce un interbloqueo', 'T1 libera su bloqueo']), e: 'Solo S con S es compatible.', d: 1 };
    }
    var ms = el(r, [2000, 3000, 5000, 8000, 10000, 20000, 30000]);
    return { q: '¿Cuánto espera una instrucción por un bloqueo con SET LOCK_TIMEOUT ' + ms + '?', o: opciones((ms / 1000) + ' segundos', [ms + ' segundos', (ms / 100) + ' segundos', 'Sin límite', (ms / 10000) + ' segundos']), e: 'El valor está en milisegundos; -1 = sin límite.', d: 1 };
  };
  G['fallas-respaldo'] = function (r) {
    var ini = ent(r, 2, 9) * 10, v1 = ini + ent(r, 1, 5) * 10, v2 = v1 + ent(r, 1, 5) * 10, c1 = r() < 0.5, c2 = r() < 0.5;
    var log = ['A = ' + ini, '<T1, A, ' + ini + ' → ' + v1 + '>'].concat(c1 ? ['<T1 COMMIT>'] : []).concat(c1 ? ['<T2, A, ' + v1 + ' → ' + v2 + '>'] : []).concat(c1 && c2 ? ['<T2 COMMIT>'] : []);
    var final = !c1 ? ini : (c2 ? v2 : v1);
    return { q: 'Log al caer el sistema: ' + log.join('; ') + '. ¿Valor final de A tras la recuperación?', o: opciones(String(final), [String(ini), String(v1), String(v2), String(v2 + 10)]), e: 'Se rehace lo confirmado y se deshace lo que no tiene COMMIT.', d: 2 };
  };
  var DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  G['backup-restore'] = function (r) {
    var d = ent(r, 2, 6);
    var corr = 'FULL del domingo + DIFF del ' + DIAS[d - 1];
    return { q: 'FULL cada domingo y DIFFERENTIAL cada noche de lunes a sábado (a las 23:00), sin respaldos de log. El disco falla el ' + DIAS[d] + ' a las 15:00. ¿Qué se restaura?', o: opciones(corr, ['Todos los DIFF desde el lunes', 'Solo el DIFF del ' + DIAS[d - 1], 'FULL del domingo + DIFF del lunes', 'Solo el FULL del domingo']), e: 'Basta el último diferencial antes de la falla: contiene todo desde el FULL.', d: 2 };
  };
  var TABLAS = [['Clientes', 'Pedidos'], ['Estudiantes', 'Matrículas'], ['Productos', 'Ventas'], ['Autores', 'Libros'], ['Hoteles', 'Reservas']];
  G['optimizacion-proceso'] = function (r) {
    var t = el(r, TABLAS), a = ent(r, 2, 12) * 100, b = ent(r, 5, 40) * 100;
    return { q: t[0] + ' tiene ' + a.toLocaleString('es-CR') + ' tuplas y ' + t[1] + ' ' + b.toLocaleString('es-CR') + '. ¿Cuántas tuplas produce el producto cartesiano de ambas?', o: opciones((a * b).toLocaleString('es-CR'), [(a + b).toLocaleString('es-CR'), b.toLocaleString('es-CR'), (a * b / 10).toLocaleString('es-CR')]), e: 'Producto cartesiano = ' + a + ' × ' + b + '. Por eso es la peor opción del árbol.', d: 1 };
  };
  var MESES = [['enero', 31], ['febrero', 28], ['marzo', 31], ['abril', 30], ['mayo', 31], ['junio', 30], ['julio', 31], ['agosto', 31], ['septiembre', 30], ['octubre', 31], ['noviembre', 30], ['diciembre', 31]];
  G['optimizacion-practica'] = function (r) {
    var y = ent(r, 2019, 2025), m = ent(r, 0, 11), mm = String(m + 1).padStart(2, '0'), ult = MESES[m][1] + (m === 1 && y % 4 === 0 ? 1 : 0);
    var corr = "fecha BETWEEN '" + y + '-' + mm + "-01' AND '" + y + '-' + mm + '-' + ult + "'";
    return { q: 'Para que el índice sobre fecha pueda usarse, ¿con qué condición se reemplaza WHERE YEAR(fecha) = ' + y + ' AND MONTH(fecha) = ' + (m + 1) + '?', o: opciones(corr, ["fecha BETWEEN '" + y + "-01-01' AND '" + y + "-12-31'", "fecha BETWEEN '" + y + '-' + mm + "-01' AND '" + (y + 1) + '-' + mm + "-01'", 'MONTH(fecha) BETWEEN ' + (m + 1) + ' AND ' + (m + 1), "fecha = '" + y + '-' + mm + "'"]), e: 'Un rango con el primer y el último día de ' + MESES[m][0] + ' evita aplicar funciones sobre la columna.', d: 2 };
  };
  var FRAG = [
    ['Cada provincia guarda en su servidor los clientes que viven en ella.', 'Horizontal'],
    ['Las notas de cada sede universitaria se guardan en el servidor de esa sede.', 'Horizontal'],
    ['Recursos Humanos guarda salario y cuenta bancaria; Recepción guarda nombre y extensión del mismo empleado.', 'Vertical'],
    ['El catálogo guarda descripción y foto de cada producto; Bodega guarda su código y existencias.', 'Vertical'],
    ['Se toman solo los empleados de la sede Limón y, de ellos, unas columnas van a Planillas y otras a Recepción.', 'Mixta'],
    ['Los pedidos de cada país van a su nodo y, dentro de cada nodo, los datos de pago se separan de los de envío.', 'Mixta'],
    ['Cada uno de los tres nodos guarda una copia completa de toda la base.', 'Replicación total'],
    ['Solo la tabla de productos se copia en todos los nodos; las demás están en un único nodo.', 'Replicación parcial']
  ];
  G['bdd-conceptos'] = function (r) {
    var f = el(r, FRAG);
    return { q: f[0] + ' ¿Qué técnica de distribución describe?', o: opciones(f[1], ['Horizontal', 'Vertical', 'Mixta', 'Replicación total', 'Replicación parcial']), e: 'Horizontal reparte filas; vertical, columnas; mixta combina ambas; la replicación guarda copias.', d: 1 };
  };
  var COLS = [['productos', 'precio', 'el precio'], ['empleados', 'salario', 'el salario'], ['cursos', 'cantidad_estudiantes', 'la cantidad de estudiantes'], ['libros', 'paginas', 'las páginas'], ['clientes', 'edad', 'la edad']];
  var OPS = [['$gt', 'mayor que'], ['$gte', 'mayor o igual a'], ['$lt', 'menor que'], ['$lte', 'menor o igual a'], ['$ne', 'distinto de']];
  G['mongo-crud'] = function (r) {
    var c = el(r, COLS), o = el(r, OPS), v = ent(r, 2, 90) * 10;
    var f = function (op) { return 'db.' + c[0] + '.find({ ' + c[1] + ': { ' + op + ': ' + v + ' } })'; };
    return { q: '¿Qué consulta muestra los ' + c[0] + ' cuyo campo ' + c[1] + ' (' + c[2] + ') es ' + o[1] + ' ' + v + '?', o: opciones(f(o[0]), OPS.map(function (x) { return f(x[0]); })), e: o[0] + ' significa “' + o[1] + '”.', d: 1 };
  };
  G.recuperabilidad = function (r) {
    var seg = el(r, ['l2(X)', 'e2(X)']), cierre;
    var variantes = [
      ['e1(X)', seg, 'c1', 'c2'], ['e1(X)', 'c1', seg, 'c2'], ['e1(X)', seg, 'c2', 'c1'], ['e1(X)', seg, 'r1', 'r2']
    ];
    var ops = PRACTICO._parsePlan(el(r, variantes).join('; ')), a = PRACTICO._analizarRecup(ops);
    var corr = a.est ? 'Estricta' : a.aca ? 'Sin abortos en cascada, pero no estricta' : a.rec ? 'Recuperable, pero no sin cascada' : 'No recuperable';
    return { q: 'Planificación: ' + ops.map(function (x) { return x.txt; }).join('; ') + '. ¿Cuál es la propiedad más fuerte que cumple?', o: opciones(corr, ['Estricta', 'Sin abortos en cascada, pero no estricta', 'Recuperable, pero no sin cascada', 'No recuperable']), e: 'Estricta ⇒ sin cascada ⇒ recuperable. Revise quién lee o escribe datos de una transacción aún activa y en qué orden confirman.', d: 3 };
  };

  window.TEORIA_GEN = {
    temas: Object.keys(G),
    generar: function (tema, seed) {
      if (!G[tema]) return null;
      var q = G[tema](rng(seed));
      q.t = 'mc'; q.tema = tema; q.id = 'g-' + tema + '-' + (seed >>> 0); q.gen = true;
      return q;
    }
  };
})();
