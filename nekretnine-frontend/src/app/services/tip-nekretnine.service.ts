import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipNekretnine } from '../models/nekretnina.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipNekretnineService {
  private apiUrl = `${environment.apiUrl}/tip-nekretnine`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<TipNekretnine[]> {
    return this.http.get<TipNekretnine[]>(this.apiUrl);
  }

  getById(id: number): Observable<TipNekretnine> {
    return this.http.get<TipNekretnine>(`${this.apiUrl}/${id}`);
  }

  create(tipNekretnine: Partial<TipNekretnine>): Observable<TipNekretnine> {
    return this.http.post<TipNekretnine>(this.apiUrl, tipNekretnine);
  }

  update(id: number, tipNekretnine: Partial<TipNekretnine>): Observable<TipNekretnine> {
    return this.http.put<TipNekretnine>(`${this.apiUrl}/${id}`, tipNekretnine);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}