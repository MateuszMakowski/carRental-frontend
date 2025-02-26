import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Vehicle } from '../../core/vehicle.service';
import { AddressDialogComponent } from '../../shared/address-dialog/address-dialog.component';
import { DeleteConfirmationDialogComponent } from './delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { VehiclesStore } from '../../core/vehicles.store';
import { Address } from '../../core/models/address.model';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatIconModule,
  ],
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss'],
})
export class VehicleListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'brand',
    'registrationNumber',
    'vin',
    'clientEmail',
    'clientAddress',
    'isRented',
    'currentPosition',
    'actions',
  ];

  dataSource = new MatTableDataSource<Vehicle>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private vehiclesStore: VehiclesStore, private dialog: MatDialog) {
    effect(() => {
      this.dataSource.data = this.vehiclesStore.vehicles();
    });
  }

  ngOnInit(): void {
    this.vehiclesStore.loadVehicles().subscribe();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  deleteVehicle(id: string): void {
    this.dialog
      .open(DeleteConfirmationDialogComponent, {
        data: { message: 'Czy na pewno chcesz usunąć ten pojazd?' },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.vehiclesStore.removeVehicle(id).subscribe({
            next: () => {
              console.log('Pojazd został usunięty');
            },
            error: (err) => {
              console.error('Błąd usuwania pojazdu', err);
            },
          });
        }
      });
  }

  showAddress(address: Address): void {
    this.dialog.open(AddressDialogComponent, {
      data: address || {},
    });
  }
}
