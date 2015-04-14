var DB = new function() {
  // The reference to database.
  this.db_ = null;

  this.init_ = function() {
    var schemaBuilder = lf.schema.create('scrum', 1);
    schemaBuilder.createTable('Task').
        addColumn('id', lf.Type.STRING).
        addColumn('desc', lf.Type.STRING).
        addColumn('eta', lf.Type.DATE_TIME).
        addColumn('pri', lf.Type.INTEGER).
        addColumn('done', lf.Type.BOOLEAN).
        addPrimaryKey(['id']).
        addIndex('idxEta', ['eta'], /* unique */ false);

    return schemaBuilder.connect().then(function(db) {
      this.db_ = db;
    }.bind(this));
  };

  // Waitable object for database initialization.
  this.ready_ = this.init_();

  this.insertTask = function(task) {
    return this.ready_.then(function() {
      var t = this.db_.getSchema().table('Task');
      var row = t.createRow(task);
      return this.db_.insertOrReplace().into(t).values([row]).exec();
    }.bind(this));
  };

  this.listTasks = function() {
    return this.ready_.then(function() {
      var t = this.db_.getSchema().table('Task');
      return this.db_.select().
          from(t).
          where(t.done.eq(false)).
          orderBy(t.eta).
          orderBy(t.pri, lf.Order.DESC).
          exec();
    }.bind(this));
  };
};
