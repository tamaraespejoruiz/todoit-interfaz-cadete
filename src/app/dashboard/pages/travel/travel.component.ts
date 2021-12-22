import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { StatusTravelService } from '../../services/status-travel.service';
import { Travel } from '../../models/travel';
import { MatSelect } from '@angular/material/select';
import { CardComponent } from '../../components/card/card.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-travel',
  templateUrl: './travel.component.html',
  styleUrls: ['./travel.component.sass']
})
export class TravelComponent implements OnInit {
  constructor(private statusTravelService: StatusTravelService) { }

  viajesDisponibles: Travel[] = [];
  
  @ViewChild(MatSelect) filtro!: MatSelect;
  @ViewChild('cardsHolder', {read: ViewContainerRef}) cardsHolder!: ViewContainerRef;

  cargarViajesDisponibles() {
    this.statusTravelService.getViajesDisponibles().subscribe( resp => {
      let resultado:Travel[] = [];
      for (const resultadoParcial of resp) {   // fitra todo lo que si cumple esta condicion.
        resultado = resultado.concat(resultadoParcial.filter(viaje => viaje.travelEquipmentDTOs[viaje.travelEquipmentDTOs.length - 1].statusTravel != 10)); 
      }  
      this.mostrarViajes(resultado);
      //console.log(resultado);
    });
  }
  

  cargarViajes(respuestaViaje: Observable<Travel[][]>) {
    respuestaViaje.subscribe( resp => {
      let resultado:Travel[] = [];
      for (const resultadoParcial of resp) {
        for (const viaje of resultadoParcial) {
          if (viaje.travelEquipmentDTOs[viaje.travelEquipmentDTOs.length - 1].cadete) {
            if (viaje.travelEquipmentDTOs[viaje.travelEquipmentDTOs.length - 1].cadete?.id 
                  === JSON.parse(localStorage.getItem('idUsuario')??'null')) {
              resultado.push(viaje); // agrego viaje
            }  
          }
        }
      }
      
      this.mostrarViajes(resultado);
      console.log(resultado);
    })    
  }
  ngOnInit( ): void {  }

  obtenerNombreCadete(): string {
    return JSON.parse(localStorage.getItem('nombreUsuario')??'null');
  }

  seleccionarFiltro() {
    if (this.filtro.value === 'disponibles') {
      this.cargarViajesDisponibles();
    }
    if (this.filtro.value === 'aceptados') {
      this.cargarViajes(this.statusTravelService.getViajesEnCurso());
    }
  }

  crearCard(hora: string, equipo: string, direccion: string, laststatusTravel: number, travelId: number) {
    const componentRef = this.cardsHolder.createComponent<CardComponent>(CardComponent);
    componentRef.instance.hora = hora;
    componentRef.instance.direccion = direccion;
    componentRef.instance.marcaModeloEquipo = equipo;
    componentRef.instance.estadoDelViaje = laststatusTravel;
    componentRef.instance.idViaje = travelId;
    // defino una funcion anonima que recibe un id viaje y cuando se ejecuta
    // llama this.sacarTarjeta
    componentRef.instance.sacarTarjeta = (idViaje) => this.sacarTarjeta(idViaje);  
    return componentRef;
  }

  travelVisibles:Travel[] = [];
  
  actualizarCards() { 
    this.cardsHolder.clear(); // elimina todas las tarjetas
    for (const e of this.travelVisibles) {
      const dto = e.travelEquipmentDTOs[e.travelEquipmentDTOs.length - 1];
      this.crearCard(
        (new Date(dto.operationDate)).toLocaleTimeString(), 
        `${dto.equipment.model} ${dto.equipment.mark}`, 
        dto.operator.address,
        e.lastStatusTravel,
        e.id
      );
    }
  }
  
  mostrarViajes(viajes:Travel[]) { // paso 2
    this.travelVisibles = viajes;
    this.actualizarCards();
  }

  sacarTarjeta(idTravel: number) { // paso 3
    const nuevoVector: Travel[] = [];
    for (const travel of this.travelVisibles) {
      if (idTravel !== travel.id) { // saca el viaje aceptado del viaje
        nuevoVector.push(travel);
      }
    }
    this.mostrarViajes(nuevoVector);
  }
}
