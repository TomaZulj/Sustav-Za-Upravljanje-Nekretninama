INSERT INTO KORISNIK (korisnik_id, email, lozinka, ime, prezime) VALUES
  (1, 'agent@example.com', 'lozinka1', 'Marko', 'Markovic'),
  (2, 'admin@example.com', 'lozinka2', 'Ana', 'Anic'),
  (3, 'user1@example.com', 'lozinka3', 'Ivan', 'Ivic');

INSERT INTO TIP_NEKRETNINE (tip_nekretnine_id, naziv, opis) VALUES
  (1, 'Stan', 'Stambena jedinica u višestambenoj zgradi.'),
  (2, 'Kuća', 'Samostojeći stambeni objekt.');

INSERT INTO LOKACIJA (lokacija_id, adresa, grad, drzava) VALUES
  (1, 'Ulica 1', 'Zagreb', 'Hrvatska'),
  (2, 'Ulica 2', 'Split', 'Hrvatska');

INSERT INTO AGENT (agent_id, datum_zaposlenja) VALUES
  (1, '2020-01-15');

INSERT INTO ADMIN (admin_id, dozvole) VALUES
  (2, 'full');

INSERT INTO NEKRETNINA (nekretnina_id, naslov, opis, cijena, povrsina, status, lokacija_id, tip_nekretnine_id, agent_id) VALUES
  (1, 'Moderan stan', 'Svijetao stan u centru', 250000.00, 80.0, 'aktivan', 1, 1, 1),
  (2, 'Porodična kuća', 'Prostrana kuća s vrtom i garažom', 350000.00, 120.0, 'aktivan', 2, 2, 1);

INSERT INTO KONTAKT_ZAHTJEV (zahtjev_id, poruka, nekretnina_id, korisnik_id, agent_id) VALUES
  (1, 'Zainteresiran sam za ovaj stan. Molim dodatne informacije.', 1, 3, 1),
  (2, 'Molim za više detalja o kući.', 2, 3, 1);

--------------- resetiranje sekvenci ----------------------

SELECT setval('korisnik_korisnik_id_seq', (SELECT COALESCE(MAX(korisnik_id), 0) + 1 FROM KORISNIK), false);

SELECT setval('tip_nekretnine_tip_nekretnine_id_seq', (SELECT COALESCE(MAX(tip_nekretnine_id), 0) + 1 FROM TIP_NEKRETNINE), false);

SELECT setval('lokacija_lokacija_id_seq', (SELECT COALESCE(MAX(lokacija_id), 0) + 1 FROM LOKACIJA), false);

SELECT setval('nekretnina_nekretnina_id_seq', (SELECT COALESCE(MAX(nekretnina_id), 0) + 1 FROM NEKRETNINA), false);

SELECT setval('kontakt_zahtjev_zahtjev_id_seq', (SELECT COALESCE(MAX(zahtjev_id), 0) + 1 FROM KONTAKT_ZAHTJEV), false);