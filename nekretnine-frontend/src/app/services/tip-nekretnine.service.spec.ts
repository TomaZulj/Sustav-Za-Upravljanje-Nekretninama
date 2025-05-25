import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TipNekretnineService } from './tip-nekretnine.service';
import { TipNekretnine } from '../models/nekretnina.model';
import { environment } from '../../environments/environment';

describe('TipNekretnineService', () => {
  let service: TipNekretnineService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/tip-nekretnine`;

  const mockTipoviNekretnina: TipNekretnine[] = [
    { tip_nekretnine_id: 1, naziv: 'Stan', opis: 'Stambena jedinica' },
    { tip_nekretnine_id: 2, naziv: 'Kuća', opis: 'Obiteljska kuća' }
  ];

  const mockTipNekretnine: TipNekretnine = { tip_nekretnine_id: 1, naziv: 'Stan', opis: 'Stambena jedinica' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TipNekretnineService]
    });
    service = TestBed.inject(TipNekretnineService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all tipovi nekretnina via GET', () => {
    service.getAll().subscribe(tipovi => {
      expect(tipovi.length).toBe(2);
      expect(tipovi).toEqual(mockTipoviNekretnina);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockTipoviNekretnina);
  });

  it('should get a tip nekretnine by id via GET', () => {
    const id = 1;
    service.getById(id).subscribe(tip => {
      expect(tip).toEqual(mockTipNekretnine);
      expect(tip.tip_nekretnine_id).toBe(id);
    });

    const req = httpMock.expectOne(`${apiUrl}/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTipNekretnine);
  });

  it('should create a new tip nekretnine via POST', () => {
    const noviTip: Partial<TipNekretnine> = { naziv: 'Poslovni Prostor', opis: 'Za ured' };
    const kreiraniTip: TipNekretnine = { tip_nekretnine_id: 3, ...noviTip } as TipNekretnine;

    service.create(noviTip).subscribe(tip => {
      expect(tip).toEqual(kreiraniTip);
      expect(tip.tip_nekretnine_id).toBe(3);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(noviTip);
    req.flush(kreiraniTip);
  });

  it('should update an existing tip nekretnine via PUT', () => {
    const id = 1;
    const azuriraniPodaci: Partial<TipNekretnine> = { naziv: 'Stan Renoviran', opis: 'Potpuno renoviran stan' };
    const ocekivaniOdgovor: TipNekretnine = { tip_nekretnine_id: id, ...azuriraniPodaci } as TipNekretnine;

    service.update(id, azuriraniPodaci).subscribe(tip => {
      expect(tip).toEqual(ocekivaniOdgovor);
    });

    const req = httpMock.expectOne(`${apiUrl}/${id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(azuriraniPodaci);
    req.flush(ocekivaniOdgovor);
  });

  it('should delete a tip nekretnine via DELETE', () => {
    const id = 1;
    service.delete(id).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should handle error when getting all tipovi nekretnina', () => {
    const errorMessage = 'Greška na serveru prilikom dohvaćanja tipova nekretnina';
    service.getAll().subscribe({
      next: () => fail('trebalo je doći do greške'),
      error: (error) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush({ message: errorMessage }, { status: 500, statusText: 'Server Error' });
  });
});