export interface Producto {
  id: number,
  nombre: string,
  precio: number,
  esVegano: boolean,
  esCeliaco: boolean,
  esSaludable: boolean;   // ✅ Nuevo campo opcional
  esSinAzucar: boolean;
  ingredientes: string[],
  fotoUrl: string
}
