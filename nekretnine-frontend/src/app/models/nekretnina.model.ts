export interface Nekretnina {
  nekretnina_id?: number;
  naslov: string;
  opis: string;
  cijena: number;
  povrsina: number;
  status: string;
  lokacija_id?: number;
  lokacija?: Lokacija;
  tip_nekretnine_id?: number;
  tipNekretnine?: TipNekretnine;
  agent_id?: number;
  agent?: Agent;
}

export interface Agent {
  agent_id: number;
  datum_zaposlenja: Date;
  korisnik?: Korisnik;
  imePrezime?: string;
}

export interface TipNekretnine {
  tip_nekretnine_id: number;
  naziv: string;
  opis: string;
}

export interface Lokacija {
  lokacija_id?: number;
  adresa: string;
  grad: string;
  drzava: string;
}

export interface Korisnik {
  korisnik_id: number;
  ime: string;
  prezime: string;
  email: string;
  telefon: string;
}

export interface KontaktZahtjev {
  zahtjev_id?: number;
  poruka: string;
  korisnik?: Korisnik;
  korisnik_id?: number;
  nekretnina?: Nekretnina;
  nekretnina_id?: number;
  agent?: Agent;
  agent_id?: number;
}