import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Korisnik } from '../models/nekretnina.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KorisnikService {
  private apiUrl = `${environment.apiUrl}/korisnici`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Korisnik[]> {
    return this.http.get<Korisnik[]>(this.apiUrl);
  }

  getById(id: number): Observable<Korisnik> {
    return this.http.get<Korisnik>(`${this.apiUrl}/${id}`);
  }
}