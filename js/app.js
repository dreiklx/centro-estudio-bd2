/* =====================================================================
   CENTRO DE ESTUDIO · aplicación (rutas, vistas y progreso)
   ===================================================================== */
(function () {
  'use strict';
  var EST = window.ESTUDIO, TEMAS = EST.TEMAS, UNI = EST.UNIDADES;
  var esc = EH.esc;
  var $main = document.getElementById('main');
  var NIVEL = { 1: 'Básico', 2: 'Intermedio', 3: 'Avanzado', 4: 'Desafío' };
  var DIF = { 1: 'Básico', 2: 'Intermedio', 3: 'Desafío' };
  var TIPO_Q = { mc: 'Selección única', vf: 'Verdadero o falso', num: 'Aplicación', abierta: 'Comprensión' };

  var temaPorId = {}; TEMAS.forEach(function (t, i) { t.i = i; temaPorId[t.id] = t; });
  var uniPorId = {}; UNI.forEach(function (u) { uniPorId[u.id] = u; });
  function color(uid) { return 'var(--' + uid + ')'; }

  /* ------------------------- progreso ------------------------- */
  var CLAVE = 'ceBD.v1';
  var P = { leidos: {}, preg: {}, sql: {}, mongo: {}, borr: {}, ultimo: null, simulacros: [] };
  try { var g = JSON.parse(localStorage.getItem(CLAVE) || 'null'); if (g) P = Object.assign(P, g); } catch (e) { /* sin almacenamiento */ }
  function guardar() { try { localStorage.setItem(CLAVE, JSON.stringify(P)); } catch (e) { /* ignorar */ } }

  /* ------------------------- utilidades ------------------------- */
  function h(s) { return s; }
  function hash(str) { var x = 2166136261; for (var i = 0; i < str.length; i++) { x ^= str.charCodeAt(i); x = Math.imul(x, 16777619); } return x >>> 0; }
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function barajar(arr, seed) { var a = arr.slice(), r = rng(seed); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function toast(msg) { var t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg; document.body.appendChild(t); setTimeout(function () { t.remove(); }, 2200); }
  function pct(a, b) { return b ? Math.round(a * 100 / b) : 0; }
  function barra(p, uc) { return '<div class="barra-prog" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + p + '" style="' + (uc ? '--uc:' + uc : '') + '"><i style="width:' + p + '%"></i></div>'; }

  // Preguntas con identificador estable y orden de opciones equilibrado
  var PREG = {};
  TEMAS.forEach(function (t) {
    var lista = (window.PREGUNTAS[t.id] || []).map(function (q, i) { return Object.assign({ id: t.id + '-' + (i + 1), tema: t.id }, q); });
    var k = 0;
    lista.forEach(function (q) {
      if (q.t !== 'mc') return;
      var bloque = Math.floor(k / 4), perm = barajar([0, 1, 2, 3], hash(t.id + ':' + bloque));
      var pos = perm[k % 4] % q.o.length;
      var dis = barajar(q.o.slice(1), hash(q.id));
      dis.splice(pos, 0, q.o[0]);
      q.ops = dis; q.correcta = pos; k++;
    });
    PREG[t.id] = lista;
  });
  var TODAS_PREG = [].concat.apply([], TEMAS.map(function (t) { return PREG[t.id]; }));

  // Ejercicios de laboratorio por tema
  var LAB_POR_TEMA = {};
  LAB_SQL.EJERCICIOS.forEach(function (e) { (LAB_POR_TEMA[e.tema] = LAB_POR_TEMA[e.tema] || []).push({ tipo: 'sql', e: e }); });
  LAB_MONGO.EJERCICIOS.forEach(function (e) { (LAB_POR_TEMA[e.tema] = LAB_POR_TEMA[e.tema] || []).push({ tipo: 'mongo', e: e }); });

  /* ------------------------- resaltado de código ------------------------- */
  var KW = 'SELECT FROM WHERE AND OR NOT IN IS NULL AS JOIN INNER LEFT ON GROUP BY ORDER HAVING TOP DISTINCT ASC DESC INSERT INTO VALUES UPDATE SET DELETE CREATE TABLE ALTER DROP ADD INDEX CLUSTERED NONCLUSTERED UNIQUE PRIMARY KEY FOREIGN REFERENCES IDENTITY DEFAULT CHECK VIEW PROCEDURE PROC FUNCTION RETURNS RETURN TRIGGER AFTER INSTEAD OF BEGIN END DECLARE IF ELSE WHILE BREAK CONTINUE PRINT CAST CONVERT TRY CATCH TRANSACTION TRAN COMMIT ROLLBACK SAVE ISOLATION LEVEL READ UNCOMMITTED COMMITTED REPEATABLE SERIALIZABLE SNAPSHOT EXEC EXECUTE OUTPUT CURSOR FOR OPEN FETCH NEXT CLOSE DEALLOCATE GRANT REVOKE DENY TO LOGIN USER ROLE MEMBER WITH PASSWORD BACKUP RESTORE DATABASE LOG DISK DIFFERENTIAL FORMAT INIT NAME RECOVERY REPLACE FULL USE GO BETWEEN EXISTS COUNT SUM INT INTEGER VARCHAR NVARCHAR DECIMAL DATE DATETIME BIT TEXT REORGANIZE REBUILD STATISTICS THROW WAITFOR DELAY LOCK_TIMEOUT UPDLOCK HOLDLOCK READCOMMITTEDLOCK NOCOUNT'.split(' ');
  var KWS = {}; KW.forEach(function (k) { KWS[k] = 1; });
  function resaltar(code, lang) {
    var out = '', i = 0, s = code;
    var mongo = lang === 'mongo';
    while (i < s.length) {
      var r = s.slice(i), m;
      if ((m = r.match(mongo ? /^\/\/[^\n]*/ : /^--[^\n]*/))) { out += '<span class="c">' + esc(m[0]) + '</span>'; i += m[0].length; continue; }
      if ((m = r.match(/^N?'(?:[^']|'')*'/)) || (m = r.match(/^"(?:[^"\\]|\\.)*"/))) { out += '<span class="s">' + esc(m[0]) + '</span>'; i += m[0].length; continue; }
      if ((m = r.match(/^@@?\w+/))) { out += '<span class="v">' + esc(m[0]) + '</span>'; i += m[0].length; continue; }
      if (mongo && (m = r.match(/^\$\w+/))) { out += '<span class="k">' + esc(m[0]) + '</span>'; i += m[0].length; continue; }
      if ((m = r.match(/^\d+(\.\d+)?\b/))) { out += '<span class="n">' + m[0] + '</span>'; i += m[0].length; continue; }
      if ((m = r.match(/^[A-Za-z_]\w*/))) {
        var w = m[0];
        if (mongo ? /^(db|use|find|insertOne|insertMany|updateOne|deleteOne|deleteMany|updateMany)$/.test(w) : KWS[w.toUpperCase()]) out += '<span class="k">' + w + '</span>';
        else out += esc(w);
        i += w.length; continue;
      }
      out += esc(s[i]); i++;
    }
    return out;
  }
  function decorarCodigo(raiz) {
    raiz.querySelectorAll('pre.code').forEach(function (pre) {
      var c = pre.querySelector('code'); if (!c || c.dataset.ok) return;
      var txt = c.textContent; c.innerHTML = resaltar(txt, pre.dataset.lang); c.dataset.ok = '1';
      var b = document.createElement('button'); b.className = 'copiar'; b.type = 'button'; b.textContent = 'Copiar';
      b.addEventListener('click', function () { (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(function () { b.textContent = 'Copiado'; setTimeout(function () { b.textContent = 'Copiar'; }, 1400); }).catch(function () { b.textContent = 'Seleccione y copie'; }); });
      pre.appendChild(b);
    });
  }
  function codigo(txt, lang) { return '<pre class="code" data-lang="' + (lang || 'sql') + '"><code>' + esc(txt) + '</code></pre>'; }

  /* ------------------------- estadísticas ------------------------- */
  function statsTema(id) {
    var qs = PREG[id] || [], ok = qs.filter(function (q) { return P.preg[q.id] && P.preg[q.id].ok; }).length;
    var labs = LAB_POR_TEMA[id] || [], lok = labs.filter(function (l) { return (P[l.tipo][l.e.id] || {}).ok; }).length;
    return { q: qs.length, qok: ok, l: labs.length, lok: lok, leido: !!P.leidos[id] };
  }
  function statsUnidad(uid) {
    var ts = TEMAS.filter(function (t) { return t.u === uid; }), s = { temas: ts.length, leidos: 0, q: 0, qok: 0 };
    ts.forEach(function (t) { var x = statsTema(t.id); s.leidos += x.leido ? 1 : 0; s.q += x.q; s.qok += x.qok; });
    return s;
  }
  function statsGlobal() {
    var sqlOk = LAB_SQL.EJERCICIOS.filter(function (e) { return (P.sql[e.id] || {}).ok; }).length;
    var mOk = LAB_MONGO.EJERCICIOS.filter(function (e) { return (P.mongo[e.id] || {}).ok; }).length;
    var qok = TODAS_PREG.filter(function (q) { return P.preg[q.id] && P.preg[q.id].ok; }).length;
    var resp = TODAS_PREG.filter(function (q) { return P.preg[q.id]; }).length;
    return { temas: TEMAS.length, leidos: Object.keys(P.leidos).filter(function (k) { return temaPorId[k]; }).length, q: TODAS_PREG.length, qok: qok, resp: resp, sql: LAB_SQL.EJERCICIOS.length, sqlOk: sqlOk, mongo: LAB_MONGO.EJERCICIOS.length, mOk: mOk };
  }

  /* ========================= VISTAS ========================= */
  function vInicio() {
    var s = statsGlobal(), ult = P.ultimo && temaPorId[P.ultimo];
    var total = s.temas + s.q + s.sql + s.mongo, hechos = s.leidos + s.qok + s.sqlOk + s.mOk;
    return '<div class="contenedor">' +
      '<section class="hero"><h1>Centro de Estudio · Bases de Datos II</h1>' +
      '<p>Toda la materia de las Guías #1 a #13, el programa del curso y las investigaciones finales, resumida para estudiar en minutos y practicar con ejercicios que se corrigen solos.</p>' +
      '<div class="acciones">' + (ult ? '<a class="btn primario" href="#/tema/' + ult.id + '">' + ICON('play') + 'Continuar: ' + esc(ult.titulo) + '</a>' : '<a class="btn primario" href="#/estudiar">' + ICON('book') + 'Empezar a estudiar</a>') +
      '<a class="btn" href="#/sql">' + ICON('code') + 'Laboratorio SQL</a><a class="btn" href="#/mongo">' + ICON('leaf') + 'Laboratorio MongoDB</a></div></section>' +
      '<h2>Cómo usar la plataforma</h2><div class="pasos">' +
      paso(1, 'Estudie', 'Lea el resumen de un tema: conceptos, sintaxis y ejemplos de las guías.') +
      paso(2, 'Practique', 'Responda preguntas de ese tema. Cada respuesta explica el porqué.') +
      paso(3, 'Programe', 'Escriba SQL y MongoDB en los laboratorios y compruébelo al instante.') +
      paso(4, 'Mida su avance', 'Revise qué temas domina y cuáles debe repasar.') + '</div>' +
      '<div class="rejilla" style="margin-bottom:22px">' +
      acceso('#/estudiar', 'book', 'u1', 'Estudiar', TEMAS.length + ' temas en ' + UNI.length + ' unidades.') +
      acceso('#/practicar', 'check', 'u5', 'Practicar', TODAS_PREG.length + ' preguntas por tema y dificultad.') +
      acceso('#/sql', 'code', 'u8', 'Laboratorio SQL', LAB_SQL.EJERCICIOS.length + ' ejercicios progresivos.') +
      acceso('#/mongo', 'leaf', 'u9', 'Laboratorio MongoDB', LAB_MONGO.EJERCICIOS.length + ' ejercicios de la Guía #13.') +
      acceso('#/simulacro', 'target', 'u7', 'Simulacro de examen', '10 a 20 preguntas teóricas y ejercicios prácticos, con nota.') +
      '</div>' +
      '<div class="tarjeta"><div class="resumen-quiz"><div><h2 style="margin:0">Su avance general</h2><p class="muted peq" style="margin:4px 0 0">Se guarda en este navegador.</p></div>' +
      '<div class="anillo" style="--p:' + pct(hechos, total) + '"><span>' + pct(hechos, total) + '%</span></div></div>' +
      '<div class="rejilla" style="margin-top:16px">' + mini('Temas estudiados', s.leidos + ' / ' + s.temas) + mini('Preguntas acertadas', s.qok + ' / ' + s.q) + mini('Ejercicios SQL', s.sqlOk + ' / ' + s.sql) + mini('Ejercicios MongoDB', s.mOk + ' / ' + s.mongo) + '</div>' +
      '<p style="margin:14px 0 0"><a href="#/progreso">Ver el detalle por tema →</a></p></div></div>';
    function paso(n, t, d) { return '<div class="paso"><span class="paso-n">' + n + '</span><div><b>' + t + '</b><p class="muted peq" style="margin:0">' + d + '</p></div></div>'; }
    function acceso(href, ic, u, t, d) { return '<a class="tarjeta acceso" href="' + href + '" style="--uc:' + color(u) + '"><span class="ico-caja">' + ICON(ic) + '</span><h3>' + t + '</h3><p>' + d + '</p></a>'; }
    function mini(t, v) { return '<div class="stat"><b>' + v + '</b><span>' + t + '</span></div>'; }
  }

  var filtroUnidad = 'todas';
  function vEstudiar() {
    var chips = '<div class="filtros" role="group" aria-label="Filtrar por unidad"><button class="filtro" data-f="todas" aria-pressed="' + (filtroUnidad === 'todas') + '">Todas</button>' +
      UNI.map(function (u) { return '<button class="filtro" data-f="' + u.id + '" aria-pressed="' + (filtroUnidad === u.id) + '">' + u.n + '. ' + esc(u.titulo.split(' ').slice(0, 3).join(' ')) + '</button>'; }).join('') + '</div>';
    var html = UNI.filter(function (u) { return filtroUnidad === 'todas' || filtroUnidad === u.id; }).map(function (u) {
      var su = statsUnidad(u.id);
      return '<section class="unidad" style="--uc:' + color(u.id) + '"><div class="unidad-cab"><span class="unidad-num">' + u.n + '</span><div><h2>' + esc(u.titulo) + '</h2><small>' + esc(u.desc) + ' · ' + su.leidos + '/' + su.temas + ' estudiados</small></div></div>' +
        '<div class="rejilla">' + TEMAS.filter(function (t) { return t.u === u.id; }).map(tarjetaTema).join('') + '</div></section>';
    }).join('');
    return '<div class="contenedor"><div class="encabezado"><h1>Estudiar</h1><p>Los temas siguen el orden del programa del curso. Cada uno indica de qué guía proviene. Primero se estudia, después se practica.</p></div>' + chips + html + '</div>';
  }
  function tarjetaTema(t) {
    var s = statsTema(t.id);
    return '<a class="tarjeta tema-card" href="#/tema/' + t.id + '" style="--uc:' + color(t.u) + '"><div class="chips">' + t.fuentes.map(function (f) { return '<span class="chip suave">' + EST.CORTO[f] + '</span>'; }).join('') + '</div>' +
      '<h3>' + esc(t.titulo) + '</h3><p>' + esc(t.resumen) + '</p><div class="pie"><span>' + ICON('clock') + ' ' + t.min + ' min · ' + s.q + ' preguntas</span>' + (s.leido ? '<span class="visto">' + ICON('ok') + 'Estudiado</span>' : '') + '</div></a>';
  }

  function vTema(id) {
    var t = temaPorId[id]; if (!t) return vNoEncontrado();
    P.ultimo = id; guardar();
    var u = uniPorId[t.u], prev = TEMAS[t.i - 1], next = TEMAS[t.i + 1], s = statsTema(id);
    var labs = LAB_POR_TEMA[id] || [];
    return '<div class="contenedor estrecho" style="--uc:' + color(t.u) + '">' +
      '<nav class="miga" aria-label="Ruta"><a href="#/estudiar">Estudiar</a><span>/</span><span>Unidad ' + u.n + ': ' + esc(u.titulo) + '</span></nav>' +
      '<header class="tema-cab"><div class="chips"><span class="chip u">Unidad ' + u.n + '</span>' + t.fuentes.map(function (f) { return '<span class="chip suave" title="' + esc(EST.FUENTES[f]) + '">' + EST.CORTO[f] + '</span>'; }).join('') + '<span class="chip">' + ICON('clock') + t.min + ' min</span></div><h1>' + esc(t.titulo) + '</h1><p class="muted">' + esc(t.resumen) + '</p></header>' +
      '<article class="tarjeta lectura">' + t.html() + '</article>' +
      '<div class="tarjeta fin-tema"><div><b>¿Terminó de leer?</b><p class="muted peq" style="margin:0">Márquelo y compruebe lo aprendido con ' + s.q + ' preguntas' + (labs.length ? ' y ' + labs.length + ' ejercicios de código' : '') + '.</p></div>' +
      '<div class="acciones"><button class="btn' + (s.leido ? ' ok' : '') + '" id="marcarLeido">' + ICON('ok') + (s.leido ? 'Estudiado' : 'Marcar como estudiado') + '</button><a class="btn primario" href="#/practicar/' + id + '">' + ICON('check') + 'Practicar este tema</a></div></div>' +
      (labs.length ? '<div class="tarjeta"><h3 style="margin-bottom:8px">Ejercicios de código de este tema</h3><div class="chips">' + labs.map(function (l) { return '<a class="chip suave" href="#/' + l.tipo + '/' + l.e.id + '">' + (l.tipo === 'sql' ? 'SQL ' + l.e.g + l.e.n : 'Mongo ' + l.e.n) + ' · ' + esc(l.e.titulo) + '</a>'; }).join('') + '</div></div>' : '') +
      '<nav class="tema-nav" aria-label="Temas">' + (prev ? '<a class="tarjeta" href="#/tema/' + prev.id + '"><small>← Anterior</small><b>' + esc(prev.titulo) + '</b></a>' : '<span></span>') + (next ? '<a class="tarjeta sig" href="#/tema/' + next.id + '"><small>Siguiente →</small><b>' + esc(next.titulo) + '</b></a>' : '<span></span>') + '</nav></div>';
  }

  /* ------------------------- práctica ------------------------- */
  function vPracticar() {
    var s = statsGlobal();
    var html = UNI.map(function (u) {
      return '<section class="unidad" style="--uc:' + color(u.id) + '"><div class="unidad-cab"><span class="unidad-num">' + u.n + '</span><div><h2>' + esc(u.titulo) + '</h2></div></div><div class="tarjeta" style="padding:6px 18px">' +
        TEMAS.filter(function (t) { return t.u === u.id; }).map(function (t) {
          var x = statsTema(t.id), p = pct(x.qok, x.q);
          return '<div class="prog-fila"><a href="#/practicar/' + t.id + '">' + esc(t.titulo) + (x.leido ? '' : ' <span class="chip" title="Aún no lo marca como estudiado">sin estudiar</span>') + '</a>' + barra(p, color(t.u)) + '<span class="num">' + x.qok + '/' + x.q + '</span></div>';
        }).join('') + '</div></section>';
    }).join('');
    return '<div class="contenedor"><div class="encabezado"><h1>Practicar</h1><p>Preguntas de selección única, verdadero o falso, comprensión y aplicación, organizadas por tema y dificultad. Todas evalúan lo que se explica en la sección Estudiar.</p></div>' +
      '<div class="tarjeta" style="margin-bottom:22px"><div class="resumen-quiz"><div><h2 style="margin:0">Repaso mixto</h2><p class="muted peq" style="margin:4px 0 0">12 preguntas al azar de los temas que ya marcó como estudiados (o de todos, si aún no marca ninguno).</p></div><a class="btn primario" href="#/practicar/mixta">' + ICON('refresh') + 'Iniciar repaso</a></div>' +
      '<p class="muted peq" style="margin:12px 0 0">Acertadas en total: <b>' + s.qok + '</b> de ' + s.q + '.</p></div>' +
      '<section class="unidad"><div class="unidad-cab"><span class="unidad-num" style="--uc:var(--u5)">' + ICON('target') + '</span><div><h2>Ejercicios prácticos</h2><small>Se generan nuevos cada vez y se corrigen solos: lo práctico del examen.</small></div></div>' +
      '<div class="rejilla">' + Object.keys(PRACTICO.GEN).map(function (k) { var g = PRACTICO.GEN[k], t = temaPorId[g.tema]; return '<a class="tarjeta acceso" href="#/practico/' + k + '" style="--uc:' + color(t.u) + '"><span class="ico-caja">' + ICON(g.icono) + '</span><h3>' + esc(g.titulo) + '</h3><p>' + esc(g.desc) + '</p></a>'; }).join('') +
      '<a class="tarjeta acceso" href="#/simulacro" style="--uc:var(--u7)"><span class="ico-caja">' + ICON('check') + '</span><h3>Simulacro de examen</h3><p>Teoría más práctica, con nota al final.</p></a></div></section>' +
      html + '</div>';
  }

  var filtroDif = 0, semillaMixta = Date.now();
  function vQuiz(id) {
    var mixta = id === 'mixta', t = temaPorId[id], lista;
    if (mixta) {
      var base = Object.keys(P.leidos).filter(function (k) { return temaPorId[k]; });
      var pool = [].concat.apply([], (base.length ? base : TEMAS.map(function (x) { return x.id; })).map(function (k) { return PREG[k]; }));
      lista = barajar(pool, semillaMixta).slice(0, 12);
    } else {
      if (!t) return vNoEncontrado();
      lista = PREG[id].filter(function (q) { return !filtroDif || q.d === filtroDif; });
    }
    var u = t ? uniPorId[t.u] : null;
    var cab = mixta ? '<nav class="miga"><a href="#/practicar">Practicar</a><span>/</span><span>Repaso mixto</span></nav><header class="encabezado"><h1>Repaso mixto</h1><p>Preguntas de distintos temas. Cada explicación indica qué tema repasar.</p></header>'
      : '<nav class="miga"><a href="#/practicar">Practicar</a><span>/</span><span>Unidad ' + u.n + '</span></nav><header class="tema-cab"><div class="chips"><span class="chip u">Unidad ' + u.n + '</span></div><h1>Práctica: ' + esc(t.titulo) + '</h1><p class="muted">¿Aún no lo estudia? <a href="#/tema/' + id + '">Lea primero el tema</a>.</p></header>';
    var filtros = mixta ? '' : '<div class="filtros" role="group" aria-label="Dificultad">' + [0, 1, 2, 3].map(function (d) { return '<button class="filtro" data-dif="' + d + '" aria-pressed="' + (filtroDif === d) + '">' + (d ? DIF[d] : 'Todas') + '</button>'; }).join('') + '</div>';
    var items = lista.map(function (q, i) { return tarjetaPregunta(q, i + 1, mixta); }).join('') || '<div class="tarjeta"><p class="muted" style="margin:0">No hay preguntas de esta dificultad en el tema.</p></div>';
    var labs = t ? (LAB_POR_TEMA[id] || []) : [];
    return '<div class="contenedor estrecho" style="--uc:' + (t ? color(t.u) : 'var(--primary)') + '">' + cab + filtros +
      '<div id="quiz">' + items + '</div>' +
      '<div class="tarjeta" style="margin-top:16px"><div class="resumen-quiz"><div id="marcador" aria-live="polite"></div><div class="acciones"><button class="btn" id="reintentar">' + ICON('refresh') + (mixta ? 'Otras preguntas' : 'Volver a intentar') + '</button>' + (t ? '<a class="btn" href="#/tema/' + id + '">' + ICON('book') + 'Repasar el tema</a>' : '') + '</div></div>' +
      (labs.length ? '<p class="peq" style="margin:12px 0 0">Ejercicios de código de este tema: ' + labs.map(function (l) { return '<a href="#/' + l.tipo + '/' + l.e.id + '">' + esc(l.e.titulo) + '</a>'; }).join(' · ') + '</p>' : '') + '</div></div>';
  }
  function opcionesMixtas(q) {
    if (q.t !== 'mc') return;
    if (!q.opsMix) { var pos = hash(q.id + 'm') % q.o.length, d = barajar(q.o.slice(1), hash(q.id)); d.splice(pos, 0, q.o[0]); q.opsMix = d; q.corrMix = pos; }
  }
  function tarjetaPregunta(q, n, mixta) {
    var t = temaPorId[q.tema];
    var cab = '<div class="preg-cab"><span class="preg-n">' + n + '.</span><span class="chip">' + TIPO_Q[q.t] + '</span><span class="chip suave dif dif-' + q.d + '">' + DIF[q.d] + '</span>' + (mixta ? '<span class="chip suave" style="--uc:' + color(t.u) + '">' + esc(t.titulo) + '</span>' : '') + '</div>';
    var cuerpo = '';
    if (q.t === 'mc') {
      var ops = q.ops, corr = q.correcta;
      if (mixta) { opcionesMixtas(q); ops = q.opsMix; corr = q.corrMix; }
      cuerpo = '<div class="opciones" role="group" aria-label="Opciones">' + ops.map(function (o, i) { return '<button class="opcion" type="button" data-i="' + i + '" data-c="' + corr + '"><span class="letra">' + 'ABCD'[i] + '</span><span>' + esc(o) + '</span></button>'; }).join('') + '</div>';
    } else if (q.t === 'vf') {
      cuerpo = '<div class="opciones vf" role="group" aria-label="Verdadero o falso"><button class="opcion" type="button" data-vf="1"><span class="letra">V</span><span>Verdadero</span></button><button class="opcion" type="button" data-vf="0"><span class="letra">F</span><span>Falso</span></button></div>';
    } else if (q.t === 'num') {
      cuerpo = '<form class="campo-num" data-num><label class="oculto-a11y" for="in-' + q.id + '">Respuesta</label><input id="in-' + q.id + '" inputmode="decimal" autocomplete="off" placeholder="Su respuesta"' + '><span class="muted peq">' + esc(q.u || '') + '</span><button class="btn primario chico" type="submit">Comprobar</button></form>';
    } else {
      cuerpo = '<label class="oculto-a11y" for="ab-' + q.id + '">Su respuesta</label><textarea class="abierta" id="ab-' + q.id + '" placeholder="Escriba su respuesta con sus palabras (opcional) y luego compárela."></textarea><div class="acciones" style="margin-top:8px"><button class="btn chico" type="button" data-ver>' + ICON('eye') + 'Ver respuesta modelo</button></div>';
    }
    return '<div class="tarjeta preg" data-q="' + q.id + '">' + cab + '<div class="preg-q">' + esc(q.q) + '</div>' + cuerpo + '<div class="retro-wrap" aria-live="polite"></div></div>';
  }
  function retro(ok, titulo, cuerpo, q) {
    var t = temaPorId[q.tema];
    return '<div class="retro ' + (ok === true ? 'ok' : ok === false ? 'bad' : 'neutro') + '"><div class="retro-tit">' + ICON(ok === true ? 'ok' : ok === false ? 'bad' : 'info') + titulo + '</div>' + cuerpo + '<p class="peq" style="margin-top:6px">Tema: <a href="#/tema/' + t.id + '">' + esc(t.titulo) + '</a></p></div>';
  }
  function registrar(q, ok) {
    var r = P.preg[q.id] || { ok: false, n: 0 };
    r.n++; r.ok = r.ok || ok; r.ult = ok; P.preg[q.id] = r; guardar(); marcador();
  }
  var sesion = {};
  function marcador() {
    var el = document.getElementById('marcador'); if (!el) return;
    var ids = Object.keys(sesion), ok = ids.filter(function (k) { return sesion[k]; }).length, tot = document.querySelectorAll('#quiz .preg').length;
    el.innerHTML = '<b>' + ok + ' correctas</b> de ' + ids.length + ' respondidas · ' + tot + ' en total';
  }
  function parseNum(s) {
    s = String(s).trim().replace(/\s+/g, '').replace(/[^\d.,\-]/g, '');
    if (/^-?\d{1,3}([.,]\d{3})+$/.test(s)) s = s.replace(/[.,]/g, '');
    else s = s.replace(',', '.');
    return s === '' ? NaN : parseFloat(s);
  }
  function enlazarQuiz(raiz) {
    sesion = {}; marcador();
    raiz.addEventListener('click', function (ev) {
      var b = ev.target.closest('button'); if (!b) return;
      if (b.id === 'reintentar') { if (location.hash.indexOf('mixta') >= 0) semillaMixta = Date.now(); render(); window.scrollTo(0, 0); return; }
      if (b.dataset.dif !== undefined) { filtroDif = +b.dataset.dif; render(); return; }
      var card = b.closest('.preg'); if (!card) return;
      var q = TODAS_PREG.find(function (x) { return x.id === card.dataset.q; }), wrap = card.querySelector('.retro-wrap');
      if (b.classList.contains('opcion')) {
        var botones = card.querySelectorAll('.opcion'); if (botones[0].disabled) return;
        var ok, correctoTxt;
        if (q.t === 'mc') {
          var c = +b.dataset.c, i = +b.dataset.i; ok = i === c;
          botones[c].classList.add('correcta'); if (!ok) b.classList.add('incorrecta');
          correctoTxt = botones[c].querySelector('span:last-child').textContent;
        } else {
          var v = b.dataset.vf === '1'; ok = v === q.a;
          botones[q.a ? 0 : 1].classList.add('correcta'); if (!ok) b.classList.add('incorrecta');
          correctoTxt = q.a ? 'Verdadero' : 'Falso';
        }
        botones.forEach(function (x) { x.disabled = true; });
        wrap.innerHTML = retro(ok, ok ? '¡Correcto!' : 'Incorrecto', (ok ? '' : '<p>La respuesta correcta es: <b>' + esc(correctoTxt) + '</b>.</p>') + '<p>' + esc(q.e) + '</p>', q);
        sesion[q.id] = ok; registrar(q, ok);
      }
      if (b.hasAttribute('data-ver')) {
        b.disabled = true;
        wrap.innerHTML = '<div class="retro neutro"><div class="retro-tit">' + ICON('info') + 'Respuesta modelo</div><p>' + esc(q.r) + '</p>' + (q.e ? '<p class="muted">' + esc(q.e) + '</p>' : '') + '<p class="peq"><b>Compare con la suya. ¿La tenía bien?</b></p><div class="acciones"><button class="btn chico ok" type="button" data-auto="1">Sí, la tenía bien</button><button class="btn chico" type="button" data-auto="0">Necesito repasar</button></div></div>';
      }
      if (b.dataset.auto !== undefined) {
        var ok2 = b.dataset.auto === '1';
        card.querySelectorAll('[data-auto]').forEach(function (x) { x.disabled = true; });
        sesion[q.id] = ok2; registrar(q, ok2);
        wrap.insertAdjacentHTML('beforeend', retro(ok2 ? true : null, ok2 ? 'Registrado como acertada' : 'Registrado para repasar', '', q));
      }
    });
    raiz.addEventListener('submit', function (ev) {
      var f = ev.target; if (!f.hasAttribute('data-num')) return; ev.preventDefault();
      var card = f.closest('.preg'), q = TODAS_PREG.find(function (x) { return x.id === card.dataset.q; }), wrap = card.querySelector('.retro-wrap');
      var inp = f.querySelector('input'), v = parseNum(inp.value);
      if (isNaN(v)) { wrap.innerHTML = '<div class="retro aviso"><div class="retro-tit">' + ICON('alert') + 'Escriba un número</div></div>'; inp.focus(); return; }
      var ok = Math.abs(v - q.a) <= (q.tol || 0) + 1e-9;
      inp.disabled = true; f.querySelector('button').disabled = true;
      wrap.innerHTML = retro(ok, ok ? '¡Correcto!' : 'Incorrecto', (ok ? '' : '<p>La respuesta correcta es <b>' + q.a.toLocaleString('es-CR') + (q.u ? ' ' + esc(q.u) : '') + '</b>.</p>') + '<p>' + esc(q.e) + '</p>', q);
      sesion[q.id] = ok; registrar(q, ok);
    });
  }

  /* ------------------------- laboratorios ------------------------- */
  function tablaRes(r, max) {
    if (!r || !r.columns) return '<p class="muted peq">Sin filas.</p>';
    var filas = r.values.slice(0, max || 60);
    return '<div class="resultado-tabla"><table class="t"><thead><tr>' + r.columns.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      (filas.length ? filas.map(function (row) { return '<tr>' + row.map(function (v) { return '<td>' + (v == null ? '<span class="muted">NULL</span>' : esc(typeof v === 'number' ? (Math.round(v * 100) / 100) : v)) + '</td>'; }).join('') + '</tr>'; }).join('') : '<tr><td colspan="' + r.columns.length + '" class="muted">0 filas</td></tr>') +
      '</tbody></table></div>' + (r.values.length > filas.length ? '<p class="muted peq">Mostrando ' + filas.length + ' de ' + r.values.length + ' filas.</p>' : '<p class="muted peq">' + r.values.length + ' fila(s)</p>');
  }
  function docsHTML(docs) {
    if (!docs) return '';
    if (!docs.length) return '<p class="muted peq">0 documentos.</p>';
    return codigo(docs.map(function (d) { return JSON.stringify(d).replace(/,"/g, ', "').replace(/":/g, '": ').replace(/\{"/g, '{ "').replace(/\}/g, ' }'); }).join('\n'), 'mongo') + '<p class="muted peq">' + docs.length + ' documento(s)</p>';
  }
  function esquemaSQL(clave) {
    var b = LAB_SQL.BASES[clave];
    return '<details class="desplegable"><summary>' + ICON('table') + 'Esquema de la base ' + esc(b.nombre) + '</summary><div><div class="esquema">' + b.esquema.map(function (t) {
      return '<div class="tb"><b>' + t[0] + '</b>' + t[1].map(function (c) { var pk = /\*$/.test(c); return '<span class="' + (pk ? 'pk' : '') + '">' + esc(c.replace(/\*$/, '')) + (pk ? ' (PK)' : '') + '</span>'; }).join('') + '</div>';
    }).join('') + '</div></div></details>';
  }
  function esquemaMongo(clave) {
    var d = LAB_MONGO.DATOS[clave], col = Object.keys(d)[0];
    return '<details class="desplegable"><summary>' + ICON('table') + 'Documentos iniciales de «' + col + '» (' + d[col].length + ')</summary><div>' + (d[col].length ? docsHTML(d[col]) : '<p class="muted">La colección empieza vacía.</p>') + '</div></details>';
  }

  function vLab(tipo, id) {
    var L = tipo === 'sql' ? LAB_SQL : LAB_MONGO, lista = L.EJERCICIOS;
    var e = id ? lista.find(function (x) { return x.id === id; }) : null;
    if (id && !e) return vNoEncontrado();
    if (!e) e = lista.find(function (x) { return !(P[tipo][x.id] || {}).ok; }) || lista[0];
    var hechos = lista.filter(function (x) { return (P[tipo][x.id] || {}).ok; }).length;
    var idx = lista.indexOf(e), sig = lista[idx + 1], ant = lista[idx - 1];
    var nav = '<aside class="tarjeta lab-lista" id="labLista"><button class="btn chico solo-movil" id="verLista" aria-expanded="false" style="width:100%">' + ICON('list') + 'Ver ejercicios (' + hechos + '/' + lista.length + ' resueltos)</button><div class="ej-lista-wrap">' +
      L.GRUPOS.map(function (gr) {
        var del = lista.filter(function (x) { return x.g === gr.id; });
        return '<h3>' + esc(gr.titulo) + '</h3>' + del.map(function (x) {
          var ok = (P[tipo][x.id] || {}).ok;
          return '<a class="ej-item' + (x === e ? ' activo' : '') + (ok ? ' hecho' : '') + '" href="#/' + tipo + '/' + x.id + '"' + (x === e ? ' aria-current="page"' : '') + '><span class="ej-num">' + (ok ? '✓' : (tipo === 'sql' ? x.g + x.n : x.n)) + '</span><span>' + esc(x.titulo) + '</span></a>';
        }).join('');
      }).join('') + '</div></aside>';
    var t = temaPorId[e.tema], gTit = (L.GRUPOS.find(function (gr) { return gr.id === e.g; }) || {}).titulo;
    var evalTxt = tipo === 'mongo' ? (e.tipo === 'find' ? 'Se ejecuta y se comparan los documentos devueltos' : 'Se ejecuta y se compara la colección resultante')
      : e.tipo === 'estructura' ? 'Verificación estructural de la instrucción (T-SQL no ejecutable en el simulador)' : e.tipo === 'consulta' ? 'Se ejecuta y se compara el resultado' : 'Se ejecuta y se compara el estado final de la base';
    var guardado = (P.borr[tipo + e.id] != null) ? P.borr[tipo + e.id] : '';
    var cuerpo = '<div class="tarjeta" style="--uc:' + color(t.u) + '">' +
      '<div class="chips" style="margin-bottom:10px"><span class="chip u">' + (tipo === 'sql' ? 'SQL ' + e.g + e.n : 'MongoDB ' + e.n) + '</span><span class="chip suave dif dif-' + Math.min(e.nivel, 3) + '">' + NIVEL[e.nivel] + '</span><span class="chip">' + esc(gTit) + '</span></div>' +
      '<h1 style="font-size:1.4rem">' + esc(e.titulo) + '</h1>' +
      '<p class="enunciado">' + e.enunciado + '</p>' +
      '<p class="peq muted" style="margin:0">Estudie primero: <a href="#/tema/' + t.id + '">' + esc(t.titulo) + '</a></p>' +
      (tipo === 'sql' && e.db ? esquemaSQL(e.db) : '') + (tipo === 'mongo' ? esquemaMongo(e.datos) : '') +
      '<div class="editor-caja"><div class="editor-cab"><span>' + (tipo === 'sql' ? 'SQL Server (T-SQL)' : 'MongoDB Shell (MQL)') + '</span><span>Ctrl + Enter para comprobar</span></div>' +
      '<label class="oculto-a11y" for="editor">Escriba su código</label><textarea id="editor" class="editor" spellcheck="false" autocapitalize="off" autocomplete="off" placeholder="' + (tipo === 'sql' ? 'Escriba aquí su consulta…' : 'Escriba aquí su instrucción db.coleccion.metodo(…)') + '">' + esc(guardado) + '</textarea></div>' +
      '<div class="acciones"><button class="btn primario" id="comprobar">' + ICON('play') + 'COMPROBAR</button><button class="btn" id="pista">' + ICON('bulb') + 'VER PISTA</button><button class="btn" id="solucion">' + ICON('eye') + 'VER SOLUCIÓN</button><button class="btn" id="limpiar" title="Borrar el editor">' + ICON('trash') + 'Limpiar</button></div>' +
      '<p class="etiqueta-eval" style="margin-top:10px">' + ICON('info') + evalTxt + '. El punto y coma final, las mayúsculas y los espacios no afectan la calificación.</p>' +
      '<div id="salida" aria-live="polite"></div></div>' +
      '<nav class="tema-nav">' + (ant ? '<a class="tarjeta" href="#/' + tipo + '/' + ant.id + '"><small>← Anterior</small><b>' + esc(ant.titulo) + '</b></a>' : '<span></span>') + (sig ? '<a class="tarjeta sig" href="#/' + tipo + '/' + sig.id + '"><small>Siguiente →</small><b>' + esc(sig.titulo) + '</b></a>' : '<span></span>') + '</nav>';
    var intro = '<div class="encabezado"><h1>' + (tipo === 'sql' ? 'Laboratorio SQL' : 'Laboratorio MongoDB') + '</h1><p>' + (tipo === 'sql'
      ? 'Solo los temas prácticos del examen: <b>concurrencia y transacciones</b>, <b>respaldo y recuperación</b> y <b>optimización de consultas</b>. Las consultas se ejecutan en un simulador de SQL dentro del navegador; las instrucciones de administración de SQL Server se revisan por su estructura. La <b>planificación</b> se practica en <a href="#/practico/conflictos">grafo de precedencia</a>, <a href="#/practico/recuperabilidad">recuperabilidad</a> y <a href="#/practico/marcas">marcas de tiempo</a>; <b>MongoDB</b>, en su <a href="#/mongo">laboratorio</a>.'
      : 'Escriba MQL como en la Guía #13. El laboratorio ejecuta sus instrucciones sobre las colecciones estudiantes y cursos y compara el resultado.') +
      ' Resueltos: <b>' + hechos + '/' + lista.length + '</b>.</p></div>';
    return '<div class="contenedor">' + intro + '<div class="lab">' + nav + '<div>' + cuerpo + '</div></div></div>';
  }

  function enlazarLab(raiz, tipo, id) {
    var L = tipo === 'sql' ? LAB_SQL : LAB_MONGO;
    var e = L.EJERCICIOS.find(function (x) { return x.id === id; }) || L.EJERCICIOS.find(function (x) { return raiz.querySelector('.ej-item.activo') && raiz.querySelector('.ej-item.activo').getAttribute('href') === '#/' + tipo + '/' + x.id; });
    var ed = raiz.querySelector('#editor'), sal = raiz.querySelector('#salida');
    if (!ed || !e) return;
    var lista = raiz.querySelector('#labLista'), vl = raiz.querySelector('#verLista');
    if (vl) vl.addEventListener('click', function () { var ab = lista.classList.toggle('abierta'); vl.setAttribute('aria-expanded', ab); });
    ed.addEventListener('keydown', function (ev) {
      if (ev.key === 'Tab' && !ev.shiftKey && !ev.ctrlKey) { ev.preventDefault(); var s = ed.selectionStart; ed.setRangeText('  ', s, ed.selectionEnd, 'end'); }
      if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey)) { ev.preventDefault(); comprobar(); }
    });
    ed.addEventListener('input', function () { P.borr[tipo + e.id] = ed.value; guardar(); });
    raiz.querySelector('#comprobar').addEventListener('click', comprobar);
    raiz.querySelector('#limpiar').addEventListener('click', function () { ed.value = ''; P.borr[tipo + e.id] = ''; guardar(); ed.focus(); sal.innerHTML = ''; });
    raiz.querySelector('#pista').addEventListener('click', function () {
      sal.innerHTML = '<div class="retro neutro"><div class="retro-tit">' + ICON('bulb') + 'Pista</div><p>' + esc(e.pista) + '</p></div>';
    });
    raiz.querySelector('#solucion').addEventListener('click', function () {
      var html = '<div class="retro neutro"><div class="retro-tit">' + ICON('eye') + 'Solución sugerida</div>' + codigo(e.solucion, tipo === 'sql' ? 'sql' : 'mongo') + '<p>' + e.explicacion + '</p><div id="esperado"></div><div class="acciones"><button class="btn chico" type="button" id="usarSol">Copiar al editor</button></div></div>';
      sal.innerHTML = html; decorarCodigo(sal);
      sal.querySelector('#usarSol').addEventListener('click', function () { ed.value = e.solucion; P.borr[tipo + e.id] = ed.value; guardar(); ed.focus(); });
      var esp = sal.querySelector('#esperado');
      if (tipo === 'sql') {
        if (e.tipo !== 'estructura') { esp.innerHTML = '<p class="muted peq">Calculando el resultado esperado…</p>'; MOTOR_SQL.resultadoEsperado(e).then(function (r) { esp.innerHTML = '<p><b>Resultado esperado' + (e.tipo === 'modifica' ? ' (' + esc(e.verifica ? 'vista' : e.tablas[0]) + ' después de la instrucción)' : '') + ':</b></p>' + tablaRes(r, 30); }).catch(function () { esp.innerHTML = ''; }); }
      } else {
        esp.innerHTML = '<p><b>' + (e.tipo === 'find' ? 'Documentos esperados:' : 'Colección esperada al final:') + '</b></p>' + docsHTML(MOTOR_MONGO.esperado(e)); decorarCodigo(esp);
      }
    });
    function comprobar() {
      var btn = raiz.querySelector('#comprobar'); btn.disabled = true;
      sal.innerHTML = '<p class="muted peq">' + (tipo === 'sql' ? 'Ejecutando en el simulador…' : 'Evaluando…') + '</p>';
      var pr = tipo === 'sql' ? MOTOR_SQL.calificar(e, ed.value) : Promise.resolve(MOTOR_MONGO.calificar(e, ed.value));
      pr.then(function (r) {
        var clase = r.estado === 'ok' ? 'ok' : r.estado === 'mal' ? 'bad' : 'aviso';
        var ic = r.estado === 'ok' ? 'ok' : r.estado === 'mal' ? 'bad' : 'alert';
        var html = '<div class="retro ' + clase + '"><div class="retro-tit">' + ICON(ic) + esc(r.titulo) + '</div>' +
          (r.texto ? '<p>' + esc(r.texto) + '</p>' : '') +
          (r.lista ? '<ul>' + r.lista.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '') +
          (r.nota ? '<p class="peq">' + esc(r.nota) + '</p>' : '') +
          (r.tecnico && r.tecnico !== r.texto ? '<details><summary class="peq">Mensaje técnico</summary><code class="peq">' + esc(r.tecnico) + '</code></details>' : '') +
          (r.estado === 'ok' ? '<p>' + e.explicacion + '</p>' : '') +
          (r.estado === 'mal' && r.estructural ? '<p class="peq muted">Esta instrucción se revisa por su estructura. Si cree que su versión es equivalente, compárela con la solución sugerida.</p>' : '') +
          (r.estado === 'mal' ? '<p class="peq">Repase: <a href="#/tema/' + e.tema + '">' + esc(temaPorId[e.tema].titulo) + '</a></p>' : '') +
          '</div>';
        if (tipo === 'sql' && r.resultado) html += '<p style="margin-top:12px"><b>' + (r.etiqueta ? 'Estado de ' + esc(r.etiqueta) : 'Su resultado') + ':</b></p>' + tablaRes(r.resultado, 30);
        if (tipo === 'sql' && r.esperado && r.estado !== 'ok') html += '<p><b>Resultado esperado:</b></p>' + tablaRes(r.esperado, 30);
        if (tipo === 'mongo' && r.docs) html += '<p style="margin-top:12px"><b>' + (e.tipo === 'find' ? 'Documentos devueltos' : 'Colección después de su instrucción') + ':</b></p>' + docsHTML(r.docs);
        if (tipo === 'mongo' && r.esperados && r.estado !== 'ok') html += '<p><b>Esperado:</b></p>' + docsHTML(r.esperados);
        if (r.estado === 'ok') {
          var sig = L.EJERCICIOS[L.EJERCICIOS.indexOf(e) + 1];
          if (sig) html += '<div class="acciones" style="margin-top:12px"><a class="btn primario" href="#/' + tipo + '/' + sig.id + '">Siguiente ejercicio ' + ICON('arrowR') + '</a></div>';
        }
        sal.innerHTML = html; decorarCodigo(sal);
        var reg = P[tipo][e.id] || { ok: false, n: 0 }; reg.n++; if (r.estado === 'ok') reg.ok = true; P[tipo][e.id] = reg; guardar();
        if (r.estado === 'ok') { var it = raiz.querySelector('.ej-item.activo'); if (it) { it.classList.add('hecho'); it.querySelector('.ej-num').textContent = '✓'; } }
      }).catch(function (err) {
        sal.innerHTML = '<div class="retro aviso"><div class="retro-tit">' + ICON('alert') + 'No se pudo evaluar</div><p>' + esc(String(err && err.message || err)) + '</p><p class="peq">Compare su respuesta con la solución sugerida.</p></div>';
      }).then(function () { btn.disabled = false; });
    }
    if (tipo === 'sql') MOTOR_SQL.cargar().catch(function () { sal.innerHTML = '<div class="retro aviso"><div class="retro-tit">' + ICON('alert') + 'No se cargó el simulador SQL</div><p>Recargue la página. Si abrió el archivo directamente desde la carpeta, use la versión publicada o un servidor local.</p></div>'; });
  }

  /* ------------------------- progreso ------------------------- */
  var confirmarBorrado = false;
  function vProgreso() {
    var s = statsGlobal();
    var filas = UNI.map(function (u) {
      var su = statsUnidad(u.id);
      return '<section class="unidad" style="--uc:' + color(u.id) + '"><div class="unidad-cab"><span class="unidad-num">' + u.n + '</span><div><h2>' + esc(u.titulo) + '</h2><small>' + su.leidos + '/' + su.temas + ' temas estudiados · ' + su.qok + '/' + su.q + ' preguntas acertadas</small></div></div><div class="tarjeta" style="padding:6px 18px">' +
        TEMAS.filter(function (t) { return t.u === u.id; }).map(function (t) {
          var x = statsTema(t.id), tot = x.q + x.l + 1, hecho = x.qok + x.lok + (x.leido ? 1 : 0);
          return '<div class="prog-fila"><a href="#/tema/' + t.id + '">' + (x.leido ? '<span class="visto">' + ICON('ok') + '</span> ' : '') + esc(t.titulo) + '</a>' + barra(pct(hecho, tot), color(t.u)) + '<span class="num">' + pct(hecho, tot) + '%</span></div>';
        }).join('') + '</div></section>';
    }).join('');
    var repasar = TODAS_PREG.filter(function (q) { return P.preg[q.id] && !P.preg[q.id].ok; });
    var temasRep = {}; repasar.forEach(function (q) { temasRep[q.tema] = (temasRep[q.tema] || 0) + 1; });
    return '<div class="contenedor"><div class="encabezado"><h1>Mi progreso</h1><p>El avance se guarda solo en este navegador y dispositivo.</p></div>' +
      '<div class="rejilla" style="margin-bottom:22px">' +
      tarjetaStat('Temas estudiados', s.leidos, s.temas, 'u1') + tarjetaStat('Preguntas acertadas', s.qok, s.q, 'u5') + tarjetaStat('Ejercicios SQL', s.sqlOk, s.sql, 'u8') + tarjetaStat('Ejercicios MongoDB', s.mOk, s.mongo, 'u9') + '</div>' +
      ((P.simulacros || []).length ? '<div class="tarjeta" style="margin-bottom:22px"><h2>Simulacros</h2>' + P.simulacros.slice(-5).reverse().map(function (h) { return '<div class="prog-fila"><span>' + new Date(h.fecha).toLocaleString('es-CR', { dateStyle: 'medium', timeStyle: 'short' }) + ' · teoría ' + h.teo + ' · práctica ' + h.prac + '</span>' + barra(h.nota) + '<span class="num">' + h.nota + '/100</span></div>'; }).join('') + '<p style="margin:10px 0 0"><a href="#/simulacro">Hacer otro simulacro →</a></p></div>' : '') +
      (Object.keys(temasRep).length ? '<div class="tarjeta" style="margin-bottom:22px"><h2>Para repasar</h2><p class="muted peq">Temas con preguntas que todavía no acierta.</p><div class="chips">' + Object.keys(temasRep).map(function (k) { return '<a class="chip suave" style="--uc:' + color(temaPorId[k].u) + '" href="#/practicar/' + k + '">' + esc(temaPorId[k].titulo) + ' (' + temasRep[k] + ')</a>'; }).join('') + '</div></div>' : '') +
      filas +
      '<div class="tarjeta"><h2>Reiniciar</h2><p class="muted peq">Borra temas estudiados, respuestas y ejercicios resueltos de este navegador.</p><button class="btn" id="borrar">' + ICON('trash') + (confirmarBorrado ? '¿Seguro? Pulse otra vez para borrar todo' : 'Borrar mi progreso') + '</button></div></div>';
    function tarjetaStat(t, a, b, u) { return '<div class="tarjeta" style="--uc:' + color(u) + ';display:flex;gap:16px;align-items:center"><div class="anillo" style="--p:' + pct(a, b) + '"><span>' + pct(a, b) + '%</span></div><div class="stat"><b>' + a + ' / ' + b + '</b><span>' + t + '</span></div></div>'; }
  }

  /* ------------------------- cobertura ------------------------- */
  function vCobertura() {
    var orden = ['PR', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10', 'G11', 'G12', 'G13', 'INV'];
    var filas = [];
    TEMAS.forEach(function (t) { t.cubre.forEach(function (c) { filas.push({ doc: c[0], tema: c[1], sub: c[2], t: t }); }); });
    filas.sort(function (a, b) { return orden.indexOf(a.doc) - orden.indexOf(b.doc) || a.t.i - b.t.i; });
    var porDoc = {}; filas.forEach(function (f) { porDoc[f.doc] = (porDoc[f.doc] || 0) + 1; });
    return '<div class="contenedor"><div class="encabezado"><h1>Cobertura del temario</h1><p>Matriz que relaciona cada documento de origen con sus temas y subtemas, y la sección de la plataforma donde se estudian. Incluye también la práctica disponible por sección.</p></div>' +
      '<div class="tarjeta" style="margin-bottom:18px"><div class="chips">' + orden.map(function (d) { return '<span class="chip">' + EST.CORTO[d] + ': ' + (porDoc[d] || 0) + ' entradas</span>'; }).join('') + '</div></div>' +
      '<div class="tabla-wrap"><table class="t cob-tabla"><thead><tr><th>Documento de origen</th><th>Tema</th><th>Subtema</th><th>Sección en la plataforma</th><th>Práctica</th></tr></thead><tbody>' +
      filas.map(function (f) { var s = statsTema(f.t.id); return '<tr><td>' + esc(EST.FUENTES[f.doc]) + '</td><td>' + esc(f.tema) + '</td><td>' + esc(f.sub) + '</td><td><a href="#/tema/' + f.t.id + '">Unidad ' + uniPorId[f.t.u].n + ' · ' + esc(f.t.titulo) + '</a></td><td class="peq">' + s.q + ' preg.' + (s.l ? ' · ' + s.l + ' lab.' : '') + '</td></tr>'; }).join('') +
      '</tbody></table></div><p class="muted peq">Nota: el programa del curso nombra los algoritmos de recuperación por actualización diferida, inmediata, páginas sombra y ARIES (6.2), y la optimización semántica (7.4); las guías no los desarrollan, por lo que la plataforma solo los menciona.</p></div>';
  }

  function vNoEncontrado() { return '<div class="contenedor estrecho"><div class="tarjeta"><h1>No encontrado</h1><p>Esa sección no existe.</p><a class="btn primario" href="#/inicio">Ir al inicio</a></div></div>'; }

  /* ------------------------- buscador ------------------------- */
  var INDICE = TEMAS.map(function (t) {
    var div = document.createElement('div'); div.innerHTML = t.html();
    return { t: t, titulo: t.titulo, texto: (t.titulo + ' ' + t.resumen + ' ' + div.textContent).replace(/\s+/g, ' ') };
  });
  function sinAcentos(s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
  INDICE.forEach(function (x) { x.n = sinAcentos(x.texto); x.nt = sinAcentos(x.titulo + ' ' + x.t.resumen); });
  function buscar(q) {
    var pal = sinAcentos(q).split(/\s+/).filter(function (w) { return w.length > 1; });
    if (!pal.length) return [];
    return INDICE.map(function (x) {
      var sc = 0;
      for (var i = 0; i < pal.length; i++) { var w = pal[i]; var enT = x.nt.indexOf(w) >= 0, enX = x.n.indexOf(w) >= 0; if (!enX) return null; sc += enT ? 5 : 1; sc += (x.n.split(w).length - 1) * 0.1; }
      var pos = x.n.indexOf(pal[0]), ini = Math.max(0, pos - 50);
      return { x: x, sc: sc, frag: (ini ? '…' : '') + x.texto.substr(ini, 130) + '…' };
    }).filter(Boolean).sort(function (a, b) { return b.sc - a.sc; }).slice(0, 8);
  }
  var $b = document.getElementById('buscar'), $r = document.getElementById('resBusqueda'), selB = -1;
  function pintarBusqueda() {
    var q = $b.value.trim();
    if (q.length < 2) { $r.hidden = true; return; }
    var res = buscar(q); selB = -1;
    $r.innerHTML = res.length ? res.map(function (r, i) { return '<a class="res-item" role="option" id="rb' + i + '" href="#/tema/' + r.x.t.id + '"><b>' + esc(r.x.titulo) + '</b><small>Unidad ' + uniPorId[r.x.t.u].n + ' · ' + esc(r.frag) + '</small></a>'; }).join('') : '<div class="res-vacio">Sin resultados para «' + esc(q) + '».</div>';
    $r.hidden = false;
  }
  $b.addEventListener('input', pintarBusqueda);
  $b.addEventListener('keydown', function (ev) {
    var items = $r.querySelectorAll('.res-item');
    if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') { ev.preventDefault(); if (!items.length) return; selB = (selB + (ev.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length; items.forEach(function (x, i) { x.setAttribute('aria-selected', i === selB); }); }
    if (ev.key === 'Enter') { ev.preventDefault(); var it = items[selB >= 0 ? selB : 0]; if (it) { location.hash = it.getAttribute('href'); $r.hidden = true; $b.blur(); } }
    if (ev.key === 'Escape') { $r.hidden = true; }
  });
  document.addEventListener('click', function (ev) { if (!ev.target.closest('.buscador')) $r.hidden = true; });
  $r.addEventListener('click', function () { $r.hidden = true; $b.value = ''; });

  /* ------------------------- menú móvil ------------------------- */
  var $nav = document.getElementById('nav'), $velo = document.getElementById('velo'), $mb = document.getElementById('menuBtn');
  function menu(abrir) { $nav.classList.toggle('abierto', abrir); $velo.hidden = !abrir; $mb.setAttribute('aria-expanded', abrir); $mb.innerHTML = ICON(abrir ? 'x' : 'menu'); $mb.setAttribute('aria-label', abrir ? 'Cerrar menú' : 'Abrir menú'); }
  $mb.addEventListener('click', function () { menu(!$nav.classList.contains('abierto')); });
  $velo.addEventListener('click', function () { menu(false); });
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && $nav.classList.contains('abierto')) menu(false); });

  /* ------------------------- práctica generada ------------------------- */
  var semillaPractico = Date.now();
  function vPractico(cat) {
    var g = PRACTICO.GEN[cat]; if (!g) return vNoEncontrado();
    var it = PRACTICO.generar(cat, semillaPractico), t = temaPorId[it.tema];
    vPractico.actual = it;
    return '<div class="contenedor estrecho" style="--uc:' + color(t.u) + '"><nav class="miga"><a href="#/practicar">Practicar</a><span>/</span><span>Ejercicios prácticos</span></nav>' +
      '<header class="tema-cab"><div class="chips"><span class="chip u">Práctico</span><span class="chip suave">Se genera uno nuevo cada vez</span></div><h1>' + esc(g.titulo) + '</h1><p class="muted">' + esc(g.desc) + ' Repase: <a href="#/tema/' + t.id + '">' + esc(t.titulo) + '</a>.</p></header>' +
      '<div class="tarjeta practico" id="practico">' + it.html + '<div class="acciones" style="margin-top:14px"><button class="btn primario" id="pComprobar">' + ICON('play') + 'COMPROBAR</button><button class="btn" id="pOtro">' + ICON('refresh') + 'Otro ejercicio</button></div><div id="pSalida" aria-live="polite"></div></div>' +
      '<div class="chips" style="margin-top:16px">' + Object.keys(PRACTICO.GEN).filter(function (k) { return k !== cat; }).map(function (k) { return '<a class="chip suave" href="#/practico/' + k + '">' + esc(PRACTICO.GEN[k].titulo) + '</a>'; }).join('') + '</div></div>';
  }
  function enlazarPractico(raiz, cat) {
    var c = raiz.querySelector('#pComprobar'), o = raiz.querySelector('#pOtro'); if (!c) return;
    c.addEventListener('click', function () {
      var r = vPractico.actual.corregir(raiz.querySelector('#practico')), ok = r.puntos === r.max;
      raiz.querySelector('#pSalida').innerHTML = '<div class="retro ' + (ok ? 'ok' : r.puntos ? 'aviso' : 'bad') + '"><div class="retro-tit">' + ICON(ok ? 'ok' : r.puntos ? 'alert' : 'bad') + (ok ? '¡Todo correcto!' : 'Obtuvo ' + r.puntos + ' de ' + r.max) + '</div>' + r.html + '</div>';
      var k = 'prac-' + cat; P.preg[k] = P.preg[k] || { ok: false, n: 0 }; P.preg[k].n++; if (ok) P.preg[k].ok = true; guardar();
      decorarCodigo(raiz);
    });
    o.addEventListener('click', function () { semillaPractico = Date.now(); render(); window.scrollTo(0, 0); });
  }

  /* ------------------------- simulacro de examen ------------------------- */
  var TEMAS_EXAMEN = ['transacciones', 'aislamiento', 'planificacion', 'recuperabilidad', 'bloqueos', 'marcas-tiempo', 'fallas-respaldo', 'backup-restore', 'optimizacion-proceso', 'optimizacion-practica', 'bdd-conceptos', 'servidores-vinculados', 'mongo-conceptos', 'mongo-crud', 'inv-fundamentos', 'inv-transacciones', 'inv-frameworks', 'inv-proteccion', 'inv-contenedores', 'inv-nosql', 'inv-redis', 'inv-semantica', 'inv-procesos'];
  var EXAMEN = null, nTeoria = 15, reloj = null;
  function crearExamen(n) {
    var seed = Date.now() >>> 0;
    var pool = [].concat.apply([], TEMAS_EXAMEN.map(function (k) { return PREG[k].filter(function (q) { return q.t === 'mc' || q.t === 'vf'; }); }));
    var teoria = barajar(pool, seed).slice(0, n);
    var practica = ['concurrencia', 'conflictos', 'recuperabilidad', 'marcas', 'respaldo', 'log', 'arbol'].map(function (cat, i) { var it = PRACTICO.generar(cat, seed + i * 977); it.tipo = 'gen'; return it; });
    var sqlOpt = LAB_SQL.EJERCICIOS.filter(function (e) { return e.g === 'I' && e.tipo === 'consulta'; });
    practica.push({ tipo: 'codigo', lab: 'sql', e: barajar(sqlOpt, seed)[0], max: 2, cat: 'optimizacion' });
    var mf = LAB_MONGO.EJERCICIOS.filter(function (e) { return e.tipo === 'find' && e.nivel >= 2; }), me = LAB_MONGO.EJERCICIOS.filter(function (e) { return e.tipo === 'escritura'; });
    practica.push({ tipo: 'codigo', lab: 'mongo', e: barajar(mf, seed + 1)[0], max: 2, cat: 'mongo' });
    practica.push({ tipo: 'codigo', lab: 'mongo', e: barajar(me, seed + 2)[0], max: 2, cat: 'mongo' });
    return { teoria: teoria, practica: practica, inicio: Date.now(), entregado: false };
  }
  function vSimulacro() {
    if (!EXAMEN) {
      var hist = (P.simulacros || []).slice(-5).reverse();
      return '<div class="contenedor estrecho"><div class="encabezado"><h1>Simulacro de examen</h1><p>Sigue el formato que indicó el profesor: <b>de 10 a 20 preguntas teóricas</b> y el resto <b>práctico</b>: concurrencia, planificación, respaldo, recuperación, optimización de consultas y MongoDB. Cada simulacro es distinto.</p></div>' +
        '<div class="tarjeta"><h2>Configurar</h2><label for="nTeo"><b>Preguntas teóricas:</b> <span id="nTeoV">' + nTeoria + '</span></label><input id="nTeo" type="range" min="10" max="20" value="' + nTeoria + '" style="width:100%;margin:10px 0 4px">' +
        '<p class="muted peq">Parte práctica (10 ejercicios): escenario de concurrencia · grafo de precedencia · recuperabilidad · marcas de tiempo · cadena de respaldos · recuperación con el log · árbol de consulta · reescritura SQL optimizada · 2 ejercicios de MongoDB.</p>' +
        '<p class="muted peq">Las respuestas no se revelan hasta entregar. La teoría vale 1 punto por pregunta y cada ejercicio práctico entre 2 y 5 puntos según sus partes.</p>' +
        '<button class="btn primario" id="iniciarSim">' + ICON('play') + 'Comenzar simulacro</button></div>' +
        (hist.length ? '<div class="tarjeta"><h2>Simulacros anteriores</h2>' + hist.map(function (h) { return '<div class="prog-fila"><span>' + new Date(h.fecha).toLocaleString('es-CR', { dateStyle: 'medium', timeStyle: 'short' }) + ' · teoría ' + h.teo + ' · práctica ' + h.prac + '</span>' + barra(h.nota) + '<span class="num">' + h.nota + '</span></div>'; }).join('') + '</div>' : '') + '</div>';
    }
    var E = EXAMEN, n = 0;
    var teo = E.teoria.map(function (q, i) {
      n++;
      var cuerpo = q.t === 'mc' ? '<div class="opciones">' + q.ops.map(function (o, j) { return '<label class="opcion"><input type="radio" name="sq' + i + '" value="' + j + '"><span class="letra">' + 'ABCD'[j] + '</span><span>' + esc(o) + '</span></label>'; }).join('') + '</div>'
        : '<div class="opciones vf"><label class="opcion"><input type="radio" name="sq' + i + '" value="1"><span class="letra">V</span><span>Verdadero</span></label><label class="opcion"><input type="radio" name="sq' + i + '" value="0"><span class="letra">F</span><span>Falso</span></label></div>';
      return '<div class="tarjeta preg sim-item" data-k="t' + i + '"><div class="preg-cab"><span class="preg-n">' + n + '.</span><span class="chip">' + TIPO_Q[q.t] + '</span></div><div class="preg-q">' + esc(q.q) + '</div>' + cuerpo + '<div class="sim-corr"></div></div>';
    }).join('');
    var pra = E.practica.map(function (it, i) {
      n++;
      var t = temaPorId[it.tipo === 'codigo' ? it.e.tema : it.tema];
      var cab = '<div class="preg-cab"><span class="preg-n">' + n + '.</span><span class="chip suave" style="--uc:' + color(t.u) + '">' + esc(it.tipo === 'codigo' ? (it.lab === 'sql' ? 'Optimización SQL' : 'MongoDB') : it.titulo) + '</span><span class="chip">' + (it.max) + ' pts</span></div>';
      if (it.tipo === 'gen') return '<div class="tarjeta sim-item practico" data-k="p' + i + '">' + cab + it.html + '<div class="sim-corr"></div></div>';
      var ex = it.e;
      return '<div class="tarjeta sim-item" data-k="p' + i + '">' + cab + '<p class="enunciado">' + ex.enunciado + '</p>' + (it.lab === 'sql' ? esquemaSQL(ex.db) : esquemaMongo(ex.datos)) +
        '<div class="editor-caja"><div class="editor-cab"><span>' + (it.lab === 'sql' ? 'SQL Server (T-SQL)' : 'MongoDB Shell (MQL)') + '</span></div><textarea class="editor" spellcheck="false" autocapitalize="off" data-cod="' + i + '" aria-label="Respuesta del ejercicio ' + n + '"></textarea></div><div class="sim-corr"></div></div>';
    }).join('');
    return '<div class="contenedor estrecho"><div class="barra-examen tarjeta"><div><b>Simulacro</b> · <span id="simReloj">00:00</span> · <span id="simResp"></span></div><button class="btn primario" id="entregar"' + (E.entregado ? ' hidden' : '') + '>' + ICON('check') + 'Entregar</button><button class="btn" id="nuevoSim"' + (E.entregado ? '' : ' hidden') + '>' + ICON('refresh') + 'Nuevo simulacro</button></div>' +
      '<div id="simResumen"></div><h2 class="sim-sec">Parte teórica · ' + E.teoria.length + ' preguntas</h2>' + teo + '<h2 class="sim-sec">Parte práctica · ' + E.practica.length + ' ejercicios</h2>' + pra +
      '<div class="tarjeta" style="margin-top:16px;text-align:center"><button class="btn primario" id="entregar2">' + ICON('check') + 'Entregar simulacro</button></div></div>';
  }
  function enlazarSimulacro(raiz) {
    var rango = raiz.querySelector('#nTeo');
    if (rango) {
      rango.addEventListener('input', function () { nTeoria = +rango.value; raiz.querySelector('#nTeoV').textContent = nTeoria; });
      raiz.querySelector('#iniciarSim').addEventListener('click', function () { EXAMEN = crearExamen(nTeoria); render(); window.scrollTo(0, 0); });
      return;
    }
    var E = EXAMEN;
    function contar() {
      var r = 0; E.teoria.forEach(function (q, i) { if (raiz.querySelector('input[name="sq' + i + '"]:checked')) r++; });
      var el = raiz.querySelector('#simResp'); if (el) el.textContent = r + '/' + E.teoria.length + ' teóricas respondidas';
    }
    raiz.addEventListener('change', contar); contar();
    clearInterval(reloj);
    reloj = setInterval(function () { var el = document.getElementById('simReloj'); if (!el) { clearInterval(reloj); return; } var s = Math.floor(((E.fin || Date.now()) - E.inicio) / 1000); el.textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); }, 1000);
    function entregar() {
      if (E.entregado) return;
      E.entregado = true; E.fin = Date.now();
      var pt = 0, pp = 0, mp = 0, porCat = {};
      E.teoria.forEach(function (q, i) {
        var card = raiz.querySelector('[data-k="t' + i + '"]'), m = card.querySelector('input:checked'), ok;
        var correctaIdx = q.t === 'mc' ? q.correcta : (q.a ? 0 : 1);
        var marcada = m ? (q.t === 'mc' ? +m.value : (m.value === '1' ? 0 : 1)) : -1;
        ok = marcada === correctaIdx; if (ok) pt++;
        var labels = card.querySelectorAll('.opcion'); labels[correctaIdx].classList.add('correcta'); if (marcada >= 0 && !ok) labels[marcada].classList.add('incorrecta');
        card.querySelectorAll('input').forEach(function (x) { x.disabled = true; });
        card.querySelector('.sim-corr').innerHTML = retro(ok, ok ? 'Correcta' : marcada < 0 ? 'Sin responder' : 'Incorrecta', '<p>' + esc(q.e) + '</p>', q);
        registrar(q, ok);
      });
      var pendientes = E.practica.map(function (it, i) {
        var card = raiz.querySelector('[data-k="p' + i + '"]'), cat = it.tipo === 'gen' ? it.titulo : (it.lab === 'sql' ? 'Optimización SQL' : 'MongoDB');
        function anotar(p, max, html, clase) { pp += p; mp += max; porCat[cat] = porCat[cat] || [0, 0]; porCat[cat][0] += p; porCat[cat][1] += max; card.querySelector('.sim-corr').innerHTML = '<div class="retro ' + clase + '"><div class="retro-tit">' + ICON(clase === 'ok' ? 'ok' : clase === 'bad' ? 'bad' : 'alert') + p + ' de ' + max + ' puntos</div>' + html + '</div>'; }
        card.querySelectorAll('input,select,textarea').forEach(function (x) { x.disabled = true; });
        if (it.tipo === 'gen') { var r = it.corregir(card); anotar(r.puntos, r.max, r.html, r.puntos === r.max ? 'ok' : r.puntos ? 'aviso' : 'bad'); return Promise.resolve(); }
        var cod = card.querySelector('textarea').value;
        var pr = it.lab === 'sql' ? MOTOR_SQL.calificar(it.e, cod) : Promise.resolve(MOTOR_MONGO.calificar(it.e, cod));
        return pr.then(function (r) {
          var p = r.estado === 'ok' ? 2 : 0;
          var html = '<p><b>' + esc(r.titulo) + '.</b> ' + esc(r.texto || '') + '</p>' + (r.lista ? '<ul>' + r.lista.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '') + (r.estado === 'aviso' ? '<p class="peq">No se pudo evaluar automáticamente: compare con la solución.</p>' : '') +
            '<p><b>Solución sugerida:</b></p>' + codigo(it.e.solucion, it.lab === 'sql' ? 'sql' : 'mongo') + '<p>' + it.e.explicacion + '</p>';
          anotar(p, 2, html, p ? 'ok' : r.estado === 'aviso' ? 'aviso' : 'bad');
          if (p) { P[it.lab][it.e.id] = P[it.lab][it.e.id] || { ok: false, n: 0 }; P[it.lab][it.e.id].ok = true; }
        }).catch(function () { anotar(0, 2, '<p>No se pudo evaluar. Compare con la solución:</p>' + codigo(it.e.solucion, it.lab === 'sql' ? 'sql' : 'mongo'), 'aviso'); });
      });
      Promise.all(pendientes).then(function () {
        var total = E.teoria.length + mp, nota = Math.round((pt + pp) * 100 / total);
        P.simulacros = (P.simulacros || []).concat([{ fecha: Date.now(), nota: nota, teo: pt + '/' + E.teoria.length, prac: pp + '/' + mp }]).slice(-20); guardar();
        raiz.querySelector('#simResumen').innerHTML = '<div class="tarjeta"><div class="resumen-quiz"><div><h2 style="margin:0">Resultado: ' + nota + ' / 100</h2><p class="muted" style="margin:6px 0 0">Teoría: <b>' + pt + '/' + E.teoria.length + '</b> · Práctica: <b>' + pp + '/' + mp + '</b> puntos</p></div><div class="anillo" style="--p:' + nota + '"><span>' + nota + '</span></div></div>' +
          '<div style="margin-top:12px">' + Object.keys(porCat).map(function (k) { var v = porCat[k]; return '<div class="prog-fila"><span>' + esc(k) + '</span>' + barra(pct(v[0], v[1])) + '<span class="num">' + v[0] + '/' + v[1] + '</span></div>'; }).join('') + '</div>' +
          '<p class="peq muted" style="margin-top:10px">Debajo de cada pregunta está la corrección y el tema que conviene repasar.</p></div>';
        raiz.querySelector('#entregar').hidden = true; raiz.querySelector('#nuevoSim').hidden = false; raiz.querySelector('#entregar2').parentNode.hidden = true;
        decorarCodigo(raiz); window.scrollTo(0, 0);
      });
    }
    raiz.querySelector('#entregar').addEventListener('click', entregar);
    raiz.querySelector('#entregar2').addEventListener('click', entregar);
    raiz.querySelector('#nuevoSim').addEventListener('click', function () { EXAMEN = null; render(); window.scrollTo(0, 0); });
    raiz.querySelectorAll('textarea.editor').forEach(function (ed) { ed.addEventListener('keydown', function (ev) { if (ev.key === 'Tab' && !ev.shiftKey) { ev.preventDefault(); ed.setRangeText('  ', ed.selectionStart, ed.selectionEnd, 'end'); } }); });
    if (E.practica.some(function (it) { return it.lab === 'sql'; })) MOTOR_SQL.cargar().catch(function () {});
  }

  /* ------------------------- tema claro / oscuro ------------------------- */
  var $tb = document.getElementById('temaBtn');
  function pintarTema() {
    var oscuro = document.documentElement.getAttribute('data-theme') === 'dark';
    $tb.innerHTML = ICON(oscuro ? 'sun' : 'moon');
    $tb.setAttribute('aria-label', oscuro ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
    $tb.title = oscuro ? 'Tema claro' : 'Tema oscuro';
    var m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', oscuro ? '#0e1320' : '#4338ca');
  }
  $tb.addEventListener('click', function () {
    var nuevo = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nuevo);
    try { localStorage.setItem('ceBD.tema', nuevo); } catch (e) { /* sin almacenamiento */ }
    pintarTema();
  });
  pintarTema();

  /* ------------------------- router ------------------------- */
  function render() {
    var partes = (location.hash || '#/inicio').replace(/^#\/?/, '').split('/');
    var r = partes[0] || 'inicio', arg = partes[1] ? decodeURIComponent(partes[1]) : null, html, sec = r;
    switch (r) {
      case 'inicio': html = vInicio(); break;
      case 'estudiar': html = vEstudiar(); break;
      case 'tema': html = vTema(arg); sec = 'estudiar'; break;
      case 'practicar': html = arg ? vQuiz(arg) : vPracticar(); break;
      case 'sql': case 'mongo': html = vLab(r, arg); break;
      case 'progreso': html = vProgreso(); break;
      case 'practico': html = vPractico(arg); sec = 'practicar'; break;
      case 'simulacro': html = vSimulacro(); break;
      case 'cobertura': html = vCobertura(); break;
      default: html = vNoEncontrado();
    }
    $main.innerHTML = html;
    pintarIconos($main); decorarCodigo($main);
    document.querySelectorAll('.nav a[data-r]').forEach(function (a) { a.classList.toggle('activo', a.dataset.r === sec); if (a.dataset.r === sec) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    var titulos = { inicio: 'Inicio', estudiar: 'Estudiar', tema: arg && temaPorId[arg] ? temaPorId[arg].titulo : 'Tema', practicar: 'Practicar', sql: 'Laboratorio SQL', mongo: 'Laboratorio MongoDB', progreso: 'Mi progreso', practico: 'Ejercicio práctico', simulacro: 'Simulacro de examen', cobertura: 'Cobertura del temario' };
    document.title = (titulos[r] || 'Centro de Estudio') + ' · Centro de Estudio BD II';
    if (r === 'estudiar') $main.querySelectorAll('[data-f]').forEach(function (b) { b.addEventListener('click', function () { filtroUnidad = b.dataset.f; render(); }); });
    if (r === 'tema') { var mb = document.getElementById('marcarLeido'); if (mb) mb.addEventListener('click', function () { if (P.leidos[arg]) delete P.leidos[arg]; else P.leidos[arg] = Date.now(); guardar(); toast(P.leidos[arg] ? 'Tema marcado como estudiado' : 'Marca quitada'); render(); }); }
    if (r === 'practicar' && arg) enlazarQuiz($main);
    if (r === 'practico') enlazarPractico($main, arg);
    if (r === 'simulacro') enlazarSimulacro($main);
    if (r === 'sql' || r === 'mongo') enlazarLab($main, r, arg || (($main.querySelector('.ej-item.activo') || { getAttribute: function () { return ''; } }).getAttribute('href') || '').split('/')[2]);
    if (r === 'progreso') { var bb = document.getElementById('borrar'); bb.addEventListener('click', function () { if (!confirmarBorrado) { confirmarBorrado = true; render(); return; } confirmarBorrado = false; P = { leidos: {}, preg: {}, sql: {}, mongo: {}, borr: {}, ultimo: null, simulacros: [] }; guardar(); toast('Progreso borrado'); render(); }); }
    else confirmarBorrado = false;
    menu(false);
  }
  var ultimaRuta = '';
  window.addEventListener('hashchange', function () {
    var base = location.hash.split('/').slice(0, 2).join('/');
    if (base !== ultimaRuta) filtroDif = 0;
    ultimaRuta = base;
    render();
    $main.focus({ preventScroll: true }); window.scrollTo(0, 0);
  });
  pintarIconos(document);
  render();
  window.__CE = { P: function () { return P; }, PREG: PREG, TODAS_PREG: TODAS_PREG, buscar: buscar, statsGlobal: statsGlobal };
})();
