import sqlite3 from 'sqlite3';
import jwt from 'jsonwebtoken';

const db = new sqlite3.Database('./db/sqlite.db', (err) => {
  if (err) {
    console.error("Baza nije uspješno otvorena: ", err);
  } else {
    console.log("Baza podataka je uspješno otvorena.");
  }
});

class Korisnici {

  static getAll(callback) {
    db.all('SELECT * FROM Korisnici', callback);
  }

  static getById(id, callback) {
    db.get('SELECT * FROM Korisnici WHERE ID = ?', [id], callback);
  }

  static add(email, sifra, username, uloga, callback) {
    const query = 'INSERT INTO Korisnici (email, sifra, username, uloga) VALUES (?, ?, ?, ?)';
    db.run(query, [email, sifra, username, uloga], function (err) {
      callback(err, this.lastID);
    });
  }

  static updateById(id, email, sifra, username, uloga, callback) {
    const query = 'UPDATE Korisnici SET email = ?, sifra = ?, username = ?, uloga = ? WHERE ID = ?';
    db.run(query, [email, sifra, username, uloga, id], function (err) {
      callback(err, this.changes);
    });
  }

  static deleteById(id, callback) {
    const query = 'DELETE FROM Korisnici WHERE ID = ?';
    db.run(query, [id], function (err) {
      callback(err, this.changes);
    });
  }

  static login(email, sifra, callback) {
    const query = 'SELECT * FROM Korisnici WHERE email = ?';
    db.get(query, [email], (err, user) => {
      if (err) {
        return callback(err, null);
      }
      if (!user) {
        return callback(null, null);
      }

      if (user.sifra === sifra) {
        const payload = {
          id: user.ID,
          email: user.email,
          username: user.username,
          uloga: user.uloga
        };

        const secretKey = 'adadda'; 
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' }); 

        callback(null, {
          user: payload,
          token: token
        });
      } else {
        callback(null, null);
      }
    });
  }
}

export default Korisnici;
