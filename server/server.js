import express from 'express';
import Korisnici from './pages/Korisnici.js';
import cors from 'cors';
import SvadbeneSale from './pages/Svadbenesale.js';
import Dekoracije from './pages/Dekoracije.js';
import PaketiHrane from './pages/paketiHrane.js';
import Termini from './pages/termini.js';
import Usluge from './pages/usluge.js';
import Rezervacije from './pages/Rezervacije.js';
const app = express();
const hostname = 'localhost';
const port = 3000;
const router = express.Router();
app.use('/', router);
app.use(cors());
app.use(express.json());
// Omogućavanje parsiranja JSON tijela
app.use(express.json());

// 1. GET - Dohvati sve korisnike
app.get('/korisnici', (req, res) => {
  Korisnici.getAll((err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Greška pri dohvaćanju korisnika.' });
    } else {
      res.json(rows);
    }
  });
});

// 2. GET - Dohvati korisnika po ID-u
app.get('/korisnici/:id', (req, res) => {
  const id = req.params.id;
  Korisnici.getById(id, (err, row) => {
    if (err) {
      res.status(500).json({ error: 'Greška pri dohvaćanju korisnika.' });
    } else if (!row) {
      res.status(404).json({ error: 'Korisnik nije pronađen.' });
    } else {
      res.json(row);
    }
  });
});

// 3. POST - Dodaj novog korisnika
app.post('/korisnici', (req, res) => {
  const { email, sifra, username, uloga } = req.body;

  if (!email || !sifra || !username || !uloga) {
    return res.status(400).json({ error: 'Svi podaci su obavezni.' });
  }

  Korisnici.add(email, sifra, username, uloga, (err, id) => {
    if (err) {
      res.status(500).json({ error: 'Greška pri dodavanju korisnika.' });
    } else {
      res.status(201).json({ message: 'Korisnik uspješno dodan.', id: id });
    }
  });
});

// 4. PUT - Ažuriraj korisnika po ID-u
app.put('/korisnici/:id', (req, res) => {
  const { email, sifra, username, uloga } = req.body;
  const id = req.params.id;

  if (!email || !sifra || !username || !uloga) {
    return res.status(400).json({ error: 'Svi podaci su obavezni.' });
  }

  Korisnici.updateById(id, email, sifra, username, uloga, (err, changes) => {
    if (err) {
      res.status(500).json({ error: 'Greška pri ažuriranju korisnika.' });
    } else if (changes === 0) {
      res.status(404).json({ error: 'Korisnik nije pronađen za ažuriranje.' });
    } else {
      res.json({ message: 'Korisnik uspješno ažuriran.' });
    }
  });
});
app.get('/rezervacije', (req, res) => {
  const korisnikId = req.query.korisnikId;

  if (korisnikId) {
    Rezervacije.getByKorisnikId(korisnikId, (err, rows) => {
      if (err) {
        res.status(500).json({ error: 'Greška pri dohvaćanju rezervacija za korisnika.' });
      } else {
        res.json(rows);
      }
    });
  } else {
    Rezervacije.getAll((err, rows) => {
      if (err) {
        res.status(500).json({ error: 'Greška pri dohvaćanju rezervacija.' });
      } else {
        res.json(rows);
      }
    });
  }
});
// 5. DELETE - Briši korisnika po ID-u
app.delete('/korisnici/:id', (req, res) => {
  const id = req.params.id;

  Korisnici.deleteById(id, (err, changes) => {
    if (err) {
      res.status(500).json({ error: 'Greška pri brisanju korisnika.' });
    } else if (changes === 0) {
      res.status(404).json({ error: 'Korisnik nije pronađen za brisanje.' });
    } else {
      res.json({ message: 'Korisnik uspješno obrisan.' });
    }
  });
});
//LOGIN
app.post('/login', (req, res) => {
  const { email, sifra } = req.body;

  if (!email || !sifra) {
    return res.status(400).json({ poruka: 'Email i šifra su obavezni.' });
  }

  Korisnici.login(email, sifra, (err, korisnikData) => {
    if (err) {
      return res.status(500).json({ poruka: 'Greška na serveru.' });
    }

    if (!korisnikData) {
      return res.status(401).json({ poruka: 'Pogrešan email ili šifra.' });
    }

    res.json({
      user: korisnikData.user,
      token: korisnikData.token
    });
  });
});




