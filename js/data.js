(function () {
  var node = document.getElementById('site-data');
  var data = {};
  try {
    data = JSON.parse(node ? node.textContent : '{}');
  } catch (error) {
    console.error('No se pudieron leer los datos incrustados de la misión.', error);
  }
  window.MISSION = data;
})();
