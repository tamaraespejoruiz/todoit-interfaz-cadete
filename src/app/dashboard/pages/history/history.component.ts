import { Component, OnInit } from '@angular/core';
import { StatusTravelService } from '../../services/status-travel.service';
import { Travel } from '../../models/travel';
import { ViewChild, ViewContainerRef } from '@angular/core';
import { CardComponent } from '../../components/card/card.component';
import Swal  from 'sweetalert2';


@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.sass']
})

export class HistoryComponent implements OnInit {

  constructor(private statusTravelService: StatusTravelService) { }

  ngOnInit(): void {
    this.mostrarCargando();
    this.cargarHistorialViajes();
  }
  @ViewChild('cardsHolder', {read: ViewContainerRef}) cardsHolder!: ViewContainerRef;

  // estados: 4, 8 y 9
  cargarHistorialViajes() {
    this.statusTravelService.getViajesFinalizados().subscribe( resp => {
      let resultado:Travel[] = [];
      for (const resultadoParcial of resp) {
        for (const viaje of resultadoParcial) {
          if (viaje.travelEquipmentDTOs[viaje.travelEquipmentDTOs.length - 1].cadete) {
            if (viaje.travelEquipmentDTOs[viaje.travelEquipmentDTOs.length - 1].cadete?.id 
                  === JSON.parse(localStorage.getItem('idUsuario')??'null')) {
              resultado.push(viaje); // agrega viaje
            }  
          }
        }
      }
      this.mostrarViajes(resultado);
      this.ocultarCargando();
    })    
  }

  crearCard(hora: string, equipo: string, direccion: string, laststatusTravel: number, travelId: number) {
    const componentRef = this.cardsHolder.createComponent<CardComponent>(CardComponent);
    componentRef.instance.hora = hora;
    componentRef.instance.direccion = direccion;
    componentRef.instance.marcaModeloEquipo = equipo;
    componentRef.instance.estadoDelViaje = laststatusTravel;
    componentRef.instance.idViaje = travelId;
    componentRef.instance.sacarTarjeta = (idViaje) => this.sacarTarjeta(idViaje);  
    return componentRef;
  }

  travelVisibles:Travel[] = [];
  
  actualizarCards() { 
    this.cardsHolder.clear(); // elimina todas las tarjetas
    for (const travelVisible of this.travelVisibles) {
      const dto = travelVisible.travelEquipmentDTOs[travelVisible.travelEquipmentDTOs.length - 1];
      this.crearCard(
        (new Date(dto.operationDate)).toLocaleTimeString(), 
        `${dto.equipment.model} ${dto.equipment.mark}`, 
        dto.operator.address,
        travelVisible.lastStatusTravel,
        travelVisible.id
      );
    }
  }
  
  mostrarViajes(viajes:Travel[]) {
    this.travelVisibles = viajes;
    this.actualizarCards();
  }

  sacarTarjeta(idTravel: number) { 
    const nuevoVector: Travel[] = [];
    for (const travel of this.travelVisibles) {
      if (idTravel !== travel.id) { // saca el viaje aceptado de la lista de viajes
        nuevoVector.push(travel);
      }
    }
    this.mostrarViajes(nuevoVector);
  }

  mostrarCargando() {
    Swal.fire({
      title: 'Cargando ...',
      allowOutsideClick: false, 
      didOpen: () => Swal.showLoading()
    });
  } 

  ocultarCargando() {
    Swal.close();
  }
}
