/* =====================================================================
   EJERCICIOS PRÁCTICOS GENERADOS
   Concurrencia, planificación, marcas de tiempo, respaldo, recuperación
   con el log y árboles de consulta. Cada generador recibe una semilla y
   devuelve un ejercicio que se califica solo:
     { cat, titulo, tema, html, max, corregir(raiz) -> {puntos, max, html} }
   ===================================================================== */
(function () {
  var esc = EH.esc;
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function ent(r, a, b) { return a + Math.floor(r() * (b - a + 1)); }
  function elegir(r, arr) { return arr[Math.floor(r() * arr.length)]; }
  function barajar(r, arr) { var a = arr.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  var uid = 0; function nid() { return 'px' + (++uid); }
  function sel(name, opciones, ph) { return '<select name="' + name + '" class="sel"><option value="">' + (ph || 'Elija…') + '</option>' + opciones.map(function (o) { return '<option value="' + esc(o) + '">' + esc(o) + '</option>'; }).join('') + '</select>'; }
  function num(name, ph) { return '<input name="' + name + '" class="inp-num" inputmode="numeric" autocomplete="off" placeholder="' + (ph || '?') + '">'; }
  function val(raiz, name) { var el = raiz.querySelector('[name="' + name + '"]'); return el ? el.value.trim() : ''; }
  function numVal(raiz, name) { var v = val(raiz, name).replace(/\s/g, '').replace(',', '.'); return v === '' ? NaN : parseFloat(v); }
  function marca(ok) { return ok ? '<span class="ok-t">✔</span>' : '<span class="bad-t">✘</span>'; }
  function fila(ok, txt) { return '<li>' + marca(ok) + ' ' + txt + '</li>'; }
  function resultado(p, max, items, expl) {
    return { puntos: p, max: max, html: '<ul class="lista-corr">' + items.join('') + '</ul>' + (expl ? '<div class="expl">' + expl + '</div>' : '') };
  }

  /* ---------------- planificaciones ---------------- */
  function parsePlan(s) {
    return s.split(';').map(function (x) { return x.trim(); }).filter(Boolean).map(function (x) {
      var m = x.match(/^([lecr])(\d)(?:\((\w)\))?$/); return { op: m[1], t: +m[2], x: m[3] || null, txt: x };
    });
  }
  function txt(ops) { return ops.map(function (o) { return o.txt; }).join('; ') + ';'; }
  function tablaPlan(ops) {
    var ts = []; ops.forEach(function (o) { if (ts.indexOf(o.t) < 0) ts.push(o.t); }); ts.sort();
    return '<div class="tabla-wrap"><table class="t plan"><thead><tr><th>Paso</th>' + ts.map(function (t) { return '<th>T' + t + '</th>'; }).join('') + '</tr></thead><tbody>' +
      ops.map(function (o, i) { return '<tr><td>' + (i + 1) + '</td>' + ts.map(function (t) { return '<td>' + (o.t === t ? '<code>' + esc(o.txt) + '</code>' : '') + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
  }
  function transacciones(ops) { var ts = []; ops.forEach(function (o) { if (ts.indexOf(o.t) < 0) ts.push(o.t); }); return ts.sort(); }
  function aristas(ops) {
    var e = {}, just = {};
    for (var i = 0; i < ops.length; i++) for (var j = i + 1; j < ops.length; j++) {
      var a = ops[i], b = ops[j];
      if (a.t === b.t || !a.x || a.x !== b.x || (a.op !== 'e' && b.op !== 'e') || 'cr'.indexOf(a.op) >= 0 || 'cr'.indexOf(b.op) >= 0) continue;
      var k = a.t + '>' + b.t; e[k] = 1; (just[k] = just[k] || []).push(a.txt + ' antes de ' + b.txt);
    }
    return { e: e, just: just };
  }
  function permutaciones(a) { if (a.length <= 1) return [a]; var r = []; a.forEach(function (x, i) { permutaciones(a.slice(0, i).concat(a.slice(i + 1))).forEach(function (p) { r.push([x].concat(p)); }); }); return r; }
  function ordenValido(orden, e) { for (var i = 0; i < orden.length; i++) for (var j = i + 1; j < orden.length; j++) if (e[orden[j] + '>' + orden[i]]) return false; return true; }

  var BANCO_CONFLICTOS = [
    'l1(X); e1(X); l2(X); e2(X); l1(Y); e1(Y); c1; c2', 'l1(X); l2(X); e1(X); e2(X); c1; c2', 'l1(X); e1(X); l2(Y); e2(Y); l1(Z); e1(Z); c1; c2',
    'e1(X); e2(X); e1(X); c1; c2', 'l2(X); e2(X); l1(X); e1(Y); l3(Y); e3(Z); c2; c1; c3', 'l1(X); e1(X); l2(X); e2(Y); l3(Y); e3(Z); l1(Z); c1; c2; c3',
    'l1(X); e1(X); l2(X); l3(X); e2(Y); e3(Z); c1; c2; c3', 'l1(X); e1(X); l2(X); e2(Y); l3(Y); e3(X); c1; c2; c3', 'l1(X); e1(Y); l2(Y); e2(Z); l3(Z); e3(X); c1; c2; c3',
    'l3(X); e3(X); l2(X); e2(Y); l1(Y); e1(Z); l3(Z); c3; c2; c1', 'l3(X); e3(X); l1(X); e1(Y); l2(Y); e2(Z); c3; c1; c2'
  ];
  function planAleatorio(r) {
    var n = ent(r, 2, 3), datos = ['X', 'Y', 'Z'], porT = [];
    for (var t = 1; t <= n; t++) { var ops = [], k = ent(r, 2, 3); for (var i = 0; i < k; i++) ops.push({ op: r() < 0.5 ? 'l' : 'e', t: t, x: elegir(r, datos.slice(0, n === 2 ? 2 : 3)) }); porT.push(ops); }
    var res = [], idx = porT.map(function () { return 0; });
    while (idx.some(function (v, i) { return v < porT[i].length; })) { var cand = idx.map(function (v, i) { return v < porT[i].length ? i : -1; }).filter(function (v) { return v >= 0; }); var c = elegir(r, cand); res.push(porT[c][idx[c]++]); }
    barajar(r, porT.map(function (_, i) { return i + 1; })).forEach(function (t) { res.push({ op: 'c', t: t }); });
    return res.map(function (o) { return o.op + o.t + (o.x ? '(' + o.x + ')' : ''); }).join('; ');
  }

  function genConflictos(seed) {
    var r = rng(seed), s = r() < 0.55 ? elegir(r, BANCO_CONFLICTOS) : planAleatorio(r);
    var ops = parsePlan(s), ts = transacciones(ops), A = aristas(ops), id = nid();
    var pares = []; ts.forEach(function (a) { ts.forEach(function (b) { if (a !== b) pares.push(a + '>' + b); }); });
    var perms = permutaciones(ts).map(function (p) { return p.map(function (t) { return 'T' + t; }).join(', '); });
    var html = '<p>Analice la planificación: <code>' + esc(txt(ops)) + '</code></p>' + tablaPlan(ops) +
      '<p><b>1.</b> Marque <b>todas</b> las aristas del grafo de precedencia:</p><div class="checks">' + pares.map(function (p) { var q = p.split('>'); return '<label class="check"><input type="checkbox" name="' + id + 'a" value="' + p + '"> T' + q[0] + ' → T' + q[1] + '</label>'; }).join('') + '</div>' +
      '<p><b>2.</b> ¿Es serializable por conflictos? ' + sel(id + 's', ['Sí', 'No']) + '</p>' +
      '<p><b>3.</b> Orden serie equivalente: ' + sel(id + 'o', perms.concat(['No aplica'])) + '</p>';
    return {
      cat: 'conflictos', titulo: 'Grafo de precedencia', tema: 'planificacion', html: html, max: 3,
      corregir: function (raiz) {
        var marcadas = {}; raiz.querySelectorAll('input[name="' + id + 'a"]:checked').forEach(function (c) { marcadas[c.value] = 1; });
        var okA = pares.every(function (p) { return !!marcadas[p] === !!A.e[p]; });
        var orden = ts.slice(), ciclo = !permutaciones(ts).some(function (p) { return ordenValido(p, A.e); });
        var okS = val(raiz, id + 's') === (ciclo ? 'No' : 'Sí');
        var o = val(raiz, id + 'o'), okO;
        if (ciclo) okO = o === 'No aplica'; else okO = o && o !== 'No aplica' && ordenValido(o.split(', ').map(function (x) { return +x.slice(1); }), A.e);
        var validos = permutaciones(ts).filter(function (p) { return ordenValido(p, A.e); }).map(function (p) { return p.map(function (t) { return 'T' + t; }).join(', '); });
        var lista = Object.keys(A.e);
        var expl = '<p><b>Aristas:</b> ' + (lista.length ? lista.map(function (k) { var q = k.split('>'); return 'T' + q[0] + ' → T' + q[1] + ' <span class="muted">(' + esc(A.just[k][0]) + ')</span>'; }).join(' · ') : 'ninguna (no hay operaciones en conflicto)') + '.</p>' +
          '<p>' + (ciclo ? 'Hay un <b>ciclo</b>: no es serializable por conflictos.' : 'Sin ciclos: es serializable. Orden(es) serie válido(s): <b>' + validos.join(' · ') + '</b>.') + '</p>';
        return resultado((okA ? 1 : 0) + (okS ? 1 : 0) + (okO ? 1 : 0), 3, [fila(okA, 'Aristas del grafo'), fila(okS, 'Serializable: ' + (ciclo ? 'No' : 'Sí')), fila(okO, 'Orden serie')], expl);
      }
    };
  }

  /* ---------------- recuperabilidad ---------------- */
  var BANCO_RECUP = ['e1(X); c1; l2(X); e2(Y); c2', 'e1(X); l2(X); c1; c2', 'e1(X); l2(X); c2; c1', 'e1(X); l2(X); e2(Y); r1; r2',
    'e1(X); l2(X); e2(Y); l3(Y); e3(Z); r1; r2; r3', 'e1(X); e2(Y); l3(Y); r1; c2; c3', 'e1(X); c1; l2(X); e2(Y); l3(Y); r2; r3',
    'e1(X); r1; l2(X); e2(Y); c2', 'e1(X); e2(X); c1; c2', 'e1(X); c1; e2(X); l3(X); c2; c3', 'e1(X); l2(X); e2(Y); l3(Y); c3; r1; r2',
    'l1(X); e2(X); c2; e1(X); c1', 'e2(Y); l1(Y); c1; c2', 'e1(X); l2(Y); c1; e2(X); c2'];
  function analizarRecup(ops) {
    var estado = {}, escritores = {}, lecturas = [], rec = true, aca = true, est = true, fin = {};
    ops.forEach(function (o, i) { if (o.op === 'c' || o.op === 'r') fin[o.t] = { op: o.op, i: i }; });
    ops.forEach(function (o, i) {
      if (o.op === 'c') { estado[o.t] = 'c'; return; }
      if (o.op === 'r') { estado[o.t] = 'r'; Object.keys(escritores).forEach(function (x) { escritores[x] = escritores[x].filter(function (t) { return t !== o.t; }); }); return; }
      var pila = escritores[o.x] || [], w = pila.length ? pila[pila.length - 1] : null;
      if (w !== null && w !== o.t && !estado[w]) { est = false; if (o.op === 'l') aca = false; }
      if (o.op === 'l' && w !== null && w !== o.t) lecturas.push({ lector: o.t, escritor: w, i: i });
      if (o.op === 'e') { (escritores[o.x] = pila).push(o.t); }
    });
    lecturas.forEach(function (l) {
      var fl = fin[l.lector], fe = fin[l.escritor];
      if (fl && fl.op === 'c' && (!fe || fe.op !== 'c' || fe.i > fl.i)) rec = false;
    });
    return { rec: rec, aca: aca, est: est, lecturas: lecturas };
  }
  function genRecup(seed) {
    var r = rng(seed), ops = parsePlan(elegir(r, BANCO_RECUP)), id = nid(), a = analizarRecup(ops);
    var html = '<p>Planificación: <code>' + esc(txt(ops)) + '</code></p>' + tablaPlan(ops) +
      '<div class="grid-preg"><label>¿Es <b>recuperable</b>? ' + sel(id + 'r', ['Sí', 'No']) + '</label><label>¿Es <b>sin abortos en cascada</b>? ' + sel(id + 'a', ['Sí', 'No']) + '</label><label>¿Es <b>estricta</b>? ' + sel(id + 'e', ['Sí', 'No']) + '</label></div>';
    return {
      cat: 'recuperabilidad', titulo: 'Recuperabilidad de una planificación', tema: 'recuperabilidad', html: html, max: 3,
      corregir: function (raiz) {
        var R = function (b) { return b ? 'Sí' : 'No'; };
        var o1 = val(raiz, id + 'r') === R(a.rec), o2 = val(raiz, id + 'a') === R(a.aca), o3 = val(raiz, id + 'e') === R(a.est);
        var dep = a.lecturas.length ? a.lecturas.map(function (l) { return 'T' + l.lector + ' lee un dato escrito por T' + l.escritor; }).join('; ') : 'Ninguna transacción lee datos escritos por otra';
        var expl = '<p><b>Dependencias de lectura:</b> ' + dep + '.</p><p>Recuperable: ' + R(a.rec) + ' (quien lee confirma después de quien escribió) · Sin cascada: ' + R(a.aca) + ' (solo se leen datos ya confirmados) · Estricta: ' + R(a.est) + ' (nadie lee ni sobrescribe un dato escrito por una transacción activa).</p><p class="muted peq">Recuerde: estricta ⇒ sin cascada ⇒ recuperable.</p>';
        return resultado((o1 ? 1 : 0) + (o2 ? 1 : 0) + (o3 ? 1 : 0), 3, [fila(o1, 'Recuperable: ' + R(a.rec)), fila(o2, 'Sin abortos en cascada: ' + R(a.aca)), fila(o3, 'Estricta: ' + R(a.est))], expl);
      }
    };
  }

  /* ---------------- marcas de tiempo ---------------- */
  function simularTS(ts, ops) {
    var R = { X: 0, Y: 0 }, W = { X: 0, Y: 0 }, abort = {}, pasos = [], primera = null;
    ops.forEach(function (o) {
      var T = ts[o.t];
      if (abort[o.t]) { pasos.push(o.txt + ': se omite (T' + o.t + ' ya abortó)'); return; }
      if (o.op === 'l') {
        if (T < W[o.x]) { abort[o.t] = 1; if (!primera) primera = o.t; pasos.push(o.txt + ': TS(T' + o.t + ')=' + T + ' &lt; W_TS(' + o.x + ')=' + W[o.x] + ' → <b>aborta T' + o.t + '</b>'); }
        else { R[o.x] = Math.max(R[o.x], T); pasos.push(o.txt + ': permitida → R_TS(' + o.x + ')=' + R[o.x]); }
      } else {
        if (T < R[o.x] || T < W[o.x]) { abort[o.t] = 1; if (!primera) primera = o.t; pasos.push(o.txt + ': TS(T' + o.t + ')=' + T + ' &lt; ' + (T < R[o.x] ? 'R_TS(' + o.x + ')=' + R[o.x] : 'W_TS(' + o.x + ')=' + W[o.x]) + ' → <b>aborta T' + o.t + '</b>'); }
        else { W[o.x] = T; pasos.push(o.txt + ': permitida → W_TS(' + o.x + ')=' + T); }
      }
    });
    return { R: R, W: W, primera: primera, pasos: pasos };
  }
  function genTS(seed) {
    var r = rng(seed), id = nid(), ts, ops, sim, intentos = 0;
    do {
      var vals = barajar(r, [5, 8, 10, 12, 15, 20]).slice(0, 3); ts = { 1: vals[0], 2: vals[1], 3: vals[2] };
      var n = ent(r, 5, 7), lista = [];
      for (var i = 0; i < n; i++) { var t = ent(r, 1, 3); lista.push((r() < 0.5 ? 'l' : 'e') + t + '(' + (r() < 0.6 ? 'X' : 'Y') + ')'); }
      ops = parsePlan(lista.join('; ')); sim = simularTS(ts, ops); intentos++;
    } while (!sim.primera && r() < 0.7 && intentos < 20);
    var html = '<p>TS(T1) = <b>' + ts[1] + '</b>, TS(T2) = <b>' + ts[2] + '</b>, TS(T3) = <b>' + ts[3] + '</b>. Al inicio R_TS y W_TS de X e Y valen 0. Aplique el protocolo básico de ordenación por marcas de tiempo a:</p><p><code>' + esc(txt(ops)) + '</code></p>' +
      '<div class="grid-preg"><label>¿Qué transacción se aborta primero? ' + sel(id + 'a', ['T1', 'T2', 'T3', 'Ninguna']) + '</label><label>W_TS(X) al final: ' + num(id + 'w') + '</label><label>R_TS(X) al final: ' + num(id + 'r') + '</label></div>' +
      '<p class="muted peq">Las operaciones de una transacción abortada que vienen después se omiten.</p>';
    return {
      cat: 'marcas', titulo: 'Marcas de tiempo', tema: 'marcas-tiempo', html: html, max: 3,
      corregir: function (raiz) {
        var esp = sim.primera ? 'T' + sim.primera : 'Ninguna';
        var o1 = val(raiz, id + 'a') === esp, o2 = numVal(raiz, id + 'w') === sim.W.X, o3 = numVal(raiz, id + 'r') === sim.R.X;
        return resultado((o1 ? 1 : 0) + (o2 ? 1 : 0) + (o3 ? 1 : 0), 3, [fila(o1, 'Primera abortada: ' + esp), fila(o2, 'W_TS(X) = ' + sim.W.X), fila(o3, 'R_TS(X) = ' + sim.R.X)], '<ol class="pasos-ts">' + sim.pasos.map(function (p) { return '<li>' + p + '</li>'; }).join('') + '</ol>');
      }
    };
  }

  /* ---------------- concurrencia y aislamiento ---------------- */
  function genConcurrencia(seed) {
    var r = rng(seed), id = nid(), tipo = ent(r, 0, 4), v = ent(r, 6, 20), html, campos, expl;
    if (tipo === 0) { // lectura sucia
      var w = ent(r, 1, v - 1);
      html = '<p>LibroID 1 tiene Disponibles = <b>' + v + '</b> (confirmado).</p><ol><li><b>A:</b> <code>BEGIN TRAN; UPDATE Libro SET Disponibles = ' + w + ' WHERE LibroID = 1;</code> (sin confirmar)</li><li><b>B</b> (READ UNCOMMITTED): <code>SELECT Disponibles …</code> → <b>¿valor 1?</b></li><li><b>A:</b> <code>ROLLBACK;</code></li><li><b>B:</b> vuelve a consultar → <b>¿valor 2?</b></li></ol>';
      campos = [['Valor 1', w], ['Valor 2', v]]; expl = 'READ UNCOMMITTED permite leer el cambio no confirmado (' + w + '): es una <b>lectura sucia</b>. Tras el ROLLBACK el dato vuelve a ' + v + '.';
    } else if (tipo === 1) { // no repetible
      var w2 = ent(r, 1, v - 1);
      html = '<p>Disponibles = <b>' + v + '</b>. <b>A</b> trabaja en READ COMMITTED.</p><ol><li><b>A:</b> <code>BEGIN TRAN; SELECT Disponibles …</code> → <b>¿lectura 1?</b></li><li><b>B</b> (autocommit): <code>UPDATE Libro SET Disponibles = ' + w2 + ' WHERE LibroID = 1;</code></li><li><b>A:</b> <code>SELECT Disponibles …</code> → <b>¿lectura 2?</b> y luego <code>COMMIT</code></li></ol><p>¿Y si A hubiera usado <b>REPEATABLE READ</b>, qué leería en la lectura 2?</p>';
      campos = [['Lectura 1', v], ['Lectura 2 (READ COMMITTED)', w2], ['Lectura 2 (REPEATABLE READ)', v]]; expl = 'En READ COMMITTED ambas lecturas son de datos confirmados pero distintas: <b>lectura no repetible</b>. Con REPEATABLE READ, B tendría que esperar al COMMIT de A, así que A vuelve a leer ' + v + '.';
    } else if (tipo === 2) { // snapshot
      var w3 = ent(r, 1, v - 1);
      html = '<p>Disponibles = <b>' + v + '</b>. La base tiene ALLOW_SNAPSHOT_ISOLATION ON.</p><ol><li><b>A:</b> <code>SET TRANSACTION ISOLATION LEVEL SNAPSHOT; BEGIN TRAN; SELECT …</code></li><li><b>B:</b> <code>UPDATE Libro SET Disponibles = ' + w3 + ' …</code> (autocommit)</li><li><b>A:</b> <code>SELECT …</code> → <b>¿valor?</b> · <code>COMMIT;</code></li><li><b>A:</b> nueva consulta fuera de la transacción → <b>¿valor?</b></li></ol>';
      campos = [['Dentro de la instantánea', v], ['Después del COMMIT', w3]]; expl = 'SNAPSHOT lee la versión confirmada al inicio de la transacción (' + v + '). Una consulta nueva después del COMMIT ve el valor actual (' + w3 + ').';
    } else if (tipo === 3) { // actualización perdida
      var a = ent(r, 1, 4), b = ent(r, 1, 4);
      html = '<p>X = <b>' + v + '</b>. T1 y T2 leen X al mismo tiempo. T1 resta ' + a + ' y guarda; después T2 resta ' + b + ' <b>al valor que leyó</b> y guarda.</p>';
      campos = [['Valor final de X', v - b], ['Valor correcto si no hubiera anomalía', v - a - b]]; expl = 'T2 sobrescribe con ' + v + ' − ' + b + ' = ' + (v - b) + ' y se pierde el descuento de T1: <b>actualización perdida</b>. Lo correcto: ' + v + ' − ' + a + ' − ' + b + ' = ' + (v - a - b) + '. Se evita con un UPDATE condicionado (SET X = X − n) o bloqueos.';
    } else { // savepoint
      var s1 = ent(r, 20, 40), s2 = ent(r, 20, 40), d1 = ent(r, 1, 5), d2 = ent(r, 1, 5), d3 = ent(r, 6, 15);
      html = '<p>Stock inicial: producto 1 = <b>' + s1 + '</b>, producto 2 = <b>' + s2 + '</b>.</p><pre class="code"><code>BEGIN TRANSACTION;\nUPDATE Productos SET stock = stock - ' + d1 + ' WHERE id_producto = 1;\nSAVE TRANSACTION paso1;\nUPDATE Productos SET stock = stock - ' + d2 + ' WHERE id_producto = 2;\nSAVE TRANSACTION paso2;\nUPDATE Productos SET stock = stock - ' + d3 + ' WHERE id_producto = 1;\nROLLBACK TRANSACTION paso2;\nCOMMIT;</code></pre>';
      campos = [['Stock final producto 1', s1 - d1], ['Stock final producto 2', s2 - d2]]; expl = 'ROLLBACK TRANSACTION paso2 deshace solo lo posterior a paso2 (la resta de ' + d3 + '). Se conservan la resta de ' + d1 + ' al producto 1 y la de ' + d2 + ' al producto 2.';
    }
    html += '<div class="grid-preg">' + campos.map(function (c, i) { return '<label>' + c[0] + ': ' + num(id + i) + '</label>'; }).join('') + '</div>';
    return {
      cat: 'concurrencia', titulo: 'Escenario de concurrencia', tema: tipo === 4 ? 'transacciones' : 'aislamiento', html: html, max: campos.length,
      corregir: function (raiz) {
        var p = 0, items = campos.map(function (c, i) { var ok = numVal(raiz, id + i) === c[1]; if (ok) p++; return fila(ok, c[0] + ' = ' + c[1]); });
        return resultado(p, campos.length, items, '<p>' + expl + '</p>');
      }
    };
  }

  /* ---------------- cadena de respaldos ---------------- */
  var DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  function genRespaldo(seed) {
    var r = rng(seed), id = nid(), conDiff = r() < 0.75, dia = ent(r, 1, 5), hora = elegir(r, [3, 9, 14, 15, 20, 22]);
    var horasLog = [6, 12, 18], disponibles = [];
    disponibles.push({ n: 'FULL · Domingo 00:00', d: 0, h: 0, t: 'FULL' });
    for (var d = 0; d <= dia; d++) {
      if (conDiff && d >= 1) { if (d < dia || hora > 0) disponibles.push({ n: 'DIFFERENTIAL · ' + DIAS[d] + ' 00:00', d: d, h: 0, t: 'DIFF' }); }
      horasLog.forEach(function (h) { if (d < dia || h < hora) disponibles.push({ n: 'LOG · ' + DIAS[d] + ' ' + String(h).padStart(2, '0') + ':00', d: d, h: h, t: 'LOG' }); });
    }
    var ultDiff = conDiff ? disponibles.filter(function (x) { return x.t === 'DIFF'; }).pop() : null;
    var corte = ultDiff ? ultDiff.d * 24 + ultDiff.h : 0;
    var necesarios = disponibles.filter(function (x) { return x.t === 'FULL' || x === ultDiff || (x.t === 'LOG' && x.d * 24 + x.h > corte); });
    var ultimo = necesarios[necesarios.length - 1];
    var mostrados = disponibles.length > 12 ? disponibles.filter(function (x) { return necesarios.indexOf(x) >= 0 || r() < 0.55; }) : disponibles;
    var html = '<p>Programa de respaldos de la base (modelo de recuperación FULL): <b>FULL</b> el domingo a las 00:00' + (conDiff ? ', <b>DIFFERENTIAL</b> de lunes a sábado a las 00:00' : '') + ' y <b>LOG</b> a las 06:00, 12:00 y 18:00 todos los días.</p><p>El disco falla el <b>' + DIAS[dia] + ' a las ' + String(hora).padStart(2, '0') + ':00</b>. Marque <b>solo</b> los respaldos necesarios para recuperar lo más reciente posible:</p>' +
      '<div class="checks col">' + mostrados.map(function (x, i) { return '<label class="check"><input type="checkbox" name="' + id + '" value="' + i + '"> ' + esc(x.n) + '</label>'; }).join('') + '</div>';
    return {
      cat: 'respaldo', titulo: 'Cadena de restauración', tema: 'backup-restore', html: html, max: 2,
      corregir: function (raiz) {
        var marc = []; raiz.querySelectorAll('input[name="' + id + '"]:checked').forEach(function (c) { marc.push(mostrados[+c.value]); });
        var sobran = marc.filter(function (x) { return necesarios.indexOf(x) < 0; }), faltan = necesarios.filter(function (x) { return marc.indexOf(x) < 0; });
        var ok = !sobran.length && !faltan.length;
        var p = ok ? 2 : (faltan.length === 0 || sobran.length === 0) && (marc.length > 0) ? 1 : 0;
        var expl = '<p><b>Orden correcto:</b> ' + necesarios.map(function (x) { return esc(x.n); }).join(' → ') + '.</p>' +
          (conDiff ? '<p>Basta el <b>último</b> diferencial (contiene todo desde el FULL) y los LOG <b>posteriores</b> a él.</p>' : '<p>Sin diferenciales, después del FULL hay que aplicar <b>todos</b> los LOG en orden: la cadena no puede tener huecos.</p>') +
          '<p>Se pierde lo hecho entre ' + esc(ultimo.n.split(' · ')[1]) + ' y la falla.</p>' +
          (faltan.length ? '<p class="bad-t">Faltan: ' + faltan.map(function (x) { return esc(x.n); }).join(', ') + '</p>' : '') + (sobran.length ? '<p class="bad-t">Sobran: ' + sobran.map(function (x) { return esc(x.n); }).join(', ') + '</p>' : '');
        return resultado(p, 2, [fila(ok, 'Conjunto de respaldos necesarios')], expl);
      }
    };
  }

  /* ---------------- recuperación con el log ---------------- */
  function genLog(seed) {
    var r = rng(seed), id = nid(), datos = ['A', 'B'], valor = { A: ent(r, 5, 20) * 10, B: ent(r, 3, 15) * 10 }, ini = { A: valor.A, B: valor.B };
    var nT = ent(r, 2, 3), ts = [1, 2, 3].slice(0, nT), confirma = {}, log = [], activos = {}, dueno = {};
    ts.forEach(function (t) { confirma[t] = r() < 0.5; });
    if (ts.every(function (t) { return confirma[t]; })) confirma[ts[ent(r, 0, nT - 1)]] = false;
    if (ts.every(function (t) { return !confirma[t]; })) confirma[ts[0]] = true;
    var pend = {}; ts.forEach(function (t) { pend[t] = ent(r, 1, 2); activos[t] = true; });
    var guard = 0;
    while (ts.some(function (t) { return pend[t] > 0 || (confirma[t] && activos[t]); }) && guard++ < 50) {
      var t = elegir(r, ts);
      if (pend[t] > 0) {
        var libres = datos.filter(function (x) { return !dueno[x] || dueno[x] === t; }); if (!libres.length) continue;
        var x = elegir(r, libres), nuevo = valor[x] + (r() < 0.5 ? -1 : 1) * ent(r, 1, 5) * 10;
        log.push({ t: t, x: x, viejo: valor[x], nuevo: nuevo }); valor[x] = nuevo; dueno[x] = t; pend[t]--;
      } else if (confirma[t] && activos[t]) { log.push({ t: t, commit: true }); activos[t] = false; Object.keys(dueno).forEach(function (k) { if (dueno[k] === t) delete dueno[k]; }); }
    }
    // transacciones que no llegaron a escribir no aparecen
    var aparecen = ts.filter(function (t) { return log.some(function (l) { return l.t === t; }); });
    var final = { A: ini.A, B: ini.B };
    log.forEach(function (l) { if (!l.commit && confirma[l.t] && log.some(function (k) { return k.commit && k.t === l.t; })) final[l.x] = l.nuevo; });
    var lineas = ['Inicio: A = ' + ini.A + ', B = ' + ini.B].concat(log.map(function (l) { return l.commit ? '<T' + l.t + ' COMMIT>' : '<T' + l.t + ', ' + l.x + ', ' + l.viejo + ' → ' + l.nuevo + '>'; })).concat(['*** CAÍDA DEL SISTEMA ***']);
    var html = '<p>Contenido del log de transacciones al momento de la caída:</p><pre class="code" data-lang="txt"><code>' + esc(lineas.join('\n')) + '</code></pre>' +
      '<div class="grid-preg">' + aparecen.map(function (t) { return '<label>T' + t + ': ' + sel(id + 't' + t, ['Rehacer (REDO)', 'Deshacer (UNDO)']) + '</label>'; }).join('') + '<label>Valor final de A: ' + num(id + 'A') + '</label><label>Valor final de B: ' + num(id + 'B') + '</label></div>';
    return {
      cat: 'log', titulo: 'Recuperación con el log', tema: 'fallas-respaldo', html: html, max: aparecen.length + 2,
      corregir: function (raiz) {
        var p = 0, items = [];
        aparecen.forEach(function (t) { var c = log.some(function (l) { return l.commit && l.t === t; }); var esp = c ? 'Rehacer (REDO)' : 'Deshacer (UNDO)'; var ok = val(raiz, id + 't' + t) === esp; if (ok) p++; items.push(fila(ok, 'T' + t + ': ' + esp + (c ? ' (tiene COMMIT)' : ' (sin COMMIT)'))); });
        ['A', 'B'].forEach(function (x) { var ok = numVal(raiz, id + x) === final[x]; if (ok) p++; items.push(fila(ok, x + ' = ' + final[x])); });
        return resultado(p, aparecen.length + 2, items, '<p>Se rehacen las transacciones con COMMIT en el log y se deshacen las demás (restaurando el valor anterior). Valor final = última escritura <b>confirmada</b> de cada dato o, si no hay, su valor inicial.</p>');
      }
    };
  }

  /* ---------------- árboles de consulta ---------------- */
  var ESCENARIOS = [
    ['Vinos', 'Cosechas', 'vnombre', 'vid', 'cantidad > 100'], ['Clientes', 'Pedidos', 'nombre', 'cliente_id', "estado = 'pendiente'"],
    ['Productos', 'Ventas', 'descripcion', 'producto_id', 'cantidad > 10'], ['Departamentos', 'Empleados', 'nombre', 'departamento_id', 'salario > 5000']
  ];
  function genArbol(seed) {
    var r = rng(seed), id = nid(), e = elegir(r, ESCENARIOS), nA = ent(r, 2, 9) * 100, nB = ent(r, 6, 30) * 100, sel_ = ent(r, 1, 9) * 10;
    var html = '<p>Estadísticas: <b>' + e[0] + '</b> = ' + nA.toLocaleString('es-CR') + ' tuplas; <b>' + e[1] + '</b> = ' + nB.toLocaleString('es-CR') + ' tuplas (cada una referencia a una sola fila de ' + e[0] + '); tuplas de ' + e[1] + ' que cumplen <code>' + esc(e[4]) + '</code> = ' + sel_ + '.</p>' +
      '<pre class="code"><code>SELECT A.' + e[2] + '\nFROM ' + e[0] + ' AS A, ' + e[1] + ' AS B\nWHERE A.id = B.' + e[3] + ' AND B.' + esc(e[4]) + ';</code></pre>' +
      '<div class="grid-preg"><label>Tuplas del producto cartesiano (opción 3): ' + num(id + 'p') + '</label><label>Tuplas que produce el join antes de seleccionar (opción 1): ' + num(id + 'j') + '</label><label>Tuplas intermedias si se selecciona primero (opción 2): ' + num(id + 's') + '</label><label>Mejor orden: ' + sel(id + 'm', ['Join, selección, proyección', 'Selección, join, proyección', 'Producto cartesiano, selección, proyección']) + '</label></div>';
    return {
      cat: 'arbol', titulo: 'Árbol de consulta', tema: 'optimizacion-proceso', html: html, max: 4,
      corregir: function (raiz) {
        var c = [[numVal(raiz, id + 'p') === nA * nB, 'Producto cartesiano = ' + nA + ' × ' + nB + ' = ' + (nA * nB).toLocaleString('es-CR')], [numVal(raiz, id + 'j') === nB, 'Join = ' + nB + ' (cada tupla de ' + e[1] + ' se une con una sola de ' + e[0] + ')'], [numVal(raiz, id + 's') === sel_, 'Selección primero = ' + sel_], [val(raiz, id + 'm') === 'Selección, join, proyección', 'Mejor: selección, join, proyección']];
        var p = c.filter(function (x) { return x[0]; }).length;
        return resultado(p, 4, c.map(function (x) { return fila(x[0], x[1]); }), '<p>Regla heurística: aplicar primero la selección reduce las filas antes del join (como en el ejemplo de vinos y cosechas de la Guía #11).</p>');
      }
    };
  }

  var GEN = {
    concurrencia: { f: genConcurrencia, titulo: 'Escenarios de concurrencia', desc: 'Qué valor lee cada sesión según el nivel de aislamiento, actualización perdida y savepoints.', tema: 'aislamiento', icono: 'layers' },
    conflictos: { f: genConflictos, titulo: 'Grafo de precedencia', desc: 'Aristas, ciclos y orden serie equivalente de una planificación.', tema: 'planificacion', icono: 'target' },
    recuperabilidad: { f: genRecup, titulo: 'Recuperabilidad', desc: 'Recuperable, sin abortos en cascada o estricta.', tema: 'recuperabilidad', icono: 'refresh' },
    marcas: { f: genTS, titulo: 'Marcas de tiempo', desc: 'Qué transacción aborta y cómo quedan R_TS y W_TS.', tema: 'marcas-tiempo', icono: 'clock' },
    respaldo: { f: genRespaldo, titulo: 'Cadena de restauración', desc: 'Qué respaldos FULL, DIFFERENTIAL y LOG hacen falta tras una falla.', tema: 'backup-restore', icono: 'file' },
    log: { f: genLog, titulo: 'Recuperación con el log', desc: 'Qué se rehace, qué se deshace y valores finales tras una caída.', tema: 'fallas-respaldo', icono: 'list' },
    arbol: { f: genArbol, titulo: 'Árboles de consulta', desc: 'Tamaños intermedios y mejor orden de operaciones.', tema: 'optimizacion-proceso', icono: 'chart' }
  };
  window.PRACTICO = { GEN: GEN, generar: function (cat, seed) { return GEN[cat].f(seed); }, _analizarRecup: analizarRecup, _aristas: aristas, _parsePlan: parsePlan, _simularTS: simularTS };
})();
