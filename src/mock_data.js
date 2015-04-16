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

  var uiModel = {};
  filter.owners = owners;
  filter.priorities = ['P0', 'P1', 'P2', 'P3'];
  filter.uiModel = uiModel;

  Object.observe(uiModel, function(changes) {
    var ownerCond = owners;
    if (uiModel.owner && uiModel.owner != 'All') {
      ownerCond = [uiModel.owner];
    }
    var priCond = filter.priorities;
    if (uiModel.priority && uiModel.priority != 'All') {
      priCond = [uiModel.priority];
    }
    console.log(uiModel, ownerCond, priCond);
  });
})();
