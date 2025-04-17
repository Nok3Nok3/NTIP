import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('./db/sqlite.db', (err) => {
  if (err) {
    console.error("Baza nije uspješno otvorena: ", err);
  } else {
    console.log("Baza podataka je uspješno otvorena.");
  }
});

class PaketiHrane {
  // Dohvatanje svih paketa hrane
  static getAll(callback) {
    db.all('SELECT * FROM PaketiHrane', callback);
  }

  // Dohvatanje paketa hrane po ID-u
  static getById(id, callback) {
    db.get('SELECT * FROM PaketiHrane WHERE id = ?', [id], callback);
  }

  // Dodavanje novog paketa hrane
  static add(naziv, opis, cijena, callback) {
    const query = 'INSERT INTO PaketiHrane (naziv, opis, cijena) VALUES (?, ?, ?)';
    db.run(query, [naziv, opis, cijena], function (err) {
      callback(err, this.lastID);
    });
  }

  // Ažuriranje paketa hrane po ID-u
  static updateById(id, naziv, opis, cijena, callback) {
    const query = 'UPDATE PaketiHrane SET naziv = ?, opis = ?, cijena = ? WHERE id = ?';
    db.run(query, [naziv, opis, cijena, id], function (err) {
      callback(err, this.changes);
    });
  }

  // Brisanje paketa hrane po ID-u
  static deleteById(id, callback) {
    const query = 'DELETE FROM PaketiHrane WHERE id = ?';
    db.run(query, [id], function (err) {
      callback(err, this.changes);
    });
  }
}

export default PaketiHrane;
