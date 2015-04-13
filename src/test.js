$(function() {
  for (var i = 0; i < 5; ++i) {
    $('#pri').append($('<option/>', {
      value: i,
      text: i.toString()
    }));
  }
  var later = new Date(new Date().getTime() + 86400000);

  $('#eta').val(later.toString());

  $('#add').click(function() {
    DB.insertTask({
      id: $('#id').val(),
      desc: $('#desc').val(),
      eta: later,
      pri: $('#pri').val(),
      done: $('#done').is(':checked')
    }).then(refresh);
  });

  refresh();
});

function refresh() {
  $('#task').empty();
  DB.listTasks().then(function(results) {
    results.forEach(function(row) {
      $('#task').append(
          '<li>' + row['id'] + ' P' + row['pri'] +
          '(' + row['eta'].toLocaleDateString() + ')' +
          ':' + row['desc'] + '</li>');
    });
  });
}
