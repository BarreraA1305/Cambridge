window.MR = window.MR || {};
MR.hospedajes = function () {
  var hoteles = window.MISSION.lodging.hoteles || [];
  var aviso = MU.getLang() === 'es'
    ? 'Las fechas corresponden al programa de viaje. Los comprobantes de reserva y contactos de los hoteles se agregarán cuando estén disponibles.'
    : 'Dates correspond to the travel itinerary. Booking confirmations and hotel contacts will be added when available.';
  var html = '<div class="noscript" style="border-color:var(--accent);background:var(--accent-soft)">' + MU.esc(aviso) + '</div><div class="cards two-col">';
  hoteles.forEach(function (h) {
    var alt = h.nombre + ', ' + h.ciudad;
    html += '<article class="card hotel">' + MU.foto(h.foto, alt, h.ciudad, h.foto_credito);
    html += '<div class="card-body"><h3>' + MU.esc(h.nombre) + '</h3>';
    if (h.nombre_local && h.nombre_local !== h.nombre) html += '<p class="card-meta">' + MU.esc(h.nombre_local) + '</p>';
    html += '<p class="card-meta">' + MU.esc(MU.tx(h.grupo)) + '</p>';
    html += '<p class="card-meta"><strong>' + MU.esc(MU.t('checkin')) + ':</strong> ' + MU.esc(MU.fecha(h.checkin)) + ' · <strong>' + MU.esc(MU.t('checkout')) + ':</strong> ' + MU.esc(MU.fecha(h.checkout)) + '</p>';
    html += '<div class="badges"><span class="badge badge-info">' + MU.esc(MU.t('segun_itinerario')) + '</span>' + (h.revisar ? '<span class="badge badge-warn">◌ ' + (MU.getLang() === 'es' ? 'Revisar reservación' : 'Review booking') + '</span>' : '') + '</div>';
    html += '<p><strong>' + MU.esc(MU.t('direccion')) + ':</strong> ' + MU.esc(h.direccion || MU.t('sin_datos')) + '</p>';
    if (h.telefono) html += '<p class="card-meta"><strong>' + MU.esc(MU.t('telefono')) + ':</strong> ' + MU.esc(h.telefono) + '</p>';
    html += '<div class="card-links">';
    if (h.mapa_url) html += '<a class="btn btn-sm" href="' + MU.esc(h.mapa_url) + '" target="_blank" rel="noopener noreferrer">' + MU.esc(MU.t('ver_ubicacion')) + ' ↗</a>';
    if (h.sitio_web) html += '<a class="btn btn-sm" href="' + MU.esc(h.sitio_web) + '" target="_blank" rel="noopener noreferrer">' + MU.esc(MU.t('sitio_oficial')) + ' ↗</a>';
    if (h.agenda_pagina) html += '<a class="btn btn-sm" href="' + MU.esc(window.MISSION.mission.pdf_agenda) + '#page=' + h.agenda_pagina + '" target="_blank" rel="noopener noreferrer">' + MU.esc(MU.t('ver_agenda_pagina').replace('{n}', h.agenda_pagina)) + '</a>';
    html += '</div>';
    if (h.nota_coordinacion) html += '<p class="item-notes">' + MU.esc(MU.tx(h.nota_coordinacion)) + '</p>';
    html += MU.refLabel();
    html += '</div></article>';
  });
  html += '</div>';
  return html;
};
