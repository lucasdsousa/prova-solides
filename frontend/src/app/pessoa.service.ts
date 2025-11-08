import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pessoa } from './pessoa.model';

@Injectable({
  providedIn: 'root'
})
export class PessoaService {
  private apiUrl = 'http://localhost:8000/api/pessoas/';

  private http = inject(HttpClient);

  getPessoa(id: number): Observable<Pessoa> {
    return this.http.get<Pessoa>(`${this.apiUrl}${id}/`);
  }

  createPessoa(pessoa: Omit<Pessoa, 'id' | 'peso_ideal'>): Observable<Pessoa> {
    return this.http.post<Pessoa>(this.apiUrl, pessoa);
  }

  updatePessoa(id: number, pessoa: Partial<Pessoa>): Observable<Pessoa> {
    return this.http.put<Pessoa>(`${this.apiUrl}${id}/`, pessoa);
  }

  deletePessoa(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }
}