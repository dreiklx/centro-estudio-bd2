/* =====================================================================
   MOTOR DEL LABORATORIO MONGODB
   Intérprete propio (sin eval) del subconjunto de MQL de la Guía #13:
   use, insertOne, insertMany, find, updateOne ($set), deleteOne,
   deleteMany y los operadores $gt $lt $gte $lte $ne $or.
   También acepta equivalentes razonables (updateMany, $inc, $and, $in,
   $eq, .pretty()) para no penalizar soluciones correctas.
   Califica comparando RESULTADOS o el ESTADO final de la colección.
   ===================================================================== */
(function () {
  function ErrorMQL(msg) { var e = new Error(msg); e.mql = true; return e; }

  /* ---------------- analizador léxico/sintáctico ---------------- */
  function Parser(src) { this.s = src; this.i = 0; }
  Parser.prototype.esp = function () {
    var s = this.s;
    for (;;) {
      while (this.i < s.length && /[\s;]/.test(s[this.i])) this.i++;
      if (s[this.i] === '/' && s[this.i + 1] === '/') { while (this.i < s.length && s[this.i] !== '\n') this.i++; continue; }
      if (s[this.i] === '/' && s[this.i + 1] === '*') { var f = s.indexOf('*/', this.i + 2); this.i = f < 0 ? s.length : f + 2; continue; }
      break;
    }
  };
  Parser.prototype.blancos = function () { // sin consumir ';'
    var s = this.s;
    for (;;) {
      while (this.i < s.length && /\s/.test(s[this.i])) this.i++;
      if (s[this.i] === '/' && s[this.i + 1] === '/') { while (this.i < s.length && s[this.i] !== '\n') this.i++; continue; }
      if (s[this.i] === '/' && s[this.i + 1] === '*') { var f = s.indexOf('*/', this.i + 2); this.i = f < 0 ? s.length : f + 2; continue; }
      break;
    }
  };
  Parser.prototype.ver = function (c) { this.blancos(); return this.s[this.i] === c; };
  Parser.prototype.esperar = function (c, ctx) {
    this.blancos();
    if (this.s[this.i] !== c) throw ErrorMQL('Se esperaba «' + c + '»' + (ctx ? ' ' + ctx : '') + ' y se encontró «' + (this.s[this.i] || 'fin del texto') + '».');
    this.i++;
  };
  Parser.prototype.ident = function () {
    this.blancos();
    var m = this.s.slice(this.i).match(/^[A-Za-z_$][\w$]*/);
    if (!m) return null;
    this.i += m[0].length; return m[0];
  };
  Parser.prototype.texto = function () {
    var q = this.s[this.i], out = ''; this.i++;
    while (this.i < this.s.length && this.s[this.i] !== q) {
      if (this.s[this.i] === '\\') { this.i++; out += this.s[this.i] || ''; this.i++; continue; }
      if (this.s[this.i] === '\n') throw ErrorMQL('Un texto no se cerró con comillas.');
      out += this.s[this.i++];
    }
    if (this.s[this.i] !== q) throw ErrorMQL('Un texto no se cerró con comillas.');
    this.i++; return out;
  };
  Parser.prototype.valor = function () {
    this.blancos();
    var c = this.s[this.i];
    if (c === '{') return this.objeto();
    if (c === '[') return this.arreglo();
    if (c === '"' || c === "'" || c === '“' || c === '”') {
      if (c === '“' || c === '”') throw ErrorMQL('Use comillas rectas (") en lugar de comillas tipográficas (“ ”).');
      return this.texto();
    }
    var m = this.s.slice(this.i).match(/^-?\d+(\.\d+)?/);
    if (m) { this.i += m[0].length; return parseFloat(m[0]); }
    var id = this.ident();
    if (id === 'true') return true;
    if (id === 'false') return false;
    if (id === 'null') return null;
    if (id) throw ErrorMQL('Valor no reconocido: «' + id + '». Si es un texto, escríbalo entre comillas: "' + id + '".');
    throw ErrorMQL('Se esperaba un valor y se encontró «' + (c || 'fin del texto') + '».');
  };
  Parser.prototype.objeto = function () {
    this.esperar('{'); var o = {};
    for (;;) {
      if (this.ver('}')) { this.i++; return o; }
      this.blancos();
      var c = this.s[this.i], k;
      if (c === '"' || c === "'") k = this.texto();
      else {
        k = this.ident();
        if (!k) throw ErrorMQL('Se esperaba el nombre de un campo y se encontró «' + (c || 'fin del texto') + '».');
        if (this.s[this.i] === '.') throw ErrorMQL('Los campos con punto, como ' + k + '.…, deben ir entre comillas: "' + k + '.' + (this.s.slice(this.i + 1).match(/^\w+/) || ['campo'])[0] + '".');
      }
      this.esperar(':', 'después del campo «' + k + '»');
      o[k] = this.valor();
      this.blancos();
      if (this.s[this.i] === ',') { this.i++; continue; }
      if (this.s[this.i] === '}') { this.i++; return o; }
      throw ErrorMQL('Falta una coma o una llave de cierre «}» después del campo «' + k + '».');
    }
  };
  Parser.prototype.arreglo = function () {
    this.esperar('['); var a = [];
    for (;;) {
      if (this.ver(']')) { this.i++; return a; }
      a.push(this.valor());
      this.blancos();
      if (this.s[this.i] === ',') { this.i++; continue; }
      if (this.s[this.i] === ']') { this.i++; return a; }
      throw ErrorMQL('Falta una coma o un corchete de cierre «]» en el arreglo.');
    }
  };
  // Instrucciones: use x | db.col.metodo(args)[.pretty()]
  Parser.prototype.instrucciones = function () {
    var lista = [];
    for (;;) {
      this.esp();
      if (this.i >= this.s.length) return lista;
      var inicio = this.i;
      var id = this.ident();
      if (id === 'use') { var nom = this.ident(); if (!nom) throw ErrorMQL('Indique el nombre de la base después de use.'); lista.push({ tipo: 'use', base: nom }); continue; }
      if (id !== 'db') throw ErrorMQL('Cada instrucción debe empezar con db. (o use). Se encontró: «' + this.s.slice(inicio, inicio + 20).split('\n')[0] + '».');
      this.blancos();
      this.esperar('.', 'después de db');
      var col = this.ident();
      if (!col) throw ErrorMQL('Falta el nombre de la colección después de db.');
      this.esperar('.', 'después de la colección');
      var met = this.ident();
      if (!met) throw ErrorMQL('Falta el método (find, insertOne…) después de db.' + col + '.');
      this.esperar('(', 'después de ' + met);
      var args = [];
      if (!this.ver(')')) {
        for (;;) { args.push(this.valor()); this.blancos(); if (this.s[this.i] === ',') { this.i++; continue; } break; }
      }
      this.esperar(')', 'para cerrar ' + met + '(…)');
      var cadena = [];
      while (this.ver('.')) {
        this.i++; var m2 = this.ident(); this.esperar('('); this.esperar(')'); cadena.push(m2);
      }
      lista.push({ tipo: 'op', col: col, met: met, args: args, cadena: cadena });
    }
  };

  /* ---------------- evaluación ---------------- */
  function obtener(doc, ruta) {
    var partes = ruta.split('.'), v = doc;
    for (var i = 0; i < partes.length; i++) { if (v == null || typeof v !== 'object') return undefined; v = v[partes[i]]; }
    return v;
  }
  function asignar(doc, ruta, valor, sumar) {
    var partes = ruta.split('.'), o = doc;
    for (var i = 0; i < partes.length - 1; i++) { if (o[partes[i]] == null || typeof o[partes[i]] !== 'object') o[partes[i]] = {}; o = o[partes[i]]; }
    var k = partes[partes.length - 1];
    if (sumar) { if (o[k] != null && typeof o[k] !== 'number') throw ErrorMQL('$inc solo funciona con campos numéricos.'); o[k] = (o[k] || 0) + valor; }
    else o[k] = clonar(valor);
  }
  function clonar(v) { return v == null ? v : JSON.parse(JSON.stringify(v)); }
  function canon(v) {
    if (Array.isArray(v)) return '[' + v.map(canon).join(',') + ']';
    if (v && typeof v === 'object') return '{' + Object.keys(v).sort().map(function (k) { return JSON.stringify(k) + ':' + canon(v[k]); }).join(',') + '}';
    return JSON.stringify(v);
  }
  function igual(a, b) { return canon(a) === canon(b); }
  function esOperador(c) { return c && typeof c === 'object' && !Array.isArray(c) && Object.keys(c).length > 0 && Object.keys(c).every(function (k) { return k[0] === '$'; }); }
  function comparar(a, b) { if (typeof a !== typeof b || a == null || b == null) return null; return a < b ? -1 : a > b ? 1 : 0; }

  function cumple(doc, filtro) {
    if (filtro == null) return true;
    if (typeof filtro !== 'object' || Array.isArray(filtro)) throw ErrorMQL('El filtro debe ser un documento { … }.');
    return Object.keys(filtro).every(function (k) {
      var c = filtro[k];
      if (k === '$or' || k === '$and') {
        if (!Array.isArray(c)) throw ErrorMQL(k + ' recibe un arreglo de condiciones: ' + k + ': [ { … }, { … } ]');
        return k === '$or' ? c.some(function (f) { return cumple(doc, f); }) : c.every(function (f) { return cumple(doc, f); });
      }
      if (k[0] === '$') throw ErrorMQL('Operador no reconocido al nivel del filtro: ' + k + '.');
      var v = obtener(doc, k);
      if (esOperador(c)) {
        return Object.keys(c).every(function (op) {
          var x = c[op], r;
          switch (op) {
            case '$eq': return igual(v, x);
            case '$ne': return !igual(v, x);
            case '$gt': r = comparar(v, x); return r === 1;
            case '$gte': r = comparar(v, x); return r === 1 || r === 0;
            case '$lt': r = comparar(v, x); return r === -1;
            case '$lte': r = comparar(v, x); return r === -1 || r === 0;
            case '$in': if (!Array.isArray(x)) throw ErrorMQL('$in recibe un arreglo.'); return x.some(function (y) { return igual(v, y); });
            case '$nin': if (!Array.isArray(x)) throw ErrorMQL('$nin recibe un arreglo.'); return !x.some(function (y) { return igual(v, y); });
            default: throw ErrorMQL('Operador no reconocido: ' + op + '. Los operadores de la guía son $gt, $lt, $gte, $lte, $ne y $or.');
          }
        });
      }
      return igual(v, c);
    });
  }

  function Base(datos) { this.cols = {}; this.n = 0; var self = this; Object.keys(datos || {}).forEach(function (k) { self.cols[k] = clonar(datos[k]); }); }
  Base.prototype.col = function (nombre) { if (!this.cols[nombre]) this.cols[nombre] = []; return this.cols[nombre]; };
  Base.prototype.nuevoId = function () { this.n++; return 'nuevo' + this.n; };
  Base.prototype.ejecutar = function (ins) {
    if (ins.tipo === 'use') return { tipo: 'use', base: ins.base };
    var col = this.col(ins.col), a = ins.args, self = this;
    ins.cadena.forEach(function (m) { if (m !== 'pretty') throw ErrorMQL('El laboratorio no admite .' + m + '(); use solo los métodos de la Guía #13.'); });
    switch (ins.met) {
      case 'find': {
        if (a.length > 1) throw ErrorMQL('En este laboratorio find recibe solo el filtro (las proyecciones no forman parte de la guía).');
        var f = a[0] || {};
        return { tipo: 'find', docs: col.filter(function (d) { return cumple(d, f); }).map(clonar) };
      }
      case 'insertOne': {
        if (a.length !== 1 || !a[0] || typeof a[0] !== 'object' || Array.isArray(a[0])) throw ErrorMQL('insertOne recibe un solo documento { … }. Para varios use insertMany([ … ]).');
        var d = clonar(a[0]); if (d._id == null) d._id = self.nuevoId(); col.push(d);
        return { tipo: 'escritura', texto: '1 documento insertado' };
      }
      case 'insertMany': {
        if (a.length !== 1 || !Array.isArray(a[0])) throw ErrorMQL('insertMany recibe un arreglo de documentos: insertMany([ { … }, { … } ]).');
        a[0].forEach(function (x) { if (!x || typeof x !== 'object' || Array.isArray(x)) throw ErrorMQL('Cada elemento de insertMany debe ser un documento { … }.'); var d2 = clonar(x); if (d2._id == null) d2._id = self.nuevoId(); col.push(d2); });
        return { tipo: 'escritura', texto: a[0].length + ' documento(s) insertado(s)' };
      }
      case 'updateOne':
      case 'updateMany': {
        if (a.length < 2) throw ErrorMQL(ins.met + ' recibe dos documentos: el filtro y el cambio, por ejemplo { $set: { campo: valor } }.');
        var cambio = a[1];
        if (!esOperador(cambio)) throw ErrorMQL('El segundo argumento de ' + ins.met + ' debe usar un operador de actualización, como { $set: { campo: valor } }.');
        Object.keys(cambio).forEach(function (op) { if (op !== '$set' && op !== '$inc') throw ErrorMQL('Operador de actualización no admitido: ' + op + '. La guía usa $set.'); });
        var objetivo = col.filter(function (d) { return cumple(d, a[0]); });
        if (ins.met === 'updateOne') objetivo = objetivo.slice(0, 1);
        objetivo.forEach(function (d) {
          Object.keys(cambio).forEach(function (op) {
            Object.keys(cambio[op]).forEach(function (k) {
              if (op === '$inc' && typeof cambio[op][k] !== 'number') throw ErrorMQL('$inc requiere un número.');
              asignar(d, k, cambio[op][k], op === '$inc');
            });
          });
        });
        return { tipo: 'escritura', texto: objetivo.length + ' documento(s) modificado(s)' };
      }
      case 'deleteOne':
      case 'deleteMany': {
        if (a.length !== 1) throw ErrorMQL(ins.met + ' recibe un filtro { … }.');
        var borrar = [];
        for (var i = 0; i < col.length; i++) { if (cumple(col[i], a[0])) { borrar.push(i); if (ins.met === 'deleteOne') break; } }
        for (var j = borrar.length - 1; j >= 0; j--) col.splice(borrar[j], 1);
        return { tipo: 'escritura', texto: borrar.length + ' documento(s) eliminado(s)' };
      }
      default:
        throw ErrorMQL('Método no admitido: ' + ins.met + '. Use find, insertOne, insertMany, updateOne, deleteOne o deleteMany.');
    }
  };

  function correr(e, codigo) {
    var base = new Base(LAB_MONGO.DATOS[e.datos]);
    var ins = new Parser(codigo).instrucciones();
    if (!ins.length) throw ErrorMQL('No se encontró ninguna instrucción.');
    var ultimo = null;
    ins.forEach(function (x) { ultimo = base.ejecutar(x); });
    return { base: base, ultimo: ultimo, instrucciones: ins };
  }
  function sinId(docs) { return docs.map(function (d) { var c = clonar(d); delete c._id; return c; }); }
  function conjunto(docs) { return sinId(docs).map(canon).sort(); }

  function calificar(e, codigo) {
    var limpio = String(codigo || '').trim();
    if (!limpio) return { estado: 'aviso', titulo: 'Editor vacío', texto: 'Escriba su respuesta antes de comprobar.' };
    var sol = correr(e, e.solucion), al;
    try { al = correr(e, limpio); }
    catch (err) {
      if (err.mql) return { estado: 'mal', titulo: 'Hay un error en la instrucción', texto: err.message };
      return { estado: 'aviso', titulo: 'No se pudo evaluar', texto: String(err.message || err), nota: 'Compare su respuesta con la solución sugerida.' };
    }
    if (e.tipo === 'find') {
      if (!al.ultimo || al.ultimo.tipo !== 'find') return { estado: 'mal', titulo: 'Falta la consulta', texto: 'Este ejercicio pide mostrar documentos con find(…). Su última instrucción no es una consulta.' };
      var colAl = al.instrucciones[al.instrucciones.length - 1].col;
      if (colAl !== e.coleccion) return { estado: 'mal', titulo: 'Colección equivocada', texto: 'Consultó la colección «' + colAl + '»; el ejercicio es sobre «' + e.coleccion + '».', docs: al.ultimo.docs };
      var a = conjunto(al.ultimo.docs), b = conjunto(sol.ultimo.docs);
      if (a.length !== b.length) return { estado: 'mal', titulo: 'El resultado no coincide', texto: 'Su consulta devuelve ' + a.length + ' documento(s); se esperaban ' + b.length + '. Revise el filtro y los operadores.', docs: al.ultimo.docs, esperados: sol.ultimo.docs };
      if (a.join() !== b.join()) return { estado: 'mal', titulo: 'El resultado no coincide', texto: 'Devuelve la cantidad correcta de documentos, pero no son los esperados.', docs: al.ultimo.docs, esperados: sol.ultimo.docs };
      return { estado: 'ok', titulo: '¡Correcto!', texto: 'Su consulta devuelve exactamente los documentos esperados.', docs: al.ultimo.docs };
    }
    // escritura: comparar el estado final de la colección
    var fa = al.base.col(e.coleccion), fs = sol.base.col(e.coleccion);
    var ca = conjunto(fa), cs = conjunto(fs);
    if (ca.join() === cs.join()) return { estado: 'ok', titulo: '¡Correcto!', texto: 'La colección «' + e.coleccion + '» quedó exactamente como se esperaba.', docs: fa };
    var t = ca.length !== cs.length ? 'Después de su operación la colección tiene ' + ca.length + ' documento(s); se esperaban ' + cs.length + '.' : 'La colección tiene la cantidad correcta de documentos, pero algún valor no coincide con lo esperado.';
    return { estado: 'mal', titulo: 'El estado final no coincide', texto: t, docs: fa, esperados: fs };
  }

  function esperado(e) {
    var r = correr(e, e.solucion);
    return e.tipo === 'find' ? r.ultimo.docs : r.base.col(e.coleccion);
  }

  window.MOTOR_MONGO = { calificar: calificar, esperado: esperado, _Parser: Parser, _cumple: cumple };
})();
