import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KontaktZahtjev } from '../models/nekretnina.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KontaktZahtjevService {
  private apiUrl = `${environment.apiUrl}/kontakt-zahtjevi`;

  constructor(private http: HttpClient) { }

  getByNekretninaId(nekretninaId: number): Observable<KontaktZahtjev[]> {
    return this.http.get<KontaktZahtjev[]>(`${this.apiUrl}/${nekretninaId}`);
  }

  create(zahtjev: Partial<KontaktZahtjev>): Observable<KontaktZahtjev> {
    const data = this.prepareRequestData(zahtjev);
    return this.http.post<KontaktZahtjev>(this.apiUrl, data);
  }

  update(id: number, zahtjev: Partial<KontaktZahtjev>): Observable<KontaktZahtjev> {
    const data = this.prepareRequestData(zahtjev);
    return this.http.put<KontaktZahtjev>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private prepareRequestData(zahtjev: Partial<KontaktZahtjev>): any {
    const result: any = {
      poruka: zahtjev.poruka,
      korisnik: zahtjev.korisnik_id ? { korisnik_id: zahtjev.korisnik_id } : undefined,
      nekretnina: zahtjev.nekretnina_id ? { nekretnina_id: zahtjev.nekretnina_id } : undefined,
      agent: zahtjev.agent_id ? { agent_id: zahtjev.agent_id } : undefined
    };

    if (zahtjev.korisnik) {
      result.korisnik = zahtjev.korisnik;
    }

    if (zahtjev.nekretnina) {
      result.nekretnina = zahtjev.nekretnina;
    }

    if (zahtjev.agent) {
      result.agent = zahtjev.agent;
    }

    return result;
  }
}