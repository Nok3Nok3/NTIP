import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('./db/sqlite.db', (err) => {
  if (err) {
    console.error("Baza nije uspješno otvorena: ", err);
  } else {
    console.log("Baza podataka je uspješno otvorena.");
  }
});

class Termini {
  // Dohvatanje svih termina
  static getAll(callback) {
    db.all('SELECT * FROM Termini', callback);
  }

  // Dohvatanje termina po ID-u
  static getById(id, callback) {
    db.get('SELECT * FROM Termini WHERE id = ?', [id], callback);
  }

  // Dodavanje novog termina
  static add(datum, vrijeme, dostupnost, callback) {
    const query = 'INSERT INTO Termini (datum, vrijeme, dostupnost) VALUES (?, ?, ?)';
    db.run(query, [datum, vrijeme, dostupnost], function (err) {
      callback(err, this.lastID);
    });
  }

  // Ažuriranje termina po ID-u
  static updateById(id, datum, vrijeme, dostupnost, callback) {
    const query = 'UPDATE Termini SET datum = ?, vrijeme = ?, dostupnost = ? WHERE id = ?';
    db.run(query, [datum, vrijeme, dostupnost, id], function (err) {
      callback(err, this.changes);
    });
  }

  // Brisanje termina po ID-u
  static deleteById(id, callback) {
    const query = 'DELETE FROM Termini WHERE id = ?';
    db.run(query, [id], function (err) {
      callback(err, this.changes);
    });
  }

  // Provjera dostupnosti termina
  static checkAvailability(datum, vrijeme, callback) {
    const query = 'SELECT * FROM Termini WHERE datum = ? AND vrijeme = ? AND dostupnost = 1';
    db.get(query, [datum, vrijeme], callback);
  }
}

export default Termini;
