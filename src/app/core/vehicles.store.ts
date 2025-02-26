import { Injectable, signal } from '@angular/core';
import { VehicleService } from './vehicle.service';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Vehicle } from './models/vehicle.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VehiclesStore {
  vehicles = signal<Vehicle[]>([]);

  private apiUrl = `${environment.apiUrl}/vehicles`;

  constructor(
    private http: HttpClient,
    private vehicleService: VehicleService
  ) {}

  loadVehicles(forceReload: boolean = false): Observable<Vehicle[]> {
    if (!forceReload && this.vehicles().length > 0) {
      return of(this.vehicles());
    }
    return this.http.get<Vehicle[]>(this.apiUrl).pipe(
      tap((data) => {
        this.vehicles.set(data);
      })
    );
  }

  public getVehicleById(vehicleId: string): Observable<Vehicle> {
    const foundVehicle = this.vehicles().find(
      (vehicle) => vehicle._id === vehicleId
    );
    if (foundVehicle) {
      return of(foundVehicle);
    } else {
      return this.http.get<Vehicle>(`${this.apiUrl}/${vehicleId}`).pipe(
        tap((vehicle) => {
          this.addVehicle(vehicle);
        })
      );
    }
  }

  addVehicle(newVehicle: Vehicle): Observable<Vehicle> {
    return this.vehicleService.addVehicle(newVehicle).pipe(
      tap((vehicleFromBackend) => {
        this.vehicles.update((current) => [...current, vehicleFromBackend]);
      })
    );
  }

  updateVehicle(updatedVehicle: Vehicle): Observable<Vehicle> {
    return this.vehicleService.updateVehicle(updatedVehicle).pipe(
      tap((vehicleFromBackend) => {
        this.vehicles.update((current) =>
          current.map((vehicle) =>
            vehicle._id === vehicleFromBackend._id
              ? vehicleFromBackend
              : vehicle
          )
        );
      })
    );
  }

  removeVehicle(vehicleId: string): Observable<any> {
    return this.vehicleService.deleteVehicle(vehicleId).pipe(
      tap(() => {
        this.vehicles.update((current) =>
          current.filter((vehicle) => vehicle._id !== vehicleId)
        );
      })
    );
  }
}
