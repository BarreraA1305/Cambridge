window.MR = window.MR || {};
MR.promocion = function () {
  var items = window.MISSION.promo.material || [];
  var html = '<div class="cards three-col">';
  items.forEach(function (item) {
    html += '<article class="card promo">';
    if (item.portada) {
      html += '<img class="doc-preview" src="' + MU.esc(item.portada) + '" alt="' + MU.esc((MU.getLang() === 'es' ? 'Portada de ' : 'Cover of ') + MU.tx(item.titulo)) + '" width="480" height="300" loading="lazy" decoding="async">';
    }
    html += '<div class="card-body"><h3>' + MU.esc(MU.tx(item.titulo)) + '</h3>';
    html += '<p class="card-meta">' + MU.esc(MU.tx(item.tipo)) + ' · ' + MU.esc(item.idioma.toUpperCase()) + ' · ' + MU.esc(MU.tamano(item.peso_kb)) + '</p>';
    html += '<p>' + MU.esc(MU.tx(item.descripcion)) + '</p>';
    html += '<div class="card-links">';
    html += '<a class="btn btn-sm" href="' + MU.esc(item.archivo) + '#view=FitH" target="_blank" rel="noopener noreferrer">' + MU.esc(MU.t('vista_previa')) + ' ↗</a>';
    html += '<a class="btn btn-sm" href="' + MU.esc(item.archivo) + '" download>' + MU.esc(MU.t('descargar')) + '</a>';
    html += '</div>';
    html += MU.tradNote(item.descripcion);
    html += '</div></article>';
  });
  html += '</div>';
  return html;
};
