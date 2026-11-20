/* =====================================================================
   LABORATORIO MONGODB · datos y ejercicios (Guía #13)
   tipo 'find'      → se comparan los documentos devueltos
   tipo 'escritura' → se compara el estado final de la colección
   ===================================================================== */
(function () {
  function est(id, nombre, carne, edad) { return { _id: id, nombre: nombre, carne: carne, edad: edad }; }
  var ESTUDIANTES = [
    est('e1', 'Johan', 'C564564', 25),
    est('e2', 'Jeferson', 'C564566', 25), est('e3', 'Dilana', 'C789123', 22), est('e4', 'Abigail', 'C321654', 24),
    est('e5', 'Victor', 'C456789', 23), est('e6', 'Elmer', 'C112233', 26), est('e7', 'Ariel', 'C998877', 21),
    est('e8', 'Luis', 'C334455', 27), est('e9', 'Jaquelin', 'C665544', 20), est('e10', 'Karen', 'C123987', 24),
    est('e11', 'Jhon', 'C778899', 22)
  ];
  var CURSOS = [
    { _id: 'c1', nombre: 'Matemática I', profesor: 'Marta', cantidad_estudiantes: 30, aula: { numero: 'A101', ubicacion: 'Edificio A' } },
    { _id: 'c2', nombre: 'Física II', profesor: 'Carlos', cantidad_estudiantes: 25, aula: { numero: 'B202', ubicacion: 'Edificio B' } },
    { _id: 'c3', nombre: 'Biología', profesor: 'Ana', cantidad_estudiantes: 35, aula: { numero: 'C303', ubicacion: 'Edificio C' } },
    { _id: 'c4', nombre: 'Química', profesor: 'Luis', cantidad_estudiantes: 20, aula: { numero: 'A101', ubicacion: 'Edificio A' } }
  ];
  var DATOS = {
    vacia: { estudiantes: [] },
    estudiantes: { estudiantes: ESTUDIANTES },
    cursos: { cursos: CURSOS }
  };

  var GRUPOS = [
    { id: 'A', titulo: 'Insertar documentos' },
    { id: 'B', titulo: 'Consultar con find y operadores' },
    { id: 'C', titulo: 'Actualizar y eliminar' },
    { id: 'D', titulo: 'Ejercicios de la guía: colección cursos' }
  ];

  var E = [];
  function ej(o) { E.push(o); }

  /* A · Insertar */
  ej({ g: 'A', titulo: 'Insertar un estudiante', tipo: 'escritura', datos: 'vacia', coleccion: 'estudiantes', nivel: 1,
    enunciado: 'La colección <code>estudiantes</code> está vacía. Inserte <b>un</b> documento: nombre <b>"Johan"</b>, carne <b>"C564564"</b>, edad <b>25</b>.',
    pista: 'db.estudiantes.insertOne({ … })',
    solucion: 'db.estudiantes.insertOne({ nombre: "Johan", carne: "C564564", edad: 25 })',
    explicacion: 'insertOne recibe un documento. MongoDB le asigna un _id automáticamente.' });
  ej({ g: 'A', titulo: 'Insertar varios estudiantes', tipo: 'escritura', datos: 'vacia', coleccion: 'estudiantes', nivel: 1,
    enunciado: 'Con <b>una sola instrucción</b>, inserte a <b>"Jeferson"</b> (carne "C564566", edad 25) y a <b>"Dilana"</b> (carne "C789123", edad 22).',
    pista: 'insertMany recibe un arreglo [ … ] de documentos.',
    solucion: 'db.estudiantes.insertMany([\n  { nombre: "Jeferson", carne: "C564566", edad: 25 },\n  { nombre: "Dilana", carne: "C789123", edad: 22 }\n])',
    explicacion: 'Los documentos van dentro de corchetes, separados por comas.' });

  /* B · Consultar */
  ej({ g: 'B', titulo: 'Todos los estudiantes', tipo: 'find', datos: 'estudiantes', coleccion: 'estudiantes', nivel: 1,
    enunciado: 'Muestre <b>todos</b> los documentos de la colección <code>estudiantes</code>.',
    pista: 'find sin filtro.', solucion: 'db.estudiantes.find()',
    explicacion: 'find() sin argumentos equivale a SELECT * FROM estudiantes. También se acepta find({}).' });
  ej({ g: 'B', titulo: 'Buscar por nombre', tipo: 'find', datos: 'estudiantes', coleccion: 'estudiantes', nivel: 1,
    enunciado: 'Muestre el estudiante cuyo nombre es <b>"Ariel"</b>.',
    pista: 'Filtro por igualdad: { campo: valor }', solucion: 'db.estudiantes.find({ nombre: "Ariel" })',
    explicacion: 'Igualdad simple: el valor de texto va entre comillas.' });
  ej({ g: 'B', titulo: 'Mayores de 25', tipo: 'find', datos: 'estudiantes', coleccion: 'estudiantes', nivel: 1,
    enunciado: 'Muestre los estudiantes con edad <b>mayor que 25</b>.',
    pista: '{ edad: { $gt: … } }', solucion: 'db.estudiantes.find({ edad: { $gt: 25 } })',
    explicacion: '$gt es estricto: los de 25 años no aparecen. Resultado: Elmer (26) y Luis (27).' });
  ej({ g: 'B', titulo: 'Edad hasta 22', tipo: 'find', datos: 'estudiantes', coleccion: 'estudiantes', nivel: 1,
    enunciado: 'Muestre los estudiantes con edad <b>menor o igual a 22</b>.',
    pista: 'Operador “menor o igual”.', solucion: 'db.estudiantes.find({ edad: { $lte: 22 } })',
    explicacion: '$lte incluye el 22: Dilana, Ariel, Jaquelin y Jhon.' });
  ej({ g: 'B', titulo: 'Todos menos Luis', tipo: 'find', datos: 'estudiantes', coleccion: 'estudiantes', nivel: 1,
    enunciado: 'Muestre los estudiantes cuyo nombre es <b>diferente de "Luis"</b>.',
    pista: '{ nombre: { $ne: … } }', solucion: 'db.estudiantes.find({ nombre: { $ne: "Luis" } })',
    explicacion: '$ne = diferente. Devuelve 10 de los 11 estudiantes.' });
  ej({ g: 'B', titulo: 'Dos condiciones (AND)', tipo: 'find', datos: 'estudiantes', coleccion: 'estudiantes', nivel: 2,
    enunciado: 'Muestre los estudiantes con carne <b>"C789123"</b> <b>y</b> edad <b>22</b>.',
    pista: 'Varias condiciones dentro del mismo filtro = AND implícito.',
    solucion: 'db.estudiantes.find({ carne: "C789123", edad: 22 })',
    explicacion: 'AND implícito. También se acepta $and: [ … ].' });
  ej({ g: 'B', titulo: 'Una u otra condición (OR)', tipo: 'find', datos: 'estudiantes', coleccion: 'estudiantes', nivel: 2,
    enunciado: 'Muestre los estudiantes con carne <b>"C789123"</b> <b>o</b> con edad <b>menor que 22</b>.',
    pista: '$or recibe un arreglo de condiciones.',
    solucion: 'db.estudiantes.find({ $or: [ { carne: "C789123" }, { edad: { $lt: 22 } } ] })',
    explicacion: 'Dilana (por el carne), Ariel (21) y Jaquelin (20).' });
  ej({ g: 'B', titulo: 'Rango de edades', tipo: 'find', datos: 'estudiantes', coleccion: 'estudiantes', nivel: 2,
    enunciado: 'Muestre los estudiantes con edad <b>entre 24 y 26</b>, ambos incluidos.',
    pista: 'Dos operadores sobre el mismo campo: { edad: { $gte: …, $lte: … } }',
    solucion: 'db.estudiantes.find({ edad: { $gte: 24, $lte: 26 } })',
    explicacion: '“Incluidos” pide $gte y $lte (no $gt ni $lt).' });

  /* C · Actualizar y eliminar */
  ej({ g: 'C', titulo: 'Actualizar una edad', tipo: 'escritura', datos: 'estudiantes', coleccion: 'estudiantes', nivel: 1,
    enunciado: 'Cambie la edad de <b>"Dilana"</b> a <b>27</b>.',
    pista: 'updateOne(filtro, { $set: { … } })',
    solucion: 'db.estudiantes.updateOne(\n  { nombre: "Dilana" },\n  { $set: { edad: 27 } }\n)',
    explicacion: 'El primer documento es el filtro; el segundo indica el cambio con $set.' });
  ej({ g: 'C', titulo: 'Eliminar un estudiante', tipo: 'escritura', datos: 'estudiantes', coleccion: 'estudiantes', nivel: 1,
    enunciado: 'Elimine el estudiante <b>"Abigail"</b>.',
    pista: 'deleteOne con un filtro.', solucion: 'db.estudiantes.deleteOne({ nombre: "Abigail" })',
    explicacion: 'deleteOne elimina el primer documento que cumpla el filtro.' });
  ej({ g: 'C', titulo: 'Eliminar varios', tipo: 'escritura', datos: 'estudiantes', coleccion: 'estudiantes', nivel: 2,
    enunciado: 'Elimine <b>todos</b> los estudiantes de <b>25</b> años.',
    pista: 'Cuando son varios: deleteMany.', solucion: 'db.estudiantes.deleteMany({ edad: 25 })',
    explicacion: 'Se eliminan Johan y Jeferson. Con deleteOne solo se borraría uno.' });

  /* D · Ejercicios de la guía (cursos) */
  ej({ g: 'D', titulo: '1. Todos los cursos', tipo: 'find', datos: 'cursos', coleccion: 'cursos', nivel: 1,
    enunciado: 'Ejercicio 1: muestre <b>todos</b> los cursos registrados.',
    pista: 'find() sobre cursos.', solucion: 'db.cursos.find()', explicacion: 'Devuelve los 4 cursos.' });
  ej({ g: 'D', titulo: '2. Cursos de Marta', tipo: 'find', datos: 'cursos', coleccion: 'cursos', nivel: 1,
    enunciado: 'Ejercicio 2: muestre solo los cursos impartidos por <b>“Marta”</b>.',
    pista: 'Igualdad sobre el campo profesor.', solucion: 'db.cursos.find({ profesor: "Marta" })', explicacion: 'Matemática I.' });
  ej({ g: 'D', titulo: '3. Más de 25 estudiantes', tipo: 'find', datos: 'cursos', coleccion: 'cursos', nivel: 1,
    enunciado: 'Ejercicio 3: muestre los cursos con <b>más de 25</b> estudiantes.',
    pista: '$gt sobre cantidad_estudiantes.', solucion: 'db.cursos.find({ cantidad_estudiantes: { $gt: 25 } })',
    explicacion: 'Matemática I (30) y Biología (35). Física II tiene exactamente 25 y no cumple “más de”.' });
  ej({ g: 'D', titulo: '4. Aula A101', tipo: 'find', datos: 'cursos', coleccion: 'cursos', nivel: 2,
    enunciado: 'Ejercicio 4: muestre los cursos en el aula <b>A101</b>.',
    pista: 'El número de aula está dentro del subdocumento aula: use "aula.numero" entre comillas.',
    solucion: 'db.cursos.find({ "aula.numero": "A101" })',
    explicacion: 'Notación de punto para campos de subdocumentos: Matemática I y Química.' });
  ej({ g: 'D', titulo: '5. No impartidos por Carlos', tipo: 'find', datos: 'cursos', coleccion: 'cursos', nivel: 1,
    enunciado: 'Ejercicio 5: muestre los cursos que <b>no</b> son impartidos por <b>“Carlos”</b>.',
    pista: '$ne', solucion: 'db.cursos.find({ profesor: { $ne: "Carlos" } })', explicacion: 'Todos menos Física II.' });
  ej({ g: 'D', titulo: '9. Física II: 5 estudiantes más', tipo: 'escritura', datos: 'cursos', coleccion: 'cursos', nivel: 2,
    enunciado: 'Ejercicio 9: aumente en <b>5</b> la cantidad de estudiantes del curso <b>“Física II”</b> (actualmente tiene 25).',
    pista: 'Con lo visto en la guía: updateOne con $set asignando el nuevo total (25 + 5).',
    solucion: 'db.cursos.updateOne(\n  { nombre: "Física II" },\n  { $set: { cantidad_estudiantes: 30 } }\n)',
    explicacion: 'Con $set se asigna el valor resultante (30). Si conoce el operador $inc (no visto en la guía), también se acepta { $inc: { cantidad_estudiantes: 5 } }.' });
  ej({ g: 'D', titulo: '10. Cambiar el nombre del profesor', tipo: 'escritura', datos: 'cursos', coleccion: 'cursos', nivel: 1,
    enunciado: 'Ejercicio 10: cambie el nombre del profesor de <b>“Luis”</b> a <b>“Luis Fernández”</b>.',
    pista: 'Filtre por profesor y use $set.',
    solucion: 'db.cursos.updateOne(\n  { profesor: "Luis" },\n  { $set: { profesor: "Luis Fernández" } }\n)',
    explicacion: 'El filtro busca por el valor viejo; $set escribe el nuevo.' });
  ej({ g: 'D', titulo: '11. Eliminar Química', tipo: 'escritura', datos: 'cursos', coleccion: 'cursos', nivel: 1,
    enunciado: 'Ejercicio 11: elimine el curso llamado <b>“Química”</b>.',
    pista: 'deleteOne', solucion: 'db.cursos.deleteOne({ nombre: "Química" })', explicacion: 'Quedan 3 cursos.' });
  ej({ g: 'D', titulo: '12. Eliminar cursos pequeños', tipo: 'escritura', datos: 'cursos', coleccion: 'cursos', nivel: 2,
    enunciado: 'Ejercicio 12: elimine <b>todos</b> los cursos con <b>menos de 30</b> estudiantes.',
    pista: 'deleteMany con $lt.', solucion: 'db.cursos.deleteMany({ cantidad_estudiantes: { $lt: 30 } })',
    explicacion: 'Se eliminan Física II (25) y Química (20).' });
  ej({ g: 'D', titulo: '13. Ana o Carlos', tipo: 'find', datos: 'cursos', coleccion: 'cursos', nivel: 2,
    enunciado: 'Ejercicio 13: muestre los cursos impartidos por <b>“Ana” o “Carlos”</b>.',
    pista: '$or con dos condiciones sobre profesor.',
    solucion: 'db.cursos.find({ $or: [ { profesor: "Ana" }, { profesor: "Carlos" } ] })',
    explicacion: 'Biología y Física II.' });
  ej({ g: 'D', titulo: '14. Entre 20 y 35 (exclusivo)', tipo: 'find', datos: 'cursos', coleccion: 'cursos', nivel: 2,
    enunciado: 'Ejercicio 14: muestre los cursos con <b>más de 20 y menos de 35</b> estudiantes.',
    pista: '{ cantidad_estudiantes: { $gt: …, $lt: … } }',
    solucion: 'db.cursos.find({ cantidad_estudiantes: { $gt: 20, $lt: 35 } })',
    explicacion: 'Matemática I (30) y Física II (25). Química (20) y Biología (35) quedan fuera porque los límites no se incluyen.' });
  ej({ g: 'D', titulo: '15. No en el Edificio B', tipo: 'find', datos: 'cursos', coleccion: 'cursos', nivel: 3,
    enunciado: 'Ejercicio 15: muestre los cursos que <b>no</b> están en el <b>“Edificio B”</b>.',
    pista: 'Combine la notación de punto ("aula.ubicacion") con $ne.',
    solucion: 'db.cursos.find({ "aula.ubicacion": { $ne: "Edificio B" } })',
    explicacion: 'Combina subdocumento y operador: Matemática I, Biología y Química.' });
  ej({ g: 'D', titulo: '16. En el Edificio A', tipo: 'find', datos: 'cursos', coleccion: 'cursos', nivel: 2,
    enunciado: 'Ejercicio 16: muestre los cursos cuya aula esté ubicada en el <b>“Edificio A”</b>.',
    pista: '"aula.ubicacion"', solucion: 'db.cursos.find({ "aula.ubicacion": "Edificio A" })',
    explicacion: 'Matemática I y Química.' });
  ej({ g: 'D', titulo: '17. Aula C303', tipo: 'find', datos: 'cursos', coleccion: 'cursos', nivel: 2,
    enunciado: 'Ejercicio 17: muestre los cursos con aula número <b>“C303”</b>.',
    pista: '"aula.numero"', solucion: 'db.cursos.find({ "aula.numero": "C303" })', explicacion: 'Biología.' });

  E.forEach(function (e, i) { e.id = 'mongo-' + (i + 1); e.n = i + 1; e.tema = 'mongo-crud'; });
  window.LAB_MONGO = { DATOS: DATOS, GRUPOS: GRUPOS, EJERCICIOS: E };
})();
