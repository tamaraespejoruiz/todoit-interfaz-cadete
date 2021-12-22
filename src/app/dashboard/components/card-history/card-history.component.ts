import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-history',
  templateUrl: './card-history.component.html',
  styleUrls: ['./card-history.component.sass']
})
export class CardHistoryComponent implements OnInit {

  direccion = '{{direccion}}';
  hora = '{{hora}}';
  fecha = '{{fecha}}';
  marcaModeloEquipo = '{{marcaModeloEquipo}}';
  estadoDelViaje!:number;
  idViaje!:number;

  constructor() { }

  ngOnInit(): void { }

}
