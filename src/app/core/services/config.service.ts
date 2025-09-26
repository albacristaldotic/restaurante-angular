import { Injectable, WritableSignal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Config } from '../interfaces/config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private http: HttpClient) {
    this.loadConfig();
  }

  configuracion: WritableSignal<Config> = signal({
    costoEnvio: 0,
    diasVencimientoCarrito: 100
  });

  // ✅ Cargar configuración usando HttpClient
  private loadConfig(): void {
    this.http.get<Config>('assets/data/configuracion.json').pipe(
      catchError(error => {
        console.error('Error loading configuration:', error);
        // Retornar configuración por defecto en caso de error
        return of({
          costoEnvio: 0,
          diasVencimientoCarrito: 100
        });
      })
    ).subscribe(config => {
      this.configuracion.set(config);
    });
  }

  // ✅ Método para recargar configuración si es necesario
  reloadConfig(): void {
    this.loadConfig();
  }

  // ✅ Método para obtener configuración como Observable
  getConfig(): Observable<Config> {
    return this.http.get<Config>('assets/data/configuracion.json').pipe(
      catchError(error => {
        console.error('Error loading configuration:', error);
        return of(this.configuracion()); // Retorna el valor actual en caso de error
      })
    );
  }
}