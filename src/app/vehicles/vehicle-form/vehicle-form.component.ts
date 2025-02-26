import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Vehicle } from '../../core/vehicle.service';
import { AddressComponent } from '../../shared/address/address.component';
import { MatSelectModule } from '@angular/material/select';
import { Brand } from '../../core/brand.service';
import { BrandsStore } from '../../core/brand.store';
import { VehiclesStore } from '../../core/vehicles.store';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    AddressComponent,
  ],
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.scss'],
})
export class VehicleFormComponent implements OnInit {
  vehicleForm: FormGroup;

  errorMessages: string[] = [];
  brands: Brand[] = [];
  brandsErrorMessage: string = '';
  editMode = false;
  vehicleId?: string;

  constructor(
    private fb: FormBuilder,
    private vehiclesStore: VehiclesStore,
    private brandsStore: BrandsStore,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.vehicleForm = this.fb.group({
      brand: ['', Validators.required],
      registrationNumber: ['', [Validators.required, Validators.maxLength(10)]],
      vin: [
        '',
        [
          Validators.required,
          Validators.minLength(17),
          Validators.maxLength(17),
        ],
      ],
      clientEmail: ['', Validators.email],
      clientAddress: this.fb.group({
        street: [''],
        city: [''],
        postalCode: [''],
        country: [''],
      }),
      isRented: [false],
      currentPosition: [{ value: 'Brak danych', disabled: true }],
    });
  }

  ngOnInit(): void {
    this.vehicleId = this.route.snapshot.paramMap.get('id') || undefined;
    if (this.vehicleId) {
      this.editMode = true;

      this.vehiclesStore.getVehicleById(this.vehicleId).subscribe({
        next: (vehicle) => {
          this.vehicleForm.patchValue(vehicle);
        },
        error: (err) => {
          (this.errorMessages[0] = 'Nie udało się załadować danych pojazdu.'),
            err;
        },
      });
    } else {
      this.vehicleForm.get('isRented')?.disable();
    }
    this.loadBrands();
  }

  loadBrands(): void {
    this.brandsStore.loadBrands().subscribe({
      next: (data) => {
        this.brands = data;
        this.brandsErrorMessage = '';
      },
      error: (err) => {
        this.brandsErrorMessage = 'Błąd pobierania listy marek.';
      },
    });
  }

  onSubmit(): void {
    this.errorMessages = [];
    if (this.vehicleForm.invalid) return;

    const vehicle: Vehicle = this.vehicleForm.getRawValue();

    if (this.editMode && this.vehicleId) {
      vehicle._id = this.vehicleId;
      this.vehiclesStore.updateVehicle(vehicle).subscribe({
        next: (updated) => this.router.navigate(['/vehicles']),
        error: (err) => {
          if (err.error && err.error.errors) {
            this.errorMessages = err.error.errors.map((e: any) => e.msg);
          } else {
            this.errorMessages = [
              err.message || 'Błąd podczas aktualizacji pojazdu.',
            ];
          }
        },
      });
    } else {
      this.vehiclesStore.addVehicle(vehicle).subscribe({
        next: (added) => this.router.navigate(['/vehicles']),
        error: (err) => {
          if (err.error && err.error.errors) {
            this.errorMessages = err.error.errors.map((e: any) => e.msg);
          } else {
            this.errorMessages = [
              err.message || 'Błąd podczas dodawania pojazdu.',
            ];
          }
        },
      });
    }
  }

  get clientAddressGroup(): FormGroup {
    return this.vehicleForm.get('clientAddress') as FormGroup;
  }
}