// 1. GET - Dohvati sve svadbene sale
app.get('/svadbenesale', (req, res) => {
    SvadbeneSale.getAll((err, rows) => {
      if (err) {
        res.status(500).json({ error: 'Greška pri dohvaćanju svadbenih sala.' });
      } else {
        res.json(rows);
      }
    });
  });
  
  // 2. GET - Dohvati svadbeni salu po ID-u
  app.get('/svadbenesale/:id', (req, res) => {
    const id = req.params.id;
    SvadbeneSale.getById(id, (err, row) => {
      if (err) {
        res.status(500).json({ error: 'Greška pri dohvaćanju svadbene sale.' });
      } else if (!row) {
        res.status(404).json({ error: 'Svadbena sala nije pronađena.' });
      } else {
        res.json(row);
      }
    });
  });
  
  // 3. POST - Dodaj novu svadbenu salu
  app.post('/svadbenesale', (req, res) => {
    const { naziv_sale, broj_mjesta, adresa, broj_stolova, broj_stolica } = req.body;
  
    if (!naziv_sale || !broj_mjesta || !adresa || !broj_stolova || !broj_stolica) {
      return res.status(400).json({ error: 'Svi podaci su obavezni.' });
    }
  
    SvadbeneSale.add(naziv_sale, broj_mjesta, adresa, broj_stolova, broj_stolica, (err, id) => {
      if (err) {
        res.status(500).json({ error: 'Greška pri dodavanju svadbene sale.' });
      } else {
        res.status(201).json({ message: 'Svadbena sala uspješno dodana.', id: id });
      }
    });
  });
  
  // 4. PUT - Ažuriraj svadbenu salu po ID-u
  app.put('/svadbenesale/:id', (req, res) => {
    const { naziv_sale, broj_mjesta, adresa, broj_stolova, broj_stolica } = req.body;
    const id = req.params.id;
  
    if (!naziv_sale || !broj_mjesta || !adresa || !broj_stolova || !broj_stolica) {
      return res.status(400).json({ error: 'Svi podaci su obavezni.' });
    }
  
    SvadbeneSale.updateById(id, naziv_sale, broj_mjesta, adresa, broj_stolova, broj_stolica, (err, changes) => {
      if (err) {
        res.status(500).json({ error: 'Greška pri ažuriranju svadbene sale.' });
      } else if (changes === 0) {
        res.status(404).json({ error: 'Svadbena sala nije pronađena za ažuriranje.' });
      } else {
        res.json({ message: 'Svadbena sala uspješno ažurirana.' });
      }
    });
  });
  
  // 5. DELETE - Briši svadbenu salu po ID-u
  app.delete('/svadbenesale/:id', (req, res) => {
    const id = req.params.id;
  
    SvadbeneSale.deleteById(id, (err, changes) => {
      if (err) {
        res.status(500).json({ error: 'Greška pri brisanju svadbene sale.' });
      } else if (changes === 0) {
        res.status(404).json({ error: 'Svadbena sala nije pronađena za brisanje.' });
      } else {
        res.json({ message: 'Svadbena sala uspješno obrisana.' });
      }
    });
  });
  // 1. GET - Dohvati sve dekoracije
