const sqljs = require('sql.js');
const sqlite3 = require('sqlite3');
const series = require('async/series');
const tmp = require('tmp');

function runSqlJS() {
  // Assume in-memory db
  let db = new sqljs.Database();
  db.run('CREATE TABLE test(col1 INTEGER PRIMARY KEY, col2 INTEGER);');
  db.run('BEGIN TRANSACTION;');
  for (var i = 0; i < 100000; ++i) {
    db.run('INSERT INTO test VALUES(' + i + ',' + i * 10 + ');');
  }
  db.run('COMMIT;');

  // Verify result is correct
  let result = db.prepare('SELECT COUNT(*) FROM test;').getAsObject();
  console.log('sqljs', result);
  db.close();
}

function runSqlite3() {
  return new Promise((resolve, reject) => {
    let db = new sqlite3.Database(tmp.fileSync().name);
    db.serialize(() => {
      db.run('CREATE TABLE test(col1 INTEGER PRIMARY KEY, col2 INTEGER)');
      db.run('BEGIN TRANSACTION');
      for (var i = 0; i < 100000; ++i) {
        db.run('INSERT INTO test VALUES(' + i + ',' + i * 10 + ')');
      }
      db.run('COMMIT');

      db.all('SELECT COUNT(*) FROM test', (err, rows) => {
        console.log('sqlite3', rows);
        resolve(db);
      });
    });
  }).then((db) => {
    return new Promise((resolve, reject) => {
      db.close(resolve);
    });
  });
}

let start1 = new Date().getTime();
runSqlJS();
let end1 = new Date().getTime();
console.log('sqljs', end1 - start1);

function testSqlite3() {
  let start2 = new Date().getTime();
  runSqlite3().then(() => {
    let end2 = new Date().getTime();
    console.log('sqlite3', end2 - start2);
  }, (e) => {
    console.error(e);
  });
}

series([testSqlite3]);
