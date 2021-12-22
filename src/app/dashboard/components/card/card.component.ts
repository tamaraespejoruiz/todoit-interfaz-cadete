import { Component, OnInit } from '@angular/core';
import { StatusTravelService } from '../../services/status-travel.service';
import Swal  from 'sweetalert2';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.sass']
})
export class CardComponent implements OnInit {

  // Atributos
  direccion = '{{direccion}}';
  hora = '{{hora}}';
  marcaModeloEquipo = '{{marcaModeloEquipo}}';
  estadoDelViaje!:number;
  idViaje!:number;

  // otro atributo para callback
  // "variable que guarda una funcion"

  sacarTarjeta: (idViaje: number) => void = () => {}; 
  
  constructor(private statusTravelService: StatusTravelService) { }

  ngOnInit(): void { }

  obtenerNombreStatusTravel(statusTravel: number ): string {
    switch (statusTravel) {
      case 1: return "Pendiente a retirar";
      case 2: return "Retiro asignado";
      case 3: return "Retirado";
      case 4: return "Pendiente de reparación";
      case 5: return "Reparado";
      case 6: return "Entrega asignada";
      case 7: return "Pendiente de entrega";
      case 8: return "Entregado";
      case 9: return "Recibido";
      case 10: return "Renunciado";
    }
    return "";
  }
  
  aceptarViaje() {
      this.statusTravelService.aceptarViaje(this.idViaje, this.estadoDelViaje).subscribe(resp=> {
      this.sacarTarjeta(this.idViaje);
      }, error => {
        Swal.fire ({
          icon: 'error',
          title: 'Oops...',
          text: 'Solo puedes aceptar máximo de 3 viajes simultáneamente.'
        })
      }
      );   
  }

  marcarComoEntregado() { //3 a 4 o 7 a 8
    this.statusTravelService.aceptarViaje(this.idViaje, this.estadoDelViaje).subscribe(resp=> {
    this.sacarTarjeta(this.idViaje);
    }, error => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No se puede entregar el viaje'
      })
    });   
  }
  
  retirado() { // 2 a 3 o 6 a 7
    this.statusTravelService.aceptarViaje(this.idViaje, this.estadoDelViaje).subscribe(resp=> {
      this.sacarTarjeta(this.idViaje);
      }, error => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No se puede retirar el viaje'
        })
    });  
  }

  cancelarViaje() { 
    Swal.fire({
    title: '¿Estas seguro de cancelar el envio?',
    text: "Se perderá toda la información de la card!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, quiero eliminarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.statusTravelService.cancelarViaje(this.idViaje, this.estadoDelViaje).subscribe( resp => { 
          this.sacarTarjeta(this.idViaje);
          Swal.fire(
            'Eliminado!',
            'Su tarjeta ha sido eliminada.',
            'success'
          )
        });
      }
    });
  }

  // Aparecen los diferentes botones en las cards correspondiente al estado del viaje
  viajeEsAceptable(): boolean {
    if (this.estadoDelViaje == 1 || this.estadoDelViaje == 5)
      return true;
    return false;
  }

  viajeEsEntregable(): boolean {
    if (this.estadoDelViaje == 3 || this.estadoDelViaje == 7)
      return true;
    return false;
  }

  viajeEsCancelable(): boolean {
    if (this.estadoDelViaje == 2 || this.estadoDelViaje == 6) 
      return true;
    return false;
  }
  // Igual a es cancelado
  viajeEsIniciable(): boolean {
    if (this.estadoDelViaje == 2 || this.estadoDelViaje == 6) 
      return true;
    return false;
  }


}
