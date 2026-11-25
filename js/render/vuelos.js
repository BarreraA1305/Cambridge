window.MR = window.MR || {};
MR.vuelos = function () {
  var rutas = window.MISSION.flights.rutas || [];
  var html = '';
  rutas.forEach(function (r) {
    html += '<article class="card"><h3>' + MU.esc(MU.tx(r.nombre)) + '</h3>';
    html += '<p class="card-meta">' + (MU.getLang() === 'es' ? 'Sentido' : 'Direction') + ': ' + MU.esc(MU.tx(r.sentido)) + '</p>';
    html += '<p class="card-meta"><strong>' + MU.esc(MU.t('viajeros')) + ':</strong></p><div class="travelers">';
    MU.personas(r.viajeros).forEach(function (p) { html += '<span class="chip">' + MU.esc(p.nombre) + '</span>'; });
    html += '</div>';
    html += '<div class="table-wrap"><table><thead><tr><th>' + MU.esc(MU.t('aerolinea')) + '</th><th>' + MU.esc(MU.t('origen')) + ' → ' + MU.esc(MU.t('destino')) + '</th><th>' + MU.esc(MU.t('salida')) + '</th><th>' + MU.esc(MU.t('llegada')) + '</th><th>' + MU.esc(MU.t('terminal')) + '</th></tr></thead><tbody>';
    (r.tramos || []).forEach(function (t) {
      html += '<tr><td class="flight-num">' + MU.esc(t.numero) + '<p class="card-meta">' + MU.esc(t.aerolinea) + '</p></td>';
      html += '<td><span class="route-line">' + MU.esc(t.origen) + ' <span class="route-arrow">→</span> ' + MU.esc(t.destino) + '</span><p class="card-meta">' + MU.esc(t.origen_nombre) + ' → ' + MU.esc(t.destino_nombre) + '</p></td>';
      html += '<td>' + MU.esc(String(t.sale_local || '').replace('T', ' ')) + '<p class="card-meta">' + MU.esc(t.zona_salida) + '</p></td>';
      html += '<td>' + MU.esc(String(t.llega_local || '').replace('T', ' ')) + (t.dias_extra_llegada ? ' <span class="badge badge-info">' + MU.esc(MU.t('mas_un_dia')) + '</span>' : '') + '<p class="card-meta">' + MU.esc(t.zona_llegada) + '</p></td>';
      html += '<td>' + MU.esc(t.terminal_salida || '—') + ' → ' + MU.esc(t.terminal_llegada || '—') + '</td></tr>';
    });
    html += '</tbody></table></div></article>';
  });
  return html;
};
