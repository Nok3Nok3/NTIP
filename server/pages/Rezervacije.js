import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('./db/sqlite.db', (err) => {
  if (err) {
    console.error('Greška prilikom povezivanja sa bazom:', err);
  }
});

class Rezervacije {
  // Dohvatanje svih rezervacija
  static getAll(callback) {
    db.all('SELECT * FROM Rezervacije', callback);
  }

  // Dohvatanje rezervacije po ID-u
  static getById(id, callback) {
    db.get('SELECT * FROM Rezervacije WHERE ID = ?', [id], callback);
  }

  // Dodavanje nove rezervacije
  static add(Termin_id, Dekoracije_id, Korisnici_id, PaketiHrane_id, SvadbeneSale_id, Usluge_id, callback) {
    const query = `
      INSERT INTO Rezervacije (Termin_id, Dekoracije_id, Korisnici_id, PaketiHrane_id, SvadbeneSale_id, Usluge_id) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.run(query, [Termin_id, Dekoracije_id, Korisnici_id, PaketiHrane_id, SvadbeneSale_id, Usluge_id], function (err) {
      callback(err, this.lastID);
    });
  }

  // Ažuriranje postojeće rezervacije po ID-u
  static updateById(id, Termin_id, Dekoracije_id, Korisnici_id, PaketiHrane_id, SvadbeneSale_id, Usluge_id, callback) {
    const query = `
      UPDATE Rezervacije 
      SET Termin_id = ?, Dekoracije_id = ?, Korisnici_id = ?, PaketiHrane_id = ?, SvadbeneSale_id = ?, Usluge_id = ?
      WHERE ID = ?
    `;
    db.run(query, [Termin_id, Dekoracije_id, Korisnici_id, PaketiHrane_id, SvadbeneSale_id, Usluge_id, id], function (err) {
      callback(err, this.changes);
    });
  }

  // Brisanje rezervacije po ID-u
  static deleteById(id, callback) {
    const query = 'DELETE FROM Rezervacije WHERE ID = ?';
    db.run(query, [id], function (err) {
      callback(err, this.changes);
    });
  }
  static getByKorisnikId(korisnikId, callback) {
    const query = 'SELECT * FROM Rezervacije WHERE Korisnici_id = ?';
    db.all(query, [korisnikId], callback);
  }
}

export default Rezervacije;
