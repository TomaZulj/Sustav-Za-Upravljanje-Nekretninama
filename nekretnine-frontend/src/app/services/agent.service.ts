import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Agent } from '../models/nekretnina.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  private apiUrl = `${environment.apiUrl}/agenti`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Agent[]> {
    return this.http.get<Agent[]>(this.apiUrl).pipe(
      map(agents => agents.map(agent => ({
        ...agent,
        imePrezime: `${agent.korisnik?.ime} ${agent.korisnik?.prezime}`
      })))
    );
  }

  getById(id: number): Observable<Agent> {
    return this.http.get<Agent>(`${this.apiUrl}/${id}`).pipe(
      map(agent => ({
        ...agent,
        imePrezime: `${agent.korisnik?.ime} ${agent.korisnik?.prezime}`
      }))
    );
  }
}