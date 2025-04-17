import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('./db/sqlite.db', (err) => {
  if (err) {
    console.error("Baza nije uspješno otvorena: ", err);
  } else {
    console.log("Baza podataka je uspješno otvorena.");
  }
});

class Dekoracije {
  // Dohvatanje svih dekoracija
  static getAll(callback) {
    db.all('SELECT * FROM Dekoracije', callback);
  }

  // Dohvatanje dekoracije po ID-u
  static getById(id, callback) {
    db.get('SELECT * FROM Dekoracije WHERE id = ?', [id], callback);
  }

  // Dodavanje nove dekoracije
  static add(naziv, tip, cijena, kolicina, opis, callback) {
    const query = 'INSERT INTO Dekoracije (naziv, tip, cijena, kolicina, opis) VALUES (?, ?, ?, ?, ?)';
    db.run(query, [naziv, tip, cijena, kolicina, opis], function (err) {
      callback(err, this.lastID);
    });
  }

  // Ažuriranje dekoracije po ID-u
  static updateById(id, naziv, tip, cijena, kolicina, opis, callback) {
    const query = 'UPDATE Dekoracije SET naziv = ?, tip = ?, cijena = ?, kolicina = ?, opis = ? WHERE id = ?';
    db.run(query, [naziv, tip, cijena, kolicina, opis, id], function (err) {
      callback(err, this.changes);
    });
  }

  // Brisanje dekoracije po ID-u
  static deleteById(id, callback) {
    const query = 'DELETE FROM Dekoracije WHERE id = ?';
    db.run(query, [id], function (err) {
      callback(err, this.changes);
    });
  }
}

export default Dekoracije;
