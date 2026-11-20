/* =====================================================================
   ALCANCE: EXAMEN 3 (Guías #8 a #13, carpeta "Bases Examen 3/Temas de examen")
   Deja en la plataforma solo los temas de esas guías: Estudiar, Practicar,
   buscador, progreso y cobertura. Los demás temas siguen en
   datos-estudio*.js pero no se muestran.
   ===================================================================== */
(function () {
  var TEMAS = ['transacciones', 'aislamiento', 'planificacion', 'recuperabilidad', 'bloqueos', 'marcas-tiempo',
    'fallas-respaldo', 'backup-restore', 'optimizacion-proceso', 'optimizacion-practica',
    'bdd-conceptos', 'servidores-vinculados', 'mongo-conceptos', 'mongo-crud'];
  var DOCS = { G8: 1, G9: 1, G10: 1, G11: 1, G12: 1, G13: 1 };
  var E = window.ESTUDIO;

  var quedan = E.TEMAS.filter(function (t) { return TEMAS.indexOf(t.id) >= 0; });
  quedan.forEach(function (t) {
    t.fuentes = t.fuentes.filter(function (f) { return DOCS[f]; });
    t.cubre = t.cubre.filter(function (c) { return DOCS[c[0]]; });
  });
  E.TEMAS.length = 0;
  quedan.forEach(function (t) { E.TEMAS.push(t); });

  var unidades = E.UNIDADES.filter(function (u) { return quedan.some(function (t) { return t.u === u.id; }); });
  unidades.forEach(function (u, i) {
    u.n = i + 1;
    if (u.id === 'u5') { u.titulo = 'Transacciones, concurrencia y planificación'; u.desc = 'ACID, problemas de concurrencia, aislamiento, planificación, bloqueos y marcas de tiempo (Guías #8 y #9).'; }
    if (u.id === 'u6') u.desc = 'Tipos de fallas, recuperación con el log, BACKUP y RESTORE (Guía #10).';
    if (u.id === 'u7') u.desc = 'Proceso de optimización, árboles de consulta, estrategias y planes de ejecución (Guía #11).';
    if (u.id === 'u8') u.desc = 'Fragmentación, replicación, 2PC y servidores vinculados (Guía #12).';
    if (u.id === 'u9') u.desc = 'Modelo de documentos y el lenguaje MQL (Guía #13).';
  });
  E.UNIDADES.length = 0;
  unidades.forEach(function (u) { E.UNIDADES.push(u); });
})();
