import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Producto } from '../interfaces/productos';
import { Categoria } from '../interfaces/categorias';
import { Busqueda } from '../interfaces/busqueda';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(private http: HttpClient) { }

  // ✅ Versión con Observables (recomendada)
  getByCategoria(id: number): Observable<Producto[]> {
    return this.http.get<Categoria[]>('assets/data/database.json').pipe(
      map(categorias => {
        const productos = categorias.find(categoria => categoria.id === id)?.productos;
        return productos || [];
      }),
      catchError(error => {
        console.error('Error loading products by category:', error);
        return of([]);
      })
    );
  }

  getAll(): Observable<Producto[]> {
    return this.http.get<Categoria[]>('assets/data/database.json').pipe(
      map(categorias => {
        let productos: Producto[] = [];
        categorias.forEach(categoria => {
          productos = [...productos, ...categoria.productos];
        });
        return productos;
      }),
      catchError(error => {
        console.error('Error loading all products:', error);
        return of([]);
      })
    );
  }

  getById(id: number): Observable<Producto | undefined> {
    return this.getAll().pipe(
      map(productos => productos.find(producto => producto.id === id)),
      catchError(error => {
        console.error('Error loading product by id:', error);
        return of(undefined);
      })
    );
  }

  buscar(parametros: Busqueda): Observable<Producto[]> {
    return this.getAll().pipe(
      map(productos => {
        return productos.filter(producto => {
          if (parametros.aptoCeliaco && !producto.esCeliaco) return false;
          if (parametros.aptoVegano && !producto.esVegano) return false;
          
          const busquedaTitulo = producto.nombre.toLowerCase().includes(parametros.texto.toLowerCase());
          if (busquedaTitulo) return true;
          
          for (let i = 0; i < producto.ingredientes.length; i++) {
            const ingrediente = producto.ingredientes[i];
            if (ingrediente.toLowerCase().includes(parametros.texto.toLowerCase())) return true;
          }
          return false;
        });
      }),
      catchError(error => {
        console.error('Error searching products:', error);
        return of([]);
      })
    );
  }

  // ✅ Versión async/await (para mantener compatibilidad)
  async getByCategoriaAsync(id: number): Promise<Producto[]> {
    try {
      const categorias = await this.http.get<Categoria[]>('assets/data/database.json').toPromise();
      const productos = categorias?.find(categoria => categoria.id === id)?.productos;
      return productos || [];
    } catch (error) {
      console.error('Error loading products by category:', error);
      return [];
    }
  }

  async getAllAsync(): Promise<Producto[]> {
    try {
      const categorias = await this.http.get<Categoria[]>('assets/data/database.json').toPromise();
      let productos: Producto[] = [];
      categorias?.forEach(categoria => {
        productos = [...productos, ...categoria.productos];
      });
      return productos || [];
    } catch (error) {
      console.error('Error loading all products:', error);
      return [];
    }
  }

  async getByIdAsync(id: number): Promise<Producto | undefined> {
    try {
      const productos = await this.getAllAsync();
      return productos.find(producto => producto.id === id);
    } catch (error) {
      console.error('Error loading product by id:', error);
      return undefined;
    }
  }

  async buscarAsync(parametros: Busqueda): Promise<Producto[]> {
    try {
      const productos = await this.getAllAsync();
      const productosFiltrados = productos.filter(producto => {
        if (parametros.aptoCeliaco && !producto.esCeliaco) return false;
        if (parametros.aptoVegano && !producto.esVegano) return false;
        
        const busquedaTitulo = producto.nombre.toLowerCase().includes(parametros.texto.toLowerCase());
        if (busquedaTitulo) return true;
        
        for (let i = 0; i < producto.ingredientes.length; i++) {
          const ingrediente = producto.ingredientes[i];
          if (ingrediente.toLowerCase().includes(parametros.texto.toLowerCase())) return true;
        }
        return false;
      });
      return productosFiltrados;
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }
}