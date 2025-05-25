import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Nekretnina } from '../models/nekretnina.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NekretninaService {
  private apiUrl = `${environment.apiUrl}/nekretnine`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Nekretnina[]> {
    return this.http.get<Nekretnina[]>(this.apiUrl);
  }

  getById(id: number): Observable<Nekretnina> {
    return this.http.get<Nekretnina>(`${this.apiUrl}/${id}`);
  }

  create(nekretninaData: any): Observable<Nekretnina> {
    const transformedData = this.transformNekretnineData(nekretninaData);
    return this.http.post<Nekretnina>(this.apiUrl, transformedData);
  }

  update(id: number, nekretninaData: any): Observable<Nekretnina> {
    const transformedData = this.transformNekretnineData(nekretninaData);
    return this.http.put<Nekretnina>(`${this.apiUrl}/${id}`, transformedData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private transformNekretnineData(data: any): any {
    const transformedData: any = { ...data };
    
    if (transformedData.tip_nekretnine_id !== undefined) {
      transformedData.tipNekretnine = {
        tip_nekretnine_id: transformedData.tip_nekretnine_id
      };
      delete transformedData.tip_nekretnine_id;
    }
    
    if (transformedData.agent_id !== undefined) {
      transformedData.agent = {
        agent_id: transformedData.agent_id
      };
      delete transformedData.agent_id;
    }
    
    if (transformedData.lokacija_id !== undefined && transformedData.kompletnaLokacija) {
      transformedData.lokacija = transformedData.kompletnaLokacija;
      delete transformedData.lokacija_id;
      delete transformedData.kompletnaLokacija;
    } else if (transformedData.lokacija_id !== undefined) {
      transformedData.lokacija = {
        lokacija_id: transformedData.lokacija_id
      };
      delete transformedData.lokacija_id;
    }
    
    return transformedData;
  }
}