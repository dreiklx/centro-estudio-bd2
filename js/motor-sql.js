/* =====================================================================
   MOTOR DEL LABORATORIO SQL
   - Ejecuta consultas en SQLite (sql.js) adaptando la sintaxis de
     SQL Server más común (TOP, GETDATE, YEAR, MONTH, DATEDIFF, N'..',
     dbo., corchetes, GO, IDENTITY).
   - Califica por RESULTADO (consultas) o por ESTADO (modificaciones), de
     modo que se aceptan soluciones equivalentes.
   - Para T-SQL no ejecutable, verifica la ESTRUCTURA con una forma
     normalizada: sin comentarios, sin ; final, sin diferencias de
     mayúsculas, acentos ni espacios.
   ===================================================================== */
(function () {
  var SQLlib = null, cargando = null;

  function cargar() {
    if (SQLlib) return Promise.resolve(SQLlib);
    if (!cargando) {
      cargando = window.initSqlJs({ locateFile: function (f) { return 'vendor/' + f; } }).then(function (S) { SQLlib = S; return S; });
    }
    return cargando;
  }

  /* ---------- utilidades de fecha (hora local del navegador) ---------- */
  function pad(n) { return String(n).padStart(2, '0'); }
  function ahora() { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()); }
  function hoy() { return ahora().slice(0, 10); }
  function aFecha(v) { if (v == null) return null; var s = String(v); var m = s.match(/^(\d{4})-(\d{2})-(\d{2})/); if (!m) return null; return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])); }
  function fmt(d) { return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()); }

  function registrarFunciones(db) {
    db.create_function('GETDATE', function () { return ahora(); });
    db.create_function('HOY_', function () { return hoy(); });
    db.create_function('SOLOFECHA_', function (v) { var d = aFecha(v); return d ? fmt(d) : null; });
    db.create_function('YEAR', function (v) { var d = aFecha(v); return d ? d.getUTCFullYear() : null; });
    db.create_function('MONTH', function (v) { var d = aFecha(v); return d ? d.getUTCMonth() + 1 : null; });
    db.create_function('DAY', function (v) { var d = aFecha(v); return d ? d.getUTCDate() : null; });
    db.create_function('DATEDIFF', function (u, a, b) {
      var x = aFecha(a), y = aFecha(b); if (!x || !y) return null; u = String(u).toLowerCase();
      if (u === 'year') return y.getUTCFullYear() - x.getUTCFullYear();
      if (u === 'month') return (y.getUTCFullYear() - x.getUTCFullYear()) * 12 + y.getUTCMonth() - x.getUTCMonth();
      return Math.round((y - x) / 86400000);
    });
    db.create_function('DATEADD', function (u, n, v) {
      var d = aFecha(v); if (!d) return null; u = String(u).toLowerCase(); n = +n;
      if (u === 'year') d.setUTCFullYear(d.getUTCFullYear() + n); else if (u === 'month') d.setUTCMonth(d.getUTCMonth() + n); else d.setUTCDate(d.getUTCDate() + n);
      return fmt(d);
    });
    db.create_function('ISNULL', function (a, b) { return a == null ? b : a; });
    db.create_function('LEN', function (a) { return a == null ? null : String(a).replace(/\s+$/, '').length; });
    db.create_function('CONCAT', function () { return Array.prototype.map.call(arguments, function (x) { return x == null ? '' : String(x); }).join(''); });
  }

  /* ---------- separar literales de texto para no tocarlos ---------- */
  function protegerTextos(sql) {
    var textos = [], out = '', i = 0;
    while (i < sql.length) {
      var ch = sql[i];
      if (ch === '-' && sql[i + 1] === '-') { while (i < sql.length && sql[i] !== '\n') i++; continue; }
      if (ch === '/' && sql[i + 1] === '*') { var f = sql.indexOf('*/', i + 2); i = f < 0 ? sql.length : f + 2; out += ' '; continue; }
      if (ch === "'") {
        var j = i + 1, t = "'";
        while (j < sql.length) { if (sql[j] === "'" && sql[j + 1] === "'") { t += "''"; j += 2; continue; } if (sql[j] === "'") { t += "'"; j++; break; } t += sql[j]; j++; }
        // prefijo N de Unicode: N'texto'
        if (/[Nn]$/.test(out) && !/[A-Za-z0-9_@#]$/.test(out.slice(0, -1))) out = out.slice(0, -1);
        out += '\u0001' + textos.length + '\u0001'; textos.push(t); i = j; continue;
      }
      out += ch; i++;
    }
    return { code: out, textos: textos };
  }
  function restaurar(code, textos) { return code.replace(/\u0001(\d+)\u0001/g, function (_, n) { return textos[+n]; }); }

  /* ---------- traducción mínima de T-SQL a SQLite ---------- */
  function traducir(sql) {
    var p = protegerTextos(sql), c = p.code;
    c = c.replace(/^\s*GO\s*$/gim, ';');
    c = c.replace(/\[([^\]\n]+)\]/g, '$1');
    c = c.replace(/\bdbo\s*\.\s*/gi, '');
    c = c.replace(/CAST\s*\(\s*GETDATE\s*\(\s*\)\s+AS\s+DATE\s*\)/gi, 'HOY_()');
    c = c.replace(/CONVERT\s*\(\s*DATE\s*,\s*GETDATE\s*\(\s*\)\s*\)/gi, 'HOY_()');
    c = c.replace(/CAST\s*\(\s*([^()]+?)\s+AS\s+DATE\s*\)/gi, 'SOLOFECHA_($1)');
    c = c.replace(/CONVERT\s*\(\s*DATE\s*,\s*([^()]+?)\s*\)/gi, 'SOLOFECHA_($1)');
    c = c.replace(/\b(DATEDIFF|DATEADD)\s*\(\s*(DAY|DD|D|MONTH|MM|M|YEAR|YY|YYYY)\s*,/gi, function (_, f, u) {
      u = u.toUpperCase(); var k = /^(DAY|DD|D)$/.test(u) ? 'day' : /^(MONTH|MM|M)$/.test(u) ? 'month' : 'year';
      return f.toUpperCase() + "('" + k + "',";
    });
    c = c.replace(/\bINT\s+IDENTITY\s*(\(\s*\d+\s*,\s*\d+\s*\))?\s+PRIMARY\s+KEY/gi, 'INTEGER PRIMARY KEY');
    c = c.replace(/\bINT\s+PRIMARY\s+KEY\s+IDENTITY\s*(\(\s*\d+\s*,\s*\d+\s*\))?/gi, 'INTEGER PRIMARY KEY');
    c = c.replace(/\bIDENTITY\s*(\(\s*\d+\s*,\s*\d+\s*\))?/gi, '');
    // TOP n → LIMIT n (por instrucción)
    c = c.split(';').map(function (st) {
      var m = st.match(/^(\s*SELECT\s+(?:DISTINCT\s+)?)TOP\s*\(?\s*(\d+)\s*\)?/i);
      if (!m) return st;
      return st.replace(/^(\s*SELECT\s+(?:DISTINCT\s+)?)TOP\s*\(?\s*\d+\s*\)?/i, '$1') + ' LIMIT ' + m[2];
    }).join(';');
    return restaurar(c, p.textos);
  }

  /* ---------- normalización para comparar estructura ---------- */
  function normalizar(sql, opciones) {
    opciones = opciones || {};
    var p = protegerTextos(sql);
    var c = p.code;
    c = c.replace(/^\s*GO\s*$/gim, ' ');
    c = restaurar(c, p.textos);
    c = c.normalize('NFD').replace(/[̀-ͯ]/g, '');
    c = c.toUpperCase();
    c = c.replace(/\[([^\]\n]+)\]/g, '$1');
    if (!opciones.keepDbo) c = c.replace(/\bDBO\s*\.\s*/g, '');
    c = c.replace(/\s+/g, ' ');
    c = c.replace(/\s*([(),=;<>+\-\/])\s*/g, '$1');
    c = c.replace(/\)(?=[A-Z0-9_@#'])/g, ') ');
    c = c.replace(/;+/g, ' ').replace(/\s+/g, ' ').trim();
    return c;
  }

  /* ---------- ejecución ---------- */
  function nuevaBD(clave) {
    var db = new SQLlib.Database();
    registrarFunciones(db);
    db.exec(LAB_SQL.BASES[clave].sql());
    db.exec('PRAGMA foreign_keys = ON;');
    return db;
  }
  function ejecutar(db, sql) {
    var t = traducir(sql), res = db.exec(t);
    if (res.length) return res[res.length - 1];
    // SELECT sin filas: sql.js no devuelve tabla; se obtienen las columnas igual
    var ult = t.split(';').map(function (x) { return x.trim(); }).filter(Boolean).pop() || '';
    if (/^(SELECT|WITH)\b/i.test(ult)) { var st = db.prepare(ult); var cols = st.getColumnNames(); st.free(); return { columns: cols, values: [] }; }
    return null;
  }
  function volcar(db, tabla) {
    var r = db.exec('SELECT * FROM ' + tabla + ' ORDER BY 1');
    return r.length ? r[0] : { columns: [], values: [] };
  }

  function normValor(v) {
    if (v == null) return '∅';
    if (typeof v === 'number') return (Math.round(v * 100) / 100).toFixed(2);
    var s = String(v).trim();
    if (/^-?\d+(\.\d+)?$/.test(s)) return (Math.round(parseFloat(s) * 100) / 100).toFixed(2);
    return s.toLowerCase();
  }
  // Firma de fila independiente del orden de columnas
  function firma(row) { return row.map(normValor).sort().join('\u0002'); }
  function compararTablas(a, b, ordenado) {
    a = a || { columns: [], values: [] }; b = b || { columns: [], values: [] };
    if (a.columns.length !== b.columns.length) return { ok: false, motivo: 'columnas', esperado: b.columns.length, obtenido: a.columns.length };
    if (a.values.length !== b.values.length) return { ok: false, motivo: 'filas', esperado: b.values.length, obtenido: a.values.length };
    var fa = a.values.map(firma), fb = b.values.map(firma);
    if (!ordenado) { fa.sort(); fb.sort(); }
    for (var i = 0; i < fa.length; i++) if (fa[i] !== fb[i]) return { ok: false, motivo: ordenado && a.values.map(firma).sort().join() === b.values.map(firma).sort().join() ? 'orden' : 'valores' };
    return { ok: true };
  }

  function mensajeError(e) {
    var m = String(e && e.message || e);
    var t = m;
    var x;
    if ((x = m.match(/no such column: (.+)/))) t = 'No existe la columna ' + x[1] + '. Revise el nombre o el alias de la tabla.';
    else if ((x = m.match(/no such table: (.+)/))) t = 'No existe la tabla ' + x[1] + '. Revise el nombre en el esquema.';
    else if ((x = m.match(/no such function: (.+)/))) t = 'El simulador no reconoce la función ' + x[1] + '.';
    else if (/FOREIGN KEY constraint failed/.test(m)) t = 'Se violó una clave foránea: hay filas en otra tabla que dependen de las que intenta borrar o modificar.';
    else if (/CHECK constraint failed/.test(m)) t = 'Se violó una restricción CHECK (por ejemplo, un valor negativo no permitido).';
    else if (/UNIQUE constraint failed|PRIMARY KEY/.test(m)) t = 'Se repitió un valor de clave primaria o único.';
    else if (/syntax error|incomplete input/.test(m)) t = 'Error de sintaxis cerca de: ' + (m.match(/near "([^"]*)"/) || [, '…'])[1];
    else if (/misuse of aggregate|GROUP BY/i.test(m)) t = 'Uso incorrecto de una función de agregado: revise el GROUP BY.';
    else if (/ambiguous column name: (.+)/.test(m)) t = 'Columna ambigua: ' + m.match(/ambiguous column name: (.+)/)[1] + '. Use el alias de la tabla (p. ej. P.DESCRIPCION).';
    return { tecnico: m, texto: t, restriccion: /FOREIGN KEY|CHECK constraint/.test(m) };
  }

  function verificarPatrones(norm, e) {
    var faltan = [];
    (e.requerido || []).forEach(function (r) { if (!new RegExp(r[0]).test(norm)) faltan.push(r[1]); });
    var prohib = [];
    (e.prohibido || []).forEach(function (r) { if (new RegExp(r[0]).test(norm)) prohib.push(r[1]); });
    return { faltan: faltan, prohib: prohib };
  }

  /* ---------- calificación ----------
     estado: 'ok' | 'mal' | 'aviso' (no se pudo evaluar con seguridad) */
  function calificar(e, codigo) {
    var limpio = String(codigo || '').trim();
    if (!limpio) return Promise.resolve({ estado: 'aviso', titulo: 'Editor vacío', texto: 'Escriba su respuesta antes de comprobar.' });

    if (e.tipo === 'estructura') {
      var n = normalizar(limpio, { keepDbo: e.keepDbo });
      var faltan = (e.checks || []).filter(function (c) { return !new RegExp(c[0]).test(n); }).map(function (c) { return c[1]; });
      var pr = verificarPatrones(n, e);
      faltan = faltan.concat(pr.faltan);
      if (pr.prohib.length) return Promise.resolve({ estado: 'mal', titulo: 'Revise su respuesta', lista: pr.prohib.concat(faltan), estructural: true });
      if (!faltan.length) return Promise.resolve({ estado: 'ok', titulo: '¡Correcto!', texto: 'Su instrucción contiene todos los elementos requeridos.', estructural: true });
      return Promise.resolve({ estado: 'mal', titulo: 'Le falta algo', lista: faltan, estructural: true });
    }

    return cargar().then(function () {
      var dbA = null, dbS = null;
      try {
        dbS = nuevaBD(e.db);
        var veces = e.veces || 1, i, rs = null, ra = null;
        for (i = 0; i < veces; i++) rs = ejecutar(dbS, e.solucion);
        dbA = nuevaBD(e.db);
        try { for (i = 0; i < veces; i++) ra = ejecutar(dbA, limpio); }
        catch (err) {
          var me = mensajeError(err);
          if (me.restriccion) return { estado: 'mal', titulo: 'La base rechazó la operación', texto: me.texto + (veces > 1 ? ' Ocurrió al ejecutar su instrucción por ' + (i + 1) + 'ª vez.' : ''), tecnico: me.tecnico };
          return { estado: 'aviso', titulo: 'No se pudo ejecutar', texto: me.texto, tecnico: me.tecnico, nota: 'Si usó una función propia de SQL Server que el simulador no reconoce, compare su respuesta con la solución sugerida.' };
        }
        var n = normalizar(limpio, {});
        var pr = verificarPatrones(n, e);

        if (e.tipo === 'consulta') {
          if (!ra) return { estado: 'mal', titulo: 'No devolvió resultados', texto: 'Su instrucción no produjo una tabla de resultados. Este ejercicio pide una consulta SELECT.' };
          var cmp = compararTablas(ra, rs, e.ordenado);
          var base = { resultado: ra, esperado: rs };
          if (!cmp.ok) {
            var t = cmp.motivo === 'columnas' ? 'Su consulta devuelve ' + cmp.obtenido + ' columna(s); se esperaban ' + cmp.esperado + '. Revise qué columnas pide el enunciado.'
              : cmp.motivo === 'filas' ? 'Su consulta devuelve ' + cmp.obtenido + ' fila(s); se esperaban ' + cmp.esperado + '. Revise la condición del WHERE o los JOIN.'
              : cmp.motivo === 'orden' ? 'Las filas son correctas, pero el orden no. Revise el ORDER BY.'
              : 'Tiene la cantidad correcta de filas y columnas, pero algunos valores no coinciden.';
            return Object.assign(base, { estado: 'mal', titulo: 'El resultado no coincide', texto: t });
          }
          if (pr.prohib.length || pr.faltan.length) return Object.assign(base, { estado: 'mal', titulo: 'Resultado correcto, pero…', lista: pr.prohib.concat(pr.faltan) });
          return Object.assign(base, { estado: 'ok', titulo: '¡Correcto!', texto: 'Su consulta devuelve exactamente el resultado esperado.' });
        }

        // modifica: comparar el estado de las tablas o de la vista
        var objetivos = e.verifica ? [e.verifica] : (e.tablas || []);
        for (var k = 0; k < objetivos.length; k++) {
          var q = e.verifica ? e.verifica : objetivos[k];
          var ta, ts;
          try { ta = e.verifica ? dbA.exec(q)[0] : volcar(dbA, q); }
          catch (err2) { var m2 = mensajeError(err2); return { estado: 'mal', titulo: 'No se encontró lo esperado', texto: m2.texto + ' Revise el nombre del objeto que debía crear.' }; }
          ts = e.verifica ? dbS.exec(q)[0] : volcar(dbS, q);
          var c2 = compararTablas(ta, ts, false);
          if (!c2.ok) {
            var t2 = c2.motivo === 'columnas' ? 'La tabla ' + (e.verifica ? 'o vista ' : '') + 'quedó con ' + c2.obtenido + ' columna(s); se esperaban ' + c2.esperado + '.'
              : c2.motivo === 'filas' ? 'Después de su instrucción, ' + (e.verifica ? 'la vista' : q) + ' tiene ' + c2.obtenido + ' fila(s); se esperaban ' + c2.esperado + '.'
              : 'Los datos resultantes en ' + (e.verifica ? 'la vista' : q) + ' no coinciden con lo esperado.';
            return { estado: 'mal', titulo: 'El estado final no coincide', texto: t2, resultado: ta, esperado: ts, etiqueta: e.verifica ? 'vista' : q };
          }
        }
        if (pr.prohib.length || pr.faltan.length) return { estado: 'mal', titulo: 'Revise su respuesta', lista: pr.prohib.concat(pr.faltan) };
        var res = e.verifica ? dbA.exec(e.verifica)[0] : volcar(dbA, objetivos[0]);
        return { estado: 'ok', titulo: '¡Correcto!', texto: 'El estado final de la base coincide con el esperado.', resultado: res, etiqueta: e.verifica ? 'vista' : objetivos[0] };
      } finally {
        if (dbA) dbA.close();
        if (dbS) dbS.close();
      }
    });
  }

  // Ejecuta la solución para mostrar el resultado esperado
  function resultadoEsperado(e) {
    if (e.tipo === 'estructura') return Promise.resolve(null);
    return cargar().then(function () {
      var db = nuevaBD(e.db);
      try {
        var r = null; for (var i = 0; i < (e.veces || 1); i++) r = ejecutar(db, e.solucion);
        if (e.tipo === 'modifica') r = e.verifica ? db.exec(e.verifica)[0] : volcar(db, e.tablas[0]);
        return r;
      } finally { db.close(); }
    });
  }

  window.MOTOR_SQL = { cargar: cargar, calificar: calificar, normalizar: normalizar, traducir: traducir, resultadoEsperado: resultadoEsperado, _compararTablas: compararTablas, _nuevaBD: function (k) { return nuevaBD(k); }, _ejecutar: ejecutar };
})();
