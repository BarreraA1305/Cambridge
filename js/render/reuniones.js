window.MR = window.MR || {};
MR.subActual = null;

MR.inicializarReuniones = function (sub) {
  var panel = document.getElementById('view-body');
  if (!panel) return;
  var reuniones = window.MISSION.meetings.reuniones || [];
  var contrapartes = window.MISSION.people.contrapartes || [];
  var empresas = window.MISSION.meetings.empresas || [];
  var dias = window.MISSION.agenda.dias || [];
  var diaId = sub && dias.filter(function (d) { return d.id === sub; })[0] ? sub : (dias.filter(function (d) { return reuniones.some(function (r) { return r.dia_id === d.id; }); })[0] || {}).id;
  MR.subActual = diaId;

  function dibujar() {
    var html = '';
    html += '<div class="day-tabs" role="tablist" aria-label="' + MU.esc(MU.t('dia')) + '">';
    dias.forEach(function (d) {
      var count = reuniones.filter(function (r) { return r.dia_id === d.id; }).length;
      if (!count) return;
      html += '<button class="day-tab" type="button" role="tab" data-day="' + MU.esc(d.id) + '" aria-selected="' + (d.id === diaId ? 'true' : 'false') + '"><strong>' + MU.esc(MU.tx(d.etiqueta)) + '</strong><span>' + MU.esc(MU.fecha(d.fecha, { day: '2-digit', month: 'short' })) + ' · ' + MU.esc(d.ciudad) + ' · ' + count + '</span></button>';
    });
    html += '</div><div class="meeting-list">';
    var visibles = reuniones.filter(function (r) { return r.dia_id === diaId; });
    visibles.forEach(function (r) {
      var lugar = r.lugar || {};
      var alt = (MU.tx(lugar.nombre) || '') + ', ' + (dias.filter(function (d) { return d.id === r.dia_id; })[0] || {}).ciudad;
      html += '<article class="meeting-card" id="r-' + MU.esc(r.id) + '">';
      html += MU.foto(lugar.foto, alt, (dias.filter(function (d) { return d.id === r.dia_id; })[0] || {}).ciudad, lugar.foto_credito);
      html += '<div class="meeting-main"><h3>' + MU.esc(MU.tx(r.titulo)) + '</h3>';
      html += '<p class="meeting-meta"><span>◷ ' + MU.esc(MU.hora(r.inicio)) + (r.fin ? '–' + MU.esc(MU.hora(r.fin)) : '') + '</span><span>◉ ' + MU.esc(MU.tx(lugar.nombre)) + '</span></p>';
      html += '<div class="badges">' + MU.badge(r.estado) + (lugar.foto_tipo ? '<span class="badge badge-neutral">' + MU.esc(lugar.foto_tipo) + '</span>' : '') + '</div>';
      var personas = contrapartes.slice(0, 4);
      if (personas.length) {
        html += '<div class="meeting-counterparts">';
        personas.forEach(function (q) {
          html += '<span class="chip" title="' + MU.esc(MU.tx(q.cargo)) + '">' + MU.esc(MU.iniciales(q.nombre)) + ' ' + MU.esc(q.nombre.split(' ')[0]) + '</span>';
        });
        if (contrapartes.length > 4) html += '<span class="chip">+' + (contrapartes.length - 4) + '</span>';
        html += '</div>';
      }
      html += '<div class="card-links">';
      if (lugar.sitio_web) html += '<a class="btn btn-sm" href="' + MU.esc(lugar.sitio_web) + '" target="_blank" rel="noopener noreferrer">' + MU.esc(MU.t('sitio_oficial')) + ' ↗</a>';
      if (lugar.mapa_url) html += '<a class="btn btn-sm" href="' + MU.esc(lugar.mapa_url) + '" target="_blank" rel="noopener noreferrer">' + MU.esc(MU.t('ver_ubicacion')) + ' ↗</a>';
      html += '<a class="btn btn-sm" href="#agenda/' + MU.esc(r.dia_id) + '">' + MU.esc(MU.t('ver_agenda')) + '</a>';
      html += '</div>';
      html += '<button class="btn-detail" type="button" data-detalle="' + MU.esc(r.id) + '">' + (MU.getLang() === 'es' ? 'Ver más ▾' : 'More ▾') + '</button>';
      html += '<div class="meeting-detail" id="det-' + MU.esc(r.id) + '">';
      html += '<p class="card-meta">' + (MU.getLang() === 'es' ? 'Equipo académico' : 'Academic team') + ':</p><ul>';
      contrapartes.forEach(function (q) { html += '<li>' + MU.esc(q.nombre) + ' · ' + MU.esc(MU.tx(q.cargo)) + '</li>'; });
      html += '</ul>';
      html += '<p class="source">' + MU.esc(MU.t('referencia')) + ' · ' + MU.esc(MU.t('pendiente')) + '</p>';
      html += MU.tradNote(r.titulo);
      html += '</div></div></article>';
    });
    if (!visibles.length) html += '<p class="state">' + MU.esc(MU.t('empty')) + '</p>';
    html += '</div>';
    html += '<div class="section-head" style="margin-top:1.5rem"><div><h2>' + MU.esc(MU.t('empresas')) + '</h2></div></div><div class="cards">';
    empresas.forEach(function (e) {
      html += '<article class="card" id="emp-' + MU.esc(e.id) + '"><h3>' + MU.esc(e.nombre) + '</h3>';
      html += '<p class="card-meta">' + MU.esc(MU.tx(e.sector)) + ' · ' + MU.esc(e.ciudad) + '</p>';
      html += '<p>' + MU.esc(MU.tx(e.descripcion)) + '</p>';
      if (e.sitio_web) html += '<p><a href="' + MU.esc(e.sitio_web) + '" target="_blank" rel="noopener noreferrer">' + MU.esc(MU.t('sitio_oficial')) + ' ↗</a></p>';
      html += MU.tradNote(e.descripcion);
      html += '</article>';
    });
    html += '</div>';
    panel.innerHTML = html;
    panel.querySelectorAll('.day-tab').forEach(function (tab) {
      tab.addEventListener('click', function () { seleccionar(tab.getAttribute('data-day')); });
    });
    panel.querySelectorAll('[data-detalle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tarjeta = btn.closest('.meeting-card');
        tarjeta.classList.toggle('abierto');
        btn.textContent = tarjeta.classList.contains('abierto')
          ? (MU.getLang() === 'es' ? 'Ver menos ▴' : 'Less ▴')
          : (MU.getLang() === 'es' ? 'Ver más ▾' : 'More ▾');
      });
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