app.get('/dekoracije', (req, res) => {
    Dekoracije.getAll((err, rows) => {
      if (err) {
        res.status(500).json({ error: 'Greška pri dohvaćanju dekoracija.' });
      } else {
        res.json(rows);
      }
    });
  });
  
  // 2. GET - Dohvati dekoraciju po ID-u
  app.get('/dekoracije/:id', (req, res) => {
    const id = req.params.id;
    Dekoracije.getById(id, (err, row) => {
      if (err) {
        res.status(500).json({ error: 'Greška pri dohvaćanju dekoracije.' });
      } else if (!row) {
        res.status(404).json({ error: 'Dekoracija nije pronađena.' });
      } else {
        res.json(row);
      }
    });
  });
  
  // 3. POST - Dodaj novu dekoraciju
  app.post('/dekoracije', (req, res) => {
    const { naziv, tip, cijena, kolicina, opis } = req.body;
  
    if (!naziv || !tip || !cijena || !kolicina) {
      return res.status(400).json({ error: 'Svi podaci su obavezni.' });
    }
  
    Dekoracije.add(naziv, tip, cijena, kolicina, opis, (err, id) => {
      if (err) {
        res.status(500).json({ error: 'Greška pri dodavanju dekoracije.' });
      } else {
        res.status(201).json({ message: 'Dekoracija uspješno dodana.', id: id });
      }
    });
  });
  
  // 4. PUT - Ažuriraj dekoraciju po ID-u
  app.put('/dekoracije/:id', (req, res) => {
    const { naziv, tip, cijena, kolicina, opis } = req.body;
    const id = req.params.id;
  
    if (!naziv || !tip || !cijena || !kolicina) {
      return res.status(400).json({ error: 'Svi podaci su obavezni.' });
    }
  
    Dekoracije.updateById(id, naziv, tip, cijena, kolicina, opis, (err, changes) => {
      if (err) {
        res.status(500).json({ error: 'Greška pri ažuriranju dekoracije.' });
      } else if (changes === 0) {
        res.status(404).json({ error: 'Dekoracija nije pronađena za ažuriranje.' });
      } else {
        res.json({ message: 'Dekoracija uspješno ažurirana.' });
      }
    });
  });
  
  // 5. DELETE - Briši dekoraciju po ID-u
  app.delete('/dekoracije/:id', (req, res) => {
    const id = req.params.id;
  
    Dekoracije.deleteById(id, (err, changes) => {
      if (err) {
        res.status(500).json({ error: 'Greška pri brisanju dekoracije.' });
      } else if (changes === 0) {
        res.status(404).json({ error: 'Dekoracija nije pronađena za brisanje.' });
      } else {
        res.json({ message: 'Dekoracija uspješno obrisana.' });
      }
    });
  });
  // 1. GET - Dohvati sve pakete hrane
app.get('/paketiHrane', (req, res) => {
    PaketiHrane.getAll((err, rows) => {
      if (err) {
        res.status(500).json({ error: 'Greška pri dohvaćanju paketa hrane.' });
      } else {
        res.json(rows);
      }
    });
  });
  
  // 2. GET - Dohvati paket hrane po ID-u
  app.get('/paketiHrane/:id', (req, res) => {
    const id = req.params.id;
    PaketiHrane.getById(id, (err, row) => {
      if (err) {
        res.status(500).json({ error: 'Greška pri dohvaćanju paketa hrane.' });
      } else if (!row) {
        res.status(404).json({ error: 'Paket hrane nije pronađen.' });
      } else {
        res.json(row);
      }
    });
  });
  
  // 3. POST - Dodaj novi paket hrane
  app.post('/paketiHrane', (req, res) => {
    const { naziv, opis, cijena } = req.body;
  
    if (!naziv || !opis || !cijena) {
      return res.status(400).json({ error: 'Svi podaci su obavezni.' });
    }
  
    PaketiHrane.add(naziv, opis, cijena, (err, id) => {
      if (err) {
        res.status(500).json({ error: 'Greška pri dodavanju paketa hrane.' });
      } else {
        res.status(201).json({ message: 'Paket hrane uspješno dodan.', id: id });
      }
    });
  });
  
  // 4. PUT - Ažuriraj paket hrane po ID-u
  app.put('/paketiHrane/:id', (req, res) => {
    const { naziv, opis, cijena } = req.body;
    const id = req.params.id;
  
    if (!naziv || !opis || !cijena) {
      return res.status(400).json({ error: 'Svi podaci su obavezni.' });
    }
  
    PaketiHrane.updateById(id, naziv, opis, cijena, (err, changes) => {
      if (err) {
        res.status(500).json({ error: 'Greška pri ažuriranju paketa hrane.' });
      } else if (changes === 0) {
        res.status(404).json({ error: 'Paket hrane nije pronađen za ažuriranje.' });
      } else {
        res.json({ message: 'Paket hrane uspješno ažuriran.' });
      }
    });
  });
  
  // 5. DELETE - Briši paket hrane po ID-u
  app.delete('/paketiHrane/:id', (req, res) => {
    const id = req.params.id;
  
    PaketiHrane.deleteById(id, (err, changes) => {
      if (err) {
        res.status(500).json({ error: 'Greška pri brisanju paketa hrane.' });
      } else if (changes === 0) {
        res.status(404).json({ error: 'Paket hrane nije pronađen za brisanje.' });
      } else {
        res.json({ message: 'Paket hrane uspješno obrisan.' });
      }
    });
  });
  // 1. GET - Dohvati sve termine
