import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Travel } from '../models/travel';
import { forkJoin, Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})

export class StatusTravelService {

    constructor(private http: HttpClient) { }
    
    verEstadoViaje() {
        return this.http.get<Travel[]>(`api/Equipment?clientId=${localStorage.getItem('idUsuario')}`);
    }

    getViajesPorEstados(statusTravels: number[]) :Observable<Travel[][]> {
        const solicitudes = [];
        for (const statusTravel of statusTravels) {
            solicitudes.push(this.http.get<Travel[]>(`api/Travel/2/${statusTravel}`));
        }
        return forkJoin(solicitudes);
    }

    getViajesDisponibles(): Observable<Travel[][]> {
        return this.getViajesPorEstados([1, 5]);
    }

    getViajesEnCurso(): Observable<Travel[][]> {
        return this.getViajesPorEstados([2, 3, 6, 7]);
    }

    getViajesFinalizados(): Observable<Travel[][]> {
        return this.getViajesPorEstados([4, 8, 9]);
    }


    // Aceptar viaje
    aceptarViaje(idViaje: number, estadoDelViaje: number): Observable<Travel> {
        return this.postTravel(idViaje, estadoDelViaje + 1, 2, false);
    }
    postTravel(travelId: number, statusTravel: number, userOperation: number, isReasigned: boolean): Observable<Travel> {
        return this.http.post<Travel>(`/api/Travel?travelId=${travelId}&statusTravel=${statusTravel}&userOperation=${userOperation}&cadeteId=${localStorage.getItem('idUsuario')}&isReasigned=${isReasigned}`, 
        [travelId, statusTravel, userOperation, isReasigned])
    }

    // Cancelar viaje 
    cancelarViaje(idViaje: number, estadoDelViaje: number): Observable<Travel> {
        return this.deleteTravel(idViaje, estadoDelViaje - 1, 2, true, "cancelado");
    }
    deleteTravel(travelId: number, statusTravel: number, userOperation: number, isReasigned: boolean, cancelado: string): Observable<Travel> {
        return this.http.post<Travel>(`/api/Travel?travelId=${travelId}&statusTravel=${statusTravel}&userOperation=${userOperation}&cadeteId=${localStorage.getItem('idUsuario')}&isReasigned=${isReasigned}&observation=${cancelado}`, 
        [travelId, statusTravel, userOperation, isReasigned, cancelado]);
    }

}