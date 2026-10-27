/* Huellitas en Casa — lógica de la aplicación */
(function () {
  'use strict';

  // ---------- Datos ----------
  var perritos = [
    { id: 'max',    nombre: 'Max',    raza: 'Labrador mestizo',   edadMeses: 24, tamano: 'Grande',  sexo: 'Macho', img: 'img/dog-max.jpg',
      desc: 'Juguetón y cariñoso. Adora los paseos largos y llevarse bien con los niños.' },
    { id: 'luna',   nombre: 'Luna',   raza: 'Beagle',             edadMeses: 12, tamano: 'Mediano', sexo: 'Hembra', img: 'img/dog-luna.jpg',
      desc: 'Curiosa y muy olfativa. Perfecta para familias activas que disfruten del parque.' },
    { id: 'coco',   nombre: 'Coco',   raza: 'Chihuahua',          edadMeses: 48, tamano: 'Pequeño', sexo: 'Macho', img: 'img/dog-coco.jpg',
      desc: 'Valiente y leal. Se adapta muy bien a departamentos y le encanta el calorcito.' },
    { id: 'rocky',  nombre: 'Rocky',  raza: 'Pastor mestizo',     edadMeses: 36, tamano: 'Grande',  sexo: 'Macho', img: 'img/dog-rocky.jpg',
      desc: 'Protector, inteligente y obediente. Necesita espacio y mucha actividad.' },
    { id: 'mia',    nombre: 'Mía',    raza: 'Poodle',             edadMeses: 60, tamano: 'Pequeño', sexo: 'Hembra', img: 'img/dog-mia.jpg',
      desc: 'Elegante y tranquila. Ideal para personas que buscan compañía serena.' },
    { id: 'toby',   nombre: 'Toby',   raza: 'Criollo',            edadMeses: 6,  tamano: 'Mediano', sexo: 'Macho', img: 'img/dog-toby.jpg',
      desc: 'Cachorro lleno de energía que está aprendiendo sus primeras órdenes.' },
    { id: 'nala',   nombre: 'Nala',   raza: 'Husky siberiano',    edadMeses: 24, tamano: 'Grande',  sexo: 'Hembra', img: 'img/dog-nala.jpg',
      desc: 'Aventurera y platicadora. Requiere ejercicio diario y un hogar con espacio.' },
    { id: 'pelusa', nombre: 'Pelusa', raza: 'Schnauzer mestiza',  edadMeses: 96, tamano: 'Pequeño', sexo: 'Hembra', img: 'img/dog-pelusa.jpg',
      desc: 'Dulce y noble. Busca un hogar tranquilo donde pasar sus años dorados.' }
  ];

  // ---------- Utilidades ----------
  function $(id) { return document.getElementById(id); }

  function leer(clave, porDefecto) {
    try {
      var v = localStorage.getItem(clave);
      return v ? JSON.parse(v) : porDefecto;
    } catch (e) { return porDefecto; }
  }
  function guardar(clave, valor) {
    try { localStorage.setItem(clave, JSON.stringify(valor)); } catch (e) { /* sin almacenamiento */ }
  }

  function textoEdad(meses) {
    if (meses < 12) return meses + ' meses';
    var a = Math.floor(meses / 12);
    return a + (a === 1 ? ' año' : ' años');
  }
  function categoriaEdad(meses) {
    if (meses < 12) return 'cachorro';
    return meses <= 60 ? 'adulto' : 'senior';
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // ---------- Estado ----------
  var favoritos = leer('hc_favoritos', []);
  var solicitudes = leer('hc_solicitudes', []);
  var actual = null;

  // ---------- Render ----------
  function filtrar() {
    var q = $('buscar').value.trim().toLowerCase();
    var t = $('tamano').value;
    var e = $('edad').value;
    var f = $('soloFavs').checked;
    return perritos.filter(function (p) {
      var okQ = !q || p.nombre.toLowerCase().indexOf(q) > -1 || p.raza.toLowerCase().indexOf(q) > -1;
      var okT = !t || p.tamano === t;
      var okE = !e || categoriaEdad(p.edadMeses) === e;
      var okF = !f || favoritos.indexOf(p.id) > -1;
      return okQ && okT && okE && okF;
    });
  }

  function render() {
    var lista = filtrar();
    var html = lista.map(function (p) {
      var esFav = favoritos.indexOf(p.id) > -1;
      return '<article class="card">' +
        '<div class="card-img"><img src="' + p.img + '" alt="Ilustración de ' + esc(p.nombre) + ', ' + esc(p.raza) + '" loading="lazy" width="800" height="600">' +
        '<button class="fav" type="button" data-fav="' + p.id + '" aria-pressed="' + esFav + '" aria-label="Marcar a ' + esc(p.nombre) + ' como favorito">♥</button></div>' +
        '<div class="card-body"><h3>' + esc(p.nombre) + '</h3>' +
        '<p class="muted">' + esc(p.raza) + '</p>' +
        '<div class="tags"><span class="tag">' + textoEdad(p.edadMeses) + '</span><span class="tag">' + p.tamano + '</span><span class="tag">' + p.sexo + '</span></div>' +
        '<button class="btn" type="button" data-adoptar="' + p.id + '">Conocer a ' + esc(p.nombre) + '</button></div></article>';
    }).join('');
    $('grid').innerHTML = html || '<p class="empty">No encontramos perritos con esos filtros. Prueba con otra búsqueda 🐶</p>';
    $('resultados').textContent = 'Mostrando ' + lista.length + ' de ' + perritos.length + ' perritos';
    $('favCount').textContent = favoritos.length;
    $('statTotal').textContent = perritos.length;
    $('statReq').textContent = solicitudes.length;
  }

  // ---------- Modal y formulario ----------
  function abrir(id) {
    var p = perritos.filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    actual = p;
    $('mImg').src = p.img;
    $('mImg').alt = 'Ilustración de ' + p.nombre;
    $('mTitulo').textContent = p.nombre;
    $('mMeta').textContent = p.raza + ' · ' + textoEdad(p.edadMeses) + ' · ' + p.tamano + ' · ' + p.sexo;
    $('mDesc').textContent = p.desc;
    $('formMsg').textContent = '';
    $('formMsg').className = 'form-msg';
    $('formAdopcion').reset();
    if (typeof $('modal').showModal === 'function') { $('modal').showModal(); }
    else { $('modal').setAttribute('open', ''); }
  }

  function validar(datos) {
    if (datos.nombre.trim().length < 3) return 'Escribe tu nombre completo.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email)) return 'Escribe un correo válido.';
    if (datos.tel.replace(/\D/g, '').length < 10) return 'El teléfono debe tener al menos 10 dígitos.';
    if (!datos.vivienda) return 'Selecciona tu tipo de vivienda.';
    return '';
  }

  function enviar(ev) {
    ev.preventDefault();
    var f = ev.target;
    var datos = {
      nombre: f.nombre.value, email: f.email.value, tel: f.tel.value,
      vivienda: f.vivienda.value, mensaje: f.mensaje.value
    };
    var error = validar(datos);
    var msg = $('formMsg');
    if (error) { msg.textContent = error; msg.className = 'form-msg error'; return; }
    solicitudes.push({ perrito: actual.id, fecha: new Date().toISOString(), solicitante: datos.nombre, email: datos.email });
    guardar('hc_solicitudes', solicitudes);
    msg.textContent = '¡Gracias, ' + datos.nombre.split(' ')[0] + '! Recibimos tu solicitud para adoptar a ' + actual.nombre + '.';
    msg.className = 'form-msg ok';
    $('statReq').textContent = solicitudes.length;
    f.reset();
  }

  function alternarFav(id) {
    var i = favoritos.indexOf(id);
    if (i > -1) favoritos.splice(i, 1); else favoritos.push(id);
    guardar('hc_favoritos', favoritos);
    render();
  }

  // ---------- Eventos ----------
  $('grid').addEventListener('click', function (ev) {
    var b = ev.target.closest('button');
    if (!b) return;
    if (b.dataset.fav) alternarFav(b.dataset.fav);
    else if (b.dataset.adoptar) abrir(b.dataset.adoptar);
  });
  ['buscar', 'tamano', 'edad', 'soloFavs'].forEach(function (id) {
    $(id).addEventListener('input', render);
    $(id).addEventListener('change', render);
  });
  $('btnFavs').addEventListener('click', function () {
    $('soloFavs').checked = !$('soloFavs').checked;
    render();
    $('perritos').scrollIntoView();
  });
  $('formAdopcion').addEventListener('submit', enviar);
  $('cerrar').addEventListener('click', function () { $('modal').close(); });
  $('modal').addEventListener('click', function (ev) { if (ev.target === $('modal')) $('modal').close(); });

  render();
})();