app.get('/termini', (req, res) => {
    Termini.getAll((err, rows) => {
      if (err) {
        res.status(500).json({ error: 'Greška pri dohvaćanju termina.' });
      } else {
        res.json(rows);
      }
    });
  });
  
  // 2. GET - Dohvati termin po ID-u
  app.get('/termini/:id', (req, res) => {
    const id = req.params.id;
    Termini.getById(id, (err, row) => {
      if (err) {
        res.status(500).json({ error: 'Greška pri dohvaćanju termina.' });
      } else if (!row) {
        res.status(404).json({ error: 'Termin nije pronađen.' });
      } else {
        res.json(row);
      }
    });
  });
  
  // 3. POST - Dodaj novi termin
  app.post('/termini', (req, res) => {
    const { datum, vrijeme, dostupnost } = req.body;
  
    if (!datum || !vrijeme || dostupnost === undefined) {
      return res.status(400).json({ error: 'Svi podaci su obavezni.' });
    }
  
    Termini.add(datum, vrijeme, dostupnost, (err, id) => {
      if (err) {
        res.status(500).json({ error: 'Greška pri dodavanju termina.' });
      } else {
        res.status(201).json({ message: 'Termin uspješno dodan.', id: id });
      }
    });
  });
  
  // 4. PUT - Ažuriraj termin po ID-u
  app.put('/termini/:id', (req, res) => {
    const { datum, vrijeme, dostupnost } = req.body;
    const id = req.params.id;
  
    if (!datum || !vrijeme || dostupnost === undefined) {
      return res.status(400).json({ error: 'Svi podaci su obavezni.' });
    }
  
    Termini.updateById(id, datum, vrijeme, dostupnost, (err, changes) => {
      if (err) {
        res.status(500).json({ error: 'Greška pri ažuriranju termina.' });
      } else if (changes === 0) {
        res.status(404).json({ error: 'Termin nije pronađen za ažuriranje.' });
      } else {
        res.json({ message: 'Termin uspješno ažuriran.' });
      }
    });
  });
  
  // 5. DELETE - Briši termin po ID-u
  app.delete('/termini/:id', (req, res) => {
    const id = req.params.id;
  
    Termini.deleteById(id, (err, changes) => {
      if (err) {
        res.status(500).json({ error: 'Greška pri brisanju termina.' });
      } else if (changes === 0) {
        res.status(404).json({ error: 'Termin nije pronađen za brisanje.' });
      } else {
        res.json({ message: 'Termin uspješno obrisan.' });
      }
    });
  });
  
  // 6. POST - Provjera dostupnosti termina
  app.post('/checkAvailability', (req, res) => {
    const { datum, vrijeme } = req.body;
  
    if (!datum || !vrijeme) {
      return res.status(400).json({ error: 'Datum i vrijeme su obavezni.' });
    }
  
    Termini.checkAvailability(datum, vrijeme, (err, row) => {
      if (err) {
        res.status(500).json({ error: 'Greška pri provjeri dostupnosti termina.' });
      } else if (row) {
        res.json({ available: true });
      } else {
        res.json({ available: false });
      }
    });
  });
  // 1. GET - Dohvati sve usluge
app.get('/usluge', (req, res) => {
    Usluge.getAll((err, rows) => {
      if (err) {
        res.status(500).json({ error: 'Greška pri dohvaćanju usluga.' });
      } else {
        res.json(rows);
      }
    });
  });
  
  // 2. GET - Dohvati uslugu po ID-u
  app.get('/usluge/:id', (req, res) => {
    const id = req.params.id;
    Usluge.getById(id, (err, row) => {
      if (err) {
        res.status(500).json({ error: 'Greška pri dohvaćanju usluge.' });
      } else if (!row) {
        res.status(404).json({ error: 'Usluga nije pronađena.' });
      } else {
        res.json(row);
      }
    });
  });
  
  // 3. POST - Dodaj novu uslugu
  app.post('/usluge', (req, res) => {
    const { naziv, opis, cijena } = req.body;
  
    if (!naziv || !cijena) {
      return res.status(400).json({ error: 'Naziv i cijena su obavezni.' });
    }
  
    Usluge.add(naziv, opis, cijena, (err, id) => {
      if (err) {
        res.status(500).json({ error: 'Greška pri dodavanju usluge.' });
      } else {
        res.status(201).json({ message: 'Usluga uspješno dodana.', id: id });
      }
    });
  });
  
  // 4. PUT - Ažuriraj uslugu po ID-u
  app.put('/usluge/:id', (req, res) => {
    const { naziv, opis, cijena } = req.body;
    const id = req.params.id;
  
    if (!naziv || !cijena) {
      return res.status(400).json({ error: 'Naziv i cijena su obavezni.' });
    }
  
    Usluge.updateById(id, naziv, opis, cijena, (err, changes) => {
      if (err) {
        res.status(500).json({ error: 'Greška pri ažuriranju usluge.' });
      } else if (changes === 0) {
        res.status(404).json({ error: 'Usluga nije pronađena za ažuriranje.' });
      } else {
        res.json({ message: 'Usluga uspješno ažurirana.' });
      }
    });
  });
  
  // 5. DELETE - Briši uslugu po ID-u
  app.delete('/usluge/:id', (req, res) => {
    const id = req.params.id;
  
    Usluge.deleteById(id, (err, changes) => {
      if (err) {
        res.status(500).json({ error: 'Greška pri brisanju usluge.' });
      } else if (changes === 0) {
        res.status(404).json({ error: 'Usluga nije pronađena za brisanje.' });
      } else {
        res.json({ message: 'Usluga uspješno obrisana.' });
      }
    });
  });
  //Rezervacije
  // 1. GET - Dohvati sve rezervacije
