import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('./db/sqlite.db', (err) => {
  if (err) {
    console.error("Baza nije uspješno otvorena: ", err);
  } else {
    console.log("Baza podataka je uspješno otvorena.");
  }
});

class Usluge {
  // Dohvatanje svih usluga
  static getAll(callback) {
    db.all('SELECT * FROM Usluge', callback);
  }

  // Dohvatanje usluge po ID-u
  static getById(id, callback) {
    db.get('SELECT * FROM Usluge WHERE id = ?', [id], callback);
  }

  // Dodavanje nove usluge
  static add(naziv, opis, cijena, callback) {
    const query = 'INSERT INTO Usluge (naziv, opis, cijena) VALUES (?, ?, ?)';
    db.run(query, [naziv, opis, cijena], function (err) {
      callback(err, this.lastID);
    });
  }

  // Ažuriranje usluge po ID-u
  static updateById(id, naziv, opis, cijena, callback) {
    const query = 'UPDATE Usluge SET naziv = ?, opis = ?, cijena = ? WHERE id = ?';
    db.run(query, [naziv, opis, cijena, id], function (err) {
      callback(err, this.changes);
    });
  }

  // Brisanje usluge po ID-u
  static deleteById(id, callback) {
    const query = 'DELETE FROM Usluge WHERE id = ?';
    db.run(query, [id], function (err) {
      callback(err, this.changes);
    });
  }
}

export default Usluge;
