window.MR = window.MR || {};
MR.subActual = null;

MR.inicializarAgenda = function (sub) {
  var panel = document.getElementById('view-body');
  if (!panel) return;
  var dias = window.MISSION.agenda.dias || [];
  if (!dias.length) { panel.innerHTML = '<p class="state">' + MU.esc(MU.t('empty')) + '</p>'; return; }
  var idDia = sub && dias.filter(function (d) { return d.id === sub; })[0] ? sub : dias[0].id;
  var filtro = 'todos';
  MR.subActual = idDia;

  function dibujarTabs() {
    var html = '<div class="day-tabs" role="tablist" aria-label="' + MU.esc(MU.t('dia')) + '">';
    var hoyIso = new Date().toISOString().slice(0, 10);
    dias.forEach(function (dia) {
      var c = dia.clima || {};
      var clima = (c.min !== null && c.min !== undefined) ? c.min + '–' + c.max + '°' : '—';
      html += '<button class="day-tab" type="button" role="tab" data-day="' + MU.esc(dia.id) + '" aria-selected="' + (dia.id === idDia ? 'true' : 'false') + '">';
      html += '<strong>' + MU.esc(MU.tx(dia.etiqueta)) + (dia.fecha === hoyIso ? ' · ' + MU.esc(MU.t('hoy')) : '') + '</strong><span>' + MU.esc(MU.fecha(dia.fecha, { day: '2-digit', month: 'short' })) + ' · ' + MU.esc(dia.ciudad) + ' · ' + MU.esc(clima) + '</span></button>';
    });
    html += '</div><div class="filters" role="group" aria-label="' + MU.esc(MU.t('filter_tipo')) + '">';
    var filtros = [
      { id: 'todos', key: 'todos' }, { id: 'principales', es: 'Sesiones y visitas', en: 'Sessions and visits' },
      { id: 'traslados', es: 'Traslados y vuelos', en: 'Transfers and flights' },
      { id: 'comidas', key: 'tipo_comida' }, { id: 'descansos', es: 'Descansos', en: 'Breaks' }
    ];
    filtros.forEach(function (f) {
      var txt = f.key ? MU.t(f.key) : MU.getLang() === 'es' ? f.es : f.en;
      html += '<button class="filter" type="button" data-filter="' + f.id + '" aria-pressed="' + (f.id === filtro ? 'true' : 'false') + '">' + MU.esc(txt) + '</button>';
    });
    html += '</div><div class="actions" style="margin-bottom:.6rem"><button class="btn btn-sm" type="button" onclick="window.print()">' + (MU.getLang() === 'es' ? 'Imprimir día' : 'Print day') + '</button></div><div id="day-panel" aria-live="polite"></div>';
    panel.innerHTML = html;
    panel.querySelectorAll('.day-tab').forEach(function (tab) {
      tab.addEventListener('click', function () { seleccionarDia(tab.getAttribute('data-day')); });
    });
    panel.querySelectorAll('.filter').forEach(function (btn) {
      btn.addEventListener('click', function () {
        filtro = btn.getAttribute('data-filter');
        panel.querySelectorAll('.filter').forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
        dibujarDia();
      });
    });
  }

  function dibujarDia() {
    var cont = document.getElementById('day-panel');
    if (!cont) return;
    var dia = dias.filter(function (d) { return d.id === idDia; })[0] || dias[0];
    var grupos = {
      principales: ['reunion', 'visita', 'feria'],
      traslados: ['vuelo', 'traslado', 'aeropuerto', 'checkin', 'checkout'],
      comidas: ['comida', 'cena'], descansos: ['descanso', 'libre']
    };
    var html = '<div class="day-head"><div><dt>' + MU.esc(MU.getLang() === 'es' ? 'Ciudad' : 'City') + '</dt><dd>' + MU.esc(dia.ciudad) + '</dd></div>';
    html += '<div><dt>' + MU.esc(MU.getLang() === 'es' ? 'Fecha' : 'Date') + '</dt><dd>' + MU.esc(MU.fecha(dia.fecha, { weekday: 'long', day: 'numeric', month: 'long' })) + '</dd></div>';
    html += '<div><dt>' + MU.esc(MU.t('vestimenta')) + '</dt><dd>' + MU.esc(MU.tx(dia.vestimenta) || MU.t('sin_datos')) + '</dd></div>';
    var c = dia.clima || {};
    html += '<div><dt>' + MU.esc(MU.t('clima')) + '</dt><dd>' + MU.esc((c.min !== null && c.min !== undefined) ? c.min + '–' + c.max + ' °' + c.unidad : MU.t('sin_datos')) + '</dd></div></div>';
    if (dia.nota) html += '<p class="card-meta">' + MU.esc(MU.tx(dia.nota)) + '</p>';
    html += '<ol class="timeline">';
    var n = 0;
    dia.actividades.forEach(function (a) {
      if (filtro !== 'todos' && grupos[filtro] && grupos[filtro].indexOf(a.tipo) < 0) return;
      n++;
      var t = MU.tipo(a.tipo);
      html += '<li><span class="time">' + MU.esc(MU.hora(a.inicio)) + (a.fin ? '<br><span class="card-meta">' + MU.esc(MU.hora(a.fin)) + '</span>' : '') + '</span>';
      html += '<span class="dot" aria-hidden="true"></span><div class="item"><div class="item-head"><p class="item-title"><span aria-hidden="true">' + t.ico + '</span> ' + MU.esc(MU.tx(a.titulo)) + '</p>';
      html += '<span class="badge badge-neutral">' + MU.esc(t.txt) + '</span></div>';
      html += '<p class="item-sub">' + MU.esc(MU.tx(a.lugar) || MU.t('sin_datos'));
      if (a.direccion) html += ' · ' + MU.esc(a.direccion);
      html += '</p>';
      if (a.zona_inicio && a.zona_fin && a.zona_inicio !== a.zona_fin) {
        html += '<p class="item-sub">' + (MU.getLang() === 'es' ? 'Horas locales' : 'Local times') + ': ' + MU.esc(a.zona_inicio) + ' → ' + MU.esc(a.zona_fin) + '</p>';
      }
      html += '<div class="badges">' + MU.badge(a.estado);
      if (a.dias_extra_fin) html += '<span class="badge badge-info"><span aria-hidden="true">＋</span> ' + MU.esc(MU.t('mas_un_dia')) + '</span>';
      if (a.fuente && a.fuente !== 'agenda') html += '<span class="badge badge-info">' + (MU.getLang() === 'es' ? 'Complemento' : 'Supplement') + '</span>';
      if (a.revisar) html += '<span class="badge badge-warn"><span aria-hidden="true">◌</span> ' + (MU.getLang() === 'es' ? 'Revisar' : 'Review') + '</span>';
      html += '</div>';
      if (a.notas) html += '<p class="item-notes">' + MU.esc(MU.tx(a.notas)) + '</p>';
      html += MU.tradNote(a.titulo);
      html += '</div></li>';
    });
    html += '</ol>';
    if (!n) html = '<p class="state">' + MU.esc(MU.t('empty')) + '</p>' + html;
    cont.innerHTML = html;
  }

  function seleccionarDia(id) {
    var dia = dias.filter(function (d) { return d.id === id; })[0];
    if (!dia) return;
    idDia = id; MR.subActual = id;
    panel.querySelectorAll('.day-tab').forEach(function (t) { t.setAttribute('aria-selected', String(t.getAttribute('data-day') === id)); });
    dibujarDia();
    if (history.replaceState) history.replaceState(null, '', '#agenda/' + id);
  }
  MR.seleccionarDia = seleccionarDia;
  dibujarTabs();
  dibujarDia();
};
