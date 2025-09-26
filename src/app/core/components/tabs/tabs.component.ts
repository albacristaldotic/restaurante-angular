import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {

  productos: any[] = [];   // aquí guardamos los productos

  colorDesactivado = "#555555";
  colorActivado = "#000000";

  constructor(public router: Router, private http: HttpClient){ }

  ngOnInit(): void {
    // 🔹 cargar JSON desde assets
    this.http.get<any>('assets/data/database.json').subscribe(data => {
      this.productosCategorias = data;
      console.log(this.productosCategorias);  // ver en consola que se cargaron correctamente
    });
  }
  productosCategorias(productosCategorias: any) {
    throw new Error('Method not implemented.');
  }
}
