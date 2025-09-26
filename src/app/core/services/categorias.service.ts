import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Categoria } from '../interfaces/categorias';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  constructor(private http: HttpClient) { }

  // ✅ Versión con Observables (recomendada para Angular)
  getAll(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>('assets/data/database.json').pipe(
      catchError(error => {
        console.error('Error loading categories:', error);
        return of([]); // Retorna array vacío en caso de error
      })
    );
  }

  getById(id: number): Observable<Categoria | undefined> {
    return this.http.get<Categoria[]>('assets/data/database.json').pipe(
      map(categorias => categorias.find(categoria => categoria.id === id)),
      catchError(error => {
        console.error('Error loading category by id:', error);
        return of(undefined);
      })
    );
  }

  // ✅ Versión async/await (si prefieres mantener tu estilo original)
  async getAllAsync(): Promise<Categoria[]> {
    try {
      const data = await this.http.get<Categoria[]>('assets/data/database.json').toPromise();
      return data || [];
    } catch (error) {
      console.error('Error loading categories:', error);
      return [];
    }
  }

  async getByIdAsync(id: number): Promise<Categoria | undefined> {
    try {
      const data = await this.http.get<Categoria[]>('assets/data/database.json').toPromise();
      return data?.find(categoria => categoria.id === id);
    } catch (error) {
      console.error('Error loading category by id:', error);
      return undefined;
    }
  }
}