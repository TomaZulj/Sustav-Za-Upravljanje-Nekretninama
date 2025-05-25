import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { KontaktZahtjevService } from './kontakt-zahtjev.service';
import { KontaktZahtjev, Korisnik, Nekretnina, Agent } from '../models/nekretnina.model';
import { environment } from '../../environments/environment';

describe('KontaktZahtjevService', () => {
  let service: KontaktZahtjevService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/kontakt-zahtjevi`;

  const mockKorisnik: Korisnik = { korisnik_id: 1, ime: 'Pero', prezime: 'Peric', email: 'pero@test.com', telefon: '123456' };
  const mockAgent: Agent = { agent_id: 1, datum_zaposlenja: new Date(), korisnik: mockKorisnik };
  const mockNekretnina: Nekretnina = { nekretnina_id: 1, naslov: 'Stan', opis: 'Opis stana', cijena: 100000, povrsina: 50, status: 'Dostupno', agent: mockAgent, tip_nekretnine_id: 1, lokacija_id: 1 };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [KontaktZahtjevService]
    });
    service = TestBed.inject(KontaktZahtjevService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get kontakt zahtjevi by nekretnina_id', () => {
    const nekretninaId = 1;
    const mockZahtjevi: KontaktZahtjev[] = [
      { zahtjev_id: 1, poruka: 'Test poruka 1', nekretnina_id: nekretninaId, korisnik_id: 1, agent_id: 1 },
      { zahtjev_id: 2, poruka: 'Test poruka 2', nekretnina_id: nekretninaId, korisnik_id: 2, agent_id: 1 }
    ];

    service.getByNekretninaId(nekretninaId).subscribe(zahtjevi => {
      expect(zahtjevi.length).toBe(2);
      expect(zahtjevi).toEqual(mockZahtjevi);
    });

    const req = httpMock.expectOne(`${apiUrl}/${nekretninaId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockZahtjevi);
  });

  it('should create a kontakt zahtjev', () => {
    const noviZahtjev: Partial<KontaktZahtjev> = {
      poruka: 'Nova poruka',
      korisnik_id: mockKorisnik.korisnik_id,
      nekretnina_id: mockNekretnina.nekretnina_id,
      agent_id: mockAgent.agent_id
    };
    const ocekivaniOdgovor: KontaktZahtjev = { ...noviZahtjev, zahtjev_id: 3 } as KontaktZahtjev;

    service.create(noviZahtjev).subscribe(zahtjev => {
      expect(zahtjev).toEqual(ocekivaniOdgovor);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.poruka).toEqual(noviZahtjev.poruka);
    expect(req.request.body.korisnik.korisnik_id).toEqual(noviZahtjev.korisnik_id);
    expect(req.request.body.nekretnina.nekretnina_id).toEqual(noviZahtjev.nekretnina_id);
    expect(req.request.body.agent.agent_id).toEqual(noviZahtjev.agent_id);
    req.flush(ocekivaniOdgovor);
  });

  it('should update a kontakt zahtjev', () => {
    const zahtjevId = 1;
    const azuriraniZahtjev: Partial<KontaktZahtjev> = { poruka: 'Azurirana poruka', korisnik_id: 2 };
    const ocekivaniOdgovor: KontaktZahtjev = {
        zahtjev_id: zahtjevId,
        poruka: 'Azurirana poruka',
        korisnik_id: 2,
        nekretnina_id: mockNekretnina.nekretnina_id,
        agent_id: mockAgent.agent_id
    };


    service.update(zahtjevId, azuriraniZahtjev).subscribe(zahtjev => {
      expect(zahtjev).toEqual(ocekivaniOdgovor);
    });

    const req = httpMock.expectOne(`${apiUrl}/${zahtjevId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body.poruka).toEqual(azuriraniZahtjev.poruka);
    expect(req.request.body.korisnik.korisnik_id).toEqual(azuriraniZahtjev.korisnik_id);
    req.flush(ocekivaniOdgovor);
  });

  it('should delete a kontakt zahtjev', () => {
    const zahtjevId = 1;
    service.delete(zahtjevId).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/${zahtjevId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});