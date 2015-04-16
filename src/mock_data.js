(function() {
  var owners = ['ldap1', 'ldap2', 'ldap3'];
  var tasks = [];
  for (var i = 0; i < 10; ++i) {
    tasks.push({
      id: 'T' + i,
      desc: 'Perform task ' + i,
      owner: owners[i % owners.length],
      eta: new Date(new Date().getTime() + i * 86400000),
      pri: i % 5,
      done: false
    });
  }

  var panelNs = document.getElementById('ns');
  var panelWorking = document.getElementById('working');
  var filter = document.getElementById('filter');

  panelNs.tasks = tasks.slice(0, 4);
  panelWorking.tasks = tasks.slice(5);
  filter.owners = owners;
})();
