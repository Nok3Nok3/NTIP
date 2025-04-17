// pages/Korisnici.js
import sqlite3 from 'sqlite3';

// Konfiguracija baze podataka
const db = new sqlite3.Database('./db/sqlite.db', (err) => {
  if (err) {
    console.error("Baza nije uspješno otvorena: ", err);
  } else {
    console.log("Baza podataka je uspješno otvorena.");
  }
});

class Korisnici {

  // Dohvatanje svih korisnika
  static getAll(callback) {
    db.all('SELECT * FROM Korisnici', callback);
  }

  // Dohvatanje korisnika po ID-u
  static getById(id, callback) {
    db.get('SELECT * FROM Korisnici WHERE ID = ?', [id], callback);
  }

  // Dodavanje novog korisnika
  static add(email, sifra, username, uloga, callback) {
    const query = 'INSERT INTO Korisnici (email, sifra, username, uloga) VALUES (?, ?, ?, ?)';
    db.run(query, [email, sifra, username, uloga], function (err) {
      callback(err, this.lastID);
    });
  }

  // Ažuriranje podataka korisnika
  static updateById(id, email, sifra, username, uloga, callback) {
    const query = 'UPDATE Korisnici SET email = ?, sifra = ?, username = ?, uloga = ? WHERE ID = ?';
    db.run(query, [email, sifra, username, uloga, id], function (err) {
      callback(err, this.changes);
    });
  }

  // Brisanje korisnika po ID-u
  static deleteById(id, callback) {
    const query = 'DELETE FROM Korisnici WHERE ID = ?';
    db.run(query, [id], function (err) {
      callback(err, this.changes);
    });
  }

  // Funkcija za login bez bcrypt (testiranje lozinki u čistom tekstu)
  static login(email, sifra, callback) {
    const query = 'SELECT * FROM Korisnici WHERE email = ?';
    db.get(query, [email], (err, user) => {
      if (err) {
        return callback(err, null);
      }
      if (!user) {
        return callback(null, null); // Korisnik ne postoji
      }
  
      // Provjera lozinke (bez hashiranja, samo za testiranje)
      if (user.sifra === sifra) {
        // Vraćamo podatke o korisniku
        callback(null, {
          id: user.ID,           // Koristi 'ID' kako je definisano u bazi
          email: user.email,
          username: user.username,
          uloga: user.uloga
        });
      } else {
        callback(null, null); // Pogrešna lozinka
      }
    });
  }
}

export default Korisnici;