app.get('/rezervacije', (req, res) => {
  Rezervacije.getAll((err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Greška pri dohvaćanju rezervacija.' });
    } else {
      res.json(rows);
    }
  });
});

// 2. GET - Dohvati rezervaciju po ID-u
app.get('/rezervacije/:id', (req, res) => {
  const id = req.params.id;
  Rezervacije.getById(id, (err, row) => {
    if (err) {
      res.status(500).json({ error: 'Greška pri dohvaćanju rezervacije.' });
    } else if (!row) {
      res.status(404).json({ error: 'Rezervacija nije pronađena.' });
    } else {
      res.json(row);
    }
  });
});

// 3. POST - Dodaj novu rezervaciju
app.post('/rezervacije', (req, res) => {
  const { Termin_id, Dekoracije_id, Korisnici_id, PaketiHrane_id, SvadbeneSale_id, Usluge_id } = req.body;

  if (!Termin_id || !Dekoracije_id || !Korisnici_id || !PaketiHrane_id || !SvadbeneSale_id || !Usluge_id) {
    return res.status(400).json({ error: 'Svi podaci su obavezni.' });
  }

  Rezervacije.add(Termin_id, Dekoracije_id, Korisnici_id, PaketiHrane_id, SvadbeneSale_id, Usluge_id, (err, id) => {
    if (err) {
      res.status(500).json({ error: 'Greška pri dodavanju rezervacije.' });
    } else {
      res.status(201).json({ message: 'Rezervacija uspješno dodana.', id: id });
    }
  });
});

// 4. PUT - Ažuriraj rezervaciju po ID-u
app.put('/rezervacije/:id', (req, res) => {
  const id = req.params.id;
  const { Termin_id, Dekoracije_id, Korisnici_id, PaketiHrane_id, SvadbeneSale_id, Usluge_id } = req.body;

  if (!Termin_id || !Dekoracije_id || !Korisnici_id || !PaketiHrane_id || !SvadbeneSale_id || !Usluge_id) {
    return res.status(400).json({ error: 'Svi podaci su obavezni.' });
  }

  Rezervacije.updateById(id, Termin_id, Dekoracije_id, Korisnici_id, PaketiHrane_id, SvadbeneSale_id, Usluge_id, (err, changes) => {
    if (err) {
      res.status(500).json({ error: 'Greška pri ažuriranju rezervacije.' });
    } else if (changes === 0) {
      res.status(404).json({ error: 'Rezervacija nije pronađena za ažuriranje.' });
    } else {
      res.json({ message: 'Rezervacija uspješno ažurirana.' });
    }
  });
});

// 5. DELETE - Briši rezervaciju po ID-u
app.delete('/rezervacije/:id', (req, res) => {
  const id = req.params.id;

  Rezervacije.deleteById(id, (err, changes) => {
    if (err) {
      res.status(500).json({ error: 'Greška pri brisanju rezervacije.' });
    } else if (changes === 0) {
      res.status(404).json({ error: 'Rezervacija nije pronađena za brisanje.' });
    } else {
      res.json({ message: 'Rezervacija uspješno obrisana.' });
    }
  });
});

// Pokretanje servera
app.listen(port, hostname, () => {
  console.log(`Server radi na http://${hostname}:${port}`);
});
