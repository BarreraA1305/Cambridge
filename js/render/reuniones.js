window.MR = window.MR || {};
MR.subActual = null;

MR.inicializarReuniones = function (sub) {
  var panel = document.getElementById('view-body');
  if (!panel) return;
  var reuniones = window.MISSION.meetings.reuniones || [];
  var empresas = window.MISSION.meetings.empresas || [];
  var dias = window.MISSION.agenda.dias || [];
  var diasConReuniones = dias.filter(function (d) {
    return reuniones.some(function (r) { return r.dia_id === d.id; });
  });
  var diaId = sub && diasConReuniones.some(function (d) { return d.id === sub; })
    ? sub
    : (diasConReuniones[0] || {}).id;
  MR.subActual = diaId;

  function empresaPorId(id) {
    return empresas.filter(function (e) { return e.id === id; })[0] || null;
  }

  function breve(texto) {
    var limpio = String(texto || '').trim();
    var corte = limpio.indexOf('. ');
    return corte > 0 ? limpio.slice(0, corte + 1) : limpio;
  }

  function diaPorId(id) {
    return dias.filter(function (d) { return d.id === id; })[0] || {};
  }

  function dibujar() {
    var html = '';
    html += '<div class="day-tabs" role="tablist" aria-label="' + MU.esc(MU.t('dia')) + '">';
    diasConReuniones.forEach(function (d) {
      var visibles = reuniones.filter(function (r) { return r.dia_id === d.id; });
      var lugares = [];
      visibles.forEach(function (r) {
        var nombre = MU.tx((r.lugar || {}).nombre);
        if (nombre && lugares.indexOf(nombre) < 0) lugares.push(nombre);
      });
      html += '<button class="day-tab" type="button" role="tab" data-day="' + MU.esc(d.id) + '" aria-selected="' + (d.id === diaId ? 'true' : 'false') + '"><strong>' + MU.esc(MU.tx(d.etiqueta)) + '</strong><span>' + MU.esc(MU.fecha(d.fecha, { day: '2-digit', month: 'short' })) + ' · ' + MU.esc(d.ciudad) + ' · ' + lugares.length + '</span></button>';
    });
    html += '</div>';

    var dia = diaPorId(diaId);
    var delDia = reuniones.filter(function (r) { return r.dia_id === diaId; });
    var vistos = [];
    html += '<div class="meeting-list">';
    delDia.forEach(function (r) {
      var lugar = r.lugar || {};
      var nombreLugar = MU.tx(lugar.nombre);
      if (!nombreLugar || vistos.indexOf(nombreLugar) >= 0) return;
      vistos.push(nombreLugar);

      var delLugar = delDia.filter(function (x) { return MU.tx((x.lugar || {}).nombre) === nombreLugar; });
      var ids = [];
      delLugar.forEach(function (x) {
        (x.empresa_ids || []).forEach(function (id) { if (ids.indexOf(id) < 0) ids.push(id); });
      });
      var organizaciones = ids.map(empresaPorId).filter(Boolean);
      var descripcionEmpresa = organizaciones.map(function (e) { return MU.tx(e.descripcion); }).filter(Boolean)[0] || '';
      var descripcion = lugar.foto_tipo === 'edificio'
        ? MU.tx(delLugar[0].titulo)
        : breve(descripcionEmpresa);
      var alt = nombreLugar + ', ' + (dia.ciudad || '');

      html += '<article class="meeting-card" id="lugar-' + MU.esc(r.id) + '">';
      html += MU.foto(lugar.foto, alt, dia.ciudad, lugar.foto_credito);
      html += '<div class="meeting-main"><h3>' + MU.esc(nombreLugar) + '</h3>';
      if (descripcion) html += '<p class="meeting-description">' + MU.esc(breve(descripcion)) + '</p>';
      if (organizaciones.length) {
        html += '<p class="card-meta"><strong>' + MU.esc(MU.getLang() === 'es' ? 'Organizaciones:' : 'Organizations:') + '</strong> ' + MU.esc(organizaciones.map(function (e) { return e.nombre; }).join(' · ')) + '</p>';
      }
      html += '<div class="card-links">';
      if (lugar.sitio_web) html += '<a class="btn btn-sm" href="' + MU.esc(lugar.sitio_web) + '" target="_blank" rel="noopener noreferrer">' + MU.esc(MU.t('sitio_oficial')) + ' ↗</a>';
      if (lugar.mapa_url) html += '<a class="btn btn-sm" href="' + MU.esc(lugar.mapa_url) + '" target="_blank" rel="noopener noreferrer">' + MU.esc(MU.t('ver_ubicacion')) + ' ↗</a>';
      html += '<a class="btn btn-sm" href="#agenda/' + MU.esc(diaId) + '">' + MU.esc(MU.t('ver_agenda')) + '</a>';
      html += '</div></div></article>';
    });
    if (!delDia.length) html += '<p class="state">' + MU.esc(MU.t('empty')) + '</p>';
    html += '</div>';

    html += '<div class="section-head" style="margin-top:1.5rem"><div><h2>' + MU.esc(MU.t('empresas')) + '</h2></div></div><div class="cards">';
    empresas.forEach(function (e) {
      var reunion = reuniones.filter(function (r) { return (r.empresa_ids || []).indexOf(e.id) >= 0; })[0] || {};
      var lugar = reunion.lugar || {};
      var ciudad = diaPorId(reunion.dia_id).ciudad || e.ciudad;
      var alt = (MU.tx(lugar.nombre) || e.nombre) + ', ' + ciudad;
      html += '<article class="card" id="emp-' + MU.esc(e.id) + '">' + MU.foto(lugar.foto, alt, ciudad, lugar.foto_credito);
      html += '<div class="card-body"><h3>' + MU.esc(e.nombre) + '</h3>';
      html += '<p class="card-meta">' + MU.esc(MU.tx(e.sector)) + ' · ' + MU.esc(e.ciudad) + '</p>';
      html += '<p>' + MU.esc(breve(MU.tx(e.descripcion))) + '</p>';
      if (e.sitio_web) html += '<div class="card-links"><a class="btn btn-sm" href="' + MU.esc(e.sitio_web) + '" target="_blank" rel="noopener noreferrer">' + MU.esc(MU.t('sitio_oficial')) + ' ↗</a></div>';
      html += '</div></article>';
    });
    html += '</div>';

    panel.innerHTML = html;
    panel.querySelectorAll('.day-tab').forEach(function (tab) {
      tab.addEventListener('click', function () { seleccionar(tab.getAttribute('data-day')); });
    });
  }

  function seleccionar(id) {
    diaId = id; MR.subActual = id;
    dibujar();
    if (history.replaceState) history.replaceState(null, '', '#reuniones/' + id);
  }
  MR.seleccionarReunion = seleccionar;
  dibujar();
};
