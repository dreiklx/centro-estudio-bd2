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
  var P = { leidos: {}, preg: {}, sql: {}, mongo: {}, borr: {}, ultimo: null };
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
      '<p class="muted peq" style="margin:12px 0 0">Acertadas en total: <b>' + s.qok + '</b> de ' + s.q + '.</p></div>' + html + '</div>';
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
      ? 'Ejercicios progresivos sobre el modelo Supermercado de la Guía #1 y las bases de las guías. Las consultas se ejecutan en un simulador de SQL dentro del navegador; las instrucciones propias de la administración de SQL Server se revisan por su estructura.'
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
      case 'cobertura': html = vCobertura(); break;
      default: html = vNoEncontrado();
    }
    $main.innerHTML = html;
    pintarIconos($main); decorarCodigo($main);
    document.querySelectorAll('.nav a[data-r]').forEach(function (a) { a.classList.toggle('activo', a.dataset.r === sec); if (a.dataset.r === sec) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    var titulos = { inicio: 'Inicio', estudiar: 'Estudiar', tema: arg && temaPorId[arg] ? temaPorId[arg].titulo : 'Tema', practicar: 'Practicar', sql: 'Laboratorio SQL', mongo: 'Laboratorio MongoDB', progreso: 'Mi progreso', cobertura: 'Cobertura del temario' };
    document.title = (titulos[r] || 'Centro de Estudio') + ' · Centro de Estudio BD II';
    if (r === 'estudiar') $main.querySelectorAll('[data-f]').forEach(function (b) { b.addEventListener('click', function () { filtroUnidad = b.dataset.f; render(); }); });
    if (r === 'tema') { var mb = document.getElementById('marcarLeido'); if (mb) mb.addEventListener('click', function () { if (P.leidos[arg]) delete P.leidos[arg]; else P.leidos[arg] = Date.now(); guardar(); toast(P.leidos[arg] ? 'Tema marcado como estudiado' : 'Marca quitada'); render(); }); }
    if (r === 'practicar' && arg) enlazarQuiz($main);
    if (r === 'sql' || r === 'mongo') enlazarLab($main, r, arg || (($main.querySelector('.ej-item.activo') || { getAttribute: function () { return ''; } }).getAttribute('href') || '').split('/')[2]);
    if (r === 'progreso') { var bb = document.getElementById('borrar'); bb.addEventListener('click', function () { if (!confirmarBorrado) { confirmarBorrado = true; render(); return; } confirmarBorrado = false; P = { leidos: {}, preg: {}, sql: {}, mongo: {}, borr: {}, ultimo: null }; guardar(); toast('Progreso borrado'); render(); }); }
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
