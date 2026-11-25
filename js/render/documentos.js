window.MR = window.MR || {};
MR.documentos = function () {
  var docs = window.MISSION.documents.documentos || [];
  var html = '<div class="cards three-col">';
  docs.slice().sort(function (a, b) { return (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0); }).forEach(function (d) {
    html += '<article class="card doc">';
    if (d.portada) {
      html += '<img class="doc-preview" src="' + MU.esc(d.portada) + '" alt="' + MU.esc((MU.getLang() === 'es' ? 'Portada de ' : 'Cover of ') + MU.tx(d.titulo)) + '" width="480" height="300" loading="lazy" decoding="async">';
    } else {
      html += '<div class="doc-preview placeholder" role="img" aria-label="' + MU.esc(MU.t('sin_foto')) + '">▣</div>';
    }
    var meta = [d.categoria];
    if (d.version) meta.push(d.version);
    if (d.fecha) meta.push(MU.fecha(d.fecha));
    html += '<div class="card-body"><h3>' + MU.esc(MU.tx(d.titulo)) + '</h3>';
    html += '<p class="card-meta">' + MU.esc(meta.join(' · ')) + '</p>';
    html += '<p class="card-meta">' + MU.esc(d.paginas || '—') + ' ' + MU.esc(MU.t('paginas')) + ' · ' + MU.esc(MU.tamano(d.peso_kb)) + '</p>';
    html += '<div class="badges">' + (d.vigente ? '<span class="badge badge-ok">✓ ' + MU.esc(MU.t('vigente')) + '</span>' : '<span class="badge badge-neutral">' + MU.esc(MU.t('obsoleto')) + '</span>') + '</div>';
    if (d.idioma !== MU.getLang()) html += '<p class="source">' + MU.esc(MU.t(d.idioma === 'es' ? 'documento_es' : 'documento_en')) + '</p>';
    html += '<div class="card-links">';
    html += '<a class="btn btn-sm" href="' + MU.esc(d.archivo) + '#view=FitH" target="_blank" rel="noopener noreferrer">' + MU.esc(MU.t('vista_previa')) + ' ↗</a>';
    html += '<a class="btn btn-sm" href="' + MU.esc(d.archivo) + '" target="_blank" rel="noopener noreferrer">' + MU.esc(MU.t('abrir')) + ' ↗</a>';
    html += '<a class="btn btn-sm" href="' + MU.esc(d.archivo) + '" download>' + MU.esc(MU.t('descargar')) + '</a>';
    html += '</div>';
    html += MU.tradNote(d.titulo);
    html += '</div></article>';
  });
  html += '</div>';
  return html;
};
