import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonHttpService<T> {

  url: string = `http://localhost:3000/`;

  constructor(private http: HttpClient) { }

  get(endPoint: string): Promise<T> {
    return lastValueFrom(this.http.get<T>(`${this.url}${endPoint}`, {}));
  }
  post(endPoint: string, data: any): Promise<T> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return lastValueFrom(this.http.post<T>(`${this.url}${endPoint}`, data, {headers}));
  }
  update(endPoint: string, data: any): Promise<T> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return lastValueFrom(this.http.patch<T>(`${this.url}${endPoint}`, data, {headers}));
  }
  delete(endPoint: string): Promise<T> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return lastValueFrom(this.http.delete<T>(`${this.url}${endPoint}`, {headers}));
  }

}
