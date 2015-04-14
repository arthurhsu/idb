var DB = new function() {
  // The reference to database
  this.db_ = null;

  this.init_ = function() {
    return new Promise(function(resolve, reject) {
      var req = window.indexedDB.open('scrum', 1);
      req.onsuccess = function(ev) {
        this.db_ = ev.target.result;
        resolve();
      }.bind(this);
      req.onerror = reject;
      req.onupgradeneeded = function(ev) {
        var rawDb = ev.target.result;
        var task = rawDb.createObjectStore('Task', { keyPath: 'id' });
        task.createIndex('idxEta', 'eta', { unique: false });
      };
    }.bind(this));
  };

  // Waitable object for database initialization.
  this.ready_ = this.init_();

  this.insertTask = function(task) {
    return this.ready_.then(function() {
      return new Promise(function(resolve, reject) {
        var tx = this.db_.transaction(['Task'], 'readwrite');
        tx.oncomplete = resolve;
        tx.onerror = reject;
        var store = tx.objectStore('Task');
        // IndexedDB cannot save Date() directly.
        var payload = jQuery.extend(true, {}, task);
        payload.eta = payload.eta.getTime();
        store.put(payload);
      }.bind(this));
    }.bind(this));
  };

  this.listTasks = function() {
    return this.ready_.then(function() {
      return new Promise(function(resolve, reject) {
        var tx = this.db_.transaction(['Task']);
        var store = tx.objectStore('Task');
        var req = store.openCursor();
        var results = [];
        req.onsuccess = function(ev) {
          var cursor = ev.target.result;
          if (cursor) {
            if (!cursor.value.done) {
              // Need to convert back the datetime.
              cursor.value.eta = new Date(cursor.value.eta);
              results.push(cursor.value);
            }
            cursor.continue();
          } else {
            // Sort by eta asc, pri desc
            var sorted = results.sort(function(l, r) {
              return (l.eta < r.eta) ? 1 :
                  (l.eta > r.eta) ? -1 :
                  (l.pri < r.pri) ? 1 :
                  (l.pri > r.pri) ? -1 : 0;
            });
            resolve(sorted);
          }
        };
        req.onerror = reject;
      }.bind(this));
    }.bind(this));
  };
};
