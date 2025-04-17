import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('./db/sqlite.db', (err) => {
});

class SvadbeneSale {

  // Dohvatanje svih svadbenih sala
  static getAll(callback) {
    db.all('SELECT * FROM SvadbeneSale', callback);
  }

  // Dohvatanje svadbene sale po ID-u
  static getById(id, callback) {
    db.get('SELECT * FROM SvadbeneSale WHERE ID = ?', [id], callback);
  }

  // Dodavanje nove svadbene sale
  static add(naziv_sale, broj_mjesta, adresa, broj_stolova, broj_stolica, callback) {
    const query = 'INSERT INTO SvadbeneSale (naziv_sale, broj_mjesta, adresa, broj_stolova, broj_stolica) VALUES (?, ?, ?, ?, ?)';
    db.run(query, [naziv_sale, broj_mjesta, adresa, broj_stolova, broj_stolica], function (err) {
      callback(err, this.lastID);
    });
  }

  // Ažuriranje podataka svadbene sale
  static updateById(id, naziv_sale, broj_mjesta, adresa, broj_stolova, broj_stolica, callback) {
    const query = 'UPDATE SvadbeneSale SET naziv_sale = ?, broj_mjesta = ?, adresa = ?, broj_stolova = ?, broj_stolica = ? WHERE ID = ?';
    db.run(query, [naziv_sale, broj_mjesta, adresa, broj_stolova, broj_stolica, id], function (err) {
      callback(err, this.changes);
    });
  }

  // Brisanje svadbene sale po ID-u
  static deleteById(id, callback) {
    const query = 'DELETE FROM SvadbeneSale WHERE ID = ?';
    db.run(query, [id], function (err) {
      callback(err, this.changes);
    });
  }
}

export default SvadbeneSale;
