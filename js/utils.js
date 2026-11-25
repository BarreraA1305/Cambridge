window.MU = (function () {
  var ENT = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  var lang = 'es';

  function esc(value) {
    return String(value === null || value === undefined ? '' : value).replace(/[&<>"']/g, function (c) { return ENT[c]; });
  }
  function norm(value) {
    return String(value === null || value === undefined ? '' : value)
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }
  function setLang(code) { lang = code === 'en' ? 'en' : 'es'; }
  function getLang() { return lang; }
  function locales() { return lang === 'en' ? 'en-GB' : 'es-MX'; }

  function t(clave) {
    var tabla = (window.MISSION && window.MISSION.i18n && window.MISSION.i18n[lang]) || {};
    var otro = (window.MISSION && window.MISSION.i18n && window.MISSION.i18n[lang === 'es' ? 'en' : 'es']) || {};
    if (tabla[clave] !== undefined && tabla[clave] !== '') return tabla[clave];
    if (otro[clave] !== undefined && otro[clave] !== '') return otro[clave];
    return clave;
  }
  function tx(valor) {
    if (valor === null || valor === undefined) return '';
    if (typeof valor === 'string') return valor;
    if (typeof valor === 'object') {
      if (valor[lang]) return valor[lang];
      var otra = valor[lang === 'es' ? 'en' : 'es'];
      if (otra) return otra;
    }
    return '';
  }
  function esBilingue(valor) { return !!(valor && typeof valor === 'object' && !Array.isArray(valor)); }

  function fecha(iso, opciones) {
    if (!iso) return t('sin_datos');
    var op = opciones || { day: '2-digit', month: 'short', year: 'numeric' };
    try { return new Intl.DateTimeFormat(locales(), op).format(new Date(iso + 'T12:00:00')); }
    catch (e) { return iso; }
  }
  function rango(inicio, fin) {
    if (!inicio || !fin) return t('sin_datos');
    var a = new Intl.DateTimeFormat(locales(), { day: '2-digit', month: 'short' }).format(new Date(inicio + 'T12:00:00'));
    var b = new Intl.DateTimeFormat(locales(), { day: '2-digit', month: 'short' }).format(new Date(fin + 'T12:00:00'));
    var anio = new Date(fin + 'T12:00:00').getFullYear();
    return a + ' · ' + b + ' ' + anio;
  }
  function hora(value) { return value ? String(value).slice(0, 5) : '—'; }
  function iniciales(nombre) {
    return String(nombre || '?').trim().split(/\s+/).filter(function (p) { return /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(p); })
      .slice(0, 2).map(function (p) { return p[0].toUpperCase(); }).join('');
  }
  var ESTADOS = {
    confirmado: { cls: 'badge-ok', ico: '✓', key: 'confirmado' },
    por_definir: { cls: 'badge-warn', ico: '◌', key: 'por_definir' },
    por_confirmar: { cls: 'badge-warn', ico: '◌', key: 'por_confirmar' },
    cancelado: { cls: 'badge-danger', ico: '✕', key: 'cancelado' }
  };
  function badge(estado) {
    var e = ESTADOS[estado] || ESTADOS.confirmado;
    return '<span class="badge ' + e.cls + '"><span aria-hidden="true">' + e.ico + '</span> ' + t(e.key) + '</span>';
  }
  var TIPOS = {
    vuelo: { ico: '✈', key: 'tipo_vuelo' }, traslado: { ico: '⇄', key: 'tipo_traslado' },
    checkin: { ico: '⌂', key: 'tipo_checkin' }, checkout: { ico: '⌂', key: 'tipo_checkout' },
    comida: { ico: '▤', key: 'tipo_comida' }, cena: { ico: '▤', key: 'tipo_cena' },
    reunion: { ico: '◉', key: 'tipo_reunion' }, visita: { ico: '◎', key: 'tipo_visita' },
    feria: { ico: '▣', key: 'tipo_reunion' }, libre: { ico: '○', key: 'tipo_libre' },
    descanso: { ico: '☕', key: 'tipo_descanso' }, aeropuerto: { ico: '⚑', key: 'tipo_aeropuerto' },
    otro: { ico: '•', key: 'tipo_otro' }
  };
  function tipo(clave) {
    var x = TIPOS[clave] || TIPOS.otro;
    return { ico: x.ico, txt: t(x.key) };
  }
  function persona(id) {
    var list = (window.MISSION.people.delegacion || []).concat(window.MISSION.people.contrapartes || []);
    for (var i = 0; i < list.length; i++) { if (list[i].id === id) return list[i]; }
    return null;
  }
  function personas(ids) { return (ids || []).map(persona).filter(Boolean); }
  function tamano(kb) {
    if (!kb) return '—';
    return kb >= 1024 ? (kb / 1024).toFixed(1) + ' MB' : kb + ' KB';
  }
  function foto(archivo, alt, ciudad, credito, extraClase) {
    if (!archivo) {
      return '<div class="photo ' + (extraClase || '') + '" role="img" aria-label="' + esc(alt || '') + '">' +
        '<div class="photo-placeholder"><span class="ico" aria-hidden="true">▥</span><span>' + esc(t('sin_foto')) + '</span>' +
        (ciudad ? '<span class="photo-city">' + esc(ciudad) + '</span>' : '') + '</div></div>';
    }
    return '<div class="photo ' + (extraClase || '') + '">' +
      '<img src="' + esc(archivo) + '" alt="' + esc(alt || '') + '" width="1024" height="640" loading="lazy" decoding="async">' +
      (ciudad ? '<div class="photo-cap"><span class="photo-city">' + esc(ciudad) + '</span>' +
        (credito ? '<span class="photo-credit">' + esc(t('foto')) + ': ' + esc(credito) + '</span>' : '') + '</div>' : '') + '</div>';
  }
  function refLabel() {
    // v4: la interfaz no publica etiquetas de validación ni referencia.
    return '';
  }
  function tradNote(valor) {
    // v4: las traducciones automáticas no generan avisos visibles.
    return '';
  }
  function ahora() {
    var m = window.MISSION.mission;
    var hoy = new Date();
    var isoHoy = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    var items = [];
    (window.MISSION.agenda.dias || []).forEach(function (dia) {
      dia.actividades.forEach(function (a) { items.push({ dia: dia, act: a }); });
    });
    if (isoHoy < m.fecha_inicio) {
      var diff = Math.ceil((new Date(m.fecha_inicio + 'T12:00:00') - new Date(isoHoy + 'T12:00:00')) / 86400000);
      return { titulo: lang === 'en' ? diff + ' days to go' : 'Faltan ' + diff + ' días para la misión', meta: t('ver_agenda') + ': ' + fecha(m.fecha_inicio), act: items[0] || null, estado: 'antes' };
    }
    if (isoHoy > m.fecha_fin) {
      return { titulo: lang === 'en' ? 'Mission concluded' : 'La misión concluyó', meta: rango(m.fecha_inicio, m.fecha_fin), act: null, estado: 'despues' };
    }
    var ahoraLocal = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: m.zona_horaria_destino || 'Europe/London' }).format(hoy);
    var actual = null, siguiente = null;
    for (var i = 0; i < items.length; i++) {
      var it = items[i], ini = hora(it.act.inicio), fin = it.act.fin ? hora(it.act.fin) : ini;
      if (ini <= ahoraLocal && ahoraLocal <= fin && fin !== '—') { actual = it; break; }
    }
    for (var j = 0; j < items.length; j++) {
      if (hora(items[j].act.inicio) > ahoraLocal) { siguiente = items[j]; break; }
    }
    var elegida = actual || siguiente;
    var titulo = actual ? (t('ahora') + ': ' + tx(actual.act.titulo)) : (siguiente ? (t('siguiente') + ': ' + tx(siguiente.act.titulo)) : (lang === 'en' ? 'Last activity' : 'Última actividad del día'));
    return {
      titulo: titulo,
      meta: elegida ? (elegida.dia.etiqueta + ' · ' + fecha(elegida.dia.fecha, { day: '2-digit', month: 'short' }) + ' · ' + hora(elegida.act.inicio) + (elegida.act.fin ? '–' + hora(elegida.act.fin) : '') + ' · ' + tx(elegida.act.lugar)) : t('ver_agenda'),
      act: elegida ? elegida.act : null,
      estado: actual ? 'ahora' : 'siguiente'
    };
  }

  return {
    esc: esc, norm: norm, setLang: setLang, getLang: getLang, t: t, tx: tx, esBilingue: esBilingue,
    fecha: fecha, rango: rango, hora: hora, iniciales: iniciales, badge: badge, tipo: tipo,
    persona: persona, personas: personas, tamano: tamano, foto: foto, refLabel: refLabel,
    tradNote: tradNote, ahora: ahora
  };
})();
