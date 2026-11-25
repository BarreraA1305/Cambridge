window.MR = window.MR || {};
MR.economia = function () {
  var e = window.MISSION.economy;
  var html = '<div class="cards">';
  (e.indicadores || []).forEach(function (i) {
    html += '<article class="card"><p class="metric">' + MU.esc(i.valor) + '%</p>';
    html += '<p class="metric-label">' + MU.esc(MU.tx(i.nombre)) + '</p>';
    html += '<p class="card-meta">' + MU.esc(i.lugar) + ' · ' + MU.esc(i.año) + '</p>';
    if (MU.tx(i.descripcion)) html += '<p>' + MU.esc(MU.tx(i.descripcion)) + '</p>';
    html += '<p class="source">' + MU.esc(MU.t('fuente')) + ': ' + MU.esc(i.fuente) + '. ' + MU.esc(MU.tx(i.estado_validacion)) + '.</p>';
    html += '</article>';
  });
  html += '</div><div class="card" style="margin-top:.9rem"><h3>' + (MU.getLang() === 'es' ? 'Sectores prioritarios' : 'Priority sectors') + '</h3><ul class="chips">';
  (e.sectores_prioritarios || []).forEach(function (s) { html += '<li class="chip">' + MU.esc(MU.tx(s)) + '</li>'; });
  html += '</ul></div>';
  return html;
};
